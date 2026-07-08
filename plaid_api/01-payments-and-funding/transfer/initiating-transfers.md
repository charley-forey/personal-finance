---
title: "Transfer / Initiating Transfers"
source_url: "https://plaid.com/docs/api/products/transfer/initiating-transfers/"
section: "Payments and Funding"
section_id: "01-payments-and-funding"
slug: "transfer--initiating-transfers"
endpoints:
  - "/transfer/authorization/create"
  - "/transfer/authorization/cancel"
  - "/transfer/create"
  - "/transfer/cancel"
  - "/link/token/create"
  - "/transfer/get"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Initiating transfers

> **Source:** [https://plaid.com/docs/api/products/transfer/initiating-transfers/](https://plaid.com/docs/api/products/transfer/initiating-transfers/)
> **Section:** Payments and Funding

## Endpoints & Webhooks on this page

- `/transfer/authorization/create`
- `/transfer/authorization/cancel`
- `/transfer/create`
- `/transfer/cancel`
- `/link/token/create`
- `/transfer/get`

---

# Initiating transfers

#### API reference for Transfer initiation endpoints

For how-to guidance, see the [Transfer creation documentation](/docs/transfer/creating-transfers/).

| Initiating Transfers |  |
| --- | --- |
| [`/transfer/authorization/create`](/docs/api/products/transfer/initiating-transfers/#transferauthorizationcreate) | Create a transfer authorization |
| [`/transfer/authorization/cancel`](/docs/api/products/transfer/initiating-transfers/#transferauthorizationcancel) | Cancel a transfer authorization |
| [`/transfer/create`](/docs/api/products/transfer/initiating-transfers/#transfercreate) | Create a transfer |
| [`/transfer/cancel`](/docs/api/products/transfer/initiating-transfers/#transfercancel) | Cancel a transfer |

=\*=\*=\*=[#### `/transfer/authorization/create`](/docs/api/products/transfer/initiating-transfers/#transferauthorizationcreate)

[#### Create a transfer authorization](/docs/api/products/transfer/initiating-transfers/#create-a-transfer-authorization)

Use the [`/transfer/authorization/create`](/docs/api/products/transfer/initiating-transfers/#transferauthorizationcreate) endpoint to authorize a transfer. This endpoint must be called prior to calling [`/transfer/create`](/docs/api/products/transfer/initiating-transfers/#transfercreate). The transfer authorization will expire if not used after one hour. (You can contact your account manager to change the default authorization lifetime.)

There are four possible outcomes to calling this endpoint:

- If the `authorization.decision` in the response is `declined`, the proposed transfer has failed the risk check and you cannot proceed with the transfer.

- If the `authorization.decision` is `user_action_required`, additional user input is needed, usually to fix a broken bank connection, before Plaid can properly assess the risk. You need to launch Link in update mode to complete the required user action. When calling [`/link/token/create`](/docs/api/link/#linktokencreate) to get a new Link token, instead of providing `access_token` in the request, you should set [`transfer.authorization_id`](https://plaid.com/docs/api/link/#link-token-create-request-transfer-authorization-id) as the `authorization.id`. After the Link flow is completed, you may re-attempt the authorization.

- If the `authorization.decision` is `approved`, and the `authorization.decision_rationale.code` is `null`, the transfer has passed the risk check and you can proceed to call [`/transfer/create`](/docs/api/products/transfer/initiating-transfers/#transfercreate).

- If the `authorization.decision` is `approved` and the `authorization.decision_rationale.code` is non-`null`, the risk check could not be run: you may proceed with the transfer, but should perform your own risk evaluation. For more details, see the response schema.

In Plaid's Sandbox environment the decisions will be returned as follows:

- To approve a transfer with `null` rationale code, make an authorization request with an `amount` less than the available balance in the account.

- To approve a transfer with the rationale code `MANUALLY_VERIFIED_ITEM`, create an Item in Link through the [Same-Day Micro-deposits flow](https://plaid.com/docs/auth/coverage/testing/#testing-same-day-micro-deposits).

- To get an authorization decision of `user_action_required`, [reset the login for an Item](https://plaid.com/docs/sandbox/#item_login_required).

- To decline a transfer with the rationale code `NSF`, the available balance on the account must be less than the authorization `amount`. See [Create Sandbox test data](https://plaid.com/docs/sandbox/user-custom/) for details on how to customize data in Sandbox.

- To decline a transfer with the rationale code `RISK`, the available balance on the account must be exactly $0. See [Create Sandbox test data](https://plaid.com/docs/sandbox/user-custom/) for details on how to customize data in Sandbox.

/transfer/authorization/create

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The Plaid `access_token` for the account that will be debited or credited.

The Plaid `account_id` corresponding to the end-user account that will be debited or credited.

Specify which ledger balance should be used to fund the transfer. You can find a list of `ledger_id`s in the Accounts page of your Plaid Dashboard. If this field is left blank, this will default to the id of the default ledger balance.

The type of transfer. This will be either `debit` or `credit`. A `debit` indicates a transfer of money into the origination account; a `credit` indicates a transfer of money out of the origination account.

Possible values: `debit`, `credit`

The network or rails used for the transfer.

For transfers submitted as `ach` or `same-day-ach`, the Standard ACH cutoff is 8:30 PM Eastern Time.

For transfers submitted as `same-day-ach`, the Same Day ACH cutoff is 3:00 PM Eastern Time. It is recommended to send the request 15 minutes prior to the cutoff to ensure that it will be processed in time for submission before the cutoff. If the transfer is processed after this cutoff but before the Standard ACH cutoff, it will be sent over Standard ACH rails and will not incur same-day charges; this will apply to both legs of the transfer if applicable. The transaction limit for a Same Day ACH transfer is $1,000,000. Authorization requests sent with an amount greater than $1,000,000 will fail.

For transfers submitted as `rtp`, Plaid will automatically route between the Real-Time Payments (RTP) rail by TCH or FedNow rails as necessary. If a transfer is submitted as `rtp` and the counterparty account is not eligible for RTP, the `/transfer/authorization/create` request will fail with an `INVALID_FIELD` error code. To pre-check to determine whether a counterparty account can support RTP, call `/transfer/capabilities/get` before calling `/transfer/authorization/create`.

Wire transfers are currently in early availability. To request access to `wire` as a payment network, contact your account manager. For transfers submitted as `wire`, the `type` must be `credit`; wire debits are not supported. The cutoff to submit a wire payment is 6:30 PM Eastern Time on a business day; wires submitted after that time will be processed on the next business day. The transaction limit for a wire is $999,999.99. Authorization requests sent with an amount greater than $999,999.99 will fail.

Support for `rfp` (request for payment) is currently in closed beta. To learn more, contact your Plaid account manager. For transfers submitted as `rfp`, the `type` must be `debit`.

Possible values: `ach`, `same-day-ach`, `rtp`, `wire`, `rfp`

The amount of the transfer (decimal string with two digits of precision e.g. "10.00"). When calling `/transfer/authorization/create`, specify the maximum amount to authorize. When calling `/transfer/create`, specify the exact amount of the transfer, up to a maximum of the amount authorized. If this field is left blank when calling `/transfer/create`, the maximum amount authorized in the `authorization_id` will be sent.

Specifies the use case of the transfer. Required for transfers on an ACH network. For more details, see [ACH SEC codes](https://plaid.com/docs/transfer/creating-transfers/#ach-sec-codes).

Codes supported for credits: `ccd`, `ppd`
Codes supported for debits: `ccd`, `ppd`, `tel`, `web`

`"ccd"` - Corporate Credit or Debit - fund transfer between two corporate bank accounts

`"ppd"` - Prearranged Payment or Deposit - The transfer is part of a pre-existing relationship with a consumer. Authorization was obtained in writing either in person or via an electronic document signing, e.g. Docusign, by the consumer. Can be used for credits or debits.

`"web"` - Internet-Initiated Entry. The transfer debits a consumer's bank account. Authorization from the consumer is obtained over the Internet (e.g. a web or mobile application). Can be used for single debits or recurring debits.

`"tel"` - Telephone-Initiated Entry. The transfer debits a consumer. Debit authorization has been received orally over the telephone via a recorded call.

Possible values: `ccd`, `ppd`, `tel`, `web`

Information specific to wire transfers.

Hide object

Additional information from the wire originator to the beneficiary. Max 140 characters.

The fee amount deducted from the original transfer during a wire return, if applicable.

The legal name and other information for the account holder. If the account has multiple account holders, provide the information for the account holder on whose behalf the authorization is being requested. The `user.legal_name` field is required. Other fields are not currently used and are present to support planned future functionality.

Hide object

The user's legal name. If the user is a business, provide the business name.

The user's phone number.

The user's email address.

The address associated with the account holder.

Hide object

The street number and name (i.e., "100 Market St.").

Ex. "San Francisco"

The state or province (e.g., "CA").

The postal code (e.g., "94103").

A two-letter country code (e.g., "US").

Information about the device being used to initiate the authorization. These fields are not currently incorporated into the risk check.

Hide object

The IP address of the device being used to initiate the authorization.

The user agent of the device being used to initiate the authorization.

The currency of the transfer amount. The default value is "USD".

A random key provided by the client, per unique authorization, which expires after 48 hours. Maximum of 50 characters.

The API supports idempotency for safely retrying requests without accidentally performing the same operation twice. For example, if a request to create an authorization fails due to a network connection error, you can retry the request with the same idempotency key to guarantee that only a single authorization is created.

Idempotency does not apply to authorizations whose decisions are `user_action_required`. Therefore you may re-attempt the authorization after completing the required user action without changing `idempotency_key`.

This idempotency key expires after 48 hours, after which the same key can be reused. Failure to provide this key may result in duplicate charges.

Max length: `50`

If the end user is initiating the specific transfer themselves via an interactive UI, this should be `true`; for automatic recurring payments where the end user is not actually initiating each individual transfer, it should be `false`. This field is not currently used and is present to support planned future functionality.

The Plaid client ID that is the originator of this transfer. Only needed if creating transfers on behalf of another client as a [Platform customer](https://plaid.com/docs/transfer/application/#originators-vs-platforms).

Plaid's unique identifier for a test clock. This field may only be used when using `sandbox` environment. If provided, the `authorization` is created at the `virtual_time` on the provided test clock.

The key of the Ruleset for the transaction. If not provided, Signal will use the `default` ruleset.

A free-form map of client-supplied risk-relevant context for this authorization. Plaid may use these attributes to inform future versions of our risk models.

The following limitations apply:
Keys must match the regular expression `^[A-Za-z0-9_.-]{1,40}$`
Values must be strings (no nested objects, arrays, numbers, or booleans allowed; stringify non-string values client-side)
Maximum of 50 key/value pairs
Maximum value length of 500 characters

Do not include personally identifiable information or other sensitive data.

/transfer/authorization/create

Nodeâ¼

```
const request: TransferAuthorizationCreateRequest = {
  access_token: 'access-sandbox-71e02f71-0960-4a27-abd2-5631e04f2175',
  account_id: '3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr',
  type: 'debit',
  network: 'ach',
  amount: '12.34',
  ach_class: 'ppd',
  user: {
    legal_name: 'Anne Charleston',
  },
};

try {
  const response = await client.transferAuthorizationCreate(request);
  const authorizationId = response.data.authorization.id;
} catch (error) {
  // handle error
}
```

/transfer/authorization/create

**Response fields**

Collapse all

Contains the authorization decision for a proposed transfer.

Hide object

Plaid's unique identifier for a transfer authorization.

The datetime representing when the authorization was created, in the format `2006-01-02T15:04:05Z`.

Format: `date-time`

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

Indicates whether the transfer is guaranteed by Plaid (Guarantee customers only). This field will contain either `GUARANTEED` or `NOT_GUARANTEED` indicating whether Plaid will guarantee the transfer.

Possible values: `GUARANTEED`, `NOT_GUARANTEED`, `null`

Adaptive guarantee details for a transfer authorization, including the guarantee outcome and settlement schedule. Omitted when no guarantee was attempted.

Hide object

The adaptive guarantee outcome for a transfer.

`FULL_INSTANT`: The full transfer amount is guaranteed and funds are available instantly.

`PARTIAL_INSTANT_ONLY`: A partial amount is guaranteed and available instantly; the remainder is not guaranteed.

`PARTIAL_INSTANT_WITH_OBSERVATION_WINDOW`: A partial amount is guaranteed instantly; an additional amount is conditionally guaranteed subject to an observation window.

`NOT_GUARANTEED`: Plaid did not provide a guarantee for this transfer.

Possible values: `FULL_INSTANT`, `PARTIAL_INSTANT_ONLY`, `PARTIAL_INSTANT_WITH_OBSERVATION_WINDOW`, `NOT_GUARANTEED`

The adaptive guarantee settlement schedule for this authorization.

Hide object

The guaranteed amount for this schedule entry (decimal string with two digits of precision e.g. "10.00").

The number of business days in the observation window for this tranche. `0` when the tranche is not subject to an observation window.

Details regarding the proposed transfer.

Hide object

Specifies the use case of the transfer. Required for transfers on an ACH network. For more details, see [ACH SEC codes](https://plaid.com/docs/transfer/creating-transfers/#ach-sec-codes).

Codes supported for credits: `ccd`, `ppd`
Codes supported for debits: `ccd`, `ppd`, `tel`, `web`

`"ccd"` - Corporate Credit or Debit - fund transfer between two corporate bank accounts

`"ppd"` - Prearranged Payment or Deposit - The transfer is part of a pre-existing relationship with a consumer. Authorization was obtained in writing either in person or via an electronic document signing, e.g. Docusign, by the consumer. Can be used for credits or debits.

`"web"` - Internet-Initiated Entry. The transfer debits a consumer's bank account. Authorization from the consumer is obtained over the Internet (e.g. a web or mobile application). Can be used for single debits or recurring debits.

`"tel"` - Telephone-Initiated Entry. The transfer debits a consumer. Debit authorization has been received orally over the telephone via a recorded call.

Possible values: `ccd`, `ppd`, `tel`, `web`

The Plaid `account_id` for the account that will be debited or credited.

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

The amount originally requested by the client when creating the authorization (decimal string with two digits of precision e.g. "800.00"). This may differ from `amount`, the amount Plaid proposes to transfer, when only a partial amount is offered as part of an Adaptive Guarantee.

The network or rails used for the transfer.

Information specific to wire transfers.

Hide object

Additional information from the wire originator to the beneficiary. Max 140 characters.

The fee amount deducted from the original transfer during a wire return, if applicable.

The currency of the transfer amount. The default value is "USD".

The Plaid client ID that is the originator of this transfer. Only present if created on behalf of another client as a [Platform customer](https://plaid.com/docs/transfer/application/#originators-vs-platforms).

This field is now deprecated. You may ignore it for transfers created on and after 12/01/2023.

Specifies the source of funds for the transfer. Only valid for `credit` transfers, and defaults to `sweep` if not specified. This field is not specified for `debit` transfers.

`sweep` - Sweep funds from your funding account
`prefunded_rtp_credits` - Use your prefunded RTP credit balance with Plaid
`prefunded_ach_credits` - Use your prefunded ACH credit balance with Plaid

Possible values: `sweep`, `prefunded_rtp_credits`, `prefunded_ach_credits`, `null`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "authorization": {
    "id": "460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9",
    "created": "2020-08-06T17:27:15Z",
    "decision": "approved",
    "decision_rationale": null,
    "guarantee_decision": null,
    "guarantee_decision_rationale": null,
    "payment_risk": null,
    "proposed_transfer": {
      "ach_class": "ppd",
      "account_id": "3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr",
      "funding_account_id": "8945fedc-e703-463d-86b1-dc0607b55460",
      "ledger_id": "563db5f8-4c95-4e17-8c3e-cb988fb9cf1a",
      "type": "credit",
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
      "amount": "12.34",
      "requested_amount": "12.34",
      "network": "ach",
      "iso_currency_code": "USD",
      "origination_account_id": "",
      "originator_client_id": null,
      "credit_funds_source": "sweep"
    }
  },
  "request_id": "saKrIBuEB9qJZno"
}
```

=\*=\*=\*=[#### `/transfer/authorization/cancel`](/docs/api/products/transfer/initiating-transfers/#transferauthorizationcancel)

[#### Cancel a transfer authorization](/docs/api/products/transfer/initiating-transfers/#cancel-a-transfer-authorization)

Use the [`/transfer/authorization/cancel`](/docs/api/products/transfer/initiating-transfers/#transferauthorizationcancel) endpoint to cancel a transfer authorization. A transfer authorization is eligible for cancellation if it has not yet been used to create a transfer.

/transfer/authorization/cancel

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Plaid's unique identifier for a transfer authorization.

/transfer/authorization/cancel

Nodeâ¼

```
const request: TransferAuthorizationCancelRequest = {
  authorization_id: '123004561178933',
};
try {
  const response = await plaidClient.transferAuthorizationCancel(request);
  const request_id = response.data.request_id;
} catch (error) {
  // handle error
}
```

/transfer/authorization/cancel

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "saKrIBuEB9qJZno"
}
```

=\*=\*=\*=[#### `/transfer/create`](/docs/api/products/transfer/initiating-transfers/#transfercreate)

[#### Create a transfer](/docs/api/products/transfer/initiating-transfers/#create-a-transfer)

Use the [`/transfer/create`](/docs/api/products/transfer/initiating-transfers/#transfercreate) endpoint to initiate a new transfer. This endpoint is retryable and idempotent; if a transfer with the provided `transfer_id` has already been created, it will return the transfer details without creating a new transfer. A transfer may still be created if a 500 error is returned; to detect this scenario, use [Transfer events](https://plaid.com/docs/transfer/reconciling-transfers/).

/transfer/create

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The Plaid `access_token` for the account that will be debited or credited.

The Plaid `account_id` corresponding to the end-user account that will be debited or credited.

Plaid's unique identifier for a transfer authorization. This parameter also serves the purpose of acting as an idempotency identifier.

The amount of the transfer (decimal string with two digits of precision e.g. "10.00"). When calling `/transfer/authorization/create`, specify the maximum amount to authorize. When calling `/transfer/create`, specify the exact amount of the transfer, up to a maximum of the amount authorized. If this field is left blank when calling `/transfer/create`, the maximum amount authorized in the `authorization_id` will be sent.

The transfer description, maximum of 15 characters (RTP transactions) or 10 characters (ACH transactions). Should represent why the money is moving, not your company name. For recommendations on setting the `description` field to avoid ACH returns, see [Description field recommendations](https://www.plaid.com/docs/transfer/creating-transfers/#description-field-recommendations).

If reprocessing a returned transfer, the `description` field must be `"Retry 1"` or `"Retry 2"`. You may retry a transfer up to 2 times, within 180 days of creating the original transfer. Only transfers that were returned with code `R01` or `R09` may be retried.

Max length: `15`

The Metadata object is a mapping of client-provided string fields to any string value. The following limitations apply:
The JSON values must be Strings (no nested JSON objects allowed)
Only ASCII characters may be used
Maximum of 50 key/value pairs
Maximum key length of 40 characters
Maximum value length of 500 characters

Plaid's unique identifier for a test clock. This field may only be used when using `sandbox` environment. If provided, the `transfer` is created at the `virtual_time` on the provided `test_clock`.

The amount to deduct from `transfer.amount` and distribute to the platform's Ledger balance as a facilitator fee (decimal string with two digits of precision e.g. "10.00"). The remainder will go to the end-customer's Ledger balance. This must be value greater than 0 and less than or equal to the `transfer.amount`.

/transfer/create

Nodeâ¼

```
const request: TransferCreateRequest = {
  access_token: 'access-sandbox-71e02f71-0960-4a27-abd2-5631e04f2175',
  account_id: '3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr',
  description: 'payment',
  authorization_id: '231h012308h3101z21909sw',
};
try {
  const response = await client.transferCreate(request);
  const transfer = response.data.transfer;
} catch (error) {
  // handle error
}
```

/transfer/create

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
    "id": "460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9",
    "authorization_id": "c9f90aa1-2949-c799-e2b6-ea05c89bb586",
    "ach_class": "ppd",
    "account_id": "3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr",
    "funding_account_id": "8945fedc-e703-463d-86b1-dc0607b55460",
    "ledger_id": "563db5f8-4c95-4e17-8c3e-cb988fb9cf1a",
    "type": "credit",
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
    "amount": "12.34",
    "description": "payment",
    "created": "2020-08-06T17:27:15Z",
    "refunds": [],
    "status": "pending",
    "network": "ach",
    "cancellable": true,
    "guarantee_decision": null,
    "guarantee_decision_rationale": null,
    "failure_reason": null,
    "metadata": {
      "key1": "value1",
      "key2": "value2"
    },
    "origination_account_id": "",
    "iso_currency_code": "USD",
    "standard_return_window": "2023-08-07",
    "unauthorized_return_window": "2023-10-07",
    "expected_settlement_date": "2023-08-04",
    "originator_client_id": "569ed2f36b3a3a021713abc1",
    "recurring_transfer_id": null,
    "credit_funds_source": "sweep",
    "facilitator_fee": "1.23",
    "network_trace_id": null
  },
  "request_id": "saKrIBuEB9qJZno"
}
```

=\*=\*=\*=[#### `/transfer/cancel`](/docs/api/products/transfer/initiating-transfers/#transfercancel)

[#### Cancel a transfer](/docs/api/products/transfer/initiating-transfers/#cancel-a-transfer)

Use the [`/transfer/cancel`](/docs/api/products/transfer/initiating-transfers/#transfercancel) endpoint to cancel a transfer. A transfer is eligible for cancellation if the `cancellable` property returned by [`/transfer/get`](/docs/api/products/transfer/reading-transfers/#transferget) is `true`.

/transfer/cancel

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Plaid's unique identifier for a transfer.

Specifies the reason for cancelling transfer. This is required for RfP transfers, and will be ignored for other networks.

`"AC03"` - Invalid Creditor Account Number

`"AM09"` - Incorrect Amount

`"CUST"` - Requested By Customer - Cancellation requested

`"DUPL"` - Duplicate Payment

`"FRAD"` - Fraudulent Payment - Unauthorized or fraudulently induced

`"TECH"` - Technical Problem - Cancellation due to system issues

`"UPAY"` - Undue Payment - Payment was made through another channel

`"AC14"` - Invalid or Missing Creditor Account Type

`"AM06"` - Amount Too Low

`"BE05"` - Unrecognized Initiating Party

`"FOCR"` - Following Refund Request

`"MS02"` - No Specified Reason - Customer

`"MS03"` - No Specified Reason - Agent

`"RR04"` - Regulatory Reason

`"RUTA"` - Return Upon Unable To Apply

Possible values: `AC03`, `AM09`, `CUST`, `DUPL`, `FRAD`, `TECH`, `UPAY`, `AC14`, `AM06`, `BE05`, `FOCR`, `MS02`, `MS03`, `RR04`, `RUTA`

/transfer/cancel

Nodeâ¼

```
const request: TransferCancelRequest = {
  transfer_id: '123004561178933',
};
try {
  const response = await plaidClient.transferCancel(request);
  const request_id = response.data.request_id;
} catch (error) {
  // handle error
}
```

/transfer/cancel

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "saKrIBuEB9qJZno"
}
```
