# Personal Finance OS

Enterprise-grade multi-tenant personal finance SaaS. Link accounts via Plaid, track all financial data over time, and get AI insights, forecasts, and domain-expert agents.

## Stack

- **Frontend**: Next.js 15 (Vercel)
- **API**: NestJS (Railway)
- **Workers**: BullMQ + Redis
- **Database**: PostgreSQL 16 + pgvector
- **Auth**: WorkOS AuthKit (production-ready)
- **Plaid**: Official Node SDK with cursor-based sync

## Quick Start

### Prerequisites

- Node.js 20+
- Docker (for Postgres + Redis)

### 1. Clone and enter the project

The local folder is `charley-forey` (GitHub repo name is `personal-finance`):

```bash
git clone https://github.com/charley-forey/personal-finance.git charley-forey
cd charley-forey
npm install
cp .env.example .env   # then add your Plaid keys
```

### 2. Start infrastructure

**Start Docker Desktop first**, then:

```bash
docker compose up -d
```

To stop containers: `docker compose down` (not `docker down`).

Postgres runs on host port **5433** (not 5432) to avoid conflicting with a local PostgreSQL install on Windows.

### 3. Push database schema

```bash
npm run db:push
```

### 4. Run development servers

```bash
# Terminal 1 — API
npm run dev:api

# Terminal 2 — Web
npm run dev:web

# Terminal 3 — Workers (optional)
npm run dev:worker
```

- Web: http://localhost:3000
- API: http://localhost:3001
- Swagger: http://localhost:3001/docs

## Production testing (Plaid + WorkOS)

### WorkOS dashboard

In [WorkOS Dashboard → Redirects](https://dashboard.workos.com), set:

| Setting | Value |
|---------|-------|
| Redirect URI | `http://localhost:3000/callback` |
| Sign-in endpoint | `http://localhost:3000/sign-in` |
| Logout URI | `http://localhost:3000` |

Your root `.env` needs:

```env
WORKOS_API_KEY=sk_live_...
WORKOS_CLIENT_ID=client_...
WORKOS_COOKIE_PASSWORD=<32+ char random string>
WORKOS_REDIRECT_URI=http://localhost:3000/callback
NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/callback
NEXT_PUBLIC_WORKOS_CLIENT_ID=client_...
```

Sign in at http://localhost:3000/login — you'll be redirected through WorkOS AuthKit, then back to `/app`.

### Plaid production

Set in `.env`:

```env
PLAID_ENV=production
PLAID_SECRET=<production secret from Plaid dashboard>
PLAID_REDIRECT_URI=http://localhost:3000/app
PLAID_WEBHOOK_URL=https://<your-tunnel>/webhooks/plaid
NEXT_PUBLIC_PLAID_ENV=production
```

**Important for local dev:**

1. **Webhooks** — Plaid must reach your API. Expose port 3001 with a tunnel, e.g. `ngrok http 3001`, then set `PLAID_WEBHOOK_URL` to `https://<id>.ngrok.io/webhooks/plaid` and register that URL in the [Plaid dashboard](https://dashboard.plaid.com/developers/webhooks).
2. **OAuth banks** — Register `http://localhost:3000/app` as an allowed redirect URI in Plaid → Team Settings → API.
3. **Real accounts** — Production links real bank credentials. Start with one institution to verify sync.

## Project Structure

```
apps/
  web/          Next.js frontend
  api/          NestJS REST API
packages/
  database/     Drizzle schema (14 layers)
  shared/       Types and utilities
  plaid-client/ Plaid SDK wrapper
  analytics/    Monte Carlo, tax, FIRE, health score
  ai/           OpenAI agents and embeddings
  events/       Domain event types
workers/        BullMQ background jobs
content/knowledge/  RAG knowledge base
plaid_api/      Plaid API reference docs
```

## Features

- Plaid Link bank connection with encrypted token storage
- Transaction sync with cursor persistence
- Net worth tracking with daily snapshots
- Monthly P&L table tracker
- Budgets, goals, investments, liabilities
- Monte Carlo retirement simulation
- Tax estimation engine
- Debt payoff optimizer (avalanche/snowball)
- FIRE calculator
- AI insights and domain agents (tax, retirement, budget, investment, CFO)
- Financial health score
- Automation rules engine
- Document vault, manual assets, life planners
- Multi-tenant org model with RBAC

## Deployment

- **Vercel**: Deploy `apps/web` with root directory set to `apps/web`
- **Railway**: Deploy `apps/api` and `workers` with Postgres + Redis services
- Set all env vars from `.env.example`

## License

Private — charley-forey/personal-finance
