'use client';
import { PageHeader, Card } from '@/components/app-shell';
export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Profile, org, and notification preferences" />
      <div className="space-y-4">
        <Card title="Organization"><p className="text-sm text-muted">WorkOS multi-tenant org settings</p></Card>
        <Card title="Connected Accounts"><p className="text-sm text-muted">Manage Plaid connections in Accounts</p></Card>
        <Card title="Billing"><p className="text-sm text-muted">Stripe billing integration (Phase 8)</p></Card>
      </div>
    </div>
  );
}
