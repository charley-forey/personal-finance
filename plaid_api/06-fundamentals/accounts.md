---
title: "Accounts"
source_url: "https://plaid.com/docs/api/accounts/"
section: "Fundamentals"
section_id: "06-fundamentals"
slug: "accounts"
endpoints:
  - "/accounts/get"
  - "NEW_ACCOUNTS_AVAILABLE"
  - "/accounts/balance/get"
  - "/signal/evaluate"
  - "webhook"
  - "/transfer/migrate_account"
  - "403B"
  - "/institutions/get_by_id"
  - "ADA"
  - "BAT"
  - "BCH"
  - "BNB"
  - "BTC"
  - "BTG"
  - "BSV"
  - "CNH"
  - "DASH"
  - "DOGE"
  - "ETC"
  - "ETH"
  - "GBX"
  - "LSK"
  - "NEO"
  - "OMG"
  - "QTUM"
  - "USDT"
  - "XLM"
  - "XMR"
  - "XRP"
  - "ZEC"
  - "ZRX"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Accounts

> **Source:** [https://plaid.com/docs/api/accounts/](https://plaid.com/docs/api/accounts/)
> **Section:** Fundamentals

## Endpoints & Webhooks on this page

- `/accounts/get`
- `NEW_ACCOUNTS_AVAILABLE`
- `/accounts/balance/get`
- `/signal/evaluate`
- `webhook`
- `/transfer/migrate_account`
- `403B`
- `/institutions/get_by_id`
- `ADA`
- `BAT`
- `BCH`
- `BNB`
- `BTC`
- `BTG`
- `BSV`
- `CNH`
- `DASH`
- `DOGE`
- `ETC`
- `ETH`
- `GBX`
- `LSK`
- `NEO`
- `OMG`
- `QTUM`
- `USDT`
- `XLM`
- `XMR`
- `XRP`
- `ZEC`
- `ZRX`

---

# Accounts

#### API reference for retrieving account information and seeing all possible account types and subtypes

=\*=\*=\*=[#### `/accounts/get`](/docs/api/accounts/#accountsget)

[#### Retrieve accounts](/docs/api/accounts/#retrieve-accounts)

The [`/accounts/get`](/docs/api/accounts/#accountsget) endpoint can be used to retrieve a list of accounts associated with any linked Item. Plaid will only return active bank accounts -- that is, accounts that are not closed and are capable of carrying a balance.
To return new accounts that were created after the user linked their Item, you can listen for the [`NEW_ACCOUNTS_AVAILABLE`](https://plaid.com/docs/api/items/#new_accounts_available) webhook and then use Link's [update mode](https://plaid.com/docs/link/update-mode/) to request that the user share this new account with you.

[`/accounts/get`](/docs/api/accounts/#accountsget) is free to use and retrieves cached information, rather than extracting fresh information from the institution. The balance returned will reflect the balance at the time of the last successful Item update. If the Item is enabled for a regularly updating product, such as Transactions, Investments, or Liabilities, the balance will typically update about once a day, as long as the Item is healthy. If the Item is enabled only for products that do not frequently update, such as Auth or Identity, balance data may be much older.

For real-time balance information, use the paid endpoints [`/accounts/balance/get`](/docs/api/products/signal/#accountsbalanceget) or [`/signal/evaluate`](/docs/api/products/signal/#signalevaluate) instead.

/accounts/get

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The access token associated with the Item for which data is being requested.

An optional object to filter `/accounts/get` results.

Hide object

An array of `account_ids` to retrieve for the Account.

/accounts/get

Nodeâ¼

```
const request: AccountsGetRequest = {
  access_token: ACCESS_TOKEN,
};
try {
  const response = await plaidClient.accountsGet(request);
  const accounts = response.data.accounts;
} catch (error) {
  // handle error
}
```

/accounts/get

**Response fields**

Collapse all

An array of financial institution accounts associated with the Item.
If `/accounts/balance/get` was called, each account will include real-time balance information.

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
      "account_id": "blgvvBlXw3cq5GMPwqB6s6q4dLKB9WcVqGDGo",
      "balances": {
        "available": 100,
        "current": 110,
        "iso_currency_code": "USD",
        "limit": null,
        "unofficial_currency_code": null
      },
      "holder_category": "personal",
      "mask": "0000",
      "name": "Plaid Checking",
      "official_name": "Plaid Gold Standard 0% Interest Checking",
      "subtype": "checking",
      "type": "depository"
    },
    {
      "account_id": "6PdjjRP6LmugpBy5NgQvUqpRXMWxzktg3rwrk",
      "balances": {
        "available": null,
        "current": 23631.9805,
        "iso_currency_code": "USD",
        "limit": null,
        "unofficial_currency_code": null
      },
      "mask": "6666",
      "name": "Plaid 401k",
      "official_name": null,
      "subtype": "401k",
      "type": "investment"
    },
    {
      "account_id": "XMBvvyMGQ1UoLbKByoMqH3nXMj84ALSdE5B58",
      "balances": {
        "available": null,
        "current": 65262,
        "iso_currency_code": "USD",
        "limit": null,
        "unofficial_currency_code": null
      },
      "mask": "7777",
      "name": "Plaid Student Loan",
      "official_name": null,
      "subtype": "student",
      "type": "loan"
    }
  ],
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
  "request_id": "bkVE1BHWMAZ9Rnr"
}
```

[#### Account type schema](/docs/api/accounts/#account-type-schema)

The schema below describes the various `types` and corresponding `subtypes` that Plaid recognizes and reports for financial institution accounts. For a mapping of supported types and subtypes to Plaid products, see the [Account type / product support matrix](https://plaid.com/docs/api/accounts/#account-type--product-support-matrix).

**Properties**

Collapse all

An account type holding cash, in which funds are deposited.

Hide subtypes

A cash management account, typically a cash account at a brokerage

Certificate of deposit account

Checking account

An Electronic Benefit Transfer (EBT) account, used by certain public assistance programs to distribute funds (US only)

Health Savings Account (US only) that can only hold cash

A checking account that is limited in its purpose or usage. Note that this account subtype is opt-in only, meaning it cannot be connected in Link unless it is present in the subtypes filter.

Money market account

PayPal depository account

Prepaid debit card

Savings account

A credit card type account.

Hide subtypes

Bank-issued credit card

PayPal-issued credit card

A loan type account.

Hide subtypes

Auto loan

Business loan

Commercial loan

Construction loan

Consumer loan

Home Equity Line of Credit (HELOC)

Pre-approved line of credit

General loan

Mortgage loan

Other loan type or unknown loan type

Pre-approved overdraft account, usually tied to a checking account

Student loan

An investment account. In API versions 2018-05-22 and earlier, this type is called `brokerage`.

Hide subtypes

Tax-advantaged college savings and prepaid tuition 529 plans (US)

Employer-sponsored money-purchase 401(a) retirement plan (US)

Standard 401(k) retirement account (US)

403(b) retirement savings account for non-profits and schools (US)

Tax-advantaged deferred-compensation 457(b) retirement plan for governments and non-profits (US)

Standard brokerage account

Individual Savings Account (ISA) that pays interest tax-free (UK)

Standard cryptocurrency exchange account

Tax-advantaged Coverdell Education Savings Account (ESA) (US)

First Home Savings Account (FHSA) (Canada)

Fixed annuity

Guaranteed Investment Certificate (Canada)

Tax-advantaged Health Reimbursement Arrangement (HRA) benefit plan (US)

Non-cash tax-advantaged medical Health Savings Account (HSA) (US)

Traditional Individual Retirement Account (IRA) (US)

Non-cash Individual Savings Account (ISA) (UK)

Keogh self-employed retirement plan (US)

Life Income Fund (LIF) retirement account (Canada)

Life insurance account

Pre-approved line of credit

Locked-in Retirement Account (LIRA) (Canada)

Locked-in Retirement Income Fund (LRIF) (Canada)

Locked-in Retirement Savings Plan (Canada)

Mutual fund account

A cryptocurrency wallet where the user controls the private key

A non-taxable brokerage account that is not covered by a more specific subtype

An account whose type could not be determined

An annuity account not covered by other subtypes

An insurance account not covered by other subtypes

Standard pension account

Prescribed Registered Retirement Income Fund (Canada)

Plan that gives employees share of company profits

Qualifying share account

Registered Disability Savings Plan (RDSP) (Canada)

Registered Education Savings Plan (Canada)

Retirement account not covered by other subtypes

Restricted Life Income Fund (RLIF) (Canada)

Roth IRA (US)

Employer-sponsored Roth 401(k) plan (US)

Roth 403(b) retirement savings account for non-profits and schools (US)

Roth 457(b) deferred-compensation retirement plan for governments and non-profits (US)

Roth version of a standard pension account

Roth version of a profit sharing plan

Roth version of the Thrift Savings Plan (US)

Registered Retirement Income Fund (RRIF) (Canada)

Registered Retirement Savings Plan (Canadian, similar to US 401(k))

Salary Reduction Simplified Employee Pension Plan (SARSEP), discontinued retirement plan (US)

Simplified Employee Pension IRA (SEP IRA), retirement plan for small businesses and self-employed (US)

Savings Incentive Match Plan for Employees IRA, retirement plan for small businesses (US)

Self-Invested Personal Pension (SIPP) (UK)

Standard stock plan account

Tax-Free Savings Account (TFSA), a retirement plan similar to a Roth IRA (Canada)

Thrift Savings Plan, a retirement savings and investment plan for Federal employees and members of the uniformed services.

Account representing funds or assets held by a trustee for the benefit of a beneficiary. Includes both revocable and irrevocable trusts.

'Uniform Gift to Minors Act' (brokerage account for minors, US)

'Uniform Transfers to Minors Act' (brokerage account for minors, US)

Tax-deferred capital accumulation annuity contract

A payroll account.

Hide subtypes

Standard payroll account

Other or unknown account type.

[#### Account type / product support matrix](/docs/api/accounts/#account-type--product-support-matrix)

The chart below indicates which products can be used with which account types. Note that some products can only be used with certain subtypes:

- Auth and Signal require a debitable `checking`, `savings`, or `cash management` account.
- Liabilities does not support `loan` types other than `student` or `mortgage`.
- Transactions does not support `loan` types other than `student` or `mortgage`.
- Investments does not support `depository` types other than `cash management`.

Also note that not all institutions support all products; for details on which products a given institution supports, use [`/institutions/get_by_id`](/docs/api/institutions/#institutionsget_by_id) or look up the institution on the [Plaid Dashboard Institutions page](https://dashboard.plaid.com/activity/status) or the [Coverage Explorer](/docs/institutions/).

| Product | Depository | Credit | Investments | Loan | Other |
| --- | --- | --- | --- | --- | --- |
| [Balance](/docs/balance/) |  |  | \* |  |  |
| [Transactions](/docs/transactions/) |  |  |  |  |  |
| [Identity](/docs/identity/) |  |  |  |  |  |
| [Assets](/docs/assets/) |  |  |  |  |  |
| [Consumer Report by Plaid Check](/docs/check/) |  |  |  |  |  |
| [Investments](/docs/investments/) |  |  |  |  |  |
| [Investments Move](/docs/investments-move/) |  |  |  |  |  |
| [Liabilities](/docs/liabilities/) |  |  |  |  |  |
| [Auth](/docs/auth/) |  |  |  |  |  |
| [Transfer](/docs/transfer/) |  |  |  |  |  |
| [Income (Bank Income flow)](/docs/income/) |  |  |  |  |  |
| [Statements](/docs/statements/) |  |  |  |  |  |
| [Signal](/docs/signal/) |  |  |  |  |  |
| [Payment Initiation (UK and Europe)](/docs/payment-initiation/) |  |  |  |  |  |
| [Virtual Accounts (UK and Europe)](/docs/payment-initiation/) |  |  |  |  |  |

\* Investments holdings data is not priced intra-day.

[#### Currency code schema](/docs/api/accounts/#currency-code-schema)

The following currency codes are supported by Plaid.

**Properties**

Collapse all

Plaid supports all ISO 4217 currency codes.

List of unofficial currency codes

Hide currency codes

Cardano

Basic Attention Token

Bitcoin Cash

Binance Coin

Bitcoin

Bitcoin Gold

Bitcoin Satoshi Vision

Chinese Yuan (offshore)

Dash

Dogecoin

Ethereum Classic

Ethereum

Pence sterling, i.e. British penny

Lisk

Neo

OmiseGO

Qtum

Tether

Stellar Lumen

Monero

Ripple

Zcash

0x

[#### Investment transaction types schema](/docs/api/accounts/#investment-transaction-types-schema)

Valid values for investment transaction types and subtypes. Note that transactions representing inflow of cash will appear as negative amounts, outflow of cash will appear as positive amounts.

**Properties**

Collapse all

Buying an investment

Hide subtypes

Assignment of short option holding

Inflow of assets into a tax-advantaged account

Purchase to open or increase a position

Purchase to close a short position

Purchase using proceeds from a cash dividend

Purchase using proceeds from a cash interest payment

Purchase using long-term capital gain cash proceeds

Purchase using short-term capital gain cash proceeds

Selling an investment

Hide subtypes

Outflow of assets from a tax-advantaged account

Exercise of an option or warrant contract

Sell to close or decrease an existing holding

Sell to open a short position

A cancellation of a pending transaction

Activity that modifies a cash position

Hide subtypes

Fees paid for account maintenance

Inflow of assets into a tax-advantaged account

Inflow of cash into an account

Inflow of cash from a dividend

Inflow of stock from a distribution

Inflow of cash from interest

Fees paid for legal charges or services

Long-term capital gain received as cash

Fees paid for investment management of a mutual fund or other pooled investment vehicle

Fees paid for maintaining margin debt

Inflow of cash from a non-qualified dividend

Taxes paid on behalf of the investor for non-residency in investment jurisdiction

Pending inflow of cash

Pending outflow of cash

Inflow of cash from a qualified dividend

Short-term capital gain received as cash

Taxes paid on behalf of the investor

Taxes withheld on behalf of the customer

Fees incurred for transfer of a holding or account

Fees related to administration of a trust account

Unqualified capital gain received as cash

Outflow of cash from an account

Fees on the account, e.g. commission, bookkeeping, options-related.

Hide subtypes

Fees paid for account maintenance

Increase or decrease in quantity of item

Inflow of cash from a dividend

Inflow of cash from interest

Inflow of cash from interest receivable

Long-term capital gain received as cash

Fees paid for legal charges or services

Fees paid for investment management of a mutual fund or other pooled investment vehicle

Fees paid for maintaining margin debt

Inflow of cash from a non-qualified dividend

Taxes paid on behalf of the investor for non-residency in investment jurisdiction

Inflow of cash from a qualified dividend

Repayment of loan principal

Short-term capital gain received as cash

Inflow of stock from a distribution

Taxes paid on behalf of the investor

Taxes withheld on behalf of the customer

Fees incurred for transfer of a holding or account

Fees related to administration of a trust account

Unqualified capital gain received as cash

Activity that modifies a position, but not through buy/sell activity e.g. options exercise, portfolio transfer

Hide subtypes

Assignment of short option holding

Increase or decrease in quantity of item

Exercise of an option or warrant contract

Expiration of an option or warrant contract

Stock exchanged at a pre-defined ratio as part of a merger between companies

Request fiat or cryptocurrency to an address or email

Inflow or outflow of fiat or cryptocurrency to an address or email

Inflow of stock from spin-off transaction of an existing holding

Inflow of stock from a forward split of an existing holding

Trade of one cryptocurrency for another

Movement of assets into or out of an account
