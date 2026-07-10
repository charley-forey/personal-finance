# ADR 001: Authentication with WorkOS

## Status

Accepted

## Context

Personal Finance OS needs multi-tenant authentication for consumers and future enterprise orgs. WorkOS AuthKit already issues user JWTs verified against WorkOS JWKS. Enterprise SAML/OIDC SSO and SCIM are roadmap items (WP-031), not live product surfaces.

## Decision

1. **Primary auth:** WorkOS AuthKit JWT (`Authorization: Bearer <jwt>`), resolved to an internal `AuthContext` via `AuthService.resolveContext`.
2. **Dev auth:** `Bearer dev:<orgId>:<userId>:<role>` tokens only when `NODE_ENV` is not production.
3. **Machine auth:** Org API keys (`pf_…`) via `Authorization: Bearer pf_…` or `X-Api-Key`, validated by `ApiKeyService.validate` inside `AuthGuard`.
4. **Enterprise SSO:** Remain disabled until WorkOS Organization SSO connections are configured per org. `GET /compliance/sso-config` returns `enabled: false`, `status: 'not_configured'`.

## Consequences

- User sessions and API keys share the same `AuthContext` shape; API-key principals use synthetic `userId` / `workosUserId` prefixed with `api-key:`.
- SSO config must stay honest — never advertise `enabled: true` without a real connection.
- SCIM stays `scimEnabled: false` until provisioning is implemented.
