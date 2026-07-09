import type { Database } from '@pf/database';
import { categorizationCorrections, categories, categoryRules } from '@pf/database';
import { eq, desc } from 'drizzle-orm';

export interface CategoryConfidence {
  categoryId: string;
  categoryName: string;
  confidence: number;
  source: 'rule' | 'history' | 'default';
}

export async function computeCategoryConfidence(
  db: Database,
  orgId: string,
  merchantName?: string | null,
): Promise<CategoryConfidence | null> {
  if (!merchantName) return null;

  const corrections = await db
    .select()
    .from(categorizationCorrections)
    .where(eq(categorizationCorrections.orgId, orgId))
    .orderBy(desc(categorizationCorrections.createdAt))
    .limit(100);

  const match = corrections.find((c) => c.merchantName?.toLowerCase() === merchantName.toLowerCase());
  if (match?.newCategoryId) {
    const [cat] = await db.select().from(categories).where(eq(categories.id, match.newCategoryId)).limit(1);
    if (cat) {
      return { categoryId: cat.id, categoryName: cat.name, confidence: 0.92, source: 'history' };
    }
  }

  const rules = await db.select().from(categoryRules).where(eq(categoryRules.orgId, orgId));
  const rule = rules.find((r) => merchantName.toLowerCase().includes(r.pattern.toLowerCase()));
  if (rule?.categoryId) {
    const [cat] = await db.select().from(categories).where(eq(categories.id, rule.categoryId)).limit(1);
    if (cat) {
      return { categoryId: cat.id, categoryName: cat.name, confidence: 0.85, source: 'rule' };
    }
  }

  return null;
}

export interface FeatureStoreSnapshot {
  orgId: string;
  merchantCount: number;
  spendVelocity: number;
  goalProximity: number;
  computedAt: string;
}

export async function computeFeatureStore(db: Database, orgId: string): Promise<FeatureStoreSnapshot> {
  const corrections = await db
    .select()
    .from(categorizationCorrections)
    .where(eq(categorizationCorrections.orgId, orgId))
    .limit(500);

  const merchants = new Set(corrections.map((c) => c.merchantName).filter(Boolean));

  return {
    orgId,
    merchantCount: merchants.size,
    spendVelocity: corrections.length,
    goalProximity: 0.5,
    computedAt: new Date().toISOString(),
  };
}

export interface ProactiveTrigger {
  agentType: string;
  message: string;
  route: string;
  priority: number;
}

export function detectProactiveTriggers(features: FeatureStoreSnapshot): ProactiveTrigger[] {
  const triggers: ProactiveTrigger[] = [];
  if (features.spendVelocity > 20) {
    triggers.push({
      agentType: 'budget_coach',
      message: 'Unusual categorization activity detected — Budget Coach can help review patterns.',
      route: '/app/inbox',
      priority: 0.8,
    });
  }
  return triggers;
}

export interface EvalScenario {
  id: string;
  page: string;
  prompt: string;
  mustIncludeNumbers: boolean;
}

export const PAGE_EVAL_SCENARIOS: EvalScenario[] = [
  { id: 'dashboard-context', page: '/app', prompt: 'headline', mustIncludeNumbers: false },
  { id: 'budgets-context', page: '/app/budgets', prompt: 'budget', mustIncludeNumbers: true },
];

export function runEvalHarness(output: string, scenario: EvalScenario): number {
  let score = 0.5;
  if (output.toLowerCase().includes(scenario.prompt)) score += 0.3;
  if (scenario.mustIncludeNumbers && /\d/.test(output)) score += 0.2;
  else if (!scenario.mustIncludeNumbers) score += 0.2;
  return Math.min(1, score);
}
