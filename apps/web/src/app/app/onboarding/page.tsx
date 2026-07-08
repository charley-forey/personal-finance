'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader, Card } from '@/components/app-shell';
import { PageLoading } from '@/components/page-states';
import { Button, Input, Select } from '@/components/ui';
import { PlaidLinkButton } from '@/components/plaid-link-button';
import { api } from '@/lib/api';
import { useInvalidateFinance } from '@/hooks/use-finance';

const STEPS = ['Welcome', 'Link Accounts', 'Tax Profile', 'Set Goals', 'Notifications'];
const STORAGE_KEY = 'pf_onboarding';

interface OnboardingState {
  step: number;
  taxForm: { filingStatus: string; state: string; estimatedAnnualIncome: string };
  goalForm: { name: string; targetAmount: string };
  notifEmail: boolean;
}

const defaultState: OnboardingState = {
  step: 0,
  taxForm: { filingStatus: 'single', state: 'NY', estimatedAnnualIncome: '' },
  goalForm: { name: 'Emergency Fund', targetAmount: '10000' },
  notifEmail: true,
};

function loadState(): OnboardingState {
  if (typeof window === 'undefined') return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<OnboardingState>;
    return {
      step: typeof parsed.step === 'number' ? Math.min(parsed.step, STEPS.length - 1) : 0,
      taxForm: { ...defaultState.taxForm, ...parsed.taxForm },
      goalForm: { ...defaultState.goalForm, ...parsed.goalForm },
      notifEmail: parsed.notifEmail ?? defaultState.notifEmail,
    };
  } catch {
    return defaultState;
  }
}

function saveState(state: OnboardingState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();
  const invalidate = useInvalidateFinance();
  const [taxForm, setTaxForm] = useState(defaultState.taxForm);
  const [goalForm, setGoalForm] = useState(defaultState.goalForm);
  const [notifEmail, setNotifEmail] = useState(defaultState.notifEmail);

  useEffect(() => {
    const saved = loadState();
    setStep(saved.step);
    setTaxForm(saved.taxForm);
    setGoalForm(saved.goalForm);
    setNotifEmail(saved.notifEmail);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveState({ step, taxForm, goalForm, notifEmail });
  }, [step, taxForm, goalForm, notifEmail, hydrated]);

  const finish = async () => {
    await api.updatePreferences({
      notificationSettingsJson: { email: notifEmail, weeklyDigest: true },
    });
    localStorage.removeItem(STORAGE_KEY);
    invalidate();
    router.push('/app');
  };

  if (!hydrated) {
    return (
      <div className="max-w-xl mx-auto">
        <PageHeader title="Setup" description="Getting things ready…" />
        <PageLoading variant="list" count={3} />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <PageHeader title="Setup" description={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`} />
      <div className="flex gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className={`h-1 flex-1 rounded ${i <= step ? 'bg-primary' : 'bg-card-border'}`} />
        ))}
      </div>
      <Card>
        {step === 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Welcome to Personal Finance OS</h2>
            <p className="text-muted">Your complete financial operating system. Let&apos;s get you set up in a few steps.</p>
          </div>
        )}
        {step === 1 && (
          <div>
            <p className="mb-4 text-muted text-sm">Link your bank accounts via Plaid to automatically sync transactions and balances.</p>
            <PlaidLinkButton />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-muted text-sm">Basic tax info helps us estimate your tax liability.</p>
            <Select
              label="Filing Status"
              value={taxForm.filingStatus}
              onChange={(e) => setTaxForm({ ...taxForm, filingStatus: e.target.value })}
              options={[
                { value: 'single', label: 'Single' },
                { value: 'married_joint', label: 'Married Filing Jointly' },
                { value: 'head_of_household', label: 'Head of Household' },
              ]}
            />
            <Input
              label="State"
              value={taxForm.state}
              onChange={(e) => setTaxForm({ ...taxForm, state: e.target.value })}
            />
            <Input
              label="Estimated Annual Income"
              type="number"
              value={taxForm.estimatedAnnualIncome}
              onChange={(e) => setTaxForm({ ...taxForm, estimatedAnnualIncome: e.target.value })}
            />
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-muted text-sm">Set your first financial goal.</p>
            <Input
              label="Goal Name"
              value={goalForm.name}
              onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
            />
            <Input
              label="Target Amount"
              type="number"
              value={goalForm.targetAmount}
              onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
            />
          </div>
        )}
        {step === 4 && (
          <div>
            <p className="text-muted text-sm mb-4">Choose how you&apos;d like to stay informed.</p>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={notifEmail} onChange={(e) => setNotifEmail(e.target.checked)} />
              <span>Weekly email digest</span>
            </label>
          </div>
        )}
        <div className="flex gap-4 mt-6">
          {step > 0 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <Button
            onClick={async () => {
              if (step === 2) await api.updateTaxProfile(taxForm);
              if (step === 3) await api.createGoal({ name: goalForm.name, targetAmount: goalForm.targetAmount, goalType: 'emergency_fund' });
              if (step < STEPS.length - 1) setStep(step + 1);
              else await finish();
            }}
          >
            {step < STEPS.length - 1 ? 'Continue' : 'Go to Dashboard'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
