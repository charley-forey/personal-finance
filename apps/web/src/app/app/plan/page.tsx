'use client';

import { HubLayout } from '@/components/hub-layout';
import { PageContextBanner } from '@/components/page-context-banner';

const LINKS = [
  { href: '/app/budgets', label: 'Budgets', description: 'Category spending limits' },
  { href: '/app/pnl', label: 'P&L', description: 'Profit and loss grid' },
  { href: '/app/goals', label: 'Goals', description: 'Financial targets' },
  { href: '/app/rules', label: 'Rules', description: 'Automation triggers' },
];

export default function PlanHubPage() {
  return (
    <div className="space-y-6">
      <PageContextBanner />
      <HubLayout title="Plan & Control" description="Am I on track?" hubId="plan" links={LINKS}>
        <p className="text-sm text-muted-foreground">
          Set budgets, track P&amp;L, define goals, and automate alerts when something needs attention.
        </p>
      </HubLayout>
    </div>
  );
}
