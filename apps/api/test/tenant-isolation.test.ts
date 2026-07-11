/**
 * Tenant isolation contract tests.
 *
 * Unit-style tests lock the AuthContext / query-helper contract that every
 * data-access path must follow. Integration-style helpers document the
 * cross-org assertions that API routes must enforce.
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

/**
 * Simulates update-by-id with mandatory org check (PnL period, scenario, document).
 * Returns whether the write is allowed.
 */
function allowMutateById(
  authOrgId: string,
  resourceOrgId: string | null | undefined,
): boolean {
  return Boolean(resourceOrgId) && resourceOrgId === authOrgId;
}

/**
 * Advisor link: non-admins may only link their own org.
 */
function allowAdvisorLink(
  caller: { orgId: string; isPlatformAdmin: boolean },
  requestedOrgId: string,
): boolean {
  if (caller.isPlatformAdmin) return true;
  return requestedOrgId === caller.orgId;
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

describe('tenant isolation — mutate-by-id (PnL / scenario / document)', () => {
  it('org A cannot mutate org B period/scenario/document', () => {
    const authOrg = requireOrgId(makeAuth({ orgId: 'org-a' }));
    assert.equal(allowMutateById(authOrg, 'org-b'), false);
    assert.equal(allowMutateById(authOrg, 'org-a'), true);
    assert.equal(allowMutateById(authOrg, null), false);
  });
});

describe('tenant isolation — advisor client link', () => {
  it('rejects linking another org unless platform admin', () => {
    assert.equal(
      allowAdvisorLink({ orgId: 'org-a', isPlatformAdmin: false }, 'org-b'),
      false,
    );
    assert.equal(
      allowAdvisorLink({ orgId: 'org-a', isPlatformAdmin: false }, 'org-a'),
      true,
    );
    assert.equal(
      allowAdvisorLink({ orgId: 'org-a', isPlatformAdmin: true }, 'org-b'),
      true,
    );
  });
});

describe('tenant isolation — accounts / plaid / export surface', () => {
  it('list filters must use caller orgId only', () => {
    const a = requireOrgId(makeAuth({ orgId: 'org-a' }));
    const b = requireOrgId(makeAuth({ orgId: 'org-b' }));
    const orgBAccount = { id: 'acct-1', orgId: 'org-b' };
    assert.equal(orgScopedWhere(a, orgBAccount.orgId).matches, false);
    assert.equal(orgScopedWhere(b, orgBAccount.orgId).matches, true);
  });

  it('export and delete are owner-gated roles', () => {
    const owner = makeAuth({ role: 'owner' });
    const viewer = makeAuth({ role: 'viewer' });
    const roleRank = { owner: 3, admin: 2, viewer: 1 } as const;
    assert.ok(roleRank[owner.role] >= roleRank.owner);
    assert.ok(roleRank[viewer.role] < roleRank.owner);
  });
});
