---
title: "Consumer Report (Plaid Check)"
source_url: "https://plaid.com/docs/api/products/check/"
section: "Credit and Underwriting"
section_id: "04-credit-and-underwriting"
slug: "check"
endpoints:
  - "/cra/check_report/base_report/get"
  - "/cra/check_report/income_insights/get"
  - "/cra/check_report/network_insights/get"
  - "/cra/check_report/partner_insights/get"
  - "/cra/check_report/pdf/get"
  - "/cra/check_report/cashflow_insights/get"
  - "/cra/check_report/lend_score/get"
  - "/cra/check_report/verification/get"
  - "/cra/check_report/verification/pdf/get"
  - "/cra/check_report/create"
  - "/cra/monitoring_insights/get"
  - "/cra/monitoring_insights/subscribe"
  - "/cra/monitoring_insights/unsubscribe"
  - "/link/token/create"
  - "/user/create"
  - "/user/update"
  - "/user/items/get"
  - "/sandbox/cra/cashflow_updates/update"
  - "USER_CHECK_REPORT_READY"
  - "USER_CHECK_REPORT_FAILED"
  - "CHECK_REPORT_READY"
  - "CHECK_REPORT_FAILED"
  - "CASH_FLOW_INSIGHTS_UPDATED"
  - "INSIGHTS_UPDATED"
  - "LARGE_DEPOSIT_DETECTED"
  - "LOW_BALANCE_DETECTED"
  - "NEW_LOAN_PAYMENT_DETECTED"
  - "NSF_OVERDRAFT_DETECTED"
  - "webhook"
  - "Webhooks"
  - "webhook_type"
  - "webhook_code"
  - "Cash flow updates webhooks"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Plaid Check

