'use client';

import { AuthKitProvider } from '@workos-inc/authkit-nextjs/components';

export function AuthKitShell({ children }: { children: React.ReactNode }) {
  return <AuthKitProvider>{children}</AuthKitProvider>;
}
