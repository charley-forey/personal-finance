# ADR 002: Multi-tenancy

## Status

Accepted

## Context

All financial data is org-scoped. Users belong to organizations through `organization_members`. Plaid items, transactions, insights, and recommendations all carry `org_id`.

## Decision

1. **Tenant key:** `organizations.id` (UUID) is the tenancy boundary.
2. **Request scope:** Every authenticated request resolves `auth.orgId`; services and queries must filter by that org.
3. **Membership roles:** `owner` > `admin` > `viewer`, enforced by `RolesGuard` / `@RequireRoles`.
4. **API keys:** Bound to a single org; scopes map to roles (`admin`→owner, `write`→admin, else viewer).
5. **Cross-tenant access:** Forbidden except platform-admin tooling (`PLATFORM_ADMIN_EMAILS`) for support operations.

## Consequences

- Controllers must call `getAuth(req)` and never trust client-supplied org IDs for authorization.
- Advisor portal firm/client linking is scaffolding only and does not grant cross-org data access until delegated access is designed.
- Tenant isolation tests (`tenant-isolation.test.ts`) remain a release gate.
