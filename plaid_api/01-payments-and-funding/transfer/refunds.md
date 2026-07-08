---
title: "Transfer / Refunds"
source_url: "https://plaid.com/docs/api/products/transfer/refunds/"
section: "Payments and Funding"
section_id: "01-payments-and-funding"
slug: "transfer--refunds"
endpoints:
  - "/transfer/refund/create"
  - "/transfer/refund/cancel"
  - "/transfer/refund/get"
  - "/item/remove"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Transfer refunds

> **Source:** [https://plaid.com/docs/api/products/transfer/refunds/](https://plaid.com/docs/api/products/transfer/refunds/)
> **Section:** Payments and Funding

## Endpoints & Webhooks on this page

- `/transfer/refund/create`
- `/transfer/refund/cancel`
- `/transfer/refund/get`
- `/item/remove`

---

# Transfer refunds

#### API reference for refunding transfers

For how-to guidance, see the [transfer refunds documentation](/docs/transfer/refunds/).

| Refunds |  |
| --- | --- |
| [`/transfer/refund/create`](/docs/api/products/transfer/refunds/#transferrefundcreate) | Create a refund for a transfer |
| [`/transfer/refund/cancel`](/docs/api/products/transfer/refunds/#transferrefundcancel) | Cancel a refund |
| [`/transfer/refund/get`](/docs/api/products/transfer/refunds/#transferrefundget) | Retrieve information about a refund |

=\*=\*=\*=[#### `/transfer/refund/create`](/docs/api/products/transfer/refunds/#transferrefundcreate)

[#### Create a refund](/docs/api/products/transfer/refunds/#create-a-refund)

Use the [`/transfer/refund/create`](/docs/api/products/transfer/refunds/#transferrefundcreate) endpoint to create a refund for a transfer. A transfer can be refunded if the transfer was initiated in the past 180 days.

Refunds come out of the available balance of the ledger used for the original debit transfer. If there are not enough funds in the available balance to cover the refund amount, the refund will be rejected. You can create a refund at any time. Plaid does not impose any hold time on refunds.

A refund can still be issued even if the Item's `access_token` is no longer valid (e.g. if the user revoked OAuth consent or the Item was deleted via [`/item/remove`](/docs/api/items/#itemremove)), as long as the account and routing number pair used to make the original transaction is still valid. A refund cannot be issued if the Item has an [invalidated TAN](https://plaid.com/docs/auth/#tokenized-account-numbers), which can occur at Chase or PNC.

/transfer/refund/create

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The ID of the transfer to refund.

The amount of the refund (decimal string with two digits of precision e.g. "10.00").

A random key provided by the client, per unique refund. Maximum of 50 characters.

The API supports idempotency for safely retrying requests without accidentally performing the same operation twice. For example, if a request to create a refund fails due to a network connection error, you can retry the request with the same idempotency key to guarantee that only a single refund is created.

Max length: `50`

/transfer/refund/create

Nodeâ¼

```
const request: TransferRefundCreateRequest = {
  transfer_id: '460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9',
  amount: '12.34',
  idempotency_key: 'VEK2ea3X6LKywsc8J6pg',
};

try {
  const response = await client.transferRefundCreate(request);
} catch (error) {
  // handle error
}
```

/transfer/refund/create

**Response fields**

Collapse all

Represents a refund within the Transfers API.

Hide object

Plaid's unique identifier for a refund.

The ID of the transfer to refund.

The amount of the refund (decimal string with two digits of precision e.g. "10.00").

The status of the refund.

`pending`: A new refund was created; it is in the pending state.
`posted`: The refund has been successfully submitted to the payment network.
`settled`: Credits have been refunded to the Plaid linked account.
`cancelled`: The refund was cancelled by the client.
`failed`: The refund has failed.
`returned`: The refund was returned.

Possible values: `pending`, `posted`, `cancelled`, `failed`, `settled`, `returned`

The failure reason if the status for a refund is `"failed"` or `"returned"`. Null value otherwise.

Hide object

The failure code, e.g. `R01`. A failure code will be provided if and only if the refund status is `returned`. See [ACH return codes](https://plaid.com/docs/errors/transfer/#ach-return-codes) for a full listing of ACH return codes and [RTP/RfP error codes](https://plaid.com/docs/errors/transfer/#rtprfp-error-codes) for RTP error codes.

The ACH return code, e.g. `R01`. A return code will be provided if and only if the refund status is `returned`. For a full listing of ACH return codes, see [Transfer errors](https://plaid.com/docs/errors/transfer/#ach-return-codes). This field is deprecated in favor of the more versatile `failure_code`, which encompasses non-ACH failure codes as well.

A human-readable description of the reason for the failure or reversal.

Plaid's unique identifier for a Plaid Ledger Balance.

The datetime when this refund was created. This will be of the form `2006-01-02T15:04:05Z`

Format: `date-time`

The trace identifier for the transfer based on its network. This will only be set after the transfer has posted.

For `ach` or `same-day-ach` transfers, this is the ACH trace number.
For `rtp` transfers, this is the Transaction Identification number.
For `wire` transfers, this is the IMAD (Input Message Accountability Data) number.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "refund": {
    "id": "667af684-9ee1-4f5f-862a-633ec4c545cc",
    "transfer_id": "460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9",
    "amount": "12.34",
    "status": "pending",
    "created": "2020-08-06T17:27:15Z",
    "failure_reason": null,
    "network_trace_id": null
  },
  "request_id": "saKrIBuEB9qJZno"
}
```

=\*=\*=\*=[#### `/transfer/refund/cancel`](/docs/api/products/transfer/refunds/#transferrefundcancel)

[#### Cancel a refund](/docs/api/products/transfer/refunds/#cancel-a-refund)

Use the [`/transfer/refund/cancel`](/docs/api/products/transfer/refunds/#transferrefundcancel) endpoint to cancel a refund. A refund is eligible for cancellation if it has not yet been submitted to the payment network.

/transfer/refund/cancel

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Plaid's unique identifier for a refund.

/transfer/refund/cancel

Nodeâ¼

```
const request: TransferRefundCancelRequest = {
  refund_id: '460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9',
};

try {
  const response = await client.transferRefundCancel(request);
} catch (error) {
  // handle error
}
```

/transfer/refund/cancel

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "saKrIBuEB9qJZno"
}
```

=\*=\*=\*=[#### `/transfer/refund/get`](/docs/api/products/transfer/refunds/#transferrefundget)

[#### Retrieve a refund](/docs/api/products/transfer/refunds/#retrieve-a-refund)

The [`/transfer/refund/get`](/docs/api/products/transfer/refunds/#transferrefundget) endpoint fetches information about the refund corresponding to the given `refund_id`.

/transfer/refund/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Plaid's unique identifier for a refund.

/transfer/refund/get

Nodeâ¼

```
const request: TransferRefundGetRequest = {
  refund_id: '460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9',
};

try {
  const response = await client.transferRefundGet(request);
} catch (error) {
  // handle error
}
```

/transfer/refund/get

**Response fields**

Collapse all

Represents a refund within the Transfers API.

Hide object

Plaid's unique identifier for a refund.

The ID of the transfer to refund.

The amount of the refund (decimal string with two digits of precision e.g. "10.00").

The status of the refund.

`pending`: A new refund was created; it is in the pending state.
`posted`: The refund has been successfully submitted to the payment network.
`settled`: Credits have been refunded to the Plaid linked account.
`cancelled`: The refund was cancelled by the client.
`failed`: The refund has failed.
`returned`: The refund was returned.

Possible values: `pending`, `posted`, `cancelled`, `failed`, `settled`, `returned`

The failure reason if the status for a refund is `"failed"` or `"returned"`. Null value otherwise.

Hide object

The failure code, e.g. `R01`. A failure code will be provided if and only if the refund status is `returned`. See [ACH return codes](https://plaid.com/docs/errors/transfer/#ach-return-codes) for a full listing of ACH return codes and [RTP/RfP error codes](https://plaid.com/docs/errors/transfer/#rtprfp-error-codes) for RTP error codes.

The ACH return code, e.g. `R01`. A return code will be provided if and only if the refund status is `returned`. For a full listing of ACH return codes, see [Transfer errors](https://plaid.com/docs/errors/transfer/#ach-return-codes). This field is deprecated in favor of the more versatile `failure_code`, which encompasses non-ACH failure codes as well.

A human-readable description of the reason for the failure or reversal.

Plaid's unique identifier for a Plaid Ledger Balance.

The datetime when this refund was created. This will be of the form `2006-01-02T15:04:05Z`

Format: `date-time`

The trace identifier for the transfer based on its network. This will only be set after the transfer has posted.

For `ach` or `same-day-ach` transfers, this is the ACH trace number.
For `rtp` transfers, this is the Transaction Identification number.
For `wire` transfers, this is the IMAD (Input Message Accountability Data) number.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "refund": {
    "id": "667af684-9ee1-4f5f-862a-633ec4c545cc",
    "transfer_id": "460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9",
    "amount": "12.34",
    "status": "pending",
    "created": "2020-08-06T17:27:15Z",
    "failure_reason": null,
    "network_trace_id": null
  },
  "request_id": "saKrIBuEB9qJZno"
}
```
