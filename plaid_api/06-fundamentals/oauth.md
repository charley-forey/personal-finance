---
title: "OAuth"
source_url: "https://plaid.com/docs/api/oauth/"
section: "Fundamentals"
section_id: "06-fundamentals"
slug: "oauth"
endpoints:
  - "/oauth/token"
  - "/oauth/introspect"
  - "/oauth/revoke"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# OAuth

> **Source:** [https://plaid.com/docs/api/oauth/](https://plaid.com/docs/api/oauth/)
> **Section:** Fundamentals

## Endpoints & Webhooks on this page

- `/oauth/token`
- `/oauth/introspect`
- `/oauth/revoke`

---

# OAuth

#### API reference for Plaid OAuth endpoints

| Endpoints |  |
| --- | --- |
| [`/oauth/token`](/docs/api/oauth/#oauthtoken) | Create or refresh an OAuth access token |
| [`/oauth/introspect`](/docs/api/oauth/#oauthintrospect) | Get metadata about an OAuth token |
| [`/oauth/revoke`](/docs/api/oauth/#oauthrevoke) | Revoke an OAuth token |

These endpoints are for customers, partners and services that are integrating with Plaid's OAuth service to obtain a token for sharing consumer reports or accessing the Plaid Dashboard or other Plaid services. They are not used for the Plaid Link flow where end users connect their financial institution accounts to Plaid using a bank's OAuth service. If you are a Plaid customer trying to ensure your app supports OAuth-based bank connections, see the [OAuth Guide](/docs/link/oauth/) instead.

[### Endpoints](/docs/api/oauth/#endpoints)=\*=\*=\*=[#### `/oauth/token`](/docs/api/oauth/#oauthtoken)

[#### Create or refresh an OAuth access token](/docs/api/oauth/#create-or-refresh-an-oauth-access-token)

[`/oauth/token`](/docs/api/oauth/#oauthtoken) issues an access token and refresh token depending on the `grant_type` provided. This endpoint supports `Content-Type: application/x-www-form-urlencoded` as well as JSON. The fields for the form are equivalent to the fields for JSON and conform to the OAuth 2.0 specification.

/oauth/token

**Request fields**

The type of OAuth grant being requested:

`client_credentials` allows exchanging a client id and client secret for a refresh and access token.
`refresh_token` allows refreshing an access token using a refresh token. When using this grant type, only the `refresh_token` field is required (along with the `client_id` and `client_secret`).
`urn:ietf:params:oauth:grant-type:token-exchange` allows exchanging a subject token for an OAuth token. When using this grant type, the `audience`, `subject_token` and `subject_token_type` fields are required.
These grants are defined in their respective RFCs. `refresh_token` and `client_credentials` are defined in RFC 6749 and `urn:ietf:params:oauth:grant-type:token-exchange` is defined in RFC 8693.

Possible values: `refresh_token`, `urn:ietf:params:oauth:grant-type:token-exchange`, `client_credentials`

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body as either `secret` or `client_secret`.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body as either `secret` or `client_secret`.

A JSON string containing a space-separated list of scopes associated with this token, in the format described in <https://datatracker.ietf.org/doc/html/rfc6749#section-3.3>. Currently accepted values are:

`user:read` allows reading user data.
`user:write` allows writing user data.
`exchange` allows exchanging a token using the `urn:plaid:params:oauth:user-token` grant type.
`mcp:dashboard` allows access to the MCP dashboard server.

Refresh token for OAuth

URI of the target resource server

Used when exchanging a token. The meaning depends on the `subject_token_type`:

- For `urn:plaid:params:tokens:user`: Must be the same as the `client_id`.
- For `urn:plaid:params:oauth:user-token`: The other `client_id` to exchange tokens to.
- For `urn:plaid:params:credit:multi-user`: a `client_id` or one of the supported CRA partner URNs: `urn:plaid:params:cra-partner:experian`, `urn:plaid:params:cra-partner:fannie-mae`, or `urn:plaid:params:cra-partner:freddie-mac`.

Token representing the subject. The meaning depends on the `subject_token_type`. For `urn:plaid:params:tokens:user`, the `subject_token` must be a Plaid-issued user token from the `/user/create` endpoint. For `urn:plaid:params:oauth:user-token`, the `subject_token` must be an OAuth refresh token issued from the `/oauth/token` endpoint.

The type of the subject token.
`urn:plaid:params:tokens:user` allows exchanging a Plaid-issued user token for an OAuth token. When using this token type, `audience` must be the same as the `client_id`. `subject_token` must be a Plaid-issued user token issued from the `/user/create` endpoint.
`urn:plaid:params:oauth:user-token` allows exchanging a refresh token for an OAuth token to another `client_id`. The other `client_id` is provided in `audience`. `subject_token` must be an OAuth refresh token issued from the `/oauth/token` endpoint.
`urn:plaid:params:credit:multi-user` allows exchanging a Plaid-issued user token for an OAuth token. When using this token type, `audience` may be a client id or a supported CRA partner URN. `audience` supports a comma-delimited list of clients. When multiple clients are specified in the `audience` a multi-party token is created which can be used by all parties in the audience in conjunction with their `client_id` and `client_secret`.

Possible values: `urn:plaid:params:tokens:user`, `urn:plaid:params:oauth:user-token`, `urn:plaid:params:credit:multi-user`

/oauth/token

Nodeâ¼

```
const request = {
    grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
    scope: 'user:read',
    subject_token_type: 'urn:plaid:params:credit:multi-user',
    audience: 'urn:plaid:params:cra-partner:fannie-mae',
    subject_token: userId
};

try {
    const response = await client.oauthToken(request);
} catch (error) {
    ...
}
```

/oauth/token

**Response fields**

Access token for OAuth

Refresh token for OAuth

Type of token the access token is. Currently it is always Bearer

Time remaining in seconds before expiration.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "access_token": "pda-RDdg0TUCB0FB25_UPIlnhA==",
  "refresh_token": "pdr--viXurkDg88d5zf8m6Wl0g==",
  "expires_in": 900,
  "token_type": "Bearer",
  "request_id": "m8MDqcS6F3lzqvP"
}
```

=\*=\*=\*=[#### `/oauth/introspect`](/docs/api/oauth/#oauthintrospect)

[#### Get metadata about an OAuth token](/docs/api/oauth/#get-metadata-about-an-oauth-token)

[`/oauth/introspect`](/docs/api/oauth/#oauthintrospect) returns metadata about an access token or refresh token.

Note: This endpoint supports `Content-Type: application/x-www-form-urlencoded` as well as JSON. The fields for the form are equivalent to the fields for JSON and conform to the OAuth 2.0 specification.

/oauth/introspect

**Request fields**

An OAuth token of any type (`refresh_token`, `access_token`, etc)

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body as either `secret` or `client_secret`.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body as either `secret` or `client_secret`.

/oauth/introspect

Nodeâ¼

```
const request = {
  token: accessToken
};

try {
  const response = await client.oauthIntrospect(request);
} catch (error) {
    ...
}
```

/oauth/introspect

**Response fields**

Boolean indicator of whether or not the presented token is currently active. A `true` value indicates that the token has been issued, has not been revoked, and is within the time window of validity.

A JSON string containing a space-separated list of scopes associated with this token, in the format described in <https://datatracker.ietf.org/doc/html/rfc6749#section-3.3>. Currently accepted values are:

`user:read` allows reading user data.
`user:write` allows writing user data.
`exchange` allows exchanging a token using the `urn:plaid:params:oauth:user-token` grant type.
`mcp:dashboard` allows access to the MCP dashboard server.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Expiration time as UNIX timestamp since January 1 1970 UTC

Issued at time as UNIX timestamp since January 1 1970 UTC

Subject of the token

Audience of the token

Issuer of the token

Type of the token

User ID of the token

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "active": true,
  "scope": "user:read user:write exchange",
  "client_id": "68028ce48d2b0dec68747f6c",
  "exp": 1670000000,
  "iat": 1670000000,
  "sub": "68028ce48d2b0dec68747f6c",
  "aud": "https://production.plaid.com",
  "iss": "https://production.plaid.com",
  "token_type": "Bearer",
  "request_id": "m8MDqcS6F3lzqvP"
}
```

=\*=\*=\*=[#### `/oauth/revoke`](/docs/api/oauth/#oauthrevoke)

[#### Revoke an OAuth token](/docs/api/oauth/#revoke-an-oauth-token)

[`/oauth/revoke`](/docs/api/oauth/#oauthrevoke) revokes an access or refresh token, preventing any further use. If a refresh token is revoked, all access and refresh tokens derived from it are also revoked, including exchanged tokens.

Note: This endpoint supports `Content-Type: application/x-www-form-urlencoded` as well as JSON. The fields for the form are equivalent to the fields for JSON and conform to the OAuth 2.0 specification.

/oauth/revoke

**Request fields**

An OAuth token of any type (`refresh_token`, `access_token`, etc)

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body as either `secret` or `client_secret`.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body as either `secret` or `client_secret`.

/oauth/revoke

Nodeâ¼

```
const request = {
  token: accessToken
};

try {
  const response = await client.oauthRevoke(request);
} catch (error) {
    ...
}
```

/oauth/revoke

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "m8MDqcS6F3lzqvP"
}
```
