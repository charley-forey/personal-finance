---
title: "Processor Partners"
source_url: "https://plaid.com/docs/api/processor-partners/"
section: "Partnerships"
section_id: "07-partnerships"
slug: "processor-partners"
endpoints:
  - "/processor/account/get"
  - "/processor/auth/get"
  - "/processor/balance/get"
  - "/processor/identity/get"
  - "/processor/identity/match"
  - "/processor/investments/auth/get"
  - "/processor/investments/holdings/get"
  - "/processor/investments/transactions/get"
  - "/processor/signal/evaluate"
  - "/processor/liabilities/get"
  - "/processor/signal/decision/report"
  - "/processor/signal/return/report"
  - "/processor/signal/prepare"
  - "/processor/token/webhook/update"
  - "/processor/transactions/sync"
  - "/processor/transactions/get"
  - "/processor/transactions/recurring/get"
  - "/processor/transactions/refresh"
  - "WEBHOOK_UPDATE_ACKNOWLEDGED"
  - "INVALID_FIELD"
  - "Update a processor token's webhook URL"
  - "webhook"
  - "/investments/transactions/get"
  - "TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION"
  - "/link/token/create"
  - "/item/get"
  - "SYNC_UPDATES_AVAILABLE"
  - "RECURRING_TRANSACTIONS_UPDATE"
  - "HISTORICAL_UPDATE"
  - "TRANSACTIONS_REMOVED"
  - "DEFAULT_UPDATE"
  - "Processor webhooks"
  - "webhook_type"
  - "webhook_code"
  - "new_webhook_url"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Processor partner endpoints

