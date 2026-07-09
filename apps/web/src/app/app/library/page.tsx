'use client';

import { HubLayout } from '@/components/hub-layout';
import { PageContextBanner } from '@/components/page-context-banner';

const LINKS = [
  { href: '/app/learn', label: 'Learn', description: 'Knowledge base and articles' },
  { href: '/app/documents', label: 'Documents', description: 'Tax docs and vault' },
  { href: '/app/onboarding', label: 'Setup', description: 'Onboarding wizard' },
  { href: '/app/settings', label: 'Settings', description: 'Preferences and billing' },
];

export default function LibraryHubPage() {
  return (
    <div className="space-y-6">
      <PageContextBanner />
      <HubLayout title="Library" description="Learn and configure" hubId="library" links={LINKS}>
        <p className="text-sm text-muted-foreground">
          Build financial literacy, store documents, and configure your profile and preferences.
        </p>
      </HubLayout>
    </div>
  );
}
