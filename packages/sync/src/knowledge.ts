import { readFileSync, readdirSync, existsSync } from 'fs';

import { join } from 'path';

import { eq, sql } from 'drizzle-orm';

import type { Database } from '@pf/database';

import { knowledgeDocuments, knowledgeChunks } from '@pf/database';

import { chunkText, cosineSimilarity } from '@pf/ai';



let pgvectorAvailable: boolean | null = null;



async function checkPgvectorColumn(db: Database): Promise<boolean> {

  if (pgvectorAvailable !== null) return pgvectorAvailable;

  try {

    const result = await db.execute(sql`

      SELECT udt_name

      FROM information_schema.columns

      WHERE table_schema = 'public'

        AND table_name = 'knowledge_chunks'

        AND column_name = 'embedding'

    `);

    const rows = result as unknown as Array<{ udt_name: string }>;

    pgvectorAvailable = rows[0]?.udt_name === 'vector';

  } catch {

    pgvectorAvailable = false;

  }

  return pgvectorAvailable;

}



function keywordScore(query: string, content: string): number {

  const terms = query

    .toLowerCase()

    .split(/\s+/)

    .filter((t) => t.length > 2);

  if (terms.length === 0) return 0;



  const lower = content.toLowerCase();

  let hits = 0;

  for (const term of terms) {

    if (lower.includes(term)) hits++;

  }

  return hits / terms.length;

}



export async function ingestKnowledgeBase(db: Database, contentDir: string, embedFn?: (text: string) => Promise<number[]>) {

  if (!existsSync(contentDir)) return { ingested: 0 };



  let ingested = 0;

  const domains = readdirSync(contentDir, { withFileTypes: true }).filter((d) => d.isDirectory());



  for (const domainDir of domains) {

    const domainPath = join(contentDir, domainDir.name);

    const files = readdirSync(domainPath).filter((f) => f.endsWith('.md'));



    for (const file of files) {

      const content = readFileSync(join(domainPath, file), 'utf-8');

      const title = file.replace('.md', '').replace(/-/g, ' ');



      const [existing] = await db

        .select()

        .from(knowledgeDocuments)

        .where(eq(knowledgeDocuments.title, title))

        .limit(1);



      let docId: string;

      if (existing) {

        docId = existing.id;

      } else {

        const [doc] = await db

          .insert(knowledgeDocuments)

          .values({

            scope: 'global',

            domain: domainDir.name,

            title,

            contentMd: content,

          })

          .returning();

        docId = doc!.id;

      }



      const chunks = chunkText(content);

      for (let i = 0; i < chunks.length; i++) {

        const chunk = chunks[i]!;

        let embedding: string | undefined;

        if (embedFn) {

          const vec = await embedFn(chunk);

          embedding = JSON.stringify(vec);

        }



        await db.insert(knowledgeChunks).values({

          documentId: docId,

          chunkIndex: i,

          content: chunk,

          embedding,

          metadataJson: { domain: domainDir.name, title },

        });

      }

      ingested++;

    }

  }



  return { ingested };

}



async function searchWithPgvector(

  db: Database,

  queryVec: number[],

  docIds: Set<string>,

  limit: number,

) {

  const vecStr = `[${queryVec.join(',')}]`;

  const result = await db.execute(sql`

    SELECT kc.content, kc.metadata_json, 1 - (kc.embedding <=> ${vecStr}::vector) AS score

    FROM knowledge_chunks kc

    WHERE kc.document_id = ANY(${Array.from(docIds)}::uuid[])

      AND kc.embedding IS NOT NULL

    ORDER BY kc.embedding <=> ${vecStr}::vector

    LIMIT ${limit}

  `);



  const rows = result as unknown as Array<{ content: string; metadata_json: Record<string, unknown>; score: number }>;
  return rows.map(

    (row) => ({

      content: row.content,

      score: Number(row.score),

      metadata: row.metadata_json,

    }),

  );

}



export async function searchKnowledge(

  db: Database,

  query: string,

  domain?: string,

  embedFn?: (text: string) => Promise<number[]>,

  limit = 5,

) {

  const docs = await db.select().from(knowledgeDocuments);

  const filteredDocs = domain ? docs.filter((d) => d.domain === domain) : docs;

  const docIds = new Set(filteredDocs.map((d) => d.id));



  if (docIds.size === 0) return [];



  if (embedFn && query.trim()) {

    const queryVec = await embedFn(query);



    if (await checkPgvectorColumn(db)) {

      try {

        const pgResults = await searchWithPgvector(db, queryVec, docIds, limit);

        if (pgResults.length > 0) return pgResults;

      } catch {

        pgvectorAvailable = false;

      }

    }



    const allChunks = await db.select().from(knowledgeChunks);

    const chunks = allChunks.filter((c) => docIds.has(c.documentId));



    const scored = chunks

      .map((c) => {

        let embedScore = 0;

        if (c.embedding) {

          try {

            const vec = JSON.parse(c.embedding) as number[];

            embedScore = cosineSimilarity(queryVec, vec);

          } catch {

            embedScore = 0;

          }

        }

        const kwScore = keywordScore(query, c.content);

        const score = embedScore * 0.7 + kwScore * 0.3;

        return { chunk: c, score };

      })

      .filter((s) => s.score > 0.15)

      .sort((a, b) => b.score - a.score)

      .slice(0, limit);



    return scored.map((s) => ({

      content: s.chunk.content,

      score: s.score,

      metadata: s.chunk.metadataJson,

    }));

  }



  const q = query.toLowerCase();

  const allChunks = await db.select().from(knowledgeChunks);

  const chunks = allChunks.filter((c) => docIds.has(c.documentId));



  return chunks

    .map((c) => ({ chunk: c, score: keywordScore(query, c.content) }))

    .filter((s) => s.score > 0 || s.chunk.content.toLowerCase().includes(q))

    .sort((a, b) => b.score - a.score)

    .slice(0, limit)

    .map((s) => ({ content: s.chunk.content, score: Math.max(s.score, 0.5), metadata: s.chunk.metadataJson }));

}


