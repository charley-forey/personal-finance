'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader, Card } from '@/components/app-shell';
import { PlaidLinkButton } from '@/components/plaid-link-button';

const STEPS = ['Welcome', 'Link Accounts', 'Tax Profile', 'Set Goals', 'Dashboard'];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  return (
    <div className="max-w-xl mx-auto">
      <PageHeader title="Setup" description={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`} />
      <div className="flex gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className={`h-1 flex-1 rounded ${i <= step ? 'bg-primary' : 'bg-card-border'}`} />
        ))}
      </div>
      <Card>
        {step === 0 && <p>Welcome to Personal Finance OS. Let&apos;s set up your financial command center.</p>}
        {step === 1 && <PlaidLinkButton />}
        {step === 2 && <p className="text-muted text-sm">Tax profile can be configured in Settings → Taxes.</p>}
        {step === 3 && <p className="text-muted text-sm">Create goals in the Goals section after setup.</p>}
        {step === 4 && <p>You&apos;re ready! Your dashboard will populate as data syncs.</p>}
        <div className="flex gap-4 mt-6">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="px-4 py-2 border border-card-border rounded-lg">
              Back
            </button>
          )}
          <button
            onClick={() => (step < STEPS.length - 1 ? setStep(step + 1) : router.push('/app'))}
            className="px-4 py-2 bg-primary text-black rounded-lg font-medium"
          >
            {step < STEPS.length - 1 ? 'Continue' : 'Go to Dashboard'}
          </button>
        </div>
      </Card>
    </div>
  );
}
