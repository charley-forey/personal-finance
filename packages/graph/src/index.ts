import { and, eq, or } from 'drizzle-orm';
import type { Database } from '@pf/database';
import {
  entityLinks,
  budgets,
  financialGoals,
  insights,
  recommendationItems,
  scenarios,
  transactions,
  categories,
  automationRules,
} from '@pf/database';
import type { GraphContext, GraphEntityType, GraphLinkType, GraphNeighbor, GraphNode } from './types';
import { ENTITY_ROUTES, ROUTE_ENTITY_MAP } from './types';

export * from './types';

function nodeRoute(type: GraphEntityType, id: string): string | undefined {
  const base = ENTITY_ROUTES[type];
  if (!base) return undefined;
  if (type === 'transaction') return `${base}?highlight=${id}`;
  return base;
}

function toNeighbor(
  node: GraphNode,
  linkType: GraphLinkType,
  weight: number,
  direction: 'outgoing' | 'incoming',
  metadata?: Record<string, unknown>,
): GraphNeighbor {
  return {
    node,
    edge: { linkType, weight, metadata },
    direction,
  };
}

export async function getEntityNeighbors(
  db: Database,
  orgId: string,
  entityType: GraphEntityType,
  entityId: string,
): Promise<GraphNeighbor[]> {
  const stored = await db
    .select()
    .from(entityLinks)
    .where(
      and(
        eq(entityLinks.orgId, orgId),
        or(
          and(eq(entityLinks.sourceType, entityType), eq(entityLinks.sourceId, entityId)),
          and(eq(entityLinks.targetType, entityType), eq(entityLinks.targetId, entityId)),
        ),
      ),
    );

  const neighbors: GraphNeighbor[] = [];

  for (const link of stored) {
    const isOutgoing = link.sourceType === entityType && link.sourceId === entityId;
    const targetType = (isOutgoing ? link.targetType : link.sourceType) as GraphEntityType;
    const targetId = isOutgoing ? link.targetId : link.sourceId;
    neighbors.push(
      toNeighbor(
        {
          type: targetType,
          id: targetId,
          label: `${targetType}:${targetId.slice(0, 8)}`,
          route: nodeRoute(targetType, targetId),
          metadata: (link.metadataJson as Record<string, unknown>) ?? {},
        },
        link.linkType as GraphLinkType,
        link.weight ? parseFloat(link.weight) : 1,
        isOutgoing ? 'outgoing' : 'incoming',
        (link.metadataJson as Record<string, unknown>) ?? {},
      ),
    );
  }

  if (entityType === 'transaction') {
    const [txn] = await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.orgId, orgId), eq(transactions.id, entityId)))
      .limit(1);

    if (txn?.categoryId) {
      const [cat] = await db.select().from(categories).where(eq(categories.id, txn.categoryId)).limit(1);
      if (cat) {
        neighbors.push(
          toNeighbor(
            { type: 'category', id: cat.id, label: cat.name, route: '/app/transactions' },
            'derived_from',
            1,
            'outgoing',
          ),
        );
      }

      const orgBudgets = await db.select().from(budgets).where(eq(budgets.orgId, orgId));
      const match = orgBudgets.find((b) => b.categoryId === txn.categoryId);
      if (match) {
        neighbors.push(
          toNeighbor(
            { type: 'budget', id: match.id, label: 'Budget', route: '/app/budgets' },
            'impacts',
            0.9,
            'outgoing',
          ),
        );
      }
    }

    const relatedInsights = await db.select().from(insights).where(eq(insights.orgId, orgId)).limit(20);
    for (const insight of relatedInsights) {
      const data = insight.dataJson as Record<string, unknown> | null;
      if (data?.transactionId === entityId) {
        neighbors.push(
          toNeighbor(
            { type: 'insight', id: insight.id, label: insight.title, route: '/app/insights' },
            'explains',
            0.8,
            'incoming',
          ),
        );
      }
    }
  }

  if (entityType === 'goal') {
    const orgScenarios = await db.select().from(scenarios).where(eq(scenarios.orgId, orgId)).limit(5);
    for (const scenario of orgScenarios) {
      neighbors.push(
        toNeighbor(
          { type: 'scenario', id: scenario.id, label: scenario.name, route: '/app/scenarios' },
          'suggests',
          0.7,
          'incoming',
        ),
      );
    }
  }

  if (entityType === 'budget') {
    const [budget] = await db
      .select()
      .from(budgets)
      .where(and(eq(budgets.orgId, orgId), eq(budgets.id, entityId)))
      .limit(1);
    if (budget?.categoryId) {
      neighbors.push(
        toNeighbor(
          { type: 'category', id: budget.categoryId, label: 'Category', route: '/app/transactions' },
          'funds',
          1,
          'outgoing',
        ),
      );
    }
  }

  return neighbors;
}

