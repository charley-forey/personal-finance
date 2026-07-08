---
title: "Transfer / Reading Transfers"
source_url: "https://plaid.com/docs/api/products/transfer/reading-transfers/"
section: "Payments and Funding"
section_id: "01-payments-and-funding"
slug: "transfer--reading-transfers"
endpoints:
  - "/transfer/get"
  - "/transfer/list"
  - "/transfer/event/list"
  - "/transfer/event/sync"
  - "/transfer/sweep/get"
  - "/transfer/sweep/list"
  - "TRANSFER_EVENTS_UPDATE"
  - "Webhooks"
  - "webhook_type"
  - "webhook_code"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Reading Transfers and Transfer events

> **Source:** [https://plaid.com/docs/api/products/transfer/reading-transfers/](https://plaid.com/docs/api/products/transfer/reading-transfers/)
> **Section:** Payments and Funding

## Endpoints & Webhooks on this page

- `/transfer/get`
- `/transfer/list`
- `/transfer/event/list`
- `/transfer/event/sync`
- `/transfer/sweep/get`
- `/transfer/sweep/list`
- `TRANSFER_EVENTS_UPDATE`
- `Webhooks`
- `webhook_type`
- `webhook_code`

---

# Reading Transfers and Transfer events

#### API reference for Transfer read and Transfer event endpoints and webhooks

For how-to guidance, see the [Transfer events documentation](/docs/transfer/reconciling-transfers/).

| Reading Transfers |  |
| --- | --- |
| [`/transfer/get`](/docs/api/products/transfer/reading-transfers/#transferget) | Retrieve information about a transfer |
| [`/transfer/list`](/docs/api/products/transfer/reading-transfers/#transferlist) | Retrieve a list of transfers and their statuses |
| [`/transfer/event/list`](/docs/api/products/transfer/reading-transfers/#transfereventlist) | Retrieve a list of transfer events |
| [`/transfer/event/sync`](/docs/api/products/transfer/reading-transfers/#transfereventsync) | Sync transfer events |
| [`/transfer/sweep/get`](/docs/api/products/transfer/reading-transfers/#transfersweepget) | Retrieve information about a sweep |
| [`/transfer/sweep/list`](/docs/api/products/transfer/reading-transfers/#transfersweeplist) | Retrieve a list of sweeps |

| Webhooks |  |
| --- | --- |
| [`TRANSFER_EVENTS_UPDATE`](/docs/api/products/transfer/reading-transfers/#transfer_events_update) | New transfer events available |

[### Endpoints](/docs/api/products/transfer/reading-transfers/#endpoints)=\*=\*=\*=[#### `/transfer/get`](/docs/api/products/transfer/reading-transfers/#transferget)

[#### Retrieve a transfer](/docs/api/products/transfer/reading-transfers/#retrieve-a-transfer)

The [`/transfer/get`](/docs/api/products/transfer/reading-transfers/#transferget) endpoint fetches information about the transfer corresponding to the given `transfer_id` or `authorization_id`. One of `transfer_id` or `authorization_id` must be populated but not both.

/transfer/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Plaid's unique identifier for a transfer.

Plaid's unique identifier for a transfer authorization.

/transfer/get

Nodeâ¼

```
const request: TransferGetRequest = {
  transfer_id: '460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9',
};
try {
  const response = await plaidClient.transferGet(request);
  const transfer = response.data.transfer;
} catch (error) {
  // handle error
}
```

/transfer/get

**Response fields**

Collapse all

Represents a transfer within the Transfers API.

Hide object

Plaid's unique identifier for a transfer.

Plaid's unique identifier for a transfer authorization.

Specifies the use case of the transfer. Required for transfers on an ACH network. For more details, see [ACH SEC codes](https://plaid.com/docs/transfer/creating-transfers/#ach-sec-codes).

Codes supported for credits: `ccd`, `ppd`
Codes supported for debits: `ccd`, `ppd`, `tel`, `web`

`"ccd"` - Corporate Credit or Debit - fund transfer between two corporate bank accounts

`"ppd"` - Prearranged Payment or Deposit - The transfer is part of a pre-existing relationship with a consumer. Authorization was obtained in writing either in person or via an electronic document signing, e.g. Docusign, by the consumer. Can be used for credits or debits.

`"web"` - Internet-Initiated Entry. The transfer debits a consumer's bank account. Authorization from the consumer is obtained over the Internet (e.g. a web or mobile application). Can be used for single debits or recurring debits.

`"tel"` - Telephone-Initiated Entry. The transfer debits a consumer. Debit authorization has been received orally over the telephone via a recorded call.

Possible values: `ccd`, `ppd`, `tel`, `web`

The Plaid `account_id` corresponding to the end-user account that will be debited or credited.

The id of the associated funding account, available in the Plaid Dashboard. If present, this indicates which of your business checking accounts will be credited or debited.

Plaid's unique identifier for a Plaid Ledger Balance.

The type of transfer. This will be either `debit` or `credit`. A `debit` indicates a transfer of money into the origination account; a `credit` indicates a transfer of money out of the origination account.

Possible values: `debit`, `credit`

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

The amount of the transfer (decimal string with two digits of precision e.g. "10.00"). When calling `/transfer/authorization/create`, specify the maximum amount to authorize. When calling `/transfer/create`, specify the exact amount of the transfer, up to a maximum of the amount authorized. If this field is left blank when calling `/transfer/create`, the maximum amount authorized in the `authorization_id` will be sent.

The description of the transfer.

The datetime when this transfer was created. This will be of the form `2006-01-02T15:04:05Z`

Format: `date-time`

The status of the transfer.

`pending`: A new transfer was created; it is in the pending state.
`posted`: The transfer has been successfully submitted to the payment network.
`settled`: The transfer was successfully completed by the payment network. Note that funds from received debits are not available to be moved out of the Ledger until the transfer reaches `funds_available` status. For credit transactions, `settled` means the funds have been delivered to the receiving bank account. This is the terminal state of a successful credit transfer.
`funds_available`: Funds from the transfer have been released from hold and applied to the ledger's available balance. (Only applicable to ACH debits.) This is the terminal state of a successful debit transfer.
`cancelled`: The transfer was cancelled by the client. This is the terminal state of a cancelled transfer.
`failed`: The transfer failed, no funds were moved. This is the terminal state of a failed transfer.
`returned`: A posted transfer was returned. This is the terminal state of a returned transfer.

Possible values: `pending`, `posted`, `settled`, `funds_available`, `cancelled`, `failed`, `returned`

The status of the sweep for the transfer.

`unswept`: The transfer hasn't been swept yet.
`swept`: The transfer was swept to the sweep account.
`swept_settled`: Credits are available to be withdrawn or debits have been deducted from the customer's business checking account.
`return_swept`: The transfer was returned, funds were pulled back or pushed back to the sweep account.
`null`: The transfer will never be swept (e.g. if the transfer is cancelled or returned before being swept)

Possible values: `null`, `unswept`, `swept`, `swept_settled`, `return_swept`

The network or rails used for the transfer.

For transfers submitted as `ach` or `same-day-ach`, the Standard ACH cutoff is 8:30 PM Eastern Time.

For transfers submitted as `same-day-ach`, the Same Day ACH cutoff is 3:00 PM Eastern Time. It is recommended to send the request 15 minutes prior to the cutoff to ensure that it will be processed in time for submission before the cutoff. If the transfer is processed after this cutoff but before the Standard ACH cutoff, it will be sent over Standard ACH rails and will not incur same-day charges; this will apply to both legs of the transfer if applicable. The transaction limit for a Same Day ACH transfer is $1,000,000. Authorization requests sent with an amount greater than $1,000,000 will fail.

For transfers submitted as `rtp`, Plaid will automatically route between the Real-Time Payments (RTP) rail by TCH or FedNow rails as necessary. If a transfer is submitted as `rtp` and the counterparty account is not eligible for RTP, the `/transfer/authorization/create` request will fail with an `INVALID_FIELD` error code. To pre-check to determine whether a counterparty account can support RTP, call `/transfer/capabilities/get` before calling `/transfer/authorization/create`.

Wire transfers are currently in early availability. To request access to `wire` as a payment network, contact your account manager. For transfers submitted as `wire`, the `type` must be `credit`; wire debits are not supported. The cutoff to submit a wire payment is 6:30 PM Eastern Time on a business day; wires submitted after that time will be processed on the next business day. The transaction limit for a wire is $999,999.99. Authorization requests sent with an amount greater than $999,999.99 will fail.

Support for `rfp` (request for payment) is currently in closed beta. To learn more, contact your Plaid account manager. For transfers submitted as `rfp`, the `type` must be `debit`.

Possible values: `ach`, `same-day-ach`, `rtp`, `wire`, `rfp`

Information specific to wire transfers.

Hide object

Additional information from the wire originator to the beneficiary. Max 140 characters.

The fee amount deducted from the original transfer during a wire return, if applicable.

When `true`, you can still cancel this transfer.

The failure reason if the event type for a transfer is `"failed"` or `"returned"`. Null value otherwise.

Hide object

The failure code, e.g. `R01`. A failure code will be provided if and only if the transfer status is `returned`. See [ACH return codes](https://plaid.com/docs/errors/transfer/#ach-return-codes) for a full listing of ACH return codes and [RTP/RfP error codes](https://plaid.com/docs/errors/transfer/#rtprfp-error-codes) for RTP error codes.

The ACH return code, e.g. `R01`. A return code will be provided if and only if the transfer status is `returned`. For a full listing of ACH return codes, see [Transfer errors](https://plaid.com/docs/errors/transfer/#ach-return-codes).

A human-readable description of the reason for the failure or reversal.

The Metadata object is a mapping of client-provided string fields to any string value. The following limitations apply:
The JSON values must be Strings (no nested JSON objects allowed)
Only ASCII characters may be used
Maximum of 50 key/value pairs
Maximum key length of 40 characters
Maximum value length of 500 characters

Indicates whether the transfer is guaranteed by Plaid (Guarantee customers only). This field will contain either `GUARANTEED` or `NOT_GUARANTEED` indicating whether Plaid will guarantee the transfer.

Possible values: `GUARANTEED`, `NOT_GUARANTEED`, `null`

Adaptive guarantee details for a transfer, including the guaranteed amount and settlement schedule. Omitted when no guarantee was attempted.

Hide object

The amount currently covered by Plaid's guarantee (decimal string with two digits of precision e.g. "10.00"). This may change over time as scheduled tranches reach their observation window expiration and become guaranteed.

The adaptive guarantee settlement schedule for this transfer.

Hide object

The guaranteed amount for this schedule entry (decimal string with two digits of precision e.g. "10.00").

The number of business days in the observation window for this tranche. `0` when the tranche is not subject to an observation window.

The datetime when the observation window for this tranche expires. Present only when the tranche is subject to an observation window. This will be of the form `2006-01-02T15:04:05Z`.

Format: `date-time`

The currency of the transfer amount, e.g. "USD"

The date 3 business days from settlement date indicating the following ACH returns can no longer happen: R01, R02, R03, R29. This will be of the form YYYY-MM-DD.

Format: `date`

The date 61 business days from settlement date indicating the following ACH returns can no longer happen: R05, R07, R10, R11, R51, R33, R37, R38, R51, R52, R53. This will be of the form YYYY-MM-DD.

Format: `date`

Deprecated for Plaid Ledger clients, use `expected_funds_available_date` instead.

Format: `date`

The expected date when funds from a transfer will be made available and can be withdrawn from the associated ledger balance, assuming the debit does not return before this date. If the transfer does return before this date, this field will be null. Only applies to debit transfers. This will be of the form YYYY-MM-DD.

Format: `date`

The Plaid client ID that is the originator of this transfer. Only present if created on behalf of another client as a [Platform customer](https://plaid.com/docs/transfer/application/#originators-vs-platforms).

A list of refunds associated with this transfer.

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

The id of the recurring transfer if this transfer belongs to a recurring transfer.

The expected sweep settlement schedule of this transfer, assuming this transfer is not `returned`. Only applies to ACH debit transfers.

Hide object

The settlement date of a sweep for this transfer.

Format: `date`

The accumulated amount that has been swept by `sweep_settlement_date`.

This field is now deprecated. You may ignore it for transfers created on and after 12/01/2023.

Specifies the source of funds for the transfer. Only valid for `credit` transfers, and defaults to `sweep` if not specified. This field is not specified for `debit` transfers.

`sweep` - Sweep funds from your funding account
`prefunded_rtp_credits` - Use your prefunded RTP credit balance with Plaid
`prefunded_ach_credits` - Use your prefunded ACH credit balance with Plaid

Possible values: `sweep`, `prefunded_rtp_credits`, `prefunded_ach_credits`, `null`

The amount to deduct from `transfer.amount` and distribute to the platform's Ledger balance as a facilitator fee (decimal string with two digits of precision e.g. "10.00"). The remainder will go to the end-customer's Ledger balance. This must be value greater than 0 and less than or equal to the `transfer.amount`.

The trace identifier for the transfer based on its network. This will only be set after the transfer has posted.

For `ach` or `same-day-ach` transfers, this is the ACH trace number.
For `rtp` transfers, this is the Transaction Identification number.
For `wire` transfers, this is the IMAD (Input Message Accountability Data) number.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "transfer": {
    "account_id": "3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr",
    "funding_account_id": "8945fedc-e703-463d-86b1-dc0607b55460",
    "ledger_id": "563db5f8-4c95-4e17-8c3e-cb988fb9cf1a",
    "ach_class": "ppd",
    "amount": "12.34",
    "cancellable": true,
    "created": "2020-08-06T17:27:15Z",
    "description": "Desc",
    "guarantee_decision": null,
    "guarantee_decision_rationale": null,
    "failure_reason": {
      "failure_code": "R13",
      "description": "Invalid ACH routing number"
    },
    "id": "460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9",
    "authorization_id": "c9f90aa1-2949-c799-e2b6-ea05c89bb586",
    "metadata": {
      "key1": "value1",
      "key2": "value2"
    },
    "network": "ach",
    "origination_account_id": "",
    "originator_client_id": null,
    "refunds": [],
    "status": "pending",
    "type": "credit",
    "iso_currency_code": "USD",
    "standard_return_window": "2020-08-07",
    "unauthorized_return_window": "2020-10-07",
    "expected_settlement_date": "2020-08-04",
    "user": {
      "email_address": "acharleston@email.com",
      "legal_name": "Anne Charleston",
      "phone_number": "510-555-0128",
      "address": {
        "street": "123 Main St.",
        "city": "San Francisco",
        "region": "CA",
        "postal_code": "94053",
        "country": "US"
      }
    },
    "recurring_transfer_id": null,
    "credit_funds_source": "sweep",
    "facilitator_fee": "1.23",
    "network_trace_id": null
  },
  "request_id": "saKrIBuEB9qJZno"
}
```

=\*=\*=\*=[#### `/transfer/list`](/docs/api/products/transfer/reading-transfers/#transferlist)

[#### List transfers](/docs/api/products/transfer/reading-transfers/#list-transfers)

Use the [`/transfer/list`](/docs/api/products/transfer/reading-transfers/#transferlist) endpoint to see a list of all your transfers and their statuses. Results are paginated; use the `count` and `offset` query parameters to retrieve the desired transfers.

/transfer/list

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The start `created` datetime of transfers to list. This should be in RFC 3339 format (i.e. `2019-12-06T22:35:49Z`)

Format: `date-time`

The end `created` datetime of transfers to list. This should be in RFC 3339 format (i.e. `2019-12-06T22:35:49Z`)

Format: `date-time`

The maximum number of transfers to return.

Minimum: `1`

Maximum: `25`

Default: `25`

The number of transfers to skip before returning results.

Default: `0`

Minimum: `0`

Filter transfers to only those with the specified originator client.

Filter transfers to only those with the specified `funding_account_id`.

/transfer/list

Nodeâ¼

```
const request: TransferListRequest = {
  start_date: '2019-12-06T22:35:49Z',
  end_date: '2019-12-12T22:35:49Z',
  count: 14,
  offset: 2,
  funding_account_id: '8945fedc-e703-463d-86b1-dc0607b55460',
};
try {
  const response = await plaidClient.transferList(request);
  const transfers = response.data.transfers;
  for (const transfer of transfers) {
    // iterate through transfers
  }
} catch (error) {
  // handle error
}
```

/transfer/list

**Response fields**

Collapse all

Hide object

Plaid's unique identifier for a transfer.

Plaid's unique identifier for a transfer authorization.

Specifies the use case of the transfer. Required for transfers on an ACH network. For more details, see [ACH SEC codes](https://plaid.com/docs/transfer/creating-transfers/#ach-sec-codes).

Codes supported for credits: `ccd`, `ppd`
Codes supported for debits: `ccd`, `ppd`, `tel`, `web`

`"ccd"` - Corporate Credit or Debit - fund transfer between two corporate bank accounts

`"ppd"` - Prearranged Payment or Deposit - The transfer is part of a pre-existing relationship with a consumer. Authorization was obtained in writing either in person or via an electronic document signing, e.g. Docusign, by the consumer. Can be used for credits or debits.

`"web"` - Internet-Initiated Entry. The transfer debits a consumer's bank account. Authorization from the consumer is obtained over the Internet (e.g. a web or mobile application). Can be used for single debits or recurring debits.

`"tel"` - Telephone-Initiated Entry. The transfer debits a consumer. Debit authorization has been received orally over the telephone via a recorded call.

Possible values: `ccd`, `ppd`, `tel`, `web`

The Plaid `account_id` corresponding to the end-user account that will be debited or credited.

The id of the associated funding account, available in the Plaid Dashboard. If present, this indicates which of your business checking accounts will be credited or debited.

Plaid's unique identifier for a Plaid Ledger Balance.

The type of transfer. This will be either `debit` or `credit`. A `debit` indicates a transfer of money into the origination account; a `credit` indicates a transfer of money out of the origination account.

Possible values: `debit`, `credit`

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

The amount of the transfer (decimal string with two digits of precision e.g. "10.00"). When calling `/transfer/authorization/create`, specify the maximum amount to authorize. When calling `/transfer/create`, specify the exact amount of the transfer, up to a maximum of the amount authorized. If this field is left blank when calling `/transfer/create`, the maximum amount authorized in the `authorization_id` will be sent.

The description of the transfer.

The datetime when this transfer was created. This will be of the form `2006-01-02T15:04:05Z`

Format: `date-time`

The status of the transfer.

`pending`: A new transfer was created; it is in the pending state.
`posted`: The transfer has been successfully submitted to the payment network.
`settled`: The transfer was successfully completed by the payment network. Note that funds from received debits are not available to be moved out of the Ledger until the transfer reaches `funds_available` status. For credit transactions, `settled` means the funds have been delivered to the receiving bank account. This is the terminal state of a successful credit transfer.
`funds_available`: Funds from the transfer have been released from hold and applied to the ledger's available balance. (Only applicable to ACH debits.) This is the terminal state of a successful debit transfer.
`cancelled`: The transfer was cancelled by the client. This is the terminal state of a cancelled transfer.
`failed`: The transfer failed, no funds were moved. This is the terminal state of a failed transfer.
`returned`: A posted transfer was returned. This is the terminal state of a returned transfer.

Possible values: `pending`, `posted`, `settled`, `funds_available`, `cancelled`, `failed`, `returned`

The status of the sweep for the transfer.

`unswept`: The transfer hasn't been swept yet.
`swept`: The transfer was swept to the sweep account.
`swept_settled`: Credits are available to be withdrawn or debits have been deducted from the customer's business checking account.
`return_swept`: The transfer was returned, funds were pulled back or pushed back to the sweep account.
`null`: The transfer will never be swept (e.g. if the transfer is cancelled or returned before being swept)

Possible values: `null`, `unswept`, `swept`, `swept_settled`, `return_swept`

The network or rails used for the transfer.

For transfers submitted as `ach` or `same-day-ach`, the Standard ACH cutoff is 8:30 PM Eastern Time.

For transfers submitted as `same-day-ach`, the Same Day ACH cutoff is 3:00 PM Eastern Time. It is recommended to send the request 15 minutes prior to the cutoff to ensure that it will be processed in time for submission before the cutoff. If the transfer is processed after this cutoff but before the Standard ACH cutoff, it will be sent over Standard ACH rails and will not incur same-day charges; this will apply to both legs of the transfer if applicable. The transaction limit for a Same Day ACH transfer is $1,000,000. Authorization requests sent with an amount greater than $1,000,000 will fail.

For transfers submitted as `rtp`, Plaid will automatically route between the Real-Time Payments (RTP) rail by TCH or FedNow rails as necessary. If a transfer is submitted as `rtp` and the counterparty account is not eligible for RTP, the `/transfer/authorization/create` request will fail with an `INVALID_FIELD` error code. To pre-check to determine whether a counterparty account can support RTP, call `/transfer/capabilities/get` before calling `/transfer/authorization/create`.

Wire transfers are currently in early availability. To request access to `wire` as a payment network, contact your account manager. For transfers submitted as `wire`, the `type` must be `credit`; wire debits are not supported. The cutoff to submit a wire payment is 6:30 PM Eastern Time on a business day; wires submitted after that time will be processed on the next business day. The transaction limit for a wire is $999,999.99. Authorization requests sent with an amount greater than $999,999.99 will fail.

Support for `rfp` (request for payment) is currently in closed beta. To learn more, contact your Plaid account manager. For transfers submitted as `rfp`, the `type` must be `debit`.

Possible values: `ach`, `same-day-ach`, `rtp`, `wire`, `rfp`

Information specific to wire transfers.

Hide object

Additional information from the wire originator to the beneficiary. Max 140 characters.

The fee amount deducted from the original transfer during a wire return, if applicable.

When `true`, you can still cancel this transfer.

The failure reason if the event type for a transfer is `"failed"` or `"returned"`. Null value otherwise.

Hide object

The failure code, e.g. `R01`. A failure code will be provided if and only if the transfer status is `returned`. See [ACH return codes](https://plaid.com/docs/errors/transfer/#ach-return-codes) for a full listing of ACH return codes and [RTP/RfP error codes](https://plaid.com/docs/errors/transfer/#rtprfp-error-codes) for RTP error codes.

The ACH return code, e.g. `R01`. A return code will be provided if and only if the transfer status is `returned`. For a full listing of ACH return codes, see [Transfer errors](https://plaid.com/docs/errors/transfer/#ach-return-codes).

A human-readable description of the reason for the failure or reversal.

The Metadata object is a mapping of client-provided string fields to any string value. The following limitations apply:
The JSON values must be Strings (no nested JSON objects allowed)
Only ASCII characters may be used
Maximum of 50 key/value pairs
Maximum key length of 40 characters
Maximum value length of 500 characters

Indicates whether the transfer is guaranteed by Plaid (Guarantee customers only). This field will contain either `GUARANTEED` or `NOT_GUARANTEED` indicating whether Plaid will guarantee the transfer.

Possible values: `GUARANTEED`, `NOT_GUARANTEED`, `null`

Adaptive guarantee details for a transfer, including the guaranteed amount and settlement schedule. Omitted when no guarantee was attempted.

Hide object

The amount currently covered by Plaid's guarantee (decimal string with two digits of precision e.g. "10.00"). This may change over time as scheduled tranches reach their observation window expiration and become guaranteed.

The adaptive guarantee settlement schedule for this transfer.

Hide object

The guaranteed amount for this schedule entry (decimal string with two digits of precision e.g. "10.00").

The number of business days in the observation window for this tranche. `0` when the tranche is not subject to an observation window.

The datetime when the observation window for this tranche expires. Present only when the tranche is subject to an observation window. This will be of the form `2006-01-02T15:04:05Z`.

Format: `date-time`

The currency of the transfer amount, e.g. "USD"

The date 3 business days from settlement date indicating the following ACH returns can no longer happen: R01, R02, R03, R29. This will be of the form YYYY-MM-DD.

Format: `date`

The date 61 business days from settlement date indicating the following ACH returns can no longer happen: R05, R07, R10, R11, R51, R33, R37, R38, R51, R52, R53. This will be of the form YYYY-MM-DD.

Format: `date`

Deprecated for Plaid Ledger clients, use `expected_funds_available_date` instead.

Format: `date`

The expected date when funds from a transfer will be made available and can be withdrawn from the associated ledger balance, assuming the debit does not return before this date. If the transfer does return before this date, this field will be null. Only applies to debit transfers. This will be of the form YYYY-MM-DD.

Format: `date`

The Plaid client ID that is the originator of this transfer. Only present if created on behalf of another client as a [Platform customer](https://plaid.com/docs/transfer/application/#originators-vs-platforms).

A list of refunds associated with this transfer.

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

The id of the recurring transfer if this transfer belongs to a recurring transfer.

The expected sweep settlement schedule of this transfer, assuming this transfer is not `returned`. Only applies to ACH debit transfers.

Hide object

The settlement date of a sweep for this transfer.

Format: `date`

The accumulated amount that has been swept by `sweep_settlement_date`.

This field is now deprecated. You may ignore it for transfers created on and after 12/01/2023.

Specifies the source of funds for the transfer. Only valid for `credit` transfers, and defaults to `sweep` if not specified. This field is not specified for `debit` transfers.

`sweep` - Sweep funds from your funding account
`prefunded_rtp_credits` - Use your prefunded RTP credit balance with Plaid
`prefunded_ach_credits` - Use your prefunded ACH credit balance with Plaid

Possible values: `sweep`, `prefunded_rtp_credits`, `prefunded_ach_credits`, `null`

The amount to deduct from `transfer.amount` and distribute to the platform's Ledger balance as a facilitator fee (decimal string with two digits of precision e.g. "10.00"). The remainder will go to the end-customer's Ledger balance. This must be value greater than 0 and less than or equal to the `transfer.amount`.

The trace identifier for the transfer based on its network. This will only be set after the transfer has posted.

For `ach` or `same-day-ach` transfers, this is the ACH trace number.
For `rtp` transfers, this is the Transaction Identification number.
For `wire` transfers, this is the IMAD (Input Message Accountability Data) number.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "transfers": [
    {
      "account_id": "3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr",
      "funding_account_id": "8945fedc-e703-463d-86b1-dc0607b55460",
      "ledger_id": "563db5f8-4c95-4e17-8c3e-cb988fb9cf1a",
      "ach_class": "ppd",
      "amount": "12.34",
      "cancellable": true,
      "created": "2019-12-09T17:27:15Z",
      "description": "Desc",
      "guarantee_decision": null,
      "guarantee_decision_rationale": null,
      "failure_reason": {
        "failure_code": "R13",
        "description": "Invalid ACH routing number"
      },
      "id": "460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9",
      "authorization_id": "c9f90aa1-2949-c799-e2b6-ea05c89bb586",
      "metadata": {
        "key1": "value1",
        "key2": "value2"
      },
      "network": "ach",
      "origination_account_id": "",
      "originator_client_id": null,
      "refunds": [],
      "status": "pending",
      "type": "credit",
      "iso_currency_code": "USD",
      "standard_return_window": "2020-08-07",
      "unauthorized_return_window": "2020-10-07",
      "expected_settlement_date": "2020-08-04",
      "user": {
        "email_address": "acharleston@email.com",
        "legal_name": "Anne Charleston",
        "phone_number": "510-555-0128",
        "address": {
          "street": "123 Main St.",
          "city": "San Francisco",
          "region": "CA",
          "postal_code": "94053",
          "country": "US"
        }
      },
      "recurring_transfer_id": null,
      "credit_funds_source": "sweep",
      "facilitator_fee": "1.23",
      "network_trace_id": null
    }
  ],
  "request_id": "saKrIBuEB9qJZno"
}
```

=\*=\*=\*=[#### `/transfer/event/list`](/docs/api/products/transfer/reading-transfers/#transfereventlist)

[#### List transfer events](/docs/api/products/transfer/reading-transfers/#list-transfer-events)

Use the [`/transfer/event/list`](/docs/api/products/transfer/reading-transfers/#transfereventlist) endpoint to get a list of transfer events based on specified filter criteria.

/transfer/event/list

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The start `created` datetime of transfers to list. This should be in RFC 3339 format (i.e. `2019-12-06T22:35:49Z`)

Format: `date-time`

The end `created` datetime of transfers to list. This should be in RFC 3339 format (i.e. `2019-12-06T22:35:49Z`)

Format: `date-time`

Plaid's unique identifier for a transfer.

The account ID to get events for all transactions to/from an account.

The type of transfer. This will be either `debit` or `credit`. A `debit` indicates a transfer of money into your origination account; a `credit` indicates a transfer of money out of your origination account.

Possible values: `debit`, `credit`, `null`

Filter events by event type.

Possible values: `pending`, `cancelled`, `failed`, `posted`, `settled`, `funds_available`, `guaranteed`, `returned`, `swept`, `swept_settled`, `return_swept`, `sweep.pending`, `sweep.posted`, `sweep.settled`, `sweep.returned`, `sweep.failed`, `sweep.funds_available`, `refund.pending`, `refund.cancelled`, `refund.failed`, `refund.posted`, `refund.settled`, `refund.returned`, `refund.swept`, `refund.return_swept`

Plaid's unique identifier for a sweep.

The maximum number of transfer events to return. If the number of events matching the above parameters is greater than `count`, the most recent events will be returned.

Default: `25`

Maximum: `25`

Minimum: `1`

The offset into the list of transfer events. When `count`=25 and `offset`=0, the first 25 events will be returned. When `count`=25 and `offset`=25, the next 25 events will be returned.

Default: `0`

Minimum: `0`

Filter transfer events to only those with the specified originator client.

Filter transfer events to only those with the specified `funding_account_id`.

/transfer/event/list

Nodeâ¼

```
const request: TransferEventListRequest = {
  start_date: '2019-12-06T22:35:49Z',
  end_date: '2019-12-12T22:35:49Z',
  transfer_id: '460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9',
  account_id: '3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr',
  transfer_type: 'credit',
  event_types: ['pending', 'posted'],
  count: 14,
  offset: 2,
  funding_account_id: '8945fedc-e703-463d-86b1-dc0607b55460',
};
try {
  const response = await plaidClient.transferEventList(request);
  const events = response.data.transfer_events;
  for (const event of events) {
    // iterate through events
  }
} catch (error) {
  // handle error
}
```

/transfer/event/list

**Response fields**

Collapse all

Hide object

Plaid's unique identifier for this event. IDs are sequential unsigned 64-bit integers.

Minimum: `0`

The datetime when this event occurred. This will be of the form `2006-01-02T15:04:05Z`.

Format: `date-time`

The type of event that this transfer represents. Event types with prefix `sweep` represent events for Plaid Ledger sweeps.

`pending`: A new transfer was created; it is in the pending state.

`cancelled`: The transfer was cancelled by the client.

`failed`: The transfer failed, no funds were moved.

`posted`: The transfer has been successfully submitted to the payment network.

`settled`: The transfer has been successfully completed by the payment network.

`funds_available`: Funds from the transfer have been released from hold and applied to the ledger's available balance. (Only applicable to ACH debits.)

`guaranteed`: The transfer has been fully guaranteed by Plaid.

`returned`: A posted transfer was returned.

`swept`: The transfer was swept to / from the sweep account.

`swept_settled`: Credits are available to be withdrawn or debits have been deducted from the customer's business checking account.

`return_swept`: Due to the transfer being returned, funds were pulled from or pushed back to the sweep account.

`sweep.pending`: A new ledger sweep was created; it is in the pending state.

`sweep.posted`: The ledger sweep has been successfully submitted to the payment network.

`sweep.settled`: The transaction has settled in the funding account. This means that funds withdrawn from Plaid Ledger balance have reached the funding account, or funds to be deposited into the Plaid Ledger Balance have been pulled, and the hold period has begun.

`sweep.returned`: A posted ledger sweep was returned.

`sweep.failed`: The ledger sweep failed, no funds were moved.

`sweep.funds_available`: Funds from the ledger sweep have been released from hold and applied to the ledger's available balance. This is only applicable to debits.

`refund.pending`: A new refund was created; it is in the pending state.

`refund.cancelled`: The refund was cancelled.

`refund.failed`: The refund failed, no funds were moved.

`refund.posted`: The refund has been successfully submitted to the payment network.

`refund.settled`: The refund transaction has settled in the Plaid linked account.

`refund.returned`: A posted refund was returned.

`refund.swept`: The refund was swept from the sweep account.

`refund.return_swept`: Due to the refund being returned, funds were pushed back to the sweep account.

Possible values: `pending`, `cancelled`, `failed`, `posted`, `settled`, `funds_available`, `guaranteed`, `returned`, `swept`, `swept_settled`, `return_swept`, `sweep.pending`, `sweep.posted`, `sweep.settled`, `sweep.returned`, `sweep.failed`, `sweep.funds_available`, `refund.pending`, `refund.cancelled`, `refund.failed`, `refund.posted`, `refund.settled`, `refund.returned`, `refund.swept`, `refund.return_swept`

The account ID associated with the transfer. This field is omitted for Plaid Ledger Sweep events.

The id of the associated funding account, available in the Plaid Dashboard. If present, this indicates which of your business checking accounts will be credited or debited.

Plaid's unique identifier for a Plaid Ledger Balance.

Plaid's unique identifier for a transfer. This field is an empty string for Plaid Ledger Sweep events.

The type of transfer. Valid values are `debit` or `credit`. A `debit` indicates a transfer of money into the origination account; a `credit` indicates a transfer of money out of the origination account. This field is omitted for Plaid Ledger Sweep events.

Possible values: `debit`, `credit`

The amount of the transfer (decimal string with two digits of precision e.g. "10.00"). This field is omitted for Plaid Ledger Sweep events.

The failure reason if the event type for a transfer is `"failed"` or `"returned"`. Null value otherwise.

Hide object

The failure code, e.g. `R01`. A failure code will be provided if and only if the transfer status is `returned`. See [ACH return codes](https://plaid.com/docs/errors/transfer/#ach-return-codes) for a full listing of ACH return codes and [RTP/RfP error codes](https://plaid.com/docs/errors/transfer/#rtprfp-error-codes) for RTP error codes.

The ACH return code, e.g. `R01`. A return code will be provided if and only if the transfer status is `returned`. For a full listing of ACH return codes, see [Transfer errors](https://plaid.com/docs/errors/transfer/#ach-return-codes).

A human-readable description of the reason for the failure or reversal.

Plaid's unique identifier for a sweep.

A signed amount of how much was `swept` or `return_swept` for this transfer (decimal string with two digits of precision e.g. "-5.50").

Plaid's unique identifier for a refund. A non-null value indicates the event is for the associated refund of the transfer.

The Plaid client ID that is the originator of the transfer that this event applies to. Only present if the transfer was created on behalf of another client as a third-party sender (TPS).

The `id` returned by the `/transfer/intent/create` endpoint, for transfers created via Transfer UI. For transfers not created by Transfer UI, the value is `null`. This will currently only be populated for RfP transfers.

The fee amount deducted from the original transfer during a wire return, if applicable.

Whether there are more events to be pulled from the endpoint that have not already been returned

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "transfer_events": [
    {
      "account_id": "3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr",
      "funding_account_id": "8945fedc-e703-463d-86b1-dc0607b55460",
      "ledger_id": "563db5f8-4c95-4e17-8c3e-cb988fb9cf1a",
      "transfer_amount": "12.34",
      "transfer_id": "460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9",
      "transfer_type": "credit",
      "event_id": 1,
      "event_type": "posted",
      "failure_reason": null,
      "origination_account_id": "",
      "originator_client_id": "569ed2f36b3a3a021713abc1",
      "refund_id": null,
      "sweep_amount": null,
      "sweep_id": null,
      "timestamp": "2019-12-09T17:27:15Z"
    }
  ],
  "has_more": true,
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/transfer/event/sync`](/docs/api/products/transfer/reading-transfers/#transfereventsync)

[#### Sync transfer events](/docs/api/products/transfer/reading-transfers/#sync-transfer-events)

[`/transfer/event/sync`](/docs/api/products/transfer/reading-transfers/#transfereventsync) allows you to request up to the next 500 transfer events that happened after a specific `event_id`. Use the [`/transfer/event/sync`](/docs/api/products/transfer/reading-transfers/#transfereventsync) endpoint to guarantee you have seen all transfer events.

/transfer/event/sync

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The latest (largest) `event_id` fetched via the sync endpoint, or 0 initially.

Minimum: `0`

The maximum number of transfer events to return.

Default: `100`

Minimum: `1`

Maximum: `500`

/transfer/event/sync

Nodeâ¼

```
const request: TransferEventSyncRequest = {
  after_id: 4,
  count: 22,
};
try {
  const response = await plaidClient.transferEventSync(request);
  const events = response.data.transfer_events;
  for (const event of events) {
    // iterate through events
  }
} catch (error) {
  // handle error
}
```

/transfer/event/sync

**Response fields**

Collapse all

Hide object

Plaid's unique identifier for this event. IDs are sequential unsigned 64-bit integers.

Minimum: `0`

The datetime when this event occurred. This will be of the form `2006-01-02T15:04:05Z`.

Format: `date-time`

The type of event that this transfer represents. Event types with prefix `sweep` represent events for Plaid Ledger sweeps.

`pending`: A new transfer was created; it is in the pending state.

`cancelled`: The transfer was cancelled by the client.

`failed`: The transfer failed, no funds were moved.

`posted`: The transfer has been successfully submitted to the payment network.

`settled`: The transfer has been successfully completed by the payment network.

`funds_available`: Funds from the transfer have been released from hold and applied to the ledger's available balance. (Only applicable to ACH debits.)

`guaranteed`: The transfer has been fully guaranteed by Plaid.

`returned`: A posted transfer was returned.

`swept`: The transfer was swept to / from the sweep account.

`swept_settled`: Credits are available to be withdrawn or debits have been deducted from the customer's business checking account.

`return_swept`: Due to the transfer being returned, funds were pulled from or pushed back to the sweep account.

`sweep.pending`: A new ledger sweep was created; it is in the pending state.

`sweep.posted`: The ledger sweep has been successfully submitted to the payment network.

`sweep.settled`: The transaction has settled in the funding account. This means that funds withdrawn from Plaid Ledger balance have reached the funding account, or funds to be deposited into the Plaid Ledger Balance have been pulled, and the hold period has begun.

`sweep.returned`: A posted ledger sweep was returned.

`sweep.failed`: The ledger sweep failed, no funds were moved.

`sweep.funds_available`: Funds from the ledger sweep have been released from hold and applied to the ledger's available balance. This is only applicable to debits.

`refund.pending`: A new refund was created; it is in the pending state.

`refund.cancelled`: The refund was cancelled.

`refund.failed`: The refund failed, no funds were moved.

`refund.posted`: The refund has been successfully submitted to the payment network.

`refund.settled`: The refund transaction has settled in the Plaid linked account.

`refund.returned`: A posted refund was returned.

`refund.swept`: The refund was swept from the sweep account.

`refund.return_swept`: Due to the refund being returned, funds were pushed back to the sweep account.

Possible values: `pending`, `cancelled`, `failed`, `posted`, `settled`, `funds_available`, `guaranteed`, `returned`, `swept`, `swept_settled`, `return_swept`, `sweep.pending`, `sweep.posted`, `sweep.settled`, `sweep.returned`, `sweep.failed`, `sweep.funds_available`, `refund.pending`, `refund.cancelled`, `refund.failed`, `refund.posted`, `refund.settled`, `refund.returned`, `refund.swept`, `refund.return_swept`

The account ID associated with the transfer. This field is omitted for Plaid Ledger Sweep events.

The id of the associated funding account, available in the Plaid Dashboard. If present, this indicates which of your business checking accounts will be credited or debited.

Plaid's unique identifier for a Plaid Ledger Balance.

Plaid's unique identifier for a transfer. This field is an empty string for Plaid Ledger Sweep events.

The type of transfer. Valid values are `debit` or `credit`. A `debit` indicates a transfer of money into the origination account; a `credit` indicates a transfer of money out of the origination account. This field is omitted for Plaid Ledger Sweep events.

Possible values: `debit`, `credit`

The amount of the transfer (decimal string with two digits of precision e.g. "10.00"). This field is omitted for Plaid Ledger Sweep events.

The failure reason if the event type for a transfer is `"failed"` or `"returned"`. Null value otherwise.

Hide object

The failure code, e.g. `R01`. A failure code will be provided if and only if the transfer status is `returned`. See [ACH return codes](https://plaid.com/docs/errors/transfer/#ach-return-codes) for a full listing of ACH return codes and [RTP/RfP error codes](https://plaid.com/docs/errors/transfer/#rtprfp-error-codes) for RTP error codes.

The ACH return code, e.g. `R01`. A return code will be provided if and only if the transfer status is `returned`. For a full listing of ACH return codes, see [Transfer errors](https://plaid.com/docs/errors/transfer/#ach-return-codes).

A human-readable description of the reason for the failure or reversal.

Plaid's unique identifier for a sweep.

A signed amount of how much was `swept` or `return_swept` for this transfer (decimal string with two digits of precision e.g. "-5.50").

Plaid's unique identifier for a refund. A non-null value indicates the event is for the associated refund of the transfer.

The Plaid client ID that is the originator of the transfer that this event applies to. Only present if the transfer was created on behalf of another client as a third-party sender (TPS).

The `id` returned by the `/transfer/intent/create` endpoint, for transfers created via Transfer UI. For transfers not created by Transfer UI, the value is `null`. This will currently only be populated for RfP transfers.

The fee amount deducted from the original transfer during a wire return, if applicable.

Whether there are more events to be pulled from the endpoint that have not already been returned

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "transfer_events": [
    {
      "account_id": "3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr",
      "funding_account_id": "8945fedc-e703-463d-86b1-dc0607b55460",
      "ledger_id": "563db5f8-4c95-4e17-8c3e-cb988fb9cf1a",
      "transfer_amount": "12.34",
      "transfer_id": "460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9",
      "transfer_type": "credit",
      "event_id": 1,
      "event_type": "pending",
      "failure_reason": null,
      "origination_account_id": "",
      "originator_client_id": null,
      "refund_id": null,
      "sweep_amount": null,
      "sweep_id": null,
      "timestamp": "2019-12-09T17:27:15Z"
    }
  ],
  "has_more": true,
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/transfer/sweep/get`](/docs/api/products/transfer/reading-transfers/#transfersweepget)

[#### Retrieve a sweep](/docs/api/products/transfer/reading-transfers/#retrieve-a-sweep)

The [`/transfer/sweep/get`](/docs/api/products/transfer/reading-transfers/#transfersweepget) endpoint fetches a sweep corresponding to the given `sweep_id`.

/transfer/sweep/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Plaid's unique identifier for the sweep (UUID) or a shortened form consisting of the first 8 characters of the identifier (8-digit hexadecimal string).

/transfer/sweep/get

Nodeâ¼

```
const request: TransferSweepGetRequest = {
  sweep_id: '8c2fda9a-aa2f-4735-a00f-f4e0d2d2faee',
};
try {
  const response = await plaidClient.transferSweepGet(request);
  const sweep = response.data.sweep;
} catch (error) {
  // handle error
}
```

/transfer/sweep/get

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
    "settled": "2020-08-07",
    "status": "settled",
    "network_trace_id": "123456789012345"
  },
  "request_id": "saKrIBuEB9qJZno"
}
```

=\*=\*=\*=[#### `/transfer/sweep/list`](/docs/api/products/transfer/reading-transfers/#transfersweeplist)

[#### List sweeps](/docs/api/products/transfer/reading-transfers/#list-sweeps)

The [`/transfer/sweep/list`](/docs/api/products/transfer/reading-transfers/#transfersweeplist) endpoint fetches sweeps matching the given filters.

/transfer/sweep/list

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The start `created` datetime of sweeps to return (RFC 3339 format).

Format: `date-time`

The end `created` datetime of sweeps to return (RFC 3339 format).

Format: `date-time`

The maximum number of sweeps to return.

Minimum: `1`

Maximum: `25`

Default: `25`

The number of sweeps to skip before returning results.

Default: `0`

Minimum: `0`

Filter sweeps to only those with the specified amount.

The status of a sweep transfer

`"pending"` - The sweep is currently pending
`"posted"` - The sweep has been posted
`"settled"` - The sweep has settled. This is the terminal state of a successful credit sweep.
`"returned"` - The sweep has been returned. This is the terminal state of a returned sweep. Returns of a sweep are extremely rare, since sweeps are money movement between your own bank account and your own Ledger.
`"funds_available"` - Funds from the sweep have been released from hold and applied to the ledger's available balance. (Only applicable to deposits.) This is the terminal state of a successful deposit sweep.
`"failed"` - The sweep has failed. This is the terminal state of a failed sweep.

Possible values: `pending`, `posted`, `settled`, `funds_available`, `returned`, `failed`, `null`

Filter sweeps to only those with the specified originator client.

Filter sweeps to only those with the specified `funding_account_id`.

Filter sweeps to only those with the included `transfer_id`.

The trigger of the sweep

`"manual"` - The sweep is created manually by the customer
`"incoming"` - The sweep is created by incoming funds flow (e.g. Incoming Wire)
`"balance_threshold"` - The sweep is created by balance threshold setting
`"automatic_aggregate"` - The sweep is created by the Plaid automatic aggregation process. These funds did not pass through the Plaid Ledger balance.

Possible values: `manual`, `incoming`, `balance_threshold`, `automatic_aggregate`

/transfer/sweep/list

Nodeâ¼

```
const request: TransferSweepListRequest = {
  start_date: '2019-12-06T22:35:49Z',
  end_date: '2019-12-12T22:35:49Z',
  count: 14,
  offset: 2,
};
try {
  const response = await plaidClient.transferSweepList(request);
  const sweeps = response.data.sweeps;
  for (const sweep of sweeps) {
    // iterate through sweeps
  }
} catch (error) {
  // handle error
}
```

/transfer/sweep/list

**Response fields**

Collapse all

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
  "sweeps": [
    {
      "id": "d5394a4d-0b04-4a02-9f4a-7ca5c0f52f9d",
      "funding_account_id": "8945fedc-e703-463d-86b1-dc0607b55460",
      "ledger_id": "563db5f8-4c95-4e17-8c3e-cb988fb9cf1a",
      "created": "2019-12-09T17:27:15Z",
      "amount": "-12.34",
      "iso_currency_code": "USD",
      "settled": "2019-12-10",
      "status": "settled",
      "originator_client_id": null
    }
  ],
  "request_id": "saKrIBuEB9qJZno"
}
```

[### Webhooks](/docs/api/products/transfer/reading-transfers/#webhooks)=\*=\*=\*=[#### `TRANSFER_EVENTS_UPDATE`](/docs/api/products/transfer/reading-transfers/#transfer_events_update)

Fired when new transfer events are available. Receiving this webhook indicates you should fetch the new events from [`/transfer/event/sync`](/docs/api/products/transfer/reading-transfers/#transfereventsync). If multiple transfer events occur within a single minute, only one webhook will be fired, so a single webhook instance may correspond to multiple transfer events.

**Properties**

`TRANSFER`

`TRANSFER_EVENTS_UPDATE`

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "TRANSFER",
  "webhook_code": "TRANSFER_EVENTS_UPDATE",
  "environment": "production"
}
```
