import postgres from 'postgres';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../../../.env') });

const url = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5433/personal_finance';
const sql = postgres(url);

try {
  const migrations = await sql`SELECT id, hash, created_at FROM drizzle.__drizzle_migrations ORDER BY id`;
  console.log('Applied migrations:', migrations);

  const tables = await sql`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename IN ('organizations', 'financial_profiles', 'agent_conversations')
    ORDER BY tablename
  `;
  console.log('Key tables:', tables.map((t) => t.tablename));

  const learning = await sql`
    SELECT EXISTS (
      SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'financial_profiles'
    ) AS has_learning
  `;
  console.log('Learning tables exist:', learning[0]?.has_learning);
} finally {
  await sql.end();
}
