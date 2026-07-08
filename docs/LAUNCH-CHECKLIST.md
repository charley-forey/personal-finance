# Launch Checklist

## Environment

- [ ] Production `.env` configured (database, Redis, WorkOS, Plaid, Stripe, SendGrid, S3)
- [ ] `NEXT_PUBLIC_API_URL` points to production API
- [ ] Secrets rotated from development values

## Database

- [ ] Migrations applied (`npm run db:migrate`)
- [ ] Backup and restore procedure documented

## Build & deploy

- [ ] `npm run build` passes in CI
- [ ] API health check returns `database: connected`
- [ ] Worker process running and connected to Redis

## Auth & billing

- [ ] WorkOS redirect URIs match production domains
- [ ] Stripe webhooks configured for production
- [ ] Plan limits verified for free and paid tiers

## Monitoring

- [ ] Error tracking (Sentry) enabled
- [ ] Log aggregation and alerts configured
- [ ] Uptime checks on `/health` and web app

## Pre-launch smoke test

- [ ] Sign in via WorkOS
- [ ] Link a bank account (Plaid sandbox or production)
- [ ] Dashboard loads net worth and cash flow
- [ ] Notifications and weekly digest job run without errors

## Compliance

- [ ] Privacy policy and terms published
- [ ] GDPR export and account deletion flows tested
- [ ] Audit log retention policy in place
