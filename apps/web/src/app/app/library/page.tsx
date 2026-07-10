'use client';

import Link from 'next/link';
import { BookOpen, FileText } from 'lucide-react';
import { HubLayout } from '@/components/hub-layout';
import { PageContextBanner } from '@/components/page-context-banner';
import { PageError, PageLoading } from '@/components/page-states';
import { Button, StatCard } from '@/components/ui';
import { useDocuments, useJourneyProgress } from '@/hooks/use-finance';

const LINKS = [
  { href: '/app/learn', label: 'Learn', description: 'Knowledge base and articles' },
  { href: '/app/documents', label: 'Documents', description: 'Tax docs and vault' },
  { href: '/app/onboarding', label: 'Setup', description: 'Onboarding wizard' },
];

export default function LibraryHubPage() {
  const { data: documents, isLoading: docsLoading, error: docsError } = useDocuments();
  const { data: journey, isLoading: journeyLoading } = useJourneyProgress();

  const docCount = documents?.length ?? 0;
  const hubs = journey?.hubs ?? [];
  const completedSteps = hubs.reduce((sum, h) => sum + h.completedCount, 0);
  const totalSteps = hubs.reduce((sum, h) => sum + h.totalCount, 0);
  const progressPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const libraryHub = hubs.find((h) => h.hubId === 'library');
  const loading = docsLoading || journeyLoading;

  return (
    <div className="space-y-6">
      <PageContextBanner />
      <HubLayout
        title="Library"
        description="Learn and configure"
        hubId="library"
        links={LINKS}
        firstJob={{
          href: '/app/onboarding',
          label: 'Finish setup',
          description: 'Link accounts, tax profile, and goals so the rest of the app has context.',
        }}
      >
        {docsError && <PageError message={docsError.message} />}

        {loading ? (
          <PageLoading variant="stats" count={3} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              title="Documents"
              value={String(docCount)}
              change={{
                value: docCount === 0 ? 'Vault is empty' : 'In your vault',
                trend: 'neutral',
              }}
            />
            <StatCard
              title="Setup Progress"
              value={totalSteps > 0 ? `${progressPct}%` : '—'}
              change={{
                value:
                  totalSteps > 0
                    ? `${completedSteps}/${totalSteps} steps`
                    : 'Start onboarding',
                trend: progressPct >= 100 ? 'up' : 'neutral',
              }}
            />
            <StatCard
              title="Library Journey"
              value={
                libraryHub
                  ? `${libraryHub.completedCount}/${libraryHub.totalCount}`
                  : '—'
              }
              change={{
                value: 'Learn · docs · setup',
                trend: 'neutral',
              }}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Link href="/app/learn">
            <Button size="sm">
              <BookOpen className="h-4 w-4 mr-1.5" />
              Search learn
            </Button>
          </Link>
          <Link href="/app/documents">
            <Button size="sm" variant="secondary">
              <FileText className="h-4 w-4 mr-1.5" />
              Open vault
            </Button>
          </Link>
          <Link href="/app/onboarding">
            <Button size="sm" variant="secondary">
              Continue setup
            </Button>
          </Link>
        </div>
      </HubLayout>
    </div>
  );
}
