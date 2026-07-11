/**
 * Cross-org isolation fuzz contract.
 * Documents mutating routes that must reject foreign org IDs with 403/404.
 * Wire to a live multi-org fixture in CI when DATABASE_URL + seed are available.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const MUTATING_ROUTES: Array<{ method: string; path: string; body?: Record<string, unknown> }> = [
  { method: 'POST', path: '/pnl/:periodId/cells', body: { rowKey: 'x', columnKey: 'y', value: 1 } },
  { method: 'POST', path: '/scenarios/:id/run' },
  { method: 'POST', path: '/documents/:id/parse' },
  { method: 'POST', path: '/advisor/clients', body: { firmId: 'firm-b', orgId: 'org-b' } },
  { method: 'DELETE', path: '/plaid/items/:id' },
  { method: 'PATCH', path: '/org/members/:userId', body: { role: 'viewer' } },
  { method: 'DELETE', path: '/compliance/account' },
];

function assertForeignOrgRejected(status: number) {
  assert.ok(status === 403 || status === 404, `expected 403/404, got ${status}`);
}

describe('tenant isolation fuzz — route catalog', () => {
  it('lists mutating routes that require org scope', () => {
    assert.ok(MUTATING_ROUTES.length >= 5);
    for (const route of MUTATING_ROUTES) {
      assert.ok(route.method === 'POST' || route.method === 'PATCH' || route.method === 'DELETE');
      assert.ok(route.path.startsWith('/'));
    }
  });

  it('treats 2xx on foreign org id as failure', () => {
    assertForeignOrgRejected(403);
    assertForeignOrgRejected(404);
    assert.throws(() => assertForeignOrgRejected(200), /expected 403\/404/);
  });
});

describe('tenant isolation fuzz — integration (env-gated)', () => {
  const enabled = process.env.RUN_TENANT_FUZZ === '1';

  it('org A token cannot mutate org B resources', async (t) => {
    if (!enabled) {
      t.skip('Set RUN_TENANT_FUZZ=1 with multi-org seed to enable');
      return;
    }
    // Placeholder for CI: for each MUTATING_ROUTES entry, substitute org-B ids
    // and call API with org-A bearer; assertForeignOrgRejected(status).
    assert.fail('implement against live fixture');
  });
});
