/** Stale if last successful sync older than this (ms). Used by API health + UI banner. */
export const PLAID_STALE_MS = 24 * 60 * 60 * 1000;

export type AccountPurpose = 'cash' | 'brokerage' | 'retirement' | 'liability' | 'other';

export const ACCOUNT_PURPOSE_LABELS: Record<AccountPurpose, string> = {
  cash: 'Cash & Checking',
  brokerage: 'Investments',
  retirement: 'Retirement',
  liability: 'Credit & Loans',
  other: 'Other',
};

const RETIREMENT_SUBTYPES = new Set([
  '401k',
  '403b',
  '457b',
  'ira',
  'roth',
  'roth 401k',
  'roth ira',
  'sep ira',
  'simple ira',
  'pension',
  'retirement',
  'keogh',
  'profit sharing plan',
  'thrift savings plan',
  'sarsep',
  'education savings account',
  '529',
]);

/**
 * Derive display purpose from Plaid account type + subtype.
 * User overrides should take precedence when purposeOverride is set.
 */
export function deriveAccountPurpose(type: string, subtype?: string | null): AccountPurpose {
  const t = (type ?? '').toLowerCase();
  const s = (subtype ?? '').toLowerCase().trim();

  if (t === 'credit' || t === 'loan') return 'liability';
  if (t === 'depository') return 'cash';

  if (t === 'investment' || t === 'brokerage') {
    if (s && RETIREMENT_SUBTYPES.has(s)) return 'retirement';
    // Common Plaid retirement subtypes without spaces
    if (
      s.includes('401') ||
      s.includes('403') ||
      s.includes('ira') ||
      s.includes('roth') ||
      s.includes('pension') ||
      s.includes('retirement')
    ) {
      return 'retirement';
    }
    return 'brokerage';
  }

  return 'other';
}

export function purposeFromAccount(acct: {
  type: string;
  subtype?: string | null;
  purpose?: string | null;
  purposeOverride?: boolean | null;
}): AccountPurpose {
  if (acct.purposeOverride && acct.purpose) {
    const p = acct.purpose as AccountPurpose;
    if (p in ACCOUNT_PURPOSE_LABELS) return p;
  }
  if (acct.purpose && !acct.purposeOverride) {
    // Prefer stored derived purpose when present
    const p = acct.purpose as AccountPurpose;
    if (p in ACCOUNT_PURPOSE_LABELS) return p;
  }
  return deriveAccountPurpose(acct.type, acct.subtype);
}
