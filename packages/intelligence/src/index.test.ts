import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { computeUserValueScore, rankRecommendations, passesQualityGate } from './index';

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
});
