export interface OutcomeGap {
  page: string;
  metric: string;
  value: number;
  threshold: number;
  suggestion: string;
}

export interface AutoSpec {
  page: string;
  agentId: string;
  visionSummary: string;
  priority: 'P0' | 'P1' | 'P2';
}

export function detectGaps(outcomes: Array<{ page: string; iar: number }>): OutcomeGap[] {
  return outcomes
    .filter((o) => o.iar < 0.25)
    .map((o) => ({
      page: o.page,
      metric: 'IAR',
      value: o.iar,
      threshold: 0.25,
      suggestion: `Improve priority actions and context banner on ${o.page}`,
    }));
}

export function generateAutoSpec(gap: OutcomeGap): AutoSpec {
  const slug = gap.page.replace(/\//g, '-').replace(/^-/, '');
  return {
    page: gap.page,
    agentId: `R-auto-${slug}`,
    visionSummary: gap.suggestion,
    priority: gap.value < 0.1 ? 'P0' : 'P1',
  };
}
