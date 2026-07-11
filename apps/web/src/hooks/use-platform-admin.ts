'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi, type PlatformMe } from '@/lib/admin-api';
import { getAuthToken } from '@/lib/api';

export function usePlatformAdmin() {
  const token = typeof window !== 'undefined' ? getAuthToken() : null;
  const query = useQuery({
    queryKey: ['platform-admin-me', token],
    queryFn: async (): Promise<PlatformMe> => {
      try {
        return await adminApi.me();
      } catch {
        // Soft-fail: never surface as a hard error for non-admins / transient failures
        return {
          isPlatformAdmin: false,
          email: '',
          userId: '',
          role: null,
          permissions: [],
          viaBreakGlass: false,
          environment: process.env.NODE_ENV ?? 'development',
        };
      }
    },
    enabled: Boolean(token),
    retry: false,
    staleTime: 60_000,
  });

  const me = query.data;
  const isPlatformAdmin = Boolean(me?.isPlatformAdmin);
  const hasPermission = (permission: string) => Boolean(me?.permissions?.includes(permission));

  return {
    ...query,
    me,
    isPlatformAdmin,
    hasPermission,
    role: me?.role ?? null,
    environment: me?.environment ?? 'development',
    // Never treat probe failures as page errors
    isError: false,
    error: null,
  };
}
