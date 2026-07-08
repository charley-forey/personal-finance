# Personal Finance OS

Enterprise-grade multi-tenant personal finance SaaS. Link accounts via Plaid, track all financial data over time, and get AI insights, forecasts, and domain-expert agents.

## Stack

- **Frontend**: Next.js 15 (Vercel)
- **API**: NestJS (Railway)
- **Workers**: BullMQ + Redis
- **Database**: PostgreSQL 16 + pgvector
- **Auth**: WorkOS AuthKit (demo mode included)
- **Plaid**: Official Node SDK with cursor-based sync

## Quick Start

### Prerequisites

- Node.js 20+
- Docker (for Postgres + Redis)

### 1. Start infrastructure

```bash
docker compose up -d
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy `.env.example` to `.env` and fill in your Plaid credentials:

```bash
cp .env.example .env
```

Copy values from your existing `app/.env` for Plaid keys.

### 4. Push database schema

```bash
npm run db:push
```

### 5. Run development servers

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
