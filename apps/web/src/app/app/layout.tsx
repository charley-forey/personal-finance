import { AppShell } from '@/components/app-shell';
import { AuthKitShell } from '@/components/authkit-shell';
import { AuthProvider } from '@/components/auth-provider';
import { QueryProvider } from '@/components/query-provider';
import { EventStreamProvider } from '@/components/event-stream-provider';
import { AppRevolutionWrapper } from '@/components/app-revolution-wrapper';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthKitShell>
      <QueryProvider>
        <EventStreamProvider>
          <AppShell>
            <AuthProvider>
              <AppRevolutionWrapper>{children}</AppRevolutionWrapper>
            </AuthProvider>
          </AppShell>
        </EventStreamProvider>
      </QueryProvider>
    </AuthKitShell>
  );
}
