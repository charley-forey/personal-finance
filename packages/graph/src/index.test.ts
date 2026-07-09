import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ROUTE_ENTITY_MAP, ENTITY_ROUTES } from './types.js';

test('ROUTE_ENTITY_MAP covers core pages', () => {
  assert.ok(ROUTE_ENTITY_MAP['/app/budgets']);
  assert.ok(ROUTE_ENTITY_MAP['/app/transactions']);
  assert.equal(ENTITY_ROUTES.budget, '/app/budgets');
});
