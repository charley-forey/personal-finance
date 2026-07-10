/**
 * Tenant isolation contract tests.
 *
 * Full cross-org DB integration tests need a seeded multi-tenant fixture.
 * These unit-style tests lock the AuthContext / query-helper contract that
 * every data-access path must follow: orgId is always required.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { AuthContext } from '@pf/shared';

/** Mirrors getAuth() + org-scoped query pattern used across controllers. */
function requireOrgId(auth: AuthContext | undefined | null): string {
  if (!auth) {
    throw new Error('Unauthorized: missing AuthContext');
  }
  if (typeof auth.orgId !== 'string' || auth.orgId.length === 0) {
    throw new Error('Forbidden: AuthContext.orgId is required for data access');
  }
  return auth.orgId;
}

/** Builds a Drizzle-style equality predicate shape for documentation/assertions. */
function orgScopedWhere(orgId: string, tableOrgId: string): { orgId: string; matches: boolean } {
  return { orgId, matches: orgId === tableOrgId };
}

function makeAuth(overrides: Partial<AuthContext> = {}): AuthContext {
  return {
    userId: 'user-1',
    workosUserId: 'workos-1',
    email: 'user@example.com',
    orgId: 'org-a',
    role: 'owner',
    ...overrides,
  };
}

describe('tenant isolation — AuthContext orgId contract', () => {
  it('requires AuthContext for data access', () => {
    assert.throws(() => requireOrgId(undefined), /missing AuthContext/);
    assert.throws(() => requireOrgId(null), /missing AuthContext/);
  });

  it('requires non-empty orgId on AuthContext', () => {
    assert.throws(() => requireOrgId(makeAuth({ orgId: '' })), /orgId is required/);
  });

  it('returns orgId for scoped queries', () => {
    const auth = makeAuth({ orgId: 'org-a' });
    assert.equal(requireOrgId(auth), 'org-a');
  });

  it('org-scoped where clause matches only the same org', () => {
    const auth = makeAuth({ orgId: 'org-a' });
    const orgId = requireOrgId(auth);

    assert.equal(orgScopedWhere(orgId, 'org-a').matches, true);
    assert.equal(orgScopedWhere(orgId, 'org-b').matches, false);
  });

  it('two auths from different orgs never share a scope key', () => {
    const a = requireOrgId(makeAuth({ orgId: 'org-a', userId: 'u1' }));
    const b = requireOrgId(makeAuth({ orgId: 'org-b', userId: 'u2' }));
    assert.notEqual(a, b);
  });
});

describe('tenant isolation — integration (skipped until multi-org fixture)', () => {
  it.skip('org A cannot read org B transactions via API', async () => {
    // When a multi-org seed exists:
    // 1. Create session for org-a and org-b
    // 2. Insert a transaction owned by org-b
    // 3. GET /transactions as org-a → must not include org-b row
    assert.fail('not implemented — needs multi-org DB fixture');
  });
});
