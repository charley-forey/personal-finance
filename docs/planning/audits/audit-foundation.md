# Audit: Foundation & Data (A01)

**Score: 4.2/10** — 56 tables, broad domain model; missing learning loops, pgvector native, event handlers.

## Key findings

- 47 wired / 8 partial / 1 orphan tables
- No `categorization_corrections`, `insight_feedback`, `user_signals` (now added in WP-002)
- pgvector: embeddings stored as text JSON
- `processDomainEvents` is stub (marks processed, no handlers)
- 12 event types; only 4 persisted today

## Initiatives: WP-001 through WP-013

## Quick wins

Emit `transaction.created`, add FK on `transactions.category_id`, align README to `db:migrate`.

*Agent A01 — Wave 1*
