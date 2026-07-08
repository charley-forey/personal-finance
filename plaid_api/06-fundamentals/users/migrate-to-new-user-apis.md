---
title: "Users / Migrate To New User Apis"
source_url: "https://plaid.com/docs/api/users/migrate-to-new-user-apis/"
section: "Fundamentals"
section_id: "06-fundamentals"
slug: "users--migrate-to-new-user-apis"
endpoints:
  - "/user/create"
  - "/link/token/create"
  - "/user/get"
  - "/user/remove"
  - "Update webhook handling"
  - "webhook retries"
  - "/cra/check_report/base_report/get"
  - "/cra/check_report/create"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Migrate to new User APIs

> **Source:** [https://plaid.com/docs/api/users/migrate-to-new-user-apis/](https://plaid.com/docs/api/users/migrate-to-new-user-apis/)
> **Section:** Fundamentals

## Endpoints & Webhooks on this page

- `/user/create`
- `/link/token/create`
- `/user/get`
- `/user/remove`
- `Update webhook handling`
- `webhook retries`
- `/cra/check_report/base_report/get`
- `/cra/check_report/create`

---

# Migrate to new User APIs

#### Migration guide for existing Consumer Report integrations on legacy User APIs

This guide is for customers who integrated with Consumer Report by Plaid Check (CRA) prior to December 2025. It explains how to migrate your integration from the legacy User APIs and CRA API endpoints (which use `user_token` as the primary identifier) to the new User APIs and updated CRA API endpoints. Migration is optional â your existing integration will continue to work, and there is currently no deadline to migrate.

This migration guide applies only to Plaid Check Consumer Report (CRA) customers. If you use the legacy [Plaid Income Verification](/docs/income/) product (non-CRA Bank Income), migration is not yet available. Contact your account manager for timing updates.

[#### Are you on the legacy API?](/docs/api/users/migrate-to-new-user-apis/#are-you-on-the-legacy-api)

All clients who began using [`/user/create`](/docs/api/users/#usercreate) on or after December 10, 2025 are on the new User API by default and no migration is needed. If you aren't sure, call [`/user/create`](/docs/api/users/#usercreate) without `with_upgraded_user: true`. If the response does not include a `user_token`, your client is on the new API by default. If the response includes a `user_token`, then you are eligible to migrate, if you haven't done so already.

[#### Overview](/docs/api/users/migrate-to-new-user-apis/#overview)

Plaid's new User APIs introduce a unified user identifier, `user_id`, that is consistent across all Plaid user-based products. For existing CRA customers, the migration has two parts depending on whether a user already exists in your system:

**Users you have already created** have a stored `user_token` (format: `user-production-*`). After migration, pass that `user_token` value in the `user_id` field of all CRA API requests and webhook correlation. No changes are needed to the users themselves.

**New users created after migration** use the updated [`/user/create`](/docs/api/users/#usercreate) schema, which returns a `user_id` (prefixed with `usr_`) instead of a `user_token`. Use that `user_id` in all subsequent API calls.

The old [`/user/create`](/docs/api/users/#usercreate) response returned both a `user_token` and a legacy `user_id` (an unprefixed string, distinct from the `usr_*`-prefixed `user_id` used in the new APIs). After migration, set the value of the `user_id` field in API requests to your stored `user_token` â not the legacy `user_id`.

[#### What's changing](/docs/api/users/migrate-to-new-user-apis/#whats-changing)

To migrate, you will need to:

- **Replace `user_token` with `user_id`** in all CRA API calls, [`/link/token/create`](/docs/api/link/#linktokencreate), and webhook correlation. For existing users, set the value of the `user_id` field to your stored `user_token` value.
- **Update [`/user/create`](/docs/api/users/#usercreate)** to include `with_upgraded_user: true` and replace `consumer_report_user_identity` with the new `identity` schema. [`/user/create`](/docs/api/users/#usercreate) is now idempotent: if you call it with a `client_user_id` that already exists, it returns the existing `user_id` rather than an error.
- **Update webhook handling** to listen for `USER_CHECK_REPORT_READY` and `USER_CHECK_REPORT_FAILED` instead of `CHECK_REPORT_READY` and `CHECK_REPORT_FAILED`. Cash Flow Updates webhooks are consolidated into a single `CASH_FLOW_INSIGHTS_UPDATED` event.
- **Use the new [`/user/get`](/docs/api/users/#userget) endpoint** to retrieve identity details about any user, including those created via the legacy User API.

For full details, see [New User API overview](/docs/api/users/user-apis/) and the migration steps below.

[#### Migration steps](/docs/api/users/migrate-to-new-user-apis/#migration-steps)[##### Update your Plaid client library SDK](/docs/api/users/migrate-to-new-user-apis/#update-your-plaid-client-library-sdk)

Before making any API changes, upgrade your Plaid client library SDK to the minimum version listed below. Older versions do not support the new request schemas and will return errors.

Minimum required versions:

- Node.js: 41.0.0
- Python: 38.0.0
- Go: 41.0.0
- Java: 39.0.0
- Ruby: 45.0.0

[##### Handle existing users](/docs/api/users/migrate-to-new-user-apis/#handle-existing-users)

For users you created via the legacy [`/user/create`](/docs/api/users/#usercreate), you have a stored `user_token` (format: `user-production-*`). When making API calls for them:

- Pass your stored `user_token` value in the `user_id` field for all CRA API requests and webhook correlation.
- Do not use the legacy `user_id` from the old [`/user/create`](/docs/api/users/#usercreate) response â that value is not used for CRA integration after migration.

[##### Create new users with the new User API](/docs/api/users/migrate-to-new-user-apis/#create-new-users-with-the-new-user-api)

For new users, call [`/user/create`](/docs/api/users/#usercreate) with the following changes:

- Include `with_upgraded_user: true` in the request body.
- Replace `consumer_report_user_identity` with an `identity` object containing `name`, `emails`, `addresses`, `phone_numbers`, `date_of_birth`, and optionally `id_numbers` (last 4 SSN digits).
- The response returns a single `user_id` â there is no `user_token`. Store this `user_id` as the identifier for all subsequent API calls and webhooks.

/user/create with new User API schema

```
curl -X POST https://sandbox.plaid.com/user/create \
  -H 'Content-Type: application/json' \
  -d '{
    "client_id": "${PLAID_CLIENT_ID}",
    "secret": "${PLAID_SECRET}",
    "client_user_id": "c0e2c4ee-b763-4af5-cfe9-46a46bce883d",
    "with_upgraded_user": true,
    "identity": {
      "name": {
        "given_name": "Carmen",
        "family_name": "Berzatto"
      },
      "date_of_birth": "1987-01-31",
      "emails": [
        { "data": "carmen@example.com", "primary": true }
      ],
      "phone_numbers": [
        { "data": "+13125551212", "primary": true }
      ],
      "addresses": [
        {
          "street_1": "3200 W Armitage Ave",
          "city": "Chicago",
          "region": "IL",
          "country": "US",
          "postal_code": "60657",
          "primary": true
        }
      ],
      "id_numbers": [
        { "value": "1234", "type": "us_ssn_last_4" }
      ]
    }
  }'
```

[`/user/create`](/docs/api/users/#usercreate) is now idempotent. If you call it with a `client_user_id` that already exists, it returns the existing `user_id` with a `200` status rather than an error; if you include an `identity` object in that call, it will be attached to the existing user. If the `client_user_id` is new, a new `user_id` is created and returned with a `201` status.

Additionally, in the old flow a `client_user_id` could never be reused to create a new user, even after calling [`/user/remove`](/docs/api/users/#userremove). In the new flow, once [`/user/remove`](/docs/api/users/#userremove) has been called on a `user_id`, you can call [`/user/create`](/docs/api/users/#usercreate) again with the same `client_user_id` to create a new user.

When calling the new [`/user/create`](/docs/api/users/#usercreate) with a `client_user_id` that was previously created via the legacy API, the response `user_id` may be in `user-production-*` format rather than `usr_*` format. This is expected â [`/user/create`](/docs/api/users/#usercreate) returns the existing user with a `200`, and since that user was originally created via the legacy API, its `user_token` has simply become the new `user_id`.

For full schema details, see [Updates to user creation and identification](/docs/api/users/user-apis/#updates-to-user-creation-and-identification) and [[`/user/create`](/docs/api/users/#usercreate)](/docs/api/users/#usercreate).

[##### Update Link token creation](/docs/api/users/migrate-to-new-user-apis/#update-link-token-creation)

In [`/link/token/create`](/docs/api/link/#linktokencreate), replace the top-level `user_token` field with `user_id`. For existing users, pass your stored `user_token` value in `user_id`. For new users, pass the `user_id` returned by [`/user/create`](/docs/api/users/#usercreate). The `user` object is no longer required.

Before migration

```
curl -X POST https://sandbox.plaid.com/link/token/create \
  -H 'Content-Type: application/json' \
  -d '{
    "client_id": "${PLAID_CLIENT_ID}",
    "secret": "${PLAID_SECRET}",
    "user": {
      "client_user_id": "client-user-id-12345"
    },
    "user_token": "user-sandbox-b0e2c4ee-a763-4df5-bfe9-46a46bce993d",
    "products": ["cra_base_report", "cra_income_insights", "cra_network_insights"],
    "webhook": "${WEBHOOK_URL}",
    "client_name": "Name of App",
    "consumer_report_permissible_purpose": "ACCOUNT_REVIEW_CREDIT",
    "country_codes": ["US"],
    "language": "en",
    "cra_options": {
      "days_requested": 365,
      "base_report": {
        "client_report_id": "unique_base_report_id"
      }
    }
  }'
```

After migration

```
curl -X POST https://sandbox.plaid.com/link/token/create \
  -H 'Content-Type: application/json' \
  -d '{
    "client_id": "${PLAID_CLIENT_ID}",
    "secret": "${PLAID_SECRET}",
    "user_id": "user-sandbox-b0e2c4ee-a763-4df5-bfe9-46a46bce993d",
    "products": ["cra_base_report", "cra_income_insights", "cra_network_insights"],
    "webhook": "${WEBHOOK_URL}",
    "client_name": "Name of App",
    "consumer_report_permissible_purpose": "ACCOUNT_REVIEW_CREDIT",
    "country_codes": ["US"],
    "language": "en",
    "cra_options": {
      "days_requested": 365,
      "base_report": {
        "client_report_id": "unique_base_report_id"
      }
    }
  }'
```

[##### Update webhook handling](/docs/api/users/migrate-to-new-user-apis/#update-webhook-handling)

Update your application to handle the renamed webhook events:

| Legacy webhook | New webhook |
| --- | --- |
| `CHECK_REPORT_READY` | `USER_CHECK_REPORT_READY` |
| `CHECK_REPORT_FAILED` | `USER_CHECK_REPORT_FAILED` |
| `INSIGHTS_UPDATED` / `LARGE_DEPOSIT_DETECTED` / `LOW_BALANCE_DETECTED` / `NEW_LOAN_PAYMENT_DETECTED` / `NSF_OVERDRAFT_DETECTED` | `CASH_FLOW_INSIGHTS_UPDATED` |

The `user_id` field in the new webhooks is set to your stored `user_token` value for existing users, and to the `usr_*`-prefixed `user_id` for users created with the new User API.

As of April 1, 2026, existing customers on the legacy APIs automatically began receiving both the new and legacy versions of revised webhooks in parallel. This means you can update your webhook handling at your own pace â your existing integration continues to work throughout. Once you have switched to the new webhook events, you can safely ignore the legacy ones. Recommended approach:

- **HTTP layer:** Always return a `2xx` status code for all incoming webhooks. If there is no `200` response or no response within 10 seconds, Plaid retries delivery for up to 24 hours. See [webhook retries](/docs/api/webhooks/#webhook-retries).
- **Application layer:** Route events by `webhook_type` and `webhook_code`. Safely ignore any `webhook_type` values your application does not handle.

[##### Retrieve reports for existing users](/docs/api/users/migrate-to-new-user-apis/#retrieve-reports-for-existing-users)

For existing users, pass your stored `user_token` value in the `user_id` field when calling [`/cra/check_report/base_report/get`](/docs/api/products/check/#cracheck_reportbase_reportget), [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate), and other CRA endpoints. The response is identical â only the field name in the request changes.

Before migration

```
curl -X POST https://sandbox.plaid.com/cra/check_report/base_report/get \
  -H 'Content-Type: application/json' \
  -d '{
    "client_id": "${PLAID_CLIENT_ID}",
    "secret": "${PLAID_SECRET}",
    "user_token": "user-sandbox-b0e2c4ee-a763-4df5-bfe9-46a46bce993d"
  }'
```

After migration

```
curl -X POST https://sandbox.plaid.com/cra/check_report/base_report/get \
  -H 'Content-Type: application/json' \
  -d '{
    "client_id": "${PLAID_CLIENT_ID}",
    "secret": "${PLAID_SECRET}",
    "user_id": "user-sandbox-b0e2c4ee-a763-4df5-bfe9-46a46bce993d"
  }'
```

For new users, pass the `user_id` returned by [`/user/create`](/docs/api/users/#usercreate) in the `user_id` field.

[#### Testing the migration](/docs/api/users/migrate-to-new-user-apis/#testing-the-migration)

You do not need to create new users to test the migrated API path. Any existing user's `user_token` can be used directly as the `user_id` in the new API fields.

1. Pick any test user already created via the legacy [`/user/create`](/docs/api/users/#usercreate) endpoint. You'll have a stored `user_token` (format: `user-sandbox-*` in Sandbox, `user-production-*` in Production).
2. Pass that `user_token` value into the `user_id` field in new API calls, for example:
   - [`/link/token/create`](/docs/api/link/#linktokencreate) â `user_id` field
   - [`/cra/check_report/base_report/get`](/docs/api/products/check/#cracheck_reportbase_reportget) â `user_id` field
   - [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate) â `user_id` field
3. Listen for `USER_CHECK_REPORT_READY` and `USER_CHECK_REPORT_FAILED` webhook events and confirm the `user_id` field in the payload matches your stored `user_token`.

You can validate the full new flow end-to-end using only existing users in your system, without committing to production migration or creating new users.

[#### Compatibility: legacy users vs. new users](/docs/api/users/migrate-to-new-user-apis/#compatibility-legacy-users-vs-new-users)

**Users created via the legacy [`/user/create`](/docs/api/users/#usercreate) endpoint** (those with a `user-*` format `user_token`) are compatible with both the legacy and new APIs. Their `user_token` value can be passed into the old `user_token` fields or the new `user_id` fields interchangeably during migration. Note that the legacy `user_id` (an unprefixed string also returned by the old [`/user/create`](/docs/api/users/#usercreate)) is not the same as the `user_token` and is not compatible with either the legacy or new API fields â do not use it.

**Users created via the new [`/user/create`](/docs/api/users/#usercreate)** (with `with_upgraded_user: true`) receive a `user_id` with a `usr_*` prefix. These users only work with the new APIs â you cannot pass their `user_id` into legacy fields like `user_token` in [`/link/token/create`](/docs/api/link/#linktokencreate) or [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate). If you use the new [`/user/create`](/docs/api/users/#usercreate) flow in a test environment, make sure your code is already updated to use the new field names.
