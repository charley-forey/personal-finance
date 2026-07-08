import Link from 'next/link';
import { AppShell, PageHeader } from '@/components/app-shell';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-xl border border-card-border bg-card">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-muted mt-2 mb-6">WorkOS AuthKit integration ready for production.</p>
        <Link
          href="/app"
          className="block w-full text-center px-4 py-3 bg-primary text-black rounded-lg font-medium"
        >
          Continue to App (Demo Mode)
        </Link>
      </div>
    </div>
  );
}
