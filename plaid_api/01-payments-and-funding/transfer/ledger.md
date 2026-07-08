---
title: "Transfer / Ledger"
source_url: "https://plaid.com/docs/api/products/transfer/ledger/"
section: "Payments and Funding"
section_id: "01-payments-and-funding"
slug: "transfer--ledger"
endpoints:
  - "/transfer/ledger/deposit"
  - "/transfer/ledger/distribute"
  - "/transfer/ledger/get"
  - "/transfer/ledger/withdraw"
  - "/transfer/ledger/event/list"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Plaid Ledger

> **Source:** [https://plaid.com/docs/api/products/transfer/ledger/](https://plaid.com/docs/api/products/transfer/ledger/)
> **Section:** Payments and Funding

## Endpoints & Webhooks on this page

- `/transfer/ledger/deposit`
- `/transfer/ledger/distribute`
- `/transfer/ledger/get`
- `/transfer/ledger/withdraw`
- `/transfer/ledger/event/list`

---

# Plaid Ledger

#### API reference for Plaid Ledger

For how-to guidance, see the [Ledger documentation](/docs/transfer/flow-of-funds/).

| Plaid Ledger |  |
| --- | --- |
| [`/transfer/ledger/deposit`](/docs/api/products/transfer/ledger/#transferledgerdeposit) | Deposit funds into a ledger balance held with Plaid |
| [`/transfer/ledger/distribute`](/docs/api/products/transfer/ledger/#transferledgerdistribute) | Move available balance between platform and its originator |
| [`/transfer/ledger/get`](/docs/api/products/transfer/ledger/#transferledgerget) | Retrieve information about the ledger balance held with Plaid |
| [`/transfer/ledger/withdraw`](/docs/api/products/transfer/ledger/#transferledgerwithdraw) | Withdraw funds from a ledger balance held with Plaid |
| [`/transfer/ledger/event/list`](/docs/api/products/transfer/ledger/#transferledgereventlist) | Retrieve a list of ledger balance events |

=\*=\*=\*=[#### `/transfer/ledger/deposit`](/docs/api/products/transfer/ledger/#transferledgerdeposit)

[#### Deposit funds into a Plaid Ledger balance](/docs/api/products/transfer/ledger/#deposit-funds-into-a-plaid-ledger-balance)

Use the [`/transfer/ledger/deposit`](/docs/api/products/transfer/ledger/#transferledgerdeposit) endpoint to deposit funds into Plaid Ledger.

/transfer/ledger/deposit

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Client ID of the customer that owns the Ledger balance. This is so Plaid knows which of your customers to pay out to or collect funds from. Only applicable for [Platform customers](https://plaid.com/docs/transfer/application/#originators-vs-platforms). Do not include if you're paying out to yourself.

Specify which funding account to use. Customers can find a list of `funding_account_id`s in the Accounts page of the Plaid Dashboard, under the "Account ID" column. If this field is left blank, the funding account associated with the specified Ledger will be used. If an `originator_client_id` is specified, the `funding_account_id` must belong to the specified originator.

Specify which ledger balance to deposit to. Customers can find a list of `ledger_id`s in the Accounts page of your Plaid Dashboard. If this field is left blank, this will default to the id of the default ledger balance.

A positive amount of how much will be deposited into ledger (decimal string with two digits of precision e.g. "5.50").

The description of the deposit that will be passed to the receiving bank (up to 10 characters). Note that banks utilize this field differently, and may or may not show it on the bank statement.

Max length: `10`

A unique key provided by the client, per unique ledger deposit. Maximum of 50 characters.

The API supports idempotency for safely retrying the request without accidentally performing the same operation twice. For example, if a request to create a ledger deposit fails due to a network connection error, you can retry the request with the same idempotency key to guarantee that only a single deposit is created.

Max length: `50`

The ACH networks used for the funds flow.

For requests submitted as either `ach` or `same-day-ach` the cutoff for Same Day ACH is 3:00 PM Eastern Time and the cutoff for Standard ACH transfers is 8:30 PM Eastern Time. It is recommended to submit a request at least 15 minutes before the cutoff time in order to ensure that it will be processed before the cutoff. Any request that is indicated as `same-day-ach` and that misses the Same Day ACH cutoff, but is submitted in time for the Standard ACH cutoff, will be sent over Standard ACH rails and will not incur same-day charges.

Possible values: `ach`, `same-day-ach`

/transfer/ledger/deposit

Nodeâ¼

```
const request: TransferLedgerDepositRequest = {
  amount: '12.34',
  network: 'ach',
  idempotency_key: 'test_deposit_abc',
  description: 'deposit',
};
try {
  const response = await client.transferLedgerDeposit(request);
  const sweep = response.data.sweep;
} catch (error) {
  // handle error
}
```

/transfer/ledger/deposit

**Response fields**

Collapse all

Describes a sweep of funds to / from the sweep account.

A sweep is associated with many sweep events (events of type `swept` or `return_swept`) which can be retrieved by invoking the `/transfer/event/list` endpoint with the corresponding `sweep_id`.

`swept` events occur when the transfer amount is credited or debited from your sweep account, depending on the `type` of the transfer. `return_swept` events occur when a transfer is returned and Plaid undoes the credit or debit.

The total sum of the `swept` and `return_swept` events is equal to the `amount` of the sweep Plaid creates and matches the amount of the entry on your sweep account ledger.

Hide object

Identifier of the sweep.

The id of the funding account to use, available in the Plaid Dashboard. This determines which of your business checking accounts will be credited or debited.

Plaid's unique identifier for a Plaid Ledger Balance.

The datetime when the sweep occurred, in RFC 3339 format.

Format: `date-time`

Signed decimal amount of the sweep as it appears on your sweep account ledger (e.g. "-10.00")

If amount is not present, the sweep was net-settled to zero and outstanding debits and credits between the sweep account and Plaid are balanced.

The currency of the sweep, e.g. "USD".

The date when the sweep settled, in the YYYY-MM-DD format.

Format: `date`

The expected date when funds from a ledger deposit will be made available and can be withdrawn from the associated ledger balance. Only applies to deposits. This will be of the form YYYY-MM-DD.

Format: `date`

The status of a sweep transfer

`"pending"` - The sweep is currently pending
`"posted"` - The sweep has been posted
`"settled"` - The sweep has settled. This is the terminal state of a successful credit sweep.
`"returned"` - The sweep has been returned. This is the terminal state of a returned sweep. Returns of a sweep are extremely rare, since sweeps are money movement between your own bank account and your own Ledger.
`"funds_available"` - Funds from the sweep have been released from hold and applied to the ledger's available balance. (Only applicable to deposits.) This is the terminal state of a successful deposit sweep.
`"failed"` - The sweep has failed. This is the terminal state of a failed sweep.

Possible values: `pending`, `posted`, `settled`, `funds_available`, `returned`, `failed`, `null`

The trigger of the sweep

`"manual"` - The sweep is created manually by the customer
`"incoming"` - The sweep is created by incoming funds flow (e.g. Incoming Wire)
`"balance_threshold"` - The sweep is created by balance threshold setting
`"automatic_aggregate"` - The sweep is created by the Plaid automatic aggregation process. These funds did not pass through the Plaid Ledger balance.

Possible values: `manual`, `incoming`, `balance_threshold`, `automatic_aggregate`

The description of the deposit that will be passed to the receiving bank (up to 10 characters). Note that banks utilize this field differently, and may or may not show it on the bank statement.

The trace identifier for the transfer based on its network. This will only be set after the transfer has posted.

For `ach` or `same-day-ach` transfers, this is the ACH trace number.
For `rtp` transfers, this is the Transaction Identification number.
For `wire` transfers, this is the IMAD (Input Message Accountability Data) number.

The failure reason if the status for a sweep is `"failed"` or `"returned"`. Null value otherwise.

Hide object

The failure code, e.g. `R01`. A failure code will be provided if and only if the sweep status is `returned`. See [ACH return codes](https://plaid.com/docs/errors/transfer/#ach-return-codes) for a full listing of ACH return codes and [RTP/RfP error codes](https://plaid.com/docs/errors/transfer/#rtprfp-error-codes) for RTP error codes.

A human-readable description of the reason for the failure or reversal.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "sweep": {
    "id": "8c2fda9a-aa2f-4735-a00f-f4e0d2d2faee",
    "funding_account_id": "8945fedc-e703-463d-86b1-dc0607b55460",
    "ledger_id": "563db5f8-4c95-4e17-8c3e-cb988fb9cf1a",
    "created": "2020-08-06T17:27:15Z",
    "amount": "-12.34",
    "iso_currency_code": "USD",
    "settled": null,
    "status": "pending",
    "trigger": "manual",
    "description": "deposit",
    "network_trace_id": null
  },
  "request_id": "saKrIBuEB9qJZno"
}
```

=\*=\*=\*=[#### `/transfer/ledger/distribute`](/docs/api/products/transfer/ledger/#transferledgerdistribute)

[#### Move available balance between ledgers](/docs/api/products/transfer/ledger/#move-available-balance-between-ledgers)

Use the [`/transfer/ledger/distribute`](/docs/api/products/transfer/ledger/#transferledgerdistribute) endpoint to move available balance between ledgers, if you have multiple. If you're a platform, you can move funds between one of your ledgers and one of your customer's ledgers.

/transfer/ledger/distribute

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The Ledger to pull money from.

The Ledger to credit money to.

The amount to move (decimal string with two digits of precision e.g. "10.00"). Amount must be positive.

A unique key provided by the client, per unique ledger distribute. Maximum of 50 characters.

The API supports idempotency for safely retrying the request without accidentally performing the same operation twice. For example, if a request to create a ledger distribute fails due to a network connection error, you can retry the request with the same idempotency key to guarantee that only a single distribute is created.

Max length: `50`

An optional description for the ledger distribute operation.

/transfer/ledger/distribute

Nodeâ¼

```
const request: TransferLedgerDistributeRequest = {
   from_ledger_id: 'ec07bbf3-a3d4-4ada-8be0-7be9a6f9bcd0',
   to_ledger_id: '0b13ddd5-fa46-432f-8e5d-7e8ea6f8c8b1',
   amount: '12.34',
   idempotency_key: 'test_distribute_abc',
   description: 'distribute',
};
try {
  const response = await client.transferLedgerDistribute(request);
} catch (error) {
  // handle error
}
```

/transfer/ledger/distribute

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "saKrIBuEB9qJZno"
}
```

=\*=\*=\*=[#### `/transfer/ledger/get`](/docs/api/products/transfer/ledger/#transferledgerget)

[#### Retrieve Plaid Ledger balance](/docs/api/products/transfer/ledger/#retrieve-plaid-ledger-balance)

Use the [`/transfer/ledger/get`](/docs/api/products/transfer/ledger/#transferledgerget) endpoint to view a balance on the ledger held with Plaid.

/transfer/ledger/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Specify which ledger balance to get. Customers can find a list of `ledger_id`s in the Accounts page of your Plaid Dashboard. If this field is left blank, this will default to the id of the default ledger balance.

Client ID of the end customer.

/transfer/ledger/get

Nodeâ¼

```
try {
  const response = await client.transferLedgerGet({});
  const available_balance = response.data.balance.available;
  const pending_balance = response.data.balance.pending;
} catch (error) {
  // handle error
}
```

/transfer/ledger/get

**Response fields**

Collapse all

The unique identifier of the Ledger that was returned.

Information about the balance of the ledger held with Plaid.

Hide object

The amount of this balance available for use (decimal string with two digits of precision e.g. "10.00").

The amount of pending funds that are in processing (decimal string with two digits of precision e.g. "10.00").

The name of the Ledger

Whether this Ledger is the client's default ledger.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "ledger_id": "563db5f8-4c95-4e17-8c3e-cb988fb9cf1a",
  "name": "Default",
  "is_default": true,
  "balance": {
    "available": "1721.70",
    "pending": "123.45"
  },
  "request_id": "saKrIBuEB9qJZno"
}
```

=\*=\*=\*=[#### `/transfer/ledger/withdraw`](/docs/api/products/transfer/ledger/#transferledgerwithdraw)

[#### Withdraw funds from a Plaid Ledger balance](/docs/api/products/transfer/ledger/#withdraw-funds-from-a-plaid-ledger-balance)

Use the [`/transfer/ledger/withdraw`](/docs/api/products/transfer/ledger/#transferledgerwithdraw) endpoint to withdraw funds from a Plaid Ledger balance.

/transfer/ledger/withdraw

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Client ID of the customer that owns the Ledger balance. This is so Plaid knows which of your customers to pay out to or collect funds from. Only applicable for [Platform customers](https://plaid.com/docs/transfer/application/#originators-vs-platforms). Do not include if you're paying out to yourself.

Specify which funding account to use. Customers can find a list of `funding_account_id`s in the Accounts page of the Plaid Dashboard, under the "Account ID" column. If this field is left blank, the funding account associated with the specified Ledger will be used. If an `originator_client_id` is specified, the `funding_account_id` must belong to the specified originator.

Specify which ledger balance to withdraw from. Customers can find a list of `ledger_id`s in the Accounts page of your Plaid Dashboard. If this field is left blank, this will default to the id of the default ledger balance.

A positive amount of how much will be withdrawn from the ledger balance (decimal string with two digits of precision e.g. "5.50").

The description of the deposit that will be passed to the receiving bank (up to 10 characters). Note that banks utilize this field differently, and may or may not show it on the bank statement.

Max length: `10`

A unique key provided by the client, per unique ledger withdraw. Maximum of 50 characters.

The API supports idempotency for safely retrying the request without accidentally performing the same operation twice. For example, if a request to create a ledger withdraw fails due to a network connection error, you can retry the request with the same idempotency key to guarantee that only a single withdraw is created.

Max length: `50`

The network or rails used for the transfer.

For transfers submitted as `ach` or `same-day-ach`, the Standard ACH cutoff is 8:30 PM Eastern Time.

For transfers submitted as `same-day-ach`, the Same Day ACH cutoff is 3:00 PM Eastern Time. It is recommended to send the request 15 minutes prior to the cutoff to ensure that it will be processed in time for submission before the cutoff. If the transfer is processed after this cutoff but before the Standard ACH cutoff, it will be sent over Standard ACH rails and will not incur same-day charges; this will apply to both legs of the transfer if applicable. The transaction limit for a Same Day ACH transfer is $1,000,000. Authorization requests sent with an amount greater than $1,000,000 will fail.

For transfers submitted as `rtp`, Plaid will automatically route between the Real-Time Payments (RTP) rail by TCH or FedNow rails as necessary. If a transfer is submitted as `rtp` and the counterparty account is not eligible for RTP, the `/transfer/authorization/create` request will fail with an `INVALID_FIELD` error code. To pre-check to determine whether a counterparty account can support RTP, call `/transfer/capabilities/get` before calling `/transfer/authorization/create`.

Wire transfers are currently in early availability. To request access to `wire` as a payment network, contact your account manager. For transfers submitted as `wire`, the `type` must be `credit`; wire debits are not supported. The cutoff to submit a wire payment is 6:30 PM Eastern Time on a business day; wires submitted after that time will be processed on the next business day. The transaction limit for a wire is $999,999.99. Authorization requests sent with an amount greater than $999,999.99 will fail.

Support for `rfp` (request for payment) is currently in closed beta. To learn more, contact your Plaid account manager. For transfers submitted as `rfp`, the `type` must be `debit`.

Possible values: `ach`, `same-day-ach`, `rtp`, `wire`, `rfp`

/transfer/ledger/withdraw

Nodeâ¼

```
const request: TransferLedgerWithdrawRequest = {
  amount: '12.34',
  network: 'ach',
  idempotency_key: 'test_withdraw_abc',
  description: 'withdraw',
};
try {
  const response = await client.transferLedgerWithdraw(request);
  const sweep = response.data.sweep;
} catch (error) {
  // handle error
}
```

/transfer/ledger/withdraw

**Response fields**

Collapse all

Describes a sweep of funds to / from the sweep account.

A sweep is associated with many sweep events (events of type `swept` or `return_swept`) which can be retrieved by invoking the `/transfer/event/list` endpoint with the corresponding `sweep_id`.

`swept` events occur when the transfer amount is credited or debited from your sweep account, depending on the `type` of the transfer. `return_swept` events occur when a transfer is returned and Plaid undoes the credit or debit.

The total sum of the `swept` and `return_swept` events is equal to the `amount` of the sweep Plaid creates and matches the amount of the entry on your sweep account ledger.

Hide object

Identifier of the sweep.

The id of the funding account to use, available in the Plaid Dashboard. This determines which of your business checking accounts will be credited or debited.

Plaid's unique identifier for a Plaid Ledger Balance.

The datetime when the sweep occurred, in RFC 3339 format.

Format: `date-time`

Signed decimal amount of the sweep as it appears on your sweep account ledger (e.g. "-10.00")

If amount is not present, the sweep was net-settled to zero and outstanding debits and credits between the sweep account and Plaid are balanced.

The currency of the sweep, e.g. "USD".

The date when the sweep settled, in the YYYY-MM-DD format.

Format: `date`

The expected date when funds from a ledger deposit will be made available and can be withdrawn from the associated ledger balance. Only applies to deposits. This will be of the form YYYY-MM-DD.

Format: `date`

The status of a sweep transfer

`"pending"` - The sweep is currently pending
`"posted"` - The sweep has been posted
`"settled"` - The sweep has settled. This is the terminal state of a successful credit sweep.
`"returned"` - The sweep has been returned. This is the terminal state of a returned sweep. Returns of a sweep are extremely rare, since sweeps are money movement between your own bank account and your own Ledger.
`"funds_available"` - Funds from the sweep have been released from hold and applied to the ledger's available balance. (Only applicable to deposits.) This is the terminal state of a successful deposit sweep.
`"failed"` - The sweep has failed. This is the terminal state of a failed sweep.

Possible values: `pending`, `posted`, `settled`, `funds_available`, `returned`, `failed`, `null`

The trigger of the sweep

`"manual"` - The sweep is created manually by the customer
`"incoming"` - The sweep is created by incoming funds flow (e.g. Incoming Wire)
`"balance_threshold"` - The sweep is created by balance threshold setting
`"automatic_aggregate"` - The sweep is created by the Plaid automatic aggregation process. These funds did not pass through the Plaid Ledger balance.

Possible values: `manual`, `incoming`, `balance_threshold`, `automatic_aggregate`

The description of the deposit that will be passed to the receiving bank (up to 10 characters). Note that banks utilize this field differently, and may or may not show it on the bank statement.

The trace identifier for the transfer based on its network. This will only be set after the transfer has posted.

For `ach` or `same-day-ach` transfers, this is the ACH trace number.
For `rtp` transfers, this is the Transaction Identification number.
For `wire` transfers, this is the IMAD (Input Message Accountability Data) number.

The failure reason if the status for a sweep is `"failed"` or `"returned"`. Null value otherwise.

Hide object

The failure code, e.g. `R01`. A failure code will be provided if and only if the sweep status is `returned`. See [ACH return codes](https://plaid.com/docs/errors/transfer/#ach-return-codes) for a full listing of ACH return codes and [RTP/RfP error codes](https://plaid.com/docs/errors/transfer/#rtprfp-error-codes) for RTP error codes.

A human-readable description of the reason for the failure or reversal.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "sweep": {
    "id": "8c2fda9a-aa2f-4735-a00f-f4e0d2d2faee",
    "funding_account_id": "8945fedc-e703-463d-86b1-dc0607b55460",
    "ledger_id": "563db5f8-4c95-4e17-8c3e-cb988fb9cf1a",
    "created": "2020-08-06T17:27:15Z",
    "amount": "12.34",
    "iso_currency_code": "USD",
    "settled": null,
    "status": "pending",
    "trigger": "manual",
    "description": "withdraw",
    "network_trace_id": null
  },
  "request_id": "saKrIBuEB9qJZno"
}
```

=\*=\*=\*=[#### `/transfer/ledger/event/list`](/docs/api/products/transfer/ledger/#transferledgereventlist)

[#### List transfer ledger events](/docs/api/products/transfer/ledger/#list-transfer-ledger-events)

Use the [`/transfer/ledger/event/list`](/docs/api/products/transfer/ledger/#transferledgereventlist) endpoint to get a list of ledger events for a specific ledger based on specified filter criteria.

/transfer/ledger/event/list

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Filter transfer events to only those with the specified originator client. (This field is specifically for resellers. Caller's client ID will be used if this field is not specified.)

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The start created datetime of transfers to list. This should be in RFC 3339 format (i.e. 2019-12-06T22:35:49Z)

Format: `date-time`

The end created datetime of transfers to list. This should be in RFC 3339 format (i.e. 2019-12-06T22:35:49Z)

Format: `date-time`

Plaid's unique identifier for a Plaid Ledger Balance.

Plaid's unique identifier for the ledger event.

Source of the ledger event.

`"TRANSFER"` - The source of the ledger event is a transfer
`"SWEEP"` - The source of the ledger event is a sweep
`"REFUND"` - The source of the ledger event is a refund

Possible values: `TRANSFER`, `SWEEP`, `REFUND`

Plaid's unique identifier for a transfer, sweep, or refund.

The maximum number of transfer events to return. If the number of events matching the above parameters is greater than `count`, the most recent events will be returned.

Default: `25`

Maximum: `25`

Minimum: `1`

The offset into the list of transfer events. When `count`=25 and `offset`=0, the first 25 events will be returned. When `count`=25 and `offset`=25, the next 25 events will be returned.

Default: `0`

Minimum: `0`

/transfer/ledger/event/list

Nodeâ¼

```
const request: TransferLedgerEventListRequest = {
    originator_client_id: "8945fedc-e703-463d-86b1-dc0607b55460",
    start_date: '2019-12-06T22:35:49Z',
    end_date: '2019-12-12T22:35:49Z',
    count: 14,
    offset: 2,
    ledger_id: "563db5f8-4c95-4e17-8c3e-cb988fb9cf1a",
    ledger_event_id: "3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr",
    source_type: "TRANSFER",
    source_id: "460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9",
 };
try {
  const response = await plaidClient.transferLedgerEventList(request);
  const events = response.data.ledger_events;
  for (const event of events) {
    // iterate through events
  }
} catch (error) {
  // handle error
}
```

/transfer/ledger/event/list

**Response fields**

Collapse all

Hide object

Plaid's unique identifier for this ledger event.

The ID of the ledger this event belongs to.

The amount of the ledger event as a decimal string.

The ID of the transfer source that triggered this ledger event.

The ID of the refund source that triggered this ledger event.

The ID of the sweep source that triggered this ledger event.

A description of the ledger event.

The new pending balance after this event.

The new available balance after this event.

The type of balance that was impacted by this event.

The datetime when this ledger event occurred.

Format: `date-time`

Whether there are more events to be pulled from the endpoint that have not already been returned

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "ledger_events": [
    {
      "ledger_event_id": "3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr",
      "ledger_id": "563db5f8-4c95-4e17-8c3e-cb988fb9cf1a",
      "amount": "100.00",
      "type": "deposit",
      "transfer_id": "460cbe92-2dcc-8eae",
      "description": "Converted to available",
      "pending_balance": "100.00",
      "available_balance": "100.00",
      "timestamp": "2023-12-01T10:00:00Z"
    }
  ],
  "has_more": false,
  "request_id": "mdqfuVxeoza6mhu"
}
```
