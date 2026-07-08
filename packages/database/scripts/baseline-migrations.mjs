/**
 * Baseline drizzle migrations when schema was created via db:push.
 * Marks 0000 and 0001 as applied so only new migrations (e.g. 0002) run.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import postgres from 'postgres';
import { config } from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
config({ path: path.resolve(root, '../../.env') });

const migrationsFolder = path.resolve(__dirname, '../drizzle');
const journal = JSON.parse(
  fs.readFileSync(path.join(migrationsFolder, 'meta/_journal.json'), 'utf8'),
);

function migrationHash(tag) {
  const query = fs.readFileSync(path.join(migrationsFolder, `${tag}.sql`), 'utf8');
  return crypto.createHash('sha256').update(query).digest('hex');
}

const url = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5433/personal_finance';
const sql = postgres(url);

try {
  const [{ exists: hasOrgs }] = await sql`
    SELECT EXISTS (
      SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'organizations'
    ) AS exists
  `;

  if (!hasOrgs) {
    console.log('No existing schema detected — run npm run db:migrate normally.');
    process.exit(0);
  }

  const applied = await sql`SELECT hash FROM drizzle.__drizzle_migrations`;
  const appliedHashes = new Set(applied.map((r) => r.hash));

  // Baseline all migrations except the last one if learning tables are missing
  const [{ exists: hasLearning }] = await sql`
    SELECT EXISTS (
      SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'financial_profiles'
    ) AS exists
  `;

  const entriesToBaseline = hasLearning
    ? journal.entries
    : journal.entries.slice(0, -1); // skip 0002 if learning tables absent

  let inserted = 0;
  for (const entry of entriesToBaseline) {
    const hash = migrationHash(entry.tag);
    if (appliedHashes.has(hash)) continue;

    await sql`
      INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
      VALUES (${hash}, ${entry.when})
    `;
    console.log(`Baselined: ${entry.tag}`);
    inserted++;
  }

  if (inserted === 0) {
    console.log('Nothing to baseline — migrations already recorded.');
  } else {
    console.log(`Baselined ${inserted} migration(s). Run npm run db:migrate next.`);
  }
} finally {
  await sql.end();
}
