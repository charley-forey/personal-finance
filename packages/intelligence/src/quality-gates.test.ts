import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { assertCoreGatesHealthy, evalHarnessSmoke, INTELLIGENCE_QUALITY_GATES } from './quality-gates';

describe('quality gates', () => {
  it('exposes shared gate thresholds', () => {
    assert.ok(INTELLIGENCE_QUALITY_GATES.forecastMapePct <= 15);
    assert.ok(INTELLIGENCE_QUALITY_GATES.factualAccuracyPct >= 98);
  });

  it('passes a healthy sample set', () => {
    assert.equal(
      assertCoreGatesHealthy({
        factualAccuracyPct: 99,
        forecastMapePct: 10,
        insightAcceptancePct: 40,
      }),
      true,
    );
  });

  it('fails when forecast MAPE breaches gate', () => {
    assert.equal(
      assertCoreGatesHealthy({
        factualAccuracyPct: 99,
        forecastMapePct: 25,
        insightAcceptancePct: 40,
      }),
      false,
    );
  });

  it('runs eval harness smoke', () => {
    assert.ok(evalHarnessSmoke() >= 0.8);
  });
});
