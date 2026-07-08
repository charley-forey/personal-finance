---
title: "Transfer / Metrics"
source_url: "https://plaid.com/docs/api/products/transfer/metrics/"
section: "Payments and Funding"
section_id: "01-payments-and-funding"
slug: "transfer--metrics"
endpoints:
  - "/transfer/metrics/get"
  - "/transfer/configuration/get"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Program Metrics

> **Source:** [https://plaid.com/docs/api/products/transfer/metrics/](https://plaid.com/docs/api/products/transfer/metrics/)
> **Section:** Payments and Funding

## Endpoints & Webhooks on this page

- `/transfer/metrics/get`
- `/transfer/configuration/get`

---

# Program Metrics

#### API reference for Transfer program metrics

For how-to guidance, see the [Transfer documentation](/docs/transfer/).

| Program Metrics |  |
| --- | --- |
| [`/transfer/metrics/get`](/docs/api/products/transfer/metrics/#transfermetricsget) | Get transfer product usage metrics |
| [`/transfer/configuration/get`](/docs/api/products/transfer/metrics/#transferconfigurationget) | Get transfer product configuration |

=\*=\*=\*=[#### `/transfer/metrics/get`](/docs/api/products/transfer/metrics/#transfermetricsget)

[#### Get transfer product usage metrics](/docs/api/products/transfer/metrics/#get-transfer-product-usage-metrics)

Use the [`/transfer/metrics/get`](/docs/api/products/transfer/metrics/#transfermetricsget) endpoint to view your transfer product usage metrics.

In the Sandbox environment, this endpoint returns static placeholder values rather than metrics computed from your Sandbox transfer activity.

/transfer/metrics/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The Plaid client ID of the transfer originator. Should only be present if `client_id` is a [Platform customer](https://plaid.com/docs/transfer/application/#originators-vs-platforms).

/transfer/metrics/get

Nodeâ¼

```
const request: TransferMetricsGetRequest = {
  originator_client_id: '61b8f48ded273e001aa8db6d',
};

try {
  const response = await client.transferMetricsGet(request);
} catch (error) {
  // handle error
}
```

/transfer/metrics/get

**Response fields**

Collapse all

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Sum of dollar amount of debit transfers in last 24 hours (decimal string with two digits of precision e.g. "10.00").

Sum of dollar amount of credit transfers in last 24 hours (decimal string with two digits of precision e.g. "10.00").

Sum of dollar amount of debit transfers in current calendar month (decimal string with two digits of precision e.g. "10.00").

Sum of dollar amount of credit transfers in current calendar month (decimal string with two digits of precision e.g. "10.00").

The currency of the dollar amount, e.g. "USD".

Details regarding return rates.

Hide object

Details regarding return rates.

Hide object

The overall return rate.

The unauthorized return rate.

The administrative return rate.

Details regarding authorization usage.

Hide object

The daily credit utilization formatted as a decimal.

The daily debit utilization formatted as a decimal.

The monthly credit utilization formatted as a decimal.

The monthly debit utilization formatted as a decimal.

Response Object

```
{
  "daily_debit_transfer_volume": "1234.56",
  "daily_credit_transfer_volume": "567.89",
  "monthly_transfer_volume": "",
  "monthly_debit_transfer_volume": "10000.00",
  "monthly_credit_transfer_volume": "2345.67",
  "iso_currency_code": "USD",
  "request_id": "saKrIBuEB9qJZno",
  "return_rates": {
    "last_60d": {
      "overall_return_rate": "0.1023",
      "administrative_return_rate": "0.0160",
      "unauthorized_return_rate": "0.0028"
    }
  },
  "authorization_usage": {
    "daily_credit_utilization": "0.2300",
    "daily_debit_utilization": "0.3401",
    "monthly_credit_utilization": "0.9843",
    "monthly_debit_utilization": "0.3220"
  }
}
```

=\*=\*=\*=[#### `/transfer/configuration/get`](/docs/api/products/transfer/metrics/#transferconfigurationget)

[#### Get transfer product configuration](/docs/api/products/transfer/metrics/#get-transfer-product-configuration)

Use the [`/transfer/configuration/get`](/docs/api/products/transfer/metrics/#transferconfigurationget) endpoint to view your transfer product configurations.

/transfer/configuration/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The Plaid client ID of the transfer originator. Should only be present if `client_id` is a [Platform customer](https://plaid.com/docs/transfer/application/#originators-vs-platforms).

/transfer/configuration/get

Nodeâ¼

```
const request: TransferConfigurationGetRequest = {
  originator_client_id: '61b8f48ded273e001aa8db6d',
};

try {
  const response = await client.transferConfigurationGet(request);
} catch (error) {
  // handle error
}
```

/transfer/configuration/get

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

The max limit of dollar amount of a single credit transfer (decimal string with two digits of precision e.g. "10.00").

The max limit of dollar amount of a single debit transfer (decimal string with two digits of precision e.g. "10.00").

The max limit of sum of dollar amount of credit transfers in last 24 hours (decimal string with two digits of precision e.g. "10.00").

The max limit of sum of dollar amount of debit transfers in last 24 hours (decimal string with two digits of precision e.g. "10.00").

The max limit of sum of dollar amount of credit transfers in one calendar month (decimal string with two digits of precision e.g. "10.00").

The max limit of sum of dollar amount of debit transfers in one calendar month (decimal string with two digits of precision e.g. "10.00").

The currency of the dollar amount, e.g. "USD".

Response Object

```
{
  "max_single_transfer_amount": "",
  "max_single_transfer_credit_amount": "1000.00",
  "max_single_transfer_debit_amount": "1000.00",
  "max_daily_credit_amount": "50000.00",
  "max_daily_debit_amount": "50000.00",
  "max_monthly_amount": "",
  "max_monthly_credit_amount": "500000.00",
  "max_monthly_debit_amount": "500000.00",
  "iso_currency_code": "USD",
  "request_id": "saKrIBuEB9qJZno"
}
```
