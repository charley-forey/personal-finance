'use client';
import { PageHeader, Card } from '@/components/app-shell';
export default function InboxPage() {
  return (
    <div>
      <PageHeader title="Transaction Inbox" description="Review uncategorized and anomalous transactions" />
      <Card><p className="text-muted text-sm">Inbox zero! All transactions categorized. Connect accounts to see items here.</p></Card>
    </div>
  );
}
