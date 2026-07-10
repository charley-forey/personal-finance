import { AppShell } from '@/components/app-shell';
import { AuthKitShell } from '@/components/authkit-shell';
import { AuthProvider } from '@/components/auth-provider';
import { QueryProvider } from '@/components/query-provider';
import { EventStreamProvider } from '@/components/event-stream-provider';
import { AppRevolutionWrapper } from '@/components/app-revolution-wrapper';
import { ToastUndoProvider } from '@/components/toast-undo';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthKitShell>
      <QueryProvider>
        <ToastUndoProvider>
          <EventStreamProvider>
            <AppShell>
              <AuthProvider>
                <AppRevolutionWrapper>{children}</AppRevolutionWrapper>
              </AuthProvider>
            </AppShell>
          </EventStreamProvider>
        </ToastUndoProvider>
      </QueryProvider>
    </AuthKitShell>
  );
}
