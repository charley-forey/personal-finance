'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const LABELS: Record<string, string> = {
  emergencyFund: 'Emergency',
  debt: 'Debt',
  savingsRate: 'Savings',
  diversification: 'Diversify',
  cashFlowStability: 'Cash Flow',
  goalProgress: 'Goals',
  dataFreshness: 'Data',
  budgetAdherence: 'Budget',
};

interface HealthScoreRadarProps {
  subScores: Record<string, number>;
  className?: string;
}

export function HealthScoreRadar({ subScores, className }: HealthScoreRadarProps) {
  const data = Object.entries(subScores).map(([key, value]) => ({
    subject: LABELS[key] ?? key,
    score: Math.round(value),
    fullMark: 100,
  }));

  if (data.length === 0) return null;

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#3f3f46" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 10 }} />
          <Tooltip formatter={(v: number) => [`${v}/100`, 'Score']} />
          <Radar name="Health" dataKey="score" stroke="#22c55e" fill="#22c55e" fillOpacity={0.25} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HealthSubScores({ subScores }: { subScores: Record<string, number> }) {
  const entries = Object.entries(subScores);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      {entries.map(([key, value]) => {
        const score = Math.round(value);
        const color = score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-red-400';
        return (
          <div key={key} className="rounded-lg border border-card-border bg-card/50 px-3 py-2">
            <p className="text-xs text-muted capitalize truncate">{LABELS[key] ?? key.replace(/([A-Z])/g, ' $1')}</p>
            <p className={`text-lg font-semibold tabular-nums ${color}`}>{score}</p>
          </div>
        );
      })}
    </div>
  );
}
