import { AppShell } from '@/components/app-shell';
import { AuthKitShell } from '@/components/authkit-shell';
import { AuthProvider } from '@/components/auth-provider';
import { QueryProvider } from '@/components/query-provider';
import { EventStreamProvider } from '@/components/event-stream-provider';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthKitShell>
      <QueryProvider>
        <EventStreamProvider>
          <AppShell>
            <AuthProvider>{children}</AuthProvider>
          </AppShell>
        </EventStreamProvider>
      </QueryProvider>
    </AuthKitShell>
  );
}
