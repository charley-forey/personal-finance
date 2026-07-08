---
title: "Items"
source_url: "https://plaid.com/docs/api/items/"
section: "Fundamentals"
section_id: "06-fundamentals"
slug: "items"
endpoints:
  - "/item/get"
  - "/item/remove"
  - "/item/webhook/update"
  - "/item/public_token/exchange"
  - "/item/access_token/invalidate"
  - "/sandbox/public_token/create"
  - "/sandbox/item/reset_login"
  - "/sandbox/item/set_verification_status"
  - "/sandbox/item/fire_webhook"
  - "ERROR"
  - "LOGIN_REPAIRED"
  - "NEW_ACCOUNTS_AVAILABLE"
  - "PENDING_DISCONNECT"
  - "PENDING_EXPIRATION"
  - "USER_PERMISSION_REVOKED"
  - "USER_ACCOUNT_REVOKED"
  - "WEBHOOK_UPDATE_ACKNOWLEDGED"
  - "/link/token/create"
  - "webhook"
  - "/transfer/migrate_account"
  - "last_webhook"
  - "/asset_report/remove"
  - "Update Webhook URL"
  - "Webhooks"
  - "webhook_type"
  - "webhook_code"
  - "new_webhook_url"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Items

> **Source:** [https://plaid.com/docs/api/items/](https://plaid.com/docs/api/items/)
> **Section:** Fundamentals

## Endpoints & Webhooks on this page

- `/item/get`
- `/item/remove`
- `/item/webhook/update`
- `/item/public_token/exchange`
- `/item/access_token/invalidate`
- `/sandbox/public_token/create`
- `/sandbox/item/reset_login`
- `/sandbox/item/set_verification_status`
- `/sandbox/item/fire_webhook`
- `ERROR`
- `LOGIN_REPAIRED`
- `NEW_ACCOUNTS_AVAILABLE`
- `PENDING_DISCONNECT`
- `PENDING_EXPIRATION`
- `USER_PERMISSION_REVOKED`
- `USER_ACCOUNT_REVOKED`
- `WEBHOOK_UPDATE_ACKNOWLEDGED`
- `/link/token/create`
- `webhook`
- `/transfer/migrate_account`
- `last_webhook`
- `/asset_report/remove`
- `Update Webhook URL`
- `Webhooks`
- `webhook_type`
- `webhook_code`
- `new_webhook_url`

---

# Items

#### API reference for managing Items

| Endpoints |  |
| --- | --- |
| [`/item/get`](/docs/api/items/#itemget) | Retrieve an Item |
| [`/item/remove`](/docs/api/items/#itemremove) | Remove an Item |
| [`/item/webhook/update`](/docs/api/items/#itemwebhookupdate) | Update a webhook URL |
| [`/item/public_token/exchange`](/docs/api/items/#itempublic_tokenexchange) | Exchange a public token from Link for an access token |
| [`/item/access_token/invalidate`](/docs/api/items/#itemaccess_tokeninvalidate) | Rotate an access token without deleting the Item |

| See also |  |
| --- | --- |
| [`/sandbox/public_token/create`](/docs/api/sandbox/#sandboxpublic_tokencreate) | Create a test Item (Sandbox only) |
| [`/sandbox/item/reset_login`](/docs/api/sandbox/#sandboxitemreset_login) | Force an Item into an error state (Sandbox only) |
| [`/sandbox/item/set_verification_status`](/docs/api/sandbox/#sandboxitemset_verification_status) | Set Auth verification status (Sandbox only) |
| [`/sandbox/item/fire_webhook`](/docs/api/sandbox/#sandboxitemfire_webhook) | Fire a test webhook (Sandbox only) |

| Webhooks |  |
| --- | --- |
| [`ERROR`](/docs/api/items/#error) | Item has entered an error state |
| [`LOGIN_REPAIRED`](/docs/api/items/#login_repaired) | Item has healed from `ITEM_LOGIN_REQUIRED` without update mode |
| [`NEW_ACCOUNTS_AVAILABLE`](/docs/api/items/#new_accounts_available) | New account detected for an Item |
| [`PENDING_DISCONNECT`](/docs/api/items/#pending_disconnect) | Item access is about to expire (US/CA) or end |
| [`PENDING_EXPIRATION`](/docs/api/items/#pending_expiration) | Item access is about to expire (UK/EU) |
| [`USER_PERMISSION_REVOKED`](/docs/api/items/#user_permission_revoked) | The user has revoked access to an Item |
| [`USER_ACCOUNT_REVOKED`](/docs/api/items/#user_account_revoked) | The user has revoked access to an account |
| [`WEBHOOK_UPDATE_ACKNOWLEDGED`](/docs/api/items/#webhook_update_acknowledged) | Item webhook URL updated |

[### Token exchange flow](/docs/api/items/#token-exchange-flow)

Many API calls to Plaid product endpoints require an `access_token`. An `access_token` corresponds to an *Item*, which is a login at a financial institution. To obtain an `access_token`:

1. Obtain a `link_token` by calling [`/link/token/create`](/docs/api/link/#linktokencreate).
2. Initialize Link by passing in the `link_token`. When your user completes the
   Link flow, Link will pass back a `public_token` via the
   [`onSuccess` callback](/docs/link/web/#onsuccess), or, if using [Hosted Link](/docs/link/hosted-link/), via a webhook. For more information on
   initializing and receiving data back from Link, see the
   [Link documentation](/docs/link/).
3. Exchange the `public_token` for an `access_token` by calling
   [`/item/public_token/exchange`](/docs/api/items/#itempublic_tokenexchange).

The `access_token` can then be used to call Plaid endpoints and obtain
information about an Item.

In addition to the primary flow, several other token flows exist. The
[Link update mode](/docs/link/update-mode/) flow allows you to update an
`access_token` that has stopped working. The Sandbox testing environment also
offers the [`/sandbox/public_token/create`](/docs/api/sandbox/#sandboxpublic_tokencreate) endpoint, which allows you to create a
`public_token` without using Link. The [Hosted Link](/docs/link/hosted-link/) and [Multi-Item Link](/docs/link/multi-item-link/) flows provide the `public_token` via the backend rather than using the frontend `onSuccess` callback.

[### Endpoints](/docs/api/items/#endpoints)=\*=\*=\*=[#### `/item/get`](/docs/api/items/#itemget)

[#### Retrieve an Item](/docs/api/items/#retrieve-an-item)

Returns information about the status of an Item.

/item/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The access token associated with the Item for which data is being requested.

/item/get

Nodeâ¼

```
const request: ItemGetRequest = {
  access_token: accessToken,
};
try {
  const response = await plaidClient.itemGet(request);
  const item = response.data.item;
  const status = response.data.status;
} catch (error) {
  // handle error
}
```

/item/get

**Response fields**

Metadata about the Item

Hide object

The Plaid Item ID. The `item_id` is always unique; linking the same account at the same institution twice will result in two Items with different `item_id` values. Like all Plaid identifiers, the `item_id` is case-sensitive.

The Plaid Institution ID associated with the Item. Field is `null` for Items created without an institution connection, such as Items created via Same-Day Micro-deposits.

The name of the institution associated with the Item. Field is `null` for Items created without an institution connection, such as Items created via Same-Day Micro-deposits.

The URL registered to receive webhooks for the Item.

The method used to populate Auth data for the Item. This field is only populated for Items that have had Auth numbers data set on at least one of their accounts, and will be `null` otherwise. For info about the various flows, see our [Auth coverage documentation](https://plaid.com/docs/auth/coverage/).

`INSTANT_AUTH`: The Item's Auth data was provided directly by the user's institution connection.

`INSTANT_MATCH`: The Item's Auth data was provided via the Instant Match fallback flow.

`AUTOMATED_MICRODEPOSITS`: The Item's Auth data was provided via the Automated Micro-deposits flow.

`SAME_DAY_MICRODEPOSITS`: The Item's Auth data was provided via the Same-Day Micro-deposits flow.

`INSTANT_MICRODEPOSITS`: The Item's Auth data was provided via the Instant Micro-deposits flow.

`DATABASE_MATCH`: The Item's Auth data was provided via the Database Match flow.

`DATABASE_INSIGHTS`: The Item's Auth data was provided via the Database Insights flow.

`TRANSFER_MIGRATED`: The Item's Auth data was provided via [`/transfer/migrate_account`](https://plaid.com/docs/api/products/transfer/account-linking/#migrate-account-into-transfers).

`INVESTMENTS_FALLBACK`: The Item's Auth data for Investments Move was provided via a [fallback flow](https://plaid.com/docs/investments-move/#fallback-flows).

Possible values: `INSTANT_AUTH`, `INSTANT_MATCH`, `AUTOMATED_MICRODEPOSITS`, `SAME_DAY_MICRODEPOSITS`, `INSTANT_MICRODEPOSITS`, `DATABASE_MATCH`, `DATABASE_INSIGHTS`, `TRANSFER_MIGRATED`, `INVESTMENTS_FALLBACK`, `null`

Errors are identified by `error_code` and categorized by `error_type`. Use these in preference to HTTP status codes to identify and handle specific errors. HTTP status codes are set and provide the broadest categorization of errors: 4xx codes are for developer- or user-related errors, and 5xx codes are for Plaid-related errors, and the status will be 2xx in non-error cases. An Item with a non-`null` error object will only be part of an API response when calling `/item/get` to view Item status. Otherwise, error fields will be `null` if no error has occurred; if an error has occurred, an error code will be returned instead.

Hide object

A broad categorization of the error. Safe for programmatic use.

Possible values: `INVALID_REQUEST`, `INVALID_RESULT`, `INVALID_INPUT`, `INSTITUTION_ERROR`, `RATE_LIMIT_EXCEEDED`, `API_ERROR`, `ITEM_ERROR`, `ASSET_REPORT_ERROR`, `BASE_REPORT_ERROR`, `RECAPTCHA_ERROR`, `OAUTH_ERROR`, `PAYMENT_ERROR`, `BANK_TRANSFER_ERROR`, `INCOME_VERIFICATION_ERROR`, `MICRODEPOSITS_ERROR`, `SANDBOX_ERROR`, `PARTNER_ERROR`, `SIGNAL_ERROR`, `TRANSACTIONS_ERROR`, `TRANSACTION_ERROR`, `TRANSFER_ERROR`, `CHECK_REPORT_ERROR`, `CONSUMER_REPORT_ERROR`, `USER_ERROR`, `IDEMPOTENCY_ERROR`, `ASSETS_ERROR`, `CRA_MONITORING_ERROR`, `CREDIT_PROFILE_REPORT_ERROR`, `ENCOMPASS_ERROR`, `ENRICH_ERROR`, `FRAUD_INSIGHTS_ERROR`, `FREDDIE_MAC_ERROR`, `LINK_DELIVERY_ERROR`, `PROFILE_ERROR`, `RECURRING_TRANSACTIONS_ERROR`, `STATEMENTS_ERROR`, `TRANSFER_RECURRING_ERROR`, `TRANSFER_REFUND_ERROR`

The particular error code. Safe for programmatic use.

The specific reason for the error code. Currently, reasons are only supported for OAuth-based item errors; `null` will be returned otherwise. Safe for programmatic use.

Possible values:
`OAUTH_INVALID_TOKEN`: The user's OAuth connection to this institution has been invalidated.

`OAUTH_CONSENT_EXPIRED`: The user's access consent for this OAuth connection to this institution has expired.

`OAUTH_USER_REVOKED`: The user's OAuth connection to this institution is invalid because the user revoked their connection.

A developer-friendly representation of the error code. This may change over time and is not safe for programmatic use.

A user-friendly representation of the error code. `null` if the error is not related to user action.

This may change over time and is not safe for programmatic use.

A unique ID identifying the request, to be used for troubleshooting purposes. This field will be omitted in errors provided by webhooks.

In this product, a request can pertain to more than one Item. If an error is returned for such a request, `causes` will return an array of errors containing a breakdown of these errors on the individual Item level, if any can be identified.

`causes` will be provided for the `error_type` `ASSET_REPORT_ERROR` or `CHECK_REPORT_ERROR`. `causes` will also not be populated inside an error nested within a `warning` object.

The HTTP status code associated with the error. This will only be returned in the response body when the error information is provided via a webhook.

The URL of a Plaid documentation page with more information about the error

Suggested steps for resolving the error

A list of the account subtypes that were requested via the `account_filters` parameter in `/link/token/create`. Currently only populated for `NO_ACCOUNTS` errors from Items with `investments_auth` as an enabled product.

A list of the account subtypes that were extracted but did not match the requested subtypes via the `account_filters` parameter in `/link/token/create`. Currently only populated for `NO_ACCOUNTS` errors from Items with `investments_auth` as an enabled product.

A list of products available for the Item that have not yet been accessed. The contents of this array will be mutually exclusive with `billed_products`.

Possible values: `assets`, `auth`, `balance`, `balance_plus`, `beacon`, `identity`, `identity_match`, `investments`, `investments_auth`, `liabilities`, `payment_initiation`, `identity_verification`, `transactions`, `credit_details`, `income`, `income_verification`, `standing_orders`, `transfer`, `employment`, `recurring_transactions`, `transactions_refresh`, `signal`, `statements`, `processor_payments`, `processor_identity`, `profile`, `cra_base_report`, `cra_income_insights`, `cra_partner_insights`, `cra_network_insights`, `cra_cashflow_insights`, `cra_monitoring`, `cra_lend_score`, `cra_plaid_credit_score`, `cra_qualify`, `layer`, `pay_by_bank`, `protect_linked_bank`, `protect_transactions`

A list of products that have been billed for the Item. The contents of this array will be mutually exclusive with `available_products`. Note - `billed_products` is populated in all environments but only requests in Production are billed. Also note that products that are billed on a pay-per-call basis rather than a pay-per-Item basis, such as `balance`, will not appear here.

Possible values: `assets`, `auth`, `balance`, `balance_plus`, `beacon`, `identity`, `identity_match`, `investments`, `investments_auth`, `liabilities`, `payment_initiation`, `identity_verification`, `transactions`, `credit_details`, `income`, `income_verification`, `standing_orders`, `transfer`, `employment`, `recurring_transactions`, `transactions_refresh`, `signal`, `statements`, `processor_payments`, `processor_identity`, `profile`, `cra_base_report`, `cra_income_insights`, `cra_partner_insights`, `cra_network_insights`, `cra_cashflow_insights`, `cra_monitoring`, `cra_lend_score`, `cra_plaid_credit_score`, `cra_qualify`, `layer`, `pay_by_bank`, `protect_linked_bank`, `protect_transactions`

A list of products added to the Item. In almost all cases, this will be the same as the `billed_products` field. For some products, it is possible for the product to be added to an Item but not yet billed (e.g. Assets, before `/asset_report/create` has been called, or Auth or Identity when added as Optional Products but before their endpoints have been called), in which case the product may appear in `products` but not in `billed_products`.

Possible values: `assets`, `auth`, `balance`, `balance_plus`, `beacon`, `identity`, `identity_match`, `investments`, `investments_auth`, `liabilities`, `payment_initiation`, `identity_verification`, `transactions`, `credit_details`, `income`, `income_verification`, `standing_orders`, `transfer`, `employment`, `recurring_transactions`, `transactions_refresh`, `signal`, `statements`, `processor_payments`, `processor_identity`, `profile`, `cra_base_report`, `cra_income_insights`, `cra_partner_insights`, `cra_network_insights`, `cra_cashflow_insights`, `cra_monitoring`, `cra_lend_score`, `cra_plaid_credit_score`, `cra_qualify`, `layer`, `pay_by_bank`, `protect_linked_bank`, `protect_transactions`

A list of products that the user has consented to for the Item via [Data Transparency Messaging](https://plaid.com/docs/link/data-transparency-messaging-migration-guide). This will consist of all products where both of the following are true: the user has consented to the required data scopes for that product and you have Production access for that product.

Possible values: `assets`, `auth`, `balance`, `balance_plus`, `beacon`, `identity`, `identity_match`, `investments`, `investments_auth`, `liabilities`, `transactions`, `income`, `income_verification`, `transfer`, `employment`, `recurring_transactions`, `signal`, `statements`, `processor_payments`, `processor_identity`, `cra_base_report`, `cra_income_insights`, `cra_lend_score`, `cra_partner_insights`, `cra_cashflow_insights`, `cra_monitoring`, `layer`

The date and time at which the Item's access consent will expire, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format. If the Item does not have consent expiration scheduled, this field will be `null`. Currently, only institutions in Europe and a small number of institutions in the US have expiring consent. For a list of US institutions that currently expire consent, see the [OAuth Guide](https://plaid.com/docs/link/oauth/#refreshing-item-consent).

Format: `date-time`

Indicates whether an Item requires user interaction to be updated, which can be the case for Items with some forms of two-factor authentication.

`background` - Item can be updated in the background

`user_present_required` - Item requires user interaction to be updated

Possible values: `background`, `user_present_required`

The date and time when the Item was created, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date-time`

A list of use cases that the user has consented to for the Item via [Data Transparency Messaging](https://plaid.com/docs/link/data-transparency-messaging-migration-guide).

You can see the full list of use cases or update the list of use cases to request at any time via the Link Customization section of the [Plaid Dashboard](https://dashboard.plaid.com/link/data-transparency-v5).

A list of data scopes that the user has consented to for the Item via [Data Transparency Messaging](https://plaid.com/docs/link/data-transparency-messaging-migration-guide). These are based on the `consented_products`; see the [full mapping](https://plaid.com/docs/link/data-transparency-messaging-migration-guide/#data-scopes-by-product) of data scopes and products.

Possible values: `account_balance_info`, `contact_info`, `account_routing_number`, `transactions`, `credit_loan_info`, `investments`, `payroll_info`, `income_verification_paystubs_info`, `income_verification_w2s_info`, `income_verification_bank_statements`, `income_verification_employment_info`, `bank_statements`, `risk_info`, `network_insights_lite`, `fraud_info`

Information about the last successful and failed transactions update for the Item.

Hide object

Information about the last successful and failed investments update for the Item.

Hide object

[ISO 8601](https://wikipedia.org/wiki/ISO_8601) timestamp of the last successful investments update for the Item. The status will update each time Plaid successfully connects with the institution, regardless of whether any new data is available in the update.

Format: `date-time`

[ISO 8601](https://wikipedia.org/wiki/ISO_8601) timestamp of the last failed investments update for the Item. The status will update each time Plaid fails an attempt to connect with the institution, regardless of whether any new data is available in the update.

Format: `date-time`

Information about the last successful and failed transactions update for the Item.

Hide object

[ISO 8601](https://wikipedia.org/wiki/ISO_8601) timestamp of the last successful transactions update for the Item. The status will update each time Plaid successfully connects with the institution, regardless of whether any new data is available in the update. This field does not reflect transactions updates performed by non-Transactions products (e.g. Signal).

Format: `date-time`

[ISO 8601](https://wikipedia.org/wiki/ISO_8601) timestamp of the last failed transactions update for the Item. The status will update each time Plaid fails an attempt to connect with the institution, regardless of whether any new data is available in the update. This field does not reflect transactions updates performed by non-Transactions products (e.g. Signal).

Format: `date-time`

Information about the last webhook fired for the Item.

Hide object

[ISO 8601](https://wikipedia.org/wiki/ISO_8601) timestamp of when the webhook was fired.

Format: `date-time`

The last webhook code sent.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "item": {
    "created_at": "2019-01-22T04:32:00Z",
    "available_products": [
      "balance",
      "auth"
    ],
    "billed_products": [
      "identity",
      "transactions"
    ],
    "products": [
      "identity",
      "transactions"
    ],
    "error": null,
    "institution_id": "ins_109508",
    "institution_name": "First Platypus Bank",
    "item_id": "Ed6bjNrDLJfGvZWwnkQlfxwoNz54B5C97ejBr",
    "update_type": "background",
    "webhook": "https://plaid.com/example/hook",
    "auth_method": null,
    "consented_products": [
      "identity",
      "transactions"
    ],
    "consented_data_scopes": [
      "account_balance_info",
      "contact_info",
      "transactions"
    ],
    "consented_use_cases": [
      "Verify your account",
      "Track and manage your finances"
    ],
    "consent_expiration_time": "2024-03-16T15:53:00Z"
  },
  "status": {
    "transactions": {
      "last_successful_update": "2019-02-15T15:52:39Z",
      "last_failed_update": "2019-01-22T04:32:00Z"
    },
    "last_webhook": {
      "sent_at": "2019-02-15T15:53:00Z",
      "code_sent": "DEFAULT_UPDATE"
    }
  },
  "request_id": "m8MDnv9okwxFNBV"
}
```

=\*=\*=\*=[#### `/item/remove`](/docs/api/items/#itemremove)

[#### Remove an Item](/docs/api/items/#remove-an-item)

The [`/item/remove`](/docs/api/items/#itemremove) endpoint allows you to remove an Item. Once removed, the `access_token`, as well as any processor tokens or bank account tokens associated with the Item, is no longer valid and cannot be used to access any data that was associated with the Item.

Calling [`/item/remove`](/docs/api/items/#itemremove) is a recommended best practice when offboarding users or if a user chooses to disconnect an account linked via Plaid. For subscription products, such as Transactions, Liabilities, and Investments, calling [`/item/remove`](/docs/api/items/#itemremove) is required to end subscription billing for the Item, unless the end user revoked permission (e.g. via <https://my.plaid.com/>). For more details, see [Subscription fee model](https://plaid.com/docs/account/billing/#subscription-fee).

On a Trial plan, calling [`/item/remove`](/docs/api/items/#itemremove) does not impact the number of remaining Trial Items (bank connections) you have available.

Removing an Item does not affect any Asset Reports or Audit Copies you have already created, which will remain accessible until you remove access to them specifically using the [`/asset_report/remove`](/docs/api/products/assets/#asset_reportremove) endpoint.

Also note that for certain OAuth-based institutions, an Item removed via [`/item/remove`](/docs/api/items/#itemremove) may still show as an active connection in the institution's OAuth permission manager.

API versions 2019-05-29 and earlier return a `removed` boolean as part of the response.

/item/remove

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The access token associated with the Item for which data is being requested.

The reason for removing the Item

`FRAUD_FIRST_PARTY`: The end user who owns the connected bank account committed fraud
`FRAUD_FALSE_IDENTITY`: The end user created the connection using false identity information or stolen credentials
`FRAUD_ABUSE`: The end user is abusing the client's service or platform through their connected account
`FRAUD_OTHER`: Other fraud-related reasons involving the end user not covered by the specific fraud categories
`CONNECTION_IS_NON_FUNCTIONAL`: The connection to the end user's financial institution is broken and cannot be restored
`OTHER`: Any other reason for removing the connection not covered by the above categories

Possible values: `FRAUD_FIRST_PARTY`, `FRAUD_FALSE_IDENTITY`, `FRAUD_ABUSE`, `FRAUD_OTHER`, `CONNECTION_IS_NON_FUNCTIONAL`, `OTHER`

Additional context or details about the reason for removing the Item. Personally identifiable information, such as an email address or phone number, should not be included in the `reason_note`.

Max length: `512`

/item/remove

Nodeâ¼

```
const request: ItemRemoveRequest = {
  access_token: accessToken,
};
try {
  const response = await plaidClient.itemRemove(request);
  // The Item was removed, access_token is now invalid
} catch (error) {
  // handle error
}

// The Item was removed, access_token is now invalid
```

/item/remove

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "m8MDnv9okwxFNBV"
}
```

=\*=\*=\*=[#### `/item/webhook/update`](/docs/api/items/#itemwebhookupdate)

[#### Update Webhook URL](/docs/api/items/#update-webhook-url)

The POST [`/item/webhook/update`](/docs/api/items/#itemwebhookupdate) allows you to update the webhook URL associated with an Item. This request triggers a [`WEBHOOK_UPDATE_ACKNOWLEDGED`](https://plaid.com/docs/api/items/#webhook_update_acknowledged) webhook to the newly specified webhook URL.

/item/webhook/update

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The access token associated with the Item for which data is being requested.

The new webhook URL to associate with the Item. To remove a webhook from an Item, set to `null`.

Format: `url`

/item/webhook/update

Nodeâ¼

```
// Update the webhook associated with an Item
const request: ItemWebhookUpdateRequest = {
  access_token: accessToken,
  webhook: 'https://example.com/updated/webhook',
};
try {
  const response = await plaidClient.itemWebhookUpdate(request);
  // A successful response indicates that the webhook has been
  // updated. An acknowledgement webhook will also be fired.
  const item = response.data.item;
} catch (error) {
  // handle error
}
```

/item/webhook/update

**Response fields**

Collapse all

Metadata about the Item.

Hide object

The Plaid Item ID. The `item_id` is always unique; linking the same account at the same institution twice will result in two Items with different `item_id` values. Like all Plaid identifiers, the `item_id` is case-sensitive.

The Plaid Institution ID associated with the Item. Field is `null` for Items created without an institution connection, such as Items created via Same-Day Micro-deposits.

The name of the institution associated with the Item. Field is `null` for Items created without an institution connection, such as Items created via Same-Day Micro-deposits.

The URL registered to receive webhooks for the Item.

The method used to populate Auth data for the Item. This field is only populated for Items that have had Auth numbers data set on at least one of their accounts, and will be `null` otherwise. For info about the various flows, see our [Auth coverage documentation](https://plaid.com/docs/auth/coverage/).

`INSTANT_AUTH`: The Item's Auth data was provided directly by the user's institution connection.

`INSTANT_MATCH`: The Item's Auth data was provided via the Instant Match fallback flow.

`AUTOMATED_MICRODEPOSITS`: The Item's Auth data was provided via the Automated Micro-deposits flow.

`SAME_DAY_MICRODEPOSITS`: The Item's Auth data was provided via the Same-Day Micro-deposits flow.

`INSTANT_MICRODEPOSITS`: The Item's Auth data was provided via the Instant Micro-deposits flow.

`DATABASE_MATCH`: The Item's Auth data was provided via the Database Match flow.

`DATABASE_INSIGHTS`: The Item's Auth data was provided via the Database Insights flow.

`TRANSFER_MIGRATED`: The Item's Auth data was provided via [`/transfer/migrate_account`](https://plaid.com/docs/api/products/transfer/account-linking/#migrate-account-into-transfers).

`INVESTMENTS_FALLBACK`: The Item's Auth data for Investments Move was provided via a [fallback flow](https://plaid.com/docs/investments-move/#fallback-flows).

Possible values: `INSTANT_AUTH`, `INSTANT_MATCH`, `AUTOMATED_MICRODEPOSITS`, `SAME_DAY_MICRODEPOSITS`, `INSTANT_MICRODEPOSITS`, `DATABASE_MATCH`, `DATABASE_INSIGHTS`, `TRANSFER_MIGRATED`, `INVESTMENTS_FALLBACK`, `null`

Errors are identified by `error_code` and categorized by `error_type`. Use these in preference to HTTP status codes to identify and handle specific errors. HTTP status codes are set and provide the broadest categorization of errors: 4xx codes are for developer- or user-related errors, and 5xx codes are for Plaid-related errors, and the status will be 2xx in non-error cases. An Item with a non-`null` error object will only be part of an API response when calling `/item/get` to view Item status. Otherwise, error fields will be `null` if no error has occurred; if an error has occurred, an error code will be returned instead.

Hide object

A broad categorization of the error. Safe for programmatic use.

Possible values: `INVALID_REQUEST`, `INVALID_RESULT`, `INVALID_INPUT`, `INSTITUTION_ERROR`, `RATE_LIMIT_EXCEEDED`, `API_ERROR`, `ITEM_ERROR`, `ASSET_REPORT_ERROR`, `BASE_REPORT_ERROR`, `RECAPTCHA_ERROR`, `OAUTH_ERROR`, `PAYMENT_ERROR`, `BANK_TRANSFER_ERROR`, `INCOME_VERIFICATION_ERROR`, `MICRODEPOSITS_ERROR`, `SANDBOX_ERROR`, `PARTNER_ERROR`, `SIGNAL_ERROR`, `TRANSACTIONS_ERROR`, `TRANSACTION_ERROR`, `TRANSFER_ERROR`, `CHECK_REPORT_ERROR`, `CONSUMER_REPORT_ERROR`, `USER_ERROR`, `IDEMPOTENCY_ERROR`, `ASSETS_ERROR`, `CRA_MONITORING_ERROR`, `CREDIT_PROFILE_REPORT_ERROR`, `ENCOMPASS_ERROR`, `ENRICH_ERROR`, `FRAUD_INSIGHTS_ERROR`, `FREDDIE_MAC_ERROR`, `LINK_DELIVERY_ERROR`, `PROFILE_ERROR`, `RECURRING_TRANSACTIONS_ERROR`, `STATEMENTS_ERROR`, `TRANSFER_RECURRING_ERROR`, `TRANSFER_REFUND_ERROR`

The particular error code. Safe for programmatic use.

The specific reason for the error code. Currently, reasons are only supported for OAuth-based item errors; `null` will be returned otherwise. Safe for programmatic use.

Possible values:
`OAUTH_INVALID_TOKEN`: The user's OAuth connection to this institution has been invalidated.

`OAUTH_CONSENT_EXPIRED`: The user's access consent for this OAuth connection to this institution has expired.

`OAUTH_USER_REVOKED`: The user's OAuth connection to this institution is invalid because the user revoked their connection.

A developer-friendly representation of the error code. This may change over time and is not safe for programmatic use.

A user-friendly representation of the error code. `null` if the error is not related to user action.

This may change over time and is not safe for programmatic use.

A unique ID identifying the request, to be used for troubleshooting purposes. This field will be omitted in errors provided by webhooks.

In this product, a request can pertain to more than one Item. If an error is returned for such a request, `causes` will return an array of errors containing a breakdown of these errors on the individual Item level, if any can be identified.

`causes` will be provided for the `error_type` `ASSET_REPORT_ERROR` or `CHECK_REPORT_ERROR`. `causes` will also not be populated inside an error nested within a `warning` object.

The HTTP status code associated with the error. This will only be returned in the response body when the error information is provided via a webhook.

The URL of a Plaid documentation page with more information about the error

Suggested steps for resolving the error

A list of the account subtypes that were requested via the `account_filters` parameter in `/link/token/create`. Currently only populated for `NO_ACCOUNTS` errors from Items with `investments_auth` as an enabled product.

A list of the account subtypes that were extracted but did not match the requested subtypes via the `account_filters` parameter in `/link/token/create`. Currently only populated for `NO_ACCOUNTS` errors from Items with `investments_auth` as an enabled product.

A list of products available for the Item that have not yet been accessed. The contents of this array will be mutually exclusive with `billed_products`.

Possible values: `assets`, `auth`, `balance`, `balance_plus`, `beacon`, `identity`, `identity_match`, `investments`, `investments_auth`, `liabilities`, `payment_initiation`, `identity_verification`, `transactions`, `credit_details`, `income`, `income_verification`, `standing_orders`, `transfer`, `employment`, `recurring_transactions`, `transactions_refresh`, `signal`, `statements`, `processor_payments`, `processor_identity`, `profile`, `cra_base_report`, `cra_income_insights`, `cra_partner_insights`, `cra_network_insights`, `cra_cashflow_insights`, `cra_monitoring`, `cra_lend_score`, `cra_plaid_credit_score`, `cra_qualify`, `layer`, `pay_by_bank`, `protect_linked_bank`, `protect_transactions`

A list of products that have been billed for the Item. The contents of this array will be mutually exclusive with `available_products`. Note - `billed_products` is populated in all environments but only requests in Production are billed. Also note that products that are billed on a pay-per-call basis rather than a pay-per-Item basis, such as `balance`, will not appear here.

Possible values: `assets`, `auth`, `balance`, `balance_plus`, `beacon`, `identity`, `identity_match`, `investments`, `investments_auth`, `liabilities`, `payment_initiation`, `identity_verification`, `transactions`, `credit_details`, `income`, `income_verification`, `standing_orders`, `transfer`, `employment`, `recurring_transactions`, `transactions_refresh`, `signal`, `statements`, `processor_payments`, `processor_identity`, `profile`, `cra_base_report`, `cra_income_insights`, `cra_partner_insights`, `cra_network_insights`, `cra_cashflow_insights`, `cra_monitoring`, `cra_lend_score`, `cra_plaid_credit_score`, `cra_qualify`, `layer`, `pay_by_bank`, `protect_linked_bank`, `protect_transactions`

A list of products added to the Item. In almost all cases, this will be the same as the `billed_products` field. For some products, it is possible for the product to be added to an Item but not yet billed (e.g. Assets, before `/asset_report/create` has been called, or Auth or Identity when added as Optional Products but before their endpoints have been called), in which case the product may appear in `products` but not in `billed_products`.

Possible values: `assets`, `auth`, `balance`, `balance_plus`, `beacon`, `identity`, `identity_match`, `investments`, `investments_auth`, `liabilities`, `payment_initiation`, `identity_verification`, `transactions`, `credit_details`, `income`, `income_verification`, `standing_orders`, `transfer`, `employment`, `recurring_transactions`, `transactions_refresh`, `signal`, `statements`, `processor_payments`, `processor_identity`, `profile`, `cra_base_report`, `cra_income_insights`, `cra_partner_insights`, `cra_network_insights`, `cra_cashflow_insights`, `cra_monitoring`, `cra_lend_score`, `cra_plaid_credit_score`, `cra_qualify`, `layer`, `pay_by_bank`, `protect_linked_bank`, `protect_transactions`

A list of products that the user has consented to for the Item via [Data Transparency Messaging](https://plaid.com/docs/link/data-transparency-messaging-migration-guide). This will consist of all products where both of the following are true: the user has consented to the required data scopes for that product and you have Production access for that product.

Possible values: `assets`, `auth`, `balance`, `balance_plus`, `beacon`, `identity`, `identity_match`, `investments`, `investments_auth`, `liabilities`, `transactions`, `income`, `income_verification`, `transfer`, `employment`, `recurring_transactions`, `signal`, `statements`, `processor_payments`, `processor_identity`, `cra_base_report`, `cra_income_insights`, `cra_lend_score`, `cra_partner_insights`, `cra_cashflow_insights`, `cra_monitoring`, `layer`

The date and time at which the Item's access consent will expire, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format. If the Item does not have consent expiration scheduled, this field will be `null`. Currently, only institutions in Europe and a small number of institutions in the US have expiring consent. For a list of US institutions that currently expire consent, see the [OAuth Guide](https://plaid.com/docs/link/oauth/#refreshing-item-consent).

Format: `date-time`

Indicates whether an Item requires user interaction to be updated, which can be the case for Items with some forms of two-factor authentication.

`background` - Item can be updated in the background

`user_present_required` - Item requires user interaction to be updated

Possible values: `background`, `user_present_required`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "item": {
    "available_products": [
      "balance",
      "identity",
      "payment_initiation",
      "transactions"
    ],
    "billed_products": [
      "assets",
      "auth"
    ],
    "consent_expiration_time": null,
    "error": null,
    "institution_id": "ins_117650",
    "institution_name": "Royal Bank of Plaid",
    "item_id": "DWVAAPWq4RHGlEaNyGKRTAnPLaEmo8Cvq7na6",
    "update_type": "background",
    "webhook": "https://www.genericwebhookurl.com/webhook",
    "auth_method": "INSTANT_AUTH"
  },
  "request_id": "vYK11LNTfRoAMbj"
}
```

=\*=\*=\*=[#### `/item/public_token/exchange`](/docs/api/items/#itempublic_tokenexchange)

[#### Exchange public token for an access token](/docs/api/items/#exchange-public-token-for-an-access-token)

Exchange a Link `public_token` for an API `access_token`. Link hands off the `public_token` client-side via the `onSuccess` callback once a user has successfully created an Item. The `public_token` is ephemeral and expires after 30 minutes. An `access_token` does not expire, but can be revoked by calling [`/item/remove`](/docs/api/items/#itemremove).

The response also includes an `item_id` that should be stored with the `access_token`. The `item_id` is used to identify an Item in a webhook. The `item_id` can also be retrieved by making an [`/item/get`](/docs/api/items/#itemget) request.

/item/public\_token/exchange

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Your `public_token`, obtained from the Link `onSuccess` callback or `/sandbox/public_token/create`.

/item/public\_token/exchange

Nodeâ¼

```
const request: ItemPublicTokenExchangeRequest = {
  public_token: publicToken,
};
try {
  const response = await plaidClient.itemPublicTokenExchange(request);
  const accessToken = response.data.access_token;
  const itemId = response.data.item_id;
} catch (err) {
  // handle error
}
```

/item/public\_token/exchange

**Response fields**

The access token associated with the Item for which data is being requested.

The `item_id` value of the Item associated with the returned `access_token`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "access_token": "access-sandbox-de3ce8ef-33f8-452c-a685-8671031fc0f6",
  "item_id": "M5eVJqLnv3tbzdngLDp9FL5OlDNxlNhlE55op",
  "request_id": "Aim3b"
}
```

=\*=\*=\*=[#### `/item/access_token/invalidate`](/docs/api/items/#itemaccess_tokeninvalidate)

[#### Invalidate access\_token](/docs/api/items/#invalidate-access_token)

By default, the `access_token` associated with an Item does not expire and should be stored in a persistent, secure manner.

You can use the [`/item/access_token/invalidate`](/docs/api/items/#itemaccess_tokeninvalidate) endpoint to rotate the `access_token` associated with an Item. The endpoint returns a new `access_token` and immediately invalidates the previous `access_token`.

/item/access\_token/invalidate

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The access token associated with the Item for which data is being requested.

/item/access\_token/invalidate

Nodeâ¼

```
// Generate a new access_token for an Item, invalidating the old one
const request: ItemAccessTokenInvalidateRequest = {
  access_token: accessToken,
};
try {
  const response = await plaidClient.itemAccessTokenInvalidate(request);
  // Store the new access_token in a persistent, secure datastore
  const accessToken = response.data.new_access_token;
} catch (error) {
  // handle error
}
```

/item/access\_token/invalidate

**Response fields**

The access token associated with the Item for which data is being requested.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "new_access_token": "access-sandbox-8ab976e6-64bc-4b38-98f7-731e7a349970",
  "request_id": "m8MDnv9okwxFNBV"
}
```

[### Webhooks](/docs/api/items/#webhooks)

Webhooks are used to communicate changes to an Item, such as an updated webhook, or errors encountered with an Item. The error typically requires user action to resolve, such as when a user changes their password. All Item webhooks have a `webhook_type` of `ITEM`.

=\*=\*=\*=[#### `ERROR`](/docs/api/items/#error)

Fired when an error is encountered with an Item. The error can be resolved by having the user go through Link's update mode.

**Properties**

Collapse all

`ITEM`

`ERROR`

The `item_id` of the Item associated with this webhook, warning, or error

The Plaid `user_id` of the User associated with this webhook, warning, or error.

Errors are identified by `error_code` and categorized by `error_type`. Use these in preference to HTTP status codes to identify and handle specific errors. HTTP status codes are set and provide the broadest categorization of errors: 4xx codes are for developer- or user-related errors, and 5xx codes are for Plaid-related errors, and the status will be 2xx in non-error cases. An Item with a non-`null` error object will only be part of an API response when calling `/item/get` to view Item status. Otherwise, error fields will be `null` if no error has occurred; if an error has occurred, an error code will be returned instead.

Hide object

A broad categorization of the error. Safe for programmatic use.

Possible values: `INVALID_REQUEST`, `INVALID_RESULT`, `INVALID_INPUT`, `INSTITUTION_ERROR`, `RATE_LIMIT_EXCEEDED`, `API_ERROR`, `ITEM_ERROR`, `ASSET_REPORT_ERROR`, `BASE_REPORT_ERROR`, `RECAPTCHA_ERROR`, `OAUTH_ERROR`, `PAYMENT_ERROR`, `BANK_TRANSFER_ERROR`, `INCOME_VERIFICATION_ERROR`, `MICRODEPOSITS_ERROR`, `SANDBOX_ERROR`, `PARTNER_ERROR`, `SIGNAL_ERROR`, `TRANSACTIONS_ERROR`, `TRANSACTION_ERROR`, `TRANSFER_ERROR`, `CHECK_REPORT_ERROR`, `CONSUMER_REPORT_ERROR`, `USER_ERROR`, `IDEMPOTENCY_ERROR`, `ASSETS_ERROR`, `CRA_MONITORING_ERROR`, `CREDIT_PROFILE_REPORT_ERROR`, `ENCOMPASS_ERROR`, `ENRICH_ERROR`, `FRAUD_INSIGHTS_ERROR`, `FREDDIE_MAC_ERROR`, `LINK_DELIVERY_ERROR`, `PROFILE_ERROR`, `RECURRING_TRANSACTIONS_ERROR`, `STATEMENTS_ERROR`, `TRANSFER_RECURRING_ERROR`, `TRANSFER_REFUND_ERROR`

The particular error code. Safe for programmatic use.

The specific reason for the error code. Currently, reasons are only supported for OAuth-based item errors; `null` will be returned otherwise. Safe for programmatic use.

Possible values:
`OAUTH_INVALID_TOKEN`: The user's OAuth connection to this institution has been invalidated.

`OAUTH_CONSENT_EXPIRED`: The user's access consent for this OAuth connection to this institution has expired.

`OAUTH_USER_REVOKED`: The user's OAuth connection to this institution is invalid because the user revoked their connection.

A developer-friendly representation of the error code. This may change over time and is not safe for programmatic use.

A user-friendly representation of the error code. `null` if the error is not related to user action.

This may change over time and is not safe for programmatic use.

A unique ID identifying the request, to be used for troubleshooting purposes. This field will be omitted in errors provided by webhooks.

In this product, a request can pertain to more than one Item. If an error is returned for such a request, `causes` will return an array of errors containing a breakdown of these errors on the individual Item level, if any can be identified.

`causes` will be provided for the `error_type` `ASSET_REPORT_ERROR` or `CHECK_REPORT_ERROR`. `causes` will also not be populated inside an error nested within a `warning` object.

The HTTP status code associated with the error. This will only be returned in the response body when the error information is provided via a webhook.

The URL of a Plaid documentation page with more information about the error

Suggested steps for resolving the error

A list of the account subtypes that were requested via the `account_filters` parameter in `/link/token/create`. Currently only populated for `NO_ACCOUNTS` errors from Items with `investments_auth` as an enabled product.

A list of the account subtypes that were extracted but did not match the requested subtypes via the `account_filters` parameter in `/link/token/create`. Currently only populated for `NO_ACCOUNTS` errors from Items with `investments_auth` as an enabled product.

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "ITEM",
  "webhook_code": "ERROR",
  "item_id": "wz666MBjYWTp2PDzzggYhM6oWWmBb",
  "user_id": "usr_9nSp2KuZ2x4JDw",
  "error": {
    "display_message": "The user's OAuth connection to this institution has been invalidated.",
    "error_code": "ITEM_LOGIN_REQUIRED",
    "error_code_reason": "OAUTH_INVALID_TOKEN",
    "error_message": "the login details of this item have changed (credentials, MFA, or required user action) and a user login is required to update this information. use Link's update mode to restore the item to a good state",
    "error_type": "ITEM_ERROR",
    "status": 400
  },
  "environment": "production"
}
```

=\*=\*=\*=[#### `LOGIN_REPAIRED`](/docs/api/items/#login_repaired)

Fired when an Item has exited the `ITEM_LOGIN_REQUIRED` state without the user having gone through the update mode flow in your app (this can happen if the user completed the update mode in a different app). If you have messaging that tells the user to complete the update mode flow, you should silence this messaging upon receiving the `LOGIN_REPAIRED` webhook.

**Properties**

`ITEM`

`LOGIN_REPAIRED`

The `item_id` of the Item associated with this webhook, warning, or error

The Plaid `user_id` of the User associated with this webhook, warning, or error.

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "ITEM",
  "webhook_code": "LOGIN_REPAIRED",
  "item_id": "wz666MBjYWTp2PDzzggYhM6oWWmBb",
  "user_id": "usr_9nSp2KuZ2x4JDw",
  "environment": "production"
}
```

=\*=\*=\*=[#### `NEW_ACCOUNTS_AVAILABLE`](/docs/api/items/#new_accounts_available)

Fired when Plaid detects a new account. Upon receiving this webhook, you can prompt your users to share new accounts with you through [update mode](https://plaid.com/docs/link/update-mode/#using-update-mode-to-request-new-accounts) (US/CA only). If the end user has opted not to share new accounts with Plaid via their institution's OAuth settings, Plaid will not detect new accounts and this webhook will not fire. For end user accounts in the EU and UK, upon receiving this webhook, you can prompt your user to re-link their account and then delete the old Item via [`/item/remove`](/docs/api/items/#itemremove).

**Properties**

Collapse all

`ITEM`

`NEW_ACCOUNTS_AVAILABLE`

The `item_id` of the Item associated with this webhook, warning, or error

The Plaid `user_id` of the User associated with this webhook, warning, or error.

Errors are identified by `error_code` and categorized by `error_type`. Use these in preference to HTTP status codes to identify and handle specific errors. HTTP status codes are set and provide the broadest categorization of errors: 4xx codes are for developer- or user-related errors, and 5xx codes are for Plaid-related errors, and the status will be 2xx in non-error cases. An Item with a non-`null` error object will only be part of an API response when calling `/item/get` to view Item status. Otherwise, error fields will be `null` if no error has occurred; if an error has occurred, an error code will be returned instead.

Hide object

A broad categorization of the error. Safe for programmatic use.

Possible values: `INVALID_REQUEST`, `INVALID_RESULT`, `INVALID_INPUT`, `INSTITUTION_ERROR`, `RATE_LIMIT_EXCEEDED`, `API_ERROR`, `ITEM_ERROR`, `ASSET_REPORT_ERROR`, `BASE_REPORT_ERROR`, `RECAPTCHA_ERROR`, `OAUTH_ERROR`, `PAYMENT_ERROR`, `BANK_TRANSFER_ERROR`, `INCOME_VERIFICATION_ERROR`, `MICRODEPOSITS_ERROR`, `SANDBOX_ERROR`, `PARTNER_ERROR`, `SIGNAL_ERROR`, `TRANSACTIONS_ERROR`, `TRANSACTION_ERROR`, `TRANSFER_ERROR`, `CHECK_REPORT_ERROR`, `CONSUMER_REPORT_ERROR`, `USER_ERROR`, `IDEMPOTENCY_ERROR`, `ASSETS_ERROR`, `CRA_MONITORING_ERROR`, `CREDIT_PROFILE_REPORT_ERROR`, `ENCOMPASS_ERROR`, `ENRICH_ERROR`, `FRAUD_INSIGHTS_ERROR`, `FREDDIE_MAC_ERROR`, `LINK_DELIVERY_ERROR`, `PROFILE_ERROR`, `RECURRING_TRANSACTIONS_ERROR`, `STATEMENTS_ERROR`, `TRANSFER_RECURRING_ERROR`, `TRANSFER_REFUND_ERROR`

The particular error code. Safe for programmatic use.

The specific reason for the error code. Currently, reasons are only supported for OAuth-based item errors; `null` will be returned otherwise. Safe for programmatic use.

Possible values:
`OAUTH_INVALID_TOKEN`: The user's OAuth connection to this institution has been invalidated.

`OAUTH_CONSENT_EXPIRED`: The user's access consent for this OAuth connection to this institution has expired.

`OAUTH_USER_REVOKED`: The user's OAuth connection to this institution is invalid because the user revoked their connection.

A developer-friendly representation of the error code. This may change over time and is not safe for programmatic use.

A user-friendly representation of the error code. `null` if the error is not related to user action.

This may change over time and is not safe for programmatic use.

A unique ID identifying the request, to be used for troubleshooting purposes. This field will be omitted in errors provided by webhooks.

In this product, a request can pertain to more than one Item. If an error is returned for such a request, `causes` will return an array of errors containing a breakdown of these errors on the individual Item level, if any can be identified.

`causes` will be provided for the `error_type` `ASSET_REPORT_ERROR` or `CHECK_REPORT_ERROR`. `causes` will also not be populated inside an error nested within a `warning` object.

The HTTP status code associated with the error. This will only be returned in the response body when the error information is provided via a webhook.

The URL of a Plaid documentation page with more information about the error

Suggested steps for resolving the error

A list of the account subtypes that were requested via the `account_filters` parameter in `/link/token/create`. Currently only populated for `NO_ACCOUNTS` errors from Items with `investments_auth` as an enabled product.

A list of the account subtypes that were extracted but did not match the requested subtypes via the `account_filters` parameter in `/link/token/create`. Currently only populated for `NO_ACCOUNTS` errors from Items with `investments_auth` as an enabled product.

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "ITEM",
  "webhook_code": "NEW_ACCOUNTS_AVAILABLE",
  "item_id": "gAXlMgVEw5uEGoQnnXZ6tn9E7Mn3LBc4PJVKZ",
  "user_id": "usr_9nSp2KuZ2x4JDw",
  "error": null,
  "environment": "production"
}
```

=\*=\*=\*=[#### `PENDING_DISCONNECT`](/docs/api/items/#pending_disconnect)

Fired when an Item is expected to be disconnected. The webhook will currently be fired 7 days before the existing Item is scheduled for disconnection. This can be resolved by having the user go through Link's [update mode](https://plaid.com/docs/link/update-mode). Currently, this webhook is fired only for US or Canadian institutions; in the UK or EU, you should continue to listen for the [`PENDING_EXPIRATION`](https://plaid.com/docs/api/items/#pending_expiration) webhook instead.

**Properties**

`ITEM`

`PENDING_DISCONNECT`

The `item_id` of the Item associated with this webhook, warning, or error

The Plaid `user_id` of the User associated with this webhook, warning, or error.

Reason why the Item is about to be disconnected.
`INSTITUTION_MIGRATION`: The institution is moving to API or to a different integration. For example, this can occur when an institution moves from a non-OAuth integration to an OAuth integration.
`INSTITUTION_TOKEN_EXPIRATION`: The consent on an Item associated with a US or CA institution is about to expire.

Possible values: `INSTITUTION_MIGRATION`, `INSTITUTION_TOKEN_EXPIRATION`

The date and time at which the Item is scheduled to disconnect, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date-time`

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "ITEM",
  "webhook_code": "PENDING_DISCONNECT",
  "item_id": "wz666MBjYWTp2PDzzggYhM6oWWmBb",
  "user_id": "usr_9nSp2KuZ2x4JDw",
  "reason": "INSTITUTION_MIGRATION",
  "disconnect_time": "2020-01-15T13:25:17.766Z",
  "environment": "production"
}
```

=\*=\*=\*=[#### `PENDING_EXPIRATION`](/docs/api/items/#pending_expiration)

Fired when an Item's access consent is expiring in 7 days. This can be resolved by having the user go through Link's update mode. This webhook is fired only for Items associated with institutions in Europe (including the UK); for Items associated with institutions in the US or Canada, see [`PENDING_DISCONNECT`](https://plaid.com/docs/api/items/#pending_disconnect) instead.

**Properties**

`ITEM`

`PENDING_EXPIRATION`

The `item_id` of the Item associated with this webhook, warning, or error

The Plaid `user_id` of the User associated with this webhook, warning, or error.

The date and time at which the Item's access consent will expire, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date-time`

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "ITEM",
  "webhook_code": "PENDING_EXPIRATION",
  "item_id": "wz666MBjYWTp2PDzzggYhM6oWWmBb",
  "user_id": "usr_9nSp2KuZ2x4JDw",
  "consent_expiration_time": "2020-01-15T13:25:17.766Z",
  "environment": "production"
}
```

=\*=\*=\*=[#### `USER_PERMISSION_REVOKED`](/docs/api/items/#user_permission_revoked)

The `USER_PERMISSION_REVOKED` webhook may be fired when an end user has revoked the permission that they previously granted to access an Item. If the end user revoked their permissions through Plaid (such as via the Plaid Portal or by contacting Plaid support), the webhook will fire. If the end user revoked their permissions directly through the institution, this webhook may not always fire, since some institutions' consent portals do not trigger this webhook. To attempt to restore the Item, it can be sent through [update mode](https://plaid.com/docs/link/update-mode). Depending on the exact process the end user used to revoke permissions, it may not be possible to launch update mode for the Item. If you encounter an error when attempting to create a Link token for update mode on an Item with revoked permissions, create a fresh Link token for the user.

Note that when working with tokenized account numbers with Auth or Transfer, the account number provided by Plaid will no longer work for creating transfers once user permission has been revoked, except for US Bank Items.

**Properties**

Collapse all

`ITEM`

`USER_PERMISSION_REVOKED`

The `item_id` of the Item associated with this webhook, warning, or error

The Plaid `user_id` of the User associated with this webhook, warning, or error.

Errors are identified by `error_code` and categorized by `error_type`. Use these in preference to HTTP status codes to identify and handle specific errors. HTTP status codes are set and provide the broadest categorization of errors: 4xx codes are for developer- or user-related errors, and 5xx codes are for Plaid-related errors, and the status will be 2xx in non-error cases. An Item with a non-`null` error object will only be part of an API response when calling `/item/get` to view Item status. Otherwise, error fields will be `null` if no error has occurred; if an error has occurred, an error code will be returned instead.

Hide object

A broad categorization of the error. Safe for programmatic use.

Possible values: `INVALID_REQUEST`, `INVALID_RESULT`, `INVALID_INPUT`, `INSTITUTION_ERROR`, `RATE_LIMIT_EXCEEDED`, `API_ERROR`, `ITEM_ERROR`, `ASSET_REPORT_ERROR`, `BASE_REPORT_ERROR`, `RECAPTCHA_ERROR`, `OAUTH_ERROR`, `PAYMENT_ERROR`, `BANK_TRANSFER_ERROR`, `INCOME_VERIFICATION_ERROR`, `MICRODEPOSITS_ERROR`, `SANDBOX_ERROR`, `PARTNER_ERROR`, `SIGNAL_ERROR`, `TRANSACTIONS_ERROR`, `TRANSACTION_ERROR`, `TRANSFER_ERROR`, `CHECK_REPORT_ERROR`, `CONSUMER_REPORT_ERROR`, `USER_ERROR`, `IDEMPOTENCY_ERROR`, `ASSETS_ERROR`, `CRA_MONITORING_ERROR`, `CREDIT_PROFILE_REPORT_ERROR`, `ENCOMPASS_ERROR`, `ENRICH_ERROR`, `FRAUD_INSIGHTS_ERROR`, `FREDDIE_MAC_ERROR`, `LINK_DELIVERY_ERROR`, `PROFILE_ERROR`, `RECURRING_TRANSACTIONS_ERROR`, `STATEMENTS_ERROR`, `TRANSFER_RECURRING_ERROR`, `TRANSFER_REFUND_ERROR`

The particular error code. Safe for programmatic use.

The specific reason for the error code. Currently, reasons are only supported for OAuth-based item errors; `null` will be returned otherwise. Safe for programmatic use.

Possible values:
`OAUTH_INVALID_TOKEN`: The user's OAuth connection to this institution has been invalidated.

`OAUTH_CONSENT_EXPIRED`: The user's access consent for this OAuth connection to this institution has expired.

`OAUTH_USER_REVOKED`: The user's OAuth connection to this institution is invalid because the user revoked their connection.

A developer-friendly representation of the error code. This may change over time and is not safe for programmatic use.

A user-friendly representation of the error code. `null` if the error is not related to user action.

This may change over time and is not safe for programmatic use.

A unique ID identifying the request, to be used for troubleshooting purposes. This field will be omitted in errors provided by webhooks.

In this product, a request can pertain to more than one Item. If an error is returned for such a request, `causes` will return an array of errors containing a breakdown of these errors on the individual Item level, if any can be identified.

`causes` will be provided for the `error_type` `ASSET_REPORT_ERROR` or `CHECK_REPORT_ERROR`. `causes` will also not be populated inside an error nested within a `warning` object.

The HTTP status code associated with the error. This will only be returned in the response body when the error information is provided via a webhook.

The URL of a Plaid documentation page with more information about the error

Suggested steps for resolving the error

A list of the account subtypes that were requested via the `account_filters` parameter in `/link/token/create`. Currently only populated for `NO_ACCOUNTS` errors from Items with `investments_auth` as an enabled product.

A list of the account subtypes that were extracted but did not match the requested subtypes via the `account_filters` parameter in `/link/token/create`. Currently only populated for `NO_ACCOUNTS` errors from Items with `investments_auth` as an enabled product.

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "ITEM",
  "webhook_code": "USER_PERMISSION_REVOKED",
  "error": {
    "error_code": "USER_PERMISSION_REVOKED",
    "error_message": "the holder of this account has revoked their permission for your application to access it",
    "display_message": null,
    "error_type": "ITEM_ERROR",
    "status": 400
  },
  "item_id": "gAXlMgVEw5uEGoQnnXZ6tn9E7Mn3LBc4PJVKZ",
  "user_id": "usr_9nSp2KuZ2x4JDw",
  "environment": "production"
}
```

=\*=\*=\*=[#### `USER_ACCOUNT_REVOKED`](/docs/api/items/#user_account_revoked)

The `USER_ACCOUNT_REVOKED` webhook is fired when an end user has revoked access to their account on the Data Provider's portal. This webhook is currently sent only for PNC Items, but may be sent in the future for other financial institutions that allow account-level permissions revocation through their portals. Upon receiving this webhook, it is recommended to delete any Plaid-derived data you have stored that is associated with the revoked account.

If you are using Auth and receive this webhook, this webhook indicates that the TAN associated with the revoked account is no longer valid and cannot be used to create new transfers. You should not create new ACH transfers for the account that was revoked until access has been re-granted.

You can request the user to re-grant access to their account by sending them through [update mode](https://plaid.com/docs/link/update-mode). Alternatively, they may re-grant access directly through the Data Provider's portal.

After the user has re-granted access, Auth customers should call the auth endpoint again to obtain the new TAN.

**Properties**

`ITEM`

`USER_ACCOUNT_REVOKED`

The `item_id` of the Item associated with this webhook, warning, or error

The Plaid `user_id` of the User associated with this webhook, warning, or error.

The external account ID of the affected account

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "ITEM",
  "webhook_code": "USER_ACCOUNT_REVOKED",
  "item_id": "gAXlMgVEw5uEGoQnnXZ6tn9E7Mn3LBc4PJVKZ",
  "account_id": "BxBXxLj1m4HMXBm9WZJyUg9XLd4rKEhw8Pb1J",
  "user_id": "usr_9nSp2KuZ2x4JDw",
  "environment": "production"
}
```

=\*=\*=\*=[#### `WEBHOOK_UPDATE_ACKNOWLEDGED`](/docs/api/items/#webhook_update_acknowledged)

Fired when an Item's webhook is updated. This will be sent to the newly specified webhook.

**Properties**

Collapse all

`ITEM`

`WEBHOOK_UPDATE_ACKNOWLEDGED`

The `item_id` of the Item associated with this webhook, warning, or error

The new webhook URL

Errors are identified by `error_code` and categorized by `error_type`. Use these in preference to HTTP status codes to identify and handle specific errors. HTTP status codes are set and provide the broadest categorization of errors: 4xx codes are for developer- or user-related errors, and 5xx codes are for Plaid-related errors, and the status will be 2xx in non-error cases. An Item with a non-`null` error object will only be part of an API response when calling `/item/get` to view Item status. Otherwise, error fields will be `null` if no error has occurred; if an error has occurred, an error code will be returned instead.

Hide object

A broad categorization of the error. Safe for programmatic use.

Possible values: `INVALID_REQUEST`, `INVALID_RESULT`, `INVALID_INPUT`, `INSTITUTION_ERROR`, `RATE_LIMIT_EXCEEDED`, `API_ERROR`, `ITEM_ERROR`, `ASSET_REPORT_ERROR`, `BASE_REPORT_ERROR`, `RECAPTCHA_ERROR`, `OAUTH_ERROR`, `PAYMENT_ERROR`, `BANK_TRANSFER_ERROR`, `INCOME_VERIFICATION_ERROR`, `MICRODEPOSITS_ERROR`, `SANDBOX_ERROR`, `PARTNER_ERROR`, `SIGNAL_ERROR`, `TRANSACTIONS_ERROR`, `TRANSACTION_ERROR`, `TRANSFER_ERROR`, `CHECK_REPORT_ERROR`, `CONSUMER_REPORT_ERROR`, `USER_ERROR`, `IDEMPOTENCY_ERROR`, `ASSETS_ERROR`, `CRA_MONITORING_ERROR`, `CREDIT_PROFILE_REPORT_ERROR`, `ENCOMPASS_ERROR`, `ENRICH_ERROR`, `FRAUD_INSIGHTS_ERROR`, `FREDDIE_MAC_ERROR`, `LINK_DELIVERY_ERROR`, `PROFILE_ERROR`, `RECURRING_TRANSACTIONS_ERROR`, `STATEMENTS_ERROR`, `TRANSFER_RECURRING_ERROR`, `TRANSFER_REFUND_ERROR`

The particular error code. Safe for programmatic use.

The specific reason for the error code. Currently, reasons are only supported for OAuth-based item errors; `null` will be returned otherwise. Safe for programmatic use.

Possible values:
`OAUTH_INVALID_TOKEN`: The user's OAuth connection to this institution has been invalidated.

`OAUTH_CONSENT_EXPIRED`: The user's access consent for this OAuth connection to this institution has expired.

`OAUTH_USER_REVOKED`: The user's OAuth connection to this institution is invalid because the user revoked their connection.

A developer-friendly representation of the error code. This may change over time and is not safe for programmatic use.

A user-friendly representation of the error code. `null` if the error is not related to user action.

This may change over time and is not safe for programmatic use.

A unique ID identifying the request, to be used for troubleshooting purposes. This field will be omitted in errors provided by webhooks.

In this product, a request can pertain to more than one Item. If an error is returned for such a request, `causes` will return an array of errors containing a breakdown of these errors on the individual Item level, if any can be identified.

`causes` will be provided for the `error_type` `ASSET_REPORT_ERROR` or `CHECK_REPORT_ERROR`. `causes` will also not be populated inside an error nested within a `warning` object.

The HTTP status code associated with the error. This will only be returned in the response body when the error information is provided via a webhook.

The URL of a Plaid documentation page with more information about the error

Suggested steps for resolving the error

A list of the account subtypes that were requested via the `account_filters` parameter in `/link/token/create`. Currently only populated for `NO_ACCOUNTS` errors from Items with `investments_auth` as an enabled product.

A list of the account subtypes that were extracted but did not match the requested subtypes via the `account_filters` parameter in `/link/token/create`. Currently only populated for `NO_ACCOUNTS` errors from Items with `investments_auth` as an enabled product.

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "ITEM",
  "webhook_code": "WEBHOOK_UPDATE_ACKNOWLEDGED",
  "item_id": "wz666MBjYWTp2PDzzggYhM6oWWmBb",
  "error": null,
  "new_webhook_url": "https://plaid.com/example/webhook",
  "environment": "production"
}
```
