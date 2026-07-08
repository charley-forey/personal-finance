import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

const redirectUri =
  process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI ||
  process.env.WORKOS_REDIRECT_URI ||
  'http://localhost:3000/callback';

export default authkitMiddleware({
  redirectUri,
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: ['/callback', '/sign-in', '/login'],
  },
});

export const config = {
  matcher: ['/app', '/app/:path*', '/callback', '/sign-in', '/login'],
};
