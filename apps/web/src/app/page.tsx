import Link from 'next/link';
import { Button } from '@/components/ui';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-card-border px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-4">
        <span className="font-bold text-lg sm:text-xl truncate">Personal Finance OS</span>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link href="/login" className="text-sm text-muted hover:text-foreground min-h-11 inline-flex items-center px-2">
            Login
          </Link>
          <Link href="/login">
            <Button size="sm" className="sm:h-10 sm:px-4 sm:text-sm">
              Get Started
            </Button>
          </Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          Your complete financial
          <br />
          <span className="text-primary">operating system</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted mt-4 sm:mt-6 max-w-2xl mx-auto">
          Link all accounts via Plaid. Track changes over time. Get AI insights,
          forecasts, Monte Carlo retirement planning, and domain-expert agents.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-10">
          <Link href="/login" className="inline-flex justify-center">
            <Button size="lg" className="w-full sm:w-auto">
              Open Dashboard
            </Button>
          </Link>
          <Link href="/pricing" className="inline-flex justify-center">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              View Pricing
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-16 sm:mt-24 text-left">
          {[
            { title: 'Complete History', desc: 'Append-only snapshots track every balance and transaction change.' },
            { title: 'AI CFO Agents', desc: 'Tax, retirement, budget, and investment agents with your real data.' },
            { title: 'Enterprise Ready', desc: 'Multi-tenant SaaS with WorkOS auth, audit logs, and SOC2 path.' },
          ].map((f) => (
            <div key={f.title} className="p-5 sm:p-6 rounded-xl border border-card-border bg-card">
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-muted mt-2 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