> **Source:** [https://plaid.com/docs/api/processor-partners/](https://plaid.com/docs/api/processor-partners/)
> **Section:** Partnerships

## Endpoints & Webhooks on this page

- `/processor/account/get`
- `/processor/auth/get`
- `/processor/balance/get`
- `/processor/identity/get`
- `/processor/identity/match`
- `/processor/investments/auth/get`
- `/processor/investments/holdings/get`
- `/processor/investments/transactions/get`
- `/processor/signal/evaluate`
- `/processor/liabilities/get`
- `/processor/signal/decision/report`
- `/processor/signal/return/report`
- `/processor/signal/prepare`
- `/processor/token/webhook/update`
- `/processor/transactions/sync`
- `/processor/transactions/get`
- `/processor/transactions/recurring/get`
- `/processor/transactions/refresh`
- `WEBHOOK_UPDATE_ACKNOWLEDGED`
- `INVALID_FIELD`
- `Update a processor token's webhook URL`
- `webhook`
- `/investments/transactions/get`
- `TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION`
- `/link/token/create`
- `/item/get`
- `SYNC_UPDATES_AVAILABLE`
- `RECURRING_TRANSACTIONS_UPDATE`
- `HISTORICAL_UPDATE`
- `TRANSACTIONS_REMOVED`
- `DEFAULT_UPDATE`
- `Processor webhooks`
- `webhook_type`
- `webhook_code`
- `new_webhook_url`

---

# Processor partner endpoints

#### API reference for endpoints for use by Plaid partners

Partner processor endpoints are used by Plaid partners to integrate with Plaid. Instead of using an `access_token` associated with a Plaid `Item`, these endpoints use a `processor_token` to identify a single financial account. These endpoints are used only by partners and not by developers who are using those partners' APIs. If you are a Plaid developer who would like to use a partner, see [Processor token endpoints](/docs/api/processors/). To learn how to move money with one of our partners, see [Move money with Auth](/docs/auth/partnerships/).

| In this section |  |
| --- | --- |
| [`/processor/account/get`](/docs/api/processor-partners/#processoraccountget) | Fetch Account data |
| [`/processor/auth/get`](/docs/api/processor-partners/#processorauthget) | Fetch Auth data |
| [`/processor/balance/get`](/docs/api/processor-partners/#processorbalanceget) | Fetch Balance data |
| [`/processor/identity/get`](/docs/api/processor-partners/#processoridentityget) | Fetch Identity data |
| [`/processor/identity/match`](/docs/api/processor-partners/#processoridentitymatch) | Retrieve Identity match scores |
| [`/processor/investments/auth/get`](/docs/api/processor-partners/#processorinvestmentsauthget) | Fetch Investments Auth data |
| [`/processor/investments/holdings/get`](/docs/api/processor-partners/#processorinvestmentsholdingsget) | Fetch Investments Holdings data |
| [`/processor/investments/transactions/get`](/docs/api/processor-partners/#processorinvestmentstransactionsget) | Fetch Investments Transactions data |
| [`/processor/liabilities/get`](/docs/api/processor-partners/#processorliabilitiesget) | Retrieve Liabilities data |
| [`/processor/signal/evaluate`](/docs/api/processor-partners/#processorsignalevaluate) | Retrieve Signal scores |
| [`/processor/signal/decision/report`](/docs/api/processor-partners/#processorsignaldecisionreport) | Report whether you initiated an ACH transaction |
| [`/processor/signal/return/report`](/docs/api/processor-partners/#processorsignalreturnreport) | Report a return for an ACH transaction |
| [`/processor/signal/prepare`](/docs/api/processor-partners/#processorsignalprepare) | Prepare a processor token for Signal |
| [`/processor/token/webhook/update`](/docs/api/processor-partners/#processortokenwebhookupdate) | Set the webhook URL for a processor token |
| [`/processor/transactions/sync`](/docs/api/processor-partners/#processortransactionssync) | Get transaction data or incremental transaction updates |
| [`/processor/transactions/get`](/docs/api/processor-partners/#processortransactionsget) | Fetch transaction data |
| [`/processor/transactions/recurring/get`](/docs/api/processor-partners/#processortransactionsrecurringget) | Fetch recurring transaction data |
| [`/processor/transactions/refresh`](/docs/api/processor-partners/#processortransactionsrefresh) | Refresh transaction data |

| Webhooks |  |
| --- | --- |
| [`WEBHOOK_UPDATE_ACKNOWLEDGED`](/docs/api/processor-partners/#webhook_update_acknowledged) | Item's webhook receiver endpoint has been updated |

=\*=\*=\*=[#### `/processor/account/get`](/docs/api/processor-partners/#processoraccountget)

[#### Retrieve the account associated with a processor token](/docs/api/processor-partners/#retrieve-the-account-associated-with-a-processor-token)

This endpoint returns the account associated with a given processor token.

This endpoint retrieves cached information, rather than extracting fresh information from the institution. As a result, the account balance returned may not be up-to-date; for real-time balance information, use [`/processor/balance/get`](/docs/api/processor-partners/#processorbalanceget) instead. Note that some information is nullable.

/processor/account/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

The processor token obtained from the Plaid integration partner. Processor tokens are in the format: `processor-<environment>-<identifier>`

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

/processor/account/get

Nodeâ¼

```
try {
  const request: ProcessorAccountGetRequest = {
    processor_token: processorToken,
  };
  const response = await plaidClient.processorAccountGet(request);
} catch (error) {
  // handle error
}
```

/processor/account/get

**Response fields**

Collapse all

A single account at a financial institution.

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

The Plaid Institution ID associated with the Account.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "account": {
    "account_id": "QKKzevvp33HxPWpoqn6rI13BxW4awNSjnw4xv",
    "balances": {
      "available": 100,
      "current": 110,
      "limit": null,
      "iso_currency_code": "USD",
      "unofficial_currency_code": null
    },
    "mask": "0000",
    "name": "Plaid Checking",
    "official_name": "Plaid Gold Checking",
    "subtype": "checking",
    "type": "depository"
  },
  "institution_id": "ins_109508",
  "request_id": "1zlMf"
}
```

=\*=\*=\*=[#### `/processor/auth/get`](/docs/api/processor-partners/#processorauthget)

[#### Retrieve Auth data](/docs/api/processor-partners/#retrieve-auth-data)

The [`/processor/auth/get`](/docs/api/processor-partners/#processorauthget) endpoint returns the bank account and bank identification number (such as the routing number, for US accounts), for a checking, savings, or cash management account that''s associated with a given `processor_token`. The endpoint also returns high-level account data and balances when available.

Versioning note: API versions 2019-05-29 and earlier use a different schema for the `numbers` object returned by this endpoint. For details, see [Plaid API versioning](https://plaid.com/docs/api/versioning/#version-2020-09-14).

/processor/auth/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The processor token obtained from the Plaid integration partner. Processor tokens are in the format: `processor-<environment>-<identifier>`

/processor/auth/get

Nodeâ¼

```
const request: ProcessorAuthGetRequest = {
  processor_token: processorToken,
};
const response = await plaidClient.processorAuthGet(request);
```

/processor/auth/get

**Response fields**

Collapse all

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

An object containing identifying numbers used for making electronic transfers to and from the `account`. The identifying number type (ACH, EFT, IBAN, or Bacs) used will depend on the country of the account. An account may have more than one number type. If a particular identifying number type is not used by the `account` for which auth data has been requested, a null value will be returned.

Hide object

Identifying information for transferring money to or from a US account via ACH or wire transfer.

Hide object

The Plaid account ID associated with the account numbers

The ACH account number for the account.

At certain institutions, including Chase, PNC, and US Bank, you will receive "tokenized" routing and account numbers, which are not the user's actual account and routing numbers. For important details on how this may impact your integration and on how to avoid fraud, user confusion, and ACH returns, see [Tokenized account numbers](https://plaid.com/docs/auth/#tokenized-account-numbers).

Indicates whether the account number is tokenized by the institution. For important details on how tokenized account numbers may impact your integration, see [Tokenized account numbers](https://plaid.com/docs/auth/#tokenized-account-numbers).

The ACH routing number for the account. This may be a tokenized routing number. For more information, see [Tokenized account numbers](https://plaid.com/docs/auth/#tokenized-account-numbers).

The wire transfer routing number for the account. This field is only populated if the institution is known to use a separate wire transfer routing number. Many institutions do not have a separate wire routing number and use the ACH routing number for wires instead. It is recommended to have the end user manually confirm their wire routing number before sending any wires to their account, especially if this field is `null`.

Identifying information for transferring money to or from a Canadian bank account via EFT.

Hide object

The Plaid account ID associated with the account numbers

The EFT account number for the account

The EFT institution number for the account

The EFT branch number for the account

Identifying information for transferring money to or from an international bank account via wire transfer.

Hide object

The Plaid account ID associated with the account numbers

The International Bank Account Number (IBAN) for the account

The Business Identifier Code (BIC) for the account

Identifying information for transferring money to or from a UK bank account via Bacs.

Hide object

The Plaid account ID associated with the account numbers

The Bacs account number for the account

The Bacs sort code for the account

A single account at a financial institution.

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

Response Object

```
{
  "account": {
    "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
    "balances": {
      "available": 100,
      "current": 110,
      "iso_currency_code": "USD",
      "limit": null,
      "unofficial_currency_code": null
    },
    "mask": "0000",
    "name": "Plaid Checking",
    "official_name": "Plaid Gold Checking",
    "subtype": "checking",
    "type": "depository"
  },
  "numbers": {
    "ach": {
      "account": "9900009606",
      "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
      "routing": "011401533",
      "wire_routing": "021000021"
    },
    "eft": {
      "account": "111122223333",
      "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
      "institution": "021",
      "branch": "01140"
    },
    "international": {
      "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
      "bic": "NWBKGB21",
      "iban": "GB29NWBK60161331926819"
    },
    "bacs": {
      "account": "31926819",
      "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
      "sort_code": "601613"
    }
  },
  "request_id": "1zlMf"
}
```

=\*=\*=\*=[#### `/processor/balance/get`](/docs/api/processor-partners/#processorbalanceget)

[#### Retrieve Balance data](/docs/api/processor-partners/#retrieve-balance-data)

The [`/processor/balance/get`](/docs/api/processor-partners/#processorbalanceget) endpoint returns the real-time balance for each of an Item's accounts. While other endpoints may return a balance object, only [`/processor/balance/get`](/docs/api/processor-partners/#processorbalanceget) forces the available and current balance fields to be refreshed rather than cached.

/processor/balance/get

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The processor token obtained from the Plaid integration partner. Processor tokens are in the format: `processor-<environment>-<identifier>`

Optional parameters to `/processor/balance/get`.

Hide object

Timestamp in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (`YYYY-MM-DDTHH:mm:ssZ`) indicating the oldest acceptable balance when making a request to `/accounts/balance/get`.

This field is only necessary when the institution is `ins_128026` (Capital One), *and* one or more account types being requested is a non-depository account (such as a credit card) as Capital One does not provide real-time balance for non-depository accounts. In this case, a value must be provided or an `INVALID_REQUEST` error with the code of `INVALID_FIELD` will be returned. For all other institutions, as well as for depository accounts at Capital One (including all checking and savings accounts) this field is ignored and real-time balance information will be fetched.

If this field is not ignored, and no acceptable balance is available, an `INVALID_RESULT` error with the code `LAST_UPDATED_DATETIME_OUT_OF_RANGE` will be returned.

Format: `date-time`

Nodeâ¼

```
const request: ProcessorBalanceGetRequest = {
  processor_token: processorToken,
};
const response = await plaidClient.processorBalanceGet(request);
```

/processor/balance/get

**Response fields**

Collapse all

A single account at a financial institution.

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

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "account": {
    "account_id": "QKKzevvp33HxPWpoqn6rI13BxW4awNSjnw4xv",
    "balances": {
      "available": 100,
      "current": 110,
      "limit": null,
      "iso_currency_code": "USD",
      "unofficial_currency_code": null
    },
    "mask": "0000",
    "name": "Plaid Checking",
    "official_name": "Plaid Gold Checking",
    "subtype": "checking",
    "type": "depository"
  },
  "request_id": "1zlMf"
}
```

=\*=\*=\*=[#### `/processor/identity/get`](/docs/api/processor-partners/#processoridentityget)

[#### Retrieve Identity data](/docs/api/processor-partners/#retrieve-identity-data)

The [`/processor/identity/get`](/docs/api/processor-partners/#processoridentityget) endpoint allows you to retrieve various account holder information on file with the financial institution, including names, emails, phone numbers, and addresses.

/processor/identity/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The processor token obtained from the Plaid integration partner. Processor tokens are in the format: `processor-<environment>-<identifier>`

/processor/identity/get

Nodeâ¼

```
const request: ProcessorIdentityGetRequest = {
  processor_token: processorToken,
};
const response = await plaidClient.processorIdentityGet(request);
```

/processor/identity/get

**Response fields**

Identity information about an account

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

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "account": {
    "account_id": "XMGPJy4q1gsQoKd5z9R3tK8kJ9EWL8SdkgKMq",
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
            "type": "mobile1"
          }
        ]
      }
    ],
    "subtype": "checking",
    "type": "depository"
  },
  "request_id": "eOPkBl6t33veI2J"
}
```

=\*=\*=\*=[#### `/processor/identity/match`](/docs/api/processor-partners/#processoridentitymatch)

[#### Retrieve identity match score](/docs/api/processor-partners/#retrieve-identity-match-score)

The [`/processor/identity/match`](/docs/api/processor-partners/#processoridentitymatch) endpoint generates a match score, which indicates how well the provided identity data matches the identity information on file with the account holder's financial institution.

Fields within the `balances` object will always be null when retrieved by [`/processor/identity/match`](/docs/api/processor-partners/#processoridentitymatch). Instead, use the [`/processor/balance/get`](/docs/api/processor-partners/#processorbalanceget) endpoint to retrieve balance data.

/processor/identity/match

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The processor token obtained from the Plaid integration partner. Processor tokens are in the format: `processor-<environment>-<identifier>`

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

/processor/identity/match

Nodeâ¼

```
const request: ProcessorIdentityMatchRequest = {
  processor_token: processorToken,
};
const response = await plaidClient.processorIdentityMatch(request);
```

/processor/identity/match

**Response fields**

Identity match scores for an account

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

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "account": {
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
  "request_id": "3nARps6TOYtbACO"
}
```

=\*=\*=\*=[#### `/processor/investments/auth/get`](/docs/api/processor-partners/#processorinvestmentsauthget)

[#### Get investment account authentication data](/docs/api/processor-partners/#get-investment-account-authentication-data)

The [`/processor/investments/auth/get`](/docs/api/processor-partners/#processorinvestmentsauthget) endpoint allows you to retrieve information about the account
authorized by a processor token, including account numbers, account owners, holdings, and data provenance information.

To receive Investments Auth webhooks for a processor token, set its webhook URL via the [[`/processor/token/webhook/update`](https://plaid.com/docs/api/processor-partners/#processortokenwebhookupdate)](/docs/api/processor-partners/#processortokenwebhookupdate) endpoint.

/processor/investments/auth/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The processor token obtained from the Plaid integration partner. Processor tokens are in the format: `processor-<environment>-<identifier>`

/processor/investments/auth/get

Nodeâ¼

```
const request: ProcessorInvestmentsAuthGetRequest = {
  processor_token: processorToken,
};
const response = await plaidClient.processorInvestmentsAuthGet(request);
```

/processor/investments/auth/get

**Response fields**

Collapse all

A single account at a financial institution.

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

The holdings belonging to the investment account. Details of the securities in the holdings are provided in the `securities` field.

Hide object

The Plaid `account_id` associated with the holding.

The Plaid `security_id` associated with the holding. Security data is not specific to a user's account; any user who held the same security at the same financial institution at the same time would have identical security data. The `security_id` for the same security will typically be the same across different institutions, but this is not guaranteed. The `security_id` does not typically change, but may change if inherent details of the security change due to a corporate action, for example, in the event of a ticker symbol change or CUSIP change.

The last price given by the institution for this security.

Format: `double`

The date at which `institution_price` was current.

Format: `date`

Date and time at which `institution_price` was current, in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ).

This field is returned for select financial institutions and comes as provided by the institution. It may contain default time values (such as 00:00:00).

Format: `date-time`

The value of the holding, as reported by the institution.

Format: `double`

The total cost basis of the holding (e.g., the total amount spent to acquire all assets currently in the holding).

Format: `double`

The total quantity of the asset held, as reported by the financial institution. If the security is an option, `quantity` will reflect the total number of options (typically the number of contracts multiplied by 100), not the number of contracts.

Format: `double`

The ISO-4217 currency code of the holding. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the holding. Always `null` if `iso_currency_code` is non-`null`. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `iso_currency_code`s.

The total quantity of vested assets held, as reported by the financial institution. Vested assets are only associated with [equities](https://plaid.com/docs/api/products/investments/#investments-holdings-get-response-securities-type).

Format: `double`

The value of the vested holdings as reported by the institution.

Format: `double`

Per-lot acquisition data for this holding. An empty array indicates the institution does not provide lot-level data.

Hide object

The financial institution's identifier for this lot. Null if the institution does not provide a lot identifier.

The date and time this lot was acquired, in ISO 8601 format. Null if the institution does not provide acquisition datetime data.

Format: `date-time`

The number of units of the security in this lot.

Format: `double`

The price per unit of the security at the time this lot was acquired.

Format: `double`

The total cost basis of this lot, inclusive of any fees.

Format: `double`

The current market value of this lot.

Format: `double`

Indicates whether a holding lot position is long or short. Possible values are `LONG` and `SHORT`.

Possible values: `LONG`, `SHORT`

Objects describing the securities held in the account.

Hide object

A unique, Plaid-specific identifier for the security, used to associate securities with holdings. Like all Plaid identifiers, the `security_id` is case sensitive. The `security_id` may change if inherent details of the security change due to a corporate action, for example, in the event of a ticker symbol change or CUSIP change.

12-character ISIN, a globally unique securities identifier. A verified CUSIP Global Services license is required to receive this data. This field will be null by default for new customers, and null for existing customers starting March 12, 2024. If you would like access to this field, please start the verification process [here](https://docs.google.com/forms/d/e/1FAIpQLSd9asHEYEfmf8fxJTHZTAfAzW4dugsnSu-HS2J51f1mxwd6Sw/viewform).

9-character CUSIP, an identifier assigned to North American securities. A verified CUSIP Global Services license is required to receive this data. This field will be null by default for new customers, and null for existing customers starting March 12, 2024. If you would like access to this field, please start the verification process [here](https://docs.google.com/forms/d/e/1FAIpQLSd9asHEYEfmf8fxJTHZTAfAzW4dugsnSu-HS2J51f1mxwd6Sw/viewform).

(Deprecated) 7-character SEDOL, an identifier assigned to securities in the UK.

An identifier given to the security by the institution

If `institution_security_id` is present, this field indicates the Plaid `institution_id` of the institution to whom the identifier belongs.

In certain cases, Plaid will provide the ID of another security whose performance resembles this security, typically when the original security has low volume, or when a private security can be modeled with a publicly traded security.

A descriptive name for the security, suitable for display.

The security's trading symbol for publicly traded securities, and otherwise a short identifier if available.

Indicates that a security is a highly liquid asset and can be treated like cash.

The security type of the holding.

In rare instances, a null value is returned when institutional data is insufficient to determine the security type.

Valid security types are:

`cash`: Cash, currency, and money market funds

`cryptocurrency`: Digital or virtual currencies

`derivative`: Options, warrants, and other derivative instruments

`equity`: Domestic and foreign equities

`etf`: Multi-asset exchange-traded investment funds

`fixed income`: Bonds and certificates of deposit (CDs)

`loan`: Loans and loan receivables

`mutual fund`: Open- and closed-end vehicles pooling funds of multiple investors

`other`: Unknown or other investment types

The security subtype of the holding.

In rare instances, a null value is returned when institutional data is insufficient to determine the security subtype.

Possible values: `asset backed security`, `bill`, `bond`, `bond with warrants`, `cash`, `cash management bill`, `common stock`, `convertible bond`, `convertible equity`, `cryptocurrency`, `depositary receipt`, `depositary receipt on debt`, `etf`, `float rating note`, `fund of funds`, `hedge fund`, `limited partnership unit`, `medium term note`, `money market debt`, `mortgage backed security`, `municipal bond`, `mutual fund`, `note`, `option`, `other`, `preferred convertible`, `preferred equity`, `private equity fund`, `real estate investment trust`, `structured equity product`, `treasury inflation protected securities`, `unit`, `warrant`.

Price of the security at the close of the previous trading session. Null for non-public securities.

If the security is a foreign currency this field will be updated daily and will be priced in USD.

If the security is a cryptocurrency, this field will be updated multiple times a day. As crypto prices can fluctuate quickly and data may become stale sooner than other asset classes, refer to `update_datetime` with the time when the price was last updated.

Format: `double`

Date for which `close_price` is accurate. Always `null` if `close_price` is `null`.

Format: `date`

Date and time at which `close_price` is accurate, in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ). Always `null` if `close_price` is `null`.

Format: `date-time`

The ISO-4217 currency code of the price given. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the security. Always `null` if `iso_currency_code` is non-`null`. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `iso_currency_code`s.

The ISO-10383 Market Identifier Code of the exchange or market in which the security is being traded.

The sector classification of the security, such as Finance, Health Technology, etc.

For a complete list of possible values, please refer to the ["Sectors and Industries" spreadsheet](https://docs.google.com/spreadsheets/d/1L7aXUdqLhxgM8qe7hK67qqKXiUdQqILpwZ0LpxvCVnc).

The industry classification of the security, such as Biotechnology, Airlines, etc.

For a complete list of possible values, please refer to the ["Sectors and Industries" spreadsheet](https://docs.google.com/spreadsheets/d/1L7aXUdqLhxgM8qe7hK67qqKXiUdQqILpwZ0LpxvCVnc).

The ISO-10962 Classification of Financial Instruments Code used to classify the security based on its structure and function.

Details about the option security.

For the Sandbox environment, this data is currently only available if the Item is using a [custom Sandbox user](https://plaid.com/docs/sandbox/user-custom/) and the `ticker` field of the custom security follows the [OCC Option Symbol](https://en.wikipedia.org/wiki/Option_symbol#The_OCC_Option_Symbol) standard with no spaces. For an example of simulating this in Sandbox, see the [custom Sandbox GitHub](https://github.com/plaid/sandbox-custom-users).

Hide object

The type of this option contract. It is one of:

`put`: for Put option contracts

`call`: for Call option contracts

The expiration date for this option contract, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date`

The strike price for this option contract, per share of security.

Format: `double`

The ticker of the underlying security for this option contract.

Details about the fixed income security.

Hide object

Details about a fixed income security's expected rate of return.

Hide object

The fixed income security's expected rate of return.

Format: `double`

The type of rate which indicates how the predicted yield was calculated. It is one of:

`coupon`: the annualized interest rate for securities with a one-year term or longer, such as treasury notes and bonds.

`coupon_equivalent`: the calculated equivalent for the annualized interest rate factoring in the discount rate and time to maturity, for shorter term, non-interest-bearing securities such as treasury bills.

`discount`: the rate at which the present value or cost is discounted from the future value upon maturity, also known as the face value.

`yield`: the total predicted rate of return factoring in both the discount rate and the coupon rate, applicable to securities such as exchange-traded bonds which can both be interest-bearing as well as sold at a discount off their face value.

Possible values: `coupon`, `coupon_equivalent`, `discount`, `yield`, `null`

The maturity date for this fixed income security, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date`

The issue date for this fixed income security, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date`

The face value that is paid upon maturity of the fixed income security, per unit of security.

Format: `double`

Information about the account owners for the account.

Hide object

The ID of the account that this identity information pertains to

A list of names associated with the account by the financial institution. In the case of a joint account, Plaid will make a best effort to report the names of all account holders.

If an Item contains multiple accounts with different owner names, some institutions will report all names associated with the Item in each account's `names` array.

Identifying information for transferring holdings to an investment account.

Hide object

Hide object

The Plaid account ID associated with the account numbers

The full account number for the account

Identifiers for the clearinghouses that are associated with the account in order of relevance. If this array is empty, call `/institutions/get_by_id` with the `item.institution_id` to get the DTC number.

Hide object

The Plaid account ID associated with the account numbers

The full account number for the account

Hide object

The Plaid account ID associated with the account numbers

The plan number for the employer's 401k retirement plan

The full account number for the account

Object with metadata pertaining to the source of data for the account numbers, owners, and holdings that are returned.

Hide object

A description of the source of data for a given product/data type.

`INSTITUTION`: The institution supports this product, and the data was provided by the institution.
`INSTITUTION_MASK`: The user manually provided the full account number, which was matched to the account mask provided by the institution. Only applicable to the `numbers` data type.
`USER`: The institution does not support this product, and the data was manually provided by the user.

Possible values: `INSTITUTION`, `INSTITUTION_MASK`, `USER`

A description of the source of data for a given product/data type.

`INSTITUTION`: The institution supports this product, and the data was provided by the institution.
`INSTITUTION_MASK`: The user manually provided the full account number, which was matched to the account mask provided by the institution. Only applicable to the `numbers` data type.
`USER`: The institution does not support this product, and the data was manually provided by the user.

Possible values: `INSTITUTION`, `INSTITUTION_MASK`, `USER`

A description of the source of data for a given product/data type.

`INSTITUTION`: The institution supports this product, and the data was provided by the institution.
`INSTITUTION_MASK`: The user manually provided the full account number, which was matched to the account mask provided by the institution. Only applicable to the `numbers` data type.
`USER`: The institution does not support this product, and the data was manually provided by the user.

Possible values: `INSTITUTION`, `INSTITUTION_MASK`, `USER`

When true, this field indicates that the Item's portfolio was manually created with the Investments Fallback flow.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "account": {
    "account_id": "xlP8npRxwgCj48LQbjxWipkeL3gbyXf64knoy",
    "balances": {
      "available": null,
      "current": 415.57,
      "iso_currency_code": "USD",
      "limit": null,
      "margin_loan_amount": null,
      "unofficial_currency_code": null
    },
    "mask": "5555",
    "name": "Plaid IRA",
    "official_name": null,
    "subtype": "ira",
    "type": "investment"
  },
  "owners": [
    {
      "account_id": "xlP8npRxwgCj48LQbjxWipkeL3gbyXf64knoy",
      "names": [
        "Alberta Bobbeth Charleson"
      ]
    }
  ],
  "numbers": {
    "acats": [
      {
        "account": "TR5555",
        "account_id": "xlP8npRxwgCj48LQbjxWipkeL3gbyXf64knoy",
        "dtc_numbers": [
          "1111",
          "2222",
          "3333"
        ]
      }
    ]
  },
  "holdings": [
    {
      "account_id": "xlP8npRxwgCj48LQbjxWipkeL3gbyXf64knoy",
      "cost_basis": 0.01,
      "institution_price": 0.011,
      "institution_price_as_of": "2021-05-25",
      "institution_price_datetime": null,
      "institution_value": 110,
      "iso_currency_code": "USD",
      "quantity": 10000,
      "security_id": "8E4L9XLl6MudjEpwPAAgivmdZRdBPJuvMPlPb",
      "unofficial_currency_code": null,
      "vested_quantity": null,
      "vested_value": null
    },
    {
      "account_id": "xlP8npRxwgCj48LQbjxWipkeL3gbyXf64knoy",
      "cost_basis": 40,
      "institution_price": 42.15,
      "institution_price_as_of": "2021-05-25",
      "institution_price_datetime": null,
      "institution_value": 210.75,
      "iso_currency_code": "USD",
      "quantity": 5,
      "security_id": "abJamDazkgfvBkVGgnnLUWXoxnomp5up8llg4",
      "unofficial_currency_code": null,
      "vested_quantity": 7,
      "vested_value": 66
    }
  ],
  "securities": [
    {
      "close_price": 0.011,
      "close_price_as_of": null,
      "cusip": null,
      "cfi_code": "OCASPS",
      "industry": null,
      "institution_id": null,
      "institution_security_id": null,
      "is_cash_equivalent": false,
      "isin": null,
      "iso_currency_code": "USD",
      "market_identifier_code": null,
      "name": "Nflx Feb 01'18 $355 Call",
      "option_contract": null,
      "fixed_income": null,
      "proxy_security_id": null,
      "sector": null,
      "security_id": "8E4L9XLl6MudjEpwPAAgivmdZRdBPJuvMPlPb",
      "sedol": null,
      "ticker_symbol": "NFLX180201C00355000",
      "type": "derivative",
      "subtype": "option",
      "unofficial_currency_code": null,
      "update_datetime": null
    },
    {
      "close_price": 42.15,
      "close_price_as_of": null,
      "cusip": null,
      "cfi_code": "CEOIES",
      "fixed_income": null,
      "industry": null,
      "institution_id": null,
      "institution_security_id": null,
      "is_cash_equivalent": false,
      "isin": null,
      "iso_currency_code": "USD",
      "market_identifier_code": null,
      "name": "iShares Inc MSCI Brazil",
      "option_contract": null,
      "proxy_security_id": null,
      "sector": null,
      "security_id": "abJamDazkgfvBkVGgnnLUWXoxnomp5up8llg4",
      "sedol": null,
      "ticker_symbol": "EWZ",
      "type": "etf",
      "subtype": "etf",
      "unofficial_currency_code": null,
      "update_datetime": null
    }
  ],
  "data_sources": {
    "numbers": "INSTITUTION",
    "owners": "INSTITUTION",
    "holdings": "INSTITUTION"
  },
  "request_id": "m8MDnv9okwxFNBV"
}
```

=\*=\*=\*=[#### `/processor/investments/holdings/get`](/docs/api/processor-partners/#processorinvestmentsholdingsget)

[#### Retrieve Investment Holdings](/docs/api/processor-partners/#retrieve-investment-holdings)

This endpoint returns the stock position data of the account associated with a given processor token.

/processor/investments/holdings/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

The processor token obtained from the Plaid integration partner. Processor tokens are in the format: `processor-<environment>-<identifier>`

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

/processor/investments/holdings/get

Nodeâ¼

```
const request: ProcessorInvestmentsHoldingsGetRequest = {
  processor_token: processorToken,
};
const response = await plaidClient.processorInvestmentsHoldingsGet(request);
```

/processor/investments/holdings/get

**Response fields**

Collapse all

A single account at a financial institution, with additional investment-specific balance information.

Hide object

Plaid's unique identifier for the account. This value will not change unless Plaid can't reconcile the account with the data returned by the financial institution. This may occur, for example, when the name of the account changes. If this happens a new `account_id` will be assigned to the account.

The `account_id` can also change if the `access_token` is deleted and the same credentials that were used to generate that `access_token` are used to generate a new `access_token` on a later date. In that case, the new `account_id` will be different from the old `account_id`.

If an account with a specific `account_id` disappears instead of changing, the account is likely closed. Closed accounts are not returned by the Plaid API.

When using a CRA endpoint (an endpoint associated with Plaid Check Consumer Report, i.e. any endpoint beginning with `/cra/`), the `account_id` returned will not match the `account_id` returned by a non-CRA endpoint.

Like all Plaid identifiers, the `account_id` is case sensitive.

A set of fields describing the balance for an account, including margin loan information for investment accounts.

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

The total amount of borrowed funds in the account, as determined by the financial institution.
For investment-type accounts, the margin balance is the total value of borrowed assets in the account, as presented by the institution.
This is commonly referred to as margin or a loan.

Format: `double`

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

The holdings belonging to investment accounts associated with the Item. Details of the securities in the holdings are provided in the `securities` field.

Hide object

The Plaid `account_id` associated with the holding.

The Plaid `security_id` associated with the holding. Security data is not specific to a user's account; any user who held the same security at the same financial institution at the same time would have identical security data. The `security_id` for the same security will typically be the same across different institutions, but this is not guaranteed. The `security_id` does not typically change, but may change if inherent details of the security change due to a corporate action, for example, in the event of a ticker symbol change or CUSIP change.

The last price given by the institution for this security.

Format: `double`

The date at which `institution_price` was current.

Format: `date`

Date and time at which `institution_price` was current, in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ).

This field is returned for select financial institutions and comes as provided by the institution. It may contain default time values (such as 00:00:00).

Format: `date-time`

The value of the holding, as reported by the institution.

Format: `double`

The total cost basis of the holding (e.g., the total amount spent to acquire all assets currently in the holding).

Format: `double`

The total quantity of the asset held, as reported by the financial institution. If the security is an option, `quantity` will reflect the total number of options (typically the number of contracts multiplied by 100), not the number of contracts.

Format: `double`

The ISO-4217 currency code of the holding. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the holding. Always `null` if `iso_currency_code` is non-`null`. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `iso_currency_code`s.

The total quantity of vested assets held, as reported by the financial institution. Vested assets are only associated with [equities](https://plaid.com/docs/api/products/investments/#investments-holdings-get-response-securities-type).

Format: `double`

The value of the vested holdings as reported by the institution.

Format: `double`

Per-lot acquisition data for this holding. An empty array indicates the institution does not provide lot-level data.

Hide object

The financial institution's identifier for this lot. Null if the institution does not provide a lot identifier.

The date and time this lot was acquired, in ISO 8601 format. Null if the institution does not provide acquisition datetime data.

Format: `date-time`

The number of units of the security in this lot.

Format: `double`

The price per unit of the security at the time this lot was acquired.

Format: `double`

The total cost basis of this lot, inclusive of any fees.

Format: `double`

The current market value of this lot.

Format: `double`

Indicates whether a holding lot position is long or short. Possible values are `LONG` and `SHORT`.

Possible values: `LONG`, `SHORT`

Objects describing the securities held in the account.

Hide object

A unique, Plaid-specific identifier for the security, used to associate securities with holdings. Like all Plaid identifiers, the `security_id` is case sensitive. The `security_id` may change if inherent details of the security change due to a corporate action, for example, in the event of a ticker symbol change or CUSIP change.

12-character ISIN, a globally unique securities identifier. A verified CUSIP Global Services license is required to receive this data. This field will be null by default for new customers, and null for existing customers starting March 12, 2024. If you would like access to this field, please start the verification process [here](https://docs.google.com/forms/d/e/1FAIpQLSd9asHEYEfmf8fxJTHZTAfAzW4dugsnSu-HS2J51f1mxwd6Sw/viewform).

9-character CUSIP, an identifier assigned to North American securities. A verified CUSIP Global Services license is required to receive this data. This field will be null by default for new customers, and null for existing customers starting March 12, 2024. If you would like access to this field, please start the verification process [here](https://docs.google.com/forms/d/e/1FAIpQLSd9asHEYEfmf8fxJTHZTAfAzW4dugsnSu-HS2J51f1mxwd6Sw/viewform).

(Deprecated) 7-character SEDOL, an identifier assigned to securities in the UK.

An identifier given to the security by the institution

If `institution_security_id` is present, this field indicates the Plaid `institution_id` of the institution to whom the identifier belongs.

In certain cases, Plaid will provide the ID of another security whose performance resembles this security, typically when the original security has low volume, or when a private security can be modeled with a publicly traded security.

A descriptive name for the security, suitable for display.

The security's trading symbol for publicly traded securities, and otherwise a short identifier if available.

Indicates that a security is a highly liquid asset and can be treated like cash.

The security type of the holding.

In rare instances, a null value is returned when institutional data is insufficient to determine the security type.

Valid security types are:

`cash`: Cash, currency, and money market funds

`cryptocurrency`: Digital or virtual currencies

`derivative`: Options, warrants, and other derivative instruments

`equity`: Domestic and foreign equities

`etf`: Multi-asset exchange-traded investment funds

`fixed income`: Bonds and certificates of deposit (CDs)

`loan`: Loans and loan receivables

`mutual fund`: Open- and closed-end vehicles pooling funds of multiple investors

`other`: Unknown or other investment types

The security subtype of the holding.

In rare instances, a null value is returned when institutional data is insufficient to determine the security subtype.

Possible values: `asset backed security`, `bill`, `bond`, `bond with warrants`, `cash`, `cash management bill`, `common stock`, `convertible bond`, `convertible equity`, `cryptocurrency`, `depositary receipt`, `depositary receipt on debt`, `etf`, `float rating note`, `fund of funds`, `hedge fund`, `limited partnership unit`, `medium term note`, `money market debt`, `mortgage backed security`, `municipal bond`, `mutual fund`, `note`, `option`, `other`, `preferred convertible`, `preferred equity`, `private equity fund`, `real estate investment trust`, `structured equity product`, `treasury inflation protected securities`, `unit`, `warrant`.

Price of the security at the close of the previous trading session. Null for non-public securities.

If the security is a foreign currency this field will be updated daily and will be priced in USD.

If the security is a cryptocurrency, this field will be updated multiple times a day. As crypto prices can fluctuate quickly and data may become stale sooner than other asset classes, refer to `update_datetime` with the time when the price was last updated.

Format: `double`

Date for which `close_price` is accurate. Always `null` if `close_price` is `null`.

Format: `date`

Date and time at which `close_price` is accurate, in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ). Always `null` if `close_price` is `null`.

Format: `date-time`

The ISO-4217 currency code of the price given. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the security. Always `null` if `iso_currency_code` is non-`null`. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `iso_currency_code`s.

The ISO-10383 Market Identifier Code of the exchange or market in which the security is being traded.

The sector classification of the security, such as Finance, Health Technology, etc.

For a complete list of possible values, please refer to the ["Sectors and Industries" spreadsheet](https://docs.google.com/spreadsheets/d/1L7aXUdqLhxgM8qe7hK67qqKXiUdQqILpwZ0LpxvCVnc).

The industry classification of the security, such as Biotechnology, Airlines, etc.

For a complete list of possible values, please refer to the ["Sectors and Industries" spreadsheet](https://docs.google.com/spreadsheets/d/1L7aXUdqLhxgM8qe7hK67qqKXiUdQqILpwZ0LpxvCVnc).

The ISO-10962 Classification of Financial Instruments Code used to classify the security based on its structure and function.

Details about the option security.

For the Sandbox environment, this data is currently only available if the Item is using a [custom Sandbox user](https://plaid.com/docs/sandbox/user-custom/) and the `ticker` field of the custom security follows the [OCC Option Symbol](https://en.wikipedia.org/wiki/Option_symbol#The_OCC_Option_Symbol) standard with no spaces. For an example of simulating this in Sandbox, see the [custom Sandbox GitHub](https://github.com/plaid/sandbox-custom-users).

Hide object

The type of this option contract. It is one of:

`put`: for Put option contracts

`call`: for Call option contracts

The expiration date for this option contract, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date`

The strike price for this option contract, per share of security.

Format: `double`

The ticker of the underlying security for this option contract.

Details about the fixed income security.

Hide object

Details about a fixed income security's expected rate of return.

Hide object

The fixed income security's expected rate of return.

Format: `double`

The type of rate which indicates how the predicted yield was calculated. It is one of:

`coupon`: the annualized interest rate for securities with a one-year term or longer, such as treasury notes and bonds.

`coupon_equivalent`: the calculated equivalent for the annualized interest rate factoring in the discount rate and time to maturity, for shorter term, non-interest-bearing securities such as treasury bills.

`discount`: the rate at which the present value or cost is discounted from the future value upon maturity, also known as the face value.

`yield`: the total predicted rate of return factoring in both the discount rate and the coupon rate, applicable to securities such as exchange-traded bonds which can both be interest-bearing as well as sold at a discount off their face value.

Possible values: `coupon`, `coupon_equivalent`, `discount`, `yield`, `null`

The maturity date for this fixed income security, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date`

The issue date for this fixed income security, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date`

The face value that is paid upon maturity of the fixed income security, per unit of security.

Format: `double`

When true, this field indicates that the Item's portfolio was manually created with the Investments Fallback flow.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "account": {
    "account_id": "JqMLm4rJwpF6gMPJwBqdh9ZjjPvvpDcb7kDK1",
    "balances": {
      "available": null,
      "current": 110.01,
      "iso_currency_code": "USD",
      "limit": null,
      "margin_loan_amount": null,
      "unofficial_currency_code": null
    },
    "mask": "5555",
    "name": "Plaid IRA",
    "official_name": null,
    "subtype": "ira",
    "type": "investment"
  },
  "holdings": [
    {
      "account_id": "JqMLm4rJwpF6gMPJwBqdh9ZjjPvvpDcb7kDK1",
      "cost_basis": 1,
      "institution_price": 1,
      "institution_price_as_of": "2021-04-13",
      "institution_price_datetime": null,
      "institution_value": 0.01,
      "iso_currency_code": "USD",
      "quantity": 0.01,
      "security_id": "d6ePmbPxgWCWmMVv66q9iPV94n91vMtov5Are",
      "unofficial_currency_code": null,
      "vested_quantity": null,
      "vested_value": null
    },
    {
      "account_id": "JqMLm4rJwpF6gMPJwBqdh9ZjjPvvpDcb7kDK1",
      "cost_basis": 0.01,
      "institution_price": 0.011,
      "institution_price_as_of": "2021-04-13",
      "institution_price_datetime": null,
      "institution_value": 110,
      "iso_currency_code": "USD",
      "quantity": 10000,
      "security_id": "8E4L9XLl6MudjEpwPAAgivmdZRdBPJuvMPlPb",
      "unofficial_currency_code": null,
      "vested_quantity": null,
      "vested_value": null
    }
  ],
  "securities": [
    {
      "close_price": 0.011,
      "close_price_as_of": "2021-04-13",
      "cusip": null,
      "institution_id": null,
      "institution_security_id": null,
      "is_cash_equivalent": false,
      "isin": null,
      "iso_currency_code": "USD",
      "name": "Nflx Feb 01'18 $355 Call",
      "proxy_security_id": null,
      "security_id": "8E4L9XLl6MudjEpwPAAgivmdZRdBPJuvMPlPb",
      "sedol": null,
      "ticker_symbol": "NFLX180201C00355000",
      "type": "derivative",
      "subtype": "option",
      "unofficial_currency_code": null,
      "update_datetime": null,
      "market_identifier_code": "XNAS",
      "sector": "Technology Services",
      "industry": "Internet Software or Services",
      "cfi_code": "OCASPS",
      "option_contract": {
        "contract_type": "call",
        "expiration_date": "2018-02-01",
        "strike_price": 355,
        "underlying_security_ticker": "NFLX"
      },
      "fixed_income": null
    },
    {
      "close_price": 1,
      "close_price_as_of": null,
      "cusip": null,
      "institution_id": null,
      "institution_security_id": null,
      "is_cash_equivalent": true,
      "isin": null,
      "iso_currency_code": "USD",
      "name": "U S Dollar",
      "proxy_security_id": null,
      "security_id": "d6ePmbPxgWCWmMVv66q9iPV94n91vMtov5Are",
      "sedol": null,
      "ticker_symbol": "USD",
      "type": "cash",
      "subtype": "cash",
      "unofficial_currency_code": null,
      "update_datetime": null,
      "market_identifier_code": null,
      "sector": null,
      "industry": null,
      "cfi_code": null,
      "option_contract": null,
      "fixed_income": null
    }
  ],
  "request_id": "24MxmGFZz89Xg2f"
}
```

=\*=\*=\*=[#### `/processor/investments/transactions/get`](/docs/api/processor-partners/#processorinvestmentstransactionsget)

[#### Get investment transactions data](/docs/api/processor-partners/#get-investment-transactions-data)

The [`/processor/investments/transactions/get`](/docs/api/processor-partners/#processorinvestmentstransactionsget) endpoint allows developers to retrieve up to 24 months of user-authorized transaction data for the investment account associated with the processor token.

Transactions are returned in reverse-chronological order, and the sequence of transaction ordering is stable and will not shift.

Due to the potentially large number of investment transactions associated with the account, results are paginated. Manipulate the count and offset parameters in conjunction with the `total_investment_transactions` response body field to fetch all available investment transactions.

Note that Investments does not have a webhook to indicate when initial transaction data has loaded (unless you use the `async_update` option). Instead, if transactions data is not ready when [`/processor/investments/transactions/get`](/docs/api/processor-partners/#processorinvestmentstransactionsget) is first called, Plaid will wait for the data. For this reason, calling [`/processor/investments/transactions/get`](/docs/api/processor-partners/#processorinvestmentstransactionsget) immediately after Link may take up to one to two minutes to return.

Data returned by the asynchronous investments extraction flow (when `async_update` is set to true) may not be immediately available to [`/processor/investments/transactions/get`](/docs/api/processor-partners/#processorinvestmentstransactionsget). To be alerted when the data is ready to be fetched, listen for the `HISTORICAL_UPDATE` webhook. If no investments history is ready when [`/processor/investments/transactions/get`](/docs/api/processor-partners/#processorinvestmentstransactionsget) is called, it will return a `PRODUCT_NOT_READY` error.

To receive Investments Transactions webhooks for a processor token, set its webhook URL via the [[`/processor/token/webhook/update`](https://plaid.com/docs/api/processor-partners/#processortokenwebhookupdate)](/docs/api/processor-partners/#processortokenwebhookupdate) endpoint.

/processor/investments/transactions/get

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

An optional object to filter `/investments/transactions/get` results. If provided, must be non-`null`.

Hide object

An array of `account_ids` to retrieve for the Item.

The number of transactions to fetch.

Default: `100`

Minimum: `1`

Maximum: `500`

The number of transactions to skip when fetching transaction history

Default: `0`

Minimum: `0`

If the Item was not initialized with the investments product via the `products`, `required_if_supported_products`, or `optional_products` array when calling `/link/token/create`, and `async_update` is set to true, the initial Investments extraction will happen asynchronously. Plaid will subsequently fire a `HISTORICAL_UPDATE` webhook when the extraction completes. When `false`, Plaid will wait to return a response until extraction completion and no `HISTORICAL_UPDATE` webhook will fire. Note that while the extraction is happening asynchronously, calls to `/investments/transactions/get` and `/investments/refresh` will return `PRODUCT_NOT_READY` errors until the extraction completes.

Default: `false`

The processor token obtained from the Plaid integration partner. Processor tokens are in the format: `processor-<environment>-<identifier>`

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The earliest date for which data should be returned. Dates should be formatted as YYYY-MM-DD.

Format: `date`

The latest date for which data should be returned. Dates should be formatted as YYYY-MM-DD.

Format: `date`

/processor/investments/transactions/get

Nodeâ¼

```
const request: ProcessorInvestmentsTransactionsGetRequest = {
  processor_token: processorToken,
  start_date: '2024-01-01',
  end_date: '2024-03-31',
};
const response = await plaidClient.processorInvestmentsTransactionsGet(request);
```

/processor/investments/transactions/get

**Response fields**

Collapse all

A single account at a financial institution, with additional investment-specific balance information.

Hide object

Plaid's unique identifier for the account. This value will not change unless Plaid can't reconcile the account with the data returned by the financial institution. This may occur, for example, when the name of the account changes. If this happens a new `account_id` will be assigned to the account.

The `account_id` can also change if the `access_token` is deleted and the same credentials that were used to generate that `access_token` are used to generate a new `access_token` on a later date. In that case, the new `account_id` will be different from the old `account_id`.

If an account with a specific `account_id` disappears instead of changing, the account is likely closed. Closed accounts are not returned by the Plaid API.

When using a CRA endpoint (an endpoint associated with Plaid Check Consumer Report, i.e. any endpoint beginning with `/cra/`), the `account_id` returned will not match the `account_id` returned by a non-CRA endpoint.

Like all Plaid identifiers, the `account_id` is case sensitive.

A set of fields describing the balance for an account, including margin loan information for investment accounts.

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

The total amount of borrowed funds in the account, as determined by the financial institution.
For investment-type accounts, the margin balance is the total value of borrowed assets in the account, as presented by the institution.
This is commonly referred to as margin or a loan.

Format: `double`

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

An array containing investment transactions from the account. Investments transactions are returned in reverse chronological order, with the most recent at the beginning of the array. The maximum number of transactions returned is determined by the `count` parameter.

Hide object

The ID of the Investment transaction, unique across all Plaid transactions. Like all Plaid identifiers, the `investment_transaction_id` is case sensitive.

The `account_id` of the account against which this transaction posted.

The `security_id` to which this transaction is related.

The [ISO 8601](https://wikipedia.org/wiki/ISO_8601) posting date for the transaction. This is typically the settlement date.

Format: `date`

Timestamp in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (`YYYY-MM-DDTHH:mm:ssZ`) representing when the order type was initiated. This field is returned for select financial institutions and reflects the value provided by the institution.

Format: `date-time`

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

All securities for which there is a corresponding transaction being fetched.

Hide object

A unique, Plaid-specific identifier for the security, used to associate securities with holdings. Like all Plaid identifiers, the `security_id` is case sensitive. The `security_id` may change if inherent details of the security change due to a corporate action, for example, in the event of a ticker symbol change or CUSIP change.

12-character ISIN, a globally unique securities identifier. A verified CUSIP Global Services license is required to receive this data. This field will be null by default for new customers, and null for existing customers starting March 12, 2024. If you would like access to this field, please start the verification process [here](https://docs.google.com/forms/d/e/1FAIpQLSd9asHEYEfmf8fxJTHZTAfAzW4dugsnSu-HS2J51f1mxwd6Sw/viewform).

9-character CUSIP, an identifier assigned to North American securities. A verified CUSIP Global Services license is required to receive this data. This field will be null by default for new customers, and null for existing customers starting March 12, 2024. If you would like access to this field, please start the verification process [here](https://docs.google.com/forms/d/e/1FAIpQLSd9asHEYEfmf8fxJTHZTAfAzW4dugsnSu-HS2J51f1mxwd6Sw/viewform).

(Deprecated) 7-character SEDOL, an identifier assigned to securities in the UK.

An identifier given to the security by the institution

If `institution_security_id` is present, this field indicates the Plaid `institution_id` of the institution to whom the identifier belongs.

In certain cases, Plaid will provide the ID of another security whose performance resembles this security, typically when the original security has low volume, or when a private security can be modeled with a publicly traded security.

A descriptive name for the security, suitable for display.

The security's trading symbol for publicly traded securities, and otherwise a short identifier if available.

Indicates that a security is a highly liquid asset and can be treated like cash.

The security type of the holding.

In rare instances, a null value is returned when institutional data is insufficient to determine the security type.

Valid security types are:

`cash`: Cash, currency, and money market funds

`cryptocurrency`: Digital or virtual currencies

`derivative`: Options, warrants, and other derivative instruments

`equity`: Domestic and foreign equities

`etf`: Multi-asset exchange-traded investment funds

`fixed income`: Bonds and certificates of deposit (CDs)

`loan`: Loans and loan receivables

`mutual fund`: Open- and closed-end vehicles pooling funds of multiple investors

`other`: Unknown or other investment types

The security subtype of the holding.

In rare instances, a null value is returned when institutional data is insufficient to determine the security subtype.

Possible values: `asset backed security`, `bill`, `bond`, `bond with warrants`, `cash`, `cash management bill`, `common stock`, `convertible bond`, `convertible equity`, `cryptocurrency`, `depositary receipt`, `depositary receipt on debt`, `etf`, `float rating note`, `fund of funds`, `hedge fund`, `limited partnership unit`, `medium term note`, `money market debt`, `mortgage backed security`, `municipal bond`, `mutual fund`, `note`, `option`, `other`, `preferred convertible`, `preferred equity`, `private equity fund`, `real estate investment trust`, `structured equity product`, `treasury inflation protected securities`, `unit`, `warrant`.

Price of the security at the close of the previous trading session. Null for non-public securities.

If the security is a foreign currency this field will be updated daily and will be priced in USD.

If the security is a cryptocurrency, this field will be updated multiple times a day. As crypto prices can fluctuate quickly and data may become stale sooner than other asset classes, refer to `update_datetime` with the time when the price was last updated.

Format: `double`

Date for which `close_price` is accurate. Always `null` if `close_price` is `null`.

Format: `date`

Date and time at which `close_price` is accurate, in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ). Always `null` if `close_price` is `null`.

Format: `date-time`

The ISO-4217 currency code of the price given. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the security. Always `null` if `iso_currency_code` is non-`null`. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `iso_currency_code`s.

The ISO-10383 Market Identifier Code of the exchange or market in which the security is being traded.

The sector classification of the security, such as Finance, Health Technology, etc.

For a complete list of possible values, please refer to the ["Sectors and Industries" spreadsheet](https://docs.google.com/spreadsheets/d/1L7aXUdqLhxgM8qe7hK67qqKXiUdQqILpwZ0LpxvCVnc).

The industry classification of the security, such as Biotechnology, Airlines, etc.

For a complete list of possible values, please refer to the ["Sectors and Industries" spreadsheet](https://docs.google.com/spreadsheets/d/1L7aXUdqLhxgM8qe7hK67qqKXiUdQqILpwZ0LpxvCVnc).

The ISO-10962 Classification of Financial Instruments Code used to classify the security based on its structure and function.

Details about the option security.

For the Sandbox environment, this data is currently only available if the Item is using a [custom Sandbox user](https://plaid.com/docs/sandbox/user-custom/) and the `ticker` field of the custom security follows the [OCC Option Symbol](https://en.wikipedia.org/wiki/Option_symbol#The_OCC_Option_Symbol) standard with no spaces. For an example of simulating this in Sandbox, see the [custom Sandbox GitHub](https://github.com/plaid/sandbox-custom-users).

Hide object

The type of this option contract. It is one of:

`put`: for Put option contracts

`call`: for Call option contracts

The expiration date for this option contract, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date`

The strike price for this option contract, per share of security.

Format: `double`

The ticker of the underlying security for this option contract.

Details about the fixed income security.

Hide object

Details about a fixed income security's expected rate of return.

Hide object

The fixed income security's expected rate of return.

Format: `double`

The type of rate which indicates how the predicted yield was calculated. It is one of:

`coupon`: the annualized interest rate for securities with a one-year term or longer, such as treasury notes and bonds.

`coupon_equivalent`: the calculated equivalent for the annualized interest rate factoring in the discount rate and time to maturity, for shorter term, non-interest-bearing securities such as treasury bills.

`discount`: the rate at which the present value or cost is discounted from the future value upon maturity, also known as the face value.

`yield`: the total predicted rate of return factoring in both the discount rate and the coupon rate, applicable to securities such as exchange-traded bonds which can both be interest-bearing as well as sold at a discount off their face value.

Possible values: `coupon`, `coupon_equivalent`, `discount`, `yield`, `null`

The maturity date for this fixed income security, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date`

The issue date for this fixed income security, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date`

The face value that is paid upon maturity of the fixed income security, per unit of security.

Format: `double`

The total number of transactions available within the date range specified. If `total_investment_transactions` is larger than the size of the `transactions` array, more transactions are available and can be fetched via manipulating the `offset` parameter.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

When true, this field indicates that the Item's portfolio was manually created with the Investments Fallback flow.

Response Object

```
{
  "account": {
    "account_id": "rz99ex9ZQotvnjXdgQLEsR81e3ArPgulVWjGj",
    "balances": {
      "available": null,
      "current": 23631.9805,
      "iso_currency_code": "USD",
      "limit": null,
      "margin_loan_amount": null,
      "unofficial_currency_code": null
    },
    "mask": "6666",
    "name": "Plaid 401k",
    "official_name": null,
    "subtype": "401k",
    "type": "investment"
  },
  "investment_transactions": [
    {
      "account_id": "rz99ex9ZQotvnjXdgQLEsR81e3ArPgulVWjGj",
      "amount": -8.72,
      "cancel_transaction_id": null,
      "date": "2020-05-29",
      "transaction_datetime": null,
      "fees": 0,
      "investment_transaction_id": "oq99Pz97joHQem4BNjXECev1E4B6L6sRzwANW",
      "iso_currency_code": "USD",
      "name": "INCOME DIV DIVIDEND RECEIVED",
      "price": 0,
      "quantity": 0,
      "security_id": "eW4jmnjd6AtjxXVrjmj6SX1dNEdZp3Cy8RnRQ",
      "subtype": "dividend",
      "type": "cash",
      "unofficial_currency_code": null
    },
    {
      "account_id": "rz99ex9ZQotvnjXdgQLEsR81e3ArPgulVWjGj",
      "amount": -1289.01,
      "cancel_transaction_id": null,
      "date": "2020-05-28",
      "transaction_datetime": "2020-05-28T15:10:09Z",
      "fees": 7.99,
      "investment_transaction_id": "pK99jB9e7mtwjA435GpVuMvmWQKVbVFLWme57",
      "iso_currency_code": "USD",
      "name": "SELL Matthews Pacific Tiger Fund Insti Class",
      "price": 27.53,
      "quantity": -47.74104242992852,
      "security_id": "JDdP7XPMklt5vwPmDN45t3KAoWAPmjtpaW7DP",
      "subtype": "sell",
      "type": "sell",
      "unofficial_currency_code": null
    }
  ],
  "request_id": "iv4q3ZlytOOthkv",
  "securities": [
    {
      "close_price": 27,
      "close_price_as_of": null,
      "cusip": "577130834",
      "institution_id": null,
      "institution_security_id": null,
      "is_cash_equivalent": false,
      "isin": "US5771308344",
      "iso_currency_code": "USD",
      "name": "Matthews Pacific Tiger Fund Insti Class",
      "proxy_security_id": null,
      "security_id": "JDdP7XPMklt5vwPmDN45t3KAoWAPmjtpaW7DP",
      "sedol": null,
      "ticker_symbol": "MIPTX",
      "type": "mutual fund",
      "subtype": "mutual fund",
      "unofficial_currency_code": null,
      "update_datetime": null,
      "market_identifier_code": "XNAS",
      "sector": "Miscellaneous",
      "industry": "Investment Trusts or Mutual Funds",
      "cfi_code": "CIOGES",
      "option_contract": null,
      "fixed_income": null
    },
    {
      "close_price": 34.73,
      "close_price_as_of": null,
      "cusip": "84470P109",
      "institution_id": null,
      "institution_security_id": null,
      "is_cash_equivalent": false,
      "isin": "US84470P1093",
      "iso_currency_code": "USD",
      "name": "Southside Bancshares Inc.",
      "proxy_security_id": null,
      "security_id": "eW4jmnjd6AtjxXVrjmj6SX1dNEdZp3Cy8RnRQ",
      "sedol": null,
      "ticker_symbol": "SBSI",
      "type": "equity",
      "subtype": "common stock",
      "unofficial_currency_code": null,
      "update_datetime": null,
      "market_identifier_code": "XNAS",
      "sector": "Finance",
      "industry": "Regional Banks",
      "cfi_code": "ESVUFR",
      "option_contract": null,
      "fixed_income": null
    }
  ],
  "total_investment_transactions": 2
}
```

=\*=\*=\*=[#### `/processor/signal/evaluate`](/docs/api/processor-partners/#processorsignalevaluate)

[#### Evaluate a planned ACH transaction](/docs/api/processor-partners/#evaluate-a-planned-ach-transaction)

Use [`/processor/signal/evaluate`](/docs/api/processor-partners/#processorsignalevaluate) to evaluate a planned ACH transaction to get a return risk assessment and additional risk signals.

[`/processor/signal/evaluate`](/docs/api/processor-partners/#processorsignalevaluate) uses Rulesets that are configured on the end customer's Dashboard and can be used with either the Signal Transaction Scores product or the Balance product. Which product is used will be determined by the `ruleset_key` that you provide. Note that only customer-configured rulesets work with this endpoint; as a processor partner, you cannot create or configure your own rulesets. For more details, see [Signal Rules](https://plaid.com/docs/signal/signal-rules/).

Note: This request may have higher latency if Signal Transaction Scores is being added to an existing Item for the first time, or when using a Balance-only ruleset. This is because Plaid must communicate directly with the institution to request data.

/processor/signal/evaluate

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The processor token obtained from the Plaid integration partner. Processor tokens are in the format: `processor-<environment>-<identifier>`

The unique ID that you would like to use to refer to this transaction. For your convenience mapping your internal data, you could use your internal ID/identifier for this transaction. The max length for this field is 36 characters.

Min length: `1`

Max length: `36`

The transaction amount, in USD (e.g. `102.05`)

Format: `double`

`true` if the end user is present while initiating the ACH transfer and the endpoint is being called; `false` otherwise (for example, when the ACH transfer is scheduled and the end user is not present, or you call this endpoint after the ACH transfer but before submitting the Nacha file for ACH processing).

A unique ID that identifies the end user in your system. This ID is used to correlate requests by a user with multiple Items. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

**true** if the ACH transaction is a recurring transaction; **false** otherwise.

The default ACH or non-ACH payment method to complete the transaction.
`SAME_DAY_ACH`: Same Day ACH by Nacha. The debit transaction is processed and settled on the same day.
`STANDARD_ACH`: Standard ACH by Nacha.
`MULTIPLE_PAYMENT_METHODS`: If there is no default debit rail or there are multiple payment methods.
Possible values: `SAME_DAY_ACH`, `STANDARD_ACH`, `MULTIPLE_PAYMENT_METHODS`

Details about the end user initiating the transaction (i.e., the account holder). These fields are optional, but strongly recommended to increase the accuracy of results when using Signal Transaction Scores. When using a Balance-only ruleset, if the Signal Addendum has been signed, these fields are ignored; if the Addendum has not been signed, using these fields will result in an error.

Hide object

The user's legal name

Hide object

The user's name prefix (e.g. "Mr.")

The user's given name. If the user has a one-word name, it should be provided in this field.

The user's middle name

The user's family name / surname

The user's name suffix (e.g. "II")

The user's phone number, in E.164 format: +{countrycode}{number}. For example: "+14151234567"

The user's email address.

Data about the components comprising an address.

Hide object

The full city name

The region or state
Example: `"NC"`

The full street address
Example: `"564 Main Street, APT 15"`

The postal code

The ISO 3166-1 alpha-2 country code

Details about the end user's device. These fields are optional, but strongly recommended to increase the accuracy of results when using Signal Transaction Scores. When using a Balance-only Ruleset, these fields are ignored if the Signal Addendum has been signed; if it has not been signed, using these fields will result in an error.

Hide object

The IP address of the device that initiated the transaction

The user agent of the device that initiated the transaction (e.g. "Mozilla/5.0")

The key of the ruleset to use for this transaction. You can configure a ruleset using the Plaid Dashboard, under [Signal->Rules](https://dashboard.plaid.com/signal/risk-profiles). If not provided, for customers who began using Signal Transaction Scores before October 15, 2025, by default, no ruleset will be used; for customers who began using Signal Transaction Scores after that date, or for Balance customers, the `default` ruleset will be used. For more details, or to opt out of using a ruleset, see [Signal Rules](https://plaid.com/docs/signal/signal-rules/).

/processor/signal/evaluate

Nodeâ¼

```
const eval_request = {
  processor_token: 'processor-sandbox-71e02f71-0960-4a27-abd2-5631e04f2175',
  client_transaction_id: 'txn12345',
  amount: 123.45,
  client_user_id: 'user1234',
  user: {
    name: {
      prefix: 'Ms.',
      given_name: 'Jane',
      middle_name: 'Leah',
      family_name: 'Doe',
      suffix: 'Jr.',
    },
    phone_number: '+14152223333',
    email_address: 'jane.doe@example.com',
    address: {
      street: '2493 Leisure Lane',
      city: 'San Matias',
      region: 'CA',
      postal_code: '93405-2255',
      country: 'US',
    },
  },
  device: {
    ip_address: '198.30.2.2',
    user_agent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1',
  },
  user_present: true,
};

try {
  const eval_response = await plaidClient.processorSignalEvaluate(eval_request);
  const core_attributes = eval_response.data.core_attributes;
  const scores = eval_response.data.scores;
} catch (error) {
  // handle error
}
```

/processor/signal/evaluate

**Response fields**

Collapse all

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Risk scoring details broken down by risk category. When using a Balance-only ruleset, this object will not be returned.

Hide object

The object contains a risk score and a risk tier that evaluate the transaction return risk of an unauthorized debit. Common return codes in this category include: "R05", "R07", "R10", "R11", "R29". These returns typically have a return time frame of up to 60 calendar days. During this period, customers of financial institutions can dispute a transaction as unauthorized.

Hide object

A score from 1-99 that indicates the transaction return risk: a higher risk score suggests a higher return likelihood.

Minimum: `1`

Maximum: `99`

The object contains a risk score and a risk tier that evaluate the transaction return risk because an account is overdrawn or because an ineligible account is used. Common return codes in this category include: "R01", "R02", "R03", "R04", "R06", "R08", "R09", "R13", "R16", "R17", "R20", "R23". These returns have a turnaround time of 2 banking days.

Hide object

A score from 1-99 that indicates the transaction return risk: a higher risk score suggests a higher return likelihood.

Minimum: `1`

Maximum: `99`

The core attributes object contains additional data that can be used to assess the ACH return risk.

If using a Balance-only ruleset, only `available_balance` and `current_balance` will be returned as core attributes. If using a Signal Transaction Scores ruleset, over 80 core attributes will be returned. Examples of attributes include:

`available_balance` and `current_balance`: The balance in the ACH transaction funding account
`days_since_first_plaid_connection`: The number of days since the first time the Item was connected to an application via Plaid
`plaid_connections_count_7d`: The number of times the Item has been connected to applications via Plaid over the past 7 days
`plaid_connections_count_30d`: The number of times the Item has been connected to applications via Plaid over the past 30 days
`total_plaid_connections_count`: The number of times the Item has been connected to applications via Plaid
`is_savings_or_money_market_account`: Indicates whether the ACH transaction funding account is a savings/money market account

For the full list and detailed documentation of core attributes available, or to request that core attributes not be returned, contact sales or your Plaid account manager.

Details about the transaction result after evaluation by the requested Ruleset. If a `ruleset_key` is not provided, for customers who began using Signal Transaction Scores before October 15, 2025, by default, this field will be omitted. To learn more, see [Signal Rules](https://plaid.com/docs/signal/signal-rules/).

Hide object

The key of the Ruleset used for this transaction.

The result of the rule that was triggered for this transaction.

`ACCEPT`: Accept the transaction for processing.
`REROUTE`: Reroute the transaction to a different payment method, as this transaction is too risky.
`REVIEW`: Review the transaction before proceeding.

Possible values: `ACCEPT`, `REROUTE`, `REVIEW`

Rules are run in numerical order. The first rule with a logic match is triggered. These are the details of that rule.

Hide object

An optional message attached to the triggered rule, defined within the Dashboard, for your internal use. Useful for debugging, such as "Account appears to be closed."

A string key, defined within the Dashboard, used to trigger programmatic behavior for a certain result. For instance, you could optionally choose to define a "3-day-hold" `custom_action_key` for an ACCEPT result.

If bank information was not available to be used in the Signal Transaction Scores model, this array contains warnings describing why bank data is missing. If you want to receive an API error instead of scores in the case of missing bank data, file a support ticket or contact your Plaid account manager.

Hide object

A broad categorization of the warning. Safe for programmatic use.

The warning code identifies a specific kind of warning that pertains to the error causing bank data to be missing. Safe for programmatic use. For more details on warning codes, please refer to Plaid standard error codes documentation. If you receive the `ITEM_LOGIN_REQUIRED` warning, we recommend re-authenticating your user by implementing Link's update mode. This will guide your user to fix their credentials, allowing Plaid to start fetching data again for future requests.

A developer-friendly representation of the warning type. This may change over time and is not safe for programmatic use.

Response Object

```
{
  "ruleset": {
    "result": "ACCEPT",
    "ruleset_key": "primary-ruleset",
    "triggered_rule_details": {}
  },
  "scores": {
    "customer_initiated_return_risk": {
      "score": 9
    },
    "bank_initiated_return_risk": {
      "score": 72
    }
  },
  "core_attributes": {
    "available_balance": 2000,
    "current_balance": 2200
  },
  "warnings": [],
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/processor/liabilities/get`](/docs/api/processor-partners/#processorliabilitiesget)

[#### Retrieve Liabilities data](/docs/api/processor-partners/#retrieve-liabilities-data)

The [`/processor/liabilities/get`](/docs/api/processor-partners/#processorliabilitiesget) endpoint returns various details about a loan or credit account. Liabilities data is available primarily for US financial institutions, with some limited coverage of Canadian institutions. Currently supported account types are account type `credit` with account subtype `credit card` or `paypal`, and account type `loan` with account subtype `student` or `mortgage`.

The types of information returned by Liabilities can include balances and due dates, loan terms, and account details such as original loan amount and guarantor. Data is refreshed approximately once per day; the latest data can be retrieved by calling [`/processor/liabilities/get`](/docs/api/processor-partners/#processorliabilitiesget).

Note: This request may take some time to complete if `liabilities` was not specified as an initial product when creating the processor token. This is because Plaid must communicate directly with the institution to retrieve the additional data.

/processor/liabilities/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The processor token obtained from the Plaid integration partner. Processor tokens are in the format: `processor-<environment>-<identifier>`

/processor/liabilities/get

Nodeâ¼

```
const request: ProcessorLiabilitiesGetRequest = {
  processor_token: processorToken,
};
const response = await plaidClient.processorLiabilitiesGet(request);
```

/processor/liabilities/get

**Response fields**

Collapse all

A single account at a financial institution.

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

An object containing liability accounts

Hide object

The credit accounts returned.

Hide object

The ID of the account that this liability belongs to.

The various interest rates that apply to the account. APR information is not provided by all card issuers; if APR data is not available, this array will be empty.

Hide object

Annual Percentage Rate applied.

Format: `double`

The type of balance to which the APR applies.

Possible values: `balance_transfer_apr`, `cash_apr`, `purchase_apr`, `special`

Amount of money that is subjected to the APR if a balance was carried beyond payment due date. How it is calculated can vary by card issuer. It is often calculated as an average daily balance.

Format: `double`

Amount of money charged due to interest from last statement.

Format: `double`

true if a payment is currently overdue. Availability for this field is limited.

The amount of the last payment.

Format: `double`

The date of the last payment. Dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD). Availability for this field is limited.

Format: `date`

The date of the last statement. Dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The total amount owed as of the last statement issued

Format: `double`

The minimum payment due for the next billing cycle.

Format: `double`

The due date for the next payment. The due date is `null` if a payment is not expected. Dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The mortgage accounts returned.

Hide object

The ID of the account that this liability belongs to.

The account number of the loan.

The current outstanding amount charged for late payment.

Format: `double`

Total amount held in escrow to pay taxes and insurance on behalf of the borrower.

Format: `double`

Indicates whether the borrower has private mortgage insurance in effect.

Indicates whether the borrower will pay a penalty for early payoff of mortgage.

Object containing metadata about the interest rate for the mortgage.

Hide object

Percentage value (interest rate of current mortgage, not APR) of interest payable on a loan.

Format: `double`

The type of interest charged (fixed or variable).

The amount of the last payment.

Format: `double`

The date of the last payment. Dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

Description of the type of loan, for example `conventional`, `fixed`, or `variable`. This field is provided directly from the loan servicer and does not have an enumerated set of possible values.

Full duration of mortgage as at origination (e.g. `10 year`).

Original date on which mortgage is due in full. Dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The amount of the next payment.

Format: `double`

The due date for the next payment. Dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The date on which the loan was initially lent. Dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The original principal balance of the mortgage.

Format: `double`

Amount of loan (principal + interest) past due for payment.

Format: `double`

Object containing fields describing property address.

Hide object

The city name.

The ISO 3166-1 alpha-2 country code.

The five or nine digit postal code.

The region or state (example "NC").

The full street address (example "564 Main Street, Apt 15").

The year to date (YTD) interest paid.

Format: `double`

The YTD principal paid.

Format: `double`

The student loan accounts returned.

Hide object

The ID of the account that this liability belongs to. Each account can only contain one liability.

The account number of the loan. For some institutions, this may be a masked version of the number (e.g., the last 4 digits instead of the entire number).

The dates on which loaned funds were disbursed or will be disbursed. These are often in the past. Dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The date when the student loan is expected to be paid off. Availability for this field is limited. Dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The guarantor of the student loan.

The interest rate on the loan as a percentage.

Format: `double`

`true` if a payment is currently overdue. Availability for this field is limited.

The amount of the last payment.

Format: `double`

The date of the last payment. Dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The total amount owed as of the last statement issued

Format: `double`

The date of the last statement. Dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The type of loan, e.g., "Consolidation Loans".

An object representing the status of the student loan

Hide object

The date until which the loan will be in its current status. Dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The status type of the student loan

Possible values: `cancelled`, `charged off`, `claim`, `consolidated`, `deferment`, `delinquent`, `discharged`, `extension`, `forbearance`, `in grace`, `in military`, `in school`, `not fully disbursed`, `other`, `paid in full`, `refunded`, `repayment`, `transferred`, `pending idr`

The minimum payment due for the next billing cycle. There are some exceptions:
Some institutions require a minimum payment across all loans associated with an account number. Our API presents that same minimum payment amount on each loan. The institutions that do this are: Great Lakes ( `ins_116861`), Firstmark (`ins_116295`), Commonbond Firstmark Services (`ins_116950`), Granite State (`ins_116308`), and Oklahoma Student Loan Authority (`ins_116945`).
Firstmark (`ins_116295` ) and Navient (`ins_116248`) will display as $0 if there is an autopay program in effect.

Format: `double`

The due date for the next payment. The due date is `null` if a payment is not expected. A payment is not expected if `loan_status.type` is `deferment`, `in school`, `consolidated`, `paid in full`, or `transferred`. Dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The date on which the loan was initially lent. Dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The original principal balance of the loan.

Format: `double`

The total dollar amount of the accrued interest balance. For Sallie Mae ( `ins_116944`), this amount is included in the current balance of the loan, so this field will return as `null`.

Format: `double`

The relevant account number that should be used to reference this loan for payments. In the majority of cases, `payment_reference_number` will match `account_number`, but in some institutions, such as Great Lakes (`ins_116861`), it will be different.

An object representing the repayment plan for the student loan

Hide object

The description of the repayment plan as provided by the servicer.

The type of the repayment plan.

Possible values: `extended graduated`, `extended standard`, `graduated`, `income-contingent repayment`, `income-based repayment`, `income-sensitive repayment`, `interest only`, `other`, `pay as you earn`, `revised pay as you earn`, `standard`, `saving on a valuable education`, `null`

The sequence number of the student loan. Heartland ECSI (`ins_116948`) does not make this field available.

The address of the student loan servicer. This is generally the remittance address to which payments should be sent.

Hide object

The full city name

The region or state
Example: `"NC"`

The full street address
Example: `"564 Main Street, APT 15"`

The postal code

The ISO 3166-1 alpha-2 country code

The year to date (YTD) interest paid. Availability for this field is limited.

Format: `double`

The year to date (YTD) principal paid. Availability for this field is limited.

Format: `double`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "account": {
    "account_id": "dVzbVMLjrxTnLjX4G66XUp5GLklm4oiZy88yK",
    "balances": {
      "available": null,
      "current": 410,
      "iso_currency_code": "USD",
      "limit": 2000,
      "unofficial_currency_code": null
    },
    "mask": "3333",
    "name": "Plaid Credit Card",
    "official_name": "Plaid Diamond 12.5% APR Interest Credit Card",
    "subtype": "credit card",
    "type": "credit"
  },
  "liabilities": {
    "credit": [
      {
        "account_id": "dVzbVMLjrxTnLjX4G66XUp5GLklm4oiZy88yK",
        "aprs": [
          {
            "apr_percentage": 15.24,
            "apr_type": "balance_transfer_apr",
            "balance_subject_to_apr": 1562.32,
            "interest_charge_amount": 130.22
          },
          {
            "apr_percentage": 27.95,
            "apr_type": "cash_apr",
            "balance_subject_to_apr": 56.22,
            "interest_charge_amount": 14.81
          },
          {
            "apr_percentage": 12.5,
            "apr_type": "purchase_apr",
            "balance_subject_to_apr": 157.01,
            "interest_charge_amount": 25.66
          },
          {
            "apr_percentage": 0,
            "apr_type": "special",
            "balance_subject_to_apr": 1000,
            "interest_charge_amount": 0
          }
        ],
        "is_overdue": false,
        "last_payment_amount": 168.25,
        "last_payment_date": "2019-05-22",
        "last_statement_issue_date": "2019-05-28",
        "last_statement_balance": 1708.77,
        "minimum_payment_amount": 20,
        "next_payment_due_date": "2020-05-28"
      }
    ],
    "mortgage": [],
    "student": []
  },
  "request_id": "dTnnm60WgKGLnKL"
}
```

=\*=\*=\*=[#### `/processor/signal/decision/report`](/docs/api/processor-partners/#processorsignaldecisionreport)

[#### Report whether you initiated an ACH transaction](/docs/api/processor-partners/#report-whether-you-initiated-an-ach-transaction)

After you call [`/processor/signal/evaluate`](/docs/api/processor-partners/#processorsignalevaluate), Plaid will normally infer the outcome from your Signal Rules. However, if you are not using Signal Rules, if the Signal Rules outcome was `REVIEW`, or if you take a different action than the one determined by the Signal Rules, you will need to call [`/processor/signal/decision/report`](/docs/api/processor-partners/#processorsignaldecisionreport). This helps improve Signal Transaction Score accuracy for your account and is necessary for proper functioning of the rule performance and rule tuning capabilities in the Dashboard. If your effective decision changes after calling [`/processor/signal/decision/report`](/docs/api/processor-partners/#processorsignaldecisionreport) (for example, you indicated that you accepted a transaction, but later on, your payment processor rejected it, so it was never initiated), call [`/processor/signal/decision/report`](/docs/api/processor-partners/#processorsignaldecisionreport) again for the transaction to correct Plaid's records.

If you are using Plaid Transfer as your payment processor, you also do not need to call [`/processor/signal/decision/report`](/docs/api/processor-partners/#processorsignaldecisionreport), as Plaid can infer outcomes from your Transfer activity.

If using a Balance-only ruleset, this endpoint will not impact scores (Balance does not use scores), but is necessary to view accurate transaction outcomes and tune rule logic in the Dashboard.

/processor/signal/decision/report

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The processor token obtained from the Plaid integration partner. Processor tokens are in the format: `processor-<environment>-<identifier>`

Must be the same as the `client_transaction_id` supplied when calling `/processor/signal/evaluate`

Min length: `1`

Max length: `36`

`true` if the ACH transaction was initiated, `false` otherwise.

This field must be returned as a boolean. If formatted incorrectly, this will result in an [`INVALID_FIELD`](https://plaid.com/docs/errors/invalid-request/#invalid_field) error.

The actual number of days (hold time) since the ACH debit transaction that you wait before making funds available to your customers. The holding time could affect the ACH return rate.

For example, use 0 if you make funds available to your customers instantly or the same day following the debit transaction, or 1 if you make funds available the next day following the debit initialization.

Minimum: `0`

The payment decision from the risk assessment.

`APPROVE`: approve the transaction without requiring further actions from your customers. For example, use this field if you are placing a standard hold for all the approved transactions before making funds available to your customers. You should also use this field if you decide to accelerate the fund availability for your customers.

`REVIEW`: the transaction requires manual review

`REJECT`: reject the transaction

`TAKE_OTHER_RISK_MEASURES`: for example, placing a longer hold on funds than those approved transactions or introducing customer frictions such as step-up verification/authentication

`NOT_EVALUATED`: if only logging the results without using them

Possible values: `APPROVE`, `REVIEW`, `REJECT`, `TAKE_OTHER_RISK_MEASURES`, `NOT_EVALUATED`

The payment method to complete the transaction after the risk assessment. It may be different from the default payment method.

`SAME_DAY_ACH`: Same Day ACH by Nacha. The debit transaction is processed and settled on the same day.

`STANDARD_ACH`: Standard ACH by Nacha.

`MULTIPLE_PAYMENT_METHODS`: if there is no default debit rail or there are multiple payment methods.

Possible values: `SAME_DAY_ACH`, `STANDARD_ACH`, `MULTIPLE_PAYMENT_METHODS`

The amount (in USD) made available to your customers instantly following the debit transaction. It could be a partial amount of the requested transaction (example: 102.05).

Format: `double`

/processor/signal/decision/report

Nodeâ¼

```
const decision_report_request = {
  processor_token: 'processor-sandbox-71e02f71-0960-4a27-abd2-5631e04f2175',
  client_transaction_id: 'txn12345',
  initiated: true,
  days_funds_on_hold: 3,
};

try {
  const decision_report_response =
    await plaidClient.processorSignalDecisionReport(decision_report_request);
  const decision_request_id = decision_report_response.data.request_id;
} catch (error) {
  // handle error
}
```

/processor/signal/decision/report

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/processor/signal/return/report`](/docs/api/processor-partners/#processorsignalreturnreport)

[#### Report a return for an ACH transaction](/docs/api/processor-partners/#report-a-return-for-an-ach-transaction)

Call the [`/processor/signal/return/report`](/docs/api/processor-partners/#processorsignalreturnreport) endpoint to report a returned transaction that was previously sent to the [`/processor/signal/evaluate`](/docs/api/processor-partners/#processorsignalevaluate) endpoint. Your feedback will be used by the model to incorporate the latest risk trend in your portfolio.

If you are using the [Plaid Transfer product](https://plaid.com/docs/transfer) to create transfers, it is not necessary to use this endpoint, as Plaid already knows whether the transfer was returned.

/processor/signal/return/report

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The processor token obtained from the Plaid integration partner. Processor tokens are in the format: `processor-<environment>-<identifier>`

Must be the same as the `client_transaction_id` supplied when calling `/processor/signal/evaluate`

Min length: `1`

Max length: `36`

Must be a valid ACH return code (e.g. "R01")

If formatted incorrectly, this will result in an [`INVALID_FIELD`](https://plaid.com/docs/errors/invalid-request/#invalid_field) error.

Date and time when you receive the returns from your payment processors, in ISO 8601 format (`YYYY-MM-DDTHH:mm:ssZ`).

Format: `date-time`

/processor/signal/return/report

Nodeâ¼

```
const return_report_request = {
  processor_token: 'processor-sandbox-71e02f71-0960-4a27-abd2-5631e04f2175',
  client_transaction_id: 'txn12345',
  return_code: 'R01',
};

try {
  const return_report_response = await plaidClient.processorSignalReturnReport(
    return_report_request,
  );
  const request_id = return_report_response.data.request_id;
  console.log(request_id);
} catch (error) {
  // handle error
}
```

/processor/signal/return/report

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/processor/signal/prepare`](/docs/api/processor-partners/#processorsignalprepare)

[#### Opt-in a processor token to Signal](/docs/api/processor-partners/#opt-in-a-processor-token-to-signal)

When a processor token is not initialized with `signal`, call [`/processor/signal/prepare`](/docs/api/processor-partners/#processorsignalprepare) to opt-in that processor token to the data collection process, which will improve the accuracy of the Signal Transaction Score.

If this endpoint is called with a processor token that is already initialized with `signal`, it will return a 200 response and will not modify the processor token.

/processor/signal/prepare

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The processor token obtained from the Plaid integration partner. Processor tokens are in the format: `processor-<environment>-<identifier>`

/processor/signal/prepare

Nodeâ¼

```
const prepare_request = {
  processor_token: 'processor-sandbox-71e02f71-0960-4a27-abd2-5631e04f2175',
};

try {
  const prepare_response =
    await plaidClient.processorSignalPrepare(prepare_request);
  const prepare_request_id = prepare_response.data.request_id;
} catch (error) {
  // handle error
}
```

/processor/signal/prepare

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/processor/token/webhook/update`](/docs/api/processor-partners/#processortokenwebhookupdate)

[#### Update a processor token's webhook URL](/docs/api/processor-partners/#update-a-processor-token's-webhook-url)

This endpoint allows you, the processor, to update the webhook URL associated with a processor token. This request triggers a `WEBHOOK_UPDATE_ACKNOWLEDGED` webhook to the newly specified webhook URL.

/processor/token/webhook/update

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The processor token obtained from the Plaid integration partner. Processor tokens are in the format: `processor-<environment>-<identifier>`

The new webhook URL to associate with the processor token. To remove a webhook from a processor token, set to `null`.

Format: `url`

/processor/token/webhook/update

Nodeâ¼

```
try {
  const request: ProcessorTokenWebhookUpdateRequest = {
    processor_token: processorToken,
    webhook: webhook,
  };
  const response = await plaidClient.processorTokenWebhookUpdate(request);
} catch (error) {
  // handle error
}
```

/processor/token/webhook/update

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "vYK11LNTfRoAMbj"
}
```

=\*=\*=\*=[#### `/processor/transactions/sync`](/docs/api/processor-partners/#processortransactionssync)

[#### Get incremental transaction updates on a processor token](/docs/api/processor-partners/#get-incremental-transaction-updates-on-a-processor-token)

The [`/processor/transactions/sync`](/docs/api/processor-partners/#processortransactionssync) endpoint retrieves transactions associated with an Item and can fetch updates using a cursor to track which updates have already been seen.

For important instructions on integrating with [`/processor/transactions/sync`](/docs/api/processor-partners/#processortransactionssync), see the [Transactions integration overview](https://plaid.com/docs/transactions/#integration-overview). If you are migrating from an existing integration using [`/processor/transactions/get`](/docs/api/processor-partners/#processortransactionsget), see the [Transactions Sync migration guide](https://plaid.com/docs/transactions/sync-migration/).

This endpoint supports `credit`, `depository`, and some `loan`-type accounts (only those with account subtype `student` or `mortgage`). For `investments` accounts, use [`/investments/transactions/get`](/docs/api/products/investments/#investmentstransactionsget) instead.

When retrieving paginated updates, track both the `next_cursor` from the latest response and the original cursor from the first call in which `has_more` was `true`; if a call to [`/processor/transactions/sync`](/docs/api/processor-partners/#processortransactionssync) fails when retrieving a paginated update (e.g. due to the [`TRANSACTIONS_SYNC_MUTATION_DURING_PAGINATION`](https://plaid.com/docs/errors/transactions/#transactions_sync_mutation_during_pagination) error), the entire pagination request loop must be restarted beginning with the cursor for the first page of the update, rather than retrying only the single request that failed.

If transactions data is not yet available for the Item, which can happen if the Item was not initialized with transactions during the [`/link/token/create`](/docs/api/link/#linktokencreate) call or if [`/processor/transactions/sync`](/docs/api/processor-partners/#processortransactionssync) was called within a few seconds of Item creation, [`/processor/transactions/sync`](/docs/api/processor-partners/#processortransactionssync) will return empty transactions arrays.

Plaid typically checks for new transactions data between one and four times per day, depending on the institution. To find out when transactions were last updated for an Item, use the [Item Debugger](https://plaid.com/docs/account/activity/#troubleshooting-with-item-debugger) or call [`/item/get`](/docs/api/items/#itemget); the `item.status.transactions.last_successful_update` field will show the timestamp of the most recent successful update. To force Plaid to check for new transactions, use the [`/processor/transactions/refresh`](/docs/api/processor-partners/#processortransactionsrefresh) endpoint.

To be alerted when new transactions are available, listen for the [`SYNC_UPDATES_AVAILABLE`](https://plaid.com/docs/api/products/transactions/#sync_updates_available) webhook.

To receive Transactions webhooks for a processor token, set its webhook URL via the [[`/processor/token/webhook/update`](https://plaid.com/docs/api/processor-partners/#processortokenwebhookupdate)](/docs/api/processor-partners/#processortokenwebhookupdate) endpoint.

/processor/transactions/sync

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

The processor token obtained from the Plaid integration partner. Processor tokens are in the format: `processor-<environment>-<identifier>`

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The cursor value represents the last update requested. Providing it will cause the response to only return changes after this update.
If omitted, the entire history of updates will be returned, starting with the first-added transactions on the Item.
Note: The upper-bound length of this cursor is 256 characters of base64.

The number of transaction updates to fetch.

Default: `100`

Minimum: `1`

Maximum: `500`

Exclusive min: `false`

An optional object to be used with the request. If specified, `options` must not be `null`.

Hide object

Include the raw unparsed transaction description from the financial institution.

Default: `false`

Indicates which version of the personal finance category taxonomy is being used. [View PFCv2 and PFCv1 taxonomies](https://plaid.com/documents/pfc-taxonomy-all.csv).

If you enabled Transactions or Enrich before December 3, 2025 you will receive the `v1` taxonomy by default and may request `v2` by explicitly setting this field to `v2` in the request.

If you enabled Transactions or Enrich on or after December 3, 2025, you may only receive the `v2` taxonomy.

Possible values: `v1`, `v2`

This field only applies to calls for Items where the Transactions product has not already been initialized (i.e., by specifying `transactions` in the `products`, `required_if_supported_products`, or `optional_products` array when calling `/link/token/create` or by making a previous call to `/transactions/sync` or `/transactions/get`). In those cases, the field controls the maximum number of days of transaction history that Plaid will request from the financial institution. The more transaction history is requested, the longer the historical update poll will take. If no value is specified, 90 days of history will be requested by default. In Production, if a value less than 30 is provided, a minimum of 30 days of transaction history will be requested.

If you are initializing your Items with transactions during the `/link/token/create` call (e.g. by including `transactions` in the `/link/token/create` `products` array), you must use the [`transactions.days_requested`](https://plaid.com/docs/api/link/#link-token-create-request-transactions-days-requested) field in the `/link/token/create` request instead of in the `/transactions/sync` request.

If the Item has already been initialized with the Transactions product, this field will have no effect. The maximum amount of transaction history to request on an Item cannot be updated if Transactions has already been added to the Item. To request older transaction history on an Item where Transactions has already been added, you must delete the Item via `/item/remove` and send the user through Link to create a new Item.

Customers using [Recurring Transactions](https://plaid.com/docs/api/products/transactions/#transactionsrecurringget) should request at least 180 days of history for optimal results.

Minimum: `1`

Maximum: `730`

Default: `90`

If provided, the returned updates and cursor will only reflect the specified account's transactions. Omitting `account_id` returns updates for all accounts under the Item. Note that specifying an `account_id` effectively creates a separate incremental update stream -- and therefore a separate cursor -- for that account. If multiple accounts are queried this way, you will maintain multiple cursors, one per `account_id`.

If you decide to begin filtering by `account_id` after using no `account_id`, start fresh with a null cursor and maintain separate `(account_id, cursor)` pairs going forward. Do not reuse any previously saved cursors, as this can cause pagination errors or incomplete data.

Note: An error will be returned if a provided `account_id` is not associated with the Item.

/processor/transactions/sync

Nodeâ¼

```
// Provide a cursor from your database if you've previously
// received one for the Item. Leave null if this is your
// first sync call for this Item. The first request will
// return a cursor.
let cursor = database.getLatestCursorOrNull(itemId);

// New transaction updates since "cursor"
let added: Array<Transaction> = [];
let modified: Array<Transaction> = [];
// Removed transaction ids
let removed: Array<RemovedTransaction> = [];
let hasMore = true;

// Iterate through each page of new transaction updates for item
while (hasMore) {
  const request: ProcessorTransactionsSyncRequest = {
    processor_token: processorToken,
    cursor: cursor,
  };
  const response = await client.processorTransactionsSync(request);
  const data = response.data;

  // Add this page of results
  added = added.concat(data.added);
  modified = modified.concat(data.modified);
  removed = removed.concat(data.removed);

  hasMore = data.has_more;

  // Update cursor to the next cursor
  cursor = data.next_cursor;
}

// Persist cursor and updated data
database.applyUpdates(itemId, added, modified, removed, cursor);
```

/processor/transactions/sync

**Response fields**

Collapse all

A description of the update status for transaction pulls of an Item. This field contains the same information provided by transactions webhooks, and may be helpful for webhook troubleshooting or when recovering from missed webhooks.

`TRANSACTIONS_UPDATE_STATUS_UNKNOWN`: Unable to fetch transactions update status for Item.
`NOT_READY`: The Item is pending transaction pull.
`INITIAL_UPDATE_COMPLETE`: Initial pull for the Item is complete, historical pull is pending.
`HISTORICAL_UPDATE_COMPLETE`: Both initial and historical pull for Item are complete.

Possible values: `TRANSACTIONS_UPDATE_STATUS_UNKNOWN`, `NOT_READY`, `INITIAL_UPDATE_COMPLETE`, `HISTORICAL_UPDATE_COMPLETE`

A single account at a financial institution.

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

Transactions that have been added to the Item since `cursor` ordered by ascending last modified time.

Hide object

The ID of the account in which this transaction occurred.

The settled value of the transaction, denominated in the transaction's currency, as stated in `iso_currency_code` or `unofficial_currency_code`. For all products except Income: Positive values when money moves out of the account; negative values when money moves in. For example, debit card purchases are positive; credit card payments, direct deposits, and refunds are negative. For Income endpoints, values are positive when representing income.

Format: `double`

The ISO-4217 currency code of the transaction. Always `null` if `unofficial_currency_code` is non-null.

The unofficial currency code associated with the transaction. Always `null` if `iso_currency_code` is non-`null`. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `iso_currency_code`s.

The check number of the transaction. This field is only populated for check transactions.

For pending transactions, the date that the transaction occurred; for posted transactions, the date that the transaction posted. Both dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ( `YYYY-MM-DD` ). To receive information about the date that a posted transaction was initiated, see the `authorized_date` field.

Format: `date`

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

The merchant name or transaction description.

Note: While Plaid does not currently plan to remove this field, it is a legacy field that is not actively maintained. Use `merchant_name` instead for the merchant name.

If the `transactions` object was returned by a Transactions endpoint such as `/transactions/sync` or `/transactions/get`, this field will always appear. If the `transactions` object was returned by an Assets endpoint such as `/asset_report/get` or `/asset_report/pdf/get`, this field will only appear in an Asset Report with Insights.

The merchant name, as enriched by Plaid from the `name` field. This is typically a more human-readable version of the merchant counterparty in the transaction. For some bank transactions (such as checks or account transfers) where there is no meaningful merchant name, this value will be `null`.

The string returned by the financial institution to describe the transaction. For transactions returned by `/transactions/sync` or `/transactions/get`, this field will only be included if the client has set `options.include_original_description` to `true`.

Transaction information specific to inter-bank transfers. If the transaction was not an inter-bank transfer, all fields will be `null`.

If the `transactions` object was returned by a Transactions endpoint such as `/transactions/sync` or `/transactions/get`, the `payment_meta` key will always appear, but no data elements are guaranteed. If the `transactions` object was returned by an Assets endpoint such as `/asset_report/get` or `/asset_report/pdf/get`, this field will only appear in an Asset Report with Insights.

Hide object

The transaction reference number supplied by the financial institution.

The ACH PPD ID for the payer.

For transfers, the party that is receiving the transaction.

The party initiating a wire transfer. Will be `null` if the transaction is not a wire transfer.

For transfers, the party that is paying the transaction.

The type of transfer, e.g. 'ACH'

The name of the payment processor

The payer-supplied description of the transfer.

When `true`, identifies the transaction as pending or unsettled. Pending transaction details (name, type, amount, category ID) may change before they are settled. Not all institutions provide pending transactions.

The ID of a posted transaction's associated pending transaction, where applicable. Not all institutions provide pending transactions.

This field is not typically populated and only relevant when dealing with sub-accounts. A sub-account most commonly exists in cases where a single account is linked to multiple cards, each with its own card number and card holder name; each card will be considered a sub-account. If the account does have sub-accounts, this field will typically be some combination of the sub-account owner's name and/or the sub-account mask. The format of this field is not standardized and will vary based on institution.

The unique ID of the transaction. Like all Plaid identifiers, the `transaction_id` is case sensitive.

Please use the `payment_channel` field, `transaction_type` will be deprecated in the future.

`digital:` transactions that took place online.

`place:` transactions that were made at a physical location.

`special:` transactions that relate to banks, e.g. fees or deposits.

`unresolved:` transactions that do not fit into the other three types.

Possible values: `digital`, `place`, `special`, `unresolved`

The URL of a logo associated with this transaction, if available. The logo will always be a 100Ã100 pixel PNG file.

The website associated with this transaction, if available.

The date that the transaction was authorized. For posted transactions, the `date` field will indicate the posted date, but `authorized_date` will indicate the day the transaction was authorized by the financial institution. If presenting transactions to the user in a UI, the `authorized_date`, when available, is generally preferable to use over the `date` field for posted transactions, as it will generally represent the date the user actually made the transaction. Dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ( `YYYY-MM-DD` ).

Format: `date`

Date and time when a transaction was authorized in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ( `YYYY-MM-DDTHH:mm:ssZ` ). For posted transactions, the `datetime` field will indicate the posted date, but `authorized_datetime` will indicate the day the transaction was authorized by the financial institution. If presenting transactions to the user in a UI, the `authorized_datetime`, when available, is generally preferable to use over the `datetime` field for posted transactions, as it will generally represent the date the user actually made the transaction.

This field is returned for select financial institutions and comes as provided by the institution. It may contain default time values (such as 00:00:00). This field is only populated in API version 2019-05-29 and later.

Format: `date-time`

Date and time when a transaction was posted in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ( `YYYY-MM-DDTHH:mm:ssZ` ). For the date that the transaction was initiated, rather than posted, see the `authorized_datetime` field.

This field is returned for select financial institutions and comes as provided by the institution. It may contain default time values (such as 00:00:00). This field is only populated in API version 2019-05-29 and later.

Format: `date-time`

The channel used to make a payment.
`online:` transactions that took place online.

`in store:` transactions that were made at a physical location.

`other:` transactions that relate to banks, e.g. fees or deposits.

This field replaces the `transaction_type` field.

Possible values: `online`, `in store`, `other`

Information describing the intent of the transaction. Most relevant for personal finance use cases, but not limited to such use cases.

See the [taxonomy CSV file](https://plaid.com/documents/pfc-taxonomy-all.csv) for a full list of personal finance categories. If you are migrating to personal finance categories from the legacy categories, also refer to the [migration guide](https://plaid.com/docs/transactions/pfc-migration/).

Hide object

A high level category that communicates the broad category of the transaction.

A granular category conveying the transaction's intent. This field can also be used as a unique identifier for the category.

A description of how confident we are that the provided categories accurately describe the transaction intent.

`VERY_HIGH`: We are more than 98% confident that this category reflects the intent of the transaction.
`HIGH`: We are more than 90% confident that this category reflects the intent of the transaction.
`MEDIUM`: We are moderately confident that this category reflects the intent of the transaction.
`LOW`: This category may reflect the intent, but there may be other categories that are more accurate.
`UNKNOWN`: We don't know the confidence level for this category.

Indicates which version of the personal finance category taxonomy is being used. [View PFCv2 and PFCv1 taxonomies](https://plaid.com/documents/pfc-taxonomy-all.csv).

If you enabled Transactions or Enrich before December 3, 2025 you will receive the `v1` taxonomy by default and may request `v2` by explicitly setting this field to `v2` in the request.

If you enabled Transactions or Enrich on or after December 3, 2025, you may only receive the `v2` taxonomy.

Possible values: `v1`, `v2`

An identifier classifying the transaction type.

This field is populated for European institutions, as well as certain institutions in the United States. For institutions where this classification is not available, this field is set to `null`.

`adjustment:` Bank adjustment

`atm:` Cash deposit or withdrawal via an automated teller machine

`bank charge:` Charge or fee levied by the institution

`bill payment`: Payment of a bill

`cash:` Cash deposit or withdrawal

`cash advance:` Cash advance drawn against a credit card or line of credit

`cashback:` Cash withdrawal while making a debit card purchase

`cheque:` Document ordering the payment of money to another person or organization

`direct debit:` Automatic withdrawal of funds initiated by a third party at a regular interval

`interest:` Interest earned or incurred

`late fee:` Fee associated with a late or past-due payment

`membership fee:` Annual or recurring membership fee

`payment:` One-off outbound payment not classified as a bill payment, direct debit, or standing order

`purchase:` Purchase made with a debit or credit card

`refund:` Merchant credit or return, such as a refund of a prior purchase

`returned item fee:` Fee for a returned item, such as a returned check or stop payment

`standing order:` Payment instructed by the account holder to a third party at a regular interval

`transfer:` Transfer of money between accounts

Possible values: `adjustment`, `atm`, `bank charge`, `bill payment`, `cash`, `cash advance`, `cashback`, `cheque`, `direct debit`, `interest`, `late fee`, `membership fee`, `payment`, `purchase`, `refund`, `returned item fee`, `standing order`, `transfer`, `null`

The URL of an icon associated with the primary personal finance category. The icon will always be a 100Ã100 pixel PNG file.

The counterparties present in the transaction. Counterparties, such as the merchant or the financial institution, are extracted by Plaid from the raw description.

Hide object

The name of the counterparty, such as the merchant or the financial institution, as extracted by Plaid from the raw description.

A unique, stable, Plaid-generated ID that maps to the counterparty.

The counterparty type.

`merchant`: a provider of goods or services for purchase
`financial_institution`: a financial entity (bank, credit union, BNPL, fintech)
`payment_app`: a transfer or P2P app (e.g. Zelle)
`marketplace`: a marketplace (e.g. DoorDash, Google Play Store)
`payment_terminal`: a point-of-sale payment terminal (e.g. Square, Toast)
`income_source`: the payer in an income transaction (e.g., an employer, client, or government agency)

Possible values: `merchant`, `financial_institution`, `payment_app`, `marketplace`, `payment_terminal`, `income_source`

The website associated with the counterparty.

The URL of a logo associated with the counterparty, if available. The logo will always be a 100Ã100 pixel PNG file.

A description of how confident we are that the provided counterparty is involved in the transaction.

`VERY_HIGH`: We recognize this counterparty and we are more than 98% confident that it is involved in this transaction.
`HIGH`: We recognize this counterparty and we are more than 90% confident that it is involved in this transaction.
`MEDIUM`: We are moderately confident that this counterparty was involved in this transaction, but some details may differ from our records.
`LOW`: We didn't find a matching counterparty in our records, so we are returning a cleansed name parsed out of the request description.
`UNKNOWN`: We don't know the confidence level for this counterparty.

Account numbers associated with the counterparty, when available.
This field is currently only filled in for select financial institutions in Europe.

Hide object

Identifying information for a UK bank account via Bacs.

Hide object

The Bacs account number for the account.

The Bacs sort code for the account.

Account numbers using the International Bank Account Number and BIC/SWIFT code format.

Hide object

International Bank Account Number (IBAN).

Min length: `15`

Max length: `34`

Business Identifier Code (BIC) for this counterparty.

Min length: `8`

Max length: `11`

A unique, stable, Plaid-generated ID that maps to the merchant. In the case of a merchant with multiple retail locations, this field will map to the broader merchant, not a specific location or store.

Transactions that have been modified on the Item since `cursor` ordered by ascending last modified time.

Hide object

The ID of the account in which this transaction occurred.

The settled value of the transaction, denominated in the transaction's currency, as stated in `iso_currency_code` or `unofficial_currency_code`. For all products except Income: Positive values when money moves out of the account; negative values when money moves in. For example, debit card purchases are positive; credit card payments, direct deposits, and refunds are negative. For Income endpoints, values are positive when representing income.

Format: `double`

The ISO-4217 currency code of the transaction. Always `null` if `unofficial_currency_code` is non-null.

The unofficial currency code associated with the transaction. Always `null` if `iso_currency_code` is non-`null`. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `iso_currency_code`s.

The check number of the transaction. This field is only populated for check transactions.

For pending transactions, the date that the transaction occurred; for posted transactions, the date that the transaction posted. Both dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ( `YYYY-MM-DD` ). To receive information about the date that a posted transaction was initiated, see the `authorized_date` field.

Format: `date`

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

The merchant name or transaction description.

Note: While Plaid does not currently plan to remove this field, it is a legacy field that is not actively maintained. Use `merchant_name` instead for the merchant name.

If the `transactions` object was returned by a Transactions endpoint such as `/transactions/sync` or `/transactions/get`, this field will always appear. If the `transactions` object was returned by an Assets endpoint such as `/asset_report/get` or `/asset_report/pdf/get`, this field will only appear in an Asset Report with Insights.

The merchant name, as enriched by Plaid from the `name` field. This is typically a more human-readable version of the merchant counterparty in the transaction. For some bank transactions (such as checks or account transfers) where there is no meaningful merchant name, this value will be `null`.

The string returned by the financial institution to describe the transaction. For transactions returned by `/transactions/sync` or `/transactions/get`, this field will only be included if the client has set `options.include_original_description` to `true`.

Transaction information specific to inter-bank transfers. If the transaction was not an inter-bank transfer, all fields will be `null`.

If the `transactions` object was returned by a Transactions endpoint such as `/transactions/sync` or `/transactions/get`, the `payment_meta` key will always appear, but no data elements are guaranteed. If the `transactions` object was returned by an Assets endpoint such as `/asset_report/get` or `/asset_report/pdf/get`, this field will only appear in an Asset Report with Insights.

Hide object

The transaction reference number supplied by the financial institution.

The ACH PPD ID for the payer.

For transfers, the party that is receiving the transaction.

The party initiating a wire transfer. Will be `null` if the transaction is not a wire transfer.

For transfers, the party that is paying the transaction.

The type of transfer, e.g. 'ACH'

The name of the payment processor

The payer-supplied description of the transfer.

When `true`, identifies the transaction as pending or unsettled. Pending transaction details (name, type, amount, category ID) may change before they are settled. Not all institutions provide pending transactions.

The ID of a posted transaction's associated pending transaction, where applicable. Not all institutions provide pending transactions.

This field is not typically populated and only relevant when dealing with sub-accounts. A sub-account most commonly exists in cases where a single account is linked to multiple cards, each with its own card number and card holder name; each card will be considered a sub-account. If the account does have sub-accounts, this field will typically be some combination of the sub-account owner's name and/or the sub-account mask. The format of this field is not standardized and will vary based on institution.

The unique ID of the transaction. Like all Plaid identifiers, the `transaction_id` is case sensitive.

Please use the `payment_channel` field, `transaction_type` will be deprecated in the future.

`digital:` transactions that took place online.

`place:` transactions that were made at a physical location.

`special:` transactions that relate to banks, e.g. fees or deposits.

`unresolved:` transactions that do not fit into the other three types.

Possible values: `digital`, `place`, `special`, `unresolved`

The URL of a logo associated with this transaction, if available. The logo will always be a 100Ã100 pixel PNG file.

The website associated with this transaction, if available.

The date that the transaction was authorized. For posted transactions, the `date` field will indicate the posted date, but `authorized_date` will indicate the day the transaction was authorized by the financial institution. If presenting transactions to the user in a UI, the `authorized_date`, when available, is generally preferable to use over the `date` field for posted transactions, as it will generally represent the date the user actually made the transaction. Dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ( `YYYY-MM-DD` ).

Format: `date`

Date and time when a transaction was authorized in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ( `YYYY-MM-DDTHH:mm:ssZ` ). For posted transactions, the `datetime` field will indicate the posted date, but `authorized_datetime` will indicate the day the transaction was authorized by the financial institution. If presenting transactions to the user in a UI, the `authorized_datetime`, when available, is generally preferable to use over the `datetime` field for posted transactions, as it will generally represent the date the user actually made the transaction.

This field is returned for select financial institutions and comes as provided by the institution. It may contain default time values (such as 00:00:00). This field is only populated in API version 2019-05-29 and later.

Format: `date-time`

Date and time when a transaction was posted in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ( `YYYY-MM-DDTHH:mm:ssZ` ). For the date that the transaction was initiated, rather than posted, see the `authorized_datetime` field.

This field is returned for select financial institutions and comes as provided by the institution. It may contain default time values (such as 00:00:00). This field is only populated in API version 2019-05-29 and later.

Format: `date-time`

The channel used to make a payment.
`online:` transactions that took place online.

`in store:` transactions that were made at a physical location.

`other:` transactions that relate to banks, e.g. fees or deposits.

This field replaces the `transaction_type` field.

Possible values: `online`, `in store`, `other`

Information describing the intent of the transaction. Most relevant for personal finance use cases, but not limited to such use cases.

See the [taxonomy CSV file](https://plaid.com/documents/pfc-taxonomy-all.csv) for a full list of personal finance categories. If you are migrating to personal finance categories from the legacy categories, also refer to the [migration guide](https://plaid.com/docs/transactions/pfc-migration/).

Hide object

A high level category that communicates the broad category of the transaction.

A granular category conveying the transaction's intent. This field can also be used as a unique identifier for the category.

A description of how confident we are that the provided categories accurately describe the transaction intent.

`VERY_HIGH`: We are more than 98% confident that this category reflects the intent of the transaction.
`HIGH`: We are more than 90% confident that this category reflects the intent of the transaction.
`MEDIUM`: We are moderately confident that this category reflects the intent of the transaction.
`LOW`: This category may reflect the intent, but there may be other categories that are more accurate.
`UNKNOWN`: We don't know the confidence level for this category.

Indicates which version of the personal finance category taxonomy is being used. [View PFCv2 and PFCv1 taxonomies](https://plaid.com/documents/pfc-taxonomy-all.csv).

If you enabled Transactions or Enrich before December 3, 2025 you will receive the `v1` taxonomy by default and may request `v2` by explicitly setting this field to `v2` in the request.

If you enabled Transactions or Enrich on or after December 3, 2025, you may only receive the `v2` taxonomy.

Possible values: `v1`, `v2`

An identifier classifying the transaction type.

This field is populated for European institutions, as well as certain institutions in the United States. For institutions where this classification is not available, this field is set to `null`.

`adjustment:` Bank adjustment

`atm:` Cash deposit or withdrawal via an automated teller machine

`bank charge:` Charge or fee levied by the institution

`bill payment`: Payment of a bill

`cash:` Cash deposit or withdrawal

`cash advance:` Cash advance drawn against a credit card or line of credit

`cashback:` Cash withdrawal while making a debit card purchase

`cheque:` Document ordering the payment of money to another person or organization

`direct debit:` Automatic withdrawal of funds initiated by a third party at a regular interval

`interest:` Interest earned or incurred

`late fee:` Fee associated with a late or past-due payment

`membership fee:` Annual or recurring membership fee

`payment:` One-off outbound payment not classified as a bill payment, direct debit, or standing order

`purchase:` Purchase made with a debit or credit card

`refund:` Merchant credit or return, such as a refund of a prior purchase

`returned item fee:` Fee for a returned item, such as a returned check or stop payment

`standing order:` Payment instructed by the account holder to a third party at a regular interval

`transfer:` Transfer of money between accounts

Possible values: `adjustment`, `atm`, `bank charge`, `bill payment`, `cash`, `cash advance`, `cashback`, `cheque`, `direct debit`, `interest`, `late fee`, `membership fee`, `payment`, `purchase`, `refund`, `returned item fee`, `standing order`, `transfer`, `null`

The URL of an icon associated with the primary personal finance category. The icon will always be a 100Ã100 pixel PNG file.

The counterparties present in the transaction. Counterparties, such as the merchant or the financial institution, are extracted by Plaid from the raw description.

Hide object

The name of the counterparty, such as the merchant or the financial institution, as extracted by Plaid from the raw description.

A unique, stable, Plaid-generated ID that maps to the counterparty.

The counterparty type.

`merchant`: a provider of goods or services for purchase
`financial_institution`: a financial entity (bank, credit union, BNPL, fintech)
`payment_app`: a transfer or P2P app (e.g. Zelle)
`marketplace`: a marketplace (e.g. DoorDash, Google Play Store)
`payment_terminal`: a point-of-sale payment terminal (e.g. Square, Toast)
`income_source`: the payer in an income transaction (e.g., an employer, client, or government agency)

Possible values: `merchant`, `financial_institution`, `payment_app`, `marketplace`, `payment_terminal`, `income_source`

The website associated with the counterparty.

The URL of a logo associated with the counterparty, if available. The logo will always be a 100Ã100 pixel PNG file.

A description of how confident we are that the provided counterparty is involved in the transaction.

`VERY_HIGH`: We recognize this counterparty and we are more than 98% confident that it is involved in this transaction.
`HIGH`: We recognize this counterparty and we are more than 90% confident that it is involved in this transaction.
`MEDIUM`: We are moderately confident that this counterparty was involved in this transaction, but some details may differ from our records.
`LOW`: We didn't find a matching counterparty in our records, so we are returning a cleansed name parsed out of the request description.
`UNKNOWN`: We don't know the confidence level for this counterparty.

Account numbers associated with the counterparty, when available.
This field is currently only filled in for select financial institutions in Europe.

Hide object

Identifying information for a UK bank account via Bacs.

Hide object

The Bacs account number for the account.

The Bacs sort code for the account.

Account numbers using the International Bank Account Number and BIC/SWIFT code format.

Hide object

International Bank Account Number (IBAN).

Min length: `15`

Max length: `34`

Business Identifier Code (BIC) for this counterparty.

Min length: `8`

Max length: `11`

A unique, stable, Plaid-generated ID that maps to the merchant. In the case of a merchant with multiple retail locations, this field will map to the broader merchant, not a specific location or store.

Transactions that have been removed from the Item since `cursor` ordered by ascending last modified time.

Hide object

The ID of the removed transaction.

The ID of the account of the removed transaction.

Cursor used for fetching any future updates after the latest update provided in this response. The cursor obtained after all pages have been pulled (indicated by `has_more` being `false`) will be valid for at least 1 year. This cursor should be persisted for later calls. If transactions are not yet available, this will be an empty string.

Represents if more than requested count of transaction updates exist. If true, the additional updates can be fetched by making an additional request with `cursor` set to `next_cursor`. If `has_more` is true, it's important to pull all available pages, to make it less likely for underlying data changes to conflict with pagination.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "account": {
    "account_id": "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
    "balances": {
      "available": 110.94,
      "current": 110.94,
      "iso_currency_code": "USD",
      "limit": null,
      "unofficial_currency_code": null
    },
    "mask": "0000",
    "name": "Plaid Checking",
    "official_name": "Plaid Gold Standard 0% Interest Checking",
    "subtype": "checking",
    "type": "depository"
  },
  "added": [
    {
      "account_id": "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
      "account_owner": null,
      "amount": 72.1,
      "iso_currency_code": "USD",
      "unofficial_currency_code": null,
      "check_number": null,
      "counterparties": [
        {
          "name": "Walmart",
          "type": "merchant",
          "logo_url": "https://plaid-merchant-logos.plaid.com/walmart_1100.png",
          "website": "walmart.com",
          "entity_id": "O5W5j4dN9OR3E6ypQmjdkWZZRoXEzVMz2ByWM",
          "confidence_level": "VERY_HIGH"
        }
      ],
      "date": "2023-09-24",
      "datetime": "2023-09-24T11:01:01Z",
      "authorized_date": "2023-09-22",
      "authorized_datetime": "2023-09-22T10:34:50Z",
      "location": {
        "address": "13425 Community Rd",
        "city": "Poway",
        "region": "CA",
        "postal_code": "92064",
        "country": "US",
        "lat": 32.959068,
        "lon": -117.037666,
        "store_number": "1700"
      },
      "name": "PURCHASE WM SUPERCENTER #1700",
      "merchant_name": "Walmart",
      "merchant_entity_id": "O5W5j4dN9OR3E6ypQmjdkWZZRoXEzVMz2ByWM",
      "logo_url": "https://plaid-merchant-logos.plaid.com/walmart_1100.png",
      "website": "walmart.com",
      "payment_meta": {
        "by_order_of": null,
        "payee": null,
        "payer": null,
        "payment_method": null,
        "payment_processor": null,
        "ppd_id": null,
        "reason": null,
        "reference_number": null
      },
      "payment_channel": "in store",
      "pending": false,
      "pending_transaction_id": "no86Eox18VHMvaOVL7gPUM9ap3aR1LsAVZ5nc",
      "personal_finance_category": {
        "primary": "GENERAL_MERCHANDISE",
        "detailed": "GENERAL_MERCHANDISE_SUPERSTORES",
        "confidence_level": "VERY_HIGH"
      },
      "personal_finance_category_icon_url": "https://plaid-category-icons.plaid.com/PFC_GENERAL_MERCHANDISE.png",
      "transaction_id": "lPNjeW1nR6CDn5okmGQ6hEpMo4lLNoSrzqDje",
      "transaction_code": null,
      "transaction_type": "place"
    }
  ],
  "modified": [
    {
      "account_id": "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
      "account_owner": null,
      "amount": 28.34,
      "iso_currency_code": "USD",
      "unofficial_currency_code": null,
      "check_number": null,
      "counterparties": [
        {
          "name": "DoorDash",
          "type": "marketplace",
          "logo_url": "https://plaid-counterparty-logos.plaid.com/doordash_1.png",
          "website": "doordash.com",
          "entity_id": "YNRJg5o2djJLv52nBA1Yn1KpL858egYVo4dpm",
          "confidence_level": "HIGH"
        },
        {
          "name": "Burger King",
          "type": "merchant",
          "logo_url": "https://plaid-merchant-logos.plaid.com/burger_king_155.png",
          "website": "burgerking.com",
          "entity_id": "mVrw538wamwdm22mK8jqpp7qd5br0eeV9o4a1",
          "confidence_level": "VERY_HIGH"
        }
      ],
      "date": "2023-09-28",
      "datetime": "2023-09-28T15:10:09Z",
      "authorized_date": "2023-09-27",
      "authorized_datetime": "2023-09-27T08:01:58Z",
      "location": {
        "address": null,
        "city": null,
        "region": null,
        "postal_code": null,
        "country": null,
        "lat": null,
        "lon": null,
        "store_number": null
      },
      "name": "Dd Doordash Burgerkin",
      "merchant_name": "Burger King",
      "merchant_entity_id": "mVrw538wamwdm22mK8jqpp7qd5br0eeV9o4a1",
      "logo_url": "https://plaid-merchant-logos.plaid.com/burger_king_155.png",
      "website": "burgerking.com",
      "payment_meta": {
        "by_order_of": null,
        "payee": null,
        "payer": null,
        "payment_method": null,
        "payment_processor": null,
        "ppd_id": null,
        "reason": null,
        "reference_number": null
      },
      "payment_channel": "online",
      "pending": true,
      "pending_transaction_id": null,
      "personal_finance_category": {
        "primary": "FOOD_AND_DRINK",
        "detailed": "FOOD_AND_DRINK_FAST_FOOD",
        "confidence_level": "VERY_HIGH"
      },
      "personal_finance_category_icon_url": "https://plaid-category-icons.plaid.com/PFC_FOOD_AND_DRINK.png",
      "transaction_id": "yhnUVvtcGGcCKU0bcz8PDQr5ZUxUXebUvbKC0",
      "transaction_code": null,
      "transaction_type": "digital"
    }
  ],
  "removed": [
    {
      "transaction_id": "CmdQTNgems8BT1B7ibkoUXVPyAeehT3Tmzk0l",
      "account_id": "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp"
    }
  ],
  "next_cursor": "tVUUL15lYQN5rBnfDIc1I8xudpGdIlw9nsgeXWvhOfkECvUeR663i3Dt1uf/94S8ASkitgLcIiOSqNwzzp+bh89kirazha5vuZHBb2ZA5NtCDkkV",
  "has_more": false,
  "request_id": "45QSn",
  "transactions_update_status": "HISTORICAL_UPDATE_COMPLETE"
}
```

=\*=\*=\*=[#### `/processor/transactions/get`](/docs/api/processor-partners/#processortransactionsget)

[#### Get transaction data](/docs/api/processor-partners/#get-transaction-data)

The [`/processor/transactions/get`](/docs/api/processor-partners/#processortransactionsget) endpoint allows developers to receive user-authorized transaction data for credit, depository, and some loan-type accounts (only those with account subtype `student` or `mortgage`; coverage may be limited). Transaction data is standardized across financial institutions, and in many cases transactions are linked to a clean name, entity type, location, and category. Similarly, account data is standardized and returned with a clean name, number, balance, and other meta information where available.

Transactions are returned in reverse-chronological order, and the sequence of transaction ordering is stable and will not shift. Transactions are not immutable and can also be removed altogether by the institution; a removed transaction will no longer appear in [`/processor/transactions/get`](/docs/api/processor-partners/#processortransactionsget). For more details, see [Pending and posted transactions](https://plaid.com/docs/transactions/transactions-data/#pending-and-posted-transactions).

Due to the potentially large number of transactions associated with a processor token, results are paginated. Manipulate the `count` and `offset` parameters in conjunction with the `total_transactions` response body field to fetch all available transactions.

Data returned by [`/processor/transactions/get`](/docs/api/processor-partners/#processortransactionsget) will be the data available for the processor token as of the most recent successful check for new transactions. Plaid typically checks for new data multiple times a day, but these checks may occur less frequently, such as once a day, depending on the institution. To force Plaid to check for new transactions, you can use the [`/processor/transactions/refresh`](/docs/api/processor-partners/#processortransactionsrefresh) endpoint.

Note that data may not be immediately available to [`/processor/transactions/get`](/docs/api/processor-partners/#processortransactionsget). Plaid will begin to prepare transactions data upon Item link, if Link was initialized with `transactions`, or upon the first call to [`/processor/transactions/get`](/docs/api/processor-partners/#processortransactionsget), if it wasn't. If no transaction history is ready when [`/processor/transactions/get`](/docs/api/processor-partners/#processortransactionsget) is called, it will return a `PRODUCT_NOT_READY` error.

To receive Transactions webhooks for a processor token, set its webhook URL via the [[`/processor/token/webhook/update`](https://plaid.com/docs/api/processor-partners/#processortokenwebhookupdate)](/docs/api/processor-partners/#processortokenwebhookupdate) endpoint.

/processor/transactions/get

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

An optional object to be used with the request. If specified, `options` must not be `null`.

Hide object

The number of transactions to fetch.

Default: `100`

Minimum: `1`

Maximum: `500`

Exclusive min: `false`

The number of transactions to skip. The default value is 0.

Default: `0`

Minimum: `0`

Include the raw unparsed transaction description from the financial institution.

Default: `false`

The processor token obtained from the Plaid integration partner. Processor tokens are in the format: `processor-<environment>-<identifier>`

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The earliest date for which data should be returned. Dates should be formatted as YYYY-MM-DD.

Format: `date`

The latest date for which data should be returned. Dates should be formatted as YYYY-MM-DD.

Format: `date`

/processor/transactions/get

Nodeâ¼

```
const request: ProcessorTransactionsGetRequest = {
  processor_token: processorToken,
  start_date: '2018-01-01',
  end_date: '2020-02-01'
};
try {
  const response = await client.processorTransactionsGet(request);
  let transactions = response.data.transactions;
  const total_transactions = response.data.total_transactions;
  // Manipulate the offset parameter to paginate
  // transactions and retrieve all available data
  while (transactions.length < total_transactions) {
    const paginatedRequest: ProcessorTransactionsGetRequest = {
      processor_token: processorToken,
      start_date: '2018-01-01',
      end_date: '2020-02-01',
      options: {
        offset: transactions.length,
      },
    };
    const paginatedResponse = await client.processorTransactionsGet(paginatedRequest);
    transactions = transactions.concat(
      paginatedResponse.data.transactions,
    );
  }
} catch (error) {
  // handle error
}
```

/processor/transactions/get

**Response fields**

Collapse all

A single account at a financial institution.

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

An array containing transactions from the account. Transactions are returned in reverse chronological order, with the most recent at the beginning of the array. The maximum number of transactions returned is determined by the `count` parameter.

Hide object

The ID of the account in which this transaction occurred.

The settled value of the transaction, denominated in the transaction's currency, as stated in `iso_currency_code` or `unofficial_currency_code`. For all products except Income: Positive values when money moves out of the account; negative values when money moves in. For example, debit card purchases are positive; credit card payments, direct deposits, and refunds are negative. For Income endpoints, values are positive when representing income.

Format: `double`

The ISO-4217 currency code of the transaction. Always `null` if `unofficial_currency_code` is non-null.

The unofficial currency code associated with the transaction. Always `null` if `iso_currency_code` is non-`null`. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `iso_currency_code`s.

The check number of the transaction. This field is only populated for check transactions.

For pending transactions, the date that the transaction occurred; for posted transactions, the date that the transaction posted. Both dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ( `YYYY-MM-DD` ). To receive information about the date that a posted transaction was initiated, see the `authorized_date` field.

Format: `date`

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

The merchant name or transaction description.

Note: While Plaid does not currently plan to remove this field, it is a legacy field that is not actively maintained. Use `merchant_name` instead for the merchant name.

If the `transactions` object was returned by a Transactions endpoint such as `/transactions/sync` or `/transactions/get`, this field will always appear. If the `transactions` object was returned by an Assets endpoint such as `/asset_report/get` or `/asset_report/pdf/get`, this field will only appear in an Asset Report with Insights.

The merchant name, as enriched by Plaid from the `name` field. This is typically a more human-readable version of the merchant counterparty in the transaction. For some bank transactions (such as checks or account transfers) where there is no meaningful merchant name, this value will be `null`.

The string returned by the financial institution to describe the transaction. For transactions returned by `/transactions/sync` or `/transactions/get`, this field will only be included if the client has set `options.include_original_description` to `true`.

Transaction information specific to inter-bank transfers. If the transaction was not an inter-bank transfer, all fields will be `null`.

If the `transactions` object was returned by a Transactions endpoint such as `/transactions/sync` or `/transactions/get`, the `payment_meta` key will always appear, but no data elements are guaranteed. If the `transactions` object was returned by an Assets endpoint such as `/asset_report/get` or `/asset_report/pdf/get`, this field will only appear in an Asset Report with Insights.

Hide object

The transaction reference number supplied by the financial institution.

The ACH PPD ID for the payer.

For transfers, the party that is receiving the transaction.

The party initiating a wire transfer. Will be `null` if the transaction is not a wire transfer.

For transfers, the party that is paying the transaction.

The type of transfer, e.g. 'ACH'

The name of the payment processor

The payer-supplied description of the transfer.

When `true`, identifies the transaction as pending or unsettled. Pending transaction details (name, type, amount, category ID) may change before they are settled. Not all institutions provide pending transactions.

The ID of a posted transaction's associated pending transaction, where applicable. Not all institutions provide pending transactions.

This field is not typically populated and only relevant when dealing with sub-accounts. A sub-account most commonly exists in cases where a single account is linked to multiple cards, each with its own card number and card holder name; each card will be considered a sub-account. If the account does have sub-accounts, this field will typically be some combination of the sub-account owner's name and/or the sub-account mask. The format of this field is not standardized and will vary based on institution.

The unique ID of the transaction. Like all Plaid identifiers, the `transaction_id` is case sensitive.

Please use the `payment_channel` field, `transaction_type` will be deprecated in the future.

`digital:` transactions that took place online.

`place:` transactions that were made at a physical location.

`special:` transactions that relate to banks, e.g. fees or deposits.

`unresolved:` transactions that do not fit into the other three types.

Possible values: `digital`, `place`, `special`, `unresolved`

The URL of a logo associated with this transaction, if available. The logo will always be a 100Ã100 pixel PNG file.

The website associated with this transaction, if available.

The date that the transaction was authorized. For posted transactions, the `date` field will indicate the posted date, but `authorized_date` will indicate the day the transaction was authorized by the financial institution. If presenting transactions to the user in a UI, the `authorized_date`, when available, is generally preferable to use over the `date` field for posted transactions, as it will generally represent the date the user actually made the transaction. Dates are returned in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ( `YYYY-MM-DD` ).

Format: `date`

Date and time when a transaction was authorized in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ( `YYYY-MM-DDTHH:mm:ssZ` ). For posted transactions, the `datetime` field will indicate the posted date, but `authorized_datetime` will indicate the day the transaction was authorized by the financial institution. If presenting transactions to the user in a UI, the `authorized_datetime`, when available, is generally preferable to use over the `datetime` field for posted transactions, as it will generally represent the date the user actually made the transaction.

This field is returned for select financial institutions and comes as provided by the institution. It may contain default time values (such as 00:00:00). This field is only populated in API version 2019-05-29 and later.

Format: `date-time`

Date and time when a transaction was posted in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format ( `YYYY-MM-DDTHH:mm:ssZ` ). For the date that the transaction was initiated, rather than posted, see the `authorized_datetime` field.

This field is returned for select financial institutions and comes as provided by the institution. It may contain default time values (such as 00:00:00). This field is only populated in API version 2019-05-29 and later.

Format: `date-time`

The channel used to make a payment.
`online:` transactions that took place online.

`in store:` transactions that were made at a physical location.

`other:` transactions that relate to banks, e.g. fees or deposits.

This field replaces the `transaction_type` field.

Possible values: `online`, `in store`, `other`

Information describing the intent of the transaction. Most relevant for personal finance use cases, but not limited to such use cases.

See the [taxonomy CSV file](https://plaid.com/documents/pfc-taxonomy-all.csv) for a full list of personal finance categories. If you are migrating to personal finance categories from the legacy categories, also refer to the [migration guide](https://plaid.com/docs/transactions/pfc-migration/).

Hide object

A high level category that communicates the broad category of the transaction.

A granular category conveying the transaction's intent. This field can also be used as a unique identifier for the category.

A description of how confident we are that the provided categories accurately describe the transaction intent.

`VERY_HIGH`: We are more than 98% confident that this category reflects the intent of the transaction.
`HIGH`: We are more than 90% confident that this category reflects the intent of the transaction.
`MEDIUM`: We are moderately confident that this category reflects the intent of the transaction.
`LOW`: This category may reflect the intent, but there may be other categories that are more accurate.
`UNKNOWN`: We don't know the confidence level for this category.

Indicates which version of the personal finance category taxonomy is being used. [View PFCv2 and PFCv1 taxonomies](https://plaid.com/documents/pfc-taxonomy-all.csv).

If you enabled Transactions or Enrich before December 3, 2025 you will receive the `v1` taxonomy by default and may request `v2` by explicitly setting this field to `v2` in the request.

If you enabled Transactions or Enrich on or after December 3, 2025, you may only receive the `v2` taxonomy.

Possible values: `v1`, `v2`

An identifier classifying the transaction type.

This field is populated for European institutions, as well as certain institutions in the United States. For institutions where this classification is not available, this field is set to `null`.

`adjustment:` Bank adjustment

`atm:` Cash deposit or withdrawal via an automated teller machine

`bank charge:` Charge or fee levied by the institution

`bill payment`: Payment of a bill

`cash:` Cash deposit or withdrawal

`cash advance:` Cash advance drawn against a credit card or line of credit

`cashback:` Cash withdrawal while making a debit card purchase

`cheque:` Document ordering the payment of money to another person or organization

`direct debit:` Automatic withdrawal of funds initiated by a third party at a regular interval

`interest:` Interest earned or incurred

`late fee:` Fee associated with a late or past-due payment

`membership fee:` Annual or recurring membership fee

`payment:` One-off outbound payment not classified as a bill payment, direct debit, or standing order

`purchase:` Purchase made with a debit or credit card

`refund:` Merchant credit or return, such as a refund of a prior purchase

`returned item fee:` Fee for a returned item, such as a returned check or stop payment

`standing order:` Payment instructed by the account holder to a third party at a regular interval

`transfer:` Transfer of money between accounts

Possible values: `adjustment`, `atm`, `bank charge`, `bill payment`, `cash`, `cash advance`, `cashback`, `cheque`, `direct debit`, `interest`, `late fee`, `membership fee`, `payment`, `purchase`, `refund`, `returned item fee`, `standing order`, `transfer`, `null`

The URL of an icon associated with the primary personal finance category. The icon will always be a 100Ã100 pixel PNG file.

The counterparties present in the transaction. Counterparties, such as the merchant or the financial institution, are extracted by Plaid from the raw description.

Hide object

The name of the counterparty, such as the merchant or the financial institution, as extracted by Plaid from the raw description.

A unique, stable, Plaid-generated ID that maps to the counterparty.

The counterparty type.

`merchant`: a provider of goods or services for purchase
`financial_institution`: a financial entity (bank, credit union, BNPL, fintech)
`payment_app`: a transfer or P2P app (e.g. Zelle)
`marketplace`: a marketplace (e.g. DoorDash, Google Play Store)
`payment_terminal`: a point-of-sale payment terminal (e.g. Square, Toast)
`income_source`: the payer in an income transaction (e.g., an employer, client, or government agency)

Possible values: `merchant`, `financial_institution`, `payment_app`, `marketplace`, `payment_terminal`, `income_source`

The website associated with the counterparty.

The URL of a logo associated with the counterparty, if available. The logo will always be a 100Ã100 pixel PNG file.

A description of how confident we are that the provided counterparty is involved in the transaction.

`VERY_HIGH`: We recognize this counterparty and we are more than 98% confident that it is involved in this transaction.
`HIGH`: We recognize this counterparty and we are more than 90% confident that it is involved in this transaction.
`MEDIUM`: We are moderately confident that this counterparty was involved in this transaction, but some details may differ from our records.
`LOW`: We didn't find a matching counterparty in our records, so we are returning a cleansed name parsed out of the request description.
`UNKNOWN`: We don't know the confidence level for this counterparty.

Account numbers associated with the counterparty, when available.
This field is currently only filled in for select financial institutions in Europe.

Hide object

Identifying information for a UK bank account via Bacs.

Hide object

The Bacs account number for the account.

The Bacs sort code for the account.

Account numbers using the International Bank Account Number and BIC/SWIFT code format.

Hide object

International Bank Account Number (IBAN).

Min length: `15`

Max length: `34`

Business Identifier Code (BIC) for this counterparty.

Min length: `8`

Max length: `11`

A unique, stable, Plaid-generated ID that maps to the merchant. In the case of a merchant with multiple retail locations, this field will map to the broader merchant, not a specific location or store.

The total number of transactions available within the date range specified. If `total_transactions` is larger than the size of the `transactions` array, more transactions are available and can be fetched via manipulating the `offset` parameter.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "account": {
    "account_id": "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
    "balances": {
      "available": 110.94,
      "current": 110.94,
      "iso_currency_code": "USD",
      "limit": null,
      "unofficial_currency_code": null
    },
    "mask": "0000",
    "name": "Plaid Checking",
    "official_name": "Plaid Gold Standard 0% Interest Checking",
    "subtype": "checking",
    "type": "depository"
  },
  "transactions": [
    {
      "account_id": "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
      "account_owner": null,
      "amount": 28.34,
      "iso_currency_code": "USD",
      "unofficial_currency_code": null,
      "check_number": null,
      "counterparties": [
        {
          "name": "DoorDash",
          "type": "marketplace",
          "logo_url": "https://plaid-counterparty-logos.plaid.com/doordash_1.png",
          "website": "doordash.com",
          "entity_id": "YNRJg5o2djJLv52nBA1Yn1KpL858egYVo4dpm",
          "confidence_level": "HIGH"
        },
        {
          "name": "Burger King",
          "type": "merchant",
          "logo_url": "https://plaid-merchant-logos.plaid.com/burger_king_155.png",
          "website": "burgerking.com",
          "entity_id": "mVrw538wamwdm22mK8jqpp7qd5br0eeV9o4a1",
          "confidence_level": "VERY_HIGH"
        }
      ],
      "date": "2023-09-28",
      "datetime": "2023-09-28T15:10:09Z",
      "authorized_date": "2023-09-27",
      "authorized_datetime": "2023-09-27T08:01:58Z",
      "location": {
        "address": null,
        "city": null,
        "region": null,
        "postal_code": null,
        "country": null,
        "lat": null,
        "lon": null,
        "store_number": null
      },
      "name": "Dd Doordash Burgerkin",
      "merchant_name": "Burger King",
      "merchant_entity_id": "mVrw538wamwdm22mK8jqpp7qd5br0eeV9o4a1",
      "logo_url": "https://plaid-merchant-logos.plaid.com/burger_king_155.png",
      "website": "burgerking.com",
      "payment_meta": {
        "by_order_of": null,
        "payee": null,
        "payer": null,
        "payment_method": null,
        "payment_processor": null,
        "ppd_id": null,
        "reason": null,
        "reference_number": null
      },
      "payment_channel": "online",
      "pending": true,
      "pending_transaction_id": null,
      "personal_finance_category": {
        "primary": "FOOD_AND_DRINK",
        "detailed": "FOOD_AND_DRINK_FAST_FOOD",
        "confidence_level": "VERY_HIGH"
      },
      "personal_finance_category_icon_url": "https://plaid-category-icons.plaid.com/PFC_FOOD_AND_DRINK.png",
      "transaction_id": "yhnUVvtcGGcCKU0bcz8PDQr5ZUxUXebUvbKC0",
      "transaction_code": null,
      "transaction_type": "digital"
    },
    {
      "account_id": "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
      "account_owner": null,
      "amount": 72.1,
      "iso_currency_code": "USD",
      "unofficial_currency_code": null,
      "check_number": null,
      "counterparties": [
        {
          "name": "Walmart",
          "type": "merchant",
          "logo_url": "https://plaid-merchant-logos.plaid.com/walmart_1100.png",
          "website": "walmart.com",
          "entity_id": "O5W5j4dN9OR3E6ypQmjdkWZZRoXEzVMz2ByWM",
          "confidence_level": "VERY_HIGH"
        }
      ],
      "date": "2023-09-24",
      "datetime": "2023-09-24T11:01:01Z",
      "authorized_date": "2023-09-22",
      "authorized_datetime": "2023-09-22T10:34:50Z",
      "location": {
        "address": "13425 Community Rd",
        "city": "Poway",
        "region": "CA",
        "postal_code": "92064",
        "country": "US",
        "lat": 32.959068,
        "lon": -117.037666,
        "store_number": "1700"
      },
      "name": "PURCHASE WM SUPERCENTER #1700",
      "merchant_name": "Walmart",
      "merchant_entity_id": "O5W5j4dN9OR3E6ypQmjdkWZZRoXEzVMz2ByWM",
      "logo_url": "https://plaid-merchant-logos.plaid.com/walmart_1100.png",
      "website": "walmart.com",
      "payment_meta": {
        "by_order_of": null,
        "payee": null,
        "payer": null,
        "payment_method": null,
        "payment_processor": null,
        "ppd_id": null,
        "reason": null,
        "reference_number": null
      },
      "payment_channel": "in store",
      "pending": false,
      "pending_transaction_id": "no86Eox18VHMvaOVL7gPUM9ap3aR1LsAVZ5nc",
      "personal_finance_category": {
        "primary": "GENERAL_MERCHANDISE",
        "detailed": "GENERAL_MERCHANDISE_SUPERSTORES",
        "confidence_level": "VERY_HIGH"
      },
      "personal_finance_category_icon_url": "https://plaid-category-icons.plaid.com/PFC_GENERAL_MERCHANDISE.png",
      "transaction_id": "lPNjeW1nR6CDn5okmGQ6hEpMo4lLNoSrzqDje",
      "transaction_code": null,
      "transaction_type": "place"
    }
  ],
  "total_transactions": 1,
  "request_id": "Wvhy9PZHQLV8njG"
}
```

=\*=\*=\*=[#### `/processor/transactions/recurring/get`](/docs/api/processor-partners/#processortransactionsrecurringget)

[#### Fetch recurring transaction streams](/docs/api/processor-partners/#fetch-recurring-transaction-streams)

The [`/processor/transactions/recurring/get`](/docs/api/processor-partners/#processortransactionsrecurringget) endpoint allows developers to receive a summary of the recurring outflow and inflow streams (expenses and deposits) from a user's checking, savings or credit card accounts. Additionally, Plaid provides key insights about each recurring stream including the category, merchant, last amount, and more. Developers can use these insights to build tools and experiences that help their users better manage cash flow, monitor subscriptions, reduce spend, and stay on track with bill payments.

This endpoint is offered as an add-on to Transactions. To request access to this endpoint, submit a [product access request](https://dashboard.plaid.com/team/products) or contact your Plaid account manager.

This endpoint can only be called on a processor token that has already been initialized with Transactions (either during Link, by specifying it in [`/link/token/create`](/docs/api/link/#linktokencreate); or after Link, by calling [`/processor/transactions/get`](/docs/api/processor-partners/#processortransactionsget) or [`/processor/transactions/sync`](/docs/api/processor-partners/#processortransactionssync)). Once all historical transactions have been fetched, call [`/processor/transactions/recurring/get`](/docs/api/processor-partners/#processortransactionsrecurringget) to receive the Recurring Transactions streams and subscribe to the [`RECURRING_TRANSACTIONS_UPDATE`](https://plaid.com/docs/api/products/transactions/#recurring_transactions_update) webhook. To know when historical transactions have been fetched, if you are using [`/processor/transactions/sync`](/docs/api/processor-partners/#processortransactionssync) listen for the [`SYNC_UPDATES_AVAILABLE`](https://plaid.com/docs/api/products/transactions/#SyncUpdatesAvailableWebhook-historical-update-complete) webhook and check that the `historical_update_complete` field in the payload is `true`. If using [`/processor/transactions/get`](/docs/api/processor-partners/#processortransactionsget), listen for the [`HISTORICAL_UPDATE`](https://plaid.com/docs/api/products/transactions/#historical_update) webhook.

After the initial call, you can call the [`/processor/transactions/recurring/get`](/docs/api/processor-partners/#processortransactionsrecurringget) endpoint at any point in the future to retrieve the latest summary of recurring streams. Listen to the [`RECURRING_TRANSACTIONS_UPDATE`](https://plaid.com/docs/api/products/transactions/#recurring_transactions_update) webhook to be notified when new updates are available.

To receive Transactions webhooks for a processor token, set its webhook URL via the [[`/processor/token/webhook/update`](https://plaid.com/docs/api/processor-partners/#processortokenwebhookupdate)](/docs/api/processor-partners/#processortokenwebhookupdate) endpoint.

/processor/transactions/recurring/get

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

The processor token obtained from the Plaid integration partner. Processor tokens are in the format: `processor-<environment>-<identifier>`

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

An optional object to be used with the request. If specified, `options` must not be `null`.

Hide object

Indicates which version of the personal finance category taxonomy is being used. [View PFCv2 and PFCv1 taxonomies](https://plaid.com/documents/pfc-taxonomy-all.csv).

If you enabled Transactions or Enrich before December 3, 2025 you will receive the `v1` taxonomy by default and may request `v2` by explicitly setting this field to `v2` in the request.

If you enabled Transactions or Enrich on or after December 3, 2025, you may only receive the `v2` taxonomy.

Possible values: `v1`, `v2`

/processor/transactions/recurring/get

Nodeâ¼

```
const request: ProcessorTransactionsRecurringGetRequest = {
  processor_token: processorToken
};
try {
  const response = await client.processorTransactionsRecurringGet(request);
  let inflowStreams = response.data.inflow_streams;
  let outflowStreams = response.data.outflow_streams;
} catch (error) {
  // handle error
}
```

/processor/transactions/recurring/get

**Response fields**

Collapse all

An array of depository transaction streams.

Hide object

The ID of the account to which the stream belongs

A unique id for the stream

A description of the transaction stream.

The merchant associated with the transaction stream.

The posted date of the earliest transaction in the stream.

Format: `date`

The posted date of the latest transaction in the stream.

Format: `date`

The predicted date of the next payment. This will only be set if the next payment date can be predicted.

Format: `date`

Describes the frequency of the transaction stream.

`WEEKLY`: Assigned to a transaction stream that occurs approximately every week.

`BIWEEKLY`: Assigned to a transaction stream that occurs approximately every 2 weeks.

`SEMI_MONTHLY`: Assigned to a transaction stream that occurs approximately twice per month. This frequency is typically seen for inflow transaction streams.

`MONTHLY`: Assigned to a transaction stream that occurs approximately every month.

`ANNUALLY`: Assigned to a transaction stream that occurs approximately every year.

`UNKNOWN`: Assigned to a transaction stream that does not fit any of the pre-defined frequencies.

Possible values: `UNKNOWN`, `WEEKLY`, `BIWEEKLY`, `SEMI_MONTHLY`, `MONTHLY`, `ANNUALLY`

An array of Plaid transaction IDs belonging to the stream, sorted by posted date.

Object with data pertaining to an amount on the transaction stream.

Hide object

Represents the numerical value of an amount.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `iso_currency_code`s.

The unofficial currency code of the amount. Always `null` if `iso_currency_code` is non-`null`. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Object with data pertaining to an amount on the transaction stream.

Hide object

Represents the numerical value of an amount.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `iso_currency_code`s.

The unofficial currency code of the amount. Always `null` if `iso_currency_code` is non-`null`. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Indicates whether the transaction stream is still live.

The current status of the transaction stream.

`MATURE`: A `MATURE` recurring stream should have at least 3 transactions and happen on a regular cadence (For Annual recurring stream, we will mark it `MATURE` after 2 instances).

`EARLY_DETECTION`: When a recurring transaction first appears in the transaction history and before it fulfills the requirement of a mature stream, the status will be `EARLY_DETECTION`.

`TOMBSTONED`: A stream that was previously in the `EARLY_DETECTION` status will move to the `TOMBSTONED` status when no further transactions were found at the next expected date.

`UNKNOWN`: A stream is assigned an `UNKNOWN` status when none of the other statuses are applicable.

Possible values: `UNKNOWN`, `MATURE`, `EARLY_DETECTION`, `TOMBSTONED`

Information describing the intent of the transaction. Most relevant for personal finance use cases, but not limited to such use cases.

See the [taxonomy CSV file](https://plaid.com/documents/pfc-taxonomy-all.csv) for a full list of personal finance categories. If you are migrating to personal finance categories from the legacy categories, also refer to the [migration guide](https://plaid.com/docs/transactions/pfc-migration/).

Hide object

A high level category that communicates the broad category of the transaction.

A granular category conveying the transaction's intent. This field can also be used as a unique identifier for the category.

A description of how confident we are that the provided categories accurately describe the transaction intent.

`VERY_HIGH`: We are more than 98% confident that this category reflects the intent of the transaction.
`HIGH`: We are more than 90% confident that this category reflects the intent of the transaction.
`MEDIUM`: We are moderately confident that this category reflects the intent of the transaction.
`LOW`: This category may reflect the intent, but there may be other categories that are more accurate.
`UNKNOWN`: We don't know the confidence level for this category.

Indicates which version of the personal finance category taxonomy is being used. [View PFCv2 and PFCv1 taxonomies](https://plaid.com/documents/pfc-taxonomy-all.csv).

If you enabled Transactions or Enrich before December 3, 2025 you will receive the `v1` taxonomy by default and may request `v2` by explicitly setting this field to `v2` in the request.

If you enabled Transactions or Enrich on or after December 3, 2025, you may only receive the `v2` taxonomy.

Possible values: `v1`, `v2`

As the ability to modify transactions streams has been discontinued, this field will always be `false`.

An array of expense transaction streams.

Hide object

The ID of the account to which the stream belongs

A unique id for the stream

A description of the transaction stream.

The merchant associated with the transaction stream.

The posted date of the earliest transaction in the stream.

Format: `date`

The posted date of the latest transaction in the stream.

Format: `date`

The predicted date of the next payment. This will only be set if the next payment date can be predicted.

Format: `date`

Describes the frequency of the transaction stream.

`WEEKLY`: Assigned to a transaction stream that occurs approximately every week.

`BIWEEKLY`: Assigned to a transaction stream that occurs approximately every 2 weeks.

`SEMI_MONTHLY`: Assigned to a transaction stream that occurs approximately twice per month. This frequency is typically seen for inflow transaction streams.

`MONTHLY`: Assigned to a transaction stream that occurs approximately every month.

`ANNUALLY`: Assigned to a transaction stream that occurs approximately every year.

`UNKNOWN`: Assigned to a transaction stream that does not fit any of the pre-defined frequencies.

Possible values: `UNKNOWN`, `WEEKLY`, `BIWEEKLY`, `SEMI_MONTHLY`, `MONTHLY`, `ANNUALLY`

An array of Plaid transaction IDs belonging to the stream, sorted by posted date.

Object with data pertaining to an amount on the transaction stream.

Hide object

Represents the numerical value of an amount.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `iso_currency_code`s.

The unofficial currency code of the amount. Always `null` if `iso_currency_code` is non-`null`. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Object with data pertaining to an amount on the transaction stream.

Hide object

Represents the numerical value of an amount.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `iso_currency_code`s.

The unofficial currency code of the amount. Always `null` if `iso_currency_code` is non-`null`. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

Indicates whether the transaction stream is still live.

The current status of the transaction stream.

`MATURE`: A `MATURE` recurring stream should have at least 3 transactions and happen on a regular cadence (For Annual recurring stream, we will mark it `MATURE` after 2 instances).

`EARLY_DETECTION`: When a recurring transaction first appears in the transaction history and before it fulfills the requirement of a mature stream, the status will be `EARLY_DETECTION`.

`TOMBSTONED`: A stream that was previously in the `EARLY_DETECTION` status will move to the `TOMBSTONED` status when no further transactions were found at the next expected date.

`UNKNOWN`: A stream is assigned an `UNKNOWN` status when none of the other statuses are applicable.

Possible values: `UNKNOWN`, `MATURE`, `EARLY_DETECTION`, `TOMBSTONED`

Information describing the intent of the transaction. Most relevant for personal finance use cases, but not limited to such use cases.

See the [taxonomy CSV file](https://plaid.com/documents/pfc-taxonomy-all.csv) for a full list of personal finance categories. If you are migrating to personal finance categories from the legacy categories, also refer to the [migration guide](https://plaid.com/docs/transactions/pfc-migration/).

Hide object

A high level category that communicates the broad category of the transaction.

A granular category conveying the transaction's intent. This field can also be used as a unique identifier for the category.

A description of how confident we are that the provided categories accurately describe the transaction intent.

`VERY_HIGH`: We are more than 98% confident that this category reflects the intent of the transaction.
`HIGH`: We are more than 90% confident that this category reflects the intent of the transaction.
`MEDIUM`: We are moderately confident that this category reflects the intent of the transaction.
`LOW`: This category may reflect the intent, but there may be other categories that are more accurate.
`UNKNOWN`: We don't know the confidence level for this category.

Indicates which version of the personal finance category taxonomy is being used. [View PFCv2 and PFCv1 taxonomies](https://plaid.com/documents/pfc-taxonomy-all.csv).

If you enabled Transactions or Enrich before December 3, 2025 you will receive the `v1` taxonomy by default and may request `v2` by explicitly setting this field to `v2` in the request.

If you enabled Transactions or Enrich on or after December 3, 2025, you may only receive the `v2` taxonomy.

Possible values: `v1`, `v2`

As the ability to modify transactions streams has been discontinued, this field will always be `false`.

Timestamp in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (`YYYY-MM-DDTHH:mm:ssZ`) indicating the last time transaction streams for the given account were updated on

Format: `date-time`

Indicates which version of the personal finance category taxonomy is being used. [View PFCv2 and PFCv1 taxonomies](https://plaid.com/documents/pfc-taxonomy-all.csv).

If you enabled Transactions or Enrich before December 3, 2025 you will receive the `v1` taxonomy by default and may request `v2` by explicitly setting this field to `v2` in the request.

If you enabled Transactions or Enrich on or after December 3, 2025, you may only receive the `v2` taxonomy.

Possible values: `v1`, `v2`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "updated_datetime": "2022-05-01T00:00:00Z",
  "inflow_streams": [
    {
      "account_id": "lPNjeW1nR6CDn5okmGQ6hEpMo4lLNoSrzqDje",
      "stream_id": "no86Eox18VHMvaOVL7gPUM9ap3aR1LsAVZ5nc",
      "category": null,
      "category_id": null,
      "description": "Platypus Payroll",
      "merchant_name": null,
      "personal_finance_category": {
        "primary": "INCOME",
        "detailed": "INCOME_WAGES",
        "confidence_level": "UNKNOWN"
      },
      "first_date": "2022-02-28",
      "last_date": "2022-04-30",
      "predicted_next_date": "2022-05-15",
      "frequency": "SEMI_MONTHLY",
      "transaction_ids": [
        "nkeaNrDGrhdo6c4qZWDA8ekuIPuJ4Avg5nKfw",
        "EfC5ekksdy30KuNzad2tQupW8WIPwvjXGbGHL",
        "ozfvj3FFgp6frbXKJGitsDzck5eWQH7zOJBYd",
        "QvdDE8AqVWo3bkBZ7WvCd7LskxVix8Q74iMoK",
        "uQozFPfMzibBouS9h9tz4CsyvFll17jKLdPAF"
      ],
      "average_amount": {
        "amount": -800,
        "iso_currency_code": "USD",
        "unofficial_currency_code": null
      },
      "last_amount": {
        "amount": -1000,
        "iso_currency_code": "USD",
        "unofficial_currency_code": null
      },
      "is_active": true,
      "status": "MATURE",
      "is_user_modified": false
    }
  ],
  "outflow_streams": [
    {
      "account_id": "lPNjeW1nR6CDn5okmGQ6hEpMo4lLNoSrzqDff",
      "stream_id": "no86Eox18VHMvaOVL7gPUM9ap3aR1LsAVZ5nd",
      "category": null,
      "category_id": null,
      "description": "ConEd Bill Payment",
      "merchant_name": "ConEd",
      "personal_finance_category": {
        "primary": "RENT_AND_UTILITIES",
        "detailed": "RENT_AND_UTILITIES_GAS_AND_ELECTRICITY",
        "confidence_level": "UNKNOWN"
      },
      "first_date": "2022-02-04",
      "last_date": "2022-05-02",
      "predicted_next_date": "2022-06-02",
      "frequency": "MONTHLY",
      "transaction_ids": [
        "yhnUVvtcGGcCKU0bcz8PDQr5ZUxUXebUvbKC0",
        "HPDnUVgI5Pa0YQSl0rxwYRwVXeLyJXTWDAvpR",
        "jEPoSfF8xzMClE9Ohj1he91QnvYoSdwg7IT8L",
        "CmdQTNgems8BT1B7ibkoUXVPyAeehT3Tmzk0l"
      ],
      "average_amount": {
        "amount": 85,
        "iso_currency_code": "USD",
        "unofficial_currency_code": null
      },
      "last_amount": {
        "amount": 100,
        "iso_currency_code": "USD",
        "unofficial_currency_code": null
      },
      "is_active": true,
      "status": "MATURE",
      "is_user_modified": false
    },
    {
      "account_id": "lPNjeW1nR6CDn5okmGQ6hEpMo4lLNoSrzqDff",
      "stream_id": "SrBNJZDuUMweodmPmSOeOImwsWt53ZXfJQAfC",
      "category": null,
      "category_id": null,
      "description": "Costco Annual Membership",
      "merchant_name": "Costco",
      "personal_finance_category": {
        "primary": "GENERAL_MERCHANDISE",
        "detailed": "GENERAL_MERCHANDISE_SUPERSTORES",
        "confidence_level": "UNKNOWN"
      },
      "first_date": "2022-01-23",
      "last_date": "2023-01-22",
      "predicted_next_date": "2024-01-22",
      "frequency": "ANNUALLY",
      "transaction_ids": [
        "yqEBJ72cS4jFwcpxJcDuQr94oAQ1R1lMC33D4",
        "Kz5Hm3cZCgpn4tMEKUGAGD6kAcxMBsEZDSwJJ"
      ],
      "average_amount": {
        "amount": 120,
        "iso_currency_code": "USD",
        "unofficial_currency_code": null
      },
      "last_amount": {
        "amount": 120,
        "iso_currency_code": "USD",
        "unofficial_currency_code": null
      },
      "is_active": true,
      "status": "MATURE",
      "is_user_modified": false
    }
  ],
  "request_id": "tbFyCEqkU775ZGG"
}
```

=\*=\*=\*=[#### `/processor/transactions/refresh`](/docs/api/processor-partners/#processortransactionsrefresh)

[#### Refresh transaction data](/docs/api/processor-partners/#refresh-transaction-data)

[`/processor/transactions/refresh`](/docs/api/processor-partners/#processortransactionsrefresh) is an optional endpoint for users of the Transactions product. It initiates an on-demand extraction to fetch the newest transactions for a processor token. This on-demand extraction takes place in addition to the periodic extractions that automatically occur one or more times per day for any Transactions-enabled processor token. If changes to transactions are discovered after calling [`/processor/transactions/refresh`](/docs/api/processor-partners/#processortransactionsrefresh), Plaid will fire a webhook: for [`/processor/transactions/sync`](/docs/api/processor-partners/#processortransactionssync) users, [`SYNC_UPDATES_AVAILABLE`](https://plaid.com/docs/api/products/transactions/#sync_updates_available) will be fired if there are any transactions updated, added, or removed. For users of both [`/processor/transactions/sync`](/docs/api/processor-partners/#processortransactionssync) and [`/processor/transactions/get`](/docs/api/processor-partners/#processortransactionsget), [`TRANSACTIONS_REMOVED`](https://plaid.com/docs/api/products/transactions/#transactions_removed) will be fired if any removed transactions are detected, and [`DEFAULT_UPDATE`](https://plaid.com/docs/api/products/transactions/#default_update) will be fired if any new transactions are detected. New transactions can be fetched by calling [`/processor/transactions/get`](/docs/api/processor-partners/#processortransactionsget) or [`/processor/transactions/sync`](/docs/api/processor-partners/#processortransactionssync). Note that the [`/processor/transactions/refresh`](/docs/api/processor-partners/#processortransactionsrefresh) endpoint is not supported for Capital One (`ins_128026`) non-depository accounts and will result in a `PRODUCTS_NOT_SUPPORTED` error if called on an Item that contains only non-depository accounts from that institution.

As this endpoint triggers a synchronous request for fresh data, latency may be higher than for other Plaid endpoints (typically less than 10 seconds, but occasionally up to 30 seconds or more); if you encounter errors, you may find it necessary to adjust your timeout period when making requests.

[`/processor/transactions/refresh`](/docs/api/processor-partners/#processortransactionsrefresh) is offered as an add-on to Transactions and has a separate [fee model](https://plaid.com/docs/account/billing/#per-request-flat-fee). To request access to this endpoint, submit a [product access request](https://dashboard.plaid.com/team/products) or contact your Plaid account manager.

/processor/transactions/refresh

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

The processor token obtained from the Plaid integration partner. Processor tokens are in the format: `processor-<environment>-<identifier>`

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

/processor/transactions/refresh

Nodeâ¼

```
const request: ProcessorTransactionsRefreshRequest = {
  processor_token: processorToken,
};
try {
  await plaidClient.processorTransactionsRefresh(request);
} catch (error) {
  // handle error
}
```

/processor/transactions/refresh

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "1vwmF5TBQwiqfwP"
}
```

[## Processor webhooks](/docs/api/processor-partners/#processor-webhooks)=\*=\*=\*=[#### `WEBHOOK_UPDATE_ACKNOWLEDGED`](/docs/api/processor-partners/#webhook_update_acknowledged)

This webhook is only sent to [Plaid processor partners](https://plaid.com/docs/auth/partnerships/).

Fired when a processor updates the webhook URL for a processor token via [`/processor/token/webhook/update`](/docs/api/processor-partners/#processortokenwebhookupdate).

**Properties**

Collapse all

`PROCESSOR_TOKEN`

`WEBHOOK_UPDATE_ACKNOWLEDGED`

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

The ID of the account.

The new webhook URL.

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "PROCESSOR_TOKEN",
  "webhook_code": "WEBHOOK_UPDATE_ACKNOWLEDGED",
  "account_id": "dVzbVMLjrxTnLjX4G66XUp5GLklm4oiZy88yK",
  "new_webhook_url": "https://www.example.com",
  "error": null,
  "environment": "production"
}
```
