'use client';

import { DataPage, JsonTable } from '@/components/data-page';
import { PlaidLinkButton } from '@/components/plaid-link-button';
import { api } from '@/lib/api';

export default function AccountsPage() {
  return (
    <DataPage
      title="Accounts"
      description="Linked institutions and account balances"
      load={() => api.accounts()}
      actions={<PlaidLinkButton />}
      render={(data) => <JsonTable data={data as unknown[]} />}
    />
  );
}
