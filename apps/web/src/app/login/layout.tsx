import { AuthKitShell } from '@/components/authkit-shell';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <AuthKitShell>{children}</AuthKitShell>;
}
