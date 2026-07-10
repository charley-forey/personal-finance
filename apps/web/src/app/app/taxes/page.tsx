'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AppPageHeader, Card } from '@/components/ui';
import { PageError } from '@/components/page-states';
import { Badge, Button, EmptyState, Input, Select, Skeleton, StatCard } from '@/components/ui';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';

const FILING_STATUSES = [
  { value: 'single', label: 'Single' },
  { value: 'mfj', label: 'Married Filing Jointly' },
  { value: 'mfs', label: 'Married Filing Separately' },
  { value: 'hoh', label: 'Head of Household' },
];

const STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
].map((s) => ({ value: s, label: s }));

export default function TaxesPage() {
  const qc = useQueryClient();
  const currentYear = new Date().getFullYear();
  const [taxYear, setTaxYear] = useState(String(currentYear));
  const [profileForm, setProfileForm] = useState({
    filingStatus: 'single',
    state: 'NY',
    dependents: '0',
    estimatedAnnualIncome: '',
    withholdingYtd: '',
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['tax-profile'],
    queryFn: () => api.taxProfile(),
  });

  const { data: estimate, isLoading: estimateLoading, error } = useQuery({
    queryKey: ['tax-estimate', taxYear],
    queryFn: () => api.taxesEstimate(parseInt(taxYear, 10)),
  });

  const taxYearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
  }));

  useEffect(() => {
    if (profile) {
      setProfileForm({
        filingStatus: profile.filingStatus ?? 'single',
        state: profile.state ?? 'NY',
        dependents: String(profile.dependents ?? 0),
        estimatedAnnualIncome: profile.estimatedAnnualIncome ?? '',
        withholdingYtd: profile.withholdingYtd ?? '',
      });
    }
  }, [profile]);

  const saveProfile = useMutation({
    mutationFn: () =>
      api.updateTaxProfile({
        filingStatus: profileForm.filingStatus,
        state: profileForm.state,
        dependents: parseInt(profileForm.dependents, 10) || 0,
        estimatedAnnualIncome: profileForm.estimatedAnnualIncome,
        withholdingYtd: profileForm.withholdingYtd,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tax-profile'] });
      qc.invalidateQueries({ queryKey: ['tax-estimate'] });
    },
  });

  const loading = profileLoading || estimateLoading;

  return (
    <div>
      <AppPageHeader
        title="Tax Center"
        description="YTD estimates and quarterly payments"
        actions={
          <Select
            label="Tax Year"
            options={taxYearOptions}
            value={taxYear}
            onChange={(e) => setTaxYear(e.target.value)}
          />
        }
      />

      {error && <PageError message={error.message} />}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Tax Profile">
          {profileLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              <Select
                label="Filing Status"
                options={FILING_STATUSES}
                value={profileForm.filingStatus}
                onChange={(e) => setProfileForm({ ...profileForm, filingStatus: e.target.value })}
              />
              <Select
                label="State"
                options={STATES}
                value={profileForm.state}
                onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
              />
              <Input
                label="Dependents"
                type="number"
                min={0}
                value={profileForm.dependents}
                onChange={(e) => setProfileForm({ ...profileForm, dependents: e.target.value })}
              />
              <Input
                label="Estimated Annual Income"
                type="number"
                placeholder="120000"
                value={profileForm.estimatedAnnualIncome}
                onChange={(e) => setProfileForm({ ...profileForm, estimatedAnnualIncome: e.target.value })}
              />
              <Input
                label="Withholding YTD"
                type="number"
                placeholder="15000"
                value={profileForm.withholdingYtd}
                onChange={(e) => setProfileForm({ ...profileForm, withholdingYtd: e.target.value })}
              />
              <Button disabled={saveProfile.isPending} onClick={() => saveProfile.mutate()}>
                {saveProfile.isPending ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {loading ? (
              <>
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </>
            ) : estimate ? (
              <>
                <StatCard title="Estimated Total Tax" value={formatCurrency(estimate.totalTax)} />
                <StatCard
                  title="Owed / Refund"
                  value={formatCurrency(estimate.owedOrRefund)}
                  change={{
                    value: estimate.owedOrRefund > 0 ? 'Amount owed' : 'Expected refund',
                    trend: estimate.owedOrRefund > 0 ? 'down' : 'up',
                  }}
                />
                <StatCard title="Next Quarterly Payment" value={formatCurrency(estimate.quarterlyPayment)} />
                <StatCard title="Effective Rate" value={`${(estimate.effectiveRate * 100).toFixed(1)}%`} />
              </>
            ) : (
              <div className="col-span-2">
                <EmptyState
                  title="No estimate available"
                  description="Save your tax profile to generate a YTD estimate for the selected year."
                />
              </div>
            )}
          </div>

          {estimate && (
            <Card title="Tax Breakdown">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Federal Tax</span>
                  <span className="tabular-nums font-medium">{formatCurrency(estimate.federalTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">State Tax</span>
                  <span className="tabular-nums font-medium">{formatCurrency(estimate.stateTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Self-Employment Tax</span>
                  <span className="tabular-nums font-medium">{formatCurrency(estimate.selfEmploymentTax)}</span>
                </div>
                <div className="flex justify-between border-t border-card-border pt-3">
                  <span className="text-muted">Marginal Rate</span>
                  <span className="tabular-nums font-medium">{(estimate.marginalRate * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Safe Harbor</span>
                  <Badge variant={estimate.safeHarborMet ? 'success' : 'warning'}>
                    {estimate.safeHarborMet ? 'Met' : 'Not met'}
                  </Badge>
                </div>
              </div>

              {estimate.quarterlyPayments && estimate.quarterlyPayments.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted mb-3">Quarterly Payments</p>
                  <div className="space-y-2">
                    {estimate.quarterlyPayments.map((q) => (
                      <div key={q.quarter} className="flex justify-between text-sm">
                        <span className="text-muted">{q.quarter} — due {formatDate(q.dueDate)}</span>
                        <span className="tabular-nums font-medium">{formatCurrency(q.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {estimate.bracketBreakdown.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted mb-3">Bracket Breakdown</p>
                  <div className="space-y-2">
                    {estimate.bracketBreakdown.map((b) => (
                      <div key={b.bracket} className="flex justify-between text-sm">
                        <span className="text-muted">{b.bracket} on {formatCurrency(b.income)}</span>
                        <span className="tabular-nums">{formatCurrency(b.tax)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
