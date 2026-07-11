/**
 * Platform Control Plane RBAC unit tests.
 */
import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { buildPlatformAdminContext } from '../src/common/platform-admin.guard';

describe('buildPlatformAdminContext', () => {
  const prev = process.env.PLATFORM_ADMIN_EMAILS;
  const prevNode = process.env.NODE_ENV;

  afterEach(() => {
    if (prev === undefined) delete process.env.PLATFORM_ADMIN_EMAILS;
    else process.env.PLATFORM_ADMIN_EMAILS = prev;
    if (prevNode === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = prevNode;
  });

  it('grants platform_owner from DB role', () => {
    process.env.PLATFORM_ADMIN_EMAILS = '';
    process.env.NODE_ENV = 'production';
    const ctx = buildPlatformAdminContext({
      email: 'charley.s.forey@gmail.com',
      userId: 'u1',
      dbRole: 'platform_owner',
      dbActive: true,
    });
    assert.equal(ctx.isPlatformAdmin, true);
    assert.equal(ctx.role, 'platform_owner');
    assert.ok(ctx.permissions.includes('admins:manage'));
  });

  it('denies inactive DB admin without env break-glass', () => {
    process.env.PLATFORM_ADMIN_EMAILS = '';
    process.env.NODE_ENV = 'production';
    const ctx = buildPlatformAdminContext({
      email: 'someone@example.com',
      userId: 'u1',
      dbRole: 'support_agent',
      dbActive: false,
    });
    assert.equal(ctx.isPlatformAdmin, false);
  });

  it('uses env allowlist as break-glass owner', () => {
    process.env.PLATFORM_ADMIN_EMAILS = 'charley.s.forey@gmail.com';
    process.env.NODE_ENV = 'production';
    const ctx = buildPlatformAdminContext({
      email: 'Charley.S.Forey@gmail.com',
      userId: 'u1',
    });
    assert.equal(ctx.isPlatformAdmin, true);
    assert.equal(ctx.role, 'platform_owner');
    assert.equal(ctx.viaBreakGlass, true);
  });
});