> **Source:** [https://plaid.com/docs/api/products/check/](https://plaid.com/docs/api/products/check/)
> **Section:** Credit and Underwriting

## Endpoints & Webhooks on this page

- `/cra/check_report/base_report/get`
- `/cra/check_report/income_insights/get`
- `/cra/check_report/network_insights/get`
- `/cra/check_report/partner_insights/get`
- `/cra/check_report/pdf/get`
- `/cra/check_report/cashflow_insights/get`
- `/cra/check_report/lend_score/get`
- `/cra/check_report/verification/get`
- `/cra/check_report/verification/pdf/get`
- `/cra/check_report/create`
- `/cra/monitoring_insights/get`
- `/cra/monitoring_insights/subscribe`
- `/cra/monitoring_insights/unsubscribe`
- `/link/token/create`
- `/user/create`
- `/user/update`
- `/user/items/get`
- `/sandbox/cra/cashflow_updates/update`
- `USER_CHECK_REPORT_READY`
- `USER_CHECK_REPORT_FAILED`
- `CHECK_REPORT_READY`
- `CHECK_REPORT_FAILED`
- `CASH_FLOW_INSIGHTS_UPDATED`
- `INSIGHTS_UPDATED`
- `LARGE_DEPOSIT_DETECTED`
- `LOW_BALANCE_DETECTED`
- `NEW_LOAN_PAYMENT_DETECTED`
- `NSF_OVERDRAFT_DETECTED`
- `webhook`
- `Webhooks`
- `webhook_type`
- `webhook_code`
- `Cash flow updates webhooks`

---

# Plaid Check

#### API reference for Plaid Check endpoints and webhooks

| Endpoints |  |
| --- | --- |
| [`/cra/check_report/base_report/get`](/docs/api/products/check/#cracheck_reportbase_reportget) | Retrieve the base Consumer Report for your user |
| [`/cra/check_report/income_insights/get`](/docs/api/products/check/#cracheck_reportincome_insightsget) | Retrieve income insights from your user's banks |
| [`/cra/check_report/network_insights/get`](/docs/api/products/check/#cracheck_reportnetwork_insightsget) | Retrieve connection insights from the Plaid network (beta) |
| [`/cra/check_report/partner_insights/get`](/docs/api/products/check/#cracheck_reportpartner_insightsget) | Retrieve cash flow insights from our partners |
| [`/cra/check_report/pdf/get`](/docs/api/products/check/#cracheck_reportpdfget) | Retrieve a Consumer Report in PDF format |
| [`/cra/check_report/cashflow_insights/get`](/docs/api/products/check/#cracheck_reportcashflow_insightsget) | Retrieve Cash Flow Insights report |
| [`/cra/check_report/lend_score/get`](/docs/api/products/check/#cracheck_reportlend_scoreget) | Retrieve a Plaid LendScore generated from your user's banking data |
| [`/cra/check_report/verification/get`](/docs/api/products/check/#cracheck_reportverificationget) | Retrieve Verification Reports (Home Lending Report, Employment Refresh) for your user |
| [`/cra/check_report/verification/pdf/get`](/docs/api/products/check/#cracheck_reportverificationpdfget) | Retrieve Verification Reports in PDF format |
| [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate) | Generate a new Consumer Report for your user with the latest data |
| [`/cra/monitoring_insights/get`](/docs/api/products/check/#cramonitoring_insightsget) | Get Cash Flow Updates (beta) |
| [`/cra/monitoring_insights/subscribe`](/docs/api/products/check/#cramonitoring_insightssubscribe) | Subscribe to Cash Flow Updates (beta) |
| [`/cra/monitoring_insights/unsubscribe`](/docs/api/products/check/#cramonitoring_insightsunsubscribe) | Unsubscribe from Cash Flow Updates (beta) |

| See also |  |
| --- | --- |
| [Migrate to new User APIs](/docs/api/users/migrate-to-new-user-apis/) | Migration guide for existing Consumer Report integrations on legacy User APIs |
| [`/link/token/create`](/docs/api/link/#linktokencreate) | Create a token for initializing a Link session with Plaid Check |
| [`/user/create`](/docs/api/users/#usercreate) | Create a user for use with Plaid Check |
| [`/user/update`](/docs/api/users/#userupdate) | Update an existing user token to work with Plaid Check, or change user details |
| [`/user/items/get`](/docs/api/users/#useritemsget) | Returns Items associated with a user along with their corresponding statuses |
| [`/sandbox/cra/cashflow_updates/update`](/docs/api/sandbox/#sandboxcracashflow_updatesupdate) | Manually trigger a cashflow insights update for a user (Sandbox only) |

| Webhooks |  |
| --- | --- |
| [`USER_CHECK_REPORT_READY`](/docs/api/products/check/#user_check_report_ready) | A Consumer Report is ready to be retrieved |
| [`USER_CHECK_REPORT_FAILED`](/docs/api/products/check/#user_check_report_failed) | Plaid Check failed to create a report |
| [`CHECK_REPORT_READY`](/docs/api/products/check/#check_report_ready) | A Consumer Report is ready to be retrieved (legacy) |
| [`CHECK_REPORT_FAILED`](/docs/api/products/check/#check_report_failed) | Plaid Check failed to create a report (legacy) |

| Cash Flow Updates (beta) webhooks |  |
| --- | --- |
| [`CASH_FLOW_INSIGHTS_UPDATED`](/docs/api/products/check/#cash_flow_insights_updated) | Insights have been refreshed |
| [`INSIGHTS_UPDATED`](/docs/api/products/check/#insights_updated) | Insights have been refreshed (legacy) |
| [`LARGE_DEPOSIT_DETECTED`](/docs/api/products/check/#large_deposit_detected) | A large deposit over $5000 has been detected (legacy) |
| [`LOW_BALANCE_DETECTED`](/docs/api/products/check/#low_balance_detected) | Current balance has crossed below $100 (legacy) |
| [`NEW_LOAN_PAYMENT_DETECTED`](/docs/api/products/check/#new_loan_payment_detected) | A new loan payment has been detected (legacy) |
| [`NSF_OVERDRAFT_DETECTED`](/docs/api/products/check/#nsf_overdraft_detected) | An overdraft transaction has been detected (legacy) |

=\*=\*=\*=[#### `/cra/check_report/base_report/get`](/docs/api/products/check/#cracheck_reportbase_reportget)

[#### Retrieve a Base Report](/docs/api/products/check/#retrieve-a-base-report)

This endpoint allows you to retrieve the Base Report for your user, allowing you to receive comprehensive bank account and cash flow data. You should call this endpoint after you've received a `CHECK_REPORT_READY` or a `USER_CHECK_REPORT_READY` webhook, either after the Link session for the user or after calling [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate). If the most recent consumer report for the user doesn't have sufficient data to generate the base report, or the consumer report has expired, you will receive an error indicating that you should create a new consumer report by calling [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate).

/cra/check\_report/base\_report/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

A unique user identifier, created by `/user/create`. Integrations that began using `/user/create` after December 10, 2025 use this field to identify a user instead of the `user_token`. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

The user token associated with the user for which data is being requested. This field is used only by customers with pre-existing integrations that already use the `user_token` field. All other customers should use the `user_id` instead. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

/cra/check\_report/base\_report/get

Nodeâ¼

```
try {
  const response = await client.craCheckReportBaseReportGet({
    user_id: 'usr_9nSp2KuZ2x4JDw',
  });
} catch (error) {
  // handle error
}
```

/cra/check\_report/base\_report/get

**Response fields**

Collapse all

An object representing a Base Report

Hide object

A unique ID identifying a Base Report. Like all Plaid identifiers, this ID is case sensitive.

The date and time when the Base Report was created, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (e.g. "2018-04-12T03:32:11Z").

Format: `date-time`

The number of days of transaction history requested.

Client-generated identifier, which can be used by lenders to track loan applications.

Data returned by Plaid about each of the Items included in the Base Report.

Hide object

The full financial institution name associated with the Item.

The id of the financial institution associated with the Item.

The date and time when this Item's data was last retrieved from the financial institution, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date-time`

The `item_id` of the Item associated with this webhook, warning, or error

Data about each of the accounts open on the Item.

Hide object

Plaid's unique identifier for the account. This value will not change unless Plaid can't reconcile the account with the data returned by the financial institution. This may occur, for example, when the name of the account changes. If this happens a new `account_id` will be assigned to the account.

If an account with a specific `account_id` disappears instead of changing, the account is likely closed. Closed accounts are not returned by the Plaid API.

Like all Plaid identifiers, the `account_id` is case sensitive.

Information about an account's balances.

Hide object

The amount of funds available to be withdrawn from the account, as determined by the financial institution.

For `credit`-type accounts, the `available` balance typically equals the `limit` less the `current` balance, less any pending outflows plus any pending inflows.

For `depository`-type accounts, the `available` balance typically equals the `current` balance less any pending outflows plus any pending inflows. For `depository`-type accounts, the `available` balance does not include the overdraft limit.

For `investment`-type accounts (or `brokerage`-type accounts for API versions 2018-05-22 and earlier), the `available` balance is the total cash available to withdraw as presented by the institution.

Note that not all institutions calculate the `available` balance. In the event that `available` balance is unavailable, Plaid will return an `available` balance value of `null`.

Available balance may be cached and is not guaranteed to be up-to-date in real-time unless the value was returned by `/accounts/balance/get`.

If `current` is `null` this field is guaranteed not to be `null`.

Format: `double`

The total amount of funds in or owed by the account.

For `credit`-type accounts, a positive balance indicates the amount owed; a negative amount indicates the lender owing the account holder.

For `loan`-type accounts, the current balance is the principal remaining on the loan, except in the case of student loan accounts at Sallie Mae (`ins_116944`). For Sallie Mae student loans, the account's balance includes both principal and any outstanding interest.

For `investment`-type accounts (or `brokerage`-type accounts for API versions 2018-05-22 and earlier), the current balance is the total value of assets as presented by the institution.

Note that balance information may be cached unless the value was returned by `/accounts/balance/get`; if the Item is enabled for Transactions, the balance will be at least as recent as the most recent Transaction update. If you require real-time balance information, use the `available` balance as provided by `/accounts/balance/get`.

When returned by `/accounts/balance/get`, this field may be `null`. When this happens, `available` is guaranteed not to be `null`.

Format: `double`

For `credit`-type accounts, this represents the credit limit.

For `depository`-type accounts, this represents the pre-arranged overdraft limit, which is common for current (checking) accounts in Europe.

In North America, this field is typically only available for `credit`-type accounts.

Format: `double`

The ISO-4217 currency code of the balance. Always null if `unofficial_currency_code` is non-null.

The unofficial currency code associated with the balance. Always null if `iso_currency_code` is non-null. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format (`YYYY-MM-DDTHH:mm:ssZ`) indicating the oldest acceptable balance when making a request to `/accounts/balance/get`.

This field is only used and expected when the institution is `ins_128026` (Capital One) and the Item contains one or more accounts with a non-depository account type, in which case a value must be provided or an `INVALID_REQUEST` error with the code of `INVALID_FIELD` will be returned. For Capital One depository accounts as well as all other account types on all other institutions, this field is ignored. See [account type schema](https://plaid.com/docs/api/accounts/#account-type-schema) for a full list of account types.

If the balance that is pulled is older than the given timestamp for Items with this field required, an `INVALID_REQUEST` error with the code of `LAST_UPDATED_DATETIME_OUT_OF_RANGE` will be returned with the most recent timestamp for the requested account contained in the response.

Format: `date-time`

The average historical balance for the entire report

Format: `double`

The average historical balance of each calendar month

Hide object

The start date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

The end date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

This contains an amount, denominated in the currency specified by either `iso_currency_code` or `unofficial_currency_code`

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

The average historical balance from the most recent 30 days

Format: `double`

The information about previously submitted valid dispute statements by the consumer

Hide object

(Deprecated) A unique identifier (UUID) of the consumer dispute that can be used for troubleshooting

Date of the disputed field (e.g. transaction date), in an ISO 8601 format (YYYY-MM-DD)

Format: `date`

Type of data being disputed by the consumer

Possible values: `TRANSACTION`, `BALANCE`, `IDENTITY`, `OTHER`

Text content of dispute

The last 2-4 alphanumeric characters of an account's official account number. Note that the mask may be non-unique between an Item's accounts, and it may also not match the mask that the bank displays to the user.

Metadata about the extracted account.

Hide object

The beginning of the range of the financial institution provided data for the account, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ("yyyy-mm-dd").

Format: `date`

The end of the range of the financial institution provided data for the account, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ("yyyy-mm-dd").

Format: `date`

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

The duration of transaction history available within this report for this Item, typically defined as the time since the date of the earliest transaction in that account.

Transaction history associated with the account. Transaction history returned by endpoints such as `/transactions/get` or `/investments/transactions/get` will be returned in the top-level `transactions` field instead. Some transactions may have their details masked in accordance to the FCRA. These will appear with a `credit_category` of `MASKED_TRANSACTION_CATEGORY`.

Hide object

The ID of the account in which this transaction occurred.

The settled value of the transaction, denominated in the transaction's currency, as stated in `iso_currency_code` or `unofficial_currency_code`. Positive values when money moves out of the account; negative values when money moves in. For example, debit card purchases are positive; credit card payments, direct deposits, and refunds are negative.

Format: `double`

The ISO-4217 currency code of the transaction. Always `null` if `unofficial_currency_code` is non-null.

The unofficial currency code associated with the transaction. Always `null` if `iso_currency_code` is non-`null`. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The string returned by the financial institution to describe the transaction.

Information describing the intent of the transaction. Most relevant for credit use cases, but not limited to such use cases.

See the [`taxonomy csv file`](https://plaid.com/documents/credit-category-taxonomy.csv) for a full list of credit categories.

Hide object

A high level category that communicates the broad category of the transaction.

A granular category conveying the transaction's intent. This field can also be used as a unique identifier for the category.

The check number of the transaction. This field is only populated for check transactions.

For pending transactions, the date that the transaction occurred; for posted transactions, the date that the transaction posted. Both dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ( `YYYY-MM-DD` ).

Format: `date`

The date on which the transaction took place, in IS0 8601 format.

A representation of where a transaction took place. Location data is provided only for transactions at physical locations, not for online transactions. Location data availability depends primarily on the merchant and is most likely to be populated for transactions at large retail chains; small, local businesses are less likely to have location data available.

Hide object

The street address where the transaction occurred.

The city where the transaction occurred.

The region or state where the transaction occurred. In API versions 2018-05-22 and earlier, this field is called `state`.

The postal code where the transaction occurred. In API versions 2018-05-22 and earlier, this field is called `zip`.

The ISO 3166-1 alpha-2 country code where the transaction occurred.

The latitude where the transaction occurred.

Format: `double`

The longitude where the transaction occurred.

Format: `double`

The merchant defined store number where the transaction occurred.

The merchant name, as enriched by Plaid from the `name` field. This is typically a more human-readable version of the merchant counterparty in the transaction. For some bank transactions (such as checks or account transfers) where there is no meaningful merchant name, this value will be `null`.

When `true`, identifies the transaction as pending or unsettled. Pending transaction details (name, type, amount, category ID) may change before they are settled.

The name of the account owner. This field is not typically populated and only relevant when dealing with sub-accounts.

The unique ID of the transaction. Like all Plaid identifiers, the `transaction_id` is case sensitive.

Data returned by the financial institution about the account owner or owners. For business accounts, the name reported may be either the name of the individual or the name of the business, depending on the institution. Multiple owners on a single account will be represented in the same `owner` object, not in multiple owner objects within the array. This array can also be empty if no owners are found.

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

How an asset is owned.

`association`: Ownership by a corporation, partnership, or unincorporated association, including for-profit and not-for-profit organizations.
`individual`: Ownership by an individual.
`joint`: Joint ownership by multiple parties.
`trust`: Ownership by a revocable or irrevocable trust.

Possible values: `null`, `individual`, `joint`, `association`, `trust`

Calculated insights derived from transaction-level data. This field has been deprecated in favor of [Base Report attributes aggregated across accounts](https://plaid.com/docs/api/products/check/#cra-check_report-base_report-get-response-report-attributes) and will be removed in a future release.

Hide object

Date of the earliest transaction for the account.

Format: `date`

Date of the most recent transaction for the account.

Format: `date`

Number of days available for the account.

Average number of days between sequential transactions

Longest gap between sequential transactions in a time period. This array can include multiple time periods.

Hide object

The start date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The end date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

Largest number of days between sequential transactions for this time period.

The number of debits into the account. This array will be empty for non-depository accounts.

Hide object

The start date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The end date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The number of credits or debits out of the account for this time period.

Average amount of debit transactions into the account in a time period. This array will be empty for non-depository accounts. This field only takes into account USD transactions from the account.

Hide object

The start date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The end date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

This contains an amount, denominated in the currency specified by either `iso_currency_code` or `unofficial_currency_code`

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

The number of outflows from the account. This array will be empty for non-depository accounts.

Hide object

The start date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The end date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The number of credits or debits out of the account for this time period.

Average amount of transactions out of the account in a time period. This array will be empty for non-depository accounts. This field only takes into account USD transactions from the account.

Hide object

The start date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The end date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

This contains an amount, denominated in the currency specified by either `iso_currency_code` or `unofficial_currency_code`

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Number of days with no transactions

Calculated attributes derived from transaction-level data.

Hide object

Prediction indicator of whether the account is a primary account. Only one account per account type across the items connected will have a value of true.

Value ranging from 0-1. The higher the score, the more confident we are of the account being the primary account.

The number of net NSF fee transactions for a given account within the report time range (not counting any fees that were reversed within the time range).

The number of net NSF fee transactions within the last 30 days for a given account (not counting any fees that were reversed within the time range).

The number of net NSF fee transactions within the last 60 days for a given account (not counting any fees that were reversed within the time range).

The number of net NSF fee transactions within the last 90 days for a given account (not counting any fees that were reversed within the time range).

Total amount of debit transactions into the account in the time period of the report. This field will be empty for non-depository accounts. This field only takes into account USD transactions from the account.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Total amount of debit transactions into the account in the last 30 days. This field will be empty for non-depository accounts. This field only takes into account USD transactions from the account.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Total amount of debit transactions into the account in the last 60 days. This field will be empty for non-depository accounts. This field only takes into account USD transactions from the account.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Total amount of debit transactions into the account in the last 90 days. This field will be empty for non-depository accounts. This field only takes into account USD transactions from the account.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Total amount of credit transactions into the account in the time period of the report. This field will be empty for non-depository accounts. This field only takes into account USD transactions from the account.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Total amount of credit transactions into the account in the last 30 days. This field will be empty for non-depository accounts. This field only takes into account USD transactions from the account.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Total amount of credit transactions into the account in the last 60 days. This field will be empty for non-depository accounts. This field only takes into account USD transactions from the account.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Total amount of credit transactions into the account in the last 90 days. This field will be empty for non-depository accounts. This field only takes into account USD transactions from the account.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Calculated attributes derived from transaction-level data, aggregated across accounts.

Hide object

The number of net NSF fee transactions in the time range for the report (not counting any fees that were reversed within that time range).

The number of net NSF fee transactions in the last 30 days in the report (not counting any fees that were reversed within that time range).

The number of net NSF fee transactions in the last 60 days in the report (not counting any fees that were reversed within that time range).

The number of net NSF fee transactions in the last 90 days in the report (not counting any fees that were reversed within that time range).

Total amount of debit transactions into the report's accounts in the time period of the report. This field only takes into account USD transactions from the accounts.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Total amount of debit transactions into the report's accounts in the last 30 days. This field only takes into account USD transactions from the accounts.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Total amount of debit transactions into the report's accounts in the last 60 days. This field only takes into account USD transactions from the accounts.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Total amount of debit transactions into the report's accounts in the last 90 days. This field only takes into account USD transactions from the accounts.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Total amount of credit transactions into the report's accounts in the time period of the report. This field only takes into account USD transactions from the accounts.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Total amount of credit transactions into the report's accounts in the last 30 days. This field only takes into account USD transactions from the accounts.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Total amount of credit transactions into the report's accounts in the last 60 days. This field only takes into account USD transactions from the accounts.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Total amount of credit transactions into the report's accounts in the last 90 days. This field only takes into account USD transactions from the accounts.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

This array contains any information about errors or alerts related to the Base Report that did not block generation of the report.

Hide object

The warning type, which will always be `BASE_REPORT_WARNING`

The warning code identifies a specific kind of warning.
`IDENTITY_UNAVAILABLE`: Account-owner information is not available.
`TRANSACTIONS_UNAVAILABLE`: Transactions information associated with Credit and Depository accounts are unavailable.
`USER_FRAUD_ALERT`: The User has placed a fraud alert on their Plaid Check consumer report due to suspected fraud. Note: when a fraud alert is in place, the recipient of the consumer report has an obligation to verify the consumer's identity.

Possible values: `IDENTITY_UNAVAILABLE`, `TRANSACTIONS_UNAVAILABLE`, `USER_FRAUD_ALERT`

An error object and associated `item_id` used to identify a specific Item and error when a batch operation operating on multiple Items has encountered an error in one of the Items.

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

The `item_id` of the Item associated with this webhook, warning, or error

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "report": {
    "date_generated": "2024-07-16T01:52:42.912331716Z",
    "days_requested": 365,
    "attributes": {
      "total_inflow_amount": {
        "amount": -2500,
        "iso_currency_code": "USD",
        "unofficial_currency_code": null
      },
      "total_inflow_amount_30d": {
        "amount": -1000,
        "iso_currency_code": "USD",
        "unofficial_currency_code": null
      },
      "total_inflow_amount_60d": {
        "amount": -2500,
        "iso_currency_code": "USD",
        "unofficial_currency_code": null
      },
      "total_inflow_amount_90d": {
        "amount": -2500,
        "iso_currency_code": "USD",
        "unofficial_currency_code": null
      },
      "total_outflow_amount": {
        "amount": 2500,
        "iso_currency_code": "USD",
        "unofficial_currency_code": null
      },
      "total_outflow_amount_30d": {
        "amount": 1000,
        "iso_currency_code": "USD",
        "unofficial_currency_code": null
      },
      "total_outflow_amount_60d": {
        "amount": 2500,
        "iso_currency_code": "USD",
        "unofficial_currency_code": null
      },
      "total_outflow_amount_90d": {
        "amount": 2500,
        "iso_currency_code": "USD",
        "unofficial_currency_code": null
      }
    },
    "items": [
      {
        "accounts": [
          {
            "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
            "account_insights": {
              "average_days_between_transactions": 0.15,
              "average_inflow_amount": [
                {
                  "end_date": "2024-07-31",
                  "start_date": "2024-07-01",
                  "total_amount": {
                    "amount": 1077.93,
                    "iso_currency_code": "USD",
                    "unofficial_currency_code": null
                  }
                }
              ],
              "average_inflow_amounts": [
                {
                  "end_date": "2024-07-31",
                  "start_date": "2024-07-01",
                  "total_amount": {
                    "amount": 1077.93,
                    "iso_currency_code": "USD",
                    "unofficial_currency_code": null
                  }
                },
                {
                  "end_date": "2024-08-31",
                  "start_date": "2024-08-01",
                  "total_amount": {
                    "amount": 1076.93,
                    "iso_currency_code": "USD",
                    "unofficial_currency_code": null
                  }
                }
              ],
              "average_outflow_amount": [
                {
                  "end_date": "2024-07-31",
                  "start_date": "2024-07-01",
                  "total_amount": {
                    "amount": 34.95,
                    "iso_currency_code": "USD",
                    "unofficial_currency_code": null
                  }
                }
              ],
              "average_outflow_amounts": [
                {
                  "end_date": "2024-07-31",
                  "start_date": "2024-07-01",
                  "total_amount": {
                    "amount": 34.95,
                    "iso_currency_code": "USD",
                    "unofficial_currency_code": null
                  }
                },
                {
                  "end_date": "2024-08-31",
                  "start_date": "2024-08-01",
                  "total_amount": {
                    "amount": 0,
                    "iso_currency_code": "USD",
                    "unofficial_currency_code": null
                  }
                }
              ],
              "days_available": 365,
              "longest_gap_between_transactions": [
                {
                  "days": 1,
                  "end_date": "2024-07-31",
                  "start_date": "2024-07-01"
                }
              ],
              "longest_gaps_between_transactions": [
                {
                  "days": 1,
                  "end_date": "2024-07-31",
                  "start_date": "2024-07-01"
                },
                {
                  "days": 2,
                  "end_date": "2024-08-31",
                  "start_date": "2024-08-01"
                }
              ],
              "most_recent_transaction_date": "2024-07-16",
              "number_of_days_no_transactions": 0,
              "number_of_inflows": [
                {
                  "count": 1,
                  "end_date": "2024-07-31",
                  "start_date": "2024-07-01"
                }
              ],
              "number_of_outflows": [
                {
                  "count": 27,
                  "end_date": "2024-07-31",
                  "start_date": "2024-07-01"
                }
              ],
              "oldest_transaction_date": "2024-07-12"
            },
            "balances": {
              "available": 5000,
              "average_balance": 4956.12,
              "average_monthly_balances": [
                {
                  "average_balance": {
                    "amount": 4956.12,
                    "iso_currency_code": "USD",
                    "unofficial_currency_code": null
                  },
                  "end_date": "2024-07-31",
                  "start_date": "2024-07-01"
                }
              ],
              "current": 5000,
              "iso_currency_code": "USD",
              "limit": null,
              "most_recent_thirty_day_average_balance": 4956.125,
              "unofficial_currency_code": null
            },
            "consumer_disputes": [],
            "days_available": 365,
            "mask": "1208",
            "metadata": {
              "start_date": "2024-01-01",
              "end_date": "2024-07-16"
            },
            "name": "Checking",
            "official_name": "Plaid checking",
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
                    "data": "+1 111-555-3333",
                    "primary": false,
                    "type": "home"
                  },
                  {
                    "data": "+1 111-555-4444",
                    "primary": false,
                    "type": "work"
                  },
                  {
                    "data": "+1 111-555-5555",
                    "primary": false,
                    "type": "mobile"
                  }
                ]
              }
            ],
            "ownership_type": null,
            "subtype": "checking",
            "transactions": [
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 37.07,
                "check_number": null,
                "credit_category": {
                  "detailed": "GENERAL_MERCHANDISE_ONLINE_MARKETPLACES",
                  "primary": "GENERAL_MERCHANDISE"
                },
                "date": "2024-07-12",
                "date_posted": "2024-07-12T00:00:00Z",
                "date_transacted": "2024-07-12",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": null,
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": null,
                  "state": null,
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": "Amazon",
                "original_description": "AMZN Mktp US*11111111 Amzn.com/bill WA AM",
                "pending": false,
                "transaction_id": "XA7ZLy8rXzt7D3j9B6LMIgv5VxyQkAhbKjzmp",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 51.61,
                "check_number": null,
                "credit_category": {
                  "detailed": "DINING_DINING",
                  "primary": "DINING"
                },
                "date": "2024-07-12",
                "date_posted": "2024-07-12T00:00:00Z",
                "date_transacted": "2024-07-12",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": null,
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": null,
                  "state": null,
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": "Domino's",
                "original_description": "DOMINO's XXXX 111-222-3333",
                "pending": false,
                "transaction_id": "VEPeMbWqRluPVZLQX4MDUkKRw41Ljzf9gyLBW",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 7.55,
                "check_number": null,
                "credit_category": {
                  "detailed": "GENERAL_MERCHANDISE_FURNITURE_AND_HARDWARE",
                  "primary": "GENERAL_MERCHANDISE"
                },
                "date": "2024-07-12",
                "date_posted": "2024-07-12T00:00:00Z",
                "date_transacted": "2024-07-12",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": "Chicago",
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": null,
                  "state": null,
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": "IKEA",
                "original_description": "IKEA CHICAGO",
                "pending": false,
                "transaction_id": "6GQZARgvroCAE1eW5wpQT7w3oB6nvzi8DKMBa",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 12.87,
                "check_number": null,
                "credit_category": {
                  "detailed": "GENERAL_MERCHANDISE_SPORTING_GOODS",
                  "primary": "GENERAL_MERCHANDISE"
                },
                "date": "2024-07-12",
                "date_posted": "2024-07-12T00:00:00Z",
                "date_transacted": "2024-07-12",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": "Redlands",
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": "CA",
                  "state": "CA",
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": "Nike",
                "original_description": "NIKE REDLANDS CA",
                "pending": false,
                "transaction_id": "DkbmlP8BZxibzADqNplKTeL8aZJVQ1c3WR95z",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 44.21,
                "check_number": null,
                "credit_category": {
                  "detailed": "DINING_DINING",
                  "primary": "DINING"
                },
                "date": "2024-07-12",
                "date_posted": "2024-07-12T00:00:00Z",
                "date_transacted": "2024-07-12",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": null,
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": null,
                  "state": null,
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": null,
                "original_description": "POKE BROS * POKE BRO IL",
                "pending": false,
                "transaction_id": "RpdN7W8GmRSdjZB9Jm7ATj4M86vdnktapkrgL",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 36.82,
                "check_number": null,
                "credit_category": {
                  "detailed": "GENERAL_MERCHANDISE_DISCOUNT_STORES",
                  "primary": "GENERAL_MERCHANDISE"
                },
                "date": "2024-07-13",
                "date_posted": "2024-07-13T00:00:00Z",
                "date_transacted": "2024-07-13",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": null,
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": null,
                  "state": null,
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": "Family Dollar",
                "original_description": "FAMILY DOLLAR",
                "pending": false,
                "transaction_id": "5AeQWvo5KLtAD9wNL68PTdAgPE7VNWf5Kye1G",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 13.27,
                "check_number": null,
                "credit_category": {
                  "detailed": "FOOD_RETAIL_GROCERIES",
                  "primary": "FOOD_RETAIL"
                },
                "date": "2024-07-13",
                "date_posted": "2024-07-13T00:00:00Z",
                "date_transacted": "2024-07-13",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": null,
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": null,
                  "state": null,
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": "Instacart",
                "original_description": "INSTACART HTTPSINSTACAR CA",
                "pending": false,
                "transaction_id": "Jjlr3MEVg1HlKbdkZj39ij5a7eg9MqtB6MWDo",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 36.03,
                "check_number": null,
                "credit_category": {
                  "detailed": "DINING_DINING",
                  "primary": "DINING"
                },
                "date": "2024-07-13",
                "date_posted": "2024-07-13T00:00:00Z",
                "date_transacted": "2024-07-13",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": null,
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": null,
                  "state": null,
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": null,
                "original_description": "POKE BROS * POKE BRO IL",
                "pending": false,
                "transaction_id": "kN9KV7yAZJUMPn93KDXqsG9MrpjlyLUL6Dgl8",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 54.74,
                "check_number": null,
                "credit_category": {
                  "detailed": "FOOD_RETAIL_GROCERIES",
                  "primary": "FOOD_RETAIL"
                },
                "date": "2024-07-13",
                "date_posted": "2024-07-13T00:00:00Z",
                "date_transacted": "2024-07-13",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": "Whittier",
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": "CA",
                  "state": "CA",
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": "Smart & Final",
                "original_description": "POS SMART AND FINAL 111 WHITTIER CA",
                "pending": false,
                "transaction_id": "lPvrweZAMqHDar43vwWKs547kLZVEzfpogGVJ",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 37.5,
                "check_number": null,
                "credit_category": {
                  "detailed": "DINING_DINING",
                  "primary": "DINING"
                },
                "date": "2024-07-13",
                "date_posted": "2024-07-13T00:00:00Z",
                "date_transacted": "2024-07-13",
                "iso_currency_code": "USD",
                "location": {
                  "address": "1627 N 24th St",
                  "city": "Phoenix",
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": "85008",
                  "region": "AZ",
                  "state": "AZ",
                  "store_number": null,
                  "zip": "85008"
                },
                "merchant_name": "Taqueria El Guerrerense",
                "original_description": "TAQUERIA EL GUERRERO PHOENIX AZ",
                "pending": false,
                "transaction_id": "wka74WKqngiyJ3pj7dl5SbpLGQBZqyCPZRDbP",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 41.42,
                "check_number": null,
                "credit_category": {
                  "detailed": "GENERAL_MERCHANDISE_ONLINE_MARKETPLACES",
                  "primary": "GENERAL_MERCHANDISE"
                },
                "date": "2024-07-14",
                "date_posted": "2024-07-14T00:00:00Z",
                "date_transacted": "2024-07-14",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": null,
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": null,
                  "state": null,
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": "Amazon",
                "original_description": "AMZN Mktp US*11111111 Amzn.com/bill WA AM",
                "pending": false,
                "transaction_id": "BBGnV4RkerHjn8WVavGyiJbQ95VNDaC4M56bJ",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": -1077.93,
                "check_number": null,
                "credit_category": {
                  "detailed": "INCOME_OTHER",
                  "primary": "INCOME"
                },
                "date": "2024-07-14",
                "date_posted": "2024-07-14T00:00:00Z",
                "date_transacted": "2024-07-14",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": null,
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": null,
                  "state": null,
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": "Lyft",
                "original_description": "LYFT TRANSFER",
                "pending": false,
                "transaction_id": "3Ej78yKJlQu1Abw7xzo4U4JR6pmwzntZlbKDK",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 47.17,
                "check_number": null,
                "credit_category": {
                  "detailed": "FOOD_RETAIL_GROCERIES",
                  "primary": "FOOD_RETAIL"
                },
                "date": "2024-07-14",
                "date_posted": "2024-07-14T00:00:00Z",
                "date_transacted": "2024-07-14",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": "Whittier",
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": "CA",
                  "state": "CA",
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": "Smart & Final",
                "original_description": "POS SMART AND FINAL 111 WHITTIER CA",
                "pending": false,
                "transaction_id": "rMzaBpJw8jSZRJQBabKdteQBwd5EaWc7J9qem",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 12.37,
                "check_number": null,
                "credit_category": {
                  "detailed": "FOOD_RETAIL_GROCERIES",
                  "primary": "FOOD_RETAIL"
                },
                "date": "2024-07-14",
                "date_posted": "2024-07-14T00:00:00Z",
                "date_transacted": "2024-07-14",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": "Whittier",
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": "CA",
                  "state": "CA",
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": "Smart & Final",
                "original_description": "POS SMART AND FINAL 111 WHITTIER CA",
                "pending": false,
                "transaction_id": "zWPZjkmzynTyel89ZjExS59DV6WAaZflNBJ56",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 44.18,
                "check_number": null,
                "credit_category": {
                  "detailed": "FOOD_RETAIL_GROCERIES",
                  "primary": "FOOD_RETAIL"
                },
                "date": "2024-07-14",
                "date_posted": "2024-07-14T00:00:00Z",
                "date_transacted": "2024-07-14",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": "Portland",
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": "OR",
                  "state": "OR",
                  "store_number": "1111",
                  "zip": null
                },
                "merchant_name": "Safeway",
                "original_description": "SAFEWAY #1111 PORTLAND OR            111111",
                "pending": false,
                "transaction_id": "K7qzx1nP8ptqgwaRMbxyI86XrqADMluRpkWx5",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 45.37,
                "check_number": null,
                "credit_category": {
                  "detailed": "DINING_DINING",
                  "primary": "DINING"
                },
                "date": "2024-07-14",
                "date_posted": "2024-07-14T00:00:00Z",
                "date_transacted": "2024-07-14",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": null,
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": null,
                  "state": null,
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": "Uber Eats",
                "original_description": "UBER EATS",
                "pending": false,
                "transaction_id": "qZrdzLRAgNHo5peMdD9xIzELl3a1NvcgrPAzL",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 15.22,
                "check_number": null,
                "credit_category": {
                  "detailed": "GENERAL_MERCHANDISE_ONLINE_MARKETPLACES",
                  "primary": "GENERAL_MERCHANDISE"
                },
                "date": "2024-07-15",
                "date_posted": "2024-07-15T00:00:00Z",
                "date_transacted": "2024-07-15",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": null,
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": null,
                  "state": null,
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": "Amazon",
                "original_description": "AMZN Mktp US*11111111 Amzn.com/bill WA AM",
                "pending": false,
                "transaction_id": "NZzx4oRPkAHzyRekpG4PTZkWnBPqEyiy6pB1M",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 26.33,
                "check_number": null,
                "credit_category": {
                  "detailed": "DINING_DINING",
                  "primary": "DINING"
                },
                "date": "2024-07-15",
                "date_posted": "2024-07-15T00:00:00Z",
                "date_transacted": "2024-07-15",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": null,
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": null,
                  "state": null,
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": "Domino's",
                "original_description": "DOMINO's XXXX 111-222-3333",
                "pending": false,
                "transaction_id": "x84eNArKbESz8Woden6LT3nvyogeJXc64Pp35",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 39.8,
                "check_number": null,
                "credit_category": {
                  "detailed": "GENERAL_MERCHANDISE_DISCOUNT_STORES",
                  "primary": "GENERAL_MERCHANDISE"
                },
                "date": "2024-07-15",
                "date_posted": "2024-07-15T00:00:00Z",
                "date_transacted": "2024-07-15",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": null,
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": null,
                  "state": null,
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": "Family Dollar",
                "original_description": "FAMILY DOLLAR",
                "pending": false,
                "transaction_id": "dzWnyxwZ4GHlZPGgrNyxiMG7qd5jDgCJEz5jL",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 45.06,
                "check_number": null,
                "credit_category": {
                  "detailed": "FOOD_RETAIL_GROCERIES",
                  "primary": "FOOD_RETAIL"
                },
                "date": "2024-07-15",
                "date_posted": "2024-07-15T00:00:00Z",
                "date_transacted": "2024-07-15",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": null,
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": null,
                  "state": null,
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": "Instacart",
                "original_description": "INSTACART HTTPSINSTACAR CA",
                "pending": false,
                "transaction_id": "4W7eE9rZqMToDArbPeLNIREoKpdgBMcJbVNQD",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 34.91,
                "check_number": null,
                "credit_category": {
                  "detailed": "FOOD_RETAIL_GROCERIES",
                  "primary": "FOOD_RETAIL"
                },
                "date": "2024-07-15",
                "date_posted": "2024-07-15T00:00:00Z",
                "date_transacted": "2024-07-15",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": "Whittier",
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": "CA",
                  "state": "CA",
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": "Smart & Final",
                "original_description": "POS SMART AND FINAL 111 WHITTIER CA",
                "pending": false,
                "transaction_id": "j4yqDjb7QwS7woGzqrgDIEG1NaQVZwf6Wmz3D",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 49.78,
                "check_number": null,
                "credit_category": {
                  "detailed": "FOOD_RETAIL_GROCERIES",
                  "primary": "FOOD_RETAIL"
                },
                "date": "2024-07-15",
                "date_posted": "2024-07-15T00:00:00Z",
                "date_transacted": "2024-07-15",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": "Portland",
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": "OR",
                  "state": "OR",
                  "store_number": "1111",
                  "zip": null
                },
                "merchant_name": "Safeway",
                "original_description": "SAFEWAY #1111 PORTLAND OR            111111",
                "pending": false,
                "transaction_id": "aqgWnze7xoHd6DQwLPnzT5dgPKjB1NfZ5JlBy",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 54.24,
                "check_number": null,
                "credit_category": {
                  "detailed": "FOOD_RETAIL_GROCERIES",
                  "primary": "FOOD_RETAIL"
                },
                "date": "2024-07-15",
                "date_posted": "2024-07-15T00:00:00Z",
                "date_transacted": "2024-07-15",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": "Portland",
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": "OR",
                  "state": "OR",
                  "store_number": "1111",
                  "zip": null
                },
                "merchant_name": "Safeway",
                "original_description": "SAFEWAY #1111 PORTLAND OR            111111",
                "pending": false,
                "transaction_id": "P13aP8b7nmS3WQoxg1PMsdvMK679RNfo65B4G",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 41.79,
                "check_number": null,
                "credit_category": {
                  "detailed": "GENERAL_MERCHANDISE_ONLINE_MARKETPLACES",
                  "primary": "GENERAL_MERCHANDISE"
                },
                "date": "2024-07-16",
                "date_posted": "2024-07-16T00:00:00Z",
                "date_transacted": "2024-07-16",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": null,
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": null,
                  "state": null,
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": "Amazon",
                "original_description": "AMZN Mktp US*11111111 Amzn.com/bill WA AM",
                "pending": false,
                "transaction_id": "7nZMG6pXz8SADylMqzx7TraE4qjJm7udJyAGm",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 33.86,
                "check_number": null,
                "credit_category": {
                  "detailed": "FOOD_RETAIL_GROCERIES",
                  "primary": "FOOD_RETAIL"
                },
                "date": "2024-07-16",
                "date_posted": "2024-07-16T00:00:00Z",
                "date_transacted": "2024-07-16",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": null,
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": null,
                  "state": null,
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": "Instacart",
                "original_description": "INSTACART HTTPSINSTACAR CA",
                "pending": false,
                "transaction_id": "MQr3ap7PWEIrQG7bLdaNsxyBV7g1KqCL6pwoy",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 27.08,
                "check_number": null,
                "credit_category": {
                  "detailed": "DINING_DINING",
                  "primary": "DINING"
                },
                "date": "2024-07-16",
                "date_posted": "2024-07-16T00:00:00Z",
                "date_transacted": "2024-07-16",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": null,
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": null,
                  "state": null,
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": null,
                "original_description": "POKE BROS * POKE BRO IL",
                "pending": false,
                "transaction_id": "eBAk9dvwNbHPZpr8W69dU3rekJz47Kcr9BRwl",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 25.94,
                "check_number": null,
                "credit_category": {
                  "detailed": "GENERAL_MERCHANDISE_FURNITURE_AND_HARDWARE",
                  "primary": "GENERAL_MERCHANDISE"
                },
                "date": "2024-07-16",
                "date_posted": "2024-07-16T00:00:00Z",
                "date_transacted": "2024-07-16",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": null,
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": null,
                  "state": null,
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": "The Home Depot",
                "original_description": "THE HOME DEPOT",
                "pending": false,
                "transaction_id": "QLx4jEJZb9SxRm7aWbjAio3LrgZ5vPswm64dE",
                "unofficial_currency_code": null
              },
              {
                "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
                "account_owner": null,
                "amount": 27.57,
                "check_number": null,
                "credit_category": {
                  "detailed": "GENERAL_MERCHANDISE_OTHER_GENERAL_MERCHANDISE",
                  "primary": "GENERAL_MERCHANDISE"
                },
                "date": "2024-07-16",
                "date_posted": "2024-07-16T00:00:00Z",
                "date_transacted": "2024-07-16",
                "iso_currency_code": "USD",
                "location": {
                  "address": null,
                  "city": null,
                  "country": null,
                  "lat": null,
                  "lon": null,
                  "postal_code": null,
                  "region": null,
                  "state": null,
                  "store_number": null,
                  "zip": null
                },
                "merchant_name": null,
                "original_description": "The Press Club",
                "pending": false,
                "transaction_id": "ZnQ1ovqBldSQ6GzRbroAHLdQP68BrKceqmAjX",
                "unofficial_currency_code": null
              }
            ],
            "type": "depository"
          }
        ],
        "date_last_updated": "2024-07-16T01:52:42.912331716Z",
        "institution_id": "ins_109512",
        "institution_name": "Houndstooth Bank",
        "item_id": "NZzx4oRPkAHzyRekpG4PTZkDNkQW93tWnyGeA"
      }
    ],
    "report_id": "f3bb434f-1c9b-4ef2-b76c-3d1fd08156ec"
  },
  "warnings": [],
  "request_id": "FibfL8t3s71KJnj"
}
```

=\*=\*=\*=[#### `/cra/check_report/income_insights/get`](/docs/api/products/check/#cracheck_reportincome_insightsget)

[#### Retrieve cash flow information from your user's banks](/docs/api/products/check/#retrieve-cash-flow-information-from-your-user's-banks)

This endpoint allows you to retrieve the Income Insights report for your user. You should call this endpoint after you've received a `CHECK_REPORT_READY` or a `USER_CHECK_REPORT_READY` webhook, either after the Link session for the user or after calling [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate). If the most recent consumer report for the user doesn't have sufficient data to generate the base report, or the consumer report has expired, you will receive an error indicating that you should create a new consumer report by calling [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate).

NOTE: The following schema was updated in April 2026 to reflect the response when the provided version is "II2". Please see [this document](https://docs.google.com/document/d/1kQkQ7FOgFaC4n-sUGUk74hoXZNY_L_nJeCuMe7Keip4/edit?tab=t.0#heading=h.rudamzinus2i) for guidance on migrating to II2 if you are currently using the II1 version, and [this section](https://docs.google.com/document/d/1kQkQ7FOgFaC4n-sUGUk74hoXZNY_L_nJeCuMe7Keip4/edit?tab=t.0#bookmark=id.tdcc2wpk0h60) for an example II1 response along with its [documentation](https://docs.google.com/document/d/1kQkQ7FOgFaC4n-sUGUk74hoXZNY_L_nJeCuMe7Keip4/edit?tab=t.36c85n2ircqk#heading=h.79dwr5c1iszl).

/cra/check\_report/income\_insights/get

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The user token associated with the user for which data is being requested. This field is used only by customers with pre-existing integrations that already use the `user_token` field. All other customers should use the `user_id` instead. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

A unique user identifier, created by `/user/create`. Integrations that began using `/user/create` after December 10, 2025 use this field to identify a user instead of the `user_token`. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

Deprecated. This field is no longer accepted for new clients (created on or after 2026-07-01). New clients should specify required products when creating the Consumer Report. Existing integrations may continue to pass `options`.

Hide object

Filters the returned income streams based on the specified income categories. If no filters are requested, streams from the following default set of categories are returned:

- `EARNED_INCOME.*` (`EARNED_INCOME.SALARY`, `EARNED_INCOME.GIG_ECONOMY`, `EARNED_INCOME.SELF_EMPLOYED`)
- `BENEFITS.DISABILITY`
- `RETIREMENT.*` (`RETIREMENT.GOVERNMENT_DERIVED`, `RETIREMENT.PRIVATE_RETIREMENT`, `RETIREMENT.PLAN_DISTRIBUTION`)

The final list of income categories is generated by adding the `included_categories`, then removing the `excluded_categories`. Priority is given to `excluded_categories` in the case of collisions.

Filter patterns supported:

- `*`: All categories
- `PRIMARY.*`: All categories within the specified primary category
- `PRIMARY.SECONDARY`: A specific income category

For a list of income categories, see the [Income V2 Category Taxonomy](https://plaid.com/documents/income-v2-category-taxonomy.csv).

Hide object

Includes income streams matching the specified categories.

Excludes income streams matching the specified categories.

The version of Income Insights to use.

Possible values: `II2`

/cra/check\_report/income\_insights/get

Nodeâ¼

```
try {
  const response = await client.craCheckReportIncomeInsightsGet({
    user_id: 'usr_9nSp2KuZ2x4JDw',
  });
} catch (error) {
  // handle error
}
```

/cra/check\_report/income\_insights/get

**Response fields**

Collapse all

The Check Income Insights Report for an end user.

Hide object

The unique identifier associated with the Check Income Insights Report.

The time when the Check Income Insights Report was generated.

Format: `date-time`

The number of days requested by the customer for the Check Income Insights Report.

Client-generated identifier, which can be used by lenders to track loan applications.

The list of Items in the report along with the associated metadata about the Item.

Hide object

The `item_id` of the Item associated with this webhook, warning, or error

The Item's accounts that have bank income data.

Hide object

Plaid's unique identifier for the account. This value will not change unless Plaid can't reconcile the account with the data returned by the financial institution. This may occur, for example, when the name of the account changes. If this happens a new `account_id` will be assigned to the account.

If an account with a specific `account_id` disappears instead of changing, the account is likely closed. Closed accounts are not returned by the Plaid API.

Like all Plaid identifiers, the `account_id` is case sensitive.

The last 2-4 alphanumeric characters of an account's official account number.
Note that the mask may be non-unique between an Item's accounts, and it may also not match the mask that the bank displays to the user.

An object containing metadata about the extracted account.

Hide object

The date of the earliest extracted transaction, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ("yyyy-mm-dd").

Format: `date`

The date of the most recent extracted transaction, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ("yyyy-mm-dd").

Format: `date`

The name of the bank account.

The official name of the bank account.

Valid account subtypes for depository accounts. For a list containing descriptions of each subtype, see [Account schemas](https://plaid.com/docs/api/accounts/#StandaloneAccountType-depository).

Possible values: `checking`, `savings`, `hsa`, `cd`, `money market`, `paypal`, `prepaid`, `cash management`, `ebt`, `limited purpose checking`, `all`

The account type. This will always be `depository`.

Possible values: `depository`

The time when this Item's data was last retrieved from the financial institution.

Format: `date-time`

The unique identifier of the institution associated with the Item.

The name of the institution associated with the Item.

Aggregated summary of all income streams for this user.

Hide object

List of a user's aggregated income metrics for each currency.

Hide object

Modeled estimate of current income based on recently observed income transactions.

Hide object

Modeled estimate of the monthly income.

Hide object

Gross Income modeled from trends of observed transactions.

Net Income estimated from observed transactions.

Modeled estimate of the annual income.

Hide object

Gross Income modeled from trends of observed transactions.

Net Income estimated from observed transactions.

Forward-looking modeled estimate of income based on recent income transactions and trends in active streams.

Hide object

Modeled estimate of the monthly income.

Hide object

Gross Income modeled from trends of observed transactions.

Net Income estimated from observed transactions.

Modeled estimate of the annual income.

Hide object

Gross Income modeled from trends of observed transactions.

Net Income estimated from observed transactions.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

The list of income streams for this user.

Hide object

A unique identifier for an income stream. If the report is regenerated and a new `report_id` is created, the new report will have a new set of `income_stream_id`s.

Minimum of all dates within the specific income stream for days requested by the client. The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

Maximum of all dates within the specific income stream for days requested by the client. The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The most common name or original description for the underlying income transactions.

Modeled insights for a given income stream.

Hide object

The income category for a given stream. The streams returned in the response will be filtered based on these primary and secondary income categories.

See the [Income V2 Category Taxonomy](https://plaid.com/documents/income-v2-category-taxonomy.csv) for a full list of income categories.

Hide object

A high level category that communicates the broad category of the stream.

A granular category conveying the stream's intent.

The income pay frequency.

Possible values: `WEEKLY`, `BIWEEKLY`, `SEMI_MONTHLY`, `MONTHLY`, `DAILY`, `UNKNOWN`

The object containing data about the income provider.

Hide object

The name of the income provider.

Indicates whether the income provider name is normalized by comparing it against a canonical set of known providers.

The status of the income sources.
`ACTIVE`: The income source is active.
`INACTIVE`: The income source is inactive.
`UNKNOWN`: The income source status is unknown.

Possible values: `ACTIVE`, `INACTIVE`, `UNKNOWN`

Metadata of the income stream's next payment.

Hide object

The expected date of the income stream's next payment. The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

Modeled income metrics for a given income stream or user summary.

Hide object

Modeled estimate of current income based on recently observed income transactions.

Hide object

Modeled estimate of the monthly income.

Hide object

Gross Income modeled from trends of observed transactions.

Net Income estimated from observed transactions.

Modeled estimate of the annual income.

Hide object

Gross Income modeled from trends of observed transactions.

Net Income estimated from observed transactions.

Forward-looking modeled estimate of income based on recent income transactions and trends in active streams.

Hide object

Modeled estimate of the monthly income.

Hide object

Gross Income modeled from trends of observed transactions.

Net Income estimated from observed transactions.

Modeled estimate of the annual income.

Hide object

Gross Income modeled from trends of observed transactions.

Net Income estimated from observed transactions.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

The transactions data for the income stream ordered by ascending date.

Hide object

The unique ID of the transaction. Like all Plaid identifiers, the `transaction_id` is case sensitive.

The `item_id` of the Item associated with this webhook, warning, or error

Plaid's unique identifier for the account. This value will not change unless Plaid can't reconcile the account with the data returned by the financial institution. This may occur, for example, when the name of the account changes. If this happens a new `account_id` will be assigned to the account.

If an account with a specific `account_id` disappears instead of changing, the account is likely closed. Closed accounts are not returned by the Plaid API.

Like all Plaid identifiers, the `account_id` is case sensitive.

The settled value of the transaction, denominated in the transaction's currency as stated in `iso_currency_code` or `unofficial_currency_code`.
Positive values when money moves out of the account; negative values when money moves in.
For example, credit card purchases are positive; credit card payment, direct deposits, and refunds are negative.

For pending transactions, the date that the transaction occurred; for posted transactions, the date that the transaction posted.
Both dates are returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The string returned by the financial institution to describe the transaction.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Metadata on whether this income transaction is an outlier.

Hide object

Indicates whether an income transaction amount is unusually high compared to the amounts for that stream.

The amount that the transaction differs from the stream average transaction amount.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

If the Income Insights generation was successful but a subset of data could not be retrieved, this array will contain information about the errors causing information to be missing

Hide object

The warning type, which will always be `CHECK_REPORT_WARNING`

The warning code identifies a specific kind of warning.
`IDENTITY_UNAVAILABLE`: Account-owner information is not available.
`TRANSACTIONS_UNAVAILABLE`: Transactions information associated with Credit and Depository accounts are unavailable.
`USER_FRAUD_ALERT`: The user has placed a fraud alert on their Plaid Check consumer report due to suspected fraud. Please note that when a fraud alert is in place, the recipient of the consumer report has an obligation to verify the consumer's identity.

Possible values: `IDENTITY_UNAVAILABLE`, `TRANSACTIONS_UNAVAILABLE`, `USER_FRAUD_ALERT`

An error object and associated `item_id` used to identify a specific Item and error when a batch operation operating on multiple Items has encountered an error in one of the Items.

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

The `item_id` of the Item associated with this webhook, warning, or error

Response Object

```
{
  "request_id": "LhQf0THi8SH1yJm",
  "report": {
    "report_id": "bbfc5174-5433-4648-8d93-9fec6a0c0966",
    "generated_time": "2022-01-31T22:47:53Z",
    "days_requested": 365,
    "user_summary": {
      "income_metrics": [
        {
          "current": {
            "monthly": {
              "gross_income": 390,
              "net_income": 300
            },
            "annual": {
              "gross_income": 4680,
              "net_income": 3600
            }
          },
          "projected": {
            "monthly": {
              "gross_income": 300,
              "net_income": 300
            },
            "annual": {
              "gross_income": 3600,
              "net_income": 3600
            }
          },
          "iso_currency_code": "USD",
          "unofficial_currency_code": null
        }
      ]
    },
    "income_streams": [
      {
        "income_stream_id": "f17efbdd-caab-4278-8ece-963511cd3d51",
        "start_date": "2021-11-15",
        "end_date": "2022-01-15",
        "description": "PLAID INC DIRECT DEP PPD",
        "insights": {
          "income_category": {
            "primary": "EARNED_INCOME",
            "secondary": "SALARY"
          },
          "pay_frequency": "MONTHLY",
          "income_provider": {
            "name": "Plaid Inc",
            "is_normalized": true
          },
          "next_payment": {
            "date": "2022-12-15"
          },
          "status": "ACTIVE"
        },
        "income_metrics": {
          "current": {
            "monthly": {
              "gross_income": 390,
              "net_income": 300
            },
            "annual": {
              "gross_income": 4680,
              "net_income": 3600
            }
          },
          "projected": {
            "monthly": {
              "gross_income": 300,
              "net_income": 300
            },
            "annual": {
              "gross_income": 3600,
              "net_income": 3600
            }
          },
          "iso_currency_code": "USD",
          "unofficial_currency_code": null
        },
        "transactions": [
          {
            "transaction_id": "aH5klwqG3B19OMT7D6F24Syv8pdnJXmtZoKQ5",
            "item_id": "AZMP7JrGXgtPd3AQMeg7hwMKgk5E8qU1V5ME7",
            "account_id": "1qKRXQjk8xUWDJojNwPXTj8gEmR48piqRNye8",
            "amount": 100,
            "date": "2021-11-15",
            "original_description": "PLAID_INC_DIRECT_DEP_PPD 123A",
            "outlier": {
              "is_outlier": false
            },
            "iso_currency_code": "USD",
            "unofficial_currency_code": null
          },
          {
            "transaction_id": "mN3rQ5iH8BC41T6UjKL9oD2vWJpZqXFomGwY1",
            "item_id": "AZMP7JrGXgtPd3AQMeg7hwMKgk5E8qU1V5ME7",
            "account_id": "1qKRXQjk8xUWDJojNwPXTj8gEmR48piqRNye8",
            "amount": 100,
            "date": "2021-12-15",
            "original_description": "PLAID_INC_DIRECT_DEP_PPD 123B",
            "outlier": {
              "is_outlier": false
            },
            "iso_currency_code": "USD",
            "unofficial_currency_code": null
          },
          {
            "transaction_id": "zK9lDoR8uBH51PNQ3W4T6Mjy2VFXpGtJwsL4",
            "item_id": "AZMP7JrGXgtPd3AQMeg7hwMKgk5E8qU1V5ME7",
            "account_id": "1qKRXQjk8xUWDJojNwPXTj8gEmR48piqRNye8",
            "amount": 100,
            "date": "2022-01-31",
            "original_description": "PLAID_INC_DIRECT_DEP_PPD 123C",
            "outlier": {
              "is_outlier": false
            },
            "iso_currency_code": "USD",
            "unofficial_currency_code": null
          }
        ]
      }
    ],
    "items": [
      {
        "item_id": "AZMP7JrGXgtPd3AQMeg7hwMKgk5E8qU1V5ME7",
        "institution_name": "Plaid Bank",
        "institution_id": "ins_0",
        "last_updated_time": "2022-01-31T22:47:53Z",
        "bank_income_accounts": [],
        "bank_income_sources": [],
        "accounts": [
          {
            "account_id": "1qKRXQjk8xUWDJojNwPXTj8gEmR48piqRNye8",
            "mask": "8888",
            "metadata": {
              "start_date": "2024-01-01",
              "end_date": "2024-07-16"
            },
            "name": "Plaid Checking Account",
            "official_name": "Plaid Checking Account",
            "subtype": "checking",
            "type": "depository",
            "owners": []
          }
        ]
      }
    ]
  },
  "warnings": []
}
```

=\*=\*=\*=[#### `/cra/check_report/network_insights/get`](/docs/api/products/check/#cracheck_reportnetwork_insightsget)

[#### Retrieve network attributes for the user](/docs/api/products/check/#retrieve-network-attributes-for-the-user)

This endpoint allows you to retrieve the Network Insights product for your user. You should call this endpoint after you've received a `CHECK_REPORT_READY` or a `USER_CHECK_REPORT_READY` webhook, either after the Link session for the user or after calling [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate). If the most recent consumer report for the user doesn't have sufficient data to generate the report, or the consumer report has expired, you will receive an error indicating that you should create a new consumer report by calling [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate).

If you did not initialize Link with the `cra_network_insights` product or have generated a report using [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate), Plaid will generate the attributes when you call this endpoint.

/cra/check\_report/network\_insights/get

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

A unique user identifier, created by `/user/create`. Integrations that began using `/user/create` after December 10, 2025 use this field to identify a user instead of the `user_token`. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

Deprecated. This field is no longer accepted for new clients (created on or after 2026-07-01). New clients should specify required products when creating the Consumer Report. Existing integrations may continue to pass `options`.

Hide object

The version of Network Insights. Required if using Network Insights.

Possible values: `NI1`

The user token associated with the user for which data is being requested. This field is used only by customers with pre-existing integrations that already use the `user_token` field. All other customers should use the `user_id` instead. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

/cra/check\_report/network\_insights/get

Nodeâ¼

```
try {
  const response = await client.craCheckReportNetworkInsightsGet({
    user_id: 'usr_9nSp2KuZ2x4JDw',
  });
} catch (error) {
  // handle error
}
```

/cra/check\_report/network\_insights/get

**Response fields**

Collapse all

Contains data for the CRA Network Attributes Report.

Hide object

The unique identifier associated with the report object.

The time when the report was generated.

Format: `date-time`

A map of network attributes, where the key is a string, and the value is a float, int, or boolean. For a full list of attributes, contact your account manager.

The Items the end user connected in Link.

Hide object

The ID for the institution the user linked.

The name of the institution the user linked.

The identifier for the Item.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

If the Network Insights generation was successful but a subset of data could not be retrieved, this array will contain information about the errors causing information to be missing

Hide object

The warning type, which will always be `CHECK_REPORT_WARNING`

The warning code identifies a specific kind of warning.
`IDENTITY_UNAVAILABLE`: Account-owner information is not available.
`TRANSACTIONS_UNAVAILABLE`: Transactions information associated with Credit and Depository accounts are unavailable.
`USER_FRAUD_ALERT`: The user has placed a fraud alert on their Plaid Check consumer report due to suspected fraud. Please note that when a fraud alert is in place, the recipient of the consumer report has an obligation to verify the consumer's identity.

Possible values: `IDENTITY_UNAVAILABLE`, `TRANSACTIONS_UNAVAILABLE`, `USER_FRAUD_ALERT`

An error object and associated `item_id` used to identify a specific Item and error when a batch operation operating on multiple Items has encountered an error in one of the Items.

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

The `item_id` of the Item associated with this webhook, warning, or error

Response Object

```
{
  "request_id": "LhQf0THi8SH1yJm",
  "report": {
    "report_id": "ee093cb0-e3f2-42d1-9dbc-8d8408964194",
    "generated_time": "2022-01-31T22:47:53Z",
    "network_attributes": {
      "plaid_conn_user_lifetime_lending_count": 5,
      "plaid_conn_user_lifetime_personal_lending_flag": 1,
      "plaid_conn_user_lifetime_cash_advance_primary_count": 0
    },
    "items": [
      {
        "institution_id": "ins_0",
        "institution_name": "Plaid Bank",
        "item_id": "AZMP7JrGXgtPd3AQMeg7hwMKgk5E8qU1V5ME7"
      }
    ]
  }
}
```

=\*=\*=\*=[#### `/cra/check_report/partner_insights/get`](/docs/api/products/check/#cracheck_reportpartner_insightsget)

[#### Retrieve cash flow insights from partners](/docs/api/products/check/#retrieve-cash-flow-insights-from-partners)

This endpoint allows you to retrieve the Partner Insights report for your user. You should call this endpoint after you've received a `CHECK_REPORT_READY` or a `USER_CHECK_REPORT_READY` webhook, either after the Link session for the user or after calling [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate). If the most recent consumer report for the user doesn't have sufficient data to generate the base report, or the consumer report has expired, you will receive an error indicating that you should create a new consumer report by calling [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate).

If you did not initialize Link with the `cra_partner_insights` product or have generated a report using [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate), we will call our partners to generate the insights when you call this endpoint. In this case, you may optionally provide parameters under `options` to configure which insights you want to receive.

/cra/check\_report/partner\_insights/get

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

A unique user identifier, created by `/user/create`. Integrations that began using `/user/create` after December 10, 2025 use this field to identify a user instead of the `user_token`. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

The user token associated with the user for which data is being requested. This field is used only by customers with pre-existing integrations that already use the `user_token` field. All other customers should use the `user_id` instead. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

Deprecated. This field is no longer accepted for new clients (created on or after 2026-07-01). New clients should specify required products when creating the Consumer Report. Existing integrations may continue to pass `partner_insights`.

Hide object

The versions of Prism products to evaluate

Hide object

The version of Prism FirstDetect. If not specified, will default to v3.

Possible values: `3`, `null`

The version of Prism Detect

Possible values: `4.1`, `4`, `null`

The version of Prism CashScore. If not specified, will default to v3.

Possible values: `4.1`, `4`, `3`, `null`

The version of Prism Extend

Possible values: `4.1`, `4`, `null`

The version of Prism Insights. If not specified, will default to v3.

Possible values: `4.1`, `4`, `3`, `null`

Configuration for the FICO products used in the Partner Insights product.

Hide object

ID provided by FICO that uniquely identifies the lender. Required for UltraFICOÂ® score generation. Sometimes referred to as Lender Org ID.

Client-generated identifier that uniquely identifies the FICO Application across FICO systems.

A list of UltraFICOÂ® scoring requests. Each request contains all configuration required to generate an UltraFICO score.

Hide object

The version of the UltraFICOÂ® score.

Possible values: `1.0`

Client-generated identifier that can be used to correlate scoring requests with their scoring results.

Details about the base FICO score associated with an UltraFICOÂ® scoring request.

Hide object

The credit bureau that provided the base FICO score.

Possible values: `EQUIFAX`, `EXPERIAN`, `TRANSUNION`

Numeric value of the base FICO score.

Reason codes associated with the score, in priority order. May contain up to 4 items.

Max items: `4`

Whether inquiries adversely affected the score but were not represented in one of the four reason codes. Sometimes referred to as the FACTA Flag.

The version of the base FICO score model.

Possible values: `8`, `9`, `10`, `10T`

/cra/check\_report/partner\_insights/get

Nodeâ¼

```
try {
  const response = await client.craCheckReportPartnerInsightsGet({
    user_id: 'usr_9nSp2KuZ2x4JDw',
  });
} catch (error) {
  // handle error
}
```

/cra/check\_report/partner\_insights/get

**Response fields**

Collapse all

The Partner Insights report of the bank data for an end user.

Hide object

A unique identifier associated with the Partner Insights object.

The time when the Partner Insights report was generated.

Format: `date-time`

Client-generated identifier, which can be used by lenders to track loan applications.

The calculated UltraFICOÂ® scores returned as part of the Partner Insights report.

Hide object

Client-generated identifier that uniquely identifies the FICO Application across FICO systems.

UltraFICOÂ® scoring results, one per provided UltraFICO scoring request.

Hide object

Client-generated identifier that can be used to correlate scoring requests with their scoring results.

FICO-provided identifier that uniquely identifies this score generation request.

The calculated UltraFICOÂ® score.

Hide object

The version of the UltraFICOÂ® score.

Possible values: `1.0`

Numeric value of the UltraFICOÂ® score.

Negative reason codes associated with the score (reasons the score moved downward), in priority order. May contain up to 4 items.

Max items: `4`

Positive reason codes associated with the score (reasons the score moved upward), in priority order. May contain up to 4 items.

Max items: `4`

Whether inquiries adversely affected the score but were not represented in one of the four reason codes. Sometimes referred to as the FACTA Flag.

Human-readable description of why the UltraFICOÂ® score could not be computed.

Report characteristics returned by FICO describing the banking data used to generate the UltraFICOÂ® score.

Hide object

Total number of accounts included in the report. Limited to checking, savings, and money market accounts.

Average daily balance over the past 1 month.

Format: `double`

Average daily balance over the past 3 months.

Format: `double`

Average daily balance over the past 6 months.

Format: `double`

Average daily balance over the past 12 months.

Format: `double`

Number of days since the earliest transaction in the report.

Number of days since the most recent day with a negative ending balance.

Number of days since the most recent insufficient funds fee debit transaction.

Total number of days with a negative balance over the past 1 month.

Total number of days with a negative balance over the past 3 months.

Total number of days with a negative balance over the past 6 months.

Total number of days with a negative balance over the past 12 months.

Number of days since the most recent transaction.

Number of days with at least one transaction over the past 1 month.

Number of days with at least one transaction over the past 3 months.

Number of days with at least one transaction over the past 6 months.

Number of days with at least one transaction over the past 12 months.

Sum of current balances across all accounts in the report.

Format: `double`

Number of checking accounts included in the report.

Number of money market accounts included in the report.

Number of savings accounts included in the report.

The Prism Data insights for the user.

Hide object

The data from the Insights product returned by Prism Data.

Hide object

The version of Prism Data's insights model used. This field is deprecated in favor of `model_version`.

The version of Prism Data's insights model used.

The Insights Result object is a map of cash flow attributes, where the key is a string, and the value is a float or string. For a full list of attributes, contact your account manager. The attributes may vary depending on the Prism version used.

The error returned by Prism for this product.

The data from the CashScoreÂ® product returned by Prism Data.

Hide object

The version of Prism Data's cash score model used. This field is deprecated in favor of `model_version`.

The version of Prism Data's cash score model used.

The score returned by Prism Data. Ranges from 1-999, with higher score indicating lower risk.

The reasons for an individual having risk according to the cash score.

An object containing metadata about the provided transactions.

Hide object

Number of days since the oldest transaction.

Number of days since the latest transaction.

Number of days since the latest credit transaction.

Number of days since the latest debit transaction.

Number of days since the oldest debit transaction.

Number of days since the oldest credit transaction.

Number of credit transactions.

Number of debit transactions.

Number of credit transactions in the last 30 days.

Number of debit transactions in the last 30 days.

The error returned by Prism for this product.

The data from the CashScoreÂ® Extend product returned by Prism Data.

Hide object

The version of Prism Data's CashScoreÂ® Extend model used.

The score returned by Prism Data. Ranges from 1-999, with higher score indicating lower risk.

The reasons for an individual having risk according to the CashScoreÂ® Extend score.

An object containing metadata about the provided transactions.

Hide object

Number of days since the oldest transaction.

Number of days since the latest transaction.

Number of days since the latest credit transaction.

Number of days since the latest debit transaction.

Number of days since the oldest debit transaction.

Number of days since the oldest credit transaction.

Number of credit transactions.

Number of debit transactions.

Number of credit transactions in the last 30 days.

Number of debit transactions in the last 30 days.

The error returned by Prism for this product.

The data from the FirstDetect product returned by Prism Data.

Hide object

The version of Prism Data's FirstDetect model used. This field is deprecated in favor of `model_version`.

The version of Prism Data's FirstDetect model used.

The score returned by Prism Data. Ranges from 1-999, with higher score indicating lower risk.

The reasons for an individual having risk according to the FirstDetect score.

An object containing metadata about the provided transactions.

Hide object

Number of days since the oldest transaction.

Number of days since the latest transaction.

Number of days since the latest credit transaction.

Number of days since the latest debit transaction.

Number of days since the oldest debit transaction.

Number of days since the oldest credit transaction.

Number of credit transactions.

Number of debit transactions.

Number of credit transactions in the last 30 days.

Number of debit transactions in the last 30 days.

The error returned by Prism for this product.

The data from the CashScoreÂ® Detect product returned by Prism Data.

Hide object

The version of Prism Data's CashScoreÂ® Detect model used.

The score returned by Prism Data. Ranges from 1-999, with higher score indicating lower risk.

The reasons for an individual having risk according to the CashScoreÂ® Detect score.

An object containing metadata about the provided transactions.

Hide object

Number of days since the oldest transaction.

Number of days since the latest transaction.

Number of days since the latest credit transaction.

Number of days since the latest debit transaction.

Number of days since the oldest debit transaction.

Number of days since the oldest credit transaction.

Number of credit transactions.

Number of debit transactions.

Number of credit transactions in the last 30 days.

Number of debit transactions in the last 30 days.

The error returned by Prism for this product.

Details on whether the Prism Data attributes succeeded or failed to be generated.

The list of Items used in the report along with the associated metadata about the Item.

Hide object

The ID for the institution that the user linked.

The name of the institution the user linked.

The identifier for the Item.

A list of accounts in the Item.

Hide object

Plaid's unique identifier for the account. This value will not change unless Plaid can't reconcile the account with the data returned by the financial institution. This may occur, for example, when the name of the account changes. If this happens a new `account_id` will be assigned to the account.

If an account with a specific `account_id` disappears instead of changing, the account is likely closed. Closed accounts are not returned by the Plaid API.

Like all Plaid identifiers, the `account_id` is case sensitive.

The last 2-4 alphanumeric characters of an account's official account number.
Note that the mask may be non-unique between an Item's accounts, and it may also not match the mask that the bank displays to the user.

An object containing metadata about the extracted account.

Hide object

The date of the earliest extracted transaction, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ("yyyy-mm-dd").

Format: `date`

The date of the most recent extracted transaction, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ("yyyy-mm-dd").

Format: `date`

The name of the account

The official name of the bank account.

Valid account subtypes for depository accounts. For a list containing descriptions of each subtype, see [Account schemas](https://plaid.com/docs/api/accounts/#StandaloneAccountType-depository).

Possible values: `checking`, `savings`, `hsa`, `cd`, `money market`, `paypal`, `prepaid`, `cash management`, `ebt`, `limited purpose checking`, `all`

The account type. This will always be `depository`.

Possible values: `depository`

Data returned by the financial institution about the account owner or owners. Identity information is optional, so field may return an empty array.

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

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

If the Partner Insights generation was successful but a subset of data could not be retrieved, this array will contain information about the errors causing information to be missing

Hide object

The warning type, which will always be `CHECK_REPORT_WARNING`

The warning code identifies a specific kind of warning.
`IDENTITY_UNAVAILABLE`: Account-owner information is not available.
`TRANSACTIONS_UNAVAILABLE`: Transactions information associated with Credit and Depository accounts are unavailable.
`USER_FRAUD_ALERT`: The user has placed a fraud alert on their Plaid Check consumer report due to suspected fraud. Please note that when a fraud alert is in place, the recipient of the consumer report has an obligation to verify the consumer's identity.

Possible values: `IDENTITY_UNAVAILABLE`, `TRANSACTIONS_UNAVAILABLE`, `USER_FRAUD_ALERT`

An error object and associated `item_id` used to identify a specific Item and error when a batch operation operating on multiple Items has encountered an error in one of the Items.

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

The `item_id` of the Item associated with this webhook, warning, or error

Response Object

```
{
  "request_id": "LhQf0THi8SH1yJm",
  "report": {
    "report_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
    "client_report_id": "client_report_id_1221",
    "generated_time": "2022-01-31T22:47:53Z",
    "items": [
      {
        "institution_id": "ins_109508",
        "institution_name": "Plaid Bank",
        "item_id": "Ed6bjNrDLJfGvZWwnkQlfxwoNz54B5C97ejBr",
        "accounts": [
          {
            "account_id": "1qKRXQjk8xUWDJojNwPXTj8gEmR48piqRNye8",
            "mask": "8888",
            "metadata": {
              "start_date": "2022-01-01",
              "end_date": "2022-01-31"
            },
            "name": "Plaid Checking Account",
            "official_name": "Plaid Checking Account",
            "type": "depository",
            "subtype": "checking",
            "owners": []
          }
        ]
      }
    ],
    "prism": {
      "insights": {
        "version": 3,
        "result": {
          "l6m_cumbal_acc": 1
        }
      },
      "cash_score": {
        "version": 3,
        "model_version": "3",
        "score": 900,
        "reason_codes": [
          "CS03038"
        ],
        "metadata": {
          "max_age": 20,
          "min_age": 1,
          "min_age_credit": 0,
          "min_age_debit": 1,
          "max_age_debit": 20,
          "max_age_credit": 0,
          "num_trxn_credit": 0,
          "num_trxn_debit": 40,
          "l1m_credit_value_cnt": 0,
          "l1m_debit_value_cnt": 40
        }
      },
      "first_detect": {
        "version": 3,
        "model_version": "3",
        "score": 900,
        "reason_codes": [
          "CS03038"
        ],
        "metadata": {
          "max_age": 20,
          "min_age": 1,
          "min_age_credit": 0,
          "min_age_debit": 1,
          "max_age_debit": 20,
          "max_age_credit": 0,
          "num_trxn_credit": 0,
          "num_trxn_debit": 40,
          "l1m_credit_value_cnt": 0,
          "l1m_debit_value_cnt": 40
        }
      },
      "status": "SUCCESS"
    }
  }
}
```

=\*=\*=\*=[#### `/cra/check_report/pdf/get`](/docs/api/products/check/#cracheck_reportpdfget)

[#### Retrieve a Consumer Report as a PDF](/docs/api/products/check/#retrieve-a-consumer-report-as-a-pdf)

[`/cra/check_report/pdf/get`](/docs/api/products/check/#cracheck_reportpdfget) retrieves the most recent Consumer Report in PDF format. By default, the most recent Base Report (if it exists) for the user will be returned. To request that the most recent Partner Insights or Income Insights report be included in the PDF as well, use the `add-ons` field.

/cra/check\_report/pdf/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

A unique user identifier, created by `/user/create`. Integrations that began using `/user/create` after December 10, 2025 use this field to identify a user instead of the `user_token`. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

Use this field to include other reports in the PDF.

Possible values: `cra_income_insights`, `cra_partner_insights`

The user token associated with the user for which data is being requested. This field is used only by customers with pre-existing integrations that already use the `user_token` field. All other customers should use the `user_id` instead. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

/cra/check\_report/pdf/get

Nodeâ¼

```
try {
  const response = await client.craCheckReportPdfGet(
    {
      user_id: 'usr_9nSp2KuZ2x4JDw',
    },
    {
      responseType: 'arraybuffer',
    },
  );
  const pdf = response.data.toString('base64');
} catch (error) {
  // handle error
}
```

[##### Response](/docs/api/products/check/#response)

This endpoint returns binary PDF data. [View a sample Check Report PDF.](https://plaid.com/documents/sample-check-report.pdf)
[View a sample Check Report PDF containing Income Insights.](https://plaid.com/documents/sample-check-report-with-income.pdf)

=\*=\*=\*=[#### `/cra/check_report/cashflow_insights/get`](/docs/api/products/check/#cracheck_reportcashflow_insightsget)

[#### Retrieve cash flow insights from your user's banking data](/docs/api/products/check/#retrieve-cash-flow-insights-from-your-user's-banking-data)

This endpoint allows you to retrieve the Cashflow Insights report for your user. You should call this endpoint after you've received a `CHECK_REPORT_READY` or a `USER_CHECK_REPORT_READY` webhook, either after the Link session for the user or after calling [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate). If the most recent consumer report for the user doesn't have sufficient data to generate the insights, or the consumer report has expired, you will receive an error indicating that you should create a new consumer report by calling [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate).

If you did not initialize Link with the `cra_cashflow_insights` product or have generated a report using [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate), we will generate the insights when you call this endpoint. In this case, you may optionally provide parameters under `options` to configure which insights you want to receive.

/cra/check\_report/cashflow\_insights/get

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

A unique user identifier, created by `/user/create`. Integrations that began using `/user/create` after December 10, 2025 use this field to identify a user instead of the `user_token`. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

The user token associated with the user for which data is being requested. This field is used only by customers with pre-existing integrations that already use the `user_token` field. All other customers should use the `user_id` instead. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

Deprecated. This field is no longer accepted for new clients (created on or after 2026-07-01). New clients should specify required products when creating the Consumer Report. Existing integrations may continue to pass `options`.

Hide object

The version of cashflow attributes. Required if using Cash Flow Insights.

Possible values: `CFI1`

/cra/check\_report/cashflow\_insights/get

Nodeâ¼

```
try {
  const response = await client.craCheckReportCashflowInsightsGet({
    user_id: 'usr_9nSp2KuZ2x4JDw',
  });
} catch (error) {
  // handle error
}
```

/cra/check\_report/cashflow\_insights/get

**Response fields**

Collapse all

Contains data for the CRA Cashflow Insights Report.

Hide object

The unique identifier associated with the report object.

The time when the report was generated.

Format: `date-time`

A map of cash flow attributes, where the key is a string, and the value is a float, int, or boolean. The specific list of attributes will depend on the cash flow attributes version used. For a full list of attributes, contact your account manager.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

If the Cashflow Insights generation was successful but a subset of data could not be retrieved, this array will contain information about the errors causing information to be missing

Hide object

The warning type, which will always be `CHECK_REPORT_WARNING`

The warning code identifies a specific kind of warning.
`IDENTITY_UNAVAILABLE`: Account-owner information is not available.
`TRANSACTIONS_UNAVAILABLE`: Transactions information associated with Credit and Depository accounts are unavailable.
`USER_FRAUD_ALERT`: The user has placed a fraud alert on their Plaid Check consumer report due to suspected fraud. Please note that when a fraud alert is in place, the recipient of the consumer report has an obligation to verify the consumer's identity.

Possible values: `IDENTITY_UNAVAILABLE`, `TRANSACTIONS_UNAVAILABLE`, `USER_FRAUD_ALERT`

An error object and associated `item_id` used to identify a specific Item and error when a batch operation operating on multiple Items has encountered an error in one of the Items.

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

The `item_id` of the Item associated with this webhook, warning, or error

Response Object

```
{
  "request_id": "LhQf0THi8SH1yJm",
  "report": {
    "report_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
    "generated_time": "2022-01-31T22:47:53Z",
    "attributes": {
      "cash_reliance_atm_withdrawal_amt_cv_90d": 180.1
    }
  }
}
```

=\*=\*=\*=[#### `/cra/check_report/lend_score/get`](/docs/api/products/check/#cracheck_reportlend_scoreget)

[#### Retrieve the LendScore from your user's banking data](/docs/api/products/check/#retrieve-the-lendscore-from-your-user's-banking-data)

This endpoint allows you to retrieve the LendScore report for your user. You should call this endpoint after you've received a `CHECK_REPORT_READY` or a `USER_CHECK_REPORT_READY` webhook, either after the Link session for the user or after calling [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate). If the most recent consumer report for the user doesn't have sufficient data to generate the insights, or the consumer report has expired, you will receive an error indicating that you should create a new consumer report by calling [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate).

If you did not initialize Link with the `cra_lend_score` product or call [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate) with the `cra_lend_score` product, Plaid will generate the insights when you call this endpoint. In this case, you may optionally provide parameters under `options` to configure which insights you want to receive.

/cra/check\_report/lend\_score/get

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

A unique user identifier, created by `/user/create`. Integrations that began using `/user/create` after December 10, 2025 use this field to identify a user instead of the `user_token`. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

The user token associated with the user for which data is being requested. This field is used only by customers with pre-existing integrations that already use the `user_token` field. All other customers should use the `user_id` instead. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

Deprecated. This field is no longer accepted for new clients (created on or after 2026-07-01). New clients should specify required products when creating the Consumer Report. Existing integrations may continue to pass `options`.

Hide object

The version of the LendScore to use. Required if using LendScore.

Possible values: `LS1`

/cra/check\_report/lend\_score/get

Nodeâ¼

```
try {
  const response = await client.craCheckReportLendScoreGet({
    user_id: 'usr_9nSp2KuZ2x4JDw',
  });
} catch (error) {
  // handle error
}
```

/cra/check\_report/lend\_score/get

**Response fields**

Collapse all

Contains data for the CRA LendScore Report.

Hide object

The unique identifier associated with the report object.

The time when the report was generated.

Format: `date-time`

The results of the LendScore

Hide object

The score returned by the LendScore model. Will be an integer in the range 1 to 99. Higher scores indicate lower credit risk.

The reasons for an individual having risk according to the LendScore. For a full list of possible reason codes and a mapping of reason codes to human-readable reasons, contact your Plaid account manager. Different LendScore versions will use different sets of reason codes.

Human-readable description of why the LendScore could not be computed.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

If the LendScore generation was successful but a subset of data could not be retrieved, this array will contain information about the errors causing information to be missing

Hide object

The warning type, which will always be `CHECK_REPORT_WARNING`

The warning code identifies a specific kind of warning.
`IDENTITY_UNAVAILABLE`: Account-owner information is not available.
`TRANSACTIONS_UNAVAILABLE`: Transactions information associated with Credit and Depository accounts are unavailable.
`USER_FRAUD_ALERT`: The user has placed a fraud alert on their Plaid Check consumer report due to suspected fraud. Please note that when a fraud alert is in place, the recipient of the consumer report has an obligation to verify the consumer's identity.

Possible values: `IDENTITY_UNAVAILABLE`, `TRANSACTIONS_UNAVAILABLE`, `USER_FRAUD_ALERT`

An error object and associated `item_id` used to identify a specific Item and error when a batch operation operating on multiple Items has encountered an error in one of the Items.

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

The `item_id` of the Item associated with this webhook, warning, or error

Response Object

```
{
  "request_id": "LhQf0THi8SH1yJm",
  "report": {
    "report_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
    "generated_time": "2022-01-31T22:47:53Z",
    "lend_score": {
      "score": 80,
      "reason_codes": [
        "PCS0221",
        "PCS0223"
      ]
    }
  }
}
```

=\*=\*=\*=[#### `/cra/check_report/verification/get`](/docs/api/products/check/#cracheck_reportverificationget)

[#### Retrieve various home lending reports for a user](/docs/api/products/check/#retrieve-various-home-lending-reports-for-a-user)

This endpoint allows you to retrieve home lending reports for a user. To obtain a VoA or Employment Refresh report, you need to make sure that `cra_base_report` is included in the `products` parameter when calling [`/link/token/create`](/docs/api/link/#linktokencreate) or [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate).

You should call this endpoint after you've received a `CHECK_REPORT_READY` or a `USER_CHECK_REPORT_READY` webhook, either after the Link session for the user or after calling [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate).

If the most recent consumer report for the user doesn't have sufficient data to generate the report, or the consumer report has expired, you will receive an error indicating that you should create a new consumer report by calling [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate).

/cra/check\_report/verification/get

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

A unique user identifier, created by `/user/create`. Integrations that began using `/user/create` after December 10, 2025 use this field to identify a user instead of the `user_token`. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

Specifies which types of home lending reports are expected in the response

Possible values: `VOA`, `EMPLOYMENT_REFRESH`, `INCOME`

Deprecated. This field is no longer accepted for new clients (created on or after 2026-07-01). New clients should specify required products when creating the Consumer Report. Existing integrations may continue to pass `employment_refresh_options`.

Hide object

The number of days of data to request for the report. This field is required if an Employment Refresh Report is requested. Maximum is 731.

Maximum: `731`

The user token associated with the user for which data is being requested. This field is used only by customers with pre-existing integrations that already use the `user_token` field. All other customers should use the `user_id` instead. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

/cra/check\_report/verification/get

Nodeâ¼

```
try {
  const response = await client.craCheckReportVerificationGet({
    user_id: 'usr_9nSp2KuZ2x4JDw',
    reports_requested: ['VOA', 'EMPLOYMENT_REFRESH'],
  });
} catch (error) {
  // handle error
}
```

/cra/check\_report/verification/get

**Response fields**

Collapse all

Contains data for the CRA Home Lending Report.

Hide object

The unique identifier associated with the Home Lending Report object. This ID will be the same as the Base Report ID.

A unique token that can be shared with GSEs in order to provide them access to the report. This is automatically created during report generation when GSE options are specified.

Client-generated identifier, which can be used by lenders to track loan applications.

An object representing a VOA report.

Hide object

The date and time when the VOA Report was created, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (e.g. "2018-04-12T03:32:11Z").

Format: `date-time`

The number of days of transaction history that the VOA report covers.

Data returned by Plaid about each of the Items included in the Base Report.

Hide object

Data about each of the accounts open on the Item.

Hide object

Plaid's unique identifier for the account. This value will not change unless Plaid can't reconcile the account with the data returned by the financial institution. This may occur, for example, when the name of the account changes. If this happens a new `account_id` will be assigned to the account.

If an account with a specific `account_id` disappears instead of changing, the account is likely closed. Closed accounts are not returned by the Plaid API.

Like all Plaid identifiers, the `account_id` is case sensitive.

VOA Report information about an account's balances.

Hide object

The amount of funds available to be withdrawn from the account, as determined by the financial institution.

For `credit`-type accounts, the `available` balance typically equals the `limit` less the `current` balance, less any pending outflows plus any pending inflows.

For `depository`-type accounts, the `available` balance typically equals the `current` balance less any pending outflows plus any pending inflows. For `depository`-type accounts, the `available` balance does not include the overdraft limit.

For `investment`-type accounts (or `brokerage`-type accounts for API versions 2018-05-22 and earlier), the `available` balance is the total cash available to withdraw as presented by the institution.

Note that not all institutions calculate the `available` balance. In the event that `available` balance is unavailable, Plaid will return an `available` balance value of `null`.

Available balance may be cached and is not guaranteed to be up-to-date in real-time unless the value was returned by `/accounts/balance/get`.

If `current` is `null` this field is guaranteed not to be `null`.

Format: `double`

The total amount of funds in or owed by the account.

For `credit`-type accounts, a positive balance indicates the amount owed; a negative amount indicates the lender owing the account holder.

For `loan`-type accounts, the current balance is the principal remaining on the loan, except in the case of student loan accounts at Sallie Mae (`ins_116944`). For Sallie Mae student loans, the account's balance includes both principal and any outstanding interest.

For `investment`-type accounts (or `brokerage`-type accounts for API versions 2018-05-22 and earlier), the current balance is the total value of assets as presented by the institution.

Note that balance information may be cached unless the value was returned by `/accounts/balance/get`; if the Item is enabled for Transactions, the balance will be at least as recent as the most recent Transaction update. If you require real-time balance information, use the `available` balance as provided by `/accounts/balance/get`.

When returned by `/accounts/balance/get`, this field may be `null`. When this happens, `available` is guaranteed not to be `null`.

Format: `double`

The ISO-4217 currency code of the balance. Always null if `unofficial_currency_code` is non-null.

The unofficial currency code associated with the balance. Always null if `iso_currency_code` is non-null. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Calculated data about the historical balances on the account.

Available for `credit` and `depository` type accounts.

Hide object

The total amount of funds in the account, calculated from the `current` balance in the `balance` object by subtracting inflows and adding back outflows according to the posted date of each transaction.

Format: `double`

The date of the calculated historical balance, in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The ISO-4217 currency code of the balance. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the balance. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The average balance in the account over the last 30 days. Calculated using the derived historical balances.

Format: `double`

The average balance in the account over the last 60 days. Calculated using the derived historical balances.

Format: `double`

The number of net NSF fee transactions in the time range for the report in the given account (not counting any fees that were reversed within the time range).

The information about previously submitted valid dispute statements by the consumer

Hide object

(Deprecated) A unique identifier (UUID) of the consumer dispute that can be used for troubleshooting

Date of the disputed field (e.g. transaction date), in an ISO 8601 format (YYYY-MM-DD)

Format: `date`

Type of data being disputed by the consumer

Possible values: `TRANSACTION`, `BALANCE`, `IDENTITY`, `OTHER`

Text content of dispute

The last 2-4 alphanumeric characters of an account's official account number. Note that the mask may be non-unique between an Item's accounts, and it may also not match the mask that the bank displays to the user.

The name of the account, either assigned by the user or by the financial institution itself.

The official name of the account as given by the financial institution.

`investment:` Investment account. In API versions 2018-05-22 and earlier, this type is called `brokerage` instead.

`credit:` Credit card

`depository:` Depository account

`loan:` Loan account

`other:` Non-specified account type

See the [Account type schema](https://plaid.com/docs/api/accounts#account-type-schema) for a full listing of account types and corresponding subtypes.

Possible values: `investment`, `credit`, `depository`, `loan`, `brokerage`, `other`

See the [Account type schema](https://plaid.com/docs/api/accounts/#account-type-schema) for a full listing of account types and corresponding subtypes.

Possible values: `401a`, `401k`, `403B`, `457b`, `529`, `auto`, `brokerage`, `business`, `cash isa`, `cash management`, `cd`, `checking`, `commercial`, `construction`, `consumer`, `credit card`, `crypto exchange`, `ebt`, `education savings account`, `fhsa`, `fixed annuity`, `gic`, `health reimbursement arrangement`, `home equity`, `hsa`, `isa`, `ira`, `keogh`, `lif`, `life insurance`, `limited purpose checking`, `line of credit`, `lira`, `loan`, `lrif`, `lrsp`, `money market`, `mortgage`, `mutual fund`, `non-custodial wallet`, `non-taxable brokerage account`, `other`, `other insurance`, `other annuity`, `overdraft`, `paypal`, `payroll`, `pension`, `prepaid`, `prif`, `profit sharing plan`, `qshr`, `rdsp`, `resp`, `retirement`, `rlif`, `roth`, `roth 401k`, `roth 403B`, `roth 457b`, `roth pension`, `roth profit sharing plan`, `roth thrift savings plan`, `rrif`, `rrsp`, `sarsep`, `savings`, `sep ira`, `simple ira`, `sipp`, `stock plan`, `student`, `thrift savings plan`, `tfsa`, `trust`, `ugma`, `utma`, `variable annuity`

The duration of transaction history available within this report for this Item, typically defined as the time since the date of the earliest transaction in that account.

Transaction data associated with the account.

Hide object

Transaction history associated with the account.

Hide object

The ID of the account in which this transaction occurred.

The settled value of the transaction, denominated in the transaction's currency, as stated in `iso_currency_code` or `unofficial_currency_code`. Positive values when money moves out of the account; negative values when money moves in. For example, debit card purchases are positive; credit card payments, direct deposits, and refunds are negative.

Format: `double`

The ISO-4217 currency code of the transaction. Always `null` if `unofficial_currency_code` is non-null.

The unofficial currency code associated with the transaction. Always `null` if `iso_currency_code` is non-`null`. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The string returned by the financial institution to describe the transaction.

Information describing the intent of the transaction. Most relevant for credit use cases, but not limited to such use cases.

See the [`taxonomy csv file`](https://plaid.com/documents/credit-category-taxonomy.csv) for a full list of credit categories.

Hide object

A high level category that communicates the broad category of the transaction.

A granular category conveying the transaction's intent. This field can also be used as a unique identifier for the category.

The check number of the transaction. This field is only populated for check transactions.

For pending transactions, the date that the transaction occurred; for posted transactions, the date that the transaction posted. Both dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ( `YYYY-MM-DD` ).

Format: `date`

The date on which the transaction took place, in IS0 8601 format.

A representation of where a transaction took place. Location data is provided only for transactions at physical locations, not for online transactions. Location data availability depends primarily on the merchant and is most likely to be populated for transactions at large retail chains; small, local businesses are less likely to have location data available.

Hide object

The street address where the transaction occurred.

The city where the transaction occurred.

The region or state where the transaction occurred. In API versions 2018-05-22 and earlier, this field is called `state`.

The postal code where the transaction occurred. In API versions 2018-05-22 and earlier, this field is called `zip`.

The ISO 3166-1 alpha-2 country code where the transaction occurred.

The latitude where the transaction occurred.

Format: `double`

The longitude where the transaction occurred.

Format: `double`

The merchant defined store number where the transaction occurred.

The merchant name, as enriched by Plaid from the `name` field. This is typically a more human-readable version of the merchant counterparty in the transaction. For some bank transactions (such as checks or account transfers) where there is no meaningful merchant name, this value will be `null`.

When `true`, identifies the transaction as pending or unsettled. Pending transaction details (name, type, amount, category ID) may change before they are settled.

The name of the account owner. This field is not typically populated and only relevant when dealing with sub-accounts.

The unique ID of the transaction. Like all Plaid identifiers, the `transaction_id` is case sensitive.

The latest timeframe provided by the FI, in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The earliest timeframe provided by the FI, in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

Data returned by the financial institution about the account owner or owners.

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

How an asset is owned.

`association`: Ownership by a corporation, partnership, or unincorporated association, including for-profit and not-for-profit organizations.
`individual`: Ownership by an individual.
`joint`: Joint ownership by multiple parties.
`trust`: Ownership by a revocable or irrevocable trust.

Possible values: `null`, `individual`, `joint`, `association`, `trust`

A set of fields describing the investments data on an account.

Hide object

Quantities and values of securities held in the investment account. Map to the `securities` array for security details.

Hide object

The Plaid `account_id` associated with the holding.

The Plaid `security_id` associated with the holding. Security data is not specific to a user's account; any user who held the same security at the same financial institution at the same time would have identical security data. The `security_id` for the same security will typically be the same across different institutions, but this is not guaranteed. The `security_id` does not typically change, but may change if inherent details of the security change due to a corporate action, for example, in the event of a ticker symbol change or CUSIP change.

The last price given by the institution for this security.

Format: `double`

The date at which `institution_price` was current.

Format: `date`

The value of the holding, as reported by the institution.

Format: `double`

The original total value of the holding. This field is calculated by Plaid as the sum of the purchase price of all of the shares in the holding.

Format: `double`

The total quantity of the asset held, as reported by the financial institution. If the security is an option, `quantity` will reflect the total number of options (typically the number of contracts multiplied by 100), not the number of contracts.

Format: `double`

The ISO-4217 currency code of the holding. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the holding. Always `null` if `iso_currency_code` is non-`null`. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `iso_currency_code`s.

Details of specific securities held in the investment account.

Hide object

A unique, Plaid-specific identifier for the security, used to associate securities with holdings. Like all Plaid identifiers, the `security_id` is case sensitive. The `security_id` may change if inherent details of the security change due to a corporate action, for example, in the event of a ticker symbol change or CUSIP change.

A descriptive name for the security, suitable for display.

12-character ISIN, a globally unique securities identifier. A verified CUSIP Global Services license is required to receive this data. This field will be null by default for new customers, and null for existing customers starting March 12, 2024. If you would like access to this field, please start the verification process [here](https://docs.google.com/forms/d/e/1FAIpQLSd9asHEYEfmf8fxJTHZTAfAzW4dugsnSu-HS2J51f1mxwd6Sw/viewform).

9-character CUSIP, an identifier assigned to North American securities. A verified CUSIP Global Services license is required to receive this data. This field will be null by default for new customers, and null for existing customers starting March 12, 2024. If you would like access to this field, please start the verification process [here](https://docs.google.com/forms/d/e/1FAIpQLSd9asHEYEfmf8fxJTHZTAfAzW4dugsnSu-HS2J51f1mxwd6Sw/viewform).

An identifier given to the security by the institution.

If `institution_security_id` is present, this field indicates the Plaid `institution_id` of the institution to whom the identifier belongs.

The security's trading symbol for publicly traded securities, and otherwise a short identifier if available.

The security type of the holding. Valid security types are:

`cash`: Cash, currency, and money market funds

`cryptocurrency`: Digital or virtual currencies

`derivative`: Options, warrants, and other derivative instruments

`equity`: Domestic and foreign equities

`etf`: Multi-asset exchange-traded investment funds

`fixed income`: Bonds and certificates of deposit (CDs)

`loan`: Loans and loan receivables

`mutual fund`: Open- and closed-end vehicles pooling funds of multiple investors

`other`: Unknown or other investment types

Transaction history on the investment account.

Hide object

The ID of the Investment transaction, unique across all Plaid transactions. Like all Plaid identifiers, the `investment_transaction_id` is case sensitive.

The `account_id` of the account against which this transaction posted.

The `security_id` to which this transaction is related.

The [ISO 8601](https://wikipedia.org/wiki/ISO_8601) posting date for the transaction.

Format: `date`

The institution's description of the transaction.

The number of units of the security involved in this transaction. Positive for buy transactions; negative for sell transactions.

Format: `double`

The complete value of the transaction. Positive values when cash is debited, e.g. purchases of stock; negative values when cash is credited, e.g. sales of stock. Treatment remains the same for cash-only movements unassociated with securities. For transactions representing a simultaneous cash contribution and purchase of a security, the portion of the transaction representing the purchase takes precedence, and the `amount` is represented as positive.

Format: `double`

The price of the security at which this transaction occurred.

Format: `double`

The combined value of all fees applied to this transaction

Format: `double`

Value is one of the following:
`buy`: Buying an investment
`sell`: Selling an investment
`cancel`: A cancellation of a pending transaction
`cash`: Activity that modifies a cash position
`fee`: A fee on the account
`transfer`: Activity which modifies a position, but not through buy/sell activity e.g. options exercise, portfolio transfer

For descriptions of possible transaction types and subtypes, see the [Investment transaction types schema](https://plaid.com/docs/api/accounts/#investment-transaction-types-schema).

Possible values: `buy`, `sell`, `cancel`, `cash`, `fee`, `transfer`

For descriptions of possible transaction types and subtypes, see the [Investment transaction types schema](https://plaid.com/docs/api/accounts/#investment-transaction-types-schema).

Possible values: `account fee`, `adjustment`, `assignment`, `buy`, `buy to cover`, `contribution`, `deposit`, `distribution`, `dividend`, `dividend reinvestment`, `exercise`, `expire`, `fund fee`, `interest`, `interest receivable`, `interest reinvestment`, `legal fee`, `loan payment`, `long-term capital gain`, `long-term capital gain reinvestment`, `management fee`, `margin expense`, `merger`, `miscellaneous fee`, `non-qualified dividend`, `non-resident tax`, `pending credit`, `pending debit`, `qualified dividend`, `rebalance`, `return of principal`, `request`, `sell`, `sell short`, `send`, `short-term capital gain`, `short-term capital gain reinvestment`, `spin off`, `split`, `stock distribution`, `tax`, `tax withheld`, `trade`, `transfer`, `transfer fee`, `trust fee`, `unqualified gain`, `withdrawal`

The ISO-4217 currency code of the transaction. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the transaction. Always `null` if `iso_currency_code` is non-`null`. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `iso_currency_code`s.

The full financial institution name associated with the Item.

The id of the financial institution associated with the Item.

The `item_id` of the Item associated with this webhook, warning, or error

The date and time when this Item's data was last retrieved from the financial institution, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date-time`

Attributes for the VOA report.

Hide object

Total amount of debit transactions into the report's accounts in the time period of the report. This field only takes into account USD transactions from the accounts.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Total amount of credit transactions into the report's accounts in the time period of the report. This field only takes into account USD transactions from the accounts.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

An object representing an Employment Refresh Report.

Hide object

The date and time when the Employment Refresh Report was created, in ISO 8601 format (e.g. "2018-04-12T03:32:11Z").

Format: `date-time`

The number of days of transaction history that the Employment Refresh Report covers.

Data returned by Plaid about each of the Items included in the Employment Refresh Report.

Hide object

Data about each of the accounts open on the Item.

Hide object

Plaid's unique identifier for the account. This value will not change unless Plaid can't reconcile the account with the data returned by the financial institution. This may occur, for example, when the name of the account changes. If this happens a new `account_id` will be assigned to the account.

If an account with a specific `account_id` disappears instead of changing, the account is likely closed. Closed accounts are not returned by the Plaid API.

Like all Plaid identifiers, the `account_id` is case sensitive.

The name of the account, either assigned by the user or by the financial institution itself.

The official name of the account as given by the financial institution.

`investment:` Investment account. In API versions 2018-05-22 and earlier, this type is called `brokerage` instead.

`credit:` Credit card

`depository:` Depository account

`loan:` Loan account

`other:` Non-specified account type

See the [Account type schema](https://plaid.com/docs/api/accounts#account-type-schema) for a full listing of account types and corresponding subtypes.

Possible values: `investment`, `credit`, `depository`, `loan`, `brokerage`, `other`

See the [Account type schema](https://plaid.com/docs/api/accounts/#account-type-schema) for a full listing of account types and corresponding subtypes.

Possible values: `401a`, `401k`, `403B`, `457b`, `529`, `auto`, `brokerage`, `business`, `cash isa`, `cash management`, `cd`, `checking`, `commercial`, `construction`, `consumer`, `credit card`, `crypto exchange`, `ebt`, `education savings account`, `fhsa`, `fixed annuity`, `gic`, `health reimbursement arrangement`, `home equity`, `hsa`, `isa`, `ira`, `keogh`, `lif`, `life insurance`, `limited purpose checking`, `line of credit`, `lira`, `loan`, `lrif`, `lrsp`, `money market`, `mortgage`, `mutual fund`, `non-custodial wallet`, `non-taxable brokerage account`, `other`, `other insurance`, `other annuity`, `overdraft`, `paypal`, `payroll`, `pension`, `prepaid`, `prif`, `profit sharing plan`, `qshr`, `rdsp`, `resp`, `retirement`, `rlif`, `roth`, `roth 401k`, `roth 403B`, `roth 457b`, `roth pension`, `roth profit sharing plan`, `roth thrift savings plan`, `rrif`, `rrsp`, `sarsep`, `savings`, `sep ira`, `simple ira`, `sipp`, `stock plan`, `student`, `thrift savings plan`, `tfsa`, `trust`, `ugma`, `utma`, `variable annuity`

Transaction history associated with the account for the Employment Refresh Report. Note that this transaction differs from a Base Report transaction in that it will only be deposits, and the amounts will be omitted.

Hide object

The ID of the account in which this transaction occurred.

The string returned by the financial institution to describe the transaction.

For pending transactions, the date that the transaction occurred; for posted transactions, the date that the transaction posted. Both dates are returned in an ISO 8601 format ( `YYYY-MM-DD` ).

Format: `date`

When `true`, identifies the transaction as pending or unsettled. Pending transaction details (name, type, amount, category ID) may change before they are settled.

The unique ID of the transaction. Like all Plaid identifiers, the `transaction_id` is case sensitive.

The full financial institution name associated with the Item.

The id of the financial institution associated with the Item.

The `item_id` of the Item associated with this webhook, warning, or error

The date and time when this Item's data was last retrieved from the financial institution, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date-time`

An object representing an Income Report within the Home Lending Report.

Hide object

The time when the Home Lending Income Report was generated.

Format: `date-time`

The number of days requested by the customer for the Home Lending Income Report.

Aggregated summary of all income streams for this user.

Hide object

List of a user's aggregated income metrics for each currency.

Hide object

Modeled estimate of current income based on recently observed income transactions.

Hide object

Modeled income values for a given time period.

Hide object

Gross Income modeled from trends of observed transactions.

Format: `double`

Net Income estimated from observed transactions.

Format: `double`

Modeled income values for a given time period.

Hide object

Gross Income modeled from trends of observed transactions.

Format: `double`

Net Income estimated from observed transactions.

Format: `double`

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

The list of income streams for this user.

Hide object

A unique identifier for an income stream. If the report is regenerated and a new `report_id` is created, the new report will have a new set of `income_stream_id`s.

Minimum of all dates within the specific income stream for days requested by the client. The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

Maximum of all dates within the specific income stream for days requested by the client. The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The most common name or original description for the underlying income transactions.

Modeled insights for a given income stream.

Hide object

The income category for a given stream. The streams returned in the response will be filtered based on these primary and secondary income categories.

See the [Income V2 Category Taxonomy](https://plaid.com/documents/income-v2-category-taxonomy.csv) for a full list of income categories.

Hide object

A high level category that communicates the broad category of the stream.

A granular category conveying the stream's intent.

The income pay frequency.
`WEEKLY`: Weekly pay frequency.
`BIWEEKLY`: Biweekly pay frequency.
`SEMI_MONTHLY`: Semi-monthly pay frequency.
`MONTHLY`: Monthly pay frequency.
`DAILY`: Daily pay frequency.
`UNKNOWN`: Pay frequency is unknown.

Possible values: `WEEKLY`, `BIWEEKLY`, `SEMI_MONTHLY`, `MONTHLY`, `DAILY`, `UNKNOWN`

The object containing data about the income provider.

Hide object

The name of the income provider.

Indicates whether the income provider name is normalized by comparing it against a canonical set of known providers.

The status of the income source.
`ACTIVE`: The income source is active.
`INACTIVE`: The income source is inactive.
`UNKNOWN`: The income source status is unknown.

Possible values: `ACTIVE`, `INACTIVE`, `UNKNOWN`

Metadata of the income stream's next payment.

Hide object

The expected date of the income stream's next payment. The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

Modeled income metrics for a given income stream or user summary.

Hide object

Modeled estimate of current income based on recently observed income transactions.

Hide object

Modeled income values for a given time period.

Hide object

Gross Income modeled from trends of observed transactions.

Format: `double`

Net Income estimated from observed transactions.

Format: `double`

Modeled income values for a given time period.

Hide object

Gross Income modeled from trends of observed transactions.

Format: `double`

Net Income estimated from observed transactions.

Format: `double`

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

The transactions data for the income stream ordered by ascending date.

Hide object

The unique ID of the transaction. Like all Plaid identifiers, the `transaction_id` is case sensitive.

The `item_id` of the Item associated with this webhook, warning, or error

Plaid's unique identifier for the account. This value will not change unless Plaid can't reconcile the account with the data returned by the financial institution. This may occur, for example, when the name of the account changes. If this happens a new `account_id` will be assigned to the account.

If an account with a specific `account_id` disappears instead of changing, the account is likely closed. Closed accounts are not returned by the Plaid API.

Like all Plaid identifiers, the `account_id` is case sensitive.

The settled value of the transaction, denominated in the transaction's currency as stated in `iso_currency_code` or `unofficial_currency_code`.
Positive values when money moves out of the account; negative values when money moves in.
For example, credit card purchases are positive; credit card payment, direct deposits, and refunds are negative.

Format: `double`

For pending transactions, the date that the transaction occurred; for posted transactions, the date that the transaction posted.
Both dates are returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The string returned by the financial institution to describe the transaction.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Metadata on whether this income transaction is an outlier.

Hide object

Indicates whether an income transaction amount is unusually high compared to the amounts for that stream.

The amount that the transaction differs from the stream average transaction amount.

Format: `double`

The list of Items in the report along with the associated metadata about the Item.

Hide object

The `item_id` of the Item associated with this webhook, warning, or error

The Item's accounts that have bank income data.

Hide object

Plaid's unique identifier for the account. This value will not change unless Plaid can't reconcile the account with the data returned by the financial institution. This may occur, for example, when the name of the account changes. If this happens a new `account_id` will be assigned to the account.

If an account with a specific `account_id` disappears instead of changing, the account is likely closed. Closed accounts are not returned by the Plaid API.

Like all Plaid identifiers, the `account_id` is case sensitive.

The last 2-4 alphanumeric characters of an account's official account number.
Note that the mask may be non-unique between an Item's accounts, and it may also not match the mask that the bank displays to the user.

An object containing metadata about the extracted account.

Hide object

The date of the earliest extracted transaction, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ("yyyy-mm-dd").

Format: `date`

The date of the most recent extracted transaction, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ("yyyy-mm-dd").

Format: `date`

The name of the account, either assigned by the user or by the financial institution itself.

The official name of the account as given by the financial institution.

See the [Account type schema](https://plaid.com/docs/api/accounts/#account-type-schema) for a full listing of account types and corresponding subtypes.

Possible values: `401a`, `401k`, `403B`, `457b`, `529`, `auto`, `brokerage`, `business`, `cash isa`, `cash management`, `cd`, `checking`, `commercial`, `construction`, `consumer`, `credit card`, `crypto exchange`, `ebt`, `education savings account`, `fhsa`, `fixed annuity`, `gic`, `health reimbursement arrangement`, `home equity`, `hsa`, `isa`, `ira`, `keogh`, `lif`, `life insurance`, `limited purpose checking`, `line of credit`, `lira`, `loan`, `lrif`, `lrsp`, `money market`, `mortgage`, `mutual fund`, `non-custodial wallet`, `non-taxable brokerage account`, `other`, `other insurance`, `other annuity`, `overdraft`, `paypal`, `payroll`, `pension`, `prepaid`, `prif`, `profit sharing plan`, `qshr`, `rdsp`, `resp`, `retirement`, `rlif`, `roth`, `roth 401k`, `roth 403B`, `roth 457b`, `roth pension`, `roth profit sharing plan`, `roth thrift savings plan`, `rrif`, `rrsp`, `sarsep`, `savings`, `sep ira`, `simple ira`, `sipp`, `stock plan`, `student`, `thrift savings plan`, `tfsa`, `trust`, `ugma`, `utma`, `variable annuity`

`investment:` Investment account. In API versions 2018-05-22 and earlier, this type is called `brokerage` instead.

`credit:` Credit card

`depository:` Depository account

`loan:` Loan account

`other:` Non-specified account type

See the [Account type schema](https://plaid.com/docs/api/accounts#account-type-schema) for a full listing of account types and corresponding subtypes.

Possible values: `investment`, `credit`, `depository`, `loan`, `brokerage`, `other`

The time when this Item's data was last retrieved from the financial institution.

Format: `date-time`

The unique identifier of the institution associated with the Item.

The name of the institution associated with the Item.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

If the home lending report generation was successful but a subset of data could not be retrieved, this array will contain information about the errors causing information to be missing.

Hide object

The warning type, which will always be `CHECK_REPORT_WARNING`

The warning code identifies a specific kind of warning.
`IDENTITY_UNAVAILABLE`: Account-owner information is not available.
`TRANSACTIONS_UNAVAILABLE`: Transactions information associated with Credit and Depository accounts are unavailable.
`USER_FRAUD_ALERT`: The user has placed a fraud alert on their Plaid Check consumer report due to suspected fraud. Please note that when a fraud alert is in place, the recipient of the consumer report has an obligation to verify the consumer's identity.

Possible values: `IDENTITY_UNAVAILABLE`, `TRANSACTIONS_UNAVAILABLE`, `USER_FRAUD_ALERT`

An error object and associated `item_id` used to identify a specific Item and error when a batch operation operating on multiple Items has encountered an error in one of the Items.

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

The `item_id` of the Item associated with this webhook, warning, or error

Response Object

```
{
  "request_id": "LhQf0THi8SH1yJm",
  "report": {
    "report_id": "028e8404-a013-4a45-ac9e-002482f9cafc",
    "client_report_id": "client_report_id_1221",
    "voa": {
      "generated_time": "2023-03-30T18:27:37Z",
      "days_requested": 90,
      "attributes": {
        "total_inflow_amount": {
          "amount": -345.12,
          "iso_currency_code": "USD",
          "unofficial_currency_code": null
        },
        "total_outflow_amount": {
          "amount": 235.12,
          "iso_currency_code": "USD",
          "unofficial_currency_code": null
        }
      },
      "items": [
        {
          "accounts": [
            {
              "account_id": "eG7pNLjknrFpWvP7Dkbdf3Pq6GVBPKTaQJK5v",
              "balances": {
                "available": 100,
                "current": 110,
                "iso_currency_code": "USD",
                "unofficial_currency_code": null,
                "historical_balances": [
                  {
                    "current": 110,
                    "date": "2023-03-29",
                    "iso_currency_code": "USD",
                    "unofficial_currency_code": null
                  },
                  {
                    "current": 125.55,
                    "date": "2023-03-28",
                    "iso_currency_code": "USD",
                    "unofficial_currency_code": null
                  },
                  {
                    "current": 80.13,
                    "date": "2023-03-27",
                    "iso_currency_code": "USD",
                    "unofficial_currency_code": null
                  },
                  {
                    "current": 246.11,
                    "date": "2023-03-26",
                    "iso_currency_code": "USD",
                    "unofficial_currency_code": null
                  },
                  {
                    "current": 182.71,
                    "date": "2023-03-25",
                    "iso_currency_code": "USD",
                    "unofficial_currency_code": null
                  }
                ],
                "average_balance_30_days": 200,
                "average_balance_60_days": 150,
                "average_balance_90_days": 125,
                "nsf_overdraft_transactions_count": 0
              },
              "consumer_disputes": [],
              "mask": "0000",
              "name": "Plaid Checking",
              "official_name": "Plaid Gold Standard 0% Interest Checking",
              "type": "depository",
              "subtype": "checking",
              "days_available": 90,
              "transactions_insights": {
                "all_transactions": [
                  {
                    "account_id": "eG7pNLjknrFpWvP7Dkbdf3Pq6GVBPKTaQJK5v",
                    "amount": 89.4,
                    "date": "2023-03-27",
                    "iso_currency_code": "USD",
                    "original_description": "SparkFun",
                    "pending": false,
                    "transaction_id": "4zBRq1Qem4uAPnoyKjJNTRQpQddM4ztlo1PLD",
                    "unofficial_currency_code": null
                  },
                  {
                    "account_id": "eG7pNLjknrFpWvP7Dkbdf3Pq6GVBPKTaQJK5v",
                    "amount": 12,
                    "date": "2023-03-28",
                    "iso_currency_code": "USD",
                    "original_description": "McDonalds #3322",
                    "pending": false,
                    "transaction_id": "dkjL41PnbKsPral79jpxhMWdW55gkPfBkWpRL",
                    "unofficial_currency_code": null
                  },
                  {
                    "account_id": "eG7pNLjknrFpWvP7Dkbdf3Pq6GVBPKTaQJK5v",
                    "amount": 4.33,
                    "date": "2023-03-28",
                    "iso_currency_code": "USD",
                    "original_description": "Starbucks",
                    "pending": false,
                    "transaction_id": "a84ZxQaWDAtDL3dRgmazT57K7jjN3WFkNWMDy",
                    "unofficial_currency_code": null
                  },
                  {
                    "account_id": "eG7pNLjknrFpWvP7Dkbdf3Pq6GVBPKTaQJK5v",
                    "amount": -500,
                    "date": "2023-03-29",
                    "iso_currency_code": "USD",
                    "original_description": "United Airlines **** REFUND ****",
                    "pending": false,
                    "transaction_id": "xG9jbv3eMoFWepzB7wQLT3LoLggX5Duy1Gbe5",
                    "unofficial_currency_code": null
                  }
                ],
                "end_date": "2024-07-31",
                "start_date": "2024-07-01"
              },
              "owners": [
                {
                  "addresses": [
                    {
                      "data": {
                        "city": "Malakoff",
                        "country": "US",
                        "region": "NY",
                        "street": "2992 Cameron Road",
                        "postal_code": "14236"
                      },
                      "primary": true
                    },
                    {
                      "data": {
                        "city": "San Matias",
                        "country": "US",
                        "region": "CA",
                        "street": "2493 Leisure Lane",
                        "postal_code": "93405-2255"
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
                      "data": "+1 111-555-3333",
                      "primary": false,
                      "type": "home"
                    },
                    {
                      "data": "+1 111-555-4444",
                      "primary": false,
                      "type": "work"
                    },
                    {
                      "data": "+1 111-555-5555",
                      "primary": false,
                      "type": "mobile"
                    }
                  ]
                }
              ],
              "ownership_type": null
            }
          ],
          "institution_name": "First Platypus Bank",
          "institution_id": "ins_109508",
          "item_id": "AZMP7JrGXgtPd3AQMeg7hwMKgk5E8qU1V5ME7",
          "last_update_time": "2023-03-30T18:25:26Z"
        }
      ]
    },
    "employment_refresh": {
      "generated_time": "2023-03-30T18:27:37Z",
      "days_requested": 60,
      "items": [
        {
          "accounts": [
            {
              "account_id": "1qKRXQjk8xUWDJojNwPXTj8gEmR48piqRNye8",
              "name": "Plaid Money Market",
              "official_name": "Plaid Platinum Standard 1.85% Interest Money Market",
              "type": "depository",
              "subtype": "money market",
              "transactions": [
                {
                  "account_id": "1qKRXQjk8xUWDJojNwPXTj8gEmR48piqRNye8",
                  "original_description": "ACH Electronic CreditGUSTO PAY 123456",
                  "date": "2023-03-30",
                  "pending": false,
                  "transaction_id": "gGQgjoeyqBF89PND6K14Sow1wddZBmtLomJ78"
                }
              ]
            },
            {
              "account_id": "eG7pNLjknrFpWvP7Dkbdf3Pq6GVBPKTaQJK5v",
              "name": "Plaid Checking",
              "official_name": "Plaid Gold Standard 0% Interest Checking",
              "type": "depository",
              "subtype": "checking",
              "transactions": [
                {
                  "account_id": "eG7pNLjknrFpWvP7Dkbdf3Pq6GVBPKTaQJK5v",
                  "original_description": "United Airlines **** REFUND ****",
                  "date": "2023-03-29",
                  "pending": false,
                  "transaction_id": "xG9jbv3eMoFWepzB7wQLT3LoLggX5Duy1Gbe5"
                }
              ]
            }
          ],
          "institution_name": "First Platypus Bank",
          "institution_id": "ins_109508",
          "item_id": "AZMP7JrGXgtPd3AQMeg7hwMKgk5E8qU1V5ME7",
          "last_update_time": "2023-03-30T18:25:26Z"
        }
      ]
    }
  },
  "warnings": []
}
```

=\*=\*=\*=[#### `/cra/check_report/verification/pdf/get`](/docs/api/products/check/#cracheck_reportverificationpdfget)

[#### Retrieve a Consumer Report as a Verification PDF](/docs/api/products/check/#retrieve-a-consumer-report-as-a-verification-pdf)

The [`/cra/check_report/verification/pdf/get`](/docs/api/products/check/#cracheck_reportverificationpdfget) endpoint retrieves the most recent Consumer Report in PDF format, specifically formatted for Home Lending verification use cases. Before calling this endpoint, ensure that you've created a VOA report through Link or the [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate) endpoint, and have received a `CHECK_REPORT_READY` or a `USER_CHECK_REPORT_READY` webhook.

The response to [`/cra/check_report/verification/pdf/get`](/docs/api/products/check/#cracheck_reportverificationpdfget) is the PDF binary data. The `request_id` is returned in the `Plaid-Request-ID` header.

/cra/check\_report/verification/pdf/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

A unique user identifier, created by `/user/create`. Integrations that began using `/user/create` after December 10, 2025 use this field to identify a user instead of the `user_token`. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

Deprecated. Use `reports_requested` instead.

Possible values: `voa`, `employment_refresh`, `income`

Specifies which types of verification reports to include in the returned PDF. Supported combinations are: `[voa]`, `[employment_refresh]`, `[income]`, or `[voa, income]`. Other combinations are not supported.

Min items: `1`

Possible values: `voa`, `employment_refresh`, `income`

The user token associated with the user for which data is being requested. This field is used only by customers with pre-existing integrations that already use the `user_token` field. All other customers should use the `user_id` instead. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

/cra/check\_report/verification/pdf/get

Nodeâ¼

```
try {
  const response = await client.craCheckReportVerificationPdfGet(
    {
      user_id: 'usr_9nSp2KuZ2x4JDw',
      reports_requested: ['voa'],
    },
    {
      responseType: 'arraybuffer',
    },
  );
  const pdf = response.data.toString('base64');
} catch (error) {
  // handle error
}
```

[##### Response](/docs/api/products/check/#response-1)

This endpoint returns binary PDF data. View a sample [Home Lending Report (aka VoA Report)](https://plaid.com/documents/sample-mortgage-verification-voa.pdf) or [Employment Refresh](https://plaid.com/documents/sample-mortgage-verification-voe.pdf) report.

=\*=\*=\*=[#### `/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate)

[#### Refresh or create a Consumer Report](/docs/api/products/check/#refresh-or-create-a-consumer-report)

Use [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate) to refresh data in an existing report. A Consumer Report will last for 24 hours before expiring; you should call any `/get` endpoints on the report before it expires. If a report expires, you can call [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate) again to re-generate it and refresh the data in the report.

/cra/check\_report/create

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

A unique user identifier, created by `/user/create`. Integrations that began using `/user/create` after December 10, 2025 use this field to identify a user instead of the `user_token`. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

The user token associated with the user for which data is being requested. This field is used only by customers with pre-existing integrations that already use the `user_token` field. All other customers should use the `user_id` instead. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

The destination URL to which webhooks will be sent

Format: `url`

The number of days of data to request for the report. Default value is 365; maximum is 731; minimum is 180. If a value lower than 180 is provided, a minimum of 180 days of history will be requested.

Maximum: `731`

The minimum number of days of data required for the report to be successfully generated.

Maximum: `184`

Client-generated identifier, which can be used by lenders to track loan applications.

Specifies a list of products that will be eagerly generated when creating the report (in addition to the Base Report, which is always eagerly generated). These products will be made available before a success webhook is sent. Use this option to minimize response latency for product `/get` endpoints. Note that specifying `cra_partner_insights` in this field will trigger a billable event. Other products are not billed until the respective reports are fetched via product-specific `/get` endpoints.

Min items: `1`

Possible values: `cra_income_insights`, `cra_cashflow_insights`, `cra_partner_insights`, `cra_network_insights`, `cra_lend_score`

Defines configuration options to generate a Base Report

Hide object

Client-generated identifier, which can be used by lenders to track loan applications. This field is deprecated. Use the `client_report_id` field at the top level of the request instead.

Specifies options for creating reports that can be shared with GSEs for mortgage verification.

Hide object

Specifies which types of reports should be made available to GSEs.

Possible values: `VOA`, `EMPLOYMENT_REFRESH`

Indicates that the report must include identity information. If identity information is not available, the report will fail.

Defines configuration options to generate Cashflow Insights

Hide object

The version of cashflow attributes. Required if using Cash Flow Insights.

Possible values: `CFI1`

Defines configuration to generate Partner Insights.

Hide object

The versions of Prism products to evaluate

Hide object

The version of Prism FirstDetect. If not specified, will default to v3.

Possible values: `3`, `null`

The version of Prism Detect

Possible values: `4.1`, `4`, `null`

The version of Prism CashScore. If not specified, will default to v3.

Possible values: `4.1`, `4`, `3`, `null`

The version of Prism Extend

Possible values: `4.1`, `4`, `null`

The version of Prism Insights. If not specified, will default to v3.

Possible values: `4.1`, `4`, `3`, `null`

Configuration for the FICO products used in the Partner Insights product.

Hide object

ID provided by FICO that uniquely identifies the lender. Required for UltraFICOÂ® score generation. Sometimes referred to as Lender Org ID.

Client-generated identifier that uniquely identifies the FICO Application across FICO systems.

A list of UltraFICOÂ® scoring requests. Each request contains all configuration required to generate an UltraFICO score.

Hide object

The version of the UltraFICOÂ® score.

Possible values: `1.0`

Client-generated identifier that can be used to correlate scoring requests with their scoring results.

Details about the base FICO score associated with an UltraFICOÂ® scoring request.

Hide object

The credit bureau that provided the base FICO score.

Possible values: `EQUIFAX`, `EXPERIAN`, `TRANSUNION`

Numeric value of the base FICO score.

Reason codes associated with the score, in priority order. May contain up to 4 items.

Max items: `4`

Whether inquiries adversely affected the score but were not represented in one of the four reason codes. Sometimes referred to as the FACTA Flag.

The version of the base FICO score model.

Possible values: `8`, `9`, `10`, `10T`

Defines configuration options to generate the LendScore

Hide object

The version of the LendScore to use. Required if using LendScore.

Possible values: `LS1`

Defines configuration options to generate Network Insights

Hide object

The version of Network Insights. Required if using Network Insights.

Possible values: `NI1`

Indicates that investment data should be extracted from the linked account(s).

Defines configuration options to generate Income Insights.

Hide object

Filters the returned income streams based on the specified income categories. If no filters are requested, streams from the following default set of categories are returned:

- `EARNED_INCOME.*` (`EARNED_INCOME.SALARY`, `EARNED_INCOME.GIG_ECONOMY`, `EARNED_INCOME.SELF_EMPLOYED`)
- `BENEFITS.DISABILITY`
- `RETIREMENT.*` (`RETIREMENT.GOVERNMENT_DERIVED`, `RETIREMENT.PRIVATE_RETIREMENT`, `RETIREMENT.PLAN_DISTRIBUTION`)

The final list of income categories is generated by adding the `included_categories`, then removing the `excluded_categories`. Priority is given to `excluded_categories` in the case of collisions.

Filter patterns supported:

- `*`: All categories
- `PRIMARY.*`: All categories within the specified primary category
- `PRIMARY.SECONDARY`: A specific income category

For a list of income categories, see the [Income V2 Category Taxonomy](https://plaid.com/documents/income-v2-category-taxonomy.csv).

Hide object

Includes income streams matching the specified categories.

Excludes income streams matching the specified categories.

The version of Income Insights to use.

Possible values: `II2`

Describes the reason you are generating a Consumer Report for this user. When calling `/link/token/create`, this field is required when using Plaid Check (CRA) products; invalid if not using Plaid Check (CRA) products.

`ACCOUNT_REVIEW_CREDIT`: In connection with a consumer credit transaction for the review or collection of an account pursuant to FCRA Section 604(a)(3)(A).

`ACCOUNT_REVIEW_NON_CREDIT`: For a legitimate business need of the information to review a non-credit account provided primarily for personal, family, or household purposes to determine whether the consumer continues to meet the terms of the account pursuant to FCRA Section 604(a)(3)(F)(2).

`EXTENSION_OF_CREDIT`: In connection with a credit transaction initiated by and involving the consumer pursuant to FCRA Section 604(a)(3)(A).

`LEGITIMATE_BUSINESS_NEED_TENANT_SCREENING`: For a legitimate business need in connection with a business transaction initiated by the consumer primarily for personal, family, or household purposes in connection with a property rental assessment pursuant to FCRA Section 604(a)(3)(F)(i).

`LEGITIMATE_BUSINESS_NEED_OTHER`: For a legitimate business need in connection with a business transaction made primarily for personal, family, or household initiated by the consumer pursuant to FCRA Section 604(a)(3)(F)(i).

`WRITTEN_INSTRUCTION_PREQUALIFICATION`: In accordance with the written instructions of the consumer pursuant to FCRA Section 604(a)(2), to evaluate an application's profile to make an offer to the consumer.

`WRITTEN_INSTRUCTION_OTHER`: In accordance with the written instructions of the consumer pursuant to FCRA Section 604(a)(2), such as when an individual agrees to act as a guarantor or assumes personal liability for a consumer, business, or commercial loan.

`ELIGIBILITY_FOR_GOVT_BENEFITS`: In connection with an eligibility determination for a government benefit where the entity is required to consider an applicant's financial status pursuant to FCRA Section 604(a)(3)(D).

Possible values: `ACCOUNT_REVIEW_CREDIT`, `ACCOUNT_REVIEW_NON_CREDIT`, `EXTENSION_OF_CREDIT`, `LEGITIMATE_BUSINESS_NEED_TENANT_SCREENING`, `LEGITIMATE_BUSINESS_NEED_OTHER`, `WRITTEN_INSTRUCTION_PREQUALIFICATION`, `WRITTEN_INSTRUCTION_OTHER`, `ELIGIBILITY_FOR_GOVT_BENEFITS`

/cra/check\_report/create

Nodeâ¼

```
try {
  const response = await client.craCheckReportCreate({
    user_id: 'usr_9nSp2KuZ2x4JDw',
    webhook: 'https://sample-web-hook.com',
    days_requested: 365,
    consumer_report_permissible_purpose: 'LEGITIMATE_BUSINESS_NEED_OTHER',
  });
} catch (error) {
  // handle error
}
```

/cra/check\_report/create

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "LhQf0THi8SH1yJm"
}
```

=\*=\*=\*=[#### `/cra/monitoring_insights/get`](/docs/api/products/check/#cramonitoring_insightsget)

[#### Retrieve a Monitoring Insights Report](/docs/api/products/check/#retrieve-a-monitoring-insights-report)

This endpoint allows you to retrieve a Cash Flow Updates report by passing in the `user_id` referred to in the webhook you received.

/cra/monitoring\_insights/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

A unique user identifier, created by `/user/create`. Integrations that began using `/user/create` after December 10, 2025 use this field to identify a user instead of the `user_token`. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

Describes the reason you are generating a Consumer Report for this user.

`ACCOUNT_REVIEW_CREDIT`: In connection with a consumer credit transaction for the review or collection of an account pursuant to FCRA Section 604(a)(3)(A).

`WRITTEN_INSTRUCTION_OTHER`: In accordance with the written instructions of the consumer pursuant to FCRA Section 604(a)(2), such as when an individual agrees to act as a guarantor or assumes personal liability for a consumer, business, or commercial loan.

Possible values: `ACCOUNT_REVIEW_CREDIT`, `WRITTEN_INSTRUCTION_OTHER`

The user token associated with the user for which data is being requested. This field is used only by customers with pre-existing integrations that already use the `user_token` field. All other customers should use the `user_id` instead. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

/cra/monitoring\_insights/get

Nodeâ¼

```
try {
  const response = await client.craMonitoringInsightsGet({
    user_id: 'usr_9nSp2KuZ2x4JDw',
    consumer_report_permissible_purpose: 'ACCOUNT_REVIEW_CREDIT',
  });
} catch (error) {
  // handle error
}
```

/cra/monitoring\_insights/get

**Response fields**

Collapse all

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

A unique ID identifying a User Monitoring Insights Report. Like all Plaid identifiers, this ID is case sensitive.

An array of Monitoring Insights Items associated with the user.

Hide object

The date and time when the specific insights were generated (per-item), in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (e.g. "2018-04-12T03:32:11Z").

Format: `date-time`

The `item_id` of the Item associated with the insights

The id of the financial institution associated with the Item.

The full financial institution name associated with the Item.

An object with details of the Monitoring Insights Item's status.

Hide object

Enum for the status of the Item's insights

Possible values: `AVAILABLE`, `FAILED`, `PENDING`

A reason for why a Monitoring Insights Report is not available.
This field will only be populated when the `status_code` is not `AVAILABLE`

An object representing the Monitoring Insights for the given Item

Hide object

An object representing the income subcategory of the report

Hide object

Details about the total monthly income

Hide object

The aggregated income of the last 30 days

Details about the number of income sources

Hide object

The number of income sources currently detected

An object representing the predicted average monthly net income amount. This amount reflects the funds deposited into the account and may not include any withheld income such as taxes or other payroll deductions

Hide object

The current forecasted monthly income

An object representing the historical annual income amount.

Hide object

The current historical annual income

The income sources for this Item. Each entry in the array is a single income source

Hide object

A unique identifier for an income source

The most common name or original description for the underlying income transactions

The income category.
`BANK_INTEREST`: Interest earned from a bank account.
`BENEFIT_OTHER`: Government benefits other than retirement, unemployment, child support, or disability. Currently used only in the UK, to represent benefits such as Cost of Living Payments.
`CASH`: Deprecated and used only for existing legacy implementations. Has been replaced by `CASH_DEPOSIT` and `TRANSFER_FROM_APPLICATION`.
`CASH_DEPOSIT`: A cash or check deposit.
`CHILD_SUPPORT`: Child support payments received.
`GIG_ECONOMY`: Income earned as a gig economy worker, e.g. driving for Uber, Lyft, Postmates, DoorDash, etc.
`LONG_TERM_DISABILITY`: Disability payments, including Social Security disability benefits.
`OTHER`: Income that could not be categorized as any other income category.
`MILITARY`: Veterans benefits. Income earned as salary for serving in the military (e.g. through DFAS) will be classified as `SALARY` rather than `MILITARY`.
`RENTAL`: Income earned from a rental property. Income may be identified as rental when the payment is received through a rental platform, e.g. Airbnb; rent paid directly by the tenant to the property owner (e.g. via cash, check, or ACH) will typically not be classified as rental income.
`RETIREMENT`: Payments from private retirement systems, pensions, and government retirement programs, including Social Security retirement benefits.
`SALARY`: Payment from an employer to an earner or other form of permanent employment.
`TAX_REFUND`: A tax refund.
`TRANSFER_FROM_APPLICATION`: Deposits from a money transfer app, such as Venmo, Cash App, or Zelle.
`UNEMPLOYMENT`: Unemployment benefits. In the UK, includes certain low-income benefits such as the Universal Credit.

Possible values: `SALARY`, `UNEMPLOYMENT`, `CASH`, `GIG_ECONOMY`, `RENTAL`, `CHILD_SUPPORT`, `MILITARY`, `RETIREMENT`, `LONG_TERM_DISABILITY`, `BANK_INTEREST`, `CASH_DEPOSIT`, `TRANSFER_FROM_APPLICATION`, `TAX_REFUND`, `BENEFIT_OTHER`, `OTHER`

The last detected transaction date for this income source

Format: `date`

An object representing the loan exposure subcategory of the report

Hide object

Details regarding the number of loan payments

Hide object

The current number of loan payments made in the last 30 days

The number of loan disbursements detected in the last 30 days

Details regarding the number of unique loan payment merchants

Hide object

The current number of unique loan payment merchants detected in the last 30 days

Data about each of the accounts open on the Item.

Hide object

Plaid's unique identifier for the account. This value will not change unless Plaid can't reconcile the account with the data returned by the financial institution. This may occur, for example, when the name of the account changes. If this happens a new `account_id` will be assigned to the account.

If an account with a specific `account_id` disappears instead of changing, the account is likely closed. Closed accounts are not returned by the Plaid API.

Like all Plaid identifiers, the `account_id` is case sensitive.

Information about an account's balances.

Hide object

The amount of funds available to be withdrawn from the account, as determined by the financial institution.

For `credit`-type accounts, the `available` balance typically equals the `limit` less the `current` balance, less any pending outflows plus any pending inflows.

For `depository`-type accounts, the `available` balance typically equals the `current` balance less any pending outflows plus any pending inflows. For `depository`-type accounts, the `available` balance does not include the overdraft limit.

For `investment`-type accounts (or `brokerage`-type accounts for API versions 2018-05-22 and earlier), the `available` balance is the total cash available to withdraw as presented by the institution.

Note that not all institutions calculate the `available` balance. In the event that `available` balance is unavailable, Plaid will return an `available` balance value of `null`.

Available balance may be cached and is not guaranteed to be up-to-date in real-time unless the value was returned by `/accounts/balance/get`.

If `current` is `null` this field is guaranteed not to be `null`.

Format: `double`

The total amount of funds in or owed by the account.

For `credit`-type accounts, a positive balance indicates the amount owed; a negative amount indicates the lender owing the account holder.

For `loan`-type accounts, the current balance is the principal remaining on the loan, except in the case of student loan accounts at Sallie Mae (`ins_116944`). For Sallie Mae student loans, the account's balance includes both principal and any outstanding interest.

For `investment`-type accounts (or `brokerage`-type accounts for API versions 2018-05-22 and earlier), the current balance is the total value of assets as presented by the institution.

Note that balance information may be cached unless the value was returned by `/accounts/balance/get`; if the Item is enabled for Transactions, the balance will be at least as recent as the most recent Transaction update. If you require real-time balance information, use the `available` balance as provided by `/accounts/balance/get`.

When returned by `/accounts/balance/get`, this field may be `null`. When this happens, `available` is guaranteed not to be `null`.

Format: `double`

For `credit`-type accounts, this represents the credit limit.

For `depository`-type accounts, this represents the pre-arranged overdraft limit, which is common for current (checking) accounts in Europe.

In North America, this field is typically only available for `credit`-type accounts.

Format: `double`

The ISO-4217 currency code of the balance. Always null if `unofficial_currency_code` is non-null.

The unofficial currency code associated with the balance. Always null if `iso_currency_code` is non-null. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format (`YYYY-MM-DDTHH:mm:ssZ`) indicating the oldest acceptable balance when making a request to `/accounts/balance/get`.

This field is only used and expected when the institution is `ins_128026` (Capital One) and the Item contains one or more accounts with a non-depository account type, in which case a value must be provided or an `INVALID_REQUEST` error with the code of `INVALID_FIELD` will be returned. For Capital One depository accounts as well as all other account types on all other institutions, this field is ignored. See [account type schema](https://plaid.com/docs/api/accounts/#account-type-schema) for a full list of account types.

If the balance that is pulled is older than the given timestamp for Items with this field required, an `INVALID_REQUEST` error with the code of `LAST_UPDATED_DATETIME_OUT_OF_RANGE` will be returned with the most recent timestamp for the requested account contained in the response.

Format: `date-time`

The average historical balance for the entire report

Format: `double`

The average historical balance of each calendar month

Hide object

The start date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

The end date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

This contains an amount, denominated in the currency specified by either `iso_currency_code` or `unofficial_currency_code`

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

The average historical balance from the most recent 30 days

Format: `double`

The information about previously submitted valid dispute statements by the consumer

Hide object

(Deprecated) A unique identifier (UUID) of the consumer dispute that can be used for troubleshooting

Date of the disputed field (e.g. transaction date), in an ISO 8601 format (YYYY-MM-DD)

Format: `date`

Type of data being disputed by the consumer

Possible values: `TRANSACTION`, `BALANCE`, `IDENTITY`, `OTHER`

Text content of dispute

The last 2-4 alphanumeric characters of an account's official account number. Note that the mask may be non-unique between an Item's accounts, and it may also not match the mask that the bank displays to the user.

Metadata about the extracted account.

Hide object

The beginning of the range of the financial institution provided data for the account, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ("yyyy-mm-dd").

Format: `date`

The end of the range of the financial institution provided data for the account, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ("yyyy-mm-dd").

Format: `date`

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

The duration of transaction history available within this report for this Item, typically defined as the time since the date of the earliest transaction in that account.

Transaction history associated with the account. Transaction history returned by endpoints such as `/transactions/get` or `/investments/transactions/get` will be returned in the top-level `transactions` field instead. Some transactions may have their details masked in accordance to the FCRA. These will appear with a `credit_category` of `MASKED_TRANSACTION_CATEGORY`.

Hide object

The ID of the account in which this transaction occurred.

The settled value of the transaction, denominated in the transaction's currency, as stated in `iso_currency_code` or `unofficial_currency_code`. Positive values when money moves out of the account; negative values when money moves in. For example, debit card purchases are positive; credit card payments, direct deposits, and refunds are negative.

Format: `double`

The ISO-4217 currency code of the transaction. Always `null` if `unofficial_currency_code` is non-null.

The unofficial currency code associated with the transaction. Always `null` if `iso_currency_code` is non-`null`. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The string returned by the financial institution to describe the transaction.

Information describing the intent of the transaction. Most relevant for credit use cases, but not limited to such use cases.

See the [`taxonomy csv file`](https://plaid.com/documents/credit-category-taxonomy.csv) for a full list of credit categories.

Hide object

A high level category that communicates the broad category of the transaction.

A granular category conveying the transaction's intent. This field can also be used as a unique identifier for the category.

The check number of the transaction. This field is only populated for check transactions.

For pending transactions, the date that the transaction occurred; for posted transactions, the date that the transaction posted. Both dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ( `YYYY-MM-DD` ).

Format: `date`

The date on which the transaction took place, in IS0 8601 format.

A representation of where a transaction took place. Location data is provided only for transactions at physical locations, not for online transactions. Location data availability depends primarily on the merchant and is most likely to be populated for transactions at large retail chains; small, local businesses are less likely to have location data available.

Hide object

The street address where the transaction occurred.

The city where the transaction occurred.

The region or state where the transaction occurred. In API versions 2018-05-22 and earlier, this field is called `state`.

The postal code where the transaction occurred. In API versions 2018-05-22 and earlier, this field is called `zip`.

The ISO 3166-1 alpha-2 country code where the transaction occurred.

The latitude where the transaction occurred.

Format: `double`

The longitude where the transaction occurred.

Format: `double`

The merchant defined store number where the transaction occurred.

The merchant name, as enriched by Plaid from the `name` field. This is typically a more human-readable version of the merchant counterparty in the transaction. For some bank transactions (such as checks or account transfers) where there is no meaningful merchant name, this value will be `null`.

When `true`, identifies the transaction as pending or unsettled. Pending transaction details (name, type, amount, category ID) may change before they are settled.

The name of the account owner. This field is not typically populated and only relevant when dealing with sub-accounts.

The unique ID of the transaction. Like all Plaid identifiers, the `transaction_id` is case sensitive.

Data returned by the financial institution about the account owner or owners. For business accounts, the name reported may be either the name of the individual or the name of the business, depending on the institution. Multiple owners on a single account will be represented in the same `owner` object, not in multiple owner objects within the array. This array can also be empty if no owners are found.

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

How an asset is owned.

`association`: Ownership by a corporation, partnership, or unincorporated association, including for-profit and not-for-profit organizations.
`individual`: Ownership by an individual.
`joint`: Joint ownership by multiple parties.
`trust`: Ownership by a revocable or irrevocable trust.

Possible values: `null`, `individual`, `joint`, `association`, `trust`

Calculated insights derived from transaction-level data. This field has been deprecated in favor of [Base Report attributes aggregated across accounts](https://plaid.com/docs/api/products/check/#cra-check_report-base_report-get-response-report-attributes) and will be removed in a future release.

Hide object

Date of the earliest transaction for the account.

Format: `date`

Date of the most recent transaction for the account.

Format: `date`

Number of days available for the account.

Average number of days between sequential transactions

Longest gap between sequential transactions in a time period. This array can include multiple time periods.

Hide object

The start date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The end date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

Largest number of days between sequential transactions for this time period.

The number of debits into the account. This array will be empty for non-depository accounts.

Hide object

The start date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The end date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The number of credits or debits out of the account for this time period.

Average amount of debit transactions into the account in a time period. This array will be empty for non-depository accounts. This field only takes into account USD transactions from the account.

Hide object

The start date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The end date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

This contains an amount, denominated in the currency specified by either `iso_currency_code` or `unofficial_currency_code`

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

The number of outflows from the account. This array will be empty for non-depository accounts.

Hide object

The start date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The end date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The number of credits or debits out of the account for this time period.

Average amount of transactions out of the account in a time period. This array will be empty for non-depository accounts. This field only takes into account USD transactions from the account.

Hide object

The start date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The end date of this time period.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

This contains an amount, denominated in the currency specified by either `iso_currency_code` or `unofficial_currency_code`

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Number of days with no transactions

Calculated attributes derived from transaction-level data.

Hide object

Prediction indicator of whether the account is a primary account. Only one account per account type across the items connected will have a value of true.

Value ranging from 0-1. The higher the score, the more confident we are of the account being the primary account.

The number of net NSF fee transactions for a given account within the report time range (not counting any fees that were reversed within the time range).

The number of net NSF fee transactions within the last 30 days for a given account (not counting any fees that were reversed within the time range).

The number of net NSF fee transactions within the last 60 days for a given account (not counting any fees that were reversed within the time range).

The number of net NSF fee transactions within the last 90 days for a given account (not counting any fees that were reversed within the time range).

Total amount of debit transactions into the account in the time period of the report. This field will be empty for non-depository accounts. This field only takes into account USD transactions from the account.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Total amount of debit transactions into the account in the last 30 days. This field will be empty for non-depository accounts. This field only takes into account USD transactions from the account.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Total amount of debit transactions into the account in the last 60 days. This field will be empty for non-depository accounts. This field only takes into account USD transactions from the account.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Total amount of debit transactions into the account in the last 90 days. This field will be empty for non-depository accounts. This field only takes into account USD transactions from the account.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Total amount of credit transactions into the account in the time period of the report. This field will be empty for non-depository accounts. This field only takes into account USD transactions from the account.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Total amount of credit transactions into the account in the last 30 days. This field will be empty for non-depository accounts. This field only takes into account USD transactions from the account.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Total amount of credit transactions into the account in the last 60 days. This field will be empty for non-depository accounts. This field only takes into account USD transactions from the account.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Total amount of credit transactions into the account in the last 90 days. This field will be empty for non-depository accounts. This field only takes into account USD transactions from the account.

Hide object

Value of amount with up to 2 decimal places.

The ISO 4217 currency code of the amount or balance.

The unofficial currency code associated with the amount or balance. Always `null` if `iso_currency_code` is non-null.
Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Response Object

```
{
  "user_insights_id": "028e8404-a013-4a45-ac9e-002482f9cafc",
  "items": [
    {
      "date_generated": "2023-03-30T18:27:37Z",
      "item_id": "AZMP7JrGXgtPd3AQMeg7hwMKgk5E8qU1V5ME7",
      "institution_id": "ins_0",
      "institution_name": "Plaid Bank",
      "status": {
        "status_code": "AVAILABLE"
      },
      "insights": {
        "income": {
          "income_sources": [
            {
              "income_source_id": "f17efbdd-caab-4278-8ece-963511cd3d51",
              "income_description": "PLAID_INC_DIRECT_DEP_PPD",
              "income_category": "SALARY",
              "last_transaction_date": "2023-03-30"
            }
          ],
          "forecasted_monthly_income": {
            "current_amount": 12000
          },
          "total_monthly_income": {
            "current_amount": 20000.31
          },
          "historical_annual_income": {
            "current_amount": 144000
          },
          "income_sources_counts": {
            "current_count": 1
          }
        },
        "loans": {
          "loan_payments_counts": {
            "current_count": 1
          },
          "loan_payment_merchants_counts": {
            "current_count": 1
          },
          "loan_disbursements_count": 1
        }
      },
      "accounts": [
        {
          "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
          "attributes": {
            "total_inflow_amount": {
              "amount": -2500,
              "iso_currency_code": "USD",
              "unofficial_currency_code": null
            },
            "total_inflow_amount_30d": {
              "amount": -1000,
              "iso_currency_code": "USD",
              "unofficial_currency_code": null
            },
            "total_inflow_amount_60d": {
              "amount": -2500,
              "iso_currency_code": "USD",
              "unofficial_currency_code": null
            },
            "total_inflow_amount_90d": {
              "amount": -2500,
              "iso_currency_code": "USD",
              "unofficial_currency_code": null
            },
            "total_outflow_amount": {
              "amount": 2500,
              "iso_currency_code": "USD",
              "unofficial_currency_code": null
            },
            "total_outflow_amount_30d": {
              "amount": 1000,
              "iso_currency_code": "USD",
              "unofficial_currency_code": null
            },
            "total_outflow_amount_60d": {
              "amount": 2500,
              "iso_currency_code": "USD",
              "unofficial_currency_code": null
            },
            "total_outflow_amount_90d": {
              "amount": 2500,
              "iso_currency_code": "USD",
              "unofficial_currency_code": null
            }
          },
          "balances": {
            "available": 5000,
            "average_balance": 4956.12,
            "average_monthly_balances": [
              {
                "average_balance": {
                  "amount": 4956.12,
                  "iso_currency_code": "USD",
                  "unofficial_currency_code": null
                },
                "end_date": "2024-07-31",
                "start_date": "2024-07-01"
              }
            ],
            "current": 5000,
            "iso_currency_code": "USD",
            "limit": null,
            "most_recent_thirty_day_average_balance": 4956.125,
            "unofficial_currency_code": null
          },
          "consumer_disputes": [],
          "days_available": 365,
          "mask": "1208",
          "metadata": {
            "start_date": "2024-01-01",
            "end_date": "2024-07-16"
          },
          "name": "Checking",
          "official_name": "Plaid checking",
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
                  "data": "+1 111-555-3333",
                  "primary": false,
                  "type": "home"
                },
                {
                  "data": "+1 111-555-4444",
                  "primary": false,
                  "type": "work"
                },
                {
                  "data": "+1 111-555-5555",
                  "primary": false,
                  "type": "mobile"
                }
              ]
            }
          ],
          "ownership_type": null,
          "subtype": "checking",
          "transactions": [
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 37.07,
              "check_number": null,
              "credit_category": {
                "detailed": "GENERAL_MERCHANDISE_ONLINE_MARKETPLACES",
                "primary": "GENERAL_MERCHANDISE"
              },
              "date": "2024-07-12",
              "date_posted": "2024-07-12T00:00:00Z",
              "date_transacted": "2024-07-12",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": null,
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": null,
                "state": null,
                "store_number": null,
                "zip": null
              },
              "merchant_name": "Amazon",
              "original_description": "AMZN Mktp US*11111111 Amzn.com/bill WA AM",
              "pending": false,
              "transaction_id": "XA7ZLy8rXzt7D3j9B6LMIgv5VxyQkAhbKjzmp",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 51.61,
              "check_number": null,
              "credit_category": {
                "detailed": "DINING_DINING",
                "primary": "DINING"
              },
              "date": "2024-07-12",
              "date_posted": "2024-07-12T00:00:00Z",
              "date_transacted": "2024-07-12",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": null,
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": null,
                "state": null,
                "store_number": null,
                "zip": null
              },
              "merchant_name": "Domino's",
              "original_description": "DOMINO's XXXX 111-222-3333",
              "pending": false,
              "transaction_id": "VEPeMbWqRluPVZLQX4MDUkKRw41Ljzf9gyLBW",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 7.55,
              "check_number": null,
              "credit_category": {
                "detailed": "GENERAL_MERCHANDISE_FURNITURE_AND_HARDWARE",
                "primary": "GENERAL_MERCHANDISE"
              },
              "date": "2024-07-12",
              "date_posted": "2024-07-12T00:00:00Z",
              "date_transacted": "2024-07-12",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": "Chicago",
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": null,
                "state": null,
                "store_number": null,
                "zip": null
              },
              "merchant_name": "IKEA",
              "original_description": "IKEA CHICAGO",
              "pending": false,
              "transaction_id": "6GQZARgvroCAE1eW5wpQT7w3oB6nvzi8DKMBa",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 12.87,
              "check_number": null,
              "credit_category": {
                "detailed": "GENERAL_MERCHANDISE_SPORTING_GOODS",
                "primary": "GENERAL_MERCHANDISE"
              },
              "date": "2024-07-12",
              "date_posted": "2024-07-12T00:00:00Z",
              "date_transacted": "2024-07-12",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": "Redlands",
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": "CA",
                "state": "CA",
                "store_number": null,
                "zip": null
              },
              "merchant_name": "Nike",
              "original_description": "NIKE REDLANDS CA",
              "pending": false,
              "transaction_id": "DkbmlP8BZxibzADqNplKTeL8aZJVQ1c3WR95z",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 44.21,
              "check_number": null,
              "credit_category": {
                "detailed": "DINING_DINING",
                "primary": "DINING"
              },
              "date": "2024-07-12",
              "date_posted": "2024-07-12T00:00:00Z",
              "date_transacted": "2024-07-12",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": null,
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": null,
                "state": null,
                "store_number": null,
                "zip": null
              },
              "merchant_name": null,
              "original_description": "POKE BROS * POKE BRO IL",
              "pending": false,
              "transaction_id": "RpdN7W8GmRSdjZB9Jm7ATj4M86vdnktapkrgL",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 36.82,
              "check_number": null,
              "credit_category": {
                "detailed": "GENERAL_MERCHANDISE_DISCOUNT_STORES",
                "primary": "GENERAL_MERCHANDISE"
              },
              "date": "2024-07-13",
              "date_posted": "2024-07-13T00:00:00Z",
              "date_transacted": "2024-07-13",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": null,
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": null,
                "state": null,
                "store_number": null,
                "zip": null
              },
              "merchant_name": "Family Dollar",
              "original_description": "FAMILY DOLLAR",
              "pending": false,
              "transaction_id": "5AeQWvo5KLtAD9wNL68PTdAgPE7VNWf5Kye1G",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 13.27,
              "check_number": null,
              "credit_category": {
                "detailed": "FOOD_RETAIL_GROCERIES",
                "primary": "FOOD_RETAIL"
              },
              "date": "2024-07-13",
              "date_posted": "2024-07-13T00:00:00Z",
              "date_transacted": "2024-07-13",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": null,
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": null,
                "state": null,
                "store_number": null,
                "zip": null
              },
              "merchant_name": "Instacart",
              "original_description": "INSTACART HTTPSINSTACAR CA",
              "pending": false,
              "transaction_id": "Jjlr3MEVg1HlKbdkZj39ij5a7eg9MqtB6MWDo",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 36.03,
              "check_number": null,
              "credit_category": {
                "detailed": "DINING_DINING",
                "primary": "DINING"
              },
              "date": "2024-07-13",
              "date_posted": "2024-07-13T00:00:00Z",
              "date_transacted": "2024-07-13",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": null,
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": null,
                "state": null,
                "store_number": null,
                "zip": null
              },
              "merchant_name": null,
              "original_description": "POKE BROS * POKE BRO IL",
              "pending": false,
              "transaction_id": "kN9KV7yAZJUMPn93KDXqsG9MrpjlyLUL6Dgl8",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 54.74,
              "check_number": null,
              "credit_category": {
                "detailed": "FOOD_RETAIL_GROCERIES",
                "primary": "FOOD_RETAIL"
              },
              "date": "2024-07-13",
              "date_posted": "2024-07-13T00:00:00Z",
              "date_transacted": "2024-07-13",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": "Whittier",
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": "CA",
                "state": "CA",
                "store_number": null,
                "zip": null
              },
              "merchant_name": "Smart & Final",
              "original_description": "POS SMART AND FINAL 111 WHITTIER CA",
              "pending": false,
              "transaction_id": "lPvrweZAMqHDar43vwWKs547kLZVEzfpogGVJ",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 37.5,
              "check_number": null,
              "credit_category": {
                "detailed": "DINING_DINING",
                "primary": "DINING"
              },
              "date": "2024-07-13",
              "date_posted": "2024-07-13T00:00:00Z",
              "date_transacted": "2024-07-13",
              "iso_currency_code": "USD",
              "location": {
                "address": "1627 N 24th St",
                "city": "Phoenix",
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": "85008",
                "region": "AZ",
                "state": "AZ",
                "store_number": null,
                "zip": "85008"
              },
              "merchant_name": "Taqueria El Guerrerense",
              "original_description": "TAQUERIA EL GUERRERO PHOENIX AZ",
              "pending": false,
              "transaction_id": "wka74WKqngiyJ3pj7dl5SbpLGQBZqyCPZRDbP",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 41.42,
              "check_number": null,
              "credit_category": {
                "detailed": "GENERAL_MERCHANDISE_ONLINE_MARKETPLACES",
                "primary": "GENERAL_MERCHANDISE"
              },
              "date": "2024-07-14",
              "date_posted": "2024-07-14T00:00:00Z",
              "date_transacted": "2024-07-14",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": null,
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": null,
                "state": null,
                "store_number": null,
                "zip": null
              },
              "merchant_name": "Amazon",
              "original_description": "AMZN Mktp US*11111111 Amzn.com/bill WA AM",
              "pending": false,
              "transaction_id": "BBGnV4RkerHjn8WVavGyiJbQ95VNDaC4M56bJ",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": -1077.93,
              "check_number": null,
              "credit_category": {
                "detailed": "INCOME_OTHER",
                "primary": "INCOME"
              },
              "date": "2024-07-14",
              "date_posted": "2024-07-14T00:00:00Z",
              "date_transacted": "2024-07-14",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": null,
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": null,
                "state": null,
                "store_number": null,
                "zip": null
              },
              "merchant_name": "Lyft",
              "original_description": "LYFT TRANSFER",
              "pending": false,
              "transaction_id": "3Ej78yKJlQu1Abw7xzo4U4JR6pmwzntZlbKDK",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 47.17,
              "check_number": null,
              "credit_category": {
                "detailed": "FOOD_RETAIL_GROCERIES",
                "primary": "FOOD_RETAIL"
              },
              "date": "2024-07-14",
              "date_posted": "2024-07-14T00:00:00Z",
              "date_transacted": "2024-07-14",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": "Whittier",
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": "CA",
                "state": "CA",
                "store_number": null,
                "zip": null
              },
              "merchant_name": "Smart & Final",
              "original_description": "POS SMART AND FINAL 111 WHITTIER CA",
              "pending": false,
              "transaction_id": "rMzaBpJw8jSZRJQBabKdteQBwd5EaWc7J9qem",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 12.37,
              "check_number": null,
              "credit_category": {
                "detailed": "FOOD_RETAIL_GROCERIES",
                "primary": "FOOD_RETAIL"
              },
              "date": "2024-07-14",
              "date_posted": "2024-07-14T00:00:00Z",
              "date_transacted": "2024-07-14",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": "Whittier",
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": "CA",
                "state": "CA",
                "store_number": null,
                "zip": null
              },
              "merchant_name": "Smart & Final",
              "original_description": "POS SMART AND FINAL 111 WHITTIER CA",
              "pending": false,
              "transaction_id": "zWPZjkmzynTyel89ZjExS59DV6WAaZflNBJ56",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 44.18,
              "check_number": null,
              "credit_category": {
                "detailed": "FOOD_RETAIL_GROCERIES",
                "primary": "FOOD_RETAIL"
              },
              "date": "2024-07-14",
              "date_posted": "2024-07-14T00:00:00Z",
              "date_transacted": "2024-07-14",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": "Portland",
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": "OR",
                "state": "OR",
                "store_number": "1111",
                "zip": null
              },
              "merchant_name": "Safeway",
              "original_description": "SAFEWAY #1111 PORTLAND OR            111111",
              "pending": false,
              "transaction_id": "K7qzx1nP8ptqgwaRMbxyI86XrqADMluRpkWx5",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 45.37,
              "check_number": null,
              "credit_category": {
                "detailed": "DINING_DINING",
                "primary": "DINING"
              },
              "date": "2024-07-14",
              "date_posted": "2024-07-14T00:00:00Z",
              "date_transacted": "2024-07-14",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": null,
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": null,
                "state": null,
                "store_number": null,
                "zip": null
              },
              "merchant_name": "Uber Eats",
              "original_description": "UBER EATS",
              "pending": false,
              "transaction_id": "qZrdzLRAgNHo5peMdD9xIzELl3a1NvcgrPAzL",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 15.22,
              "check_number": null,
              "credit_category": {
                "detailed": "GENERAL_MERCHANDISE_ONLINE_MARKETPLACES",
                "primary": "GENERAL_MERCHANDISE"
              },
              "date": "2024-07-15",
              "date_posted": "2024-07-15T00:00:00Z",
              "date_transacted": "2024-07-15",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": null,
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": null,
                "state": null,
                "store_number": null,
                "zip": null
              },
              "merchant_name": "Amazon",
              "original_description": "AMZN Mktp US*11111111 Amzn.com/bill WA AM",
              "pending": false,
              "transaction_id": "NZzx4oRPkAHzyRekpG4PTZkWnBPqEyiy6pB1M",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 26.33,
              "check_number": null,
              "credit_category": {
                "detailed": "DINING_DINING",
                "primary": "DINING"
              },
              "date": "2024-07-15",
              "date_posted": "2024-07-15T00:00:00Z",
              "date_transacted": "2024-07-15",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": null,
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": null,
                "state": null,
                "store_number": null,
                "zip": null
              },
              "merchant_name": "Domino's",
              "original_description": "DOMINO's XXXX 111-222-3333",
              "pending": false,
              "transaction_id": "x84eNArKbESz8Woden6LT3nvyogeJXc64Pp35",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 39.8,
              "check_number": null,
              "credit_category": {
                "detailed": "GENERAL_MERCHANDISE_DISCOUNT_STORES",
                "primary": "GENERAL_MERCHANDISE"
              },
              "date": "2024-07-15",
              "date_posted": "2024-07-15T00:00:00Z",
              "date_transacted": "2024-07-15",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": null,
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": null,
                "state": null,
                "store_number": null,
                "zip": null
              },
              "merchant_name": "Family Dollar",
              "original_description": "FAMILY DOLLAR",
              "pending": false,
              "transaction_id": "dzWnyxwZ4GHlZPGgrNyxiMG7qd5jDgCJEz5jL",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 45.06,
              "check_number": null,
              "credit_category": {
                "detailed": "FOOD_RETAIL_GROCERIES",
                "primary": "FOOD_RETAIL"
              },
              "date": "2024-07-15",
              "date_posted": "2024-07-15T00:00:00Z",
              "date_transacted": "2024-07-15",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": null,
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": null,
                "state": null,
                "store_number": null,
                "zip": null
              },
              "merchant_name": "Instacart",
              "original_description": "INSTACART HTTPSINSTACAR CA",
              "pending": false,
              "transaction_id": "4W7eE9rZqMToDArbPeLNIREoKpdgBMcJbVNQD",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 34.91,
              "check_number": null,
              "credit_category": {
                "detailed": "FOOD_RETAIL_GROCERIES",
                "primary": "FOOD_RETAIL"
              },
              "date": "2024-07-15",
              "date_posted": "2024-07-15T00:00:00Z",
              "date_transacted": "2024-07-15",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": "Whittier",
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": "CA",
                "state": "CA",
                "store_number": null,
                "zip": null
              },
              "merchant_name": "Smart & Final",
              "original_description": "POS SMART AND FINAL 111 WHITTIER CA",
              "pending": false,
              "transaction_id": "j4yqDjb7QwS7woGzqrgDIEG1NaQVZwf6Wmz3D",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 49.78,
              "check_number": null,
              "credit_category": {
                "detailed": "FOOD_RETAIL_GROCERIES",
                "primary": "FOOD_RETAIL"
              },
              "date": "2024-07-15",
              "date_posted": "2024-07-15T00:00:00Z",
              "date_transacted": "2024-07-15",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": "Portland",
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": "OR",
                "state": "OR",
                "store_number": "1111",
                "zip": null
              },
              "merchant_name": "Safeway",
              "original_description": "SAFEWAY #1111 PORTLAND OR            111111",
              "pending": false,
              "transaction_id": "aqgWnze7xoHd6DQwLPnzT5dgPKjB1NfZ5JlBy",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 54.24,
              "check_number": null,
              "credit_category": {
                "detailed": "FOOD_RETAIL_GROCERIES",
                "primary": "FOOD_RETAIL"
              },
              "date": "2024-07-15",
              "date_posted": "2024-07-15T00:00:00Z",
              "date_transacted": "2024-07-15",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": "Portland",
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": "OR",
                "state": "OR",
                "store_number": "1111",
                "zip": null
              },
              "merchant_name": "Safeway",
              "original_description": "SAFEWAY #1111 PORTLAND OR            111111",
              "pending": false,
              "transaction_id": "P13aP8b7nmS3WQoxg1PMsdvMK679RNfo65B4G",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 41.79,
              "check_number": null,
              "credit_category": {
                "detailed": "GENERAL_MERCHANDISE_ONLINE_MARKETPLACES",
                "primary": "GENERAL_MERCHANDISE"
              },
              "date": "2024-07-16",
              "date_posted": "2024-07-16T00:00:00Z",
              "date_transacted": "2024-07-16",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": null,
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": null,
                "state": null,
                "store_number": null,
                "zip": null
              },
              "merchant_name": "Amazon",
              "original_description": "AMZN Mktp US*11111111 Amzn.com/bill WA AM",
              "pending": false,
              "transaction_id": "7nZMG6pXz8SADylMqzx7TraE4qjJm7udJyAGm",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 33.86,
              "check_number": null,
              "credit_category": {
                "detailed": "FOOD_RETAIL_GROCERIES",
                "primary": "FOOD_RETAIL"
              },
              "date": "2024-07-16",
              "date_posted": "2024-07-16T00:00:00Z",
              "date_transacted": "2024-07-16",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": null,
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": null,
                "state": null,
                "store_number": null,
                "zip": null
              },
              "merchant_name": "Instacart",
              "original_description": "INSTACART HTTPSINSTACAR CA",
              "pending": false,
              "transaction_id": "MQr3ap7PWEIrQG7bLdaNsxyBV7g1KqCL6pwoy",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 27.08,
              "check_number": null,
              "credit_category": {
                "detailed": "DINING_DINING",
                "primary": "DINING"
              },
              "date": "2024-07-16",
              "date_posted": "2024-07-16T00:00:00Z",
              "date_transacted": "2024-07-16",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": null,
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": null,
                "state": null,
                "store_number": null,
                "zip": null
              },
              "merchant_name": null,
              "original_description": "POKE BROS * POKE BRO IL",
              "pending": false,
              "transaction_id": "eBAk9dvwNbHPZpr8W69dU3rekJz47Kcr9BRwl",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 25.94,
              "check_number": null,
              "credit_category": {
                "detailed": "GENERAL_MERCHANDISE_FURNITURE_AND_HARDWARE",
                "primary": "GENERAL_MERCHANDISE"
              },
              "date": "2024-07-16",
              "date_posted": "2024-07-16T00:00:00Z",
              "date_transacted": "2024-07-16",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": null,
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": null,
                "state": null,
                "store_number": null,
                "zip": null
              },
              "merchant_name": "The Home Depot",
              "original_description": "THE HOME DEPOT",
              "pending": false,
              "transaction_id": "QLx4jEJZb9SxRm7aWbjAio3LrgZ5vPswm64dE",
              "unofficial_currency_code": null
            },
            {
              "account_id": "NZzx4oRPkAHzyRekpG4PTZkoGpNAR4uypaj1E",
              "account_owner": null,
              "amount": 27.57,
              "check_number": null,
              "credit_category": {
                "detailed": "GENERAL_MERCHANDISE_OTHER_GENERAL_MERCHANDISE",
                "primary": "GENERAL_MERCHANDISE"
              },
              "date": "2024-07-16",
              "date_posted": "2024-07-16T00:00:00Z",
              "date_transacted": "2024-07-16",
              "iso_currency_code": "USD",
              "location": {
                "address": null,
                "city": null,
                "country": null,
                "lat": null,
                "lon": null,
                "postal_code": null,
                "region": null,
                "state": null,
                "store_number": null,
                "zip": null
              },
              "merchant_name": null,
              "original_description": "The Press Club",
              "pending": false,
              "transaction_id": "ZnQ1ovqBldSQ6GzRbroAHLdQP68BrKceqmAjX",
              "unofficial_currency_code": null
            }
          ],
          "type": "depository"
        }
      ]
    }
  ],
  "request_id": "m8MDnv9okwxFNBV"
}
```

=\*=\*=\*=[#### `/cra/monitoring_insights/subscribe`](/docs/api/products/check/#cramonitoring_insightssubscribe)

[#### Subscribe to Monitoring Insights](/docs/api/products/check/#subscribe-to-monitoring-insights)

This endpoint allows you to subscribe to insights for a user's linked CRA Item, which are updated between one and four times per day (best-effort). In the current Cash Flow Updates beta experience, only one Item per user may be subscribed for monitoring updates.

/cra/monitoring\_insights/subscribe

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

A unique user identifier, created by `/user/create`. Integrations that began using `/user/create` after December 10, 2025 use this field to identify a user instead of the `user_token`. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

The Item ID to subscribe for Cash Flow Updates.

URL to which Plaid will send Cash Flow Updates webhooks, for example when the requested Cash Flow Updates report is ready.

Format: `url`

Income categories to include in Cash Flow Updates. If empty or `null`, this field will default to including all possible categories.

Possible values: `SALARY`, `UNEMPLOYMENT`, `CASH`, `GIG_ECONOMY`, `RENTAL`, `CHILD_SUPPORT`, `MILITARY`, `RETIREMENT`, `LONG_TERM_DISABILITY`, `BANK_INTEREST`, `CASH_DEPOSIT`, `TRANSFER_FROM_APPLICATION`, `TAX_REFUND`, `BENEFIT_OTHER`, `OTHER`

The user token associated with the user for which data is being requested. This field is used only by customers with pre-existing integrations that already use the `user_token` field. All other customers should use the `user_id` instead. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

/cra/monitoring\_insights/subscribe

Nodeâ¼

```
try {
  const response = await client.craMonitoringInsightsSubscribe({
    user_id: 'usr_9nSp2KuZ2x4JDw',
    item_id: 'eVBnVMp7zdTJLkRNr33Rs6zr7KNJqBFL9DrE6',
    webhook: 'https://example.com/webhook',
    income_categories: [CreditBankIncomeCategory.Salary],
  });
} catch (error) {
  // handle error
}
```

/cra/monitoring\_insights/subscribe

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

A unique identifier for the subscription.

Response Object

```
{
  "subscription_id": "f17efbdd-caab-4278-8ece-963511cd3d51",
  "request_id": "GVzMdiDd8DDAQK4"
}
```

=\*=\*=\*=[#### `/cra/monitoring_insights/unsubscribe`](/docs/api/products/check/#cramonitoring_insightsunsubscribe)

[#### Unsubscribe from Monitoring Insights](/docs/api/products/check/#unsubscribe-from-monitoring-insights)

This endpoint allows you to unsubscribe from previously subscribed Monitoring Insights.

/cra/monitoring\_insights/unsubscribe

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

A unique identifier for the subscription.

/cra/monitoring\_insights/unsubscribe

Nodeâ¼

```
try {
  const response = await client.craMonitoringInsightsUnsubscribe({
    subscription_id: 'f17efbdd-caab-4278-8ece-963511cd3d51',
  });
} catch (error) {
  // handle error
}
```

/cra/monitoring\_insights/unsubscribe

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "GVzMdiDd8DDAQK4"
}
```

[### Webhooks](/docs/api/products/check/#webhooks)

When you create a new report, either by creating a Link token with a Plaid Check product, or by calling [`/cra/check_report/create`](/docs/api/products/check/#cracheck_reportcreate), Plaid Check will start generating a report for you. When the report has been created (or the report creation fails), Plaid Check will let you know by sending you either a `CHECK_REPORT: USER_CHECK_REPORT_READY` or `CHECK_REPORT: USER_CHECK_REPORT_FAILED` webhook.

Customers who first called [`/user/create`](/docs/api/users/#usercreate) after December 10, 2025 will receive the `USER_CHECK_REPORT_READY` / `USER_CHECK_REPORT_FAILED` webhooks. Customers who integrated before this date will receive the older `CHECK_REPORT_READY` / `CHECK_REPORT_FAILED` webhooks. For more details, see [new User APIs](/docs/api/users/user-apis/).

=\*=\*=\*=[#### `USER_CHECK_REPORT_READY`](/docs/api/products/check/#user_check_report_ready)

Fired when the Check Report is ready to be retrieved. Once this webhook has fired, the report will be available to retrieve for 24 hours.

**Properties**

`CHECK_REPORT`

`USER_CHECK_REPORT_READY`

The `user_id` associated with the user whose data is being requested. This is received by calling `/user/create`.

Specifies a list of products that have successfully been generated for the report.

Possible values: `cra_base_report`, `cra_income_insights`, `cra_cashflow_insights`, `cra_partner_insights`, `cra_network_insights`, `cra_monitoring`, `cra_lend_score`

Specifies a list of products that have failed to generate for the report. Additional detail on what caused the failure can be found by calling the product /get endpoint.

Possible values: `cra_base_report`, `cra_income_insights`, `cra_cashflow_insights`, `cra_partner_insights`, `cra_network_insights`, `cra_monitoring`, `cra_lend_score`

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "CHECK_REPORT",
  "webhook_code": "USER_CHECK_REPORT_READY",
  "user_id": "usr_8c3ZbDBYjaqUXZ",
  "successful_products": [
    "cra_base_report"
  ],
  "environment": "production"
}
```

=\*=\*=\*=[#### `USER_CHECK_REPORT_FAILED`](/docs/api/products/check/#user_check_report_failed)

Fired when a Check Report has failed to generate. To get more details, call [`/user/items/get`](/docs/api/users/#useritemsget) and check for non-null `error` objects on the associated Items in the response. These `error` objects will contain more details on why the Item is in an error state and how to resolve it. After resolving the errors, you can try to re-generate the report.

**Properties**

`CHECK_REPORT`

`USER_CHECK_REPORT_FAILED`

The `user_id` associated with the user whose data is being requested. This is received by calling `/user/create`.

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "CHECK_REPORT",
  "webhook_code": "USER_CHECK_REPORT_FAILED",
  "user_id": "usr_8c3ZbDBYjaqUXZ",
  "environment": "production"
}
```

=\*=\*=\*=[#### `CHECK_REPORT_READY`](/docs/api/products/check/#check_report_ready)

Fired when the Check Report is ready to be retrieved. Once this webhook has fired, the report will be available to retrieve for 24 hours.

**Properties**

`CHECK_REPORT`

`CHECK_REPORT_READY`

The `user_id` corresponding to the user the webhook has fired for.

Specifies a list of products that have successfully been generated for the report.

Possible values: `cra_base_report`, `cra_income_insights`, `cra_cashflow_insights`, `cra_partner_insights`, `cra_network_insights`, `cra_monitoring`, `cra_lend_score`

Specifies a list of products that have failed to generate for the report. Additional detail on what caused the failure can be found by calling the product /get endpoint.

Possible values: `cra_base_report`, `cra_income_insights`, `cra_cashflow_insights`, `cra_partner_insights`, `cra_network_insights`, `cra_monitoring`, `cra_lend_score`

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "CHECK_REPORT",
  "webhook_code": "CHECK_REPORT_READY",
  "user_id": "wz666MBjYWTp2PDzzggYhM6oWWmBb",
  "successful_products": [
    "cra_base_report"
  ],
  "environment": "production"
}
```

=\*=\*=\*=[#### `CHECK_REPORT_FAILED`](/docs/api/products/check/#check_report_failed)

Fired when a Check Report has failed to generate. To get more details, call [`/user/items/get`](/docs/api/users/#useritemsget) and check for non-null `error` objects on the associated Items in the response. These `error` objects will contain more details on why the Item is in an error state and how to resolve it. After resolving the errors, you can try to re-generate the report.

**Properties**

`CHECK_REPORT`

`CHECK_REPORT_FAILED`

The `user_id` corresponding to the user the webhook has fired for.

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "CHECK_REPORT",
  "webhook_code": "CHECK_REPORT_FAILED",
  "user_id": "wz666MBjYWTp2PDzzggYhM6oWWmBb",
  "environment": "production"
}
```

[### Cash flow updates webhooks](/docs/api/products/check/#cash-flow-updates-webhooks)

These webhooks are specific to the Cash Flow Updates (beta) product.

All webhooks in this section except for `CASH_FLOW_INSIGHTS_UPDATED` are legacy webhooks and will only be fired for customers who integrated with Plaid Check before December 10, 2025. For newer integrations, `CASH_FLOW_INSIGHTS_UPDATED` has replaced the other webhooks. For more details, see [New user APIs](/docs/api/users/user-apis/).

=\*=\*=\*=[#### `CASH_FLOW_INSIGHTS_UPDATED`](/docs/api/products/check/#cash_flow_insights_updated)

For each item on an enabled user, this webhook will fire up to four times a day with status information. This webhook will not fire immediately upon enrollment in Cash Flow Updates. The payload may contain an `insights` array with insights that have been detected, if any (e.g. `LOW_BALANCE_DETECTED`, `LARGE_DEPOSIT_DETECTED`). Upon receiving the webhook, call [`/cra/monitoring_insights/get`](/docs/api/products/check/#cramonitoring_insightsget) to retrieve the updated insights.

**Properties**

`CASH_FLOW_UPDATES`

`CASH_FLOW_INSIGHTS_UPDATED`

Enum for the status of the insights

Possible values: `AVAILABLE`, `FAILED`

The `user_id` associated with the user whose data is being requested. This is received by calling `/user/create`.

Array containing the insights detected within the generated report, if any. Possible values include:
`LARGE_DEPOSIT_DETECTED`: signaling a deposit over $5,000
`LOW_BALANCE_DETECTED`: signaling a balance below $100
`NEW_LOAN_PAYMENT_DETECTED`: signaling a new loan payment
`NSF_OVERDRAFT_DETECTED`: signaling an NSF overdraft

Possible values: `LARGE_DEPOSIT_DETECTED`, `LOW_BALANCE_DETECTED`, `NEW_LOAN_PAYMENT_DETECTED`, `NSF_OVERDRAFT_DETECTED`

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "CASH_FLOW_UPDATES",
  "webhook_code": "CASH_FLOW_INSIGHTS_UPDATED",
  "status": "AVAILABLE",
  "user_id": "usr_6009db6e",
  "insights": [
    "LARGE_DEPOSIT_DETECTED",
    "LOW_BALANCE_DETECTED",
    "NEW_LOAN_PAYMENT_DETECTED",
    "NSF_OVERDRAFT_DETECTED"
  ],
  "environment": "sandbox"
}
```

=\*=\*=\*=[#### `INSIGHTS_UPDATED`](/docs/api/products/check/#insights_updated)

For each user's Item enabled for Cash Flow Updates, this webhook will fire between one and four times a day with information on the status of the update. This webhook will not fire immediately upon enrollment in Cash Flow Updates. Upon receiving the webhook, call [`/cra/monitoring_insights/get`](/docs/api/products/check/#cramonitoring_insightsget) to retrieve the updated insights. At approximately the same time as the `INSIGHTS_UPDATED` webhook, any event-driven `CASH_FLOW_UPDATES` webhooks (e.g. `LOW_BALANCE_DETECTED`, `LARGE_DEPOSIT_DETECTED`) that were triggered by the update will also fire. This webhook has been replaced by the `CASH_FLOW_INSIGHTS_UPDATED` webhook for all customers who began using Plaid Check on or after December 10, 2025.

**Properties**

`CASH_FLOW_UPDATES`

`INSIGHTS_UPDATED`

Enum for the status of the insights

Possible values: `AVAILABLE`, `FAILED`

The `user_id` that the report is associated with

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "CASH_FLOW_UPDATES",
  "webhook_code": "INSIGHTS_UPDATED",
  "status": "AVAILABLE",
  "user_id": "9eaba3c2fdc916bc197f279185b986607dd21682a5b04eab04a5a03e8b3f3334",
  "environment": "production"
}
```

=\*=\*=\*=[#### `LARGE_DEPOSIT_DETECTED`](/docs/api/products/check/#large_deposit_detected)

For each user's Item enabled for Cash Flow Updates, this webhook will fire when an update detects a deposit over $5,000. Upon receiving the webhook, call [`/cra/monitoring_insights/get`](/docs/api/products/check/#cramonitoring_insightsget) to retrieve the updated insights.

**Properties**

`CASH_FLOW_UPDATES`

`LARGE_DEPOSIT_DETECTED`

Enum for the status of the insights

Possible values: `AVAILABLE`, `FAILED`

The `user_id` that the report is associated with

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "CASH_FLOW_UPDATES",
  "webhook_code": "LARGE_DEPOSIT_DETECTED",
  "status": "AVAILABLE",
  "user_id": "9eaba3c2fdc916bc197f279185b986607dd21682a5b04eab04a5a03e8b3f3334",
  "environment": "production"
}
```

=\*=\*=\*=[#### `LOW_BALANCE_DETECTED`](/docs/api/products/check/#low_balance_detected)

For each user's Item enabled for Cash Flow Updates, this webhook will fire when an update detects a balance below $100. Upon receiving the webhook, call [`/cra/monitoring_insights/get`](/docs/api/products/check/#cramonitoring_insightsget) to retrieve the updated insights.

**Properties**

`CASH_FLOW_UPDATES`

`LOW_BALANCE_DETECTED`

Enum for the status of the insights

Possible values: `AVAILABLE`, `FAILED`

The `user_id` that the report is associated with

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "CASH_FLOW_UPDATES",
  "webhook_code": "LOW_BALANCE_DETECTED",
  "status": "AVAILABLE",
  "user_id": "9eaba3c2fdc916bc197f279185b986607dd21682a5b04eab04a5a03e8b3f3334",
  "environment": "production"
}
```

=\*=\*=\*=[#### `NEW_LOAN_PAYMENT_DETECTED`](/docs/api/products/check/#new_loan_payment_detected)

For each user's Item enabled for Cash Flow Updates, this webhook will fire when an update detects a new loan payment. Upon receiving the webhook, call [`/cra/monitoring_insights/get`](/docs/api/products/check/#cramonitoring_insightsget) to retrieve the updated insights.

**Properties**

`CASH_FLOW_UPDATES`

`NEW_LOAN_PAYMENT_DETECTED`

Enum for the status of the insights

Possible values: `AVAILABLE`, `FAILED`

The `user_id` that the report is associated with

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "CASH_FLOW_UPDATES",
  "webhook_code": "NEW_LOAN_PAYMENT_DETECTED",
  "status": "AVAILABLE",
  "user_id": "9eaba3c2fdc916bc197f279185b986607dd21682a5b04eab04a5a03e8b3f3334",
  "environment": "production"
}
```

=\*=\*=\*=[#### `NSF_OVERDRAFT_DETECTED`](/docs/api/products/check/#nsf_overdraft_detected)

For each user's Item enabled for Cash Flow Updates, this webhook will fire when an update includes an NSF overdraft transaction. Upon receiving the webhook, call [`/cra/monitoring_insights/get`](/docs/api/products/check/#cramonitoring_insightsget) to retrieve the updated insights.

**Properties**

`CASH_FLOW_UPDATES`

`NSF_OVERDRAFT_DETECTED`

Enum for the status of the insights

Possible values: `AVAILABLE`, `FAILED`

The `user_id` that the report is associated with

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "CASH_FLOW_UPDATES",
  "webhook_code": "NSF_OVERDRAFT_DETECTED",
  "status": "AVAILABLE",
  "user_id": "9eaba3c2fdc916bc197f279185b986607dd21682a5b04eab04a5a03e8b3f3334",
  "environment": "production"
}
```
