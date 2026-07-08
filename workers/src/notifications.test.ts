import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import type { Database } from '@pf/database';
import { handleNotificationJob } from './notifications.js';

describe('handleNotificationJob', () => {
  it('returns early when orgId is missing', async () => {
    const warn = mock.method(console, 'warn');
    const db = {} as Database;

    await handleNotificationJob(db, {
      data: { type: 'general', title: 'Test', body: 'Missing org' },
    });

    assert.equal(warn.mock.callCount(), 1);
    assert.match(String(warn.mock.calls[0]?.arguments[0]), /missing orgId/i);
    warn.mock.restore();
  });
});
