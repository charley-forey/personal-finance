'use client';

import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/lib/api';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    priceEnvKey: null as null,
    features: ['1 bank connection', '30-day history', 'Basic dashboards'],
  },
  {
    name: 'Pro',
    price: '$12/mo',
    priceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_PRO' as const,
    features: ['Unlimited banks', 'AI insights & agents', 'P&L, forecasts & scenarios'],
    highlight: true,
  },
  {
    name: 'Family',
    price: '$20/mo',
    priceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_FAMILY' as const,
    features: ['Everything in Pro', '5 household members', 'Shared goals'],
  },
  {
    name: 'Advisor',
    price: '$99/mo',
    priceEnvKey: 'NEXT_PUBLIC_STRIPE_PRICE_ADVISOR' as const,
    features: ['50 client orgs', 'Advisor portal', 'API access'],
  },
];

function resolvePriceId(envKey: 'NEXT_PUBLIC_STRIPE_PRICE_PRO' | 'NEXT_PUBLIC_STRIPE_PRICE_FAMILY' | 'NEXT_PUBLIC_STRIPE_PRICE_ADVISOR') {
  const map = {
    NEXT_PUBLIC_STRIPE_PRICE_PRO: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO,
    NEXT_PUBLIC_STRIPE_PRICE_FAMILY: process.env.NEXT_PUBLIC_STRIPE_PRICE_FAMILY,
    NEXT_PUBLIC_STRIPE_PRICE_ADVISOR: process.env.NEXT_PUBLIC_STRIPE_PRICE_ADVISOR,
  };
  return map[envKey] ?? '';
}

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async (planName: string, priceId: string) => {
    if (!priceId) {
      setError(`Stripe price not configured for ${planName}. Set NEXT_PUBLIC_STRIPE_PRICE_* in your environment.`);
      return;
    }
    setError(null);
    setLoadingPlan(planName);
    try {
      const result = await api.billingCheckout(priceId);
      if (result.url) {
        window.location.href = result.url;
        return;
      }
      setError(result.message ?? 'Checkout unavailable. Stripe may not be configured on the API.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <Link href="/" className="text-primary">← Back</Link>
      <h1 className="text-4xl font-bold mt-8 text-center">Pricing</h1>
      <p className="text-center text-muted mt-2">Choose the plan that fits your financial journey</p>
      {error && (
        <p className="text-center text-red-400 text-sm mt-4 max-w-lg mx-auto">{error}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-12">
        {PLANS.map((plan) => (
          <div key={plan.name} className={`p-6 rounded-xl border bg-card ${plan.highlight ? 'border-primary' : 'border-card-border'}`}>
            <h2 className="text-xl font-bold">{plan.name}</h2>
            <p className="text-3xl font-bold mt-4">{plan.price}</p>
            <ul className="mt-6 space-y-2 text-sm text-muted">
              {plan.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
            {plan.name === 'Free' ? (
              <Link href="/login" className="block mt-6 text-center px-4 py-2 border border-card-border rounded-lg font-medium">Get Started</Link>
            ) : (
              <button
                type="button"
                disabled={loadingPlan === plan.name}
                onClick={() => startCheckout(plan.name, resolvePriceId(plan.priceEnvKey!))}
                className="block w-full mt-6 text-center px-4 py-2 bg-primary text-black rounded-lg font-medium disabled:opacity-60"
              >
                {loadingPlan === plan.name ? 'Redirecting…' : `Start ${plan.name}`}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
