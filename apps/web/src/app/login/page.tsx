'use client';

import Link from 'next/link';
import { useAuth } from '@workos-inc/authkit-nextjs/components';

export default function LoginPage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-xl border border-card-border bg-card">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-muted mt-2 mb-6 text-sm">
          Sign in with WorkOS AuthKit to access your financial dashboard.
        </p>
        <Link
          href={user ? '/app' : '/sign-in'}
          className="block w-full text-center px-4 py-3 bg-primary text-black rounded-lg font-medium"
        >
          {loading ? 'Loading...' : user ? 'Continue to App' : 'Sign in with WorkOS'}
        </Link>
      </div>
    </div>
  );
}
