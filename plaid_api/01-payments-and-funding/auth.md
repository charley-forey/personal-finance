---
title: "Auth"
source_url: "https://plaid.com/docs/api/products/auth/"
section: "Payments and Funding"
section_id: "01-payments-and-funding"
slug: "auth"
endpoints:
  - "/auth/get"
  - "/auth/verify"
  - "/bank_transfer/event/list"
  - "/bank_transfer/event/sync"
  - "/processor/token/create"
  - "/sandbox/processor_token/create"
  - "/processor/stripe/bank_account_token/create"
  - "/sandbox/item/set_verification_status"
  - "DEFAULT_UPDATE"
  - "AUTOMATICALLY_VERIFIED"
  - "VERIFICATION_EXPIRED"
  - "BANK_TRANSFERS_EVENTS_UPDATE"
  - "SMS_MICRODEPOSITS_VERIFICATION"
  - "webhook"
  - "/transfer/migrate_account"
  - "Webhooks"
  - "/processor/auth/get"
  - "webhook_type"
  - "webhook_code"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Auth

> **Source:** [https://plaid.com/docs/api/products/auth/](https://plaid.com/docs/api/products/auth/)
> **Section:** Payments and Funding

## Endpoints & Webhooks on this page

- `/auth/get`
- `/auth/verify`
- `/bank_transfer/event/list`
- `/bank_transfer/event/sync`
- `/processor/token/create`
- `/sandbox/processor_token/create`
- `/processor/stripe/bank_account_token/create`
- `/sandbox/item/set_verification_status`
- `DEFAULT_UPDATE`
- `AUTOMATICALLY_VERIFIED`
- `VERIFICATION_EXPIRED`
- `BANK_TRANSFERS_EVENTS_UPDATE`
- `SMS_MICRODEPOSITS_VERIFICATION`
- `webhook`
- `/transfer/migrate_account`
- `Webhooks`
- `/processor/auth/get`
- `webhook_type`
- `webhook_code`

---

# Auth

#### API reference for Auth endpoints and webhooks

Retrieve bank account information to set up electronic funds transfers, such as ACH payments in the US, EFT payments in Canada, Bacs payments in the UK, and IBAN / SEPA payments in the EU.

For how-to guidance, see the [Auth documentation](/docs/auth/).

| Endpoints |  |
| --- | --- |
| [`/auth/get`](/docs/api/products/auth/#authget) | Get bank account and routing number and verification status |
| [`/auth/verify`](/docs/api/products/auth/#authverify) | Verify a user's bank account information using [Database Auth](/docs/auth/coverage/database-auth/) |
| [`/bank_transfer/event/list`](/docs/api/products/auth/#bank_transfereventlist) | Search for updates on micro-deposit verification statuses based on filter criteria |
| [`/bank_transfer/event/sync`](/docs/api/products/auth/#bank_transfereventsync) | Get updates on micro-deposit verification statuses using a cursor |

| See also |  |
| --- | --- |
| [`/processor/token/create`](/docs/api/processors/#processortokencreate) | Create a token for using Auth with a processing partner |
| [`/sandbox/processor_token/create`](/docs/api/sandbox/#sandboxprocessor_tokencreate) | Create a token for testing Auth with a processing partner |
| [`/processor/stripe/bank_account_token/create`](/docs/api/processors/#processorstripebank_account_tokencreate) | Create a token for using Auth with Stripe as a processing partner |
| [`/sandbox/item/set_verification_status`](/docs/api/sandbox/#sandboxitemset_verification_status) | Change a Sandbox Item's micro-deposit verification status |

| Webhooks |  |
| --- | --- |
| [`DEFAULT_UPDATE`](/docs/api/products/auth/#default_update) | Item has account(s) with updated Auth data |
| [`AUTOMATICALLY_VERIFIED`](/docs/api/products/auth/#automatically_verified) | Item has been verified |
| [`VERIFICATION_EXPIRED`](/docs/api/products/auth/#verification_expired) | Item verification has failed |
| [`BANK_TRANSFERS_EVENTS_UPDATE`](/docs/api/products/auth/#bank_transfers_events_update) | New micro-deposit verification events available |
| [`SMS_MICRODEPOSITS_VERIFICATION`](/docs/api/products/auth/#sms_microdeposits_verification) | Text message verification status has changed |

[### Endpoints](/docs/api/products/auth/#endpoints)=\*=\*=\*=[#### `/auth/get`](/docs/api/products/auth/#authget)

[#### Retrieve auth data](/docs/api/products/auth/#retrieve-auth-data)

The [`/auth/get`](/docs/api/products/auth/#authget) endpoint returns the bank account and bank identification numbers (such as routing numbers, for US accounts) associated with an Item's checking, savings, and cash management accounts, along with high-level account data and balances when available.

Versioning note: In API version 2017-03-08, the schema of the `numbers` object returned by this endpoint is substantially different. For details, see [Plaid API versioning](https://plaid.com/docs/api/versioning/#version-2018-05-22).

/auth/get

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The access token associated with the Item for which data is being requested.

An optional object to filter `/auth/get` results.

Hide object

A list of `account_ids` to retrieve for the Item.
Note: An error will be returned if a provided `account_id` is not associated with the Item.

/auth/get

Nodeâ¼

```
const request: AuthGetRequest = {
  access_token: accessToken,
};
try {
  const response = await plaidClient.authGet(request);
  const accountData = response.data.accounts;
  const numbers = response.data.numbers;
} catch (error) {
  // handle error
}
```

/auth/get

**Response fields**

Collapse all

The `accounts` for which numbers are being retrieved.

Hide object

Plaid's unique identifier for the account. This value will not change unless Plaid can't reconcile the account with the data returned by the financial institution. This may occur, for example, when the name of the account changes. If this happens a new `account_id` will be assigned to the account.

The `account_id` can also change if the `access_token` is deleted and the same credentials that were used to generate that `access_token` are used to generate a new `access_token` on a later date. In that case, the new `account_id` will be different from the old `account_id`.

If an account with a specific `account_id` disappears instead of changing, the account is likely closed. Closed accounts are not returned by the Plaid API.

When using a CRA endpoint (an endpoint associated with Plaid Check Consumer Report, i.e. any endpoint beginning with `/cra/`), the `account_id` returned will not match the `account_id` returned by a non-CRA endpoint.

Like all Plaid identifiers, the `account_id` is case sensitive.

A set of fields describing the balance for an account. For real-time values, use `/accounts/balance/get` or `/signal/evaluate` (with a Balance-only ruleset), which are fetched live from the institution at request time. Values returned by other endpoints may be cached, or adjusted by Plaid to reflect transaction activity received since the last refresh.

Hide object

The amount of funds available to be withdrawn from the account, as determined by the financial institution.

For `credit`-type accounts, the `available` balance typically equals the `limit` less the `current` balance, less any pending outflows plus any pending inflows.

For `depository`-type accounts, the `available` balance typically equals the `current` balance less any pending outflows plus any pending inflows. For `depository`-type accounts, the `available` balance does not include the overdraft limit.

For `investment`-type accounts (or `brokerage`-type accounts for API versions 2018-05-22 and earlier), the `available` balance is the total cash available to withdraw as presented by the institution.

Note that not all institutions calculate the `available` balance. In the event that `available` balance is unavailable, Plaid will return an `available` balance value of `null`.

Available balance may be cached and is not guaranteed to be up-to-date in real-time unless the value was returned by `/accounts/balance/get`, or by `/signal/evaluate` with a Balance-only ruleset.

If `current` is `null` this field is guaranteed not to be `null`, unless you have opted into enabling [limited-purpose checking accounts](https://plaid.com/docs/auth/#enabling-limited-purpose-checking-accounts-for-rent-or-mortgage), which always have `null` values for both `available` and `current` balance.

Format: `double`

The total amount of funds in or owed by the account.

For `credit`-type accounts, a positive balance indicates the amount owed; a negative amount indicates the lender owing the account holder.

For `loan`-type accounts, the current balance is the principal remaining on the loan, except in the case of student loan accounts at Sallie Mae (`ins_116944`). For Sallie Mae student loans, the account's balance includes both principal and any outstanding interest. Similar to `credit`-type accounts, a positive balance is typically expected, while a negative amount indicates the lender owing the account holder.

For `investment`-type accounts (or `brokerage`-type accounts for API versions 2018-05-22 and earlier), the current balance is the total value of assets as presented by the institution.

Note that balance information may be cached unless the value was returned by `/accounts/balance/get` or by `/signal/evaluate` with a Balance-only ruleset; if the Item is enabled for Transactions, the balance will be at least as recent as the most recent Transaction update. If you require real-time balance information, use the `available` balance as provided by `/accounts/balance/get` or `/signal/evaluate` called with a Balance-only `ruleset_key`.

When returned by `/accounts/balance/get`, this field may be `null`. When this happens, `available` is guaranteed not to be `null`, unless you have opted into enabling [limited-purpose checking accounts](https://plaid.com/docs/auth/#enabling-limited-purpose-checking-accounts-for-rent-or-mortgage), which always have `null` values for both `available` and `current` balance.

Format: `double`

For `credit`-type accounts, this represents the credit limit.

For `depository`-type accounts, this represents the pre-arranged overdraft limit, which is common for current (checking) accounts in Europe.

In North America, this field is typically only available for `credit`-type accounts.

Format: `double`

The ISO-4217 currency code of the balance. Always null if `unofficial_currency_code` is non-null.

The unofficial currency code associated with the balance. Always null if `iso_currency_code` is non-null. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format (`YYYY-MM-DDTHH:mm:ssZ`) indicating the last time the balance was updated.

This field is returned only when the institution is `ins_128026` (Capital One).

Format: `date-time`

The last 2-4 alphanumeric characters of either the account's displayed mask or the account's official account number. Note that the mask may be non-unique between an Item's accounts.

The name of the account, either assigned by the user or by the financial institution itself

The official name of the account as given by the financial institution

`investment:` Investment account. In API versions 2018-05-22 and earlier, this type is called `brokerage` instead.

`credit:` Credit card

`depository:` Depository account

`loan:` Loan account

`other:` Non-specified account type

See the [Account type schema](https://plaid.com/docs/api/accounts#account-type-schema) for a full listing of account types and corresponding subtypes.

Possible values: `investment`, `credit`, `depository`, `loan`, `brokerage`, `other`

See the [Account type schema](https://plaid.com/docs/api/accounts/#account-type-schema) for a full listing of account types and corresponding subtypes.

Possible values: `401a`, `401k`, `403B`, `457b`, `529`, `auto`, `brokerage`, `business`, `cash isa`, `cash management`, `cd`, `checking`, `commercial`, `construction`, `consumer`, `credit card`, `crypto exchange`, `ebt`, `education savings account`, `fhsa`, `fixed annuity`, `gic`, `health reimbursement arrangement`, `home equity`, `hsa`, `isa`, `ira`, `keogh`, `lif`, `life insurance`, `limited purpose checking`, `line of credit`, `lira`, `loan`, `lrif`, `lrsp`, `money market`, `mortgage`, `mutual fund`, `non-custodial wallet`, `non-taxable brokerage account`, `other`, `other insurance`, `other annuity`, `overdraft`, `paypal`, `payroll`, `pension`, `prepaid`, `prif`, `profit sharing plan`, `qshr`, `rdsp`, `resp`, `retirement`, `rlif`, `roth`, `roth 401k`, `roth 403B`, `roth 457b`, `roth pension`, `roth profit sharing plan`, `roth thrift savings plan`, `rrif`, `rrsp`, `sarsep`, `savings`, `sep ira`, `simple ira`, `sipp`, `stock plan`, `student`, `thrift savings plan`, `tfsa`, `trust`, `ugma`, `utma`, `variable annuity`

Indicates an Item's micro-deposit-based verification or database verification status. This field is only populated when using Auth and falling back to micro-deposit or database verification. Possible values are:

`pending_automatic_verification`: The Item is pending automatic verification.

`pending_manual_verification`: The Item is pending manual micro-deposit verification. Items remain in this state until the user successfully verifies the code.

`automatically_verified`: The Item has successfully been automatically verified.

`manually_verified`: The Item has successfully been manually verified.

`verification_expired`: Plaid was unable to automatically verify the deposit within 7 calendar days and will no longer attempt to validate the Item. Users may retry by submitting their information again through Link.

`verification_failed`: The Item failed manual micro-deposit verification because the user exhausted all 3 verification attempts. Users may retry by submitting their information again through Link.

`unsent`: The Item is pending micro-deposit verification, but Plaid has not yet sent the micro-deposit.

`database_insights_fail`: The Item's numbers have been verified using Plaid's data sources and have signal for being invalid and/or have no signal for being valid. Typically this indicates that the routing number is invalid, the account number does not match the account number format associated with the routing number, or the account has been reported as closed or frozen. Only returned for Auth Items created via Database Auth.

`database_insights_pass`: The Item's numbers have been verified using Plaid's data sources: the routing and account number match a routing and account number of an account recognized on the Plaid network, and the account is not known by Plaid to be frozen or closed. Only returned for Auth Items created via Database Auth.

`database_insights_pass_with_caution`: The Item's numbers have been verified using Plaid's data sources and have some signal for being valid: the routing and account number were not recognized on the Plaid network, but the routing number is valid and the account number is a potential valid account number for that routing number. Only returned for Auth Items created via Database Auth.

`database_matched`: (deprecated) The Item has successfully been verified using Plaid's data sources. Only returned for Auth Items created via Database Match.

`null` or empty string: Neither micro-deposit-based verification nor database verification are being used for the Item.

Possible values: `automatically_verified`, `pending_automatic_verification`, `pending_manual_verification`, `unsent`, `manually_verified`, `verification_expired`, `verification_failed`, `database_matched`, `database_insights_pass`, `database_insights_pass_with_caution`, `database_insights_fail`

The account holder name that was used for micro-deposit and/or database verification. Only returned for Auth Items created via micro-deposit or database verification. This name was manually-entered by the user during Link, unless it was otherwise provided via the `user.legal_name` request field in `/link/token/create` for the Link session that created the Item.

Insights from performing database verification for the account. Only returned for Auth Items using Database Auth.

Hide object

Indicates the score of the name match between the given name provided during database verification (available in the [`verification_name`](https://plaid.com/docs/api/products/auth/#auth-get-response-accounts-verification-name) field if using standard Database Auth, or provided in the request if using `/auth/verify`) and matched Plaid network accounts. If defined, will be a value between 0 and 100. Will be undefined if name matching was not enabled for the database verification session or if there were no eligible Plaid network matches to compare the given name with.

Status information about the account and routing number in the Plaid network.

Hide object

Indicates whether we found at least one matching account for the ACH account and routing number.

Indicates if at least one matching account for the ACH account and routing number is already verified.

Information about known ACH returns for the account and routing number.

Hide object

Indicates whether Plaid's data sources include a known administrative ACH return for this account and routing number.

Indicator of account number format validity for institution.

`valid`: indicates that the account number has a correct format for the institution.

`invalid`: indicates that the account number has an incorrect format for the institution.

`unknown`: indicates that there was not enough information to determine whether the format is correct for the institution.

Possible values: `valid`, `invalid`, `unknown`

A unique and persistent identifier for accounts that can be used to trace multiple instances of the same account across different Items for depository accounts. This field is currently supported only for Items at institutions that use Tokenized Account Numbers (i.e., Chase, PNC, and US Bank). Because these accounts have a different account number each time they are linked, this field may be used instead of the account number to uniquely identify an account across multiple Items for payments use cases, helping to reduce duplicate Items or attempted fraud. In Sandbox, this field is populated for TAN-based institutions (`ins_56`, `ins_13`, `ins_127990`) as well as the OAuth Sandbox institution (`ins_127287`); in Production, it will only be populated for accounts at applicable institutions.

Indicates the account's categorization as either a personal or a business account. This field is currently in beta; to request access, contact your account manager.

Possible values: `business`, `personal`, `unrecognized`

An object containing identifying numbers used for making electronic transfers to and from the `accounts`. The identifying number type (ACH, EFT, IBAN, or Bacs) used will depend on the country of the account. An account may have more than one number type. If a particular identifying number type is not used by any `accounts` for which data has been requested, the array for that type will be empty.

Hide object

An array of ACH numbers identifying accounts.

Hide object

The Plaid account ID associated with the account numbers

The ACH account number for the account.

At certain institutions, including Chase, PNC, and US Bank, you will receive "tokenized" routing and account numbers, which are not the user's actual account and routing numbers. For important details on how this may impact your integration and on how to avoid fraud, user confusion, and ACH returns, see [Tokenized account numbers](https://plaid.com/docs/auth/#tokenized-account-numbers).

Indicates whether the account number is tokenized by the institution. For important details on how tokenized account numbers may impact your integration, see [Tokenized account numbers](https://plaid.com/docs/auth/#tokenized-account-numbers).

The ACH routing number for the account. This may be a tokenized routing number. For more information, see [Tokenized account numbers](https://plaid.com/docs/auth/#tokenized-account-numbers).

The wire transfer routing number for the account. This field is only populated if the institution is known to use a separate wire transfer routing number. Many institutions do not have a separate wire routing number and use the ACH routing number for wires instead. It is recommended to have the end user manually confirm their wire routing number before sending any wires to their account, especially if this field is `null`.

An array of EFT numbers identifying accounts.

Hide object

The Plaid account ID associated with the account numbers

The EFT account number for the account

The EFT institution number for the account

The EFT branch number for the account

An array of IBAN numbers identifying accounts.

Hide object

The Plaid account ID associated with the account numbers

The International Bank Account Number (IBAN) for the account

The Business Identifier Code (BIC) for the account

An array of Bacs numbers identifying accounts.

Hide object

The Plaid account ID associated with the account numbers

The Bacs account number for the account

The Bacs sort code for the account

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
  "accounts": [
    {
      "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
      "balances": {
        "available": 100,
        "current": 110,
        "limit": null,
        "iso_currency_code": "USD",
        "unofficial_currency_code": null
      },
      "mask": "9606",
      "name": "Plaid Checking",
      "official_name": "Plaid Gold Checking",
      "subtype": "checking",
      "type": "depository"
    }
  ],
  "numbers": {
    "ach": [
      {
        "account": "9900009606",
        "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
        "routing": "011401533",
        "wire_routing": "021000021",
        "is_tokenized_account_number": false
      }
    ],
    "eft": [
      {
        "account": "111122223333",
        "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
        "institution": "021",
        "branch": "01140"
      }
    ],
    "international": [
      {
        "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
        "bic": "NWBKGB21",
        "iban": "GB29NWBK60161331926819"
      }
    ],
    "bacs": [
      {
        "account": "31926819",
        "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
        "sort_code": "601613"
      }
    ]
  },
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
  "request_id": "m8MDnv9okwxFNBV"
}
```

=\*=\*=\*=[#### `/auth/verify`](/docs/api/products/auth/#authverify)

[#### Verify auth data](/docs/api/products/auth/#verify-auth-data)

The [`/auth/verify`](/docs/api/products/auth/#authverify) endpoint verifies bank account and routing numbers and (optionally) account owner names against Plaid's database via [Database Auth](https://plaid.com/docs/auth/coverage/database-auth/). It can be used to verify account numbers that were not collected via the Plaid Link flow.

This endpoint is currently in Early Availability; contact sales or your Plaid account manager to request access.

/auth/verify

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Account owner's legal name

An object containing identifying account numbers for verification via Database Auth

Hide object

ACH numbers for verification via Database Auth

Hide object

Account's account number

Account's routing number

/auth/verify

Nodeâ¼

```
const request: AuthVerifyRequest = {
  numbers: {
    ach: {
      account: '1234567890',
      routing: '011401533',
    },
  },
  legal_name: 'Jane Doe',
};
try {
  const response = await plaidClient.authVerify(request);
  const verificationStatus = response.data.verification_status;
  const nameMatchScore = response.data.verification_insights.name_match_score;
} catch (error) {
  // handle error
}
```

/auth/verify

**Response fields**

Collapse all

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

The `item_id` value of the Item created for verification. If numbers data provided is invalid, an Item may not be created.

Indicates the Item's database verification status. Possible values are:

`database_insights_fail`: The Item's numbers have been verified using Plaid's data sources and have signal for being invalid and/or have no signal for being valid. Typically this indicates that the routing number is invalid, the account number does not match the account number format associated with the routing number, or the account has been reported as closed or frozen. Only returned for Auth Items created via Database Auth.

`database_insights_pass`: The Item's numbers have been verified using Plaid's data sources: the routing and account number match a routing and account number of an account recognized on the Plaid network, and the account is not known by Plaid to be frozen or closed. Only returned for Auth Items created via Database Auth.

`database_insights_pass_with_caution`: The Item's numbers have been verified using Plaid's data sources and have some signal for being valid: the routing and account number were not recognized on the Plaid network, but the routing number is valid and the account number is a potential valid account number for that routing number. Only returned for Auth Items created via Database Auth.

Insights from performing database verification for the account. Only returned for Auth Items using Database Auth.

Hide object

Indicates the score of the name match between the given name provided during database verification (available in the [`verification_name`](https://plaid.com/docs/api/products/auth/#auth-get-response-accounts-verification-name) field if using standard Database Auth, or provided in the request if using `/auth/verify`) and matched Plaid network accounts. If defined, will be a value between 0 and 100. Will be undefined if name matching was not enabled for the database verification session or if there were no eligible Plaid network matches to compare the given name with.

Status information about the account and routing number in the Plaid network.

Hide object

Indicates whether we found at least one matching account for the ACH account and routing number.

Indicates if at least one matching account for the ACH account and routing number is already verified.

Information about known ACH returns for the account and routing number.

Hide object

Indicates whether Plaid's data sources include a known administrative ACH return for this account and routing number.

Indicator of account number format validity for institution.

`valid`: indicates that the account number has a correct format for the institution.

`invalid`: indicates that the account number has an incorrect format for the institution.

`unknown`: indicates that there was not enough information to determine whether the format is correct for the institution.

Possible values: `valid`, `invalid`, `unknown`

Response Object

```
{
  "request_id": "m8MDnv9okwxFNBV",
  "item_id": "DWVAAPWq4RHGlEaNyGKRTAnPLaEmo8Cvq7na6",
  "verification_status": "database_insights_pass",
  "verification_insights": {
    "name_match_score": 85,
    "network_status": {
      "has_numbers_match": true,
      "is_numbers_match_verified": true
    },
    "previous_returns": {
      "has_previous_administrative_return": false
    },
    "account_number_format": "valid"
  }
}
```

=\*=\*=\*=[#### `/bank_transfer/event/list`](/docs/api/products/auth/#bank_transfereventlist)

[#### List bank transfer events](/docs/api/products/auth/#list-bank-transfer-events)

Use the [`/bank_transfer/event/list`](/docs/api/products/auth/#bank_transfereventlist) endpoint to get a list of Plaid-initiated ACH or bank transfer events based on specified filter criteria. When using Auth with micro-deposit verification enabled, this endpoint can be used to fetch status updates on ACH micro-deposits. For more details, see [micro-deposit events](https://plaid.com/docs/auth/coverage/microdeposit-events/).

/bank\_transfer/event/list

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The start datetime of bank transfers to list. This should be in RFC 3339 format (i.e. `2019-12-06T22:35:49Z`)

Format: `date-time`

The end datetime of bank transfers to list. This should be in RFC 3339 format (i.e. `2019-12-06T22:35:49Z`)

Format: `date-time`

Plaid's unique identifier for a bank transfer.

The account ID to get events for all transactions to/from an account.

The type of bank transfer. This will be either `debit` or `credit`. A `debit` indicates a transfer of money into your origination account; a `credit` indicates a transfer of money out of your origination account.

Possible values: `debit`, `credit`, `null`

Filter events by event type.

Possible values: `pending`, `cancelled`, `failed`, `posted`, `reversed`

The maximum number of bank transfer events to return. If the number of events matching the above parameters is greater than `count`, the most recent events will be returned.

Default: `25`

Maximum: `25`

Minimum: `1`

The offset into the list of bank transfer events. When `count`=25 and `offset`=0, the first 25 events will be returned. When `count`=25 and `offset`=25, the next 25 bank transfer events will be returned.

Default: `0`

Minimum: `0`

The origination account ID to get events for transfers from a specific origination account.

Indicates the direction of the transfer: `outbound`: for API-initiated transfers
`inbound`: for payments received by the FBO account.

Possible values: `inbound`, `outbound`, `null`

/bank\_transfer/event/list

Nodeâ¼

```
const request: BankTransferEventListRequest = {
  start_date: start_date,
  end_date: end_date,
  bank_transfer_id: bank_transfer_id,
  account_id: account_id,
  bank_transfer_type: bank_transfer_type,
  event_types: event_types,
  count: count,
  offset: offset,
  origination_account_id: origination_account_id,
  direction: direction,
};
try {
  const response = await plaidClient.bankTransferEventList(request);
  const events = response.data.bank_transfer_events;
  for (const event of events) {
    // iterate through events
  }
} catch (error) {
  // handle error
}
```

/bank\_transfer/event/list

**Response fields**

Collapse all

Hide object

Plaid's unique identifier for this event. IDs are sequential unsigned 64-bit integers.

Minimum: `0`

The datetime when this event occurred. This will be of the form `2006-01-02T15:04:05Z`.

Format: `date-time`

The type of event that this bank transfer represents.

`pending`: A new transfer was created; it is in the pending state.

`cancelled`: The transfer was cancelled by the client.

`failed`: The transfer failed, no funds were moved.

`posted`: The transfer has been successfully submitted to the payment network.

`reversed`: A posted transfer was reversed.

Possible values: `pending`, `cancelled`, `failed`, `posted`, `reversed`

The account ID associated with the bank transfer.

Plaid's unique identifier for a bank transfer.

The ID of the origination account that this balance belongs to.

The type of bank transfer. This will be either `debit` or `credit`. A `debit` indicates a transfer of money into the origination account; a `credit` indicates a transfer of money out of the origination account.

Possible values: `debit`, `credit`

The bank transfer amount.

The currency of the bank transfer amount.

The failure reason if the type of this transfer is `"failed"` or `"reversed"`. Null value otherwise.

Hide object

The ACH return code, e.g. `R01`. A return code will be provided if and only if the transfer status is `reversed`. For a full listing of ACH return codes, see [Bank Transfers errors](https://plaid.com/docs/errors/bank-transfers/#ach-return-codes).

A human-readable description of the reason for the failure or reversal.

Indicates the direction of the transfer: `outbound` for API-initiated transfers, or `inbound` for payments received by the FBO account.

Possible values: `outbound`, `inbound`, `null`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "bank_transfer_events": [
    {
      "account_id": "6qL6lWoQkAfNE3mB8Kk5tAnvpX81qefrvvl7B",
      "bank_transfer_amount": "12.34",
      "bank_transfer_id": "460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9",
      "bank_transfer_iso_currency_code": "USD",
      "bank_transfer_type": "credit",
      "direction": "outbound",
      "event_id": 1,
      "event_type": "pending",
      "failure_reason": null,
      "origination_account_id": "",
      "timestamp": "2020-08-06T17:27:15Z"
    }
  ],
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/bank_transfer/event/sync`](/docs/api/products/auth/#bank_transfereventsync)

[#### Sync bank transfer events](/docs/api/products/auth/#sync-bank-transfer-events)

[`/bank_transfer/event/sync`](/docs/api/products/auth/#bank_transfereventsync) allows you to request up to the next 25 Plaid-initiated bank transfer events that happened after a specific `event_id`. When using Auth with micro-deposit verification enabled, this endpoint can be used to fetch status updates on ACH micro-deposits. For more details, see [micro-deposit events](https://plaid.com/docs/auth/coverage/microdeposit-events/).

/bank\_transfer/event/sync

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The latest (largest) `event_id` fetched via the sync endpoint, or 0 initially.

Minimum: `0`

The maximum number of bank transfer events to return.

Default: `25`

Minimum: `1`

Maximum: `25`

/bank\_transfer/event/sync

Nodeâ¼

```
const request: BankTransferEventSyncRequest = {
  after_id: afterID,
  count: 25,
};
try {
  const response = await plaidClient.bankTransferEventSync(request);
  const events = response.data.bank_transfer_events;
  for (const event of events) {
    // iterate through events
  }
} catch (error) {
  // handle error
}
```

/bank\_transfer/event/sync

**Response fields**

Collapse all

Hide object

Plaid's unique identifier for this event. IDs are sequential unsigned 64-bit integers.

Minimum: `0`

The datetime when this event occurred. This will be of the form `2006-01-02T15:04:05Z`.

Format: `date-time`

The type of event that this bank transfer represents.

`pending`: A new transfer was created; it is in the pending state.

`cancelled`: The transfer was cancelled by the client.

`failed`: The transfer failed, no funds were moved.

`posted`: The transfer has been successfully submitted to the payment network.

`reversed`: A posted transfer was reversed.

Possible values: `pending`, `cancelled`, `failed`, `posted`, `reversed`

The account ID associated with the bank transfer.

Plaid's unique identifier for a bank transfer.

The ID of the origination account that this balance belongs to.

The type of bank transfer. This will be either `debit` or `credit`. A `debit` indicates a transfer of money into the origination account; a `credit` indicates a transfer of money out of the origination account.

Possible values: `debit`, `credit`

The bank transfer amount.

The currency of the bank transfer amount.

The failure reason if the type of this transfer is `"failed"` or `"reversed"`. Null value otherwise.

Hide object

The ACH return code, e.g. `R01`. A return code will be provided if and only if the transfer status is `reversed`. For a full listing of ACH return codes, see [Bank Transfers errors](https://plaid.com/docs/errors/bank-transfers/#ach-return-codes).

A human-readable description of the reason for the failure or reversal.

Indicates the direction of the transfer: `outbound` for API-initiated transfers, or `inbound` for payments received by the FBO account.

Possible values: `outbound`, `inbound`, `null`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "bank_transfer_events": [
    {
      "account_id": "6qL6lWoQkAfNE3mB8Kk5tAnvpX81qefrvvl7B",
      "bank_transfer_amount": "12.34",
      "bank_transfer_id": "460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9",
      "bank_transfer_iso_currency_code": "USD",
      "bank_transfer_type": "credit",
      "direction": "outbound",
      "event_id": 1,
      "event_type": "pending",
      "failure_reason": null,
      "origination_account_id": "",
      "timestamp": "2020-08-06T17:27:15Z"
    }
  ],
  "request_id": "mdqfuVxeoza6mhu"
}
```

[### Webhooks](/docs/api/products/auth/#webhooks)

Updates are sent for Items that are linked using micro-deposits (excluding Instant Micro-deposits).

When an automated micro-deposit is created, Plaid sends a webhook upon successful verification. If verification does not succeed after seven days for an automated micro-deposit, Plaid sends a `VERIFICATION_EXPIRED` webhook. If you attempt to retrieve an automated micro-deposit Item before verification succeeds, you'll receive a response with the HTTP status code 400 and a Plaid error code of `PRODUCT_NOT_READY`. For Same-Day micro-deposits, Plaid does not send `AUTOMATICALLY_VERIFIED` or `VERIFICATION_EXPIRED` webhooks, but you may instead use the `BANK_TRANSFERS_EVENTS_UPDATE` webhook to [access the underlying ACH events](/docs/auth/coverage/microdeposit-events/) of micro-deposits.

Plaid will trigger a `DEFAULT_UPDATE` webhook for Items that undergo a change in Auth data. This is a rare event and is generally caused by data partners notifying Plaid of a change in their account numbering system or to their routing numbers. To avoid returned transactions, customers that receive a `DEFAULT_UPDATE` webhook with the `account_ids_with_updated_auth` object populated should immediately discontinue all usages of existing Auth data for those accounts and call [`/auth/get`](/docs/api/products/auth/#authget) or [`/processor/auth/get`](/docs/api/processor-partners/#processorauthget) to obtain updated account and routing numbers.

=\*=\*=\*=[#### `DEFAULT_UPDATE`](/docs/api/products/auth/#default_update)

Plaid will trigger a `DEFAULT_UPDATE` webhook for Items that undergo a change in Auth data. This is generally caused by data partners notifying Plaid of a change in their account numbering system or to their routing numbers. To avoid returned transactions, customers that receive a `DEFAULT_UPDATE` webhook with the `account_ids_with_updated_auth` object populated should immediately discontinue all usages of existing Auth data for those accounts and call [`/auth/get`](/docs/api/products/auth/#authget) or [`/processor/auth/get`](/docs/api/processor-partners/#processorauthget) to obtain updated account and routing numbers.

**Properties**

Collapse all

`AUTH`

`DEFAULT_UPDATE`

The `item_id` of the Item associated with this webhook, warning, or error

An array of `account_id`'s for accounts that contain new auth.

An object with keys of `account_id`'s that are mapped to their respective auth attributes that changed. `ACCOUNT_NUMBER` and `ROUTING_NUMBER` are the two potential values that can be flagged as updated.

Example: `{ "XMBvvyMGQ1UoLbKByoMqH3nXMj84ALSdE5B58": ["ACCOUNT_NUMBER"] }`

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
  "webhook_type": "AUTH",
  "webhook_code": "DEFAULT_UPDATE",
  "item_id": "wz666MBjYWTp2PDzzggYhM6oWWmBb",
  "account_ids_with_new_auth": [],
  "account_ids_with_updated_auth": {
    "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp": [
      "ACCOUNT_NUMBER"
    ]
  },
  "error": null,
  "environment": "production"
}
```

=\*=\*=\*=[#### `AUTOMATICALLY_VERIFIED`](/docs/api/products/auth/#automatically_verified)

Fired when an Item is verified via automated micro-deposits. We recommend communicating to your users when this event is received to notify them that their account is verified and ready for use.

**Properties**

Collapse all

`AUTH`

`AUTOMATICALLY_VERIFIED`

The `account_id` of the account associated with the webhook

The `item_id` of the Item associated with this webhook, warning, or error

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

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

API Object

```
{
  "webhook_type": "AUTH",
  "webhook_code": "AUTOMATICALLY_VERIFIED",
  "item_id": "eVBnVMp7zdTJLkRNr33Rs6zr7KNJqBFL9DrE6",
  "account_id": "dVzbVMLjrxTnLjX4G66XUp5GLklm4oiZy88yK",
  "environment": "production",
  "error": null
}
```

=\*=\*=\*=[#### `VERIFICATION_EXPIRED`](/docs/api/products/auth/#verification_expired)

Fired when an Item was not verified via automated micro-deposits after seven days since the automated micro-deposit was made.

**Properties**

Collapse all

`AUTH`

`VERIFICATION_EXPIRED`

The `item_id` of the Item associated with this webhook, warning, or error

The `account_id` of the account associated with the webhook

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

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

API Object

```
{
  "webhook_type": "AUTH",
  "webhook_code": "VERIFICATION_EXPIRED",
  "item_id": "eVBnVMp7zdTJLkRNr33Rs6zr7KNJqBFL9DrE6",
  "account_id": "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
  "environment": "production",
  "error": null
}
```

=\*=\*=\*=[#### `BANK_TRANSFERS_EVENTS_UPDATE`](/docs/api/products/auth/#bank_transfers_events_update)

Fired when new ACH events are available. To begin receiving this webhook, you must first register your webhook listener endpoint via the [webhooks page in the Dashboard](https://dashboard.plaid.com/team/webhooks). The `BANK_TRANSFERS_EVENTS_UPDATE` webhook can be used to track the progress of ACH transfers used in [micro-deposit verification](https://plaid.com/docs/auth/coverage/microdeposit-events/). Receiving this webhook indicates you should fetch the new events from [`/bank_transfer/event/sync`](/docs/api/products/auth/#bank_transfereventsync). Note that [Transfer](https://plaid.com/docs/transfer) customers should use Transfer webhooks instead of using `BANK_TRANSFERS_EVENTS_UPDATE`; see [micro-deposit events documentation](https://plaid.com/docs/auth/coverage/microdeposit-events/) for more details.

**Properties**

`BANK_TRANSFERS`

`BANK_TRANSFERS_EVENTS_UPDATE`

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "BANK_TRANSFERS",
  "webhook_code": "BANK_TRANSFERS_EVENTS_UPDATE",
  "environment": "production"
}
```

=\*=\*=\*=[#### `SMS_MICRODEPOSITS_VERIFICATION`](/docs/api/products/auth/#sms_microdeposits_verification)

Contains the state of an SMS Same-Day Micro-deposits verification session.

**Properties**

`AUTH`

`SMS_MICRODEPOSITS_VERIFICATION`

The final status of the Same-Day Micro-deposits verification. Will always be `MANUALLY_VERIFIED` or `VERIFICATION_FAILED`.

The `item_id` of the Item associated with this webhook, warning, or error

The external account ID of the affected account

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "AUTH",
  "webhook_code": "SMS_MICRODEPOSITS_VERIFICATION",
  "status": "MANUALLY_VERIFIED",
  "item_id": "eVBnVMp7zdTJLkRNr33Rs6zr7KNJqBFL9DrE6",
  "account_id": "dVzbVMLjrxTnLjX4G66XUp5GLklm4oiZy88yK",
  "environment": "sandbox"
}
```
