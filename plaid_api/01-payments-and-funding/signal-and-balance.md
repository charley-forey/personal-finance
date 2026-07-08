---
title: "Signal and Balance"
source_url: "https://plaid.com/docs/api/products/signal/"
section: "Payments and Funding"
section_id: "01-payments-and-funding"
slug: "signal-and-balance"
endpoints:
  - "/signal/evaluate"
  - "/signal/decision/report"
  - "/signal/return/report"
  - "/signal/prepare"
  - "/accounts/balance/get"
  - "/processor/token/create"
  - "/processor/signal/evaluate"
  - "/processor/signal/decision/report"
  - "/processor/signal/return/report"
  - "/processor/signal/prepare"
  - "/processor/balance/get"
  - "INVALID_ACCOUNT_ID"
  - "INVALID_FIELD"
  - "/accounts/get"
  - "webhook"
  - "/transfer/migrate_account"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Signal Transaction Scores and Balance endpoints

> **Source:** [https://plaid.com/docs/api/products/signal/](https://plaid.com/docs/api/products/signal/)
> **Section:** Payments and Funding

## Endpoints & Webhooks on this page

- `/signal/evaluate`
- `/signal/decision/report`
- `/signal/return/report`
- `/signal/prepare`
- `/accounts/balance/get`
- `/processor/token/create`
- `/processor/signal/evaluate`
- `/processor/signal/decision/report`
- `/processor/signal/return/report`
- `/processor/signal/prepare`
- `/processor/balance/get`
- `INVALID_ACCOUNT_ID`
- `INVALID_FIELD`
- `/accounts/get`
- `webhook`
- `/transfer/migrate_account`

---

# Signal Transaction Scores and Balance endpoints

#### API Reference guide for the Signal Transaction Scores and Balance products

For how-to guidance, see the [Balance documentation](/docs/balance/) and [Signal Transaction Scores documentation](/docs/signal/).

| Plaid Signal endpoints (for both Balance and Signal Transaction Scores) |  |
| --- | --- |
| [`/signal/evaluate`](/docs/api/products/signal/#signalevaluate) | Evaluate a proposed ACH transaction for return risk |
| [`/signal/decision/report`](/docs/api/products/signal/#signaldecisionreport) | Report whether you initiated an ACH transaction |
| [`/signal/return/report`](/docs/api/products/signal/#signalreturnreport) | Report a return for an ACH transaction |

| Signal Transaction Scores-only endpoints |  |
| --- | --- |
| [`/signal/prepare`](/docs/api/products/signal/#signalprepare) | Enable an existing Item for Signal Transaction Scores |

| Balance-only endpoints |  |
| --- | --- |
| [`/accounts/balance/get`](/docs/api/products/signal/#accountsbalanceget) | Fetch real-time balances |

| See also |  |
| --- | --- |
| [`/processor/token/create`](/docs/api/processors/#processortokencreate) | Create a token for using Plaid Signal Transaction Scores with a processor partner |
| [`/processor/signal/evaluate`](/docs/api/processor-partners/#processorsignalevaluate) | Evaluate a proposed ACH transaction for return risk as a processor partner |
| [`/processor/signal/decision/report`](/docs/api/processor-partners/#processorsignaldecisionreport) | Report whether you initiated an ACH transaction as a processor partner |
| [`/processor/signal/return/report`](/docs/api/processor-partners/#processorsignalreturnreport) | Report a return for an ACH transaction as a processor partner |
| [`/processor/signal/prepare`](/docs/api/processor-partners/#processorsignalprepare) | Enable an existing processor token for Signal Transaction Scores |
| [`/processor/balance/get`](/docs/api/processor-partners/#processorbalanceget) | Fetch real-time balances as a processor partner |

=\*=\*=\*=[#### `/signal/evaluate`](/docs/api/products/signal/#signalevaluate)

[#### Evaluate a planned ACH transaction](/docs/api/products/signal/#evaluate-a-planned-ach-transaction)

Use [`/signal/evaluate`](/docs/api/products/signal/#signalevaluate) to evaluate a planned ACH transaction to get a return risk assessment and additional risk signals.

Before using [`/signal/evaluate`](/docs/api/products/signal/#signalevaluate), you must first [create a ruleset](https://plaid.com/docs/signal/signal-rules/) in the Dashboard under [**Signal->Rules**](https://dashboard.plaid.com/signal/risk-profiles).

[`/signal/evaluate`](/docs/api/products/signal/#signalevaluate) can be used with either Signal Transaction Scores or the Balance product. Which product is used will be determined by the `ruleset_key` that you provide. For more details, see [Signal Rules](https://plaid.com/docs/signal/signal-rules/).

Note: This request may have higher latency when using a Balance-only ruleset. This is because Plaid must communicate directly with the institution to request data. Balance-only rulesets may have latency of up to 30 seconds or more; if you encounter errors, you may find it necessary to adjust your timeout period when making requests.

/signal/evaluate

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The access token associated with the Item for which data is being requested.

The Plaid `account_id` of the account that is the funding source for the proposed transaction. The `account_id` is returned in the `/accounts/get` endpoint as well as the [`onSuccess`](https://plaid.com/docs/link/ios/#link-ios-onsuccess-linkSuccess-metadata-accounts-id) callback metadata.

This will return an [`INVALID_ACCOUNT_ID`](https://plaid.com/docs/errors/invalid-input/#invalid_account_id) error if the account has been removed at the bank or if the `account_id` is no longer valid.

The unique ID that you would like to use to refer to this evaluation attempt - for example, a payment attempt ID. You will use this later to debug this evaluation, and/or report an ACH return, etc. The max length for this field is 36 characters.

Min length: `1`

Max length: `36`

The transaction amount, in USD (e.g. `102.05`)

Format: `double`

A unique ID that identifies the end user in your system. This ID is used to correlate requests by a user with multiple Items. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

Use `true` if the ACH transaction is a part of recurring schedule (for example, a monthly repayment); `false` otherwise. When using a Balance-only ruleset, this field is ignored.

The default ACH payment method to complete the transaction. When using a Balance-only ruleset, this field is ignored.
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

The key of the ruleset to use for evaluating this transaction. You can create a ruleset using the Plaid Dashboard, under [Signal->Rules](https://dashboard.plaid.com/signal/risk-profiles). If not provided, for all new customers as of October 15, 2025, the `default` ruleset will be used. For existing Signal Transaction Scores customers as of October 15, 2025, by default, no ruleset will be used if the `ruleset_key` is not provided. For more information, or to opt out of using rulesets, see [Signal Rules](https://plaid.com/docs/signal/signal-rules/).

/signal/evaluate

Nodeâ¼

```
const eval_request = {
  access_token: 'access-sandbox-71e02f71-0960-4a27-abd2-5631e04f2175',
  account_id: '3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr',
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
};

try {
  const eval_response = await plaidClient.signalEvaluate(eval_request);
  const core_attributes = eval_response.data.core_attributes;
  const scores = eval_response.data.scores;
} catch (error) {
  // handle error
}
```

/signal/evaluate

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

If bank information was not available to be used in the Signal Transaction Scores model, this array contains warnings describing why bank data is missing. If you want to receive an API error instead of results in the case of missing bank data, file a support ticket or contact your Plaid account manager.

Hide object

A broad categorization of the warning. Safe for programmatic use.

The warning code identifies a specific kind of warning that pertains to the error causing bank data to be missing. Safe for programmatic use. For more details on warning codes, please refer to Plaid standard error codes documentation. If you receive the `ITEM_LOGIN_REQUIRED` warning, we recommend re-authenticating your user by implementing Link's update mode. This will guide your user to fix their credentials, allowing Plaid to start fetching data again for future requests.

A developer-friendly representation of the warning type. This may change over time and is not safe for programmatic use.

Response Object

```
{
  "scores": {
    "customer_initiated_return_risk": {
      "score": 9
    },
    "bank_initiated_return_risk": {
      "score": 82
    }
  },
  "core_attributes": {
    "available_balance": 2200,
    "current_balance": 2000
  },
  "ruleset": {
    "ruleset_key": "onboarding_flow",
    "result": "REROUTE",
    "triggered_rule_details": {
      "internal_note": "Rerouting customer to different payment method, since bank risk score is too high"
    }
  },
  "warnings": [],
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/signal/decision/report`](/docs/api/products/signal/#signaldecisionreport)

[#### Report whether you initiated an ACH transaction](/docs/api/products/signal/#report-whether-you-initiated-an-ach-transaction)

After you call [`/signal/evaluate`](/docs/api/products/signal/#signalevaluate), Plaid will normally infer the outcome from your Signal Rules. However, if you are not using Signal Rules, if the Signal Rules outcome was `REVIEW`, or if you take a different action than the one determined by the Signal Rules, you will need to call [`/signal/decision/report`](/docs/api/products/signal/#signaldecisionreport). This helps improve Signal Transaction Score accuracy for your account and is necessary for proper functioning of the rule performance and rule tuning capabilities in the Dashboard. If your effective decision changes after calling [`/signal/decision/report`](/docs/api/products/signal/#signaldecisionreport) (for example, you indicated that you accepted a transaction, but later on, your payment processor rejected it, so it was never initiated), call [`/signal/decision/report`](/docs/api/products/signal/#signaldecisionreport) again for the transaction to correct Plaid's records.

If you are using Plaid Transfer as your payment processor, you also do not need to call [`/signal/decision/report`](/docs/api/products/signal/#signaldecisionreport), as Plaid can infer outcomes from your Transfer activity.

If using a Balance-only ruleset, this endpoint will not impact scores (Balance does not use scores), but is necessary to view accurate transaction outcomes and tune rule logic in the Dashboard.

/signal/decision/report

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Must be the same as the `client_transaction_id` supplied when calling `/signal/evaluate`

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

/signal/decision/report

Nodeâ¼

```
const decision_report_request = {
  client_transaction_id: 'txn12345',
  initiated: true,
  days_funds_on_hold: 3,
};

try {
  const decision_report_response = await plaidClient.signalDecisionReport(
    decision_report_request,
  );
  const decision_request_id = decision_report_response.data.request_id;
} catch (error) {
  // handle error
}
```

/signal/decision/report

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/signal/return/report`](/docs/api/products/signal/#signalreturnreport)

[#### Report a return for an ACH transaction](/docs/api/products/signal/#report-a-return-for-an-ach-transaction)

Call the [`/signal/return/report`](/docs/api/products/signal/#signalreturnreport) endpoint to report a returned transaction that was previously sent to the [`/signal/evaluate`](/docs/api/products/signal/#signalevaluate) endpoint. Your feedback will be used by the model to incorporate the latest risk trends into your scores and tune rule logic. If using a Balance-only ruleset, this endpoint will not impact scores (as Balance does not use scores), but is necessary to view accurate transaction outcomes and tune rule logic in the Dashboard.

/signal/return/report

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Must be the same as the `client_transaction_id` supplied when calling `/signal/evaluate` or `/accounts/balance/get`.

Min length: `1`

Max length: `36`

Must be a valid ACH return code (e.g. "R01")

If formatted incorrectly, this will result in an [`INVALID_FIELD`](https://plaid.com/docs/errors/invalid-request/#invalid_field) error.

Date and time when you receive the returns from your payment processors, in ISO 8601 format (`YYYY-MM-DDTHH:mm:ssZ`).

Format: `date-time`

/signal/return/report

Nodeâ¼

```
const return_report_request = {
  client_transaction_id: 'txn12345',
  return_code: 'R01',
};

try {
  const return_report_response = await plaidClient.signalReturnReport(
    return_report_request,
  );
  const request_id = return_report_response.data.request_id;
  console.log(request_id);
} catch (error) {
  // handle error
}
```

/signal/return/report

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/signal/prepare`](/docs/api/products/signal/#signalprepare)

[#### Opt-in an Item to Signal Transaction Scores](/docs/api/products/signal/#opt-in-an-item-to-signal-transaction-scores)

When an Item is not initialized with `signal`, call [`/signal/prepare`](/docs/api/products/signal/#signalprepare) to opt-in that Item to the data collection process used to develop a Signal Transaction Score. This should be done on Items where `signal` was added in the `additional_consented_products` array but not in the `products`, `optional_products`, or `required_if_supported_products` array. If [`/signal/prepare`](/docs/api/products/signal/#signalprepare) is skipped on an Item that is not initialized with `signal`, the initial call to [`/signal/evaluate`](/docs/api/products/signal/#signalevaluate) on that Item will be less accurate, because Plaid will have access to less data for computing the Signal Transaction Score.

If your integration is purely Balance-only, this endpoint will have no effect, as Balance-only rulesets do not calculate a Signal Transaction Score.

If run on an Item that is already initialized with `signal`, this endpoint will return a 200 response and will not modify the Item.

/signal/prepare

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The access token associated with the Item for which data is being requested.

/signal/prepare

Nodeâ¼

```
const prepare_request = {
  access_token: 'access-sandbox-71e02f71-0960-4a27-abd2-5631e04f2175',
};

try {
  const prepare_response = await plaidClient.signalPrepare(prepare_request);
  const request_id = prepare_response.data.request_id;
  console.log(request_id);
} catch (error) {
  // handle error
}
```

/signal/prepare

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/accounts/balance/get`](/docs/api/products/signal/#accountsbalanceget)

[#### Retrieve real-time balance data](/docs/api/products/signal/#retrieve-real-time-balance-data)

The [`/accounts/balance/get`](/docs/api/products/signal/#accountsbalanceget) endpoint returns the real-time balance for each of an Item's accounts. While other endpoints, such as [`/accounts/get`](/docs/api/accounts/#accountsget), return a balance object, [`/accounts/balance/get`](/docs/api/products/signal/#accountsbalanceget) forces the available and current balance fields to be refreshed rather than cached. This endpoint can be used for existing Items that were added via any of Plaid's other products. This endpoint can be used as long as Link has been initialized with any other product; `balance` itself is not a product that can be used to initialize Link. As this endpoint triggers a synchronous request for fresh data, latency may be higher than for other Plaid endpoints (typically less than 10 seconds, but occasionally up to 30 seconds or more); if you encounter errors, you may find it necessary to adjust your timeout period when making requests.

Note: If you are getting real-time balance for the purpose of assessing the return risk of a proposed ACH transaction, it is recommended to use [`/signal/evaluate`](/docs/api/products/signal/#signalevaluate) instead of [`/accounts/balance/get`](/docs/api/products/signal/#accountsbalanceget). [`/signal/evaluate`](/docs/api/products/signal/#signalevaluate) returns the same real-time balance information and also provides access to Signal Rules, which provides no-code transaction business logic configuration, backtesting and recommendations for tuning your transaction acceptance logic, and the ability to easily switch between Balance and Signal Transaction Scores as needed for ultra-low-latency, ML-powered risk assessments. For more details, see the [Balance documentation](https://plaid.com/docs/balance/#balance-integration-options).

/accounts/balance/get

**Request fields**

Collapse all

The access token associated with the Item for which data is being requested.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Optional parameters to `/accounts/balance/get`.

Hide object

A list of `account_ids` to retrieve for the Item. The default value is `null`.

Note: An error will be returned if a provided `account_id` is not associated with the Item.

Timestamp in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (`YYYY-MM-DDTHH:mm:ssZ`) indicating the oldest acceptable balance when making a request to `/accounts/balance/get`.

This field is only necessary when the institution is `ins_128026` (Capital One), *and* one or more account types being requested is a non-depository account (such as a credit card) as Capital One does not provide real-time balance for non-depository accounts. In this case, a value must be provided or an `INVALID_REQUEST` error with the code of `INVALID_FIELD` will be returned. For all other institutions, as well as for depository accounts at Capital One (including all checking and savings accounts) this field is ignored and real-time balance information will be fetched.

If this field is not ignored, and no acceptable balance is available, an `INVALID_RESULT` error with the code `LAST_UPDATED_DATETIME_OUT_OF_RANGE` will be returned.

Format: `date-time`

/accounts/balance/get

Nodeâ¼

```
// Pull real-time balance information for each account associated
// with the Item
const request: AccountsBalanceGetRequest = {
  access_token: accessToken,
};
try {
  const response = await plaidClient.accountsBalanceGet(request);
  const accounts = response.data.accounts;
} catch (error) {
  // handle error
}
```

/accounts/balance/get

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
      "account_id": "BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp",
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
    {
      "account_id": "Pp1Vpkl9w8sajvK6oEEKtr7vZxBnGpf7LxxLE",
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
      "investments"
    ],
    "billed_products": [
      "assets",
      "auth",
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
  "request_id": "qk5Bxes3gDfv4F2"
}
```
