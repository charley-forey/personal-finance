import Link from 'next/link';
import { PageHeader, Card } from '@/components/app-shell';

const CONTENT: Record<string, { title: string; body: string }> = {
  taxes: {
    title: 'End of Year Tax Checklist',
    body: `Review your W-2s and 1099s, maximize retirement contributions before year-end, harvest tax losses in taxable accounts, and estimate Q4 estimated taxes if self-employed. Consider HSA and 401(k) contribution limits for the current tax year.`,
  },
  retirement: {
    title: 'Retirement Planning Basics',
    body: `Start with your target retirement age and estimated annual expenses. Use the 4% rule as a starting point for safe withdrawal rates. Maximize employer 401(k) match first, then IRA contributions. Consider Roth vs Traditional based on current vs expected future tax brackets.`,
  },
  investing: {
    title: 'Asset Allocation Guide',
    body: `A common starting allocation subtracts your age from 110 to get your stock percentage. Diversify across US, international, and bonds. Rebalance annually or when allocation drifts more than 5% from targets. Low-cost index funds minimize fees over decades.`,
  },
};

export default async function LearnArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = CONTENT[slug];

  if (!article) {
    return (
      <div>
        <PageHeader title="Article Not Found" />
        <Link href="/app/learn" className="text-primary">← Back to Learn</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link href="/app/learn" className="text-sm text-primary mb-4 inline-block">← Back to Learn</Link>
      <PageHeader title={article.title} />
      <Card>
        <p className="text-muted leading-relaxed">{article.body}</p>
      </Card>
    </div>
  );
}
