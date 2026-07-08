'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { PageHeader, Card } from '@/components/app-shell';
import { PageLoading } from '@/components/page-states';
import { EmptyState } from '@/components/ui';
import { api } from '@/lib/api';

const CONTENT: Record<string, { title: string; body: string; domain?: string }> = {
  taxes: {
    title: 'End of Year Tax Checklist',
    domain: 'Taxes',
    body: `Review your W-2s and 1099s, maximize retirement contributions before year-end, harvest tax losses in taxable accounts, and estimate Q4 estimated taxes if self-employed. Consider HSA and 401(k) contribution limits for the current tax year.`,
  },
  retirement: {
    title: 'Retirement Planning Basics',
    domain: 'Retirement',
    body: `Start with your target retirement age and estimated annual expenses. Use the 4% rule as a starting point for safe withdrawal rates. Maximize employer 401(k) match first, then IRA contributions. Consider Roth vs Traditional based on current vs expected future tax brackets.`,
  },
  investing: {
    title: 'Asset Allocation Guide',
    domain: 'Investing',
    body: `A common starting allocation subtracts your age from 110 to get your stock percentage. Diversify across US, international, and bonds. Rebalance annually or when allocation drifts more than 5% from targets. Low-cost index funds minimize fees over decades.`,
  },
};

export default function LearnArticlePage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const article = CONTENT[slug];

  const [related, setRelated] = useState<Array<{ content: string; score: number }>>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    if (!article) return;

    let cancelled = false;
    setLoadingRelated(true);
    api
      .knowledgeSearch(article.title, article.domain?.toLowerCase())
      .then((r) => {
        if (!cancelled) setRelated(r.results.slice(0, 4));
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoadingRelated(false);
      });

    return () => {
      cancelled = true;
    };
  }, [article]);

  if (!article) {
    return (
      <div>
        <PageHeader title="Article Not Found" />
        <EmptyState
          icon={BookOpen}
          title="Article not found"
          description="This article may have been moved or removed."
          action={
            <Link href="/app/learn" className="text-sm text-primary hover:underline">
              ← Back to Learn
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link href="/app/learn" className="text-sm text-primary mb-4 inline-block hover:underline">
        ← Back to Learn
      </Link>
      <PageHeader title={article.title} />
      <Card>
        <p className="text-muted leading-relaxed">{article.body}</p>
      </Card>

      <section className="mt-8">
        <h2 className="mb-4 text-sm font-medium text-muted uppercase tracking-wide">
          Related knowledge
        </h2>
        {loadingRelated && <PageLoading variant="list" count={2} />}
        {!loadingRelated && related.length === 0 && (
          <p className="text-sm text-muted">No related articles found.</p>
        )}
        {!loadingRelated && related.length > 0 && (
          <div className="space-y-3">
            {related.map((r, i) => (
              <Card key={i}>
                <p className="text-sm text-muted leading-relaxed">{r.content}</p>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
