---
title: "Investments Move"
source_url: "https://plaid.com/docs/api/products/investments-move/"
section: "Payments and Funding"
section_id: "01-payments-and-funding"
slug: "investments-move"
endpoints:
  - "/investments/auth/get"
  - "/processor/investments/auth/get"
  - "webhook"
  - "/transfer/migrate_account"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Investments Move

> **Source:** [https://plaid.com/docs/api/products/investments-move/](https://plaid.com/docs/api/products/investments-move/)
> **Section:** Payments and Funding

## Endpoints & Webhooks on this page

- `/investments/auth/get`
- `/processor/investments/auth/get`
- `webhook`
- `/transfer/migrate_account`

---

# Investments Move

#### API reference for Investments Move endpoints and webhooks

For how-to guidance, see the [Investments Move documentation](/docs/investments-move/).

| Endpoints |  |
| --- | --- |
| [`/investments/auth/get`](/docs/api/products/investments-move/#investmentsauthget) | Fetch investments data required for ACATS or ATON transfer |

| See also |  |
| --- | --- |
| [`/processor/investments/auth/get`](/docs/api/processor-partners/#processorinvestmentsauthget) | Fetch Investments Auth data |

=\*=\*=\*=[#### `/investments/auth/get`](/docs/api/products/investments-move/#investmentsauthget)

[#### Get data needed to authorize an investments transfer](/docs/api/products/investments-move/#get-data-needed-to-authorize-an-investments-transfer)

The [`/investments/auth/get`](/docs/api/products/investments-move/#investmentsauthget) endpoint allows developers to receive user-authorized data to facilitate the transfer of holdings

/investments/auth/get

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The access token associated with the Item for which data is being requested.

An optional object to filter `/investments/auth/get` results.

Hide object

An array of `account_id`s to retrieve for the Item. An error will be returned if a provided `account_id` is not associated with the Item.

/investments/auth/get

Nodeâ¼

```
const request: InvestmentsAuthGetRequest = {
  access_token: accessToken,
};
try {
  const response = await plaidClient.investmentsAuthGet(request);
  const investmentsAuthData = response.data;
} catch (error) {
  // handle error
}
```

/investments/auth/get

**Response fields**

Collapse all

The accounts for which data is being retrieved

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

Objects describing the securities held in the accounts associated with the Item.

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

Information about the account owners for the accounts associated with the Item.

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
      "account_id": "31qEA6LPwGumkA4Z5mGbfyGwr4mL6nSZlQqpZ",
      "balances": {
        "available": 43200,
        "current": 43200,
        "iso_currency_code": "USD",
        "limit": null,
        "margin_loan_amount": null,
        "unofficial_currency_code": null
      },
      "mask": "4444",
      "name": "Plaid Money Market",
      "official_name": "Plaid Platinum Standard 1.85% Interest Money Market",
      "subtype": "money market",
      "type": "depository"
    },
    {
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
    }
  ],
  "holdings": [
    {
      "account_id": "xlP8npRxwgCj48LQbjxWipkeL3gbyXf64knoy",
      "cost_basis": 1,
      "institution_price": 1,
      "institution_price_as_of": "2021-05-25",
      "institution_price_datetime": null,
      "institution_value": 0.01,
      "iso_currency_code": "USD",
      "quantity": 0.01,
      "security_id": "d6ePmbPxgWCWmMVv66q9iPV94n91vMtov5Are",
      "unofficial_currency_code": null,
      "vested_quantity": 1,
      "vested_value": 1
    },
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
      "cost_basis": 94.808,
      "institution_price": 94.808,
      "institution_price_as_of": "2021-04-13",
      "institution_price_datetime": null,
      "institution_value": 94.808,
      "iso_currency_code": "USD",
      "quantity": 1,
      "security_id": "Lxe4yz4XQEtwb2YArO7RFMpPDvPxy7FALRyea",
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
  "item": {
    "available_products": [
      "assets",
      "balance",
      "beacon",
      "cra_base_report",
      "cra_income_insights",
      "signal",
      "identity",
      "identity_match",
      "income",
      "income_verification",
      "investments",
      "processor_identity",
      "recurring_transactions",
      "transactions"
    ],
    "billed_products": [
      "investments_auth"
    ],
    "consent_expiration_time": null,
    "error": null,
    "institution_id": "ins_115616",
    "institution_name": "Vanguard",
    "item_id": "7qBnDwLP3aIZkD7NKZ5ysk5X9xVxDWHg65oD5",
    "products": [
      "investments_auth"
    ],
    "update_type": "background",
    "webhook": "https://www.genericwebhookurl.com/webhook"
  },
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
  "owners": [
    {
      "account_id": "31qEA6LPwGumkA4Z5mGbfyGwr4mL6nSZlQqpZ",
      "names": [
        "Alberta Bobbeth Charleson"
      ]
    },
    {
      "account_id": "xlP8npRxwgCj48LQbjxWipkeL3gbyXf64knoy",
      "names": [
        "Alberta Bobbeth Charleson"
      ]
    }
  ],
  "request_id": "hPCXou4mm9Qwzzu",
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
      "close_price": 94.808,
      "close_price_as_of": "2023-11-02",
      "cusip": "912797HE0",
      "cfi_code": "DYZTXR",
      "fixed_income": {
        "face_value": 100,
        "issue_date": "2023-11-02",
        "maturity_date": "2024-10-31",
        "yield_rate": {
          "percentage": 5.43,
          "type": "coupon_equivalent"
        }
      },
      "industry": "Sovereign Government",
      "institution_id": null,
      "institution_security_id": null,
      "is_cash_equivalent": false,
      "isin": null,
      "iso_currency_code": "USD",
      "market_identifier_code": null,
      "name": "US Treasury Bill - 5.43% 31/10/2024 USD 100",
      "option_contract": null,
      "proxy_security_id": null,
      "sector": "Government",
      "security_id": "Lxe4yz4XQEtwb2YArO7RFMpPDvPxy7FALRyea",
      "sedol": null,
      "ticker_symbol": null,
      "type": "fixed income",
      "subtype": "bill",
      "unofficial_currency_code": null,
      "update_datetime": null
    },
    {
      "close_price": 9.08,
      "close_price_as_of": "2024-09-09",
      "cusip": null,
      "cfi_code": "CIOIBS",
      "fixed_income": null,
      "industry": "Investment Trusts or Mutual Funds",
      "institution_id": null,
      "institution_security_id": null,
      "is_cash_equivalent": false,
      "isin": null,
      "iso_currency_code": "USD",
      "market_identifier_code": null,
      "name": "DoubleLine Total Return Bond I",
      "option_contract": null,
      "proxy_security_id": null,
      "sector": "Miscellaneous",
      "security_id": "AE5rBXra1AuZLE34rkvvIyG8918m3wtRzElnJ",
      "sedol": null,
      "ticker_symbol": "DBLTX",
      "type": "mutual fund",
      "subtype": "mutual fund",
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
    },
    {
      "close_price": 1,
      "close_price_as_of": null,
      "cusip": null,
      "cfi_code": null,
      "fixed_income": null,
      "industry": null,
      "institution_id": null,
      "institution_security_id": null,
      "is_cash_equivalent": true,
      "isin": null,
      "iso_currency_code": "USD",
      "market_identifier_code": null,
      "name": "U S Dollar",
      "option_contract": null,
      "proxy_security_id": null,
      "sector": null,
      "security_id": "d6ePmbPxgWCWmMVv66q9iPV94n91vMtov5Are",
      "sedol": null,
      "ticker_symbol": null,
      "type": "cash",
      "subtype": "cash",
      "unofficial_currency_code": null,
      "update_datetime": null
    }
  ],
  "data_sources": {
    "numbers": "INSTITUTION",
    "owners": "INSTITUTION",
    "holdings": "INSTITUTION"
  }
}
```
