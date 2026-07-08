import Link from 'next/link';

const PLANS = [
  { name: 'Free', price: '$0', features: ['2 accounts', '30-day history', 'Basic dashboards'] },
  { name: 'Pro', price: '$12/mo', features: ['Unlimited accounts', 'AI insights & agents', 'P&L & forecasts'] },
  { name: 'Family', price: '$20/mo', features: ['5 users', 'Shared goals', 'Accountant portal'] },
  { name: 'Advisor', price: '$99/mo', features: ['50 client orgs', 'White-label', 'API access'] },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen p-8">
      <Link href="/" className="text-primary">← Back</Link>
      <h1 className="text-4xl font-bold mt-8 text-center">Pricing</h1>
      <div className="grid grid-cols-4 gap-6 max-w-6xl mx-auto mt-12">
        {PLANS.map((plan) => (
          <div key={plan.name} className="p-6 rounded-xl border border-card-border bg-card">
            <h2 className="text-xl font-bold">{plan.name}</h2>
            <p className="text-3xl font-bold mt-4">{plan.price}</p>
            <ul className="mt-6 space-y-2 text-sm text-muted">
              {plan.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
