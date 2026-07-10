'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { AppPageHeader, Card } from '@/components/ui';
import { PageLoading } from '@/components/page-states';
import { Button, Input, Select } from '@/components/ui';
import { PlaidLinkButton } from '@/components/plaid-link-button';
import { api } from '@/lib/api';
import { completeJourneyStepSafe } from '@/lib/journey';
import { useInvalidateFinance, usePlaidItems } from '@/hooks/use-finance';

const STEPS = ['Welcome', 'Link Accounts', 'Tax Profile', 'Set Goals', 'Notifications'];
const STORAGE_KEY = 'pf_onboarding';

interface OnboardingState {
  step: number;
  taxForm: { filingStatus: string; state: string; estimatedAnnualIncome: string };
  goalForm: { name: string; targetAmount: string };
  notifEmail: boolean;
  skippedLink: boolean;
}

const defaultState: OnboardingState = {
  step: 0,
  taxForm: { filingStatus: 'single', state: 'NY', estimatedAnnualIncome: '' },
  goalForm: { name: 'Emergency Fund', targetAmount: '10000' },
  notifEmail: true,
  skippedLink: false,
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
      skippedLink: parsed.skippedLink ?? false,
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
  const { data: plaidItems, refetch: refetchItems } = usePlaidItems();
  const [taxForm, setTaxForm] = useState(defaultState.taxForm);
  const [goalForm, setGoalForm] = useState(defaultState.goalForm);
  const [notifEmail, setNotifEmail] = useState(defaultState.notifEmail);
  const [skippedLink, setSkippedLink] = useState(false);
  const [showSkipWarning, setShowSkipWarning] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [goalCreated, setGoalCreated] = useState(false);

  const hasLinkedBank = (plaidItems?.length ?? 0) > 0;
  const canLeaveLinkStep = hasLinkedBank || skippedLink;

  useEffect(() => {
    const saved = loadState();
    setStep(saved.step);
    setTaxForm(saved.taxForm);
    setGoalForm(saved.goalForm);
    setNotifEmail(saved.notifEmail);
    setSkippedLink(saved.skippedLink);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveState({ step, taxForm, goalForm, notifEmail, skippedLink });
  }, [step, taxForm, goalForm, notifEmail, skippedLink, hydrated]);

  const finish = async () => {
    await api.updatePreferences({
      onboardingCompleted: true,
      notificationSettingsJson: {
        email: notifEmail,
        weeklyDigest: true,
        inApp: true,
        onboardingCompleted: true,
      },
    });
    await completeJourneyStepSafe('library', 'complete-setup');
    if (hasLinkedBank) {
      await completeJourneyStepSafe('command', 'link-account');
      await completeJourneyStepSafe('cash-flow', 'link-account');
    }
    if (goalCreated) {
      await completeJourneyStepSafe('plan', 'first-goal');
    }
    localStorage.removeItem(STORAGE_KEY);
    invalidate();
    setCelebrating(true);
    setTimeout(() => {
      router.push('/app?onboarding=complete');
    }, 1600);
  };

  const advanceFromLink = () => {
    if (!canLeaveLinkStep) {
      setShowSkipWarning(true);
      return;
    }
    setShowSkipWarning(false);
    setStep(2);
  };

  const handlePlaidLinked = async () => {
    setImporting(true);
    await refetchItems();
    setTimeout(() => setImporting(false), 2500);
  };

  if (!hydrated) {
    return (
      <div className="max-w-xl mx-auto">
        <AppPageHeader title="Setup" description="Getting things ready…" />
        <PageLoading variant="list" count={3} />
      </div>
    );
  }

  if (celebrating) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">You&apos;re all set</h2>
        <p className="text-muted">
          Taking you to Command — check your Action Queue and first insights.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <AppPageHeader title="Setup" description={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`} />
      <ol className="flex gap-2 mb-8 list-none p-0" aria-label="Setup steps">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className={`h-1 flex-1 rounded ${i <= step ? 'bg-primary' : 'bg-card-border'}`}
            aria-current={i === step ? 'step' : undefined}
            aria-label={s}
          />
        ))}
      </ol>
      <Card>
        {step === 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Welcome to Personal Finance OS</h2>
            <p className="text-muted">
              Your complete financial operating system. Next we&apos;ll link a bank so Command isn&apos;t empty.
            </p>
          </div>
        )}
        {step === 1 && (
          <div>
            <p className="mb-4 text-muted text-sm">
              Link your bank accounts via Plaid to sync transactions and balances. This is the recommended path —
              without it, dashboards and insights stay empty.
            </p>
            <PlaidLinkButton onLinked={() => void handlePlaidLinked()} />
            {importing && (
              <p className="mt-3 text-sm text-primary" role="status">
                Importing…
              </p>
            )}
            {hasLinkedBank && !importing && (
              <p className="mt-3 text-sm text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {plaidItems!.length} bank{plaidItems!.length === 1 ? '' : 's'} linked
              </p>
            )}
            <div className="mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  void refetchItems();
                  setShowSkipWarning(true);
                }}
              >
                I&apos;ll link later
              </Button>
            </div>
            {showSkipWarning && !hasLinkedBank && (
              <div className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/5 p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
                  <div>
                    <p className="text-sm font-medium text-amber-400">Continue without linking?</p>
                    <p className="text-sm text-muted mt-1">
                      You&apos;ll land in an empty app — no transactions, budgets, or insights until you connect a bank
                      from Accounts.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setSkippedLink(true);
                          setShowSkipWarning(false);
                          setStep(2);
                        }}
                      >
                        Skip anyway
                      </Button>
                      <Button size="sm" onClick={() => setShowSkipWarning(false)}>
                        Link a bank instead
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
              if (step === 1) {
                await refetchItems();
                advanceFromLink();
                return;
              }
              if (step === 2) {
                await api.updateTaxProfile(taxForm);
              }
              if (step === 3) {
                await api.createGoal({
                  name: goalForm.name,
                  targetAmount: goalForm.targetAmount,
                  goalType: 'emergency_fund',
                });
                setGoalCreated(true);
                await completeJourneyStepSafe('plan', 'first-goal');
              }
              if (step < STEPS.length - 1) setStep(step + 1);
              else await finish();
            }}
          >
            {step < STEPS.length - 1 ? 'Continue' : 'Go to Command'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
