import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runEvalHarness, PAGE_EVAL_SCENARIOS, detectProactiveTriggers } from './revolution.js';

test('runEvalHarness scores contextual output', () => {
  const scenario = PAGE_EVAL_SCENARIOS[0]!;
  const score = runEvalHarness('Dashboard headline with overview', scenario);
  assert.ok(score >= 0.8);
});

test('detectProactiveTriggers fires on high velocity', () => {
  const triggers = detectProactiveTriggers({
    orgId: 'test',
    merchantCount: 5,
    spendVelocity: 25,
    goalProximity: 0.5,
    computedAt: new Date().toISOString(),
  });
  assert.equal(triggers.length, 1);
  assert.equal(triggers[0]?.agentType, 'budget_coach');
});
