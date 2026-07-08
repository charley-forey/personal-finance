---
title: "Identity"
source_url: "https://plaid.com/docs/api/products/identity/"
section: "Payments and Funding"
section_id: "01-payments-and-funding"
slug: "identity"
endpoints:
  - "/identity/get"
  - "/identity/match"
  - "/identity/documents/uploads/get"
  - "webhook"
  - "/transfer/migrate_account"
  - "/accounts/get"
  - "/accounts/balance/get"
  - "/signal/evaluate"
  - "Webhooks (beta)"
  - "DEFAULT_UPDATE"
  - "webhook_type"
  - "webhook_code"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Identity

> **Source:** [https://plaid.com/docs/api/products/identity/](https://plaid.com/docs/api/products/identity/)
> **Section:** Payments and Funding

## Endpoints & Webhooks on this page

- `/identity/get`
- `/identity/match`
- `/identity/documents/uploads/get`
- `webhook`
- `/transfer/migrate_account`
- `/accounts/get`
- `/accounts/balance/get`
- `/signal/evaluate`
- `Webhooks (beta)`
- `DEFAULT_UPDATE`
- `webhook_type`
- `webhook_code`

---

# Identity

#### API reference for Identity endpoints and webhooks

Verify the name, address, phone number, and email address of a user against bank account information on file. For how-to guidance, see the [Identity documentation](/docs/identity/).

| Endpoints |  |
| --- | --- |
| [`/identity/get`](/docs/api/products/identity/#identityget) | Fetch identity data |
| [`/identity/match`](/docs/api/products/identity/#identitymatch) | Match client identity with bank identity |
| [`/identity/documents/uploads/get`](/docs/api/products/identity/#identitydocumentsuploadsget) | Get Identity data parsed from an uploaded bank statement |

[### Endpoints](/docs/api/products/identity/#endpoints)=\*=\*=\*=[#### `/identity/get`](/docs/api/products/identity/#identityget)

[#### Retrieve identity data](/docs/api/products/identity/#retrieve-identity-data)

The [`/identity/get`](/docs/api/products/identity/#identityget) endpoint allows you to retrieve various account holder information on file with the financial institution, including names, emails, phone numbers, and addresses. Only name data is guaranteed to be returned; other fields will be empty arrays if not provided by the institution.

Note: In API versions 2018-05-22 and earlier, the `owners` object is not returned, and instead identity information is returned in the top level `identity` object. For more details, see [Plaid API versioning](https://plaid.com/docs/api/versioning/#version-2019-05-29).

/identity/get

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The access token associated with the Item for which data is being requested.

An optional object to filter `/identity/get` results.

Hide object

A list of `account_ids` to retrieve for the Item.
Note: An error will be returned if a provided `account_id` is not associated with the Item.

/identity/get

Nodeâ¼

```
// Pull Identity data for an Item
const request: IdentityGetRequest = {
  access_token: accessToken,
};
try {
  const response = await plaidClient.identityGet(request);
  const identities = response.data.accounts.flatMap(
    (account) => account.owners,
  );
} catch (error) {
  // handle error
}
```

/identity/get

**Response fields**

Collapse all

The accounts for which Identity data has been requested

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

Data returned by the financial institution about the account owner or owners. Only returned by Identity or Assets endpoints. For business accounts, the name reported may be either the name of the individual or the name of the business, depending on the institution; detecting whether the linked account is a business account is not currently supported. Multiple owners on a single account will be represented in the same `owner` object, not in multiple owner objects within the array. In API versions 2018-05-22 and earlier, the `owners` object is not returned, and instead identity information is returned in the top level `identity` object. For more details, see [Plaid API versioning](https://plaid.com/docs/api/versioning/#version-2019-05-29)

Hide object

A list of names associated with the account by the financial institution. In the case of a joint account, Plaid will make a best effort to report the names of all account holders.

If an Item contains multiple accounts with different owner names, some institutions will report all names associated with the Item in each account's `names` array.

A list of phone numbers associated with the account by the financial institution. May be an empty array if no relevant information is returned from the financial institution.

Hide object

The phone number.

When `true`, identifies the phone number as the primary number on an account.

The type of phone number.

Possible values: `home`, `work`, `office`, `mobile`, `mobile1`, `other`

A list of email addresses associated with the account by the financial institution. May be an empty array if no relevant information is returned from the financial institution.

Hide object

The email address.

When `true`, identifies the email address as the primary email on an account.

The type of email account as described by the financial institution.

Possible values: `primary`, `secondary`, `other`

Data about the various addresses associated with the account by the financial institution. May be an empty array if no relevant information is returned from the financial institution.

Hide object

Data about the components comprising an address.

Hide object

The full city name

The region or state. In API versions 2018-05-22 and earlier, this field is called `state`.
Example: `"NC"`

The full street address
Example: `"564 Main Street, APT 15"`

The postal code. In API versions 2018-05-22 and earlier, this field is called `zip`.

The ISO 3166-1 alpha-2 country code

When `true`, identifies the address as the primary address on an account.

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
      "account_id": "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
      "balances": {
        "available": 100,
        "current": 110,
        "iso_currency_code": "USD",
        "limit": null,
        "unofficial_currency_code": null
      },
      "mask": "0000",
      "name": "Plaid Checking",
      "official_name": "Plaid Gold Standard 0% Interest Checking",
      "owners": [
        {
          "addresses": [
            {
              "data": {
                "city": "Malakoff",
                "country": "US",
                "postal_code": "14236",
                "region": "NY",
                "street": "2992 Cameron Road"
              },
              "primary": true
            },
            {
              "data": {
                "city": "San Matias",
                "country": "US",
                "postal_code": "93405-2255",
                "region": "CA",
                "street": "2493 Leisure Lane"
              },
              "primary": false
            }
          ],
          "emails": [
            {
              "data": "accountholder0@example.com",
              "primary": true,
              "type": "primary"
            },
            {
              "data": "accountholder1@example.com",
              "primary": false,
              "type": "secondary"
            },
            {
              "data": "extraordinarily.long.email.username.123456@reallylonghostname.com",
              "primary": false,
              "type": "other"
            }
          ],
          "names": [
            "Alberta Bobbeth Charleson"
          ],
          "phone_numbers": [
            {
              "data": "2025550123",
              "primary": false,
              "type": "home"
            },
            {
              "data": "1112224444",
              "primary": false,
              "type": "work"
            },
            {
              "data": "1112225555",
              "primary": false,
              "type": "mobile"
            }
          ]
        }
      ],
      "subtype": "checking",
      "type": "depository"
    },
    {
      "account_id": "3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr",
      "balances": {
        "available": 200,
        "current": 210,
        "iso_currency_code": "USD",
        "limit": null,
        "unofficial_currency_code": null
      },
      "mask": "1111",
      "name": "Plaid Saving",
      "official_name": "Plaid Silver Standard 0.1% Interest Saving",
      "owners": [
        {
          "addresses": [
            {
              "data": {
                "city": "Malakoff",
                "country": "US",
                "postal_code": "14236",
                "region": "NY",
                "street": "2992 Cameron Road"
              },
              "primary": true
            },
            {
              "data": {
                "city": "San Matias",
                "country": "US",
                "postal_code": "93405-2255",
                "region": "CA",
                "street": "2493 Leisure Lane"
              },
              "primary": false
            }
          ],
          "emails": [
            {
              "data": "accountholder0@example.com",
              "primary": true,
              "type": "primary"
            },
            {
              "data": "accountholder1@example.com",
              "primary": false,
              "type": "secondary"
            },
            {
              "data": "extraordinarily.long.email.username.123456@reallylonghostname.com",
              "primary": false,
              "type": "other"
            }
          ],
          "names": [
            "Alberta Bobbeth Charleson"
          ],
          "phone_numbers": [
            {
              "data": "2025550123",
              "primary": false,
              "type": "home"
            },
            {
              "data": "1112224444",
              "primary": false,
              "type": "work"
            },
            {
              "data": "1112225555",
              "primary": false,
              "type": "mobile"
            }
          ]
        }
      ],
      "subtype": "savings",
      "type": "depository"
    }
  ],
  "item": {
    "available_products": [
      "balance",
      "investments"
    ],
    "billed_products": [
      "assets",
      "auth",
      "identity",
      "liabilities",
      "transactions"
    ],
    "consent_expiration_time": null,
    "error": null,
    "institution_id": "ins_3",
    "institution_name": "Chase",
    "item_id": "eVBnVMp7zdTJLkRNr33Rs6zr7KNJqBFL9DrE6",
    "update_type": "background",
    "webhook": "https://www.genericwebhookurl.com/webhook",
    "auth_method": "INSTANT_AUTH"
  },
  "request_id": "3nARps6TOYtbACO"
}
```

=\*=\*=\*=[#### `/identity/match`](/docs/api/products/identity/#identitymatch)

[#### Retrieve identity match score](/docs/api/products/identity/#retrieve-identity-match-score)

The [`/identity/match`](/docs/api/products/identity/#identitymatch) endpoint generates a match score, which indicates how well the provided identity data matches the identity information on file with the account holder's financial institution.

Fields within the `balances` object will always be null when retrieved by [`/identity/match`](/docs/api/products/identity/#identitymatch). Instead, use the free [`/accounts/get`](/docs/api/accounts/#accountsget) endpoint to request balance cached data, or [`/accounts/balance/get`](/docs/api/products/signal/#accountsbalanceget) or [`/signal/evaluate`](/docs/api/products/signal/#signalevaluate) for real-time data.

/identity/match

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The access token associated with the Item for which data is being requested.

The user's legal name, phone number, email address and address used to perform fuzzy match. If Financial Account Matching is enabled in the Identity Verification product, leave this field empty to automatically match against PII collected from the Identity Verification checks.

Hide object

The user's full legal name.

The user's phone number, in E.164 format: +{countrycode}{number}. For example: "+14157452130". Phone numbers provided in other formats will be parsed on a best-effort basis. Phone number input is validated against valid number ranges; number strings that do not match a real-world phone numbering scheme may cause the request to fail, even in the Sandbox test environment.

The user's email address.

Data about the components comprising an address.

Hide object

The full city name

The region or state. In API versions 2018-05-22 and earlier, this field is called `state`.
Example: `"NC"`

The full street address
Example: `"564 Main Street, APT 15"`

The postal code. In API versions 2018-05-22 and earlier, this field is called `zip`.

The ISO 3166-1 alpha-2 country code

An optional object to filter `/identity/match` results

Hide object

An array of `account_ids` to perform fuzzy match

/identity/match

Nodeâ¼

```
const request = {
  access_token: accessToken,
  // Omit user object if using Identity Verification Financial Account Matching
  user: {
    legal_name: 'Jane Smith',
    phone_number: '+14155552671',
    email_address: 'jane.smith@example.com',
    address: {
      street: '500 Market St',
      city: 'San Francisco',
      region: 'CA',
      postal_code: '94105',
      country: 'US',
    },
  },
};

try {
  const response = await plaidClient.identityMatch(request);
  const accounts = response.data.accounts;
  for (const account of accounts) {
    const legalNameScore = account.legal_name?.score;
    const phoneScore = account.phone_number?.score;
    const emailScore = account.email_address?.score;
    const addressScore = account.address?.score;
  }
} catch (error) {
  // handle error
}
```

/identity/match

**Response fields**

Collapse all

The accounts for which Identity match has been requested

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

Score found by matching name provided by the API with the name on the account at the financial institution. If the account contains multiple owners, the maximum match score is filled.

Hide object

Match score for name. 100 is a perfect score, 99-85 means a strong match, 84-70 is a partial match, any score less than 70 is a mismatch. Typically, the match threshold should be set to a score of 70 or higher. If the name is missing from either the API or financial institution, this is null.

first or last name completely matched, likely a family member

nickname matched, example Jennifer and Jenn.

Is `true` if the name on either of the names that was matched for the score contained strings indicative of a business name, such as "CORP", "LLC", "INC", or "LTD". A `true` result generally indicates that an account's name is a business name. However, a `false` result does not mean the account name is not a business name, as some businesses do not use these strings in the names used for their financial institution accounts.

Score found by matching phone number provided by the API with the phone number on the account at the financial institution. 100 is a perfect match and 0 is a no match. If the account contains multiple owners, the maximum match score is filled.

Hide object

Match score for normalized phone number. 100 is a perfect match, 99-70 is a partial match (matching the same phone number with extension against one without extension, etc.), anything below 70 is considered a mismatch. Typically, the match threshold should be set to a score of 70 or higher. If the phone number is missing from either the API or financial institution, this is null.

Score found by matching email provided by the API with the email on the account at the financial institution. 100 is a perfect match and 0 is a no match. If the account contains multiple owners, the maximum match score is filled.

Hide object

Match score for normalized email. 100 is a perfect match, 99-70 is a partial match (matching the same email with different '+' extensions), anything below 70 is considered a mismatch. Typically, the match threshold should be set to a score of 70 or higher. If the email is missing from either the API or financial institution, this is null.

Score found by matching address provided by the API with the address on the account at the financial institution. The score can range from 0 to 100 where 100 is a perfect match and 0 is a no match. If the account contains multiple owners, the maximum match score is filled.

Hide object

Match score for address. 100 is a perfect match, 99-90 is a strong match, 89-70 is a partial match, anything below 70 is considered a weak match. Typically, the match threshold should be set to a score of 70 or higher. If the address is missing from either the API or financial institution, this is null.

postal code was provided for both and was a match

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
      "account_id": "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
      "balances": {
        "available": null,
        "current": null,
        "iso_currency_code": null,
        "limit": null,
        "unofficial_currency_code": null
      },
      "mask": "0000",
      "name": "Plaid Checking",
      "official_name": "Plaid Gold Standard 0% Interest Checking",
      "legal_name": {
        "score": 90,
        "is_nickname_match": true,
        "is_first_name_or_last_name_match": true,
        "is_business_name_detected": false
      },
      "phone_number": {
        "score": 100
      },
      "email_address": {
        "score": 100
      },
      "address": {
        "score": 100,
        "is_postal_code_match": true
      },
      "subtype": "checking",
      "type": "depository"
    },
    {
      "account_id": "3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr",
      "balances": {
        "available": null,
        "current": null,
        "iso_currency_code": null,
        "limit": null,
        "unofficial_currency_code": null
      },
      "mask": "1111",
      "name": "Plaid Saving",
      "official_name": "Plaid Silver Standard 0.1% Interest Saving",
      "legal_name": {
        "score": 30,
        "is_first_name_or_last_name_match": false
      },
      "phone_number": {
        "score": 100
      },
      "email_address": null,
      "address": {
        "score": 100,
        "is_postal_code_match": true
      },
      "subtype": "savings",
      "type": "depository"
    }
  ],
  "item": {
    "available_products": [
      "balance",
      "investments"
    ],
    "billed_products": [
      "assets",
      "auth",
      "identity",
      "liabilities",
      "transactions"
    ],
    "consent_expiration_time": null,
    "error": null,
    "institution_id": "ins_3",
    "institution_name": "Chase",
    "item_id": "eVBnVMp7zdTJLkRNr33Rs6zr7KNJqBFL9DrE6",
    "update_type": "background",
    "webhook": "https://www.genericwebhookurl.com/webhook",
    "auth_method": "INSTANT_AUTH"
  },
  "request_id": "3nARps6TOYtbACO"
}
```

=\*=\*=\*=[#### `/identity/documents/uploads/get`](/docs/api/products/identity/#identitydocumentsuploadsget)

[#### Returns uploaded document identity](/docs/api/products/identity/#returns-uploaded-document-identity)

Use [`/identity/documents/uploads/get`](/docs/api/products/identity/#identitydocumentsuploadsget) to retrieve identity details when using [Identity Document Upload](https://plaid.com/docs/identity/identity-document-upload/).

/identity/documents/uploads/get

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The access token associated with the Item for which data is being requested.

An optional object to filter `/identity/documents/uploads/get` results.

Hide object

A list of `account_ids` to retrieve for the Item.
Note: An error will be returned if a provided `account_id` is not associated with the Item.

/identity/documents/uploads/get

Nodeâ¼

```
const request: IdentityDocumentsUploadsGetRequest = {
  access_token: accessToken,
};
try {
  const response = await client.identityDocumentsUploadsGet(request);
} catch (error) {
  // handle error
}
```

/identity/documents/uploads/get

**Response fields**

Collapse all

The accounts for which Identity data has been requested

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

Data returned by the financial institution about the account owner or owners. Only returned by Identity or Assets endpoints. For business accounts, the name reported may be either the name of the individual or the name of the business, depending on the institution; detecting whether the linked account is a business account is not currently supported. Multiple owners on a single account will be represented in the same `owner` object, not in multiple owner objects within the array. In API versions 2018-05-22 and earlier, the `owners` object is not returned, and instead identity information is returned in the top level `identity` object. For more details, see [Plaid API versioning](https://plaid.com/docs/api/versioning/#version-2019-05-29)

Hide object

A list of names associated with the account by the financial institution. In the case of a joint account, Plaid will make a best effort to report the names of all account holders.

If an Item contains multiple accounts with different owner names, some institutions will report all names associated with the Item in each account's `names` array.

A list of phone numbers associated with the account by the financial institution. May be an empty array if no relevant information is returned from the financial institution.

Hide object

The phone number.

When `true`, identifies the phone number as the primary number on an account.

The type of phone number.

Possible values: `home`, `work`, `office`, `mobile`, `mobile1`, `other`

A list of email addresses associated with the account by the financial institution. May be an empty array if no relevant information is returned from the financial institution.

Hide object

The email address.

When `true`, identifies the email address as the primary email on an account.

The type of email account as described by the financial institution.

Possible values: `primary`, `secondary`, `other`

Data about the various addresses associated with the account by the financial institution. May be an empty array if no relevant information is returned from the financial institution.

Hide object

Data about the components comprising an address.

Hide object

The full city name

The region or state. In API versions 2018-05-22 and earlier, this field is called `state`.
Example: `"NC"`

The full street address
Example: `"564 Main Street, APT 15"`

The postal code. In API versions 2018-05-22 and earlier, this field is called `zip`.

The ISO 3166-1 alpha-2 country code

When `true`, identifies the address as the primary address on an account.

Data about the documents that were uploaded as proof of account ownership.

Hide object

A UUID identifying the document.

Metadata pertaining to the document.

Hide object

The submitted document type. Currently, this will always be `BANK_STATEMENT`.

Boolean field indicating whether the uploaded document's account number matches the account number we have on file. If `false`, it is not recommended to accept the uploaded identity data as accurate without further verification.

The number of pages in the uploaded document.

The timestamp when the document was last updated.

Format: `date-time`

The timestamp when the document was originally uploaded.

Format: `date-time`

Object representing fraud risk data of the uploaded document. Only provided when using Identity Document Upload with Fraud Risk enabled.

Hide object

Risk summary of an uploaded document.

Hide object

A number between 0 and 100, inclusive, where a score closer to 0 indicates a document is likely to be trustworthy and a score closer to 100 indicates a document is likely to be fraudulent.

An array of risk signals.

Hide object

The type of risk found.

Possible values: `FONT`, `MASKING`, `OVERLAID_TEXT`, `EDITED_TEXT`, `TEXT_COMPRESSION`, `ADDRESS_FORMAT_ANOMALY`, `DATE_FORMAT_ANOMALY`, `FONT_ANOMALY`, `NAME_FORMAT_ANOMALY`, `PDF_ALIGNMENT`, `BRUSH_DETECTION`, `METADATA_DATES_OUTSIDE_WINDOW`, `METADATA_DATES_INSIDE_WINDOW`, `METADATA_DATES_MISSING`, `METADATA_DATES_MATCH`, `ADOBE_FONTS`, `ANNOTATION_DATES`, `ANNOTATIONS`, `EDITED_WHILE_SCANNED`, `EXIF_DATA_MODIFIED`, `HIGH_USER_ACCESS`, `MALFORMED_DATE`, `QPDF`, `TEXT_LAYER_TEXT`, `TOUCHUP_TEXT`, `FLATTENED_PDF`, `BLACKLISTS`, `COPYCAT_IMAGE`, `COPYCAT_TEXT`, `REJECTED_CUSTOMER`, `TEMPLATES`, `SOFTWARE_BLACKLIST`

Indicates whether fraud risk was detected on the field.

A human-readable explanation providing more detail about the specific risk signal.

The relevant page associated with the risk signal. If the risk signal is not associated with a specific page, the value will be 0.

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
      "account_id": "ZXEbW7Rkr9iv1qj8abebU1KDMlkexgSgrLAod",
      "balances": {
        "available": null,
        "current": null,
        "iso_currency_code": "USD",
        "limit": null,
        "unofficial_currency_code": null
      },
      "documents": [
        {
          "document_id": "9f838fef-b0a5-4ef4-bf73-8e5248d43ad7",
          "metadata": {
            "document_type": "BANK_STATEMENT",
            "is_account_number_match": true,
            "last_updated": "2024-09-25T23:57:12Z",
            "page_count": 1,
            "uploaded_at": "2024-09-25T23:57:12Z"
          },
          "risk_insights": {
            "risk_signals": [
              {
                "has_fraud_risk": true,
                "page_number": 0,
                "signal_description": "Creation date and modification date do not match",
                "type": "METADATA_DATES_OUTSIDE_WINDOW"
              },
              {
                "has_fraud_risk": true,
                "page_number": 0,
                "signal_description": "Adobe Acrobat",
                "type": "SOFTWARE_BLACKLIST"
              }
            ],
            "risk_summary": {
              "risk_score": 100
            }
          }
        }
      ],
      "mask": "0000",
      "name": "Checking ...0000",
      "official_name": null,
      "owners": [
        {
          "addresses": [
            {
              "data": {
                "city": "OAKLAND",
                "country": "US",
                "postal_code": "94103",
                "region": "CA",
                "street": "1234 GRAND AVE"
              },
              "primary": true
            }
          ],
          "document_id": "9f838fef-b0a5-4ef4-bf73-8e5248d43ad7",
          "emails": [],
          "names": [
            "JANE DOE"
          ],
          "phone_numbers": []
        }
      ],
      "subtype": "checking",
      "type": "depository",
      "verification_status": "manually_verified"
    }
  ],
  "item": {
    "available_products": [],
    "billed_products": [
      "auth"
    ],
    "consent_expiration_time": null,
    "error": null,
    "item_id": "QwpzDByRv8uvdpwKEW3WU4PkGEApajtp3o4NN",
    "products": [
      "auth"
    ],
    "update_type": "background",
    "webhook": "https://www.example.com/webhook"
  },
  "request_id": "b5jvmskusjwX5Gs"
}
```

[### Webhooks (beta)](/docs/api/products/identity/#webhooks-beta)

This feature is currently in beta; please reach out to your Plaid account manager if you would like it enabled.

=\*=\*=\*=[#### `DEFAULT_UPDATE`](/docs/api/products/identity/#default_update)

Fired when a change to identity data has been detected on an Item. Items are checked for identity updates every 30-90 days. We recommend that upon receiving this webhook you make another call to [`/identity/get`](/docs/api/products/identity/#identityget) to fetch the user's latest identity data.

**Properties**

Collapse all

`IDENTITY`

`DEFAULT_UPDATE`

The `item_id` of the Item associated with this webhook, warning, or error

An object with keys of `account_id`'s that are mapped to their respective identity attributes that changed.

Example: `{ "XMBvvyMGQ1UoLbKByoMqH3nXMj84ALSdE5B58": ["PHONES"] }`

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
  "webhook_type": "IDENTITY",
  "webhook_code": "DEFAULT_UPDATE",
  "item_id": "wz666MBjYWTp2PDzzggYhM6oWWmBb",
  "account_ids_with_updated_identity": {
    "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp": [
      "ADDRESSES"
    ]
  },
  "error": null,
  "environment": "production"
}
```
