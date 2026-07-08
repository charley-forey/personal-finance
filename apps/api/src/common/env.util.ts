export function isDevelopment(): boolean {
  return process.env.NODE_ENV !== 'production';
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function getPlatformAdminEmails(): string[] {
  const raw = process.env.PLATFORM_ADMIN_EMAILS ?? '';
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isPlatformAdmin(email: string): boolean {
  const admins = getPlatformAdminEmails();
  if (!admins.length) return isDevelopment();
  return admins.includes(email.toLowerCase());
}
