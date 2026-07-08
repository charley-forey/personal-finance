import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeUserValueScore,
  rankRecommendations,
  passesQualityGate,
  detectSpendingAnomalies,
  scorePersonalization,
  assignExperimentVariant,
  recalibrateCategories,
  scoreForecastAccuracy,
} from './index';

describe('intelligence', () => {
  it('ranks higher value items first', () => {
    const ranked = rankRecommendations([
      { title: 'Low', actionType: 'review', relevance: 0.5, urgency: 0.5, confidence: 0.5 },
      { title: 'High', actionType: 'save', relevance: 0.9, urgency: 0.9, confidence: 0.9 },
    ]);
    assert.equal(ranked[0]?.title, 'High');
  });

  it('evaluates quality gates', () => {
    assert.equal(passesQualityGate('factualAccuracyPct', 99), true);
    assert.equal(passesQualityGate('forecastMapePct', 20), false);
  });

  it('computes user value score', () => {
    const score = computeUserValueScore({
      title: 'x',
      actionType: 'a',
      relevance: 0.8,
      urgency: 0.7,
      confidence: 0.9,
      cognitiveLoad: 1,
    });
    assert.ok(score > 0.4);
  });

  it('detects spending anomalies via z-score', () => {
    const base = Array.from({ length: 10 }, (_, i) => ({
      id: `t-${i}`,
      amount: 50 + i,
      categoryId: 'food',
    }));
    const anomalies = detectSpendingAnomalies([...base, { id: 'outlier', amount: 500, categoryId: 'food' }]);
    assert.equal(anomalies.length, 1);
    assert.equal(anomalies[0]?.transactionId, 'outlier');
    assert.ok(anomalies[0]!.zScore >= 2.5);
  });

  it('scores personalization from profile and signals', () => {
    const score = scorePersonalization(
      { lifeStage: 'early_career', riskTolerance: 'moderate', goalsSummary: 'Save for house' },
      { recentSignalCount: 5, acceptedRecommendationCount: 2 },
    );
    assert.ok(score > 0.3);
    assert.ok(score <= 1);
  });

  it('assigns deterministic experiment variants', () => {
    const a = assignExperimentVariant('user-1', 'exp-rec-ranking');
    const b = assignExperimentVariant('user-1', 'exp-rec-ranking');
    const c = assignExperimentVariant('user-2', 'exp-rec-ranking');
    assert.equal(a, b);
    assert.ok(['control', 'treatment'].includes(c));
  });

  it('exposes learning job stubs', async () => {
    const recal = await recalibrateCategories('org-1');
    const forecast = await scoreForecastAccuracy('org-1');
    assert.equal(recal.status, 'stub');
    assert.equal(forecast.status, 'stub');
  });
});
