---
title: "Users / User Apis"
source_url: "https://plaid.com/docs/api/users/user-apis/"
section: "Fundamentals"
section_id: "06-fundamentals"
slug: "users--user-apis"
endpoints:
  - "/user/create"
  - "/user/update"
  - "/user/remove"
  - "/user/get"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# User APIs

> **Source:** [https://plaid.com/docs/api/users/user-apis/](https://plaid.com/docs/api/users/user-apis/)
> **Section:** Fundamentals

## Endpoints & Webhooks on this page

- `/user/create`
- `/user/update`
- `/user/remove`
- `/user/get`

---

# User APIs

#### Information on new user APIs

Plaid is updating our APIs to support the next generation of user-based products - such as Plaid Protect - and to create a more unified and consistent experience across our platform. These updates improve multi-product compatibility, simplify debugging, and ensure user identifiers behave consistently across all Plaid products. If you're beginning a new Plaid Check Consumer Report (CRA) or Multi-Item Link integration in December 2025 or later, you'll use these updated APIs to build your integration.

If you are an existing customer using Plaid Check, Plaid Income Verification, or Multi-Item Link as of December 10, 2025, here's what you need to know:

- **Your existing integration remains fully supported.** Plaid is not removing support and your integration will continue to function as expected.
- **Optional migration is now available for Plaid Check and Multi-Item Link customers.** See the [migration guide](/docs/api/users/migrate-to-new-user-apis/) for step-by-step instructions.

[#### What's new](/docs/api/users/user-apis/#whats-new)[##### Updates to user creation and identification](/docs/api/users/user-apis/#updates-to-user-creation-and-identification)

- When calling [`/user/create`](/docs/api/users/#usercreate), the response includes a single `user_id` instead of a `user_token` and a `user_id`. This `user_id` is used instead of the `user_token` to identify the user throughout the Plaid API, including when calling API endpoints or when receiving webhooks.
  - A `user_id` created on the new API (prefixed with `usr_`) is not equivalent to a `user_id` (not prefixed with `usr_`) created on the old API. If you have not yet migrated to the updated user APIs, you cannot use a `user_id` in place of a `user_token` for endpoints that accept either identifier.
- [`/user/create`](/docs/api/users/#usercreate) is now idempotent. In the old flow, when [`/user/create`](/docs/api/users/#usercreate) was called on a `client_user_id` more than once, it would return an error; it now returns the same `user_id` as the original call.
- The user schema has an `identity` object (instead of the `consumer_report_user_identity` object), which is used in the [`/user/create`](/docs/api/users/#usercreate) and [`/user/update`](/docs/api/users/#userupdate) request bodies. This `identity` object has a different schema than the `consumer_report_user_identity` object.

[##### Changes to user management](/docs/api/users/user-apis/#changes-to-user-management)

- In the old flow, a `client_user_id` could never be re-used to create a new user, even if the user token was deleted with [`/user/remove`](/docs/api/users/#userremove). In the new flow, once [`/user/remove`](/docs/api/users/#userremove) has been called on a `user_id`, a new user can be created for the same `client_user_id` by calling [`/user/create`](/docs/api/users/#usercreate).
- The endpoint [`/user/get`](/docs/api/users/#userget) has been added, allowing you to retrieve identity details about a user that you have previously created.

[##### Other changes](/docs/api/users/user-apis/#other-changes)

- The webhooks `CHECK_REPORT_READY` and `CHECK_REPORT_FAILED` have been renamed to `USER_CHECK_REPORT_READY` and `USER_CHECK_REPORT_FAILED`.
- For Cash Flow Insights (beta) customers, the different Insights webhooks have been replaced by a single webhook, `CASH_FLOW_INSIGHTS_UPDATED`, with an `insights` payload field listing all of the insights received.

Existing customers who are migrating will receive both the new and old sets of webhooks in parallel during migration, allowing you to cut over at your own pace.

[#### Who gets the new user APIs](/docs/api/users/user-apis/#who-gets-the-new-user-apis)

As of December 10, 2025, all Plaid customers will experience the new user API behavior by default, with the following exceptions:

- Any existing Plaid customers who ever used the [`/user/create`](/docs/api/users/#usercreate) endpoint in either Sandbox or Production as of December 10, 2025, will automatically be kept on the old user API behavior, to avoid breaking changes. This group includes all existing and currently integrating customers of Consumer Report, Multi-Item Link, and/or Income Verification.
- New customers of the legacy [Plaid Income Verification](/docs/income/) product should contact sales, Support, or their account manager to request access to the old user APIs. Note that this applies only to the legacy Plaid Income Verification product; it does not apply to the Plaid Check Consumer Report Income modules, such as Base Report and Income Insights.

If you aren't sure whether you have the new or old API, call [`/user/create`](/docs/api/users/#usercreate).

- In the new API, the response will not include a `user_token`, and your `user_id` will be formatted with the prefix `usr_`.
- In the old API, the response will include a `user_token`, and the `user_id` will not contain a prefix.

[#### Client library version requirements](/docs/api/users/user-apis/#client-library-version-requirements)

To use the new user APIs with a Plaid client library, the minimum client library versions are:

- Python: 38.0.0
- Go: 41.0.0
- Java: 39.0.0
- Node: 41.0.0
- Ruby: 45.0.0

[#### Summary](/docs/api/users/user-apis/#summary)

**New clients integrating with Plaid Check or Multi-Item Link** beginning December 10, 2025 or later should use the new `user_id` based implementation currently described in the docs.

**Existing users of other Plaid products** who are integrating with Plaid Check or Multi-Item Link for the first time beginning December 10, 2025 or later should use the new `user_id` based implementation currently described in the docs. They may also need to [update their client library versions](/docs/api/users/user-apis/#client-library-version-requirements).

**New clients using Plaid's legacy (non-CRA) Bank Income product** for the first time beginning December 10, 2025 or later should contact their account manager or file a support ticket via the Dashboard to request access to the `user_token` field.

**Existing clients already using Plaid Check or Multi-Item Link products** can now optionally migrate to the new user APIs. Migration is recommended but not required â your existing integration will continue to function. See the [migration guide](/docs/api/users/migrate-to-new-user-apis/) for step-by-step instructions. During migration, you will receive both the legacy and new webhook events in parallel until you complete the cutover.

If you have questions about migration readiness or how the new user APIs might benefit your integration, contact your Plaid account manager.
