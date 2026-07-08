import type { NextConfig } from 'next';
import path from 'path';
import { config } from 'dotenv';

config({ path: path.join(__dirname, '../../.env') });

const workosRedirectUri =
  process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI ||
  process.env.WORKOS_REDIRECT_URI ||
  'http://localhost:3000/callback';

const apiUrl = process.env.API_URL ?? 'http://localhost:3001';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: ['@pf/shared'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  async rewrites() {
    return [
      {
        source: '/webhooks/plaid',
        destination: `${apiUrl}/webhooks/plaid`,
      },
    ];
  },
  env: {
    NEXT_PUBLIC_WORKOS_REDIRECT_URI: workosRedirectUri,
    NEXT_PUBLIC_WORKOS_CLIENT_ID:
      process.env.NEXT_PUBLIC_WORKOS_CLIENT_ID ?? process.env.WORKOS_CLIENT_ID ?? '',
    WORKOS_API_KEY: process.env.WORKOS_API_KEY ?? '',
    WORKOS_CLIENT_ID: process.env.WORKOS_CLIENT_ID ?? '',
    WORKOS_COOKIE_PASSWORD: process.env.WORKOS_COOKIE_PASSWORD ?? '',
  },
};

export default nextConfig;
