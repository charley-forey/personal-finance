import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-card-border px-8 py-4 flex justify-between items-center">
        <span className="font-bold text-xl">Personal Finance OS</span>
        <div className="flex gap-4">
          <Link href="/login" className="text-muted hover:text-foreground">Login</Link>
          <Link href="/login" className="px-4 py-2 bg-primary text-black rounded-lg font-medium">Get Started</Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-8 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Your complete financial<br />
          <span className="text-primary">operating system</span>
        </h1>
        <p className="text-xl text-muted mt-6 max-w-2xl mx-auto">
          Link all accounts via Plaid. Track changes over time. Get AI insights,
          forecasts, Monte Carlo retirement planning, and domain-expert agents.
        </p>
        <div className="flex gap-4 justify-center mt-10">
          <Link href="/login" className="px-8 py-3 bg-primary text-black rounded-lg font-semibold text-lg">
            Open Dashboard
          </Link>
          <Link href="/pricing" className="px-8 py-3 border border-card-border rounded-lg font-semibold text-lg">
            View Pricing
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-24 text-left">
          {[
            { title: 'Complete History', desc: 'Append-only snapshots track every balance and transaction change.' },
            { title: 'AI CFO Agents', desc: 'Tax, retirement, budget, and investment agents with your real data.' },
            { title: 'Enterprise Ready', desc: 'Multi-tenant SaaS with WorkOS auth, audit logs, and SOC2 path.' },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-xl border border-card-border bg-card">
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-muted mt-2 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
