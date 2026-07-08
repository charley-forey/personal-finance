'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Search } from 'lucide-react';
import { PageHeader, Card } from '@/components/app-shell';
import { PageLoading } from '@/components/page-states';
import { Button, EmptyState, Input } from '@/components/ui';
import { api } from '@/lib/api';

const ARTICLES = [
  { href: '/app/learn/taxes', title: 'End of Year Tax Checklist', domain: 'Taxes' },
  { href: '/app/learn/retirement', title: 'Retirement Planning Basics', domain: 'Retirement' },
  { href: '/app/learn/investing', title: 'Asset Allocation Guide', domain: 'Investing' },
];

export default function LearnPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<Array<{ content: string; score: number }>>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setSearched(false);
      return;
    }

    let cancelled = false;
    setSearching(true);
    api
      .knowledgeSearch(debouncedQuery)
      .then((r) => {
        if (!cancelled) {
          setResults(r.results);
          setSearched(true);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setSearching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const showArticles = !debouncedQuery;

  return (
    <div>
      <PageHeader title="Learn" description="Knowledge base with personalized financial guidance" />

      <div className="mb-8 max-w-xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            type="search"
            placeholder="Search knowledge base…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {searching && <p className="mt-2 text-xs text-muted">Searching…</p>}
      </div>

      {searching && <PageLoading variant="list" count={3} className="mb-6" />}

      {!showArticles && !searching && searched && results.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="No results found"
          description={`Nothing matched "${debouncedQuery}". Try different keywords or browse articles below.`}
          action={
            <Button variant="secondary" size="sm" onClick={() => setQuery('')}>
              Clear search
            </Button>
          }
          className="mb-8"
        />
      )}

      {!showArticles && !searching && results.length > 0 && (
        <section className="mb-8 space-y-3">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wide">
            Search results ({results.length})
          </h2>
          {results.map((r, i) => (
            <Card key={i}>
              <p className="text-sm text-muted leading-relaxed">{r.content}</p>
              <p className="mt-2 text-xs text-muted">Relevance: {(r.score * 100).toFixed(0)}%</p>
            </Card>
          ))}
        </section>
      )}

      <section>
        <h2 className="mb-4 text-sm font-medium text-muted uppercase tracking-wide">
          {showArticles ? 'Featured articles' : 'Browse articles'}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((a) => (
            <Link key={a.href} href={a.href}>
              <Card className="h-full transition-colors hover:bg-white/5">
                <span className="text-xs text-primary">{a.domain}</span>
                <p className="font-medium mt-2">{a.title}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