export async function getGraphContextForRoute(db: Database, orgId: string, route: string): Promise<GraphContext> {
  const normalized = route.split('?')[0] ?? route;
  const mapping = ROUTE_ENTITY_MAP[normalized];
  const focusNodes: GraphNode[] = [];

  if (mapping) {
    focusNodes.push({ type: mapping.type, id: 'page', label: mapping.label, route: normalized });
  }

  const suggestedLinks: GraphNeighbor[] = [];

  if (normalized === '/app/budgets' || normalized === '/app/transactions') {
    const orgBudgets = await db.select().from(budgets).where(eq(budgets.orgId, orgId)).limit(3);
    for (const b of orgBudgets) {
      suggestedLinks.push(
        toNeighbor(
          { type: 'budget', id: b.id, label: 'Budget', route: '/app/budgets' },
          'impacts',
          1,
          'outgoing',
        ),
      );
    }
  }

  if (normalized === '/app/goals' || normalized === '/app') {
    const goals = await db.select().from(financialGoals).where(eq(financialGoals.orgId, orgId)).limit(3);
    for (const g of goals) {
      suggestedLinks.push(
        toNeighbor(
          { type: 'goal', id: g.id, label: g.name, route: '/app/goals' },
          'suggests',
          1,
          'outgoing',
        ),
      );
    }
  }

  if (normalized === '/app/insights' || normalized === '/app') {
    const recs = await db
      .select()
      .from(recommendationItems)
      .where(eq(recommendationItems.orgId, orgId))
      .limit(3);
    for (const r of recs) {
      suggestedLinks.push(
        toNeighbor(
          { type: 'recommendation', id: r.id, label: r.title, route: '/app/insights' },
          'suggests',
          r.priorityScore ? parseFloat(r.priorityScore) : 1,
          'outgoing',
        ),
      );
    }
  }

  if (normalized === '/app/rules') {
    const rules = await db.select().from(automationRules).where(eq(automationRules.orgId, orgId)).limit(3);
    for (const rule of rules) {
      suggestedLinks.push(
        toNeighbor(
          { type: 'rule', id: rule.id, label: rule.name ?? 'Rule', route: '/app/rules' },
          'suggests',
          1,
          'outgoing',
        ),
      );
    }
  }

  const recentInsights = await db.select().from(insights).where(eq(insights.orgId, orgId)).limit(2);
  for (const insight of recentInsights) {
    suggestedLinks.push(
      toNeighbor(
        { type: 'insight', id: insight.id, label: insight.title, route: '/app/insights' },
        'explains',
        0.8,
        'incoming',
      ),
    );
  }

  return { route: normalized, focusNodes, suggestedLinks };
}

export async function upsertEntityLink(
  db: Database,
  orgId: string,
  input: {
    sourceType: GraphEntityType;
    sourceId: string;
    targetType: GraphEntityType;
    targetId: string;
    linkType: GraphLinkType;
    weight?: number;
    metadata?: Record<string, unknown>;
  },
) {
  const [row] = await db
    .insert(entityLinks)
    .values({
      orgId,
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      targetType: input.targetType,
      targetId: input.targetId,
      linkType: input.linkType,
      weight: String(input.weight ?? 1),
      metadataJson: input.metadata ?? {},
    })
    .returning();
  return row;
}
