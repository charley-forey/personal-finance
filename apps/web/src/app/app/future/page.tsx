'use client';

import { HubLayout } from '@/components/hub-layout';
import { PageContextBanner } from '@/components/page-context-banner';

const LINKS = [
  { href: '/app/retirement', label: 'Retirement', description: 'Monte Carlo planning' },
  { href: '/app/fire', label: 'FIRE', description: 'Financial independence' },
  { href: '/app/debt', label: 'Debt', description: 'Payoff simulator' },
  { href: '/app/credit', label: 'Credit', description: 'Utilization and APR' },
  { href: '/app/taxes', label: 'Taxes', description: 'Tax profile and estimates' },
  { href: '/app/life-plans', label: 'Life Plans', description: 'Major life events' },
  { href: '/app/scenarios', label: 'Scenarios', description: 'What-if studio' },
];

export default function FutureHubPage() {
  return (
    <div className="space-y-6">
      <PageContextBanner />
      <HubLayout title="Future" description="Where am I headed?" hubId="future" links={LINKS}>
        <p className="text-sm text-muted-foreground">
          Model retirement, debt freedom, tax outcomes, and life milestones in one place.
        </p>
      </HubLayout>
    </div>
  );
}
