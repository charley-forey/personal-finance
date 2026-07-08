---
title: "Transfer / Account Linking"
source_url: "https://plaid.com/docs/api/products/transfer/account-linking/"
section: "Payments and Funding"
section_id: "01-payments-and-funding"
slug: "transfer--account-linking"
endpoints:
  - "/transfer/capabilities/get"
  - "/transfer/intent/create"
  - "/transfer/intent/get"
  - "/transfer/migrate_account"
  - "/accounts/balance/get"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Transfer

> **Source:** [https://plaid.com/docs/api/products/transfer/account-linking/](https://plaid.com/docs/api/products/transfer/account-linking/)
> **Section:** Payments and Funding

## Endpoints & Webhooks on this page

- `/transfer/capabilities/get`
- `/transfer/intent/create`
- `/transfer/intent/get`
- `/transfer/migrate_account`
- `/accounts/balance/get`

---

# Transfer

#### API reference for Transfer account linking endpoints

For how-to guidance, see the [Transfer documentation](/docs/transfer/).

[#### Account Linking](/docs/api/products/transfer/account-linking/#account-linking)

| Account Linking |  |
| --- | --- |
| [`/transfer/capabilities/get`](/docs/api/products/transfer/account-linking/#transfercapabilitiesget) | Determine RTP eligibility for a Plaid Item |
| [`/transfer/intent/create`](/docs/api/products/transfer/account-linking/#transferintentcreate) | Create a transfer intent and invoke Transfer UI (Transfer UI only) |
| [`/transfer/intent/get`](/docs/api/products/transfer/account-linking/#transferintentget) | Retrieve information about a transfer intent (Transfer UI only) |
| [`/transfer/migrate_account`](/docs/api/products/transfer/account-linking/#transfermigrate_account) | Create an Item to use with Transfer from known account and routing numbers |

=\*=\*=\*=[#### `/transfer/capabilities/get`](/docs/api/products/transfer/account-linking/#transfercapabilitiesget)

[#### Get RTP eligibility information of a transfer](/docs/api/products/transfer/account-linking/#get-rtp-eligibility-information-of-a-transfer)

Use the [`/transfer/capabilities/get`](/docs/api/products/transfer/account-linking/#transfercapabilitiesget) endpoint to determine the RTP eligibility information of an account to be used with Transfer. This endpoint works on all Transfer-capable Items, including those created by [`/transfer/migrate_account`](/docs/api/products/transfer/account-linking/#transfermigrate_account).

/transfer/capabilities/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The Plaid `access_token` for the account that will be debited or credited.

The Plaid `account_id` corresponding to the end-user account that will be debited or credited.

/transfer/capabilities/get

Nodeâ¼

```
const request: TransferCapabilitiesGetRequest = {
  access_token: 'access-sandbox-71e02f71-0960-4a27-abd2-5631e04f2175',
  account_id: '3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr',
};

try {
  const response = await client.transferCapabilitiesGet(request);
} catch (error) {
  // handle error
}
```

/transfer/capabilities/get

**Response fields**

Collapse all

Contains the RTP and RfP network and types supported by the linked Item's institution.

Hide object

Contains the supported service types in RTP

Hide object

When `true`, the linked Item's institution supports RTP credit transfer.

Default: `false`

Contains the supported service types in RfP

Hide object

When `true`, the linked Item's institution supports RfP debit transfer.

Default: `false`

The maximum amount (decimal string with two digits of precision e.g. "10.00") for originating RfP transfers with the given institution.

The currency of the `max_amount`, e.g. "USD".

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "institution_supported_networks": {
    "rtp": {
      "credit": true
    },
    "rfp": {
      "debit": true
    }
  },
  "request_id": "saKrIBuEB9qJZno"
}
```

=\*=\*=\*=[#### `/transfer/intent/create`](/docs/api/products/transfer/account-linking/#transferintentcreate)

[#### Create a transfer intent object to invoke the Transfer UI](/docs/api/products/transfer/account-linking/#create-a-transfer-intent-object-to-invoke-the-transfer-ui)

Use the [`/transfer/intent/create`](/docs/api/products/transfer/account-linking/#transferintentcreate) endpoint to generate a transfer intent object and invoke the Transfer UI.

/transfer/intent/create

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The Plaid `account_id` corresponding to the end-user account that will be debited or credited.

The direction of the flow of transfer funds.

`PAYMENT`: Transfers funds from an end user's account to your business account.

`DISBURSEMENT`: Transfers funds from your business account to an end user's account.

Possible values: `PAYMENT`, `DISBURSEMENT`

The network or rails used for the transfer. Defaults to `same-day-ach`.

For transfers submitted using `ach`, the Standard ACH cutoff is 8:30 PM Eastern Time.

For transfers submitted using `same-day-ach`, the Same Day ACH cutoff is 3:00 PM Eastern Time. It is recommended to send the request 15 minutes prior to the cutoff to ensure that it will be processed in time for submission before the cutoff. If the transfer is processed after this cutoff but before the Standard ACH cutoff, it will be sent over Standard ACH rails and will not incur same-day charges.

For transfers submitted using `rtp`, in the case that the account being credited does not support RTP, the transfer will be sent over ACH as long as an `ach_class` is provided in the request. If RTP isn't supported by the account and no `ach_class` is provided, the transfer will fail to be submitted.

Possible values: `ach`, `same-day-ach`, `rtp`

Default: `same-day-ach`

The amount of the transfer (decimal string with two digits of precision e.g. "10.00"). When calling `/transfer/authorization/create`, specify the maximum amount to authorize. When calling `/transfer/create`, specify the exact amount of the transfer, up to a maximum of the amount authorized. If this field is left blank when calling `/transfer/create`, the maximum amount authorized in the `authorization_id` will be sent.

A description for the underlying transfer. Maximum of 15 characters.

Min length: `1`

Max length: `15`

Specifies the use case of the transfer. Required for transfers on an ACH network. For more details, see [ACH SEC codes](https://plaid.com/docs/transfer/creating-transfers/#ach-sec-codes).

Codes supported for credits: `ccd`, `ppd`
Codes supported for debits: `ccd`, `ppd`, `tel`, `web`

`"ccd"` - Corporate Credit or Debit - fund transfer between two corporate bank accounts

`"ppd"` - Prearranged Payment or Deposit - The transfer is part of a pre-existing relationship with a consumer. Authorization was obtained in writing either in person or via an electronic document signing, e.g. Docusign, by the consumer. Can be used for credits or debits.

`"web"` - Internet-Initiated Entry. The transfer debits a consumer's bank account. Authorization from the consumer is obtained over the Internet (e.g. a web or mobile application). Can be used for single debits or recurring debits.

`"tel"` - Telephone-Initiated Entry. The transfer debits a consumer. Debit authorization has been received orally over the telephone via a recorded call.

Possible values: `ccd`, `ppd`, `tel`, `web`

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

The Metadata object is a mapping of client-provided string fields to any string value. The following limitations apply:
The JSON values must be Strings (no nested JSON objects allowed)
Only ASCII characters may be used
Maximum of 50 key/value pairs
Maximum key length of 40 characters
Maximum value length of 500 characters

The currency of the transfer amount, e.g. "USD"

/transfer/intent/create

Nodeâ¼

```
const request: TransferIntentCreateRequest = {
  account_id: '3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr',
  mode: 'PAYMENT',
  amount: '12.34',
  description: 'Desc',
  ach_class: 'ppd',
  funding_account_id: '9853defc-e703-463d-86b1-dc0607a45359',
  user: {
    legal_name: 'Anne Charleston',
  },
};

try {
  const response = await client.transferIntentCreate(request);
} catch (error) {
  // handle error
}
```

/transfer/intent/create

**Response fields**

Collapse all

Represents a transfer intent within Transfer UI.

Hide object

Plaid's unique identifier for the transfer intent object.

The datetime the transfer was created. This will be of the form `2006-01-02T15:04:05Z`.

Format: `date-time`

The status of the transfer intent.

`PENDING`: The transfer intent is pending.
`SUCCEEDED`: The transfer intent was successfully created.
`FAILED`: The transfer intent was unable to be created.

Possible values: `PENDING`, `SUCCEEDED`, `FAILED`

The Plaid `account_id` corresponding to the end-user account that will be debited or credited. Returned only if `account_id` was set on intent creation.

The id of the funding account to use, available in the Plaid Dashboard. This determines which of your business checking accounts will be credited or debited.

The amount of the transfer (decimal string with two digits of precision e.g. "10.00"). When calling `/transfer/authorization/create`, specify the maximum amount to authorize. When calling `/transfer/create`, specify the exact amount of the transfer, up to a maximum of the amount authorized. If this field is left blank when calling `/transfer/create`, the maximum amount authorized in the `authorization_id` will be sent.

The direction of the flow of transfer funds.

`PAYMENT`: Transfers funds from an end user's account to your business account.

`DISBURSEMENT`: Transfers funds from your business account to an end user's account.

Possible values: `PAYMENT`, `DISBURSEMENT`

The network or rails used for the transfer. Defaults to `same-day-ach`.

For transfers submitted using `ach`, the Standard ACH cutoff is 8:30 PM Eastern Time.

For transfers submitted using `same-day-ach`, the Same Day ACH cutoff is 3:00 PM Eastern Time. It is recommended to send the request 15 minutes prior to the cutoff to ensure that it will be processed in time for submission before the cutoff. If the transfer is processed after this cutoff but before the Standard ACH cutoff, it will be sent over Standard ACH rails and will not incur same-day charges.

For transfers submitted using `rtp`, in the case that the account being credited does not support RTP, the transfer will be sent over ACH as long as an `ach_class` is provided in the request. If RTP isn't supported by the account and no `ach_class` is provided, the transfer will fail to be submitted.

Possible values: `ach`, `same-day-ach`, `rtp`

Default: `same-day-ach`

Specifies the use case of the transfer. Required for transfers on an ACH network. For more details, see [ACH SEC codes](https://plaid.com/docs/transfer/creating-transfers/#ach-sec-codes).

Codes supported for credits: `ccd`, `ppd`
Codes supported for debits: `ccd`, `ppd`, `tel`, `web`

`"ccd"` - Corporate Credit or Debit - fund transfer between two corporate bank accounts

`"ppd"` - Prearranged Payment or Deposit - The transfer is part of a pre-existing relationship with a consumer. Authorization was obtained in writing either in person or via an electronic document signing, e.g. Docusign, by the consumer. Can be used for credits or debits.

`"web"` - Internet-Initiated Entry. The transfer debits a consumer's bank account. Authorization from the consumer is obtained over the Internet (e.g. a web or mobile application). Can be used for single debits or recurring debits.

`"tel"` - Telephone-Initiated Entry. The transfer debits a consumer. Debit authorization has been received orally over the telephone via a recorded call.

Possible values: `ccd`, `ppd`, `tel`, `web`

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

A description for the underlying transfer. Maximum of 8 characters.

The Metadata object is a mapping of client-provided string fields to any string value. The following limitations apply:
The JSON values must be Strings (no nested JSON objects allowed)
Only ASCII characters may be used
Maximum of 50 key/value pairs
Maximum key length of 40 characters
Maximum value length of 500 characters

The currency of the transfer amount, e.g. "USD"

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "transfer_intent": {
    "account_id": "3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr",
    "funding_account_id": "9853defc-e703-463d-86b1-dc0607a45359",
    "ach_class": "ppd",
    "amount": "12.34",
    "iso_currency_code": "USD",
    "created": "2020-08-06T17:27:15Z",
    "description": "Desc",
    "id": "460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9",
    "metadata": {
      "key1": "value1",
      "key2": "value2"
    },
    "mode": "PAYMENT",
    "origination_account_id": "9853defc-e703-463d-86b1-dc0607a45359",
    "status": "PENDING",
    "user": {
      "address": {
        "street": "100 Market Street",
        "city": "San Francisco",
        "region": "CA",
        "postal_code": "94103",
        "country": "US"
      },
      "email_address": "acharleston@email.com",
      "legal_name": "Anne Charleston",
      "phone_number": "123-456-7890"
    }
  },
  "request_id": "saKrIBuEB9qJZno"
}
```

=\*=\*=\*=[#### `/transfer/intent/get`](/docs/api/products/transfer/account-linking/#transferintentget)

[#### Retrieve more information about a transfer intent](/docs/api/products/transfer/account-linking/#retrieve-more-information-about-a-transfer-intent)

Use the [`/transfer/intent/get`](/docs/api/products/transfer/account-linking/#transferintentget) endpoint to retrieve more information about a transfer intent.

/transfer/intent/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Plaid's unique identifier for a transfer intent object.

/transfer/intent/get

Nodeâ¼

```
const request: TransferIntentGetRequest = {
  transfer_intent_id: '460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9',
};

try {
  const response = await client.transferIntentGet(request);
} catch (error) {
  // handle error
}
```

/transfer/intent/get

**Response fields**

Collapse all

Represents a transfer intent within Transfer UI.

Hide object

Plaid's unique identifier for a transfer intent object.

The datetime the transfer was created. This will be of the form `2006-01-02T15:04:05Z`.

Format: `date-time`

The status of the transfer intent.

`PENDING`: The transfer intent is pending.
`SUCCEEDED`: The transfer intent was successfully created.
`FAILED`: The transfer intent was unable to be created.

Possible values: `PENDING`, `SUCCEEDED`, `FAILED`

Plaid's unique identifier for the transfer created through the UI. Returned only if the transfer was successfully created. Null value otherwise.

The reason for a failed transfer intent. Returned only if the transfer intent status is `failed`. Null otherwise.

Hide object

A broad categorization of the error.

A code representing the reason for a failed transfer intent (i.e., an API error or the authorization being declined).

A human-readable description of the code associated with a failed transfer intent.

A decision regarding the proposed transfer.

`APPROVED` - The proposed transfer has received the end user's consent and has been approved for processing by Plaid. The `decision_rationale` field is set if Plaid was unable to fetch the account information. You may proceed with the transfer, but further review is recommended (i.e., use Link in update mode to re-authenticate your user when `decision_rationale.code` is `ITEM_LOGIN_REQUIRED`). Refer to the `code` field in the `decision_rationale` object for details.

`DECLINED` - Plaid reviewed the proposed transfer and declined processing. Refer to the `code` field in the `decision_rationale` object for details.

Possible values: `APPROVED`, `DECLINED`

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

The Plaid `account_id` for the account that will be debited or credited. Returned only if `account_id` was set on intent creation.

The id of the funding account to use, available in the Plaid Dashboard. This determines which of your business checking accounts will be credited or debited.

The amount of the transfer (decimal string with two digits of precision e.g. "10.00"). When calling `/transfer/authorization/create`, specify the maximum amount to authorize. When calling `/transfer/create`, specify the exact amount of the transfer, up to a maximum of the amount authorized. If this field is left blank when calling `/transfer/create`, the maximum amount authorized in the `authorization_id` will be sent.

The direction of the flow of transfer funds.

`PAYMENT`: Transfers funds from an end user's account to your business account.

`DISBURSEMENT`: Transfers funds from your business account to an end user's account.

Possible values: `PAYMENT`, `DISBURSEMENT`

The network or rails used for the transfer. Defaults to `same-day-ach`.

For transfers submitted using `ach`, the Standard ACH cutoff is 8:30 PM Eastern Time.

For transfers submitted using `same-day-ach`, the Same Day ACH cutoff is 3:00 PM Eastern Time. It is recommended to send the request 15 minutes prior to the cutoff to ensure that it will be processed in time for submission before the cutoff. If the transfer is processed after this cutoff but before the Standard ACH cutoff, it will be sent over Standard ACH rails and will not incur same-day charges.

For transfers submitted using `rtp`, in the case that the account being credited does not support RTP, the transfer will be sent over ACH as long as an `ach_class` is provided in the request. If RTP isn't supported by the account and no `ach_class` is provided, the transfer will fail to be submitted.

Possible values: `ach`, `same-day-ach`, `rtp`

Default: `same-day-ach`

Specifies the use case of the transfer. Required for transfers on an ACH network. For more details, see [ACH SEC codes](https://plaid.com/docs/transfer/creating-transfers/#ach-sec-codes).

Codes supported for credits: `ccd`, `ppd`
Codes supported for debits: `ccd`, `ppd`, `tel`, `web`

`"ccd"` - Corporate Credit or Debit - fund transfer between two corporate bank accounts

`"ppd"` - Prearranged Payment or Deposit - The transfer is part of a pre-existing relationship with a consumer. Authorization was obtained in writing either in person or via an electronic document signing, e.g. Docusign, by the consumer. Can be used for credits or debits.

`"web"` - Internet-Initiated Entry. The transfer debits a consumer's bank account. Authorization from the consumer is obtained over the Internet (e.g. a web or mobile application). Can be used for single debits or recurring debits.

`"tel"` - Telephone-Initiated Entry. The transfer debits a consumer. Debit authorization has been received orally over the telephone via a recorded call.

Possible values: `ccd`, `ppd`, `tel`, `web`

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

A description for the underlying transfer. Maximum of 8 characters.

The Metadata object is a mapping of client-provided string fields to any string value. The following limitations apply:
The JSON values must be Strings (no nested JSON objects allowed)
Only ASCII characters may be used
Maximum of 50 key/value pairs
Maximum key length of 40 characters
Maximum value length of 500 characters

The currency of the transfer amount, e.g. "USD"

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "transfer_intent": {
    "account_id": "3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr",
    "funding_account_id": "9853defc-e703-463d-86b1-dc0607a45359",
    "ach_class": "ppd",
    "amount": "12.34",
    "iso_currency_code": "USD",
    "authorization_decision": "APPROVED",
    "authorization_decision_rationale": null,
    "created": "2019-12-09T17:27:15Z",
    "description": "Desc",
    "failure_reason": null,
    "guarantee_decision": null,
    "guarantee_decision_rationale": null,
    "id": "460cbe92-2dcc-8eae-5ad6-b37d0ec90fd9",
    "metadata": {
      "key1": "value1",
      "key2": "value2"
    },
    "mode": "DISBURSEMENT",
    "origination_account_id": "9853defc-e703-463d-86b1-dc0607a45359",
    "status": "SUCCEEDED",
    "transfer_id": "590ecd12-1dcc-7eae-4ad6-c28d1ec90df2",
    "user": {
      "address": {
        "street": "123 Main St.",
        "city": "San Francisco",
        "region": "California",
        "postal_code": "94053",
        "country": "US"
      },
      "email_address": "acharleston@email.com",
      "legal_name": "Anne Charleston",
      "phone_number": "510-555-0128"
    }
  },
  "request_id": "saKrIBuEB9qJZno"
}
```

=\*=\*=\*=[#### `/transfer/migrate_account`](/docs/api/products/transfer/account-linking/#transfermigrate_account)

[#### Migrate account into Transfers](/docs/api/products/transfer/account-linking/#migrate-account-into-transfers)

As an alternative to adding Items via Link, you can also use the [`/transfer/migrate_account`](/docs/api/products/transfer/account-linking/#transfermigrate_account) endpoint to migrate previously-verified account and routing numbers to Plaid Items. This endpoint is also required when adding an Item for use with wire transfers; if you intend to create wire transfers on this account, you must provide `wire_routing_number`. Note that Items created in this way are not compatible with endpoints for other products, such as [`/accounts/balance/get`](/docs/api/products/signal/#accountsbalanceget), and can only be used with Transfer endpoints. If you require access to other endpoints, create the Item through Link instead. Access to [`/transfer/migrate_account`](/docs/api/products/transfer/account-linking/#transfermigrate_account) is not enabled by default; to obtain access, contact your Plaid account manager or [support](https://dashboard.plaid.com/support).

/transfer/migrate\_account

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The user's account number.

The user's routing number.

The user's wire transfer routing number. This is the ABA number; for some institutions, this may differ from the ACH number used in `routing_number`. This field must be set for the created item to be eligible for wire transfers.

The type of the bank account (`checking` or `savings`).

/transfer/migrate\_account

Nodeâ¼

```
const request: TransferMigrateAccountRequest = {
  account_number: '100000000',
  routing_number: '121122676',
  account_type: 'checking',
};
try {
  const response = await plaidClient.transferMigrateAccount(request);
  const access_token = response.data.access_token;
} catch (error) {
  // handle error
}
```

/transfer/migrate\_account

**Response fields**

The Plaid `access_token` for the newly created Item.

The Plaid `account_id` for the newly created Item.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "access_token": "access-sandbox-435beced-94e8-4df3-a181-1dde1cfa19f0",
  "account_id": "zvyDgbeeDluZ43AJP6m5fAxDlgoZXDuoy5gjN",
  "request_id": "mdqfuVxeoza6mhu"
}
```
