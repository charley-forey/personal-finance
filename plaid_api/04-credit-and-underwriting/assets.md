---
title: "Assets"
source_url: "https://plaid.com/docs/api/products/assets/"
section: "Credit and Underwriting"
section_id: "04-credit-and-underwriting"
slug: "assets"
endpoints:
  - "/asset_report/create"
  - "/asset_report/get"
  - "/asset_report/pdf/get"
  - "/asset_report/refresh"
  - "/asset_report/filter"
  - "/asset_report/remove"
  - "/asset_report/audit_copy/create"
  - "/asset_report/audit_copy/remove"
  - "/credit/relay/create"
  - "/credit/relay/get"
  - "/credit/relay/refresh"
  - "/credit/relay/remove"
  - "PRODUCT_READY"
  - "ERROR"
  - "Asset Report webhooks"
  - "webhook"
  - "/categories/get"
  - "/accounts/get"
  - "/item/remove"
  - "Webhooks"
  - "webhook_type"
  - "webhook_code"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Assets

> **Source:** [https://plaid.com/docs/api/products/assets/](https://plaid.com/docs/api/products/assets/)
> **Section:** Credit and Underwriting

## Endpoints & Webhooks on this page

- `/asset_report/create`
- `/asset_report/get`
- `/asset_report/pdf/get`
- `/asset_report/refresh`
- `/asset_report/filter`
- `/asset_report/remove`
- `/asset_report/audit_copy/create`
- `/asset_report/audit_copy/remove`
- `/credit/relay/create`
- `/credit/relay/get`
- `/credit/relay/refresh`
- `/credit/relay/remove`
- `PRODUCT_READY`
- `ERROR`
- `Asset Report webhooks`
- `webhook`
- `/categories/get`
- `/accounts/get`
- `/item/remove`
- `Webhooks`
- `webhook_type`
- `webhook_code`

---

# Assets

#### API reference for Assets endpoints and webhooks

Create, delete, retrieve and share Asset Reports with information about a user's assets and transactions. For how-to guidance on Asset Reports, see the [Assets documentation](/docs/assets/).

All the endpoints on this page are also compatible with [Financial Insights Reports (UK only)](/docs/assets/#financial-insights-reports-uk-only) and will automatically operate on Financial Insights Reports instead of Asset Reports if the Financial Insights Report add-on has been enabled.

| Endpoints |  |
| --- | --- |
| [`/asset_report/create`](/docs/api/products/assets/#asset_reportcreate) | Create an Asset Report |
| [`/asset_report/get`](/docs/api/products/assets/#asset_reportget) | Get an Asset Report |
| [`/asset_report/pdf/get`](/docs/api/products/assets/#asset_reportpdfget) | Get a PDF Asset Report |
| [`/asset_report/refresh`](/docs/api/products/assets/#asset_reportrefresh) | Create an updated Asset Report |
| [`/asset_report/filter`](/docs/api/products/assets/#asset_reportfilter) | Filter unneeded accounts from an Asset Report |
| [`/asset_report/remove`](/docs/api/products/assets/#asset_reportremove) | Delete an asset report |
| [`/asset_report/audit_copy/create`](/docs/api/products/assets/#asset_reportaudit_copycreate) | Create an Audit Copy of an Asset Report for sharing |
| [`/asset_report/audit_copy/remove`](/docs/api/products/assets/#asset_reportaudit_copyremove) | Delete an Audit Copy of an Asset Report |
| [`/credit/relay/create`](/docs/api/products/assets/#creditrelaycreate) | Create a relay token of an Asset Report for sharing (beta) |
| [`/credit/relay/get`](/docs/api/products/assets/#creditrelayget) | Retrieve the report associated with a relay token (beta) |
| [`/credit/relay/refresh`](/docs/api/products/assets/#creditrelayrefresh) | Refresh a report of a relay token (beta) |
| [`/credit/relay/remove`](/docs/api/products/assets/#creditrelayremove) | Delete a relay token (beta) |

| Webhooks |  |
| --- | --- |
| [`PRODUCT_READY`](/docs/api/products/assets/#product_ready) | Asset Report generation has completed |
| [`ERROR`](/docs/api/products/assets/#error) | Asset Report generation has failed |

[### Endpoints](/docs/api/products/assets/#endpoints)=\*=\*=\*=[#### `/asset_report/create`](/docs/api/products/assets/#asset_reportcreate)

[#### Create an Asset Report](/docs/api/products/assets/#create-an-asset-report)

The [`/asset_report/create`](/docs/api/products/assets/#asset_reportcreate) endpoint initiates the process of creating an Asset Report, which can then be retrieved by passing the `asset_report_token` return value to the [`/asset_report/get`](/docs/api/products/assets/#asset_reportget) or [`/asset_report/pdf/get`](/docs/api/products/assets/#asset_reportpdfget) endpoints.

The Asset Report takes some time to be created and is not available immediately after calling [`/asset_report/create`](/docs/api/products/assets/#asset_reportcreate). The exact amount of time to create the report will vary depending on how many days of history are requested and will typically range from a few seconds to about one minute. When the Asset Report is ready to be retrieved using [`/asset_report/get`](/docs/api/products/assets/#asset_reportget) or [`/asset_report/pdf/get`](/docs/api/products/assets/#asset_reportpdfget), Plaid will fire a `PRODUCT_READY` webhook. For full details of the webhook schema, see [Asset Report webhooks](https://plaid.com/docs/api/products/assets/#webhooks).

The [`/asset_report/create`](/docs/api/products/assets/#asset_reportcreate) endpoint creates an Asset Report at a moment in time. Asset Reports are immutable. To get an updated Asset Report, use the [`/asset_report/refresh`](/docs/api/products/assets/#asset_reportrefresh) endpoint.

/asset\_report/create

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

An array of access tokens corresponding to the Items that will be included in the report. The `assets` product must have been initialized for the Items during Link; the Assets product cannot be added after initialization.

Min items: `1`

Max items: `99`

The maximum integer number of days of history to include in the Asset Report. If using Fannie Mae Day 1 Certainty, `days_requested` must be at least 61 for new originations or at least 31 for refinancings.

An Asset Report requested with "Additional History" (that is, with more than 61 days of transaction history) will incur an Additional History fee.

Maximum: `731`

Minimum: `0`

An optional object to filter `/asset_report/create` results. If provided, must be non-`null`. The optional `user` object is required for the report to be eligible for Fannie Mae's Day 1 Certainty program.

Hide object

Client-generated identifier, which can be used by lenders to track loan applications.

URL to which Plaid will send Assets webhooks, for example when the requested Asset Report is ready.

Format: `url`

A list of add-ons that should be included in the Asset Report.

When Fast Assets is requested, Plaid will create two versions of the Asset Report: the Fast Asset Report, which will contain only Identity and Balance information, and the Full Asset Report, which will also contain Transactions information. A `PRODUCT_READY` webhook will be fired for each Asset Report when it is ready, and the `report_type` field will indicate whether the webhook is firing for the `full` or `fast` Asset Report. To retrieve the Fast Asset Report, call `/asset_report/get` with `fast_report` set to `true`. There is no additional charge for using Fast Assets. To create a Fast Asset Report, Plaid must successfully retrieve both Identity and Balance data; if Plaid encounters an error obtaining this data, the Fast Asset Report will not be created. However, as long as Plaid can obtain Transactions data, the Full Asset Report will still be available.

When Investments is requested, `investments` must be specified in the `optional_products` array when initializing Link.

Possible values: `investments`, `fast_assets`

The user object allows you to provide additional information about the user to be appended to the Asset Report. All fields are optional. The `first_name`, `last_name`, and `ssn` fields are required if you would like the Report to be eligible for Fannie Mae's Day 1 Certaintyâ¢ program.

Hide object

An identifier you determine and submit for the user.

The user's first name. Required for the Fannie Mae Day 1 Certaintyâ¢ program.

The user's middle name

The user's last name. Required for the Fannie Mae Day 1 Certaintyâ¢ program.

The user's Social Security Number. Required for the Fannie Mae Day 1 Certaintyâ¢ program.

Format: "ddd-dd-dddd"

The user's phone number, in E.164 format: +{countrycode}{number}. For example: "+14151234567". Phone numbers provided in other formats will be parsed on a best-effort basis.

The user's email address.

By default (`true`), the asynchronous report generation fails unless all Items extract successfully. If set to `false`, the report will still be generated as long as at least one Item extracts successfully; extraction failures on the remaining Items are tolerated. This setting applies only to failures that occur during asynchronous extraction. It does not relax the synchronous check at call time: if any Item is already unhealthy when `/asset_report/create` is invoked, the request fails immediately regardless of this value.

Default: `true`

/asset\_report/create

Nodeâ¼

```
const daysRequested = 90;
const options = {
  client_report_id: '123',
  webhook: 'https://www.example.com',
  user: {
    client_user_id: '7f57eb3d2a9j6480121fx361',
    first_name: 'Jane',
    middle_name: 'Leah',
    last_name: 'Doe',
    ssn: '123-45-6789',
    phone_number: '(555) 123-4567',
    email: 'jane.doe@example.com',
  },
};
const request: AssetReportCreateRequest = {
  access_tokens: [accessToken],
  days_requested,
  options,
};
// accessTokens is an array of Item access tokens.
// Note that the assets product must be enabled for all Items.
// All fields on the options object are optional.
try {
  const response = await plaidClient.assetReportCreate(request);
  const assetReportId = response.data.asset_report_id;
  const assetReportToken = response.data.asset_report_token;
} catch (error) {
  // handle error
}
```

/asset\_report/create

**Response fields**

A token that can be provided to endpoints such as `/asset_report/get` or `/asset_report/pdf/get` to fetch or update an Asset Report.

A unique ID identifying an Asset Report. Like all Plaid identifiers, this ID is case sensitive.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "asset_report_token": "assets-sandbox-6f12f5bb-22dd-4855-b918-f47ec439198a",
  "asset_report_id": "1f414183-220c-44f5-b0c8-bc0e6d4053bb",
  "request_id": "Iam3b"
}
```

=\*=\*=\*=[#### `/asset_report/get`](/docs/api/products/assets/#asset_reportget)

[#### Retrieve an Asset Report](/docs/api/products/assets/#retrieve-an-asset-report)

The [`/asset_report/get`](/docs/api/products/assets/#asset_reportget) endpoint retrieves the Asset Report in JSON format. Before calling [`/asset_report/get`](/docs/api/products/assets/#asset_reportget), you must first create the Asset Report using [`/asset_report/create`](/docs/api/products/assets/#asset_reportcreate) (or filter an Asset Report using [`/asset_report/filter`](/docs/api/products/assets/#asset_reportfilter)) and then wait for the [`PRODUCT_READY`](https://plaid.com/docs/api/products/assets/#product_ready) webhook to fire, indicating that the Report is ready to be retrieved.

By default, an Asset Report includes transaction descriptions as returned by the bank, as opposed to parsed and categorized by Plaid. You can also receive cleaned and categorized transactions, as well as additional insights like merchant name or location information. We call this an Asset Report with Insights. An Asset Report with Insights provides transaction category, location, and merchant information in addition to the transaction strings provided in a standard Asset Report. To retrieve an Asset Report with Insights, call the [`/asset_report/get`](/docs/api/products/assets/#asset_reportget) endpoint with `include_insights` set to `true`.

For latency-sensitive applications, you can optionally call [`/asset_report/create`](/docs/api/products/assets/#asset_reportcreate) with `options.add_ons` set to `["fast_assets"]`. This will cause Plaid to create two versions of the Asset Report: one with only current and available balance and identity information, and then later on the complete Asset Report. You will receive separate webhooks for each version of the Asset Report.

/asset\_report/get

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

A token that can be provided to endpoints such as `/asset_report/get` or `/asset_report/pdf/get` to fetch or update an Asset Report.

`true` if you would like to retrieve the Asset Report with Insights, `false` otherwise. This field defaults to `false` if omitted.

Default: `false`

`true` to fetch "fast" version of asset report. Defaults to false if omitted. Can only be used if `/asset_report/create` was called with `options.add_ons` set to `["fast_assets"]`.

Default: `false`

An optional object to filter or add data to `/asset_report/get` results. If provided, must be non-`null`.

Hide object

The maximum number of days of history to include in the Asset Report.

Maximum: `731`

Minimum: `0`

/asset\_report/get

Nodeâ¼

```
const request: AssetReportGetRequest = {
  asset_report_token: assetReportToken,
  include_insights: true,
};
try {
  const response = await plaidClient.assetReportGet(request);
  const report = response.data.report;
} catch (error) {
  if (error.data.error_code == 'PRODUCT_NOT_READY') {
    // Asset report is not ready yet. Try again later
  } else {
    // handle error
  }
}
```

/asset\_report/get

**Response fields**

Collapse all

An object representing an Asset Report

Hide object

A unique ID identifying an Asset Report. Like all Plaid identifiers, this ID is case sensitive.

This is a container object for all lending-related insights. This field will be returned only for European customers.

Hide object

Risk indicators focus on providing signal on the possibility of a borrower defaulting on their loan repayments by providing data points related to its payment behavior, debt, and other relevant financial information, helping lenders gauge the level of risk involved in a certain operation.

Hide object

Insights into bank penalties and fees, including overdraft fees, NSF fees, and other bank-imposed charges.

Hide object

The total value of outflow transactions categorized as `BANK_PENALTIES`, across all the accounts in the report within the requested time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Detailed categories view of all the transactions that fall into the `BANK_PENALTIES` credit category within the given time window, across all the accounts in the report.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of transactions that fall into the `BANK_PENALTIES` credit category, across all the accounts in the report.

The monthly summaries of the transactions that fall into the `BANK_PENALTIES` credit category within the given time window, across all the accounts in the report.

Hide object

The start date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The end date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The number of days since the last transaction that falls into the `BANK_PENALTIES` credit category, across all the accounts in the report.

The percentage of the user's monthly inflows that was spent on transactions that fall into the `BANK_PENALTIES` credit category within the given time window, across all the accounts in the report. For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into the `BANK_PENALTIES` credit category.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

Insights into gambling-related transactions, including frequency, amounts, and top merchants.

Hide object

The total value of transactions that fall into the `GAMBLING` credit category, across all the accounts in the report.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Up to 3 top merchants that the user had the most transactions for in the given time window, in descending order of total spend.

If the user has not spent money on any merchants in the given time window, this list will be empty.

The total number of transactions that fall into the `GAMBLING` credit category, across all the accounts in the report.

The monthly summaries of the transactions that fall into the `GAMBLING` category within the given time window, across all the accounts in the report.

Hide object

The start date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The end date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The number of days since the last transaction that falls into the `GAMBLING` category, across all the accounts in the report.

The percentage of the user's monthly inflows that was spent on transactions that fall into the `GAMBLING` category within the given time window, across all the accounts in the report. For example, a value of 100 indicates that 100% of the inflows were spent on transactions that fall into the `GAMBLING` credit category.
If there's no available income for the given time period, this field value will be `-1`

Format: `double`

Insights into loan disbursement transactions received by the user, tracking incoming funds from loan providers.

Hide object

The total value of inflow transactions categorized as `LOAN_DISBURSEMENTS`, across all the accounts in the report within the requested time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Detailed categories view of all the transactions that fall into the `LOAN_DISBURSEMENTS` credit category within the given time window, across all the accounts in the report.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Up to 3 top service providers that the user had the most transactions for in the given time window, in descending order of total spend.

If the user has not received money from any provider in the given time window, this list will be empty.

The total number of transactions that fall into the `LOAN_DISBURSEMENTS` credit category, across all the accounts in the report.

The monthly summaries of the transactions that fall into the `LOAN_DISBURSEMENTS` category within the given time window, across all the accounts in the report.

Hide object

The start date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The end date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The number of days since the last transaction that falls into the `LOAN_DISBURSEMENTS` credit category, across all the accounts in the report.

The percentage of the user's monthly inflows that was received on transactions that fall into the `LOAN_DISBURSEMENTS` credit category within the given time window, across all the accounts in the report. For example, a value of 100 indicates that 100% of the inflows were spent on transactions that fall into the `LOAN_DISBURSEMENTS` credit category.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

Insights into loan payment transactions made by the user, tracking outgoing payments to loan providers.

Hide object

The total value of outflow transactions categorized as `LOAN_PAYMENTS`, across all the accounts in the report within the requested time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Detailed categories view of all the transactions that fall into the `LOAN_PAYMENTS` credit category within the given time window, across all the accounts in the report.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Up to 3 top service providers that the user had the most transactions for in the given time window, in descending order of total spend.

If the user has not spent money on any provider in the given time window, this list will be empty.

The total number of transactions that fall into the `LOAN_PAYMENTS` credit category, across all the accounts in the report.

The monthly summaries of the transactions that fall into the `LOAN_PAYMENTS` credit category within the given time window, across all the accounts in the report.

Hide object

The start date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The end date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The number of days since the last transaction that falls into the `LOAN_PAYMENTS` credit category, across all the accounts in the report.

The percentage of the user's monthly inflows that was spent on transactions that fall into the `LOAN_PAYMENTS` credit category within the given time window, across all the accounts in the report. For example, a value of 100 indicates that 100% of the inflows were spent on transactions that fall into the `LOAN_PAYMENTS` credit category.
If there's no available income for the given time period, this field value will be `-1`

Format: `double`

Insights into negative balance occurrences, including frequency, duration, and minimum balance details.

Hide object

The number of days since the last transaction that caused any account in the report to have a negative balance.

This value is inclusive of the date of the last negative balance, meaning that if the last negative balance occurred today, this value will be `0`.

The number of aggregated days that the accounts in the report has had a negative balance within the given time window.

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The summary of the negative balance occurrences for this account.

If the user has not had a negative balance in the account in the given time window, this list will be empty.

Hide object

The date of the first transaction that caused the account to have a negative balance.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The date of the last transaction that caused the account to have a negative balance.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).
This date is inclusive, meaning that this was the last date that the account had a negative balance.

Format: `date`

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Affordability insights focus on providing signal on the ability of a borrower to repay their loan without experiencing financial strain. It provides insights on factors such as a user's monthly income and expenses, disposable income, average expenditure, etc., helping lenders gauge the level of affordability of a borrower.

Hide object

Comprehensive analysis of spending patterns, categorizing expenses into essential, non-essential, and other categories.

Hide object

Net cash flow for the period (inflows minus outflows), including a monthly average.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Summary statistics for a specific expenditure category, including total amount, monthly average, and percentage of income.

Hide object

The total value of all the aggregated transactions in this expenditure category.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of outflow transactions in this expenses group, within the given time window across all the accounts in the report.

The percentage of the total inflows that was spent in this expenses group, within the given time window across all the accounts in the report.
For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into this expenditure group.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

The primary credit categories of the expenses within the given time window, across all the accounts in the report.

The categories are sorted in descending order by the total value spent.
See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Summary statistics for a specific expenditure category, including total amount, monthly average, and percentage of income.

Hide object

The total value of all the aggregated transactions in this expenditure category.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of outflow transactions in this expenses group, within the given time window across all the accounts in the report.

The percentage of the total inflows that was spent in this expenses group, within the given time window across all the accounts in the report.
For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into this expenditure group.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

The primary credit categories of the expenses within the given time window, across all the accounts in the report.

The categories are sorted in descending order by the total value spent.
See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Summary statistics for a specific expenditure category, including total amount, monthly average, and percentage of income.

Hide object

The total value of all the aggregated transactions in this expenditure category.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of outflow transactions in this expenses group, within the given time window across all the accounts in the report.

The percentage of the total inflows that was spent in this expenses group, within the given time window across all the accounts in the report.
For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into this expenditure group.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

The primary credit categories of the expenses within the given time window, across all the accounts in the report.

The categories are sorted in descending order by the total value spent.
See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Summary statistics for a specific expenditure category, including total amount, monthly average, and percentage of income.

Hide object

The total value of all the aggregated transactions in this expenditure category.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of outflow transactions in this expenses group, within the given time window across all the accounts in the report.

The percentage of the total inflows that was spent in this expenses group, within the given time window across all the accounts in the report.
For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into this expenditure group.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

The primary credit categories of the expenses within the given time window, across all the accounts in the report.

The categories are sorted in descending order by the total value spent.
See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Summary statistics for a specific expenditure category, including total amount, monthly average, and percentage of income.

Hide object

The total value of all the aggregated transactions in this expenditure category.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of outflow transactions in this expenses group, within the given time window across all the accounts in the report.

The percentage of the total inflows that was spent in this expenses group, within the given time window across all the accounts in the report.
For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into this expenditure group.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

The primary credit categories of the expenses within the given time window, across all the accounts in the report.

The categories are sorted in descending order by the total value spent.
See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Insights into unusually large transactions that exceed typical spending patterns for the account.

Hide object

The total number of transactions whose value is above the threshold of normal amounts for a given account.

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Up to 3 top categories of expenses in this group.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Comprehensive income analysis including total income, income excluding transfers, and inbound transfer amounts.

Hide object

The total amount of all income transactions in the given time period.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Income excluding account transfer transactions for the period, including a monthly average.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Sum of inbound transfer transactions for the period, including a monthly average.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

An identifier you determine and submit for the Asset Report.

The date and time when the Asset Report was created, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (e.g. "2018-04-12T03:32:11Z").

Format: `date-time`

The duration of transaction history you requested

The user object allows you to provide additional information about the user to be appended to the Asset Report. All fields are optional. The `first_name`, `last_name`, and `ssn` fields are required if you would like the Report to be eligible for Fannie Mae's Day 1 Certaintyâ¢ program.

Hide object

An identifier you determine and submit for the user.

The user's first name. Required for the Fannie Mae Day 1 Certaintyâ¢ program.

The user's middle name

The user's last name. Required for the Fannie Mae Day 1 Certaintyâ¢ program.

The user's Social Security Number. Required for the Fannie Mae Day 1 Certaintyâ¢ program.

Format: "ddd-dd-dddd"

The user's phone number, in E.164 format: +{countrycode}{number}. For example: "+14151234567". Phone numbers provided in other formats will be parsed on a best-effort basis.

The user's email address.

Data returned by Plaid about each of the Items included in the Asset Report.

Hide object

The `item_id` of the Item associated with this webhook, warning, or error

The full financial institution name associated with the Item.

The id of the financial institution associated with the Item.

The date and time when this Item's data was last retrieved from the financial institution, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date-time`

Data about each of the accounts open on the Item.

Hide object

Plaid's unique identifier for the account. This value will not change unless Plaid can't reconcile the account with the data returned by the financial institution. This may occur, for example, when the name of the account changes. If this happens a new `account_id` will be assigned to the account.

The `account_id` can also change if the `access_token` is deleted and the same credentials that were used to generate that `access_token` are used to generate a new `access_token` on a later date. In that case, the new `account_id` will be different from the old `account_id`.

If an account with a specific `account_id` disappears instead of changing, the account is likely closed. Closed accounts are not returned by the Plaid API.

Like all Plaid identifiers, the `account_id` is case sensitive.

A set of fields describing the balance for an account. Balance information may be cached unless the balance object was returned by `/accounts/balance/get`.

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

The total amount of borrowed funds in the account, as determined by the financial institution.
For investment-type accounts, the margin balance is the total value of borrowed assets in the account, as presented by the institution.
This is commonly referred to as margin or a loan.

Format: `double`

The ISO-4217 currency code of the balance. Always null if `unofficial_currency_code` is non-null.

The unofficial currency code associated with the balance. Always null if `iso_currency_code` is non-null. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format (`YYYY-MM-DDTHH:mm:ssZ`) indicating the oldest acceptable balance when making a request to `/accounts/balance/get`.

This field is only used and expected when the institution is `ins_128026` (Capital One) and the Item contains one or more accounts with a non-depository account type, in which case a value must be provided or an `INVALID_REQUEST` error with the code of `INVALID_FIELD` will be returned. For Capital One depository accounts as well as all other account types on all other institutions, this field is ignored. See [account type schema](https://plaid.com/docs/api/accounts/#account-type-schema) for a full list of account types.

If the balance that is pulled is older than the given timestamp for Items with this field required, an `INVALID_REQUEST` error with the code of `LAST_UPDATED_DATETIME_OUT_OF_RANGE` will be returned with the most recent timestamp for the requested account contained in the response.

Format: `date-time`

The last 2-4 alphanumeric characters of an account's official account number. Note that the mask may be non-unique between an Item's accounts, and it may also not match the mask that the bank displays to the user.

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

The current verification status of an Auth Item initiated through Automated or Manual micro-deposits. Returned for Auth Items only.

`pending_automatic_verification`: The Item is pending automatic verification.

`pending_manual_verification`: The Item is pending manual micro-deposit verification. Items remain in this state until the user successfully verifies the micro-deposit.

`automatically_verified`: The Item has successfully been automatically verified.

`manually_verified`: The Item has successfully been manually verified.

`verification_expired`: Plaid was unable to automatically verify the deposit within 7 calendar days and will no longer attempt to validate the Item. Users may retry by submitting their information again through Link.

`verification_failed`: The Item failed manual micro-deposit verification because the user exhausted all 3 verification attempts. Users may retry by submitting their information again through Link.

`database_matched`: (deprecated) The Item has successfully been verified using Plaid's data sources. Only returned for Auth Items created via Database Match.

Possible values: `automatically_verified`, `pending_automatic_verification`, `pending_manual_verification`, `manually_verified`, `verification_expired`, `verification_failed`, `database_matched`

A unique and persistent identifier for accounts that can be used to trace multiple instances of the same account across different Items for depository accounts. This is currently an opt-in field and only supported for Chase Items.

The duration of transaction history available within this report for this Item, typically defined as the time since the date of the earliest transaction in that account.

Transaction history associated with the account.

Hide object

The ID of the account in which this transaction occurred.

The settled value of the transaction, denominated in the transaction's currency, as stated in `iso_currency_code` or `unofficial_currency_code`. Positive values when money moves out of the account; negative values when money moves in. For example, debit card purchases are positive; credit card payments, direct deposits, and refunds are negative.

Format: `double`

The ISO-4217 currency code of the transaction. Always `null` if `unofficial_currency_code` is non-null.

The unofficial currency code associated with the transaction. Always `null` if `iso_currency_code` is non-`null`. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The string returned by the financial institution to describe the transaction.

A hierarchical array of the categories to which this transaction belongs. For a full list of categories, see [`/categories/get`](https://plaid.com/docs/api/products/transactions/#categoriesget).

This field will only appear in an Asset Report with Insights.

The ID of the category to which this transaction belongs. For a full list of categories, see [`/categories/get`](https://plaid.com/docs/api/products/transactions/#categoriesget).

This field will only appear in an Asset Report with Insights.

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

The merchant name or transaction description. This is a legacy field that is no longer maintained. For merchant name, use the `merchant_name` field. For description, use the `original_description` field.

This field will only appear in an Asset Report with Insights.

The merchant name, as enriched by Plaid. This is typically a more human-readable version of the merchant counterparty in the transaction. For some bank transactions (such as checks or account transfers) where there is no meaningful merchant name, this value will be `null`.

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

When `true`, identifies the transaction as pending or unsettled. Pending transaction details (name, type, amount, category ID) may change before they are settled.

The ID of a posted transaction's associated pending transaction, where applicable.

The name of the account owner. This field is not typically populated and only relevant when dealing with sub-accounts.

The unique ID of the transaction. Like all Plaid identifiers, the `transaction_id` is case sensitive.

`digital:` transactions that took place online.

`place:` transactions that were made at a physical location.

`special:` transactions that relate to banks, e.g. fees or deposits.

`unresolved:` transactions that do not fit into the other three types.

Possible values: `digital`, `place`, `special`, `unresolved`

A set of fields describing the investments data on an account.

Hide object

Quantities and values of securities held in the investment account. Map to the `securities` array for security details.

Hide object

The Plaid `account_id` associated with the holding.

The Plaid `security_id` associated with the holding. Security data is not specific to a user's account; any user who held the same security at the same financial institution at the same time would have identical security data. The `security_id` for the same security will typically be the same across different institutions, but this is not guaranteed. The `security_id` does not typically change, but may change if inherent details of the security change due to a corporate action, for example, in the event of a ticker symbol change or CUSIP change.

The holding's trading symbol for publicly traded holdings, and otherwise a short identifier if available.

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

Details of specific securities held in on the investment account.

Hide object

A unique, Plaid-specific identifier for the security, used to associate securities with holdings. Like all Plaid identifiers, the `security_id` is case sensitive. The `security_id` may change if inherent details of the security change due to a corporate action, for example, in the event of a ticker symbol change or CUSIP change.

A descriptive name for the security, suitable for display.

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

The total quantity of vested assets held, as reported by the financial institution. Vested assets are only associated with [equities](https://plaid.com/docs/api/products/investments/#investments-holdings-get-response-securities-type).

Format: `double`

The value of the vested holdings as reported by the institution.

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

Data returned by the financial institution about the account owner or owners. For business accounts, the name reported may be either the name of the individual or the name of the business, depending on the institution. Multiple owners on a single account will be represented in the same `owner` object, not in multiple owner objects within the array. In API versions 2018-05-22 and earlier, the `owners` object is not returned, and instead identity information is returned in the top level `identity` object. For more details, see [Plaid API versioning](https://plaid.com/docs/api/versioning/#version-2019-05-29)

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

Calculated data about the historical balances on the account.

Available for `credit` and `depository` type accounts.

Hide object

The date of the calculated historical balance, in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD)

Format: `date`

The total amount of funds in the account, calculated from the `current` balance in the `balance` object by subtracting inflows and adding back outflows according to the posted date of each transaction.

If the account has any pending transactions, historical balance amounts on or after the date of the earliest pending transaction may differ if retrieved in subsequent Asset Reports as a result of those pending transactions posting.

Format: `double`

The ISO-4217 currency code of the balance. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the balance. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

This is a container object for all lending-related insights. This field will be returned only for European customers.

Hide object

Risk indicators focus on providing signal on the possibility of a borrower defaulting on their loan repayments by providing data points related to its payment behavior, debt, and other relevant financial information, helping lenders gauge the level of risk involved in a certain operation.

Hide object

Insights into bank penalties and fees, including overdraft fees, NSF fees, and other bank-imposed charges.

Hide object

The total value of outflow transactions categorized as `BANK_PENALTIES`, across all the accounts in the report within the requested time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Detailed categories view of all the transactions that fall into the `BANK_PENALTIES` credit category within the given time window, across all the accounts in the report.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of transactions that fall into the `BANK_PENALTIES` credit category, across all the accounts in the report.

The monthly summaries of the transactions that fall into the `BANK_PENALTIES` credit category within the given time window, across all the accounts in the report.

Hide object

The start date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The end date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The number of days since the last transaction that falls into the `BANK_PENALTIES` credit category, across all the accounts in the report.

The percentage of the user's monthly inflows that was spent on transactions that fall into the `BANK_PENALTIES` credit category within the given time window, across all the accounts in the report. For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into the `BANK_PENALTIES` credit category.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

Insights into gambling-related transactions, including frequency, amounts, and top merchants.

Hide object

The total value of transactions that fall into the `GAMBLING` credit category, across all the accounts in the report.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Up to 3 top merchants that the user had the most transactions for in the given time window, in descending order of total spend.

If the user has not spent money on any merchants in the given time window, this list will be empty.

The total number of transactions that fall into the `GAMBLING` credit category, across all the accounts in the report.

The monthly summaries of the transactions that fall into the `GAMBLING` category within the given time window, across all the accounts in the report.

Hide object

The start date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The end date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The number of days since the last transaction that falls into the `GAMBLING` category, across all the accounts in the report.

The percentage of the user's monthly inflows that was spent on transactions that fall into the `GAMBLING` category within the given time window, across all the accounts in the report. For example, a value of 100 indicates that 100% of the inflows were spent on transactions that fall into the `GAMBLING` credit category.
If there's no available income for the given time period, this field value will be `-1`

Format: `double`

Insights into loan disbursement transactions received by the user, tracking incoming funds from loan providers.

Hide object

The total value of inflow transactions categorized as `LOAN_DISBURSEMENTS`, across all the accounts in the report within the requested time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Detailed categories view of all the transactions that fall into the `LOAN_DISBURSEMENTS` credit category within the given time window, across all the accounts in the report.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Up to 3 top service providers that the user had the most transactions for in the given time window, in descending order of total spend.

If the user has not received money from any provider in the given time window, this list will be empty.

The total number of transactions that fall into the `LOAN_DISBURSEMENTS` credit category, across all the accounts in the report.

The monthly summaries of the transactions that fall into the `LOAN_DISBURSEMENTS` category within the given time window, across all the accounts in the report.

Hide object

The start date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The end date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The number of days since the last transaction that falls into the `LOAN_DISBURSEMENTS` credit category, across all the accounts in the report.

The percentage of the user's monthly inflows that was received on transactions that fall into the `LOAN_DISBURSEMENTS` credit category within the given time window, across all the accounts in the report. For example, a value of 100 indicates that 100% of the inflows were spent on transactions that fall into the `LOAN_DISBURSEMENTS` credit category.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

Insights into loan payment transactions made by the user, tracking outgoing payments to loan providers.

Hide object

The total value of outflow transactions categorized as `LOAN_PAYMENTS`, across all the accounts in the report within the requested time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Detailed categories view of all the transactions that fall into the `LOAN_PAYMENTS` credit category within the given time window, across all the accounts in the report.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Up to 3 top service providers that the user had the most transactions for in the given time window, in descending order of total spend.

If the user has not spent money on any provider in the given time window, this list will be empty.

The total number of transactions that fall into the `LOAN_PAYMENTS` credit category, across all the accounts in the report.

The monthly summaries of the transactions that fall into the `LOAN_PAYMENTS` credit category within the given time window, across all the accounts in the report.

Hide object

The start date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The end date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The number of days since the last transaction that falls into the `LOAN_PAYMENTS` credit category, across all the accounts in the report.

The percentage of the user's monthly inflows that was spent on transactions that fall into the `LOAN_PAYMENTS` credit category within the given time window, across all the accounts in the report. For example, a value of 100 indicates that 100% of the inflows were spent on transactions that fall into the `LOAN_PAYMENTS` credit category.
If there's no available income for the given time period, this field value will be `-1`

Format: `double`

Insights into negative balance occurrences, including frequency, duration, and minimum balance details.

Hide object

The number of days since the last transaction that caused any account in the report to have a negative balance.

This value is inclusive of the date of the last negative balance, meaning that if the last negative balance occurred today, this value will be `0`.

The number of aggregated days that the accounts in the report has had a negative balance within the given time window.

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The summary of the negative balance occurrences for this account.

If the user has not had a negative balance in the account in the given time window, this list will be empty.

Hide object

The date of the first transaction that caused the account to have a negative balance.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The date of the last transaction that caused the account to have a negative balance.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).
This date is inclusive, meaning that this was the last date that the account had a negative balance.

Format: `date`

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Affordability insights focus on providing signal on the ability of a borrower to repay their loan without experiencing financial strain. It provides insights on factors such as a user's monthly income and expenses, disposable income, average expenditure, etc., helping lenders gauge the level of affordability of a borrower.

Hide object

Comprehensive analysis of spending patterns, categorizing expenses into essential, non-essential, and other categories.

Hide object

Net cash flow for the period (inflows minus outflows), including a monthly average.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Summary statistics for a specific expenditure category, including total amount, monthly average, and percentage of income.

Hide object

The total value of all the aggregated transactions in this expenditure category.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of outflow transactions in this expenses group, within the given time window across all the accounts in the report.

The percentage of the total inflows that was spent in this expenses group, within the given time window across all the accounts in the report.
For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into this expenditure group.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

The primary credit categories of the expenses within the given time window, across all the accounts in the report.

The categories are sorted in descending order by the total value spent.
See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Summary statistics for a specific expenditure category, including total amount, monthly average, and percentage of income.

Hide object

The total value of all the aggregated transactions in this expenditure category.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of outflow transactions in this expenses group, within the given time window across all the accounts in the report.

The percentage of the total inflows that was spent in this expenses group, within the given time window across all the accounts in the report.
For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into this expenditure group.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

The primary credit categories of the expenses within the given time window, across all the accounts in the report.

The categories are sorted in descending order by the total value spent.
See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Summary statistics for a specific expenditure category, including total amount, monthly average, and percentage of income.

Hide object

The total value of all the aggregated transactions in this expenditure category.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of outflow transactions in this expenses group, within the given time window across all the accounts in the report.

The percentage of the total inflows that was spent in this expenses group, within the given time window across all the accounts in the report.
For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into this expenditure group.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

The primary credit categories of the expenses within the given time window, across all the accounts in the report.

The categories are sorted in descending order by the total value spent.
See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Summary statistics for a specific expenditure category, including total amount, monthly average, and percentage of income.

Hide object

The total value of all the aggregated transactions in this expenditure category.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of outflow transactions in this expenses group, within the given time window across all the accounts in the report.

The percentage of the total inflows that was spent in this expenses group, within the given time window across all the accounts in the report.
For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into this expenditure group.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

The primary credit categories of the expenses within the given time window, across all the accounts in the report.

The categories are sorted in descending order by the total value spent.
See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Summary statistics for a specific expenditure category, including total amount, monthly average, and percentage of income.

Hide object

The total value of all the aggregated transactions in this expenditure category.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of outflow transactions in this expenses group, within the given time window across all the accounts in the report.

The percentage of the total inflows that was spent in this expenses group, within the given time window across all the accounts in the report.
For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into this expenditure group.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

The primary credit categories of the expenses within the given time window, across all the accounts in the report.

The categories are sorted in descending order by the total value spent.
See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Insights into unusually large transactions that exceed typical spending patterns for the account.

Hide object

The total number of transactions whose value is above the threshold of normal amounts for a given account.

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Up to 3 top categories of expenses in this group.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Comprehensive income analysis including total income, income excluding transfers, and inbound transfer amounts.

Hide object

The total amount of all income transactions in the given time period.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Income excluding account transfer transactions for the period, including a monthly average.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Sum of inbound transfer transactions for the period, including a monthly average.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

If the Asset Report generation was successful but identity information cannot be returned, this array will contain information about the errors causing identity information to be missing

Hide object

The warning type, which will always be `ASSET_REPORT_WARNING`

The warning code identifies a specific kind of warning. `OWNERS_UNAVAILABLE` indicates that account-owner information is not available. `INVESTMENTS_UNAVAILABLE` indicates that Investments specific information is not available. `TRANSACTIONS_UNAVAILABLE` indicates that transactions information associated with Credit and Depository accounts are unavailable. The `BANK_INCOME_INSIGHTS_*` codes apply to the Bank Income add-on: `BANK_INCOME_INSIGHTS_INSUFFICIENT_DATA` indicates there was not enough data to compute Bank Income Insights; `BANK_INCOME_INSIGHTS_INCOMPLETE` indicates the Bank Income Insights flow was not completed; `BANK_INCOME_INSIGHTS_STATUS_IN_PROGRESS` indicates Bank Income Insights are still being computed; `BANK_INCOME_INSIGHTS_INTERNAL_ERROR` indicates an internal error occurred while computing Bank Income Insights; `BANK_INCOME_INSIGHTS_MISMATCHED_DAYS_REQUESTED` indicates the days requested for Bank Income Insights did not match that of the Asset Report.

Possible values: `OWNERS_UNAVAILABLE`, `INVESTMENTS_UNAVAILABLE`, `TRANSACTIONS_UNAVAILABLE`, `BANK_INCOME_INSIGHTS_INSUFFICIENT_DATA`, `BANK_INCOME_INSIGHTS_INCOMPLETE`, `BANK_INCOME_INSIGHTS_STATUS_IN_PROGRESS`, `BANK_INCOME_INSIGHTS_INTERNAL_ERROR`, `BANK_INCOME_INSIGHTS_MISMATCHED_DAYS_REQUESTED`

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
    "asset_report_id": "028e8404-a013-4a45-ac9e-002482f9cafc",
    "client_report_id": "client_report_id_1221",
    "date_generated": "2023-03-30T18:27:37Z",
    "days_requested": 90,
    "items": [
      {
        "accounts": [
          {
            "account_id": "1qKRXQjk8xUWDJojNwPXTj8gEmR48piqRNye8",
            "balances": {
              "available": 43200,
              "current": 43200,
              "limit": null,
              "margin_loan_amount": null,
              "iso_currency_code": "USD",
              "unofficial_currency_code": null
            },
            "days_available": 90,
            "historical_balances": [
              {
                "current": 49050,
                "date": "2023-03-29",
                "iso_currency_code": "USD",
                "unofficial_currency_code": null
              },
              {
                "current": 49050,
                "date": "2023-03-28",
                "iso_currency_code": "USD",
                "unofficial_currency_code": null
              },
              {
                "current": 49050,
                "date": "2023-03-27",
                "iso_currency_code": "USD",
                "unofficial_currency_code": null
              },
              {
                "current": 49050,
                "date": "2023-03-26",
                "iso_currency_code": "USD",
                "unofficial_currency_code": null
              },
              {
                "current": 49050,
                "date": "2023-03-25",
                "iso_currency_code": "USD",
                "unofficial_currency_code": null
              }
            ],
            "mask": "4444",
            "name": "Plaid Money Market",
            "official_name": "Plaid Platinum Standard 1.85% Interest Money Market",
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
            "ownership_type": null,
            "subtype": "money market",
            "transactions": [
              {
                "account_id": "1qKRXQjk8xUWDJojNwPXTj8gEmR48piqRNye8",
                "amount": 5850,
                "date": "2023-03-30",
                "iso_currency_code": "USD",
                "original_description": "ACH Electronic CreditGUSTO PAY 123456",
                "pending": false,
                "transaction_id": "gGQgjoeyqBF89PND6K14Sow1wddZBmtLomJ78",
                "unofficial_currency_code": null
              }
            ],
            "type": "depository"
          },
          {
            "account_id": "eG7pNLjknrFpWvP7Dkbdf3Pq6GVBPKTaQJK5v",
            "balances": {
              "available": 100,
              "current": 110,
              "limit": null,
              "margin_loan_amount": null,
              "iso_currency_code": "USD",
              "unofficial_currency_code": null
            },
            "days_available": 90,
            "historical_balances": [
              {
                "current": 110,
                "date": "2023-03-29",
                "iso_currency_code": "USD",
                "unofficial_currency_code": null
              },
              {
                "current": -390,
                "date": "2023-03-28",
                "iso_currency_code": "USD",
                "unofficial_currency_code": null
              },
              {
                "current": -373.67,
                "date": "2023-03-27",
                "iso_currency_code": "USD",
                "unofficial_currency_code": null
              },
              {
                "current": -284.27,
                "date": "2023-03-26",
                "iso_currency_code": "USD",
                "unofficial_currency_code": null
              },
              {
                "current": -284.27,
                "date": "2023-03-25",
                "iso_currency_code": "USD",
                "unofficial_currency_code": null
              }
            ],
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
            "ownership_type": null,
            "subtype": "checking",
            "transactions": [
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
            "type": "depository"
          }
        ],
        "date_last_updated": "2023-03-30T18:25:26Z",
        "institution_id": "ins_109508",
        "institution_name": "First Platypus Bank",
        "item_id": "AZMP7JrGXgtPd3AQMeg7hwMKgk5E8qU1V5ME7"
      }
    ],
    "user": {
      "client_user_id": "uid_40332",
      "email": "abcharleston@example.com",
      "first_name": "Anna",
      "last_name": "Charleston",
      "middle_name": "B",
      "phone_number": "1-415-867-5309",
      "ssn": "111-22-1234"
    }
  },
  "request_id": "GVzMdiDd8DDAQK4",
  "warnings": []
}
```

=\*=\*=\*=[#### `/asset_report/pdf/get`](/docs/api/products/assets/#asset_reportpdfget)

[#### Retrieve a PDF Asset Report](/docs/api/products/assets/#retrieve-a-pdf-asset-report)

The [`/asset_report/pdf/get`](/docs/api/products/assets/#asset_reportpdfget) endpoint retrieves the Asset Report in PDF format. Before calling [`/asset_report/pdf/get`](/docs/api/products/assets/#asset_reportpdfget), you must first create the Asset Report using [`/asset_report/create`](/docs/api/products/assets/#asset_reportcreate) (or filter an Asset Report using [`/asset_report/filter`](/docs/api/products/assets/#asset_reportfilter)) and then wait for the [`PRODUCT_READY`](https://plaid.com/docs/api/products/assets/#product_ready) webhook to fire, indicating that the Report is ready to be retrieved.

The response to [`/asset_report/pdf/get`](/docs/api/products/assets/#asset_reportpdfget) is the PDF binary data. The `request_id` is returned in the `Plaid-Request-ID` header.

[View a sample PDF Asset Report](https://plaid.com/documents/sample-asset-report.pdf).

/asset\_report/pdf/get

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

A token that can be provided to endpoints such as `/asset_report/get` or `/asset_report/pdf/get` to fetch or update an Asset Report.

An optional object to filter or add data to `/asset_report/get` results. If provided, must be non-`null`.

Hide object

The maximum integer number of days of history to include in the Asset Report.

Maximum: `731`

Minimum: `0`

/asset\_report/pdf/get

Nodeâ¼

```
try {
  const request: AssetReportPDFGetRequest = {
    asset_report_token: assetReportToken,
  };
  const response = await plaidClient.assetReportPdfGet(request, {
    responseType: 'arraybuffer',
  });
  const pdf = response.data.toString('base64');
} catch (error) {
  // handle error
}
```

[##### Response](/docs/api/products/assets/#response)

This endpoint returns binary PDF data. [View a sample Asset Report PDF](https://plaid.com/documents/sample-asset-report.pdf).

[View a sample Financial Insights Report (UK/EU only) PDF](https://plaid.com/documents/sample-financial-insights-report.pdf).

=\*=\*=\*=[#### `/asset_report/refresh`](/docs/api/products/assets/#asset_reportrefresh)

[#### Refresh an Asset Report](/docs/api/products/assets/#refresh-an-asset-report)

An Asset Report is an immutable snapshot of a user's assets. In order to "refresh" an Asset Report you created previously, you can use the [`/asset_report/refresh`](/docs/api/products/assets/#asset_reportrefresh) endpoint to create a new Asset Report based on the old one, but with the most recent data available.

The new Asset Report will contain the same Items as the original Report, as well as the same filters applied by any call to [`/asset_report/filter`](/docs/api/products/assets/#asset_reportfilter). By default, the new Asset Report will also use the same parameters you submitted with your original [`/asset_report/create`](/docs/api/products/assets/#asset_reportcreate) request, but the original `days_requested` value and the values of any parameters in the `options` object can be overridden with new values. To change these arguments, simply supply new values for them in your request to [`/asset_report/refresh`](/docs/api/products/assets/#asset_reportrefresh). Submit an empty string ("") for any previously-populated fields you would like set as empty.

/asset\_report/refresh

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The `asset_report_token` returned by the original call to `/asset_report/create`

The maximum number of days of history to include in the Asset Report. Must be an integer. If not specified, the value from the original call to `/asset_report/create` will be used.

Minimum: `0`

Maximum: `731`

An optional object to filter `/asset_report/refresh` results. If provided, cannot be `null`. If not specified, the `options` from the original call to `/asset_report/create` will be used.

Hide object

Client-generated identifier, which can be used by lenders to track loan applications.

URL to which Plaid will send Assets webhooks, for example when the requested Asset Report is ready.

Format: `url`

The user object allows you to provide additional information about the user to be appended to the Asset Report. All fields are optional. The `first_name`, `last_name`, and `ssn` fields are required if you would like the Report to be eligible for Fannie Mae's Day 1 Certaintyâ¢ program.

Hide object

An identifier you determine and submit for the user.

The user's first name. Required for the Fannie Mae Day 1 Certaintyâ¢ program.

The user's middle name

The user's last name. Required for the Fannie Mae Day 1 Certaintyâ¢ program.

The user's Social Security Number. Required for the Fannie Mae Day 1 Certaintyâ¢ program.

Format: "ddd-dd-dddd"

The user's phone number, in E.164 format: +{countrycode}{number}. For example: "+14151234567". Phone numbers provided in other formats will be parsed on a best-effort basis.

The user's email address.

/asset\_report/refresh

Nodeâ¼

```
const request: AssetReportRefreshRequest = {
  asset_report_token: assetReportToken,
  days_requested: 90,
  options: {
    client_report_id: '123',
    webhook: 'https://www.example.com',
    user: {
      client_user_id: '7f57eb3d2a9j6480121fx361',
      first_name: 'Jane',
      middle_name: 'Leah',
      last_name: 'Doe',
      ssn: '123-45-6789',
      phone_number: '(555) 123-4567',
      email: 'jane.doe@example.com',
    },
  },
};
try {
  const response = await plaidClient.assetReportRefresh(request);
  const assetReportId = response.data.asset_report_id;
} catch (error) {
  // handle error
}
```

/asset\_report/refresh

**Response fields**

A unique ID identifying an Asset Report. Like all Plaid identifiers, this ID is case sensitive.

A token that can be provided to endpoints such as `/asset_report/get` or `/asset_report/pdf/get` to fetch or update an Asset Report.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "asset_report_id": "c33ebe8b-6a63-4d74-a83d-d39791231ac0",
  "asset_report_token": "assets-sandbox-8218d5f8-6d6d-403d-92f5-13a9afaa4398",
  "request_id": "NBZaq"
}
```

=\*=\*=\*=[#### `/asset_report/filter`](/docs/api/products/assets/#asset_reportfilter)

[#### Filter Asset Report](/docs/api/products/assets/#filter-asset-report)

By default, an Asset Report will contain all of the accounts on a given Item. In some cases, you may not want the Asset Report to contain all accounts. For example, you might have the end user choose which accounts are relevant in Link using the Account Select view, which you can enable in the dashboard. Or, you might always exclude certain account types or subtypes, which you can identify by using the [`/accounts/get`](/docs/api/accounts/#accountsget) endpoint. To narrow an Asset Report to only a subset of accounts, use the [`/asset_report/filter`](/docs/api/products/assets/#asset_reportfilter) endpoint.

To exclude certain Accounts from an Asset Report, first use the [`/asset_report/create`](/docs/api/products/assets/#asset_reportcreate) endpoint to create the report, then send the `asset_report_token` along with a list of `account_ids` to exclude to the [`/asset_report/filter`](/docs/api/products/assets/#asset_reportfilter) endpoint, to create a new Asset Report which contains only a subset of the original Asset Report's data.

Because Asset Reports are immutable, calling [`/asset_report/filter`](/docs/api/products/assets/#asset_reportfilter) does not alter the original Asset Report in any way; rather, [`/asset_report/filter`](/docs/api/products/assets/#asset_reportfilter) creates a new Asset Report with a new token and id. Asset Reports created via [`/asset_report/filter`](/docs/api/products/assets/#asset_reportfilter) do not contain new Asset data, and are not billed.

Plaid will fire a [`PRODUCT_READY`](https://plaid.com/docs/api/products/assets/#product_ready) webhook once generation of the filtered Asset Report has completed.

/asset\_report/filter

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

A token that can be provided to endpoints such as `/asset_report/get` or `/asset_report/pdf/get` to fetch or update an Asset Report.

The accounts to exclude from the Asset Report, identified by `account_id`.

/asset\_report/filter

Nodeâ¼

```
const request: AssetReportFilterRequest = {
  asset_report_token: assetReportToken,
  account_ids_to_exclude: ['JJGWd5wKDgHbw6yyzL3MsqBAvPyDlqtdyk419'],
};
try {
  const response = await plaidClient.assetReportFilter(request);
  const assetReportId = response.data.asset_report_id;
} catch (error) {
  // handle error
}
```

/asset\_report/filter

**Response fields**

A token that can be provided to endpoints such as `/asset_report/get` or `/asset_report/pdf/get` to fetch or update an Asset Report.

A unique ID identifying an Asset Report. Like all Plaid identifiers, this ID is case sensitive.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "asset_report_token": "assets-sandbox-bc410c6a-4653-4c75-985c-e757c3497c5c",
  "asset_report_id": "fdc09207-0cef-4d88-b5eb-0d970758ebd9",
  "request_id": "qEg07"
}
```

=\*=\*=\*=[#### `/asset_report/remove`](/docs/api/products/assets/#asset_reportremove)

[#### Delete an Asset Report](/docs/api/products/assets/#delete-an-asset-report)

The [`/item/remove`](/docs/api/items/#itemremove) endpoint allows you to invalidate an `access_token`, meaning you will not be able to create new Asset Reports with it. Removing an Item does not affect any Asset Reports or Audit Copies you have already created, which will remain accessible until you remove them specifically.

The [`/asset_report/remove`](/docs/api/products/assets/#asset_reportremove) endpoint allows you to remove access to an Asset Report. Removing an Asset Report invalidates its `asset_report_token`, meaning you will no longer be able to use it to access Report data or create new Audit Copies. Removing an Asset Report does not affect the underlying Items, but does invalidate any `audit_copy_tokens` associated with the Asset Report.

/asset\_report/remove

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

A token that can be provided to endpoints such as `/asset_report/get` or `/asset_report/pdf/get` to fetch or update an Asset Report.

/asset\_report/remove

Nodeâ¼

```
const request: AssetReportRemoveRequest = {
  asset_report_token: assetReportToken,
};
try {
  const response = await plaidClient.assetReportRemove(request);
  const removed = response.data.removed;
} catch (error) {
  // handle error
}
```

/asset\_report/remove

**Response fields**

`true` if the Asset Report was successfully removed.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "removed": true,
  "request_id": "I6zHN"
}
```

=\*=\*=\*=[#### `/asset_report/audit_copy/create`](/docs/api/products/assets/#asset_reportaudit_copycreate)

[#### Create Asset Report Audit Copy](/docs/api/products/assets/#create-asset-report-audit-copy)

Plaid can provide an Audit Copy of any Asset Report directly to a participating third party on your behalf. For example, Plaid can supply an Audit Copy directly to the GSEs on your behalf if you participate in Fannie Mae's Day 1 Certaintyâ¢ program or utilize Freddie Mac's Loan Product AdvisorÂ® (LPAÂ®) Asset and Income Modeler (AIM). An Audit Copy contains the same underlying data as the Asset Report.

To grant access to an Audit Copy, use the [`/asset_report/audit_copy/create`](/docs/api/products/assets/#asset_reportaudit_copycreate) endpoint to create an `audit_copy_token` and then pass that token to the third party who needs access. Each third party has its own `auditor_id`, for example `fannie_mae`. You'll need to create a separate Audit Copy for each third party to whom you want to grant access to the Report.

/asset\_report/audit\_copy/create

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

A token that can be provided to endpoints such as `/asset_report/get` or `/asset_report/pdf/get` to fetch or update an Asset Report.

The `auditor_id` of the third party with whom you would like to share the Asset Report.

/asset\_report/audit\_copy/create

Nodeâ¼

```
// The auditor ID corresponds to the third party with which you want to share
// the asset report. For example, Fannie Mae's auditor ID is 'fannie_mae'.
const request: AssetReportAuditCopyCreateRequest = {
  asset_report_token: createResponse.data.asset_report_token,
  auditor_id: 'fannie_mae',
};
try {
  const response = await plaidClient.assetReportAuditCopyCreate(request);
  const auditCopyToken = response.data.audit_copy_token;
} catch (error) {
  // handle error
}
```

/asset\_report/audit\_copy/create

**Response fields**

A token that can be shared with a third party auditor to allow them to obtain access to the Asset Report. This token should be stored securely.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "audit_copy_token": "a-sandbox-3TAU2CWVYBDVRHUCAAAI27ULU4",
  "request_id": "Iam3b"
}
```

=\*=\*=\*=[#### `/asset_report/audit_copy/remove`](/docs/api/products/assets/#asset_reportaudit_copyremove)

[#### Remove Asset Report Audit Copy](/docs/api/products/assets/#remove-asset-report-audit-copy)

The [`/asset_report/audit_copy/remove`](/docs/api/products/assets/#asset_reportaudit_copyremove) endpoint allows you to remove an Audit Copy. Removing an Audit Copy invalidates the `audit_copy_token` associated with it, meaning both you and any third parties holding the token will no longer be able to use it to access Report data. Items associated with the Asset Report, the Asset Report itself and other Audit Copies of it are not affected and will remain accessible after removing the given Audit Copy.

/asset\_report/audit\_copy/remove

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The `audit_copy_token` granting access to the Audit Copy you would like to revoke.

Nodeâ¼

```
// auditCopyToken is the token from the createAuditCopy response.
const request: AssetReportAuditCopyRemoveRequest = {
  audit_copy_token: auditCopyToken,
};
try {
  const response = await plaidClient.assetReportAuditCopyRemove(request);
  const removed = response.data.removed;
} catch (error) {
  // handle error
}
```

/asset\_report/audit\_copy/remove

**Response fields**

`true` if the Audit Copy was successfully removed.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "removed": true,
  "request_id": "m8MDnv9okwxFNBV"
}
```

=\*=\*=\*=[#### `/credit/relay/create`](/docs/api/products/assets/#creditrelaycreate)

[#### Create a relay token to share an Asset Report with a partner client](/docs/api/products/assets/#create-a-relay-token-to-share-an-asset-report-with-a-partner-client)

Plaid can share an Asset Report directly with a participating third party on your behalf. The shared Asset Report is the exact same Asset Report originally created in [`/asset_report/create`](/docs/api/products/assets/#asset_reportcreate).

To grant a third party access to an Asset Report, use the [`/credit/relay/create`](/docs/api/products/assets/#creditrelaycreate) endpoint to create a `relay_token` and then pass that token to your third party. Each third party has its own `secondary_client_id`; for example, `ce5bd328dcd34123456`. You'll need to create a separate `relay_token` for each third party that needs access to the report on your behalf.

/credit/relay/create

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

List of report token strings, with at most one token of each report type. Currently only Asset Report token is supported.

The `secondary_client_id` is the client id of the third party with whom you would like to share the relay token.

URL to which Plaid will send webhooks when the Secondary Client successfully retrieves an Asset Report by calling `/credit/relay/get`.

Format: `url`

Nodeâ¼

```
const request: CreditRelayCreateRequest = {
  report_tokens: [createResponse.data.asset_report_token],
  secondary_client_id: clientIdFromPartner
};
try {
  const response = await plaidClient.creditRelayCreate(request);
  const relayToken = response.data.relay_token;
} catch (error) {
  // handle error
}
```

/credit/relay/create

**Response fields**

A token that can be shared with a third party to allow them to access the Asset Report. This token should be stored securely.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "relay_token": "credit-relay-production-3TAU2CWVYBDVRHUCAAAI27ULU4",
  "request_id": "Iam3b"
}
```

=\*=\*=\*=[#### `/credit/relay/get`](/docs/api/products/assets/#creditrelayget)

[#### Retrieve the reports associated with a relay token that was shared with you](/docs/api/products/assets/#retrieve-the-reports-associated-with-a-relay-token-that-was-shared-with-you)

[`/credit/relay/get`](/docs/api/products/assets/#creditrelayget) allows third parties to receive a report that was shared with them, using a `relay_token` that was created by the report owner.

/credit/relay/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The `relay_token` granting access to the report you would like to get.

The report type. It can be `asset`. Income report types are not yet supported.

Possible values: `asset`

`true` if you would like to retrieve the Asset Report with Insights, `false` otherwise. This field defaults to `false` if omitted.

Default: `false`

Nodeâ¼

```
const request: CreditRelayGetRequest = {
  relay_token: createResponse.data.relay_token,
  report_type: 'asset',
};
try {
  const response = await plaidClient.creditRelayGet(request);
} catch (error) {
  // handle error
}
```

/credit/relay/get

**Response fields**

Collapse all

An object representing an Asset Report

Hide object

A unique ID identifying an Asset Report. Like all Plaid identifiers, this ID is case sensitive.

This is a container object for all lending-related insights. This field will be returned only for European customers.

Hide object

Risk indicators focus on providing signal on the possibility of a borrower defaulting on their loan repayments by providing data points related to its payment behavior, debt, and other relevant financial information, helping lenders gauge the level of risk involved in a certain operation.

Hide object

Insights into bank penalties and fees, including overdraft fees, NSF fees, and other bank-imposed charges.

Hide object

The total value of outflow transactions categorized as `BANK_PENALTIES`, across all the accounts in the report within the requested time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Detailed categories view of all the transactions that fall into the `BANK_PENALTIES` credit category within the given time window, across all the accounts in the report.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of transactions that fall into the `BANK_PENALTIES` credit category, across all the accounts in the report.

The monthly summaries of the transactions that fall into the `BANK_PENALTIES` credit category within the given time window, across all the accounts in the report.

Hide object

The start date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The end date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The number of days since the last transaction that falls into the `BANK_PENALTIES` credit category, across all the accounts in the report.

The percentage of the user's monthly inflows that was spent on transactions that fall into the `BANK_PENALTIES` credit category within the given time window, across all the accounts in the report. For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into the `BANK_PENALTIES` credit category.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

Insights into gambling-related transactions, including frequency, amounts, and top merchants.

Hide object

The total value of transactions that fall into the `GAMBLING` credit category, across all the accounts in the report.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Up to 3 top merchants that the user had the most transactions for in the given time window, in descending order of total spend.

If the user has not spent money on any merchants in the given time window, this list will be empty.

The total number of transactions that fall into the `GAMBLING` credit category, across all the accounts in the report.

The monthly summaries of the transactions that fall into the `GAMBLING` category within the given time window, across all the accounts in the report.

Hide object

The start date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The end date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The number of days since the last transaction that falls into the `GAMBLING` category, across all the accounts in the report.

The percentage of the user's monthly inflows that was spent on transactions that fall into the `GAMBLING` category within the given time window, across all the accounts in the report. For example, a value of 100 indicates that 100% of the inflows were spent on transactions that fall into the `GAMBLING` credit category.
If there's no available income for the given time period, this field value will be `-1`

Format: `double`

Insights into loan disbursement transactions received by the user, tracking incoming funds from loan providers.

Hide object

The total value of inflow transactions categorized as `LOAN_DISBURSEMENTS`, across all the accounts in the report within the requested time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Detailed categories view of all the transactions that fall into the `LOAN_DISBURSEMENTS` credit category within the given time window, across all the accounts in the report.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Up to 3 top service providers that the user had the most transactions for in the given time window, in descending order of total spend.

If the user has not received money from any provider in the given time window, this list will be empty.

The total number of transactions that fall into the `LOAN_DISBURSEMENTS` credit category, across all the accounts in the report.

The monthly summaries of the transactions that fall into the `LOAN_DISBURSEMENTS` category within the given time window, across all the accounts in the report.

Hide object

The start date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The end date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The number of days since the last transaction that falls into the `LOAN_DISBURSEMENTS` credit category, across all the accounts in the report.

The percentage of the user's monthly inflows that was received on transactions that fall into the `LOAN_DISBURSEMENTS` credit category within the given time window, across all the accounts in the report. For example, a value of 100 indicates that 100% of the inflows were spent on transactions that fall into the `LOAN_DISBURSEMENTS` credit category.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

Insights into loan payment transactions made by the user, tracking outgoing payments to loan providers.

Hide object

The total value of outflow transactions categorized as `LOAN_PAYMENTS`, across all the accounts in the report within the requested time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Detailed categories view of all the transactions that fall into the `LOAN_PAYMENTS` credit category within the given time window, across all the accounts in the report.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Up to 3 top service providers that the user had the most transactions for in the given time window, in descending order of total spend.

If the user has not spent money on any provider in the given time window, this list will be empty.

The total number of transactions that fall into the `LOAN_PAYMENTS` credit category, across all the accounts in the report.

The monthly summaries of the transactions that fall into the `LOAN_PAYMENTS` credit category within the given time window, across all the accounts in the report.

Hide object

The start date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The end date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The number of days since the last transaction that falls into the `LOAN_PAYMENTS` credit category, across all the accounts in the report.

The percentage of the user's monthly inflows that was spent on transactions that fall into the `LOAN_PAYMENTS` credit category within the given time window, across all the accounts in the report. For example, a value of 100 indicates that 100% of the inflows were spent on transactions that fall into the `LOAN_PAYMENTS` credit category.
If there's no available income for the given time period, this field value will be `-1`

Format: `double`

Insights into negative balance occurrences, including frequency, duration, and minimum balance details.

Hide object

The number of days since the last transaction that caused any account in the report to have a negative balance.

This value is inclusive of the date of the last negative balance, meaning that if the last negative balance occurred today, this value will be `0`.

The number of aggregated days that the accounts in the report has had a negative balance within the given time window.

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The summary of the negative balance occurrences for this account.

If the user has not had a negative balance in the account in the given time window, this list will be empty.

Hide object

The date of the first transaction that caused the account to have a negative balance.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The date of the last transaction that caused the account to have a negative balance.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).
This date is inclusive, meaning that this was the last date that the account had a negative balance.

Format: `date`

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Affordability insights focus on providing signal on the ability of a borrower to repay their loan without experiencing financial strain. It provides insights on factors such as a user's monthly income and expenses, disposable income, average expenditure, etc., helping lenders gauge the level of affordability of a borrower.

Hide object

Comprehensive analysis of spending patterns, categorizing expenses into essential, non-essential, and other categories.

Hide object

Net cash flow for the period (inflows minus outflows), including a monthly average.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Summary statistics for a specific expenditure category, including total amount, monthly average, and percentage of income.

Hide object

The total value of all the aggregated transactions in this expenditure category.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of outflow transactions in this expenses group, within the given time window across all the accounts in the report.

The percentage of the total inflows that was spent in this expenses group, within the given time window across all the accounts in the report.
For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into this expenditure group.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

The primary credit categories of the expenses within the given time window, across all the accounts in the report.

The categories are sorted in descending order by the total value spent.
See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Summary statistics for a specific expenditure category, including total amount, monthly average, and percentage of income.

Hide object

The total value of all the aggregated transactions in this expenditure category.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of outflow transactions in this expenses group, within the given time window across all the accounts in the report.

The percentage of the total inflows that was spent in this expenses group, within the given time window across all the accounts in the report.
For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into this expenditure group.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

The primary credit categories of the expenses within the given time window, across all the accounts in the report.

The categories are sorted in descending order by the total value spent.
See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Summary statistics for a specific expenditure category, including total amount, monthly average, and percentage of income.

Hide object

The total value of all the aggregated transactions in this expenditure category.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of outflow transactions in this expenses group, within the given time window across all the accounts in the report.

The percentage of the total inflows that was spent in this expenses group, within the given time window across all the accounts in the report.
For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into this expenditure group.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

The primary credit categories of the expenses within the given time window, across all the accounts in the report.

The categories are sorted in descending order by the total value spent.
See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Summary statistics for a specific expenditure category, including total amount, monthly average, and percentage of income.

Hide object

The total value of all the aggregated transactions in this expenditure category.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of outflow transactions in this expenses group, within the given time window across all the accounts in the report.

The percentage of the total inflows that was spent in this expenses group, within the given time window across all the accounts in the report.
For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into this expenditure group.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

The primary credit categories of the expenses within the given time window, across all the accounts in the report.

The categories are sorted in descending order by the total value spent.
See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Summary statistics for a specific expenditure category, including total amount, monthly average, and percentage of income.

Hide object

The total value of all the aggregated transactions in this expenditure category.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of outflow transactions in this expenses group, within the given time window across all the accounts in the report.

The percentage of the total inflows that was spent in this expenses group, within the given time window across all the accounts in the report.
For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into this expenditure group.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

The primary credit categories of the expenses within the given time window, across all the accounts in the report.

The categories are sorted in descending order by the total value spent.
See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Insights into unusually large transactions that exceed typical spending patterns for the account.

Hide object

The total number of transactions whose value is above the threshold of normal amounts for a given account.

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Up to 3 top categories of expenses in this group.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Comprehensive income analysis including total income, income excluding transfers, and inbound transfer amounts.

Hide object

The total amount of all income transactions in the given time period.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Income excluding account transfer transactions for the period, including a monthly average.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Sum of inbound transfer transactions for the period, including a monthly average.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

An identifier you determine and submit for the Asset Report.

The date and time when the Asset Report was created, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (e.g. "2018-04-12T03:32:11Z").

Format: `date-time`

The duration of transaction history you requested

The user object allows you to provide additional information about the user to be appended to the Asset Report. All fields are optional. The `first_name`, `last_name`, and `ssn` fields are required if you would like the Report to be eligible for Fannie Mae's Day 1 Certaintyâ¢ program.

Hide object

An identifier you determine and submit for the user.

The user's first name. Required for the Fannie Mae Day 1 Certaintyâ¢ program.

The user's middle name

The user's last name. Required for the Fannie Mae Day 1 Certaintyâ¢ program.

The user's Social Security Number. Required for the Fannie Mae Day 1 Certaintyâ¢ program.

Format: "ddd-dd-dddd"

The user's phone number, in E.164 format: +{countrycode}{number}. For example: "+14151234567". Phone numbers provided in other formats will be parsed on a best-effort basis.

The user's email address.

Data returned by Plaid about each of the Items included in the Asset Report.

Hide object

The `item_id` of the Item associated with this webhook, warning, or error

The full financial institution name associated with the Item.

The id of the financial institution associated with the Item.

The date and time when this Item's data was last retrieved from the financial institution, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date-time`

Data about each of the accounts open on the Item.

Hide object

Plaid's unique identifier for the account. This value will not change unless Plaid can't reconcile the account with the data returned by the financial institution. This may occur, for example, when the name of the account changes. If this happens a new `account_id` will be assigned to the account.

The `account_id` can also change if the `access_token` is deleted and the same credentials that were used to generate that `access_token` are used to generate a new `access_token` on a later date. In that case, the new `account_id` will be different from the old `account_id`.

If an account with a specific `account_id` disappears instead of changing, the account is likely closed. Closed accounts are not returned by the Plaid API.

Like all Plaid identifiers, the `account_id` is case sensitive.

A set of fields describing the balance for an account. Balance information may be cached unless the balance object was returned by `/accounts/balance/get`.

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

The total amount of borrowed funds in the account, as determined by the financial institution.
For investment-type accounts, the margin balance is the total value of borrowed assets in the account, as presented by the institution.
This is commonly referred to as margin or a loan.

Format: `double`

The ISO-4217 currency code of the balance. Always null if `unofficial_currency_code` is non-null.

The unofficial currency code associated with the balance. Always null if `iso_currency_code` is non-null. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format (`YYYY-MM-DDTHH:mm:ssZ`) indicating the oldest acceptable balance when making a request to `/accounts/balance/get`.

This field is only used and expected when the institution is `ins_128026` (Capital One) and the Item contains one or more accounts with a non-depository account type, in which case a value must be provided or an `INVALID_REQUEST` error with the code of `INVALID_FIELD` will be returned. For Capital One depository accounts as well as all other account types on all other institutions, this field is ignored. See [account type schema](https://plaid.com/docs/api/accounts/#account-type-schema) for a full list of account types.

If the balance that is pulled is older than the given timestamp for Items with this field required, an `INVALID_REQUEST` error with the code of `LAST_UPDATED_DATETIME_OUT_OF_RANGE` will be returned with the most recent timestamp for the requested account contained in the response.

Format: `date-time`

The last 2-4 alphanumeric characters of an account's official account number. Note that the mask may be non-unique between an Item's accounts, and it may also not match the mask that the bank displays to the user.

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

The current verification status of an Auth Item initiated through Automated or Manual micro-deposits. Returned for Auth Items only.

`pending_automatic_verification`: The Item is pending automatic verification.

`pending_manual_verification`: The Item is pending manual micro-deposit verification. Items remain in this state until the user successfully verifies the micro-deposit.

`automatically_verified`: The Item has successfully been automatically verified.

`manually_verified`: The Item has successfully been manually verified.

`verification_expired`: Plaid was unable to automatically verify the deposit within 7 calendar days and will no longer attempt to validate the Item. Users may retry by submitting their information again through Link.

`verification_failed`: The Item failed manual micro-deposit verification because the user exhausted all 3 verification attempts. Users may retry by submitting their information again through Link.

`database_matched`: (deprecated) The Item has successfully been verified using Plaid's data sources. Only returned for Auth Items created via Database Match.

Possible values: `automatically_verified`, `pending_automatic_verification`, `pending_manual_verification`, `manually_verified`, `verification_expired`, `verification_failed`, `database_matched`

A unique and persistent identifier for accounts that can be used to trace multiple instances of the same account across different Items for depository accounts. This is currently an opt-in field and only supported for Chase Items.

The duration of transaction history available within this report for this Item, typically defined as the time since the date of the earliest transaction in that account.

Transaction history associated with the account.

Hide object

The ID of the account in which this transaction occurred.

The settled value of the transaction, denominated in the transaction's currency, as stated in `iso_currency_code` or `unofficial_currency_code`. Positive values when money moves out of the account; negative values when money moves in. For example, debit card purchases are positive; credit card payments, direct deposits, and refunds are negative.

Format: `double`

The ISO-4217 currency code of the transaction. Always `null` if `unofficial_currency_code` is non-null.

The unofficial currency code associated with the transaction. Always `null` if `iso_currency_code` is non-`null`. Unofficial currency codes are used for currencies that do not have official ISO currency codes, such as cryptocurrencies and the currencies of certain countries.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The string returned by the financial institution to describe the transaction.

A hierarchical array of the categories to which this transaction belongs. For a full list of categories, see [`/categories/get`](https://plaid.com/docs/api/products/transactions/#categoriesget).

This field will only appear in an Asset Report with Insights.

The ID of the category to which this transaction belongs. For a full list of categories, see [`/categories/get`](https://plaid.com/docs/api/products/transactions/#categoriesget).

This field will only appear in an Asset Report with Insights.

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

The merchant name or transaction description. This is a legacy field that is no longer maintained. For merchant name, use the `merchant_name` field. For description, use the `original_description` field.

This field will only appear in an Asset Report with Insights.

The merchant name, as enriched by Plaid. This is typically a more human-readable version of the merchant counterparty in the transaction. For some bank transactions (such as checks or account transfers) where there is no meaningful merchant name, this value will be `null`.

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

When `true`, identifies the transaction as pending or unsettled. Pending transaction details (name, type, amount, category ID) may change before they are settled.

The ID of a posted transaction's associated pending transaction, where applicable.

The name of the account owner. This field is not typically populated and only relevant when dealing with sub-accounts.

The unique ID of the transaction. Like all Plaid identifiers, the `transaction_id` is case sensitive.

`digital:` transactions that took place online.

`place:` transactions that were made at a physical location.

`special:` transactions that relate to banks, e.g. fees or deposits.

`unresolved:` transactions that do not fit into the other three types.

Possible values: `digital`, `place`, `special`, `unresolved`

A set of fields describing the investments data on an account.

Hide object

Quantities and values of securities held in the investment account. Map to the `securities` array for security details.

Hide object

The Plaid `account_id` associated with the holding.

The Plaid `security_id` associated with the holding. Security data is not specific to a user's account; any user who held the same security at the same financial institution at the same time would have identical security data. The `security_id` for the same security will typically be the same across different institutions, but this is not guaranteed. The `security_id` does not typically change, but may change if inherent details of the security change due to a corporate action, for example, in the event of a ticker symbol change or CUSIP change.

The holding's trading symbol for publicly traded holdings, and otherwise a short identifier if available.

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

Details of specific securities held in on the investment account.

Hide object

A unique, Plaid-specific identifier for the security, used to associate securities with holdings. Like all Plaid identifiers, the `security_id` is case sensitive. The `security_id` may change if inherent details of the security change due to a corporate action, for example, in the event of a ticker symbol change or CUSIP change.

A descriptive name for the security, suitable for display.

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

The total quantity of vested assets held, as reported by the financial institution. Vested assets are only associated with [equities](https://plaid.com/docs/api/products/investments/#investments-holdings-get-response-securities-type).

Format: `double`

The value of the vested holdings as reported by the institution.

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

Data returned by the financial institution about the account owner or owners. For business accounts, the name reported may be either the name of the individual or the name of the business, depending on the institution. Multiple owners on a single account will be represented in the same `owner` object, not in multiple owner objects within the array. In API versions 2018-05-22 and earlier, the `owners` object is not returned, and instead identity information is returned in the top level `identity` object. For more details, see [Plaid API versioning](https://plaid.com/docs/api/versioning/#version-2019-05-29)

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

Calculated data about the historical balances on the account.

Available for `credit` and `depository` type accounts.

Hide object

The date of the calculated historical balance, in an [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD)

Format: `date`

The total amount of funds in the account, calculated from the `current` balance in the `balance` object by subtracting inflows and adding back outflows according to the posted date of each transaction.

If the account has any pending transactions, historical balance amounts on or after the date of the earliest pending transaction may differ if retrieved in subsequent Asset Reports as a result of those pending transactions posting.

Format: `double`

The ISO-4217 currency code of the balance. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the balance. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

This is a container object for all lending-related insights. This field will be returned only for European customers.

Hide object

Risk indicators focus on providing signal on the possibility of a borrower defaulting on their loan repayments by providing data points related to its payment behavior, debt, and other relevant financial information, helping lenders gauge the level of risk involved in a certain operation.

Hide object

Insights into bank penalties and fees, including overdraft fees, NSF fees, and other bank-imposed charges.

Hide object

The total value of outflow transactions categorized as `BANK_PENALTIES`, across all the accounts in the report within the requested time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Detailed categories view of all the transactions that fall into the `BANK_PENALTIES` credit category within the given time window, across all the accounts in the report.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of transactions that fall into the `BANK_PENALTIES` credit category, across all the accounts in the report.

The monthly summaries of the transactions that fall into the `BANK_PENALTIES` credit category within the given time window, across all the accounts in the report.

Hide object

The start date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The end date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The number of days since the last transaction that falls into the `BANK_PENALTIES` credit category, across all the accounts in the report.

The percentage of the user's monthly inflows that was spent on transactions that fall into the `BANK_PENALTIES` credit category within the given time window, across all the accounts in the report. For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into the `BANK_PENALTIES` credit category.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

Insights into gambling-related transactions, including frequency, amounts, and top merchants.

Hide object

The total value of transactions that fall into the `GAMBLING` credit category, across all the accounts in the report.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Up to 3 top merchants that the user had the most transactions for in the given time window, in descending order of total spend.

If the user has not spent money on any merchants in the given time window, this list will be empty.

The total number of transactions that fall into the `GAMBLING` credit category, across all the accounts in the report.

The monthly summaries of the transactions that fall into the `GAMBLING` category within the given time window, across all the accounts in the report.

Hide object

The start date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The end date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The number of days since the last transaction that falls into the `GAMBLING` category, across all the accounts in the report.

The percentage of the user's monthly inflows that was spent on transactions that fall into the `GAMBLING` category within the given time window, across all the accounts in the report. For example, a value of 100 indicates that 100% of the inflows were spent on transactions that fall into the `GAMBLING` credit category.
If there's no available income for the given time period, this field value will be `-1`

Format: `double`

Insights into loan disbursement transactions received by the user, tracking incoming funds from loan providers.

Hide object

The total value of inflow transactions categorized as `LOAN_DISBURSEMENTS`, across all the accounts in the report within the requested time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Detailed categories view of all the transactions that fall into the `LOAN_DISBURSEMENTS` credit category within the given time window, across all the accounts in the report.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Up to 3 top service providers that the user had the most transactions for in the given time window, in descending order of total spend.

If the user has not received money from any provider in the given time window, this list will be empty.

The total number of transactions that fall into the `LOAN_DISBURSEMENTS` credit category, across all the accounts in the report.

The monthly summaries of the transactions that fall into the `LOAN_DISBURSEMENTS` category within the given time window, across all the accounts in the report.

Hide object

The start date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The end date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The number of days since the last transaction that falls into the `LOAN_DISBURSEMENTS` credit category, across all the accounts in the report.

The percentage of the user's monthly inflows that was received on transactions that fall into the `LOAN_DISBURSEMENTS` credit category within the given time window, across all the accounts in the report. For example, a value of 100 indicates that 100% of the inflows were spent on transactions that fall into the `LOAN_DISBURSEMENTS` credit category.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

Insights into loan payment transactions made by the user, tracking outgoing payments to loan providers.

Hide object

The total value of outflow transactions categorized as `LOAN_PAYMENTS`, across all the accounts in the report within the requested time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Detailed categories view of all the transactions that fall into the `LOAN_PAYMENTS` credit category within the given time window, across all the accounts in the report.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Up to 3 top service providers that the user had the most transactions for in the given time window, in descending order of total spend.

If the user has not spent money on any provider in the given time window, this list will be empty.

The total number of transactions that fall into the `LOAN_PAYMENTS` credit category, across all the accounts in the report.

The monthly summaries of the transactions that fall into the `LOAN_PAYMENTS` credit category within the given time window, across all the accounts in the report.

Hide object

The start date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

The end date of the month for the given report time window. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

Format: `date`

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The number of days since the last transaction that falls into the `LOAN_PAYMENTS` credit category, across all the accounts in the report.

The percentage of the user's monthly inflows that was spent on transactions that fall into the `LOAN_PAYMENTS` credit category within the given time window, across all the accounts in the report. For example, a value of 100 indicates that 100% of the inflows were spent on transactions that fall into the `LOAN_PAYMENTS` credit category.
If there's no available income for the given time period, this field value will be `-1`

Format: `double`

Insights into negative balance occurrences, including frequency, duration, and minimum balance details.

Hide object

The number of days since the last transaction that caused any account in the report to have a negative balance.

This value is inclusive of the date of the last negative balance, meaning that if the last negative balance occurred today, this value will be `0`.

The number of aggregated days that the accounts in the report has had a negative balance within the given time window.

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The summary of the negative balance occurrences for this account.

If the user has not had a negative balance in the account in the given time window, this list will be empty.

Hide object

The date of the first transaction that caused the account to have a negative balance.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).

Format: `date`

The date of the last transaction that caused the account to have a negative balance.
The date will be returned in an ISO 8601 format (YYYY-MM-DD).
This date is inclusive, meaning that this was the last date that the account had a negative balance.

Format: `date`

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Affordability insights focus on providing signal on the ability of a borrower to repay their loan without experiencing financial strain. It provides insights on factors such as a user's monthly income and expenses, disposable income, average expenditure, etc., helping lenders gauge the level of affordability of a borrower.

Hide object

Comprehensive analysis of spending patterns, categorizing expenses into essential, non-essential, and other categories.

Hide object

Net cash flow for the period (inflows minus outflows), including a monthly average.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Summary statistics for a specific expenditure category, including total amount, monthly average, and percentage of income.

Hide object

The total value of all the aggregated transactions in this expenditure category.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of outflow transactions in this expenses group, within the given time window across all the accounts in the report.

The percentage of the total inflows that was spent in this expenses group, within the given time window across all the accounts in the report.
For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into this expenditure group.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

The primary credit categories of the expenses within the given time window, across all the accounts in the report.

The categories are sorted in descending order by the total value spent.
See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Summary statistics for a specific expenditure category, including total amount, monthly average, and percentage of income.

Hide object

The total value of all the aggregated transactions in this expenditure category.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of outflow transactions in this expenses group, within the given time window across all the accounts in the report.

The percentage of the total inflows that was spent in this expenses group, within the given time window across all the accounts in the report.
For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into this expenditure group.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

The primary credit categories of the expenses within the given time window, across all the accounts in the report.

The categories are sorted in descending order by the total value spent.
See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Summary statistics for a specific expenditure category, including total amount, monthly average, and percentage of income.

Hide object

The total value of all the aggregated transactions in this expenditure category.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of outflow transactions in this expenses group, within the given time window across all the accounts in the report.

The percentage of the total inflows that was spent in this expenses group, within the given time window across all the accounts in the report.
For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into this expenditure group.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

The primary credit categories of the expenses within the given time window, across all the accounts in the report.

The categories are sorted in descending order by the total value spent.
See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Summary statistics for a specific expenditure category, including total amount, monthly average, and percentage of income.

Hide object

The total value of all the aggregated transactions in this expenditure category.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of outflow transactions in this expenses group, within the given time window across all the accounts in the report.

The percentage of the total inflows that was spent in this expenses group, within the given time window across all the accounts in the report.
For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into this expenditure group.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

The primary credit categories of the expenses within the given time window, across all the accounts in the report.

The categories are sorted in descending order by the total value spent.
See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Summary statistics for a specific expenditure category, including total amount, monthly average, and percentage of income.

Hide object

The total value of all the aggregated transactions in this expenditure category.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The total number of outflow transactions in this expenses group, within the given time window across all the accounts in the report.

The percentage of the total inflows that was spent in this expenses group, within the given time window across all the accounts in the report.
For example, a value of 100 represents that 100% of the inflows were spent on transactions that fall into this expenditure group.
If there's no available income for the given time period, this field value will be `-1`.

Format: `double`

The primary credit categories of the expenses within the given time window, across all the accounts in the report.

The categories are sorted in descending order by the total value spent.
See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Insights into unusually large transactions that exceed typical spending patterns for the account.

Hide object

The total number of transactions whose value is above the threshold of normal amounts for a given account.

A monetary amount with its associated currency information, supporting both official and unofficial currency codes.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Up to 3 top categories of expenses in this group.

Hide object

The ID of the credit category.

See the [category taxonomy](https://plaid.com/documents/credit-category-taxonomy.csv) for a full listing of category IDs.

The total number of transactions that fall into this credit category within the given time window.

The total value for all the transactions that fall into this category within the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

The monthly average amount calculated by dividing the total by the number of calendar months in the time period.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Comprehensive income analysis including total income, income excluding transfers, and inbound transfer amounts.

Hide object

The total amount of all income transactions in the given time period.

Hide object

If the parent object represents a category of transactions, such as `total_amount`, `transfers_in`, `total_income`, etc. the `amount` represents the sum of all of the transactions in the group.

If the parent object is `cash_flow`, the `amount` represents the total value of all the inflows minus all the outflows across all the accounts in the report in the given time window.

If the parent object is `minimum_balance`, the `amount` represents the lowest balance of the account during the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Income excluding account transfer transactions for the period, including a monthly average.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

Sum of inbound transfer transactions for the period, including a monthly average.

Hide object

The monthly average amount of all the aggregated transactions of the given category, across all the accounts for the given time window.

The average is calculated by dividing the total amount of the transactions by the number of calendar months in the given time window.

Format: `double`

The ISO-4217 currency code of the amount. Always `null` if `unofficial_currency_code` is non-`null`.

The unofficial currency code associated with the amount. Always `null` if `iso_currency_code` is non-`null`.

See the [currency code schema](https://plaid.com/docs/api/accounts#currency-code-schema) for a full listing of supported `unofficial_currency_code`s.

If the Asset Report generation was successful but identity information cannot be returned, this array will contain information about the errors causing identity information to be missing

Hide object

The warning type, which will always be `ASSET_REPORT_WARNING`

The warning code identifies a specific kind of warning. `OWNERS_UNAVAILABLE` indicates that account-owner information is not available. `INVESTMENTS_UNAVAILABLE` indicates that Investments specific information is not available. `TRANSACTIONS_UNAVAILABLE` indicates that transactions information associated with Credit and Depository accounts are unavailable. The `BANK_INCOME_INSIGHTS_*` codes apply to the Bank Income add-on: `BANK_INCOME_INSIGHTS_INSUFFICIENT_DATA` indicates there was not enough data to compute Bank Income Insights; `BANK_INCOME_INSIGHTS_INCOMPLETE` indicates the Bank Income Insights flow was not completed; `BANK_INCOME_INSIGHTS_STATUS_IN_PROGRESS` indicates Bank Income Insights are still being computed; `BANK_INCOME_INSIGHTS_INTERNAL_ERROR` indicates an internal error occurred while computing Bank Income Insights; `BANK_INCOME_INSIGHTS_MISMATCHED_DAYS_REQUESTED` indicates the days requested for Bank Income Insights did not match that of the Asset Report.

Possible values: `OWNERS_UNAVAILABLE`, `INVESTMENTS_UNAVAILABLE`, `TRANSACTIONS_UNAVAILABLE`, `BANK_INCOME_INSIGHTS_INSUFFICIENT_DATA`, `BANK_INCOME_INSIGHTS_INCOMPLETE`, `BANK_INCOME_INSIGHTS_STATUS_IN_PROGRESS`, `BANK_INCOME_INSIGHTS_INTERNAL_ERROR`, `BANK_INCOME_INSIGHTS_MISMATCHED_DAYS_REQUESTED`

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
    "asset_report_id": "028e8404-a013-4a45-ac9e-002482f9cafc",
    "client_report_id": "client_report_id_1221",
    "date_generated": "2023-03-30T18:27:37Z",
    "days_requested": 90,
    "items": [
      {
        "accounts": [
          {
            "account_id": "1qKRXQjk8xUWDJojNwPXTj8gEmR48piqRNye8",
            "balances": {
              "available": 43200,
              "current": 43200,
              "limit": null,
              "margin_loan_amount": null,
              "iso_currency_code": "USD",
              "unofficial_currency_code": null
            },
            "days_available": 90,
            "historical_balances": [
              {
                "current": 49050,
                "date": "2023-03-29",
                "iso_currency_code": "USD",
                "unofficial_currency_code": null
              },
              {
                "current": 49050,
                "date": "2023-03-28",
                "iso_currency_code": "USD",
                "unofficial_currency_code": null
              },
              {
                "current": 49050,
                "date": "2023-03-27",
                "iso_currency_code": "USD",
                "unofficial_currency_code": null
              },
              {
                "current": 49050,
                "date": "2023-03-26",
                "iso_currency_code": "USD",
                "unofficial_currency_code": null
              },
              {
                "current": 49050,
                "date": "2023-03-25",
                "iso_currency_code": "USD",
                "unofficial_currency_code": null
              }
            ],
            "mask": "4444",
            "name": "Plaid Money Market",
            "official_name": "Plaid Platinum Standard 1.85% Interest Money Market",
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
            "ownership_type": null,
            "subtype": "money market",
            "transactions": [
              {
                "account_id": "1qKRXQjk8xUWDJojNwPXTj8gEmR48piqRNye8",
                "amount": 5850,
                "date": "2023-03-30",
                "iso_currency_code": "USD",
                "original_description": "ACH Electronic CreditGUSTO PAY 123456",
                "pending": false,
                "transaction_id": "gGQgjoeyqBF89PND6K14Sow1wddZBmtLomJ78",
                "unofficial_currency_code": null
              }
            ],
            "type": "depository"
          },
          {
            "account_id": "eG7pNLjknrFpWvP7Dkbdf3Pq6GVBPKTaQJK5v",
            "balances": {
              "available": 100,
              "current": 110,
              "limit": null,
              "margin_loan_amount": null,
              "iso_currency_code": "USD",
              "unofficial_currency_code": null
            },
            "days_available": 90,
            "historical_balances": [
              {
                "current": 110,
                "date": "2023-03-29",
                "iso_currency_code": "USD",
                "unofficial_currency_code": null
              },
              {
                "current": -390,
                "date": "2023-03-28",
                "iso_currency_code": "USD",
                "unofficial_currency_code": null
              },
              {
                "current": -373.67,
                "date": "2023-03-27",
                "iso_currency_code": "USD",
                "unofficial_currency_code": null
              },
              {
                "current": -284.27,
                "date": "2023-03-26",
                "iso_currency_code": "USD",
                "unofficial_currency_code": null
              },
              {
                "current": -284.27,
                "date": "2023-03-25",
                "iso_currency_code": "USD",
                "unofficial_currency_code": null
              }
            ],
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
            "ownership_type": null,
            "subtype": "checking",
            "transactions": [
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
            "type": "depository"
          }
        ],
        "date_last_updated": "2023-03-30T18:25:26Z",
        "institution_id": "ins_109508",
        "institution_name": "First Platypus Bank",
        "item_id": "AZMP7JrGXgtPd3AQMeg7hwMKgk5E8qU1V5ME7"
      }
    ],
    "user": {
      "client_user_id": "uid_40332",
      "email": "abcharleston@example.com",
      "first_name": "Anna",
      "last_name": "Charleston",
      "middle_name": "B",
      "phone_number": "1-415-867-5309",
      "ssn": "111-22-1234"
    }
  },
  "request_id": "GVzMdiDd8DDAQK4",
  "warnings": []
}
```

=\*=\*=\*=[#### `/credit/relay/refresh`](/docs/api/products/assets/#creditrelayrefresh)

[#### Refresh a report of a relay token](/docs/api/products/assets/#refresh-a-report-of-a-relay-token)

The [`/credit/relay/refresh`](/docs/api/products/assets/#creditrelayrefresh) endpoint allows third parties to refresh a report that was relayed to them, using a `relay_token` that was created by the report owner. A new report will be created with the original report parameters, but with the most recent data available based on the `days_requested` value of the original report.

/credit/relay/refresh

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The `relay_token` granting access to the report you would like to refresh.

The report type. It can be `asset`. Income report types are not yet supported.

Possible values: `asset`

The URL registered to receive webhooks when the report of a relay token has been refreshed.

Format: `url`

/credit/relay/refresh

Nodeâ¼

```
const request: CreditRelayRefreshRequest = {
  relay_token: createResponse.data.relay_token,
  report_type: 'asset',
};
try {
  const response = await plaidClient.creditRelayRefresh(request);
} catch (error) {
  // handle error
}
```

/credit/relay/refresh

**Response fields**

A unique ID identifying an Asset Report. Like all Plaid identifiers, this ID is case sensitive.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "relay_token": "credit-relay-sandbox-8218d5f8-6d6d-403d-92f5-13a9afaa4398",
  "request_id": "NBZaq",
  "asset_report_id": "bf3a0490-344c-4620-a219-2693162e4b1d"
}
```

=\*=\*=\*=[#### `/credit/relay/remove`](/docs/api/products/assets/#creditrelayremove)

[#### Remove relay token](/docs/api/products/assets/#remove-relay-token)

The [`/credit/relay/remove`](/docs/api/products/assets/#creditrelayremove) endpoint allows you to invalidate a `relay_token`. The third party holding the token will no longer be able to access or refresh the reports which the `relay_token` gives access to. The original report, associated Items, and other relay tokens that provide access to the same report are not affected and will remain accessible after removing the given `relay_token`.

/credit/relay/remove

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The `relay_token` you would like to revoke.

/credit/relay/remove

Nodeâ¼

```
const request: CreditRelayRemoveRequest = {
  relay_token: createResponse.data.relay_token,
};
try {
  const response = await plaidClient.creditRelayRemove(request);
} catch (error) {
  // handle error
}
```

/credit/relay/remove

**Response fields**

`true` if the relay token was successfully removed.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "removed": true,
  "request_id": "m8MDnv9okwxFNBV"
}
```

[### Webhooks](/docs/api/products/assets/#webhooks)=\*=\*=\*=[#### `PRODUCT_READY`](/docs/api/products/assets/#product_ready)

Fired when the Asset Report has been generated and [`/asset_report/get`](/docs/api/products/assets/#asset_reportget) is ready to be called. If you attempt to retrieve an Asset Report before this webhook has fired, you'll receive a response with the HTTP status code 400 and a Plaid error code of `PRODUCT_NOT_READY`.

**Properties**

`ASSETS`

`PRODUCT_READY`

The `asset_report_id` corresponding to the Asset Report the webhook has fired for.

The `user_id` corresponding to the User ID the webhook has fired for.

Indicates either a Fast Asset Report, which will contain only current identity and balance information, or a Full Asset Report, which will also contain historical balance information and transaction data.

Possible values: `FULL`, `FAST`

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "ASSETS",
  "webhook_code": "PRODUCT_READY",
  "asset_report_id": "47dfc92b-bba3-4583-809e-ce871b321f05",
  "report_type": "FULL",
  "environment": "production"
}
```

=\*=\*=\*=[#### `ERROR`](/docs/api/products/assets/#error)

Fired when Asset Report generation has failed. The resulting `error` will have an `error_type` of `ASSET_REPORT_ERROR`.

**Properties**

Collapse all

`ASSETS`

`ERROR`

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

The ID associated with the Asset Report.

The `user_id` corresponding to the User ID the webhook has fired for.

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "ASSETS",
  "webhook_code": "ERROR",
  "asset_report_id": "47dfc92b-bba3-4583-809e-ce871b321f05",
  "error": {
    "display_message": null,
    "error_code": "PRODUCT_NOT_ENABLED",
    "error_message": "the 'assets' product is not enabled for the following access tokens: access-sandbox-fb88b20c-7b74-4197-8d01-0ab122dad0bc. please ensure that 'assets' is included in the 'product' array when initializing Link and create the Item(s) again.",
    "error_type": "ASSET_REPORT_ERROR",
    "request_id": "m8MDnv9okwxFNBV"
  },
  "environment": "production"
}
```
