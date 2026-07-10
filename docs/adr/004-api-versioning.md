# ADR 004: API versioning

## Status

Accepted

## Context

The Nest API currently exposes an unversioned surface at the root (e.g. `/accounts`, `/agents/chat`). Clients (web app, workers) depend on these paths. Introducing a hard `/v1` break would churn every consumer.

## Decision

1. **Current contract:** The unversioned root surface **is** API v1.
2. **Planned alias:** Add an optional `/v1` prefix (global prefix or route alias) that mirrors the same handlers without removing root paths.
3. **Breaking changes:** Require a new major (`/v2`) or explicit deprecation window; do not silently change v1 semantics.
4. **Documentation:** OpenAPI (`/docs`) remains the machine-readable contract; this ADR is the human policy.

## Consequences

- Until `/v1` is mounted, treat root paths as stable v1.
- New public integrations should prefer documenting `/v1/...` once the alias ships; internal web may keep root paths during the dual-serve period.
