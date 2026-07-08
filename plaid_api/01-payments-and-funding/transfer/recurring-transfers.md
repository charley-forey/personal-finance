---
title: "Transfer / Recurring Transfers"
source_url: "https://plaid.com/docs/api/products/transfer/recurring-transfers/"
section: "Payments and Funding"
section_id: "01-payments-and-funding"
slug: "transfer--recurring-transfers"
endpoints:
  - "/transfer/recurring/create"
  - "/transfer/recurring/cancel"
  - "/transfer/recurring/get"
  - "/transfer/recurring/list"
  - "RECURRING_CANCELLED"
  - "RECURRING_NEW_TRANSFER"
  - "RECURRING_TRANSFER_SKIPPED"
  - "Webhooks"
  - "webhook_type"
  - "webhook_code"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Recurring transfers

> **Source:** [https://plaid.com/docs/api/products/transfer/recurring-transfers/](https://plaid.com/docs/api/products/transfer/recurring-transfers/)
> **Section:** Payments and Funding

## Endpoints & Webhooks on this page

- `/transfer/recurring/create`
- `/transfer/recurring/cancel`
- `/transfer/recurring/get`
- `/transfer/recurring/list`
- `RECURRING_CANCELLED`
- `RECURRING_NEW_TRANSFER`
- `RECURRING_TRANSFER_SKIPPED`
- `Webhooks`
- `webhook_type`
- `webhook_code`

---

# Recurring transfers

#### API reference for recurring transfer endpoints and webhooks

For how-to guidance, see the [recurring transfers documentation](/docs/transfer/recurring-transfers/).

| Recurring Transfer endpoints |  |
| --- | --- |
| [`/transfer/recurring/create`](/docs/api/products/transfer/recurring-transfers/#transferrecurringcreate) | Create a recurring transfer |
| [`/transfer/recurring/cancel`](/docs/api/products/transfer/recurring-transfers/#transferrecurringcancel) | Cancel a recurring transfer |
| [`/transfer/recurring/get`](/docs/api/products/transfer/recurring-transfers/#transferrecurringget) | Retrieve information about a recurring transfer |
| [`/transfer/recurring/list`](/docs/api/products/transfer/recurring-transfers/#transferrecurringlist) | Retrieve a list of recurring transfers |

| Webhooks |  |
| --- | --- |
| [`RECURRING_CANCELLED`](/docs/api/products/transfer/recurring-transfers/#recurring_cancelled) | A recurring transfer has been cancelled by Plaid |
| [`RECURRING_NEW_TRANSFER`](/docs/api/products/transfer/recurring-transfers/#recurring_new_transfer) | A new transfer of a recurring transfer has been originated |
| [`RECURRING_TRANSFER_SKIPPED`](/docs/api/products/transfer/recurring-transfers/#recurring_transfer_skipped) | An instance of a scheduled recurring transfer could not be created |

[### Endpoints](/docs/api/products/transfer/recurring-transfers/#endpoints)=\*=\*=\*=[#### `/transfer/recurring/create`](/docs/api/products/transfer/recurring-transfers/#transferrecurringcreate)

[#### Create a recurring transfer](/docs/api/products/transfer/recurring-transfers/#create-a-recurring-transfer)

Use the [`/transfer/recurring/create`](/docs/api/products/transfer/recurring-transfers/#transferrecurringcreate) endpoint to initiate a new recurring transfer. This capability is not currently supported for Transfer UI or Transfer for Platforms (beta) customers.

/transfer/recurring/create

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The Plaid `access_token` for the account that will be debited or credited.

A random key provided by the client, per unique recurring transfer. Maximum of 50 characters.

The API supports idempotency for safely retrying requests without accidentally performing the same operation twice. For example, if a request to create a recurring fails due to a network connection error, you can retry the request with the same idempotency key to guarantee that only a single recurring transfer is created.

Max length: `50`

The Plaid `account_id` corresponding to the end-user account that will be debited or credited.

The type of transfer. This will be either `debit` or `credit`. A `debit` indicates a transfer of money into the origination account; a `credit` indicates a transfer of money out of the origination account.

Possible values: `debit`, `credit`

Networks eligible for recurring transfers.

Possible values: `ach`, `same-day-ach`, `rtp`

Specifies the use case of the transfer. Required for transfers on an ACH network. For more details, see [ACH SEC codes](https://plaid.com/docs/transfer/creating-transfers/#ach-sec-codes).

Codes supported for credits: `ccd`, `ppd`
Codes supported for debits: `ccd`, `ppd`, `tel`, `web`

`"ccd"` - Corporate Credit or Debit - fund transfer between two corporate bank accounts

`"ppd"` - Prearranged Payment or Deposit - The transfer is part of a pre-existing relationship with a consumer. Authorization was obtained in writing either in person or via an electronic document signing, e.g. Docusign, by the consumer. Can be used for credits or debits.

`"web"` - Internet-Initiated Entry. The transfer debits a consumer's bank account. Authorization from the consumer is obtained over the Internet (e.g. a web or mobile application). Can be used for single debits or recurring debits.

`"tel"` - Telephone-Initiated Entry. The transfer debits a consumer. Debit authorization has been received orally over the telephone via a recorded call.

Possible values: `ccd`, `ppd`, `tel`, `web`

The amount of the transfer (decimal string with two digits of precision e.g. "10.00"). When calling `/transfer/authorization/create`, specify the maximum amount to authorize. When calling `/transfer/create`, specify the exact amount of the transfer, up to a maximum of the amount authorized. If this field is left blank when calling `/transfer/create`, the maximum amount authorized in the `authorization_id` will be sent.

If the end user is initiating the specific transfer themselves via an interactive UI, this should be `true`; for automatic recurring payments where the end user is not actually initiating each individual transfer, it should be `false`.

The description of the recurring transfer.

Plaid's unique identifier for a test clock. This field may only be used when using the `sandbox` environment. If provided, the created `recurring_transfer` is associated with the `test_clock`. New originations are automatically generated when the associated `test_clock` advances. For more details, see [Simulating recurring transfers](https://plaid.com/docs/transfer/sandbox/#simulating-recurring-transfers).

The schedule that the recurring transfer will be executed on.

Hide object

The unit of the recurring interval.

Possible values: `week`, `month`

Min length: `1`

The number of recurring `interval_units` between originations. The recurring interval (before holiday adjustment) is calculated by multiplying `interval_unit` and `interval_count`.
For example, to schedule a recurring transfer which originates once every two weeks, set `interval_unit` = `week` and `interval_count` = 2.

The day of the interval on which to schedule the transfer.

If the `interval_unit` is `week`, `interval_execution_day` should be an integer from 1 (Monday) to 5 (Friday).

If the `interval_unit` is `month`, `interval_execution_day` should be an integer indicating which day of the month to make the transfer on. Integers from 1 to 28 can be used to make a transfer on that day of the month. Negative integers from -1 to -5 can be used to make a transfer relative to the end of the month. To make a transfer on the last day of the month, use -1; to make the transfer on the second-to-last day, use -2, and so on.

The transfer will be originated on the next available banking day if the designated day is a non banking day.

A date in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD). The recurring transfer will begin on the first `interval_execution_day` on or after the `start_date`.

For `rtp` recurring transfers, `start_date` must be in the future.
Otherwise, if the first `interval_execution_day` on or after the start date is also the same day that `/transfer/recurring/create` was called, the bank *may* make the first payment on that day, but it is not guaranteed to do so.

Format: `date`

A date in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD). The recurring transfer will end on the last `interval_execution_day` on or before the `end_date`.
If the `interval_execution_day` between the start date and the end date (inclusive) is also the same day that `/transfer/recurring/create` was called, the bank *may* make a payment on that day, but it is not guaranteed to do so.

Format: `date`

The legal name and other information for the account holder.

Hide object

The user's legal name.

The user's phone number. Phone number input may be validated against valid number ranges; number strings that do not match a real-world phone numbering scheme may cause the request to fail, even in the Sandbox test environment.

The user's email address.

The address associated with the account holder.

Hide object

The street number and name (i.e., "100 Market St.").

Ex. "San Francisco"

The state or province (e.g., "CA").

The postal code (e.g., "94103").

A two-letter country code (e.g., "US").

Information about the device being used to initiate the authorization.

Hide object

The IP address of the device being used to initiate the authorization.

The user agent of the device being used to initiate the authorization.

/transfer/recurring/create

Nodeâ¼

```
const request: TransferRecurringCreateRequest = {
  access_token: 'access-sandbox-71e02f71-0960-4a27-abd2-5631e04f2175',
  account_id: '3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr',
  type: 'credit',
  network: 'ach',
  amount: '12.34',
  ach_class: 'ppd',
  description: 'payment',
  idempotency_key: '12345',
  schedule: {
    start_date: '2022-10-01',
    end_date: '2023-10-01',
    interval_unit: 'week',
    interval_count: 1,
    interval_execution_day: 5
  },
  user: {
    legal_name: 'Anne Charleston',
  },
};

try {
  const response = await client.transferRecurringCreate(request);
  const recurringTransferId = response.data.recurring_transfer.recurring_transfer_id;
} catch (error) {
  // handle error
}
```

/transfer/recurring/create

**Response fields**

Collapse all

Represents a recurring transfer within the Transfers API.

Hide object

Plaid's unique identifier for a recurring transfer.

The datetime when this transfer was created. This will be of the form `2006-01-02T15:04:05Z`

Format: `date-time`

A date in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

The next transfer origination date after bank holiday adjustment.

Format: `date`

Plaid's unique identifier for a test clock.

The type of transfer. This will be either `debit` or `credit`. A `debit` indicates a transfer of money into the origination account; a `credit` indicates a transfer of money out of the origination account.

Possible values: `debit`, `credit`

The amount of the transfer (decimal string with two digits of precision e.g. "10.00"). When calling `/transfer/authorization/create`, specify the maximum amount to authorize. When calling `/transfer/create`, specify the exact amount of the transfer, up to a maximum of the amount authorized. If this field is left blank when calling `/transfer/create`, the maximum amount authorized in the `authorization_id` will be sent.

The status of the recurring transfer.

`active`: The recurring transfer is currently active.
`cancelled`: The recurring transfer was cancelled by the client or Plaid.
`expired`: The recurring transfer has completed all originations according to its recurring schedule.

Possible values: `active`, `cancelled`, `expired`

Specifies the use case of the transfer. Required for transfers on an ACH network. For more details, see [ACH SEC codes](https://plaid.com/docs/transfer/creating-transfers/#ach-sec-codes).

Codes supported for credits: `ccd`, `ppd`
Codes supported for debits: `ccd`, `ppd`, `tel`, `web`

`"ccd"` - Corporate Credit or Debit - fund transfer between two corporate bank accounts

`"ppd"` - Prearranged Payment or Deposit - The transfer is part of a pre-existing relationship with a consumer. Authorization was obtained in writing either in person or via an electronic document signing, e.g. Docusign, by the consumer. Can be used for credits or debits.

`"web"` - Internet-Initiated Entry. The transfer debits a consumer's bank account. Authorization from the consumer is obtained over the Internet (e.g. a web or mobile application). Can be used for single debits or recurring debits.

`"tel"` - Telephone-Initiated Entry. The transfer debits a consumer. Debit authorization has been received orally over the telephone via a recorded call.

Possible values: `ccd`, `ppd`, `tel`, `web`

Networks eligible for recurring transfers.

Possible values: `ach`, `same-day-ach`, `rtp`

The Plaid `account_id` corresponding to the end-user account that will be debited or credited.

The id of the funding account to use, available in the Plaid Dashboard. This determines which of your business checking accounts will be credited or debited.

The currency of the transfer amount, e.g. "USD"

The description of the recurring transfer.

The created transfer instances associated with this `recurring_transfer_id`. If the recurring transfer has been newly created, this array will be empty.

The legal name and other information for the account holder.

Hide object

The user's legal name.

The user's phone number.

The user's email address.

The address associated with the account holder.

Hide object

The street number and name (i.e., "100 Market St.").

Ex. "San Francisco"

The state or province (e.g., "CA").

The postal code (e.g., "94103").

A two-letter country code (e.g., "US").

The schedule that the recurring transfer will be executed on.

Hide object

The unit of the recurring interval.

Possible values: `week`, `month`

Min length: `1`

The number of recurring `interval_units` between originations. The recurring interval (before holiday adjustment) is calculated by multiplying `interval_unit` and `interval_count`.
For example, to schedule a recurring transfer which originates once every two weeks, set `interval_unit` = `week` and `interval_count` = 2.

The day of the interval on which to schedule the transfer.

If the `interval_unit` is `week`, `interval_execution_day` should be an integer from 1 (Monday) to 5 (Friday).

If the `interval_unit` is `month`, `interval_execution_day` should be an integer indicating which day of the month to make the transfer on. Integers from 1 to 28 can be used to make a transfer on that day of the month. Negative integers from -1 to -5 can be used to make a transfer relative to the end of the month. To make a transfer on the last day of the month, use -1; to make the transfer on the second-to-last day, use -2, and so on.

The transfer will be originated on the next available banking day if the designated day is a non banking day.

A date in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD). The recurring transfer will begin on the first `interval_execution_day` on or after the `start_date`.

For `rtp` recurring transfers, `start_date` must be in the future.
Otherwise, if the first `interval_execution_day` on or after the start date is also the same day that `/transfer/recurring/create` was called, the bank *may* make the first payment on that day, but it is not guaranteed to do so.

Format: `date`

A date in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD). The recurring transfer will end on the last `interval_execution_day` on or before the `end_date`.
If the `interval_execution_day` between the start date and the end date (inclusive) is also the same day that `/transfer/recurring/create` was called, the bank *may* make a payment on that day, but it is not guaranteed to do so.

Format: `date`

A decision regarding the proposed transfer.

`approved` - The proposed transfer has received the end user's consent and has been approved for processing by Plaid. The `decision_rationale` field is set if Plaid was unable to fetch the account information. You may proceed with the transfer, but further review is recommended. Refer to the `code` field in the `decision_rationale` object for details.

`declined` - Plaid reviewed the proposed transfer and declined processing. Refer to the `code` field in the `decision_rationale` object for details.

`user_action_required` - An action is required before Plaid can assess the transfer risk and make a decision. The most common scenario is to update authentication for an Item. To complete the required action, initialize Link by setting `transfer.authorization_id` in the request of `/link/token/create`. After Link flow is completed, you may re-attempt the authorization request.

For `guarantee` requests, `approved` indicates the transfer is eligible for Plaid's guarantee, and `declined` indicates Plaid will not provide guarantee coverage for the transfer. `user_action_required` indicates you should follow the above guidance before re-attempting.

Possible values: `approved`, `declined`, `user_action_required`

The rationale for Plaid's decision regarding a proposed transfer. It is always set for `declined` decisions, and may or may not be null for `approved` decisions.

Hide object

A code representing the rationale for approving or declining the proposed transfer.

If the `rationale_code` is `null`, the transfer passed the authorization check.

Any non-`null` value for an `approved` transfer indicates that the authorization check could not be run and that you should perform your own risk assessment on the transfer. The code will indicate why the check could not be run. Possible values for an `approved` transfer are:

`MANUALLY_VERIFIED_ITEM` - Item created via a manual entry flow (i.e. Same-Day Micro-deposit, Instant Micro-deposit, or database-based verification), limited information available.

`ITEM_LOGIN_REQUIRED` - Unable to collect the account information due to Item staleness. Can be resolved by using Link and setting [`transfer.authorization_id`](https://plaid.com/docs/api/link/#link-token-create-request-transfer-authorization-id) in the request to `/link/token/create`.

`PAYMENT_PROFILE_LOGIN_REQUIRED` - The Payment Profile associated with the call to `/transfer/authorization/create` is in a state that requires the end user to re-authenticate. Can be resolved by using Link to refresh the Payment Profile.

`MIGRATED_ACCOUNT_ITEM` - Item created via `/transfer/migrate_account` endpoint, limited information available.

`ERROR` - Unable to collect the account information due to an unspecified error.

The following codes indicate that the authorization decision was `declined`:

`NSF` - Transaction likely to result in a return due to insufficient funds.

`RISK` - Transaction is high-risk.

`TRANSFER_LIMIT_REACHED` - One or several transfer limits are reached, e.g. monthly transfer limit. Check the accompanying `description` field to understand which limit has been reached.

Possible values: `NSF`, `RISK`, `TRANSFER_LIMIT_REACHED`, `MANUALLY_VERIFIED_ITEM`, `ITEM_LOGIN_REQUIRED`, `PAYMENT_PROFILE_LOGIN_REQUIRED`, `ERROR`, `MIGRATED_ACCOUNT_ITEM`, `null`

A human-readable description of the code associated with a transfer approval or transfer decline.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "recurring_transfer": {
    "recurring_transfer_id": "460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9",
    "created": "2022-07-05T12:48:37Z",
    "next_origination_date": "2022-10-28",
    "test_clock_id": "b33a6eda-5e97-5d64-244a-a9274110151c",
    "status": "active",
    "amount": "12.34",
    "description": "payment",
    "type": "debit",
    "ach_class": "ppd",
    "network": "ach",
    "origination_account_id": "",
    "account_id": "3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr",
    "funding_account_id": "8945fedc-e703-463d-86b1-dc0607b55460",
    "iso_currency_code": "USD",
    "transfer_ids": [],
    "user": {
      "legal_name": "Anne Charleston",
      "phone_number": "510-555-0128",
      "email_address": "acharleston@email.com",
      "address": {
        "street": "123 Main St.",
        "city": "San Francisco",
        "region": "CA",
        "postal_code": "94053",
        "country": "US"
      }
    },
    "schedule": {
      "start_date": "2022-10-01",
      "end_date": "2023-10-01",
      "interval_unit": "week",
      "interval_count": 1,
      "interval_execution_day": 5
    }
  },
  "decision": "approved",
  "decision_rationale": null,
  "request_id": "saKrIBuEB9qJZno"
}
```

=\*=\*=\*=[#### `/transfer/recurring/cancel`](/docs/api/products/transfer/recurring-transfers/#transferrecurringcancel)

[#### Cancel a recurring transfer.](/docs/api/products/transfer/recurring-transfers/#cancel-a-recurring-transfer.)

Use the [`/transfer/recurring/cancel`](/docs/api/products/transfer/recurring-transfers/#transferrecurringcancel) endpoint to cancel a recurring transfer. A scheduled transfer that hasn't been submitted to the bank will be cancelled.

/transfer/recurring/cancel

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Plaid's unique identifier for a recurring transfer.

/transfer/recurring/cancel

Nodeâ¼

```
const request: TransferRecurringCancelRequest = {
  recurring_transfer_id: '460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9',
};

try {
  const response = await client.transferRecurringCancel(request);
} catch (error) {
  // handle error
}
```

/transfer/recurring/cancel

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "saKrIBuEB9qJZno"
}
```

=\*=\*=\*=[#### `/transfer/recurring/get`](/docs/api/products/transfer/recurring-transfers/#transferrecurringget)

[#### Retrieve a recurring transfer](/docs/api/products/transfer/recurring-transfers/#retrieve-a-recurring-transfer)

The [`/transfer/recurring/get`](/docs/api/products/transfer/recurring-transfers/#transferrecurringget) fetches information about the recurring transfer corresponding to the given `recurring_transfer_id`.

/transfer/recurring/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Plaid's unique identifier for a recurring transfer.

/transfer/recurring/get

Nodeâ¼

```
const request: TransferRecurringGetRequest = {
  recurring_transfer_id: '460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9',
};

try {
  const response = await client.transferRecurringGet(request);
  const recurringTransferId =
    response.data.recurring_transfer.recurring_transfer_id;
} catch (error) {
  // handle error
}
```

/transfer/recurring/get

**Response fields**

Collapse all

Represents a recurring transfer within the Transfers API.

Hide object

Plaid's unique identifier for a recurring transfer.

The datetime when this transfer was created. This will be of the form `2006-01-02T15:04:05Z`

Format: `date-time`

A date in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

The next transfer origination date after bank holiday adjustment.

Format: `date`

Plaid's unique identifier for a test clock.

The type of transfer. This will be either `debit` or `credit`. A `debit` indicates a transfer of money into the origination account; a `credit` indicates a transfer of money out of the origination account.

Possible values: `debit`, `credit`

The amount of the transfer (decimal string with two digits of precision e.g. "10.00"). When calling `/transfer/authorization/create`, specify the maximum amount to authorize. When calling `/transfer/create`, specify the exact amount of the transfer, up to a maximum of the amount authorized. If this field is left blank when calling `/transfer/create`, the maximum amount authorized in the `authorization_id` will be sent.

The status of the recurring transfer.

`active`: The recurring transfer is currently active.
`cancelled`: The recurring transfer was cancelled by the client or Plaid.
`expired`: The recurring transfer has completed all originations according to its recurring schedule.

Possible values: `active`, `cancelled`, `expired`

Specifies the use case of the transfer. Required for transfers on an ACH network. For more details, see [ACH SEC codes](https://plaid.com/docs/transfer/creating-transfers/#ach-sec-codes).

Codes supported for credits: `ccd`, `ppd`
Codes supported for debits: `ccd`, `ppd`, `tel`, `web`

`"ccd"` - Corporate Credit or Debit - fund transfer between two corporate bank accounts

`"ppd"` - Prearranged Payment or Deposit - The transfer is part of a pre-existing relationship with a consumer. Authorization was obtained in writing either in person or via an electronic document signing, e.g. Docusign, by the consumer. Can be used for credits or debits.

`"web"` - Internet-Initiated Entry. The transfer debits a consumer's bank account. Authorization from the consumer is obtained over the Internet (e.g. a web or mobile application). Can be used for single debits or recurring debits.

`"tel"` - Telephone-Initiated Entry. The transfer debits a consumer. Debit authorization has been received orally over the telephone via a recorded call.

Possible values: `ccd`, `ppd`, `tel`, `web`

Networks eligible for recurring transfers.

Possible values: `ach`, `same-day-ach`, `rtp`

The Plaid `account_id` corresponding to the end-user account that will be debited or credited.

The id of the funding account to use, available in the Plaid Dashboard. This determines which of your business checking accounts will be credited or debited.

The currency of the transfer amount, e.g. "USD"

The description of the recurring transfer.

The created transfer instances associated with this `recurring_transfer_id`. If the recurring transfer has been newly created, this array will be empty.

The legal name and other information for the account holder.

Hide object

The user's legal name.

The user's phone number.

The user's email address.

The address associated with the account holder.

Hide object

The street number and name (i.e., "100 Market St.").

Ex. "San Francisco"

The state or province (e.g., "CA").

The postal code (e.g., "94103").

A two-letter country code (e.g., "US").

The schedule that the recurring transfer will be executed on.

Hide object

The unit of the recurring interval.

Possible values: `week`, `month`

Min length: `1`

The number of recurring `interval_units` between originations. The recurring interval (before holiday adjustment) is calculated by multiplying `interval_unit` and `interval_count`.
For example, to schedule a recurring transfer which originates once every two weeks, set `interval_unit` = `week` and `interval_count` = 2.

The day of the interval on which to schedule the transfer.

If the `interval_unit` is `week`, `interval_execution_day` should be an integer from 1 (Monday) to 5 (Friday).

If the `interval_unit` is `month`, `interval_execution_day` should be an integer indicating which day of the month to make the transfer on. Integers from 1 to 28 can be used to make a transfer on that day of the month. Negative integers from -1 to -5 can be used to make a transfer relative to the end of the month. To make a transfer on the last day of the month, use -1; to make the transfer on the second-to-last day, use -2, and so on.

The transfer will be originated on the next available banking day if the designated day is a non banking day.

A date in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD). The recurring transfer will begin on the first `interval_execution_day` on or after the `start_date`.

For `rtp` recurring transfers, `start_date` must be in the future.
Otherwise, if the first `interval_execution_day` on or after the start date is also the same day that `/transfer/recurring/create` was called, the bank *may* make the first payment on that day, but it is not guaranteed to do so.

Format: `date`

A date in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD). The recurring transfer will end on the last `interval_execution_day` on or before the `end_date`.
If the `interval_execution_day` between the start date and the end date (inclusive) is also the same day that `/transfer/recurring/create` was called, the bank *may* make a payment on that day, but it is not guaranteed to do so.

Format: `date`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "recurring_transfer": {
    "recurring_transfer_id": "460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9",
    "created": "2022-07-05T12:48:37Z",
    "next_origination_date": "2022-10-28",
    "test_clock_id": null,
    "status": "active",
    "amount": "12.34",
    "description": "payment",
    "type": "debit",
    "ach_class": "ppd",
    "network": "ach",
    "origination_account_id": "",
    "account_id": "3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr",
    "funding_account_id": "8945fedc-e703-463d-86b1-dc0607b55460",
    "iso_currency_code": "USD",
    "transfer_ids": [
      "271ef220-dbf8-caeb-a7dc-a2b3e8a80963",
      "c8dbaf75-2abb-e2dc-4171-12448e13b848"
    ],
    "user": {
      "legal_name": "Anne Charleston",
      "phone_number": "510-555-0128",
      "email_address": "acharleston@email.com",
      "address": {
        "street": "123 Main St.",
        "city": "San Francisco",
        "region": "CA",
        "postal_code": "94053",
        "country": "US"
      }
    },
    "schedule": {
      "start_date": "2022-10-01",
      "end_date": "2023-10-01",
      "interval_unit": "week",
      "interval_count": 1,
      "interval_execution_day": 5
    }
  },
  "request_id": "saKrIBuEB9qJZno"
}
```

=\*=\*=\*=[#### `/transfer/recurring/list`](/docs/api/products/transfer/recurring-transfers/#transferrecurringlist)

[#### List recurring transfers](/docs/api/products/transfer/recurring-transfers/#list-recurring-transfers)

Use the [`/transfer/recurring/list`](/docs/api/products/transfer/recurring-transfers/#transferrecurringlist) endpoint to see a list of all your recurring transfers and their statuses. Results are paginated; use the `count` and `offset` query parameters to retrieve the desired recurring transfers.

/transfer/recurring/list

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The start `created` datetime of recurring transfers to list. This should be in RFC 3339 format (i.e. `2019-12-06T22:35:49Z`)

Format: `date-time`

The end `created` datetime of recurring transfers to list. This should be in RFC 3339 format (i.e. `2019-12-06T22:35:49Z`)

Format: `date-time`

The maximum number of recurring transfers to return.

Minimum: `1`

Maximum: `25`

Default: `25`

The number of recurring transfers to skip before returning results.

Default: `0`

Minimum: `0`

Filter recurring transfers to only those with the specified `funding_account_id`.

/transfer/recurring/list

Nodeâ¼

```
const request: TransferRecurringListRequest = {
  start_time: '2022-09-29T20:35:49Z',
  end_time: '2022-10-29T20:35:49Z',
  count: 1,
};

try {
  const response = await client.transferRecurringList(request);
} catch (error) {
  // handle error
}
```

/transfer/recurring/list

**Response fields**

Collapse all

Hide object

Plaid's unique identifier for a recurring transfer.

The datetime when this transfer was created. This will be of the form `2006-01-02T15:04:05Z`

Format: `date-time`

A date in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD).

The next transfer origination date after bank holiday adjustment.

Format: `date`

Plaid's unique identifier for a test clock.

The type of transfer. This will be either `debit` or `credit`. A `debit` indicates a transfer of money into the origination account; a `credit` indicates a transfer of money out of the origination account.

Possible values: `debit`, `credit`

The amount of the transfer (decimal string with two digits of precision e.g. "10.00"). When calling `/transfer/authorization/create`, specify the maximum amount to authorize. When calling `/transfer/create`, specify the exact amount of the transfer, up to a maximum of the amount authorized. If this field is left blank when calling `/transfer/create`, the maximum amount authorized in the `authorization_id` will be sent.

The status of the recurring transfer.

`active`: The recurring transfer is currently active.
`cancelled`: The recurring transfer was cancelled by the client or Plaid.
`expired`: The recurring transfer has completed all originations according to its recurring schedule.

Possible values: `active`, `cancelled`, `expired`

Specifies the use case of the transfer. Required for transfers on an ACH network. For more details, see [ACH SEC codes](https://plaid.com/docs/transfer/creating-transfers/#ach-sec-codes).

Codes supported for credits: `ccd`, `ppd`
Codes supported for debits: `ccd`, `ppd`, `tel`, `web`

`"ccd"` - Corporate Credit or Debit - fund transfer between two corporate bank accounts

`"ppd"` - Prearranged Payment or Deposit - The transfer is part of a pre-existing relationship with a consumer. Authorization was obtained in writing either in person or via an electronic document signing, e.g. Docusign, by the consumer. Can be used for credits or debits.

`"web"` - Internet-Initiated Entry. The transfer debits a consumer's bank account. Authorization from the consumer is obtained over the Internet (e.g. a web or mobile application). Can be used for single debits or recurring debits.

`"tel"` - Telephone-Initiated Entry. The transfer debits a consumer. Debit authorization has been received orally over the telephone via a recorded call.

Possible values: `ccd`, `ppd`, `tel`, `web`

Networks eligible for recurring transfers.

Possible values: `ach`, `same-day-ach`, `rtp`

The Plaid `account_id` corresponding to the end-user account that will be debited or credited.

The id of the funding account to use, available in the Plaid Dashboard. This determines which of your business checking accounts will be credited or debited.

The currency of the transfer amount, e.g. "USD"

The description of the recurring transfer.

The created transfer instances associated with this `recurring_transfer_id`. If the recurring transfer has been newly created, this array will be empty.

The legal name and other information for the account holder.

Hide object

The user's legal name.

The user's phone number.

The user's email address.

The address associated with the account holder.

Hide object

The street number and name (i.e., "100 Market St.").

Ex. "San Francisco"

The state or province (e.g., "CA").

The postal code (e.g., "94103").

A two-letter country code (e.g., "US").

The schedule that the recurring transfer will be executed on.

Hide object

The unit of the recurring interval.

Possible values: `week`, `month`

Min length: `1`

The number of recurring `interval_units` between originations. The recurring interval (before holiday adjustment) is calculated by multiplying `interval_unit` and `interval_count`.
For example, to schedule a recurring transfer which originates once every two weeks, set `interval_unit` = `week` and `interval_count` = 2.

The day of the interval on which to schedule the transfer.

If the `interval_unit` is `week`, `interval_execution_day` should be an integer from 1 (Monday) to 5 (Friday).

If the `interval_unit` is `month`, `interval_execution_day` should be an integer indicating which day of the month to make the transfer on. Integers from 1 to 28 can be used to make a transfer on that day of the month. Negative integers from -1 to -5 can be used to make a transfer relative to the end of the month. To make a transfer on the last day of the month, use -1; to make the transfer on the second-to-last day, use -2, and so on.

The transfer will be originated on the next available banking day if the designated day is a non banking day.

A date in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD). The recurring transfer will begin on the first `interval_execution_day` on or after the `start_date`.

For `rtp` recurring transfers, `start_date` must be in the future.
Otherwise, if the first `interval_execution_day` on or after the start date is also the same day that `/transfer/recurring/create` was called, the bank *may* make the first payment on that day, but it is not guaranteed to do so.

Format: `date`

A date in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD). The recurring transfer will end on the last `interval_execution_day` on or before the `end_date`.
If the `interval_execution_day` between the start date and the end date (inclusive) is also the same day that `/transfer/recurring/create` was called, the bank *may* make a payment on that day, but it is not guaranteed to do so.

Format: `date`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "recurring_transfers": [
    {
      "recurring_transfer_id": "460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9",
      "created": "2022-07-05T12:48:37Z",
      "next_origination_date": "2022-10-28",
      "test_clock_id": null,
      "status": "active",
      "amount": "12.34",
      "description": "payment",
      "type": "debit",
      "ach_class": "ppd",
      "network": "ach",
      "origination_account_id": "",
      "account_id": "3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr",
      "funding_account_id": "8945fedc-e703-463d-86b1-dc0607b55460",
      "iso_currency_code": "USD",
      "transfer_ids": [
        "4242fc8d-3ec6-fb38-fa0c-a8e37d03cd57"
      ],
      "user": {
        "legal_name": "Anne Charleston",
        "phone_number": "510-555-0128",
        "email_address": "acharleston@email.com",
        "address": {
          "street": "123 Main St.",
          "city": "San Francisco",
          "region": "CA",
          "postal_code": "94053",
          "country": "US"
        }
      },
      "schedule": {
        "start_date": "2022-10-01",
        "end_date": "2023-10-01",
        "interval_unit": "week",
        "interval_count": 1,
        "interval_execution_day": 5
      }
    }
  ],
  "request_id": "saKrIBuEB9qJZno"
}
```

[### Webhooks](/docs/api/products/transfer/recurring-transfers/#webhooks)=\*=\*=\*=[#### `RECURRING_NEW_TRANSFER`](/docs/api/products/transfer/recurring-transfers/#recurring_new_transfer)

Fired when a new transfer of a recurring transfer is originated.

**Properties**

`TRANSFER`

`RECURRING_NEW_TRANSFER`

Plaid's unique identifier for a recurring transfer.

Plaid's unique identifier for a transfer.

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "TRANSFER",
  "webhook_code": "RECURRING_NEW_TRANSFER",
  "recurring_transfer_id": "460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9",
  "transfer_id": "271ef220-dbf8-caeb-a7dc-a2b3e8a80963",
  "environment": "production"
}
```

=\*=\*=\*=[#### `RECURRING_TRANSFER_SKIPPED`](/docs/api/products/transfer/recurring-transfers/#recurring_transfer_skipped)

Fired when Plaid is unable to originate a new ACH transaction of the recurring transfer on the planned date.

**Properties**

`TRANSFER`

`RECURRING_TRANSFER_SKIPPED`

Plaid's unique identifier for a recurring transfer.

A decision regarding the proposed transfer.

`approved` - The proposed transfer has received the end user's consent and has been approved for processing by Plaid. The `decision_rationale` field is set if Plaid was unable to fetch the account information. You may proceed with the transfer, but further review is recommended. Refer to the `code` field in the `decision_rationale` object for details.

`declined` - Plaid reviewed the proposed transfer and declined processing. Refer to the `code` field in the `decision_rationale` object for details.

`user_action_required` - An action is required before Plaid can assess the transfer risk and make a decision. The most common scenario is to update authentication for an Item. To complete the required action, initialize Link by setting `transfer.authorization_id` in the request of `/link/token/create`. After Link flow is completed, you may re-attempt the authorization request.

For `guarantee` requests, `approved` indicates the transfer is eligible for Plaid's guarantee, and `declined` indicates Plaid will not provide guarantee coverage for the transfer. `user_action_required` indicates you should follow the above guidance before re-attempting.

Possible values: `approved`, `declined`, `user_action_required`

A code representing the rationale for approving or declining the proposed transfer.

If the `rationale_code` is `null`, the transfer passed the authorization check.

Any non-`null` value for an `approved` transfer indicates that the authorization check could not be run and that you should perform your own risk assessment on the transfer. The code will indicate why the check could not be run. Possible values for an `approved` transfer are:

`MANUALLY_VERIFIED_ITEM` - Item created via a manual entry flow (i.e. Same-Day Micro-deposit, Instant Micro-deposit, or database-based verification), limited information available.

`ITEM_LOGIN_REQUIRED` - Unable to collect the account information due to Item staleness. Can be resolved by using Link and setting [`transfer.authorization_id`](https://plaid.com/docs/api/link/#link-token-create-request-transfer-authorization-id) in the request to `/link/token/create`.

`PAYMENT_PROFILE_LOGIN_REQUIRED` - The Payment Profile associated with the call to `/transfer/authorization/create` is in a state that requires the end user to re-authenticate. Can be resolved by using Link to refresh the Payment Profile.

`MIGRATED_ACCOUNT_ITEM` - Item created via `/transfer/migrate_account` endpoint, limited information available.

`ERROR` - Unable to collect the account information due to an unspecified error.

The following codes indicate that the authorization decision was `declined`:

`NSF` - Transaction likely to result in a return due to insufficient funds.

`RISK` - Transaction is high-risk.

`TRANSFER_LIMIT_REACHED` - One or several transfer limits are reached, e.g. monthly transfer limit. Check the accompanying `description` field to understand which limit has been reached.

Possible values: `NSF`, `RISK`, `TRANSFER_LIMIT_REACHED`, `MANUALLY_VERIFIED_ITEM`, `ITEM_LOGIN_REQUIRED`, `PAYMENT_PROFILE_LOGIN_REQUIRED`, `ERROR`, `MIGRATED_ACCOUNT_ITEM`, `null`

The planned date on which Plaid is unable to originate a new ACH transaction of the recurring transfer. This will be of the form YYYY-MM-DD.

Format: `date`

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "TRANSFER",
  "webhook_code": "RECURRING_TRANSFER_SKIPPED",
  "recurring_transfer_id": "460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9",
  "authorization_decision": "declined",
  "authorization_decision_rationale_code": "NSF",
  "skipped_origination_date": "2022-11-30",
  "environment": "production"
}
```

=\*=\*=\*=[#### `RECURRING_CANCELLED`](/docs/api/products/transfer/recurring-transfers/#recurring_cancelled)

Fired when a recurring transfer is cancelled by Plaid.

**Properties**

`TRANSFER`

`RECURRING_CANCELLED`

Plaid's unique identifier for a recurring transfer.

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "TRANSFER",
  "webhook_code": "RECURRING_CANCELLED",
  "recurring_transfer_id": "460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9",
  "environment": "production"
}
```
