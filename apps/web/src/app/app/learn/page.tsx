'use client';

import Link from 'next/link';
import { PageHeader, Card } from '@/components/app-shell';

const ARTICLES = [
  { href: '/app/learn/taxes', title: 'End of Year Tax Checklist', domain: 'Taxes' },
  { href: '/app/learn/retirement', title: 'Retirement Planning Basics', domain: 'Retirement' },
  { href: '/app/learn/investing', title: 'Asset Allocation Guide', domain: 'Investing' },
];

export default function LearnPage() {
  return (
    <div>
      <PageHeader title="Learn" description="Knowledge base with personalized financial guidance" />
      <div className="grid grid-cols-3 gap-4">
        {ARTICLES.map((a) => (
          <Link key={a.href} href={a.href}>
            <Card>
              <span className="text-xs text-primary">{a.domain}</span>
              <p className="font-medium mt-2">{a.title}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
