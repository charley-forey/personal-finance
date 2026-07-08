---
title: "Payment Initiation (Europe)"
source_url: "https://plaid.com/docs/api/products/payment-initiation/"
section: "Payments and Funding"
section_id: "01-payments-and-funding"
slug: "payment-initiation"
endpoints:
  - "/payment_initiation/recipient/create"
  - "/payment_initiation/recipient/get"
  - "/payment_initiation/recipient/list"
  - "/payment_initiation/payment/create"
  - "/payment_initiation/payment/get"
  - "/payment_initiation/payment/list"
  - "/payment_initiation/payment/reverse"
  - "/payment_initiation/consent/create"
  - "/payment_initiation/consent/get"
  - "/payment_initiation/consent/revoke"
  - "/payment_initiation/consent/payment/execute"
  - "/link/token/create"
  - "/sandbox/payment/simulate"
  - "/wallet/create"
  - "/wallet/get"
  - "/wallet/list"
  - "/wallet/transaction/execute"
  - "/wallet/transaction/get"
  - "/wallet/transaction/list"
  - "PAYMENT_STATUS_UPDATE"
  - "CONSENT_STATUS_UPDATE"
  - "WALLET_TRANSACTION_STATUS_UPDATE"
  - "Webhooks"
  - "webhook_type"
  - "webhook_code"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Payment Initiation (UK and Europe)

> **Source:** [https://plaid.com/docs/api/products/payment-initiation/](https://plaid.com/docs/api/products/payment-initiation/)
> **Section:** Payments and Funding

## Endpoints & Webhooks on this page

- `/payment_initiation/recipient/create`
- `/payment_initiation/recipient/get`
- `/payment_initiation/recipient/list`
- `/payment_initiation/payment/create`
- `/payment_initiation/payment/get`
- `/payment_initiation/payment/list`
- `/payment_initiation/payment/reverse`
- `/payment_initiation/consent/create`
- `/payment_initiation/consent/get`
- `/payment_initiation/consent/revoke`
- `/payment_initiation/consent/payment/execute`
- `/link/token/create`
- `/sandbox/payment/simulate`
- `/wallet/create`
- `/wallet/get`
- `/wallet/list`
- `/wallet/transaction/execute`
- `/wallet/transaction/get`
- `/wallet/transaction/list`
- `PAYMENT_STATUS_UPDATE`
- `CONSENT_STATUS_UPDATE`
- `WALLET_TRANSACTION_STATUS_UPDATE`
- `Webhooks`
- `webhook_type`
- `webhook_code`

---

# Payment Initiation (UK and Europe)

#### API reference for Payment Initiation endpoints and webhooks

Make payment transfers from your app. Plaid supports both domestic payments denominated in local currencies and international payments, generally denominated in Euro. Domestic payments can be made in pound sterling (typically via the Faster Payments network), Euro (via SEPA Credit Transfer or SEPA Instant) and other local currencies (Polish Zloty, Danish Krone, Swedish Krona, Norwegian Krone), typically via local payment schemes.

For payments in the US, see [Transfer](/docs/api/products/transfer/).

Looking for guidance on how to integrate using these endpoints? Check out the [Payment Initiation documentation](/docs/payment-initiation/).

| Endpoints |  |
| --- | --- |
| [`/payment_initiation/recipient/create`](/docs/api/products/payment-initiation/#payment_initiationrecipientcreate) | Create a recipient |
| [`/payment_initiation/recipient/get`](/docs/api/products/payment-initiation/#payment_initiationrecipientget) | Fetch recipient data |
| [`/payment_initiation/recipient/list`](/docs/api/products/payment-initiation/#payment_initiationrecipientlist) | List all recipients |
| [`/payment_initiation/payment/create`](/docs/api/products/payment-initiation/#payment_initiationpaymentcreate) | Create a payment |
| [`/payment_initiation/payment/get`](/docs/api/products/payment-initiation/#payment_initiationpaymentget) | Fetch a payment |
| [`/payment_initiation/payment/list`](/docs/api/products/payment-initiation/#payment_initiationpaymentlist) | List all payments |
| [`/payment_initiation/payment/reverse`](/docs/api/products/payment-initiation/#payment_initiationpaymentreverse) | Refund a payment from a virtual account |
| [`/payment_initiation/consent/create`](/docs/api/products/payment-initiation/#payment_initiationconsentcreate) | Create a payment consent |
| [`/payment_initiation/consent/get`](/docs/api/products/payment-initiation/#payment_initiationconsentget) | Fetch a payment consent |
| [`/payment_initiation/consent/revoke`](/docs/api/products/payment-initiation/#payment_initiationconsentrevoke) | Revoke a payment consent |
| [`/payment_initiation/consent/payment/execute`](/docs/api/products/payment-initiation/#payment_initiationconsentpaymentexecute) | Execute a payment using payment consent |

Users will be prompted to authorise the payment once you [initialise Link](/docs/link/#initializing-link). See [`/link/token/create`](/docs/api/link/#linktokencreate) for more information on how to obtain a payments `link_token`.

| See also |  |
| --- | --- |
| [`/sandbox/payment/simulate`](/docs/api/sandbox/#sandboxpaymentsimulate) | Simulate a payment in Sandbox |
| [`/wallet/create`](/docs/api/products/virtual-accounts/#walletcreate) | Create a virtual account |
| [`/wallet/get`](/docs/api/products/virtual-accounts/#walletget) | Fetch a virtual account |
| [`/wallet/list`](/docs/api/products/virtual-accounts/#walletlist) | List all virtual accounts |
| [`/wallet/transaction/execute`](/docs/api/products/virtual-accounts/#wallettransactionexecute) | Execute a transaction |
| [`/wallet/transaction/get`](/docs/api/products/virtual-accounts/#wallettransactionget) | Fetch a transaction |
| [`/wallet/transaction/list`](/docs/api/products/virtual-accounts/#wallettransactionlist) | List all transactions |

| Webhooks |  |
| --- | --- |
| [`PAYMENT_STATUS_UPDATE`](/docs/api/products/payment-initiation/#payment_status_update) | The status of a payment has changed |
| [`CONSENT_STATUS_UPDATE`](/docs/api/products/payment-initiation/#consent_status_update) | The status of a consent has changed |
| [`WALLET_TRANSACTION_STATUS_UPDATE`](/docs/api/products/virtual-accounts/#wallet_transaction_status_update) | The status of a transaction has changed |

[### Endpoints](/docs/api/products/payment-initiation/#endpoints)=\*=\*=\*=[#### `/payment_initiation/recipient/create`](/docs/api/products/payment-initiation/#payment_initiationrecipientcreate)

[#### Create payment recipient](/docs/api/products/payment-initiation/#create-payment-recipient)

Create a payment recipient for payment initiation. The recipient must be in Europe, within a country that is a member of the Single Euro Payments Area (SEPA) or a non-Eurozone country [supported](https://support.plaid.com/hc/en-us/articles/27895826947735-What-Plaid-products-are-supported-in-each-country-and-region) by Plaid. For a standing order (recurring) payment, the recipient must be in the UK.

It is recommended to use `bacs` in the UK and `iban` in EU.

The endpoint is idempotent: if a developer has already made a request with the same payment details, Plaid will return the same `recipient_id`.

/payment\_initiation/recipient/create

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The name of the recipient. We recommend using strings of length 18 or less and avoid special characters to ensure compatibility with all institutions.

Min length: `1`

The International Bank Account Number (IBAN) for the recipient. If Bacs data is not provided, an IBAN is required.

Min length: `15`

Max length: `34`

An object containing a Bacs account number and sort code. If an IBAN is not provided or if this recipient needs to accept domestic GBP-denominated payments, Bacs data is required.

Hide object

The account number of the account. Maximum of 10 characters.

Min length: `1`

Max length: `10`

The 6-character sort code of the account.

Min length: `6`

Max length: `6`

The optional address of the payment recipient's bank account. Required by most institutions outside of the UK.

Hide object

An array of length 1-2 representing the street address where the recipient is located. Maximum of 70 characters.

Min items: `1`

Min length: `1`

The city where the recipient is located. Maximum of 35 characters.

Min length: `1`

Max length: `35`

The postal code where the recipient is located. Maximum of 16 characters.

Min length: `1`

Max length: `16`

The ISO 3166-1 alpha-2 country code where the recipient is located.

Min length: `2`

Max length: `2`

/payment\_initiation/recipient/create

Nodeâ¼

```
// Using Bacs, without IBAN or address
const request: PaymentInitiationRecipientCreateRequest = {
  name: 'John Doe',
  bacs: {
    account: '26207729',
    sort_code: '560029',
  },
};
try {
  const response = await plaidClient.paymentInitiationRecipientCreate(request);
  const recipientID = response.data.recipient_id;
} catch (error) {
  // handle error
}
```

/payment\_initiation/recipient/create

**Response fields**

A unique ID identifying the recipient

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "recipient_id": "recipient-id-sandbox-9b6b4679-914b-445b-9450-efbdb80296f6",
  "request_id": "4zlKapIkTm8p5KM"
}
```

=\*=\*=\*=[#### `/payment_initiation/recipient/get`](/docs/api/products/payment-initiation/#payment_initiationrecipientget)

[#### Get payment recipient](/docs/api/products/payment-initiation/#get-payment-recipient)

Get details about a payment recipient you have previously created.

/payment\_initiation/recipient/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The ID of the recipient

Nodeâ¼

```
const request: PaymentInitiationRecipientGetRequest = {
  recipient_id: recipientID,
};
try {
  const response = await plaidClient.paymentInitiationRecipientGet(request);
  const recipientID = response.data.recipient_id;
  const name = response.data.name;
  const iban = response.data.iban;
  const address = response.data.address;
} catch (error) {
  // handle error
}
```

/payment\_initiation/recipient/get

**Response fields**

Collapse all

The ID of the recipient.

The name of the recipient.

The optional address of the payment recipient's bank account. Required by most institutions outside of the UK.

Hide object

An array of length 1-2 representing the street address where the recipient is located. Maximum of 70 characters.

Min items: `1`

Min length: `1`

The city where the recipient is located. Maximum of 35 characters.

Min length: `1`

Max length: `35`

The postal code where the recipient is located. Maximum of 16 characters.

Min length: `1`

Max length: `16`

The ISO 3166-1 alpha-2 country code where the recipient is located.

Min length: `2`

Max length: `2`

The International Bank Account Number (IBAN) for the recipient.

An object containing a Bacs account number and sort code. If an IBAN is not provided or if this recipient needs to accept domestic GBP-denominated payments, Bacs data is required.

Hide object

The account number of the account. Maximum of 10 characters.

Min length: `1`

Max length: `10`

The 6-character sort code of the account.

Min length: `6`

Max length: `6`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "recipient_id": "recipient-id-sandbox-9b6b4679-914b-445b-9450-efbdb80296f6",
  "name": "Wonder Wallet",
  "iban": "GB29NWBK60161331926819",
  "address": {
    "street": [
      "96 Guild Street",
      "9th Floor"
    ],
    "city": "London",
    "postal_code": "SE14 8JW",
    "country": "GB"
  },
  "request_id": "4zlKapIkTm8p5KM"
}
```

=\*=\*=\*=[#### `/payment_initiation/recipient/list`](/docs/api/products/payment-initiation/#payment_initiationrecipientlist)

[#### List payment recipients](/docs/api/products/payment-initiation/#list-payment-recipients)

The [`/payment_initiation/recipient/list`](/docs/api/products/payment-initiation/#payment_initiationrecipientlist) endpoint lists the payment recipients that you have previously created.

/payment\_initiation/recipient/list

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The maximum number of recipients to return. If `count` is not specified, a maximum of 100 recipients will be returned, beginning with the recipient at the cursor (if specified).

Minimum: `1`

Maximum: `100`

Default: `100`

A value representing the latest recipient to be included in the response. Set this from `next_cursor` received from the previous `/payment_initiation/recipient/list` request. If provided, the response will only contain that recipient and recipients created before it. If omitted, the response will contain recipients starting from the most recent, and in descending order by the `created_at` time.

Max length: `256`

Nodeâ¼

```
try {
  const response = await plaidClient.paymentInitiationRecipientList({});
  const recipients = response.data.recipients;
} catch (error) {
  // handle error
}
```

/payment\_initiation/recipient/list

**Response fields**

Collapse all

An array of payment recipients created for Payment Initiation

Hide object

The ID of the recipient.

The name of the recipient.

The optional address of the payment recipient's bank account. Required by most institutions outside of the UK.

Hide object

An array of length 1-2 representing the street address where the recipient is located. Maximum of 70 characters.

Min items: `1`

Min length: `1`

The city where the recipient is located. Maximum of 35 characters.

Min length: `1`

Max length: `35`

The postal code where the recipient is located. Maximum of 16 characters.

Min length: `1`

Max length: `16`

The ISO 3166-1 alpha-2 country code where the recipient is located.

Min length: `2`

Max length: `2`

The International Bank Account Number (IBAN) for the recipient.

An object containing a Bacs account number and sort code. If an IBAN is not provided or if this recipient needs to accept domestic GBP-denominated payments, Bacs data is required.

Hide object

The account number of the account. Maximum of 10 characters.

Min length: `1`

Max length: `10`

The 6-character sort code of the account.

Min length: `6`

Max length: `6`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

The value that, when used as the optional `cursor` parameter to `/payment_initiation/recipient/list`, will return the corresponding recipient as its first recipient.

Max length: `256`

Response Object

```
{
  "recipients": [
    {
      "recipient_id": "recipient-id-sandbox-9b6b4679-914b-445b-9450-efbdb80296f6",
      "name": "Wonder Wallet",
      "iban": "GB29NWBK60161331926819",
      "address": {
        "street": [
          "96 Guild Street",
          "9th Floor"
        ],
        "city": "London",
        "postal_code": "SE14 8JW",
        "country": "GB"
      }
    }
  ],
  "next_cursor": "YWJjMTIzIT8kKiYoKSctPUE",
  "request_id": "4zlKapIkTm8p5KM"
}
```

=\*=\*=\*=[#### `/payment_initiation/payment/create`](/docs/api/products/payment-initiation/#payment_initiationpaymentcreate)

[#### Create a payment](/docs/api/products/payment-initiation/#create-a-payment)

After creating a payment recipient, you can use the [`/payment_initiation/payment/create`](/docs/api/products/payment-initiation/#payment_initiationpaymentcreate) endpoint to create a payment to that recipient. Payments can be one-time or standing order (recurring) and can be denominated in EUR, GBP, or another chosen [currency](https://plaid.com/docs/api/products/payment-initiation/#payment_initiation-payment-create-request-amount-currency). If making domestic GBP-denominated payments, your recipient must have been created with Bacs numbers. In general, EUR-denominated payments will be sent via SEPA Credit Transfer, GBP-denominated payments will be sent via the Faster Payments network and for non-Eurozone markets typically via the local payment scheme, but the payment network used will be determined by the institution. Payments sent via Faster Payments will typically arrive immediately, while payments sent via SEPA Credit Transfer or other local payment schemes will typically arrive in one business day.

Standing orders (recurring payments) must be denominated in GBP and can only be sent to recipients in the UK. Once created, standing order payments cannot be modified or canceled via the API. An end user can cancel or modify a standing order directly on their banking application or website, or by contacting the bank. Standing orders will follow the payment rules of the underlying rails (Faster Payments in UK). Payments can be sent Monday to Friday, excluding bank holidays. If the pre-arranged date falls on a weekend or bank holiday, the payment is made on the next working day. It is not possible to guarantee the exact time the payment will reach the recipient's account, although at least 90% of standing order payments are sent by 6am.

/payment\_initiation/payment/create

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The ID of the recipient the payment is for.

A reference for the payment. This must be an alphanumeric string with at most 18 characters and must not contain any special characters (since not all institutions support them).
In order to track settlement via Payment Confirmation, each payment must have a unique reference. If the reference provided through the API is not unique, Plaid will adjust it.
Some institutions may limit the reference to less than 18 characters. If necessary, Plaid will adjust the reference by truncating it to fit the institution's requirements.
Both the originally provided and automatically adjusted references (if any) can be found in the `reference` and `adjusted_reference` fields, respectively.

Min length: `1`

Max length: `18`

The amount and currency of a payment

Hide object

The ISO-4217 currency code of the payment. For standing orders and payment consents, `"GBP"` must be used. For Poland, Denmark, Sweden and Norway, only the local currency is currently supported.

Possible values: `GBP`, `EUR`, `PLN`, `SEK`, `DKK`, `NOK`

Min length: `3`

Max length: `3`

The amount of the payment. Must contain at most two digits of precision e.g. `1.23`. Minimum accepted value is `1`.

Format: `double`

The schedule that the payment will be executed on. If a schedule is provided, the payment is automatically set up as a standing order. If no schedule is specified, the payment will be executed only once.

Hide object

The frequency interval of the payment.

Possible values: `WEEKLY`, `MONTHLY`

Min length: `1`

The day of the interval on which to schedule the payment.

If the payment interval is weekly, `interval_execution_day` should be an integer from 1 (Monday) to 7 (Sunday).

If the payment interval is monthly, `interval_execution_day` should be an integer indicating which day of the month to make the payment on. Integers from 1 to 28 can be used to make a payment on that day of the month. Negative integers from -1 to -5 can be used to make a payment relative to the end of the month. To make a payment on the last day of the month, use -1; to make the payment on the second-to-last day, use -2, and so on.

A date in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD). Standing order payments will begin on the first `interval_execution_day` on or after the `start_date`.

If the first `interval_execution_day` on or after the start date is also the same day that `/payment_initiation/payment/create` was called, the bank *may* make the first payment on that day, but it is not guaranteed to do so.

Format: `date`

A date in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD). Standing order payments will end on the last `interval_execution_day` on or before the `end_date`.
If the only `interval_execution_day` between the start date and the end date (inclusive) is also the same day that `/payment_initiation/payment/create` was called, the bank *may* make a payment on that day, but it is not guaranteed to do so.

Format: `date`

The start date sent to the bank after adjusting for holidays or weekends. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD). If the start date did not require adjustment, this field will be `null`.

Format: `date`

Additional payment options

Hide object

When `true`, Plaid will attempt to request refund details from the payee's financial institution. Support varies between financial institutions and will not always be available. If refund details could be retrieved, they will be available in the `/payment_initiation/payment/get` response.

The International Bank Account Number (IBAN) for the payer's account. Where possible, the end user will be able to send payments only from the specified bank account if provided.

Min length: `15`

Max length: `34`

An optional object used to restrict the accounts used for payments. If provided, the end user will be able to send payments only from the specified bank account.

Hide object

The account number of the account. Maximum of 10 characters.

Min length: `1`

Max length: `10`

The 6-character sort code of the account.

Min length: `6`

Max length: `6`

Payment scheme. If not specified - the default in the region will be used (e.g. `SEPA_CREDIT_TRANSFER` for EU). In responses, if the scheme is not explicitly specified in the request, this value will be `null`. Using unsupported values will result in a failed payment.

`LOCAL_DEFAULT`: The default payment scheme for the selected market and currency will be used.

`LOCAL_INSTANT`: The instant payment scheme for the selected market and currency will be used (if applicable). Fees may be applied by the institution.

`SEPA_CREDIT_TRANSFER`: The standard payment to a beneficiary within the SEPA area.

`SEPA_CREDIT_TRANSFER_INSTANT`: Instant payment within the SEPA area. May involve additional fees and may not be available at some banks.

Possible values: `null`, `LOCAL_DEFAULT`, `LOCAL_INSTANT`, `SEPA_CREDIT_TRANSFER`, `SEPA_CREDIT_TRANSFER_INSTANT`

Nodeâ¼

```
const request: PaymentInitiationPaymentCreateRequest = {
  recipient_id: recipientID,
  reference: 'TestPayment',
  amount: {
    currency: 'GBP',
    value: 100.0,
  },
};
try {
  const response = await plaidClient.paymentInitiationPaymentCreate(request);
  const paymentID = response.data.payment_id;
  const status = response.data.status;
} catch (error) {
  // handle error
}
```

/payment\_initiation/payment/create

**Response fields**

A unique ID identifying the payment

For a payment returned by this endpoint, there is only one possible value:

`PAYMENT_STATUS_INPUT_NEEDED`: The initial phase of the payment

Possible values: `PAYMENT_STATUS_INPUT_NEEDED`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "payment_id": "payment-id-sandbox-feca8a7a-5591-4aef-9297-f3062bb735d3",
  "status": "PAYMENT_STATUS_INPUT_NEEDED",
  "request_id": "4ciYVmesrySiUAB"
}
```

=\*=\*=\*=[#### `/payment_initiation/payment/get`](/docs/api/products/payment-initiation/#payment_initiationpaymentget)

[#### Get payment details](/docs/api/products/payment-initiation/#get-payment-details)

The [`/payment_initiation/payment/get`](/docs/api/products/payment-initiation/#payment_initiationpaymentget) endpoint can be used to check the status of a payment, as well as to receive basic information such as recipient and payment amount. In the case of standing orders, the [`/payment_initiation/payment/get`](/docs/api/products/payment-initiation/#payment_initiationpaymentget) endpoint will provide information about the status of the overall standing order itself; the API cannot be used to retrieve payment status for individual payments within a standing order.

Polling for status updates in Production is highly discouraged. Repeatedly calling [`/payment_initiation/payment/get`](/docs/api/products/payment-initiation/#payment_initiationpaymentget) to check a payment's status is unreliable and may trigger API rate limits. Only the `payment_status_update` webhook should be used to receive real-time status updates in Production.

In the case of standing orders, the [`/payment_initiation/payment/get`](/docs/api/products/payment-initiation/#payment_initiationpaymentget) endpoint will provide information about the status of the overall standing order itself; the API cannot be used to retrieve payment status for individual payments within a standing order.

/payment\_initiation/payment/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The `payment_id` returned from `/payment_initiation/payment/create`.

/payment\_initiation/payment/get

Nodeâ¼

```
const request: PaymentInitiationPaymentGetRequest = {
  payment_id: paymentID,
};
try {
  const response = await plaidClient.paymentInitiationPaymentGet(request);
  const paymentID = response.data.payment_id;
  const reference = response.data.reference;
  const amount = response.data.amount;
  const status = response.data.status;
  const lastStatusUpdate = response.data.last_status_update;
  const recipientID = response.data.recipient_id;
} catch (error) {
  // handle error
}
```

/payment\_initiation/payment/get

**Response fields**

Collapse all

The ID of the payment. Like all Plaid identifiers, the `payment_id` is case sensitive.

The amount and currency of a payment

Hide object

The ISO-4217 currency code of the payment. For standing orders and payment consents, `"GBP"` must be used. For Poland, Denmark, Sweden and Norway, only the local currency is currently supported.

Possible values: `GBP`, `EUR`, `PLN`, `SEK`, `DKK`, `NOK`

Min length: `3`

Max length: `3`

The amount of the payment. Must contain at most two digits of precision e.g. `1.23`. Minimum accepted value is `1`.

Format: `double`

The status of the payment.

Core lifecycle statuses:

**`PAYMENT_STATUS_INPUT_NEEDED`**: Transitional. The payment is awaiting user input to continue processing. It may re-enter this state if additional input is required.

**`PAYMENT_STATUS_AUTHORISING`:** Transitional. The payment is being authorised by the financial institution. It will automatically move on once authorisation completes.

**`PAYMENT_STATUS_INITIATED`:** The payment has been authorised and accepted by the financial institution. In many EU markets, `PAYMENT_STATUS_EXECUTED` is not supported, and a payment will remain in `PAYMENT_STATUS_INITIATED` until the funds settle, making this a terminal success state in those cases. A payment in `PAYMENT_STATUS_INITIATED` should be treated as a successfully submitted payment; do not gate downstream processing on reaching `PAYMENT_STATUS_EXECUTED`. For a full explanation of payment statuses and how to handle each, see the [Payment Status guide](https://plaid.com/docs/payment-initiation/payment-status/).

**`PAYMENT_STATUS_EXECUTED`: Terminal.** The funds have left the payer's account and the payment is en route to settlement. Note that this status does not confirm that funds have arrived in the recipient's account; do not use it as proof of fund receipt. Support is more common in the UK than in the EU; where unsupported, a successful payment remains in `PAYMENT_STATUS_INITIATED` before settling. When using Plaid Virtual Accounts, `PAYMENT_STATUS_EXECUTED` is not terminal -- the payment will continue to `PAYMENT_STATUS_SETTLED` once funds are available.

**`PAYMENT_STATUS_SETTLED`: Terminal.** The funds are available in the recipient's account. Only available to customers using [Plaid Virtual Accounts](https://plaid.com/docs/payment-initiation/virtual-accounts/).

Failure statuses:

**`PAYMENT_STATUS_INSUFFICIENT_FUNDS`: Terminal.** The payment failed due to insufficient funds. No further retries will succeed until the payer's balance is replenished.

**`PAYMENT_STATUS_FAILED`: Terminal (retryable).** The payment could not be initiated due to a system error or outage. Retry once the root cause is resolved.

**`PAYMENT_STATUS_BLOCKED`: Terminal (retryable).** The payment was blocked by Plaid (e.g., flagged as risky). Resolve any compliance or risk issues and retry.

**`PAYMENT_STATUS_REJECTED`: Terminal.** The payment was rejected by the financial institution. No automatic retry is possible.

**`PAYMENT_STATUS_CANCELLED`: Terminal.** The end user cancelled the payment during authorisation.

Standing-order statuses:

**`PAYMENT_STATUS_ESTABLISHED`: Terminal.** A recurring/standing order has been successfully created.

Deprecated (to be removed in a future release):

`PAYMENT_STATUS_UNKNOWN`: The payment status is unknown.

`PAYMENT_STATUS_PROCESSING`: The payment is currently being processed.

`PAYMENT_STATUS_COMPLETED`: Indicates that the standing order has been successfully established.

Possible values: `PAYMENT_STATUS_INPUT_NEEDED`, `PAYMENT_STATUS_PROCESSING`, `PAYMENT_STATUS_INITIATED`, `PAYMENT_STATUS_COMPLETED`, `PAYMENT_STATUS_INSUFFICIENT_FUNDS`, `PAYMENT_STATUS_FAILED`, `PAYMENT_STATUS_BLOCKED`, `PAYMENT_STATUS_UNKNOWN`, `PAYMENT_STATUS_EXECUTED`, `PAYMENT_STATUS_SETTLED`, `PAYMENT_STATUS_AUTHORISING`, `PAYMENT_STATUS_CANCELLED`, `PAYMENT_STATUS_ESTABLISHED`, `PAYMENT_STATUS_REJECTED`

The ID of the recipient

A reference for the payment.

The value of the reference sent to the bank after adjustment to pass bank validation rules.

The date and time of the last time the `status` was updated, in IS0 8601 format

Format: `date-time`

The schedule that the payment will be executed on. If a schedule is provided, the payment is automatically set up as a standing order. If no schedule is specified, the payment will be executed only once.

Hide object

The frequency interval of the payment.

Possible values: `WEEKLY`, `MONTHLY`

Min length: `1`

The day of the interval on which to schedule the payment.

If the payment interval is weekly, `interval_execution_day` should be an integer from 1 (Monday) to 7 (Sunday).

If the payment interval is monthly, `interval_execution_day` should be an integer indicating which day of the month to make the payment on. Integers from 1 to 28 can be used to make a payment on that day of the month. Negative integers from -1 to -5 can be used to make a payment relative to the end of the month. To make a payment on the last day of the month, use -1; to make the payment on the second-to-last day, use -2, and so on.

A date in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD). Standing order payments will begin on the first `interval_execution_day` on or after the `start_date`.

If the first `interval_execution_day` on or after the start date is also the same day that `/payment_initiation/payment/create` was called, the bank *may* make the first payment on that day, but it is not guaranteed to do so.

Format: `date`

A date in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD). Standing order payments will end on the last `interval_execution_day` on or before the `end_date`.
If the only `interval_execution_day` between the start date and the end date (inclusive) is also the same day that `/payment_initiation/payment/create` was called, the bank *may* make a payment on that day, but it is not guaranteed to do so.

Format: `date`

The start date sent to the bank after adjusting for holidays or weekends. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD). If the start date did not require adjustment, this field will be `null`.

Format: `date`

Details about external payment refund

Hide object

The name of the account holder.

The International Bank Account Number (IBAN) for the account.

An object containing a Bacs account number and sort code. If an IBAN is not provided or if this recipient needs to accept domestic GBP-denominated payments, Bacs data is required.

Hide object

The account number of the account. Maximum of 10 characters.

Min length: `1`

Max length: `10`

The 6-character sort code of the account.

Min length: `6`

Max length: `6`

An object containing a Bacs account number and sort code. If an IBAN is not provided or if this recipient needs to accept domestic GBP-denominated payments, Bacs data is required.

Hide object

The account number of the account. Maximum of 10 characters.

Min length: `1`

Max length: `10`

The 6-character sort code of the account.

Min length: `6`

Max length: `6`

The International Bank Account Number (IBAN) for the sender, if specified in the `/payment_initiation/payment/create` call.

Refund IDs associated with the payment.

The amount and currency of a payment

Hide object

The ISO-4217 currency code of the payment. For standing orders and payment consents, `"GBP"` must be used. For Poland, Denmark, Sweden and Norway, only the local currency is currently supported.

Possible values: `GBP`, `EUR`, `PLN`, `SEK`, `DKK`, `NOK`

Min length: `3`

Max length: `3`

The amount of the payment. Must contain at most two digits of precision e.g. `1.23`.

Format: `double`

Minimum: `0.01`

The EMI (E-Money Institution) wallet that this payment is associated with, if any. This wallet is used as an intermediary account to enable Plaid to reconcile the settlement of funds for Payment Initiation requests.

Payment scheme. If not specified - the default in the region will be used (e.g. `SEPA_CREDIT_TRANSFER` for EU). In responses, if the scheme is not explicitly specified in the request, this value will be `null`. Using unsupported values will result in a failed payment.

`LOCAL_DEFAULT`: The default payment scheme for the selected market and currency will be used.

`LOCAL_INSTANT`: The instant payment scheme for the selected market and currency will be used (if applicable). Fees may be applied by the institution.

`SEPA_CREDIT_TRANSFER`: The standard payment to a beneficiary within the SEPA area.

`SEPA_CREDIT_TRANSFER_INSTANT`: Instant payment within the SEPA area. May involve additional fees and may not be available at some banks.

Possible values: `null`, `LOCAL_DEFAULT`, `LOCAL_INSTANT`, `SEPA_CREDIT_TRANSFER`, `SEPA_CREDIT_TRANSFER_INSTANT`

Payment scheme. If not specified - the default in the region will be used (e.g. `SEPA_CREDIT_TRANSFER` for EU). In responses, if the scheme is not explicitly specified in the request, this value will be `null`. Using unsupported values will result in a failed payment.

`LOCAL_DEFAULT`: The default payment scheme for the selected market and currency will be used.

`LOCAL_INSTANT`: The instant payment scheme for the selected market and currency will be used (if applicable). Fees may be applied by the institution.

`SEPA_CREDIT_TRANSFER`: The standard payment to a beneficiary within the SEPA area.

`SEPA_CREDIT_TRANSFER_INSTANT`: Instant payment within the SEPA area. May involve additional fees and may not be available at some banks.

Possible values: `null`, `LOCAL_DEFAULT`, `LOCAL_INSTANT`, `SEPA_CREDIT_TRANSFER`, `SEPA_CREDIT_TRANSFER_INSTANT`

The payment consent ID that this payment was initiated with. Is present only when payment was initiated using the payment consent.

The transaction ID that this payment is associated with, if any. This is present only when a payment was initiated using virtual accounts.

A unique identifier assigned by Plaid to each payment for tracking and reconciliation purposes.

Note: Not all banks handle `end_to_end_id` consistently. To ensure accurate matching, clients should convert both the incoming `end_to_end_id` and the one provided by Plaid to the same case (either lower or upper) before comparison. For virtual account payments, Plaid manages this field automatically.

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

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "payment_id": "payment-id-sandbox-feca8a7a-5591-4aef-9297-f3062bb735d3",
  "reference": "Account Funding 99744",
  "amount": {
    "currency": "GBP",
    "value": 100
  },
  "status": "PAYMENT_STATUS_INITIATED",
  "last_status_update": "2019-11-06T21:10:52Z",
  "recipient_id": "recipient-id-sandbox-9b6b4679-914b-445b-9450-efbdb80296f6",
  "bacs": {
    "account": "31926819",
    "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
    "sort_code": "601613"
  },
  "end_to_end_id": "sptch8cde8390bfd363888",
  "iban": null,
  "request_id": "aEAQmewMzlVa1k6"
}
```

=\*=\*=\*=[#### `/payment_initiation/payment/list`](/docs/api/products/payment-initiation/#payment_initiationpaymentlist)

[#### List payments](/docs/api/products/payment-initiation/#list-payments)

The [`/payment_initiation/payment/list`](/docs/api/products/payment-initiation/#payment_initiationpaymentlist) endpoint can be used to retrieve all created payments. By default, the 10 most recent payments are returned. You can request more payments and paginate through the results using the optional `count` and `cursor` parameters.

/payment\_initiation/payment/list

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The maximum number of payments to return. If `count` is not specified, a maximum of 10 payments will be returned, beginning with the most recent payment before the cursor (if specified).

Minimum: `1`

Maximum: `200`

Default: `10`

A string in RFC 3339 format (i.e. "2019-12-06T22:35:49Z"). Only payments created before the cursor will be returned.

Format: `date-time`

The consent ID. If specified, only payments, executed using this consent, will be returned.

/payment\_initiation/payment/list

Nodeâ¼

```
const request: PaymentInitiationPaymentListRequest = {
  count: 10,
  cursor: '2019-12-06T22:35:49Z',
};
try {
  const response = await plaidClient.paymentInitiationPaymentList(request);
  const payments = response.data.payments;
  const nextCursor = response.data.next_cursor;
} catch (error) {
  // handle error
}
```

/payment\_initiation/payment/list

**Response fields**

Collapse all

An array of payments that have been created, associated with the given `client_id`.

Hide object

The ID of the payment. Like all Plaid identifiers, the `payment_id` is case sensitive.

The amount and currency of a payment

Hide object

The ISO-4217 currency code of the payment. For standing orders and payment consents, `"GBP"` must be used. For Poland, Denmark, Sweden and Norway, only the local currency is currently supported.

Possible values: `GBP`, `EUR`, `PLN`, `SEK`, `DKK`, `NOK`

Min length: `3`

Max length: `3`

The amount of the payment. Must contain at most two digits of precision e.g. `1.23`. Minimum accepted value is `1`.

Format: `double`

The status of the payment.

Core lifecycle statuses:

**`PAYMENT_STATUS_INPUT_NEEDED`**: Transitional. The payment is awaiting user input to continue processing. It may re-enter this state if additional input is required.

**`PAYMENT_STATUS_AUTHORISING`:** Transitional. The payment is being authorised by the financial institution. It will automatically move on once authorisation completes.

**`PAYMENT_STATUS_INITIATED`:** The payment has been authorised and accepted by the financial institution. In many EU markets, `PAYMENT_STATUS_EXECUTED` is not supported, and a payment will remain in `PAYMENT_STATUS_INITIATED` until the funds settle, making this a terminal success state in those cases. A payment in `PAYMENT_STATUS_INITIATED` should be treated as a successfully submitted payment; do not gate downstream processing on reaching `PAYMENT_STATUS_EXECUTED`. For a full explanation of payment statuses and how to handle each, see the [Payment Status guide](https://plaid.com/docs/payment-initiation/payment-status/).

**`PAYMENT_STATUS_EXECUTED`: Terminal.** The funds have left the payer's account and the payment is en route to settlement. Note that this status does not confirm that funds have arrived in the recipient's account; do not use it as proof of fund receipt. Support is more common in the UK than in the EU; where unsupported, a successful payment remains in `PAYMENT_STATUS_INITIATED` before settling. When using Plaid Virtual Accounts, `PAYMENT_STATUS_EXECUTED` is not terminal -- the payment will continue to `PAYMENT_STATUS_SETTLED` once funds are available.

**`PAYMENT_STATUS_SETTLED`: Terminal.** The funds are available in the recipient's account. Only available to customers using [Plaid Virtual Accounts](https://plaid.com/docs/payment-initiation/virtual-accounts/).

Failure statuses:

**`PAYMENT_STATUS_INSUFFICIENT_FUNDS`: Terminal.** The payment failed due to insufficient funds. No further retries will succeed until the payer's balance is replenished.

**`PAYMENT_STATUS_FAILED`: Terminal (retryable).** The payment could not be initiated due to a system error or outage. Retry once the root cause is resolved.

**`PAYMENT_STATUS_BLOCKED`: Terminal (retryable).** The payment was blocked by Plaid (e.g., flagged as risky). Resolve any compliance or risk issues and retry.

**`PAYMENT_STATUS_REJECTED`: Terminal.** The payment was rejected by the financial institution. No automatic retry is possible.

**`PAYMENT_STATUS_CANCELLED`: Terminal.** The end user cancelled the payment during authorisation.

Standing-order statuses:

**`PAYMENT_STATUS_ESTABLISHED`: Terminal.** A recurring/standing order has been successfully created.

Deprecated (to be removed in a future release):

`PAYMENT_STATUS_UNKNOWN`: The payment status is unknown.

`PAYMENT_STATUS_PROCESSING`: The payment is currently being processed.

`PAYMENT_STATUS_COMPLETED`: Indicates that the standing order has been successfully established.

Possible values: `PAYMENT_STATUS_INPUT_NEEDED`, `PAYMENT_STATUS_PROCESSING`, `PAYMENT_STATUS_INITIATED`, `PAYMENT_STATUS_COMPLETED`, `PAYMENT_STATUS_INSUFFICIENT_FUNDS`, `PAYMENT_STATUS_FAILED`, `PAYMENT_STATUS_BLOCKED`, `PAYMENT_STATUS_UNKNOWN`, `PAYMENT_STATUS_EXECUTED`, `PAYMENT_STATUS_SETTLED`, `PAYMENT_STATUS_AUTHORISING`, `PAYMENT_STATUS_CANCELLED`, `PAYMENT_STATUS_ESTABLISHED`, `PAYMENT_STATUS_REJECTED`

The ID of the recipient

A reference for the payment.

The value of the reference sent to the bank after adjustment to pass bank validation rules.

The date and time of the last time the `status` was updated, in IS0 8601 format

Format: `date-time`

The schedule that the payment will be executed on. If a schedule is provided, the payment is automatically set up as a standing order. If no schedule is specified, the payment will be executed only once.

Hide object

The frequency interval of the payment.

Possible values: `WEEKLY`, `MONTHLY`

Min length: `1`

The day of the interval on which to schedule the payment.

If the payment interval is weekly, `interval_execution_day` should be an integer from 1 (Monday) to 7 (Sunday).

If the payment interval is monthly, `interval_execution_day` should be an integer indicating which day of the month to make the payment on. Integers from 1 to 28 can be used to make a payment on that day of the month. Negative integers from -1 to -5 can be used to make a payment relative to the end of the month. To make a payment on the last day of the month, use -1; to make the payment on the second-to-last day, use -2, and so on.

A date in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD). Standing order payments will begin on the first `interval_execution_day` on or after the `start_date`.

If the first `interval_execution_day` on or after the start date is also the same day that `/payment_initiation/payment/create` was called, the bank *may* make the first payment on that day, but it is not guaranteed to do so.

Format: `date`

A date in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD). Standing order payments will end on the last `interval_execution_day` on or before the `end_date`.
If the only `interval_execution_day` between the start date and the end date (inclusive) is also the same day that `/payment_initiation/payment/create` was called, the bank *may* make a payment on that day, but it is not guaranteed to do so.

Format: `date`

The start date sent to the bank after adjusting for holidays or weekends. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD). If the start date did not require adjustment, this field will be `null`.

Format: `date`

Details about external payment refund

Hide object

The name of the account holder.

The International Bank Account Number (IBAN) for the account.

An object containing a Bacs account number and sort code. If an IBAN is not provided or if this recipient needs to accept domestic GBP-denominated payments, Bacs data is required.

Hide object

The account number of the account. Maximum of 10 characters.

Min length: `1`

Max length: `10`

The 6-character sort code of the account.

Min length: `6`

Max length: `6`

An object containing a Bacs account number and sort code. If an IBAN is not provided or if this recipient needs to accept domestic GBP-denominated payments, Bacs data is required.

Hide object

The account number of the account. Maximum of 10 characters.

Min length: `1`

Max length: `10`

The 6-character sort code of the account.

Min length: `6`

Max length: `6`

The International Bank Account Number (IBAN) for the sender, if specified in the `/payment_initiation/payment/create` call.

Refund IDs associated with the payment.

The amount and currency of a payment

Hide object

The ISO-4217 currency code of the payment. For standing orders and payment consents, `"GBP"` must be used. For Poland, Denmark, Sweden and Norway, only the local currency is currently supported.

Possible values: `GBP`, `EUR`, `PLN`, `SEK`, `DKK`, `NOK`

Min length: `3`

Max length: `3`

The amount of the payment. Must contain at most two digits of precision e.g. `1.23`.

Format: `double`

Minimum: `0.01`

The EMI (E-Money Institution) wallet that this payment is associated with, if any. This wallet is used as an intermediary account to enable Plaid to reconcile the settlement of funds for Payment Initiation requests.

Payment scheme. If not specified - the default in the region will be used (e.g. `SEPA_CREDIT_TRANSFER` for EU). In responses, if the scheme is not explicitly specified in the request, this value will be `null`. Using unsupported values will result in a failed payment.

`LOCAL_DEFAULT`: The default payment scheme for the selected market and currency will be used.

`LOCAL_INSTANT`: The instant payment scheme for the selected market and currency will be used (if applicable). Fees may be applied by the institution.

`SEPA_CREDIT_TRANSFER`: The standard payment to a beneficiary within the SEPA area.

`SEPA_CREDIT_TRANSFER_INSTANT`: Instant payment within the SEPA area. May involve additional fees and may not be available at some banks.

Possible values: `null`, `LOCAL_DEFAULT`, `LOCAL_INSTANT`, `SEPA_CREDIT_TRANSFER`, `SEPA_CREDIT_TRANSFER_INSTANT`

Payment scheme. If not specified - the default in the region will be used (e.g. `SEPA_CREDIT_TRANSFER` for EU). In responses, if the scheme is not explicitly specified in the request, this value will be `null`. Using unsupported values will result in a failed payment.

`LOCAL_DEFAULT`: The default payment scheme for the selected market and currency will be used.

`LOCAL_INSTANT`: The instant payment scheme for the selected market and currency will be used (if applicable). Fees may be applied by the institution.

`SEPA_CREDIT_TRANSFER`: The standard payment to a beneficiary within the SEPA area.

`SEPA_CREDIT_TRANSFER_INSTANT`: Instant payment within the SEPA area. May involve additional fees and may not be available at some banks.

Possible values: `null`, `LOCAL_DEFAULT`, `LOCAL_INSTANT`, `SEPA_CREDIT_TRANSFER`, `SEPA_CREDIT_TRANSFER_INSTANT`

The payment consent ID that this payment was initiated with. Is present only when payment was initiated using the payment consent.

The transaction ID that this payment is associated with, if any. This is present only when a payment was initiated using virtual accounts.

A unique identifier assigned by Plaid to each payment for tracking and reconciliation purposes.

Note: Not all banks handle `end_to_end_id` consistently. To ensure accurate matching, clients should convert both the incoming `end_to_end_id` and the one provided by Plaid to the same case (either lower or upper) before comparison. For virtual account payments, Plaid manages this field automatically.

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

The value that, when used as the optional `cursor` parameter to `/payment_initiation/payment/list`, will return the next unreturned payment as its first payment.

Format: `date-time`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "payments": [
    {
      "payment_id": "payment-id-sandbox-feca8a7a-5581-4aef-9297-f3062bb735d3",
      "reference": "Account Funding 99744",
      "amount": {
        "currency": "GBP",
        "value": 100
      },
      "status": "PAYMENT_STATUS_EXECUTED",
      "last_status_update": "2019-11-06T21:10:52Z",
      "recipient_id": "recipient-id-sandbox-9b6b4679-914b-445b-9450-efbdb80296f6",
      "bacs": {
        "account": "31926819",
        "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
        "sort_code": "601613"
      },
      "iban": "null,",
      "end_to_end_id": "sptch8cde8390bfd363888,"
    }
  ],
  "next_cursor": "2020-01-01T00:00:00Z",
  "request_id": "aEAQmewMzlVa1k6"
}
```

=\*=\*=\*=[#### `/payment_initiation/payment/reverse`](/docs/api/products/payment-initiation/#payment_initiationpaymentreverse)

[#### Reverse an existing payment](/docs/api/products/payment-initiation/#reverse-an-existing-payment)

Reverse a settled payment from a Plaid virtual account.

The original payment must be in a settled state to be refunded.
To refund partially, specify the amount as part of the request.
If the amount is not specified, the refund amount will be equal to all
of the remaining payment amount that has not been refunded yet.

The refund will go back to the source account that initiated the payment.
The original payment must have been initiated to a Plaid virtual account
so that this account can be used to initiate the refund.

Providing counterparty information such as date of birth and address increases
the likelihood of refund being successful without human intervention.

/payment\_initiation/payment/reverse

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The ID of the payment to reverse

A random key provided by the client, per unique wallet transaction. Maximum of 128 characters.

The API supports idempotency for safely retrying requests without accidentally performing the same operation twice. If a request to execute a wallet transaction fails due to a network connection error, then after a minimum delay of one minute, you can retry the request with the same idempotency key to guarantee that only a single wallet transaction is created. If the request was successfully processed, it will prevent any transaction that uses the same idempotency key, and was received within 24 hours of the first request, from being processed.

Max length: `128`

Min length: `1`

A reference for the refund. This must be an alphanumeric string with 6 to 18 characters and must not contain any special characters or spaces.

Max length: `18`

Min length: `6`

The amount and currency of a payment

Hide object

The ISO-4217 currency code of the payment. For standing orders and payment consents, `"GBP"` must be used. For Poland, Denmark, Sweden and Norway, only the local currency is currently supported.

Possible values: `GBP`, `EUR`, `PLN`, `SEK`, `DKK`, `NOK`

Min length: `3`

Max length: `3`

The amount of the payment. Must contain at most two digits of precision e.g. `1.23`.

Format: `double`

Minimum: `0.01`

The counterparty's birthdate, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) (YYYY-MM-DD) format.

Format: `date`

The optional address of the payment recipient's bank account. Required by most institutions outside of the UK.

Hide object

An array of length 1-2 representing the street address where the recipient is located. Maximum of 70 characters.

Min items: `1`

Min length: `1`

The city where the recipient is located. Maximum of 35 characters.

Min length: `1`

Max length: `35`

The postal code where the recipient is located. Maximum of 16 characters.

Min length: `1`

Max length: `16`

The ISO 3166-1 alpha-2 country code where the recipient is located.

Min length: `2`

Max length: `2`

/payment\_initiation/payment/reverse

Nodeâ¼

```
const request: PaymentInitiationPaymentReverseRequest = {
  payment_id: paymentID,
  reference: 'RefundABC123',
  idempotency_key: 'ae009325-df8d-4f52-b1e0-53ff26c23912',
};
try {
  const response = await plaidClient.paymentInitiationPaymentReverse(request);
  const refundID = response.data.refund_id;
  const status = response.data.status;
} catch (error) {
  // handle error
}
```

/payment\_initiation/payment/reverse

**Response fields**

A unique ID identifying the refund

The status of the transaction.

`AUTHORISING`: The transaction is being processed for validation and compliance.

`INITIATED`: The transaction has been initiated and is currently being processed.

`EXECUTED`: The transaction has been successfully executed and is considered complete. This is only applicable for debit transactions.

`SETTLED`: The transaction has settled and funds are available for use. This is only applicable for credit transactions. A transaction will typically settle within seconds to several days, depending on which payment rail is used.

`FAILED`: The transaction failed to process successfully. This is a terminal status.

`BLOCKED`: The transaction has been blocked for violating compliance rules. This is a terminal status.

Possible values: `AUTHORISING`, `INITIATED`, `EXECUTED`, `SETTLED`, `BLOCKED`, `FAILED`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "refund_id": "wallet-transaction-id-production-c5f8cd31-6cae-4cad-9b0d-f7c10be9cc4b",
  "request_id": "HtlKzBX0fMeF7mU",
  "status": "INITIATED"
}
```

=\*=\*=\*=[#### `/payment_initiation/consent/create`](/docs/api/products/payment-initiation/#payment_initiationconsentcreate)

[#### Create payment consent](/docs/api/products/payment-initiation/#create-payment-consent)

The [`/payment_initiation/consent/create`](/docs/api/products/payment-initiation/#payment_initiationconsentcreate) endpoint is used to create a payment consent, which can be used to initiate payments on behalf of the user. Payment consents are created with `UNAUTHORISED` status by default and must be authorised by the user before payments can be initiated.

Consents can be limited in time and scope, and have constraints that describe limitations for payments.

/payment\_initiation/consent/create

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The ID of the recipient the payment consent is for. The created consent can be used to transfer funds to this recipient only.

A reference for the payment consent. This must be an alphanumeric string with at most 18 characters and must not contain any special characters.

Min length: `1`

Max length: `18`

An array of payment consent scopes.

Min items: `1`

Possible values: `ME_TO_ME`, `EXTERNAL`

Payment consent type. Defines possible use case for payments made with the given consent.

`SWEEPING`: Allows moving money between accounts owned by the same user.

`COMMERCIAL`: Allows initiating payments from the user's account to third parties.

Possible values: `SWEEPING`, `COMMERCIAL`

Limitations that will be applied to payments initiated using the payment consent.

Hide object

Life span for the payment consent. After the `to` date the payment consent expires and can no longer be used for payment initiation.

Hide object

The date and time from which the consent should be active, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date-time`

The date and time at which the consent expires, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date-time`

Maximum amount of a single payment initiated using the payment consent.

Hide object

The ISO-4217 currency code of the payment. For standing orders and payment consents, `"GBP"` must be used. For Poland, Denmark, Sweden and Norway, only the local currency is currently supported.

Possible values: `GBP`, `EUR`, `PLN`, `SEK`, `DKK`, `NOK`

Min length: `3`

Max length: `3`

The amount of the payment. Must contain at most two digits of precision e.g. `1.23`. Minimum accepted value is `1`.

Format: `double`

A list of amount limitations per period of time.

Min items: `1`

Hide object

Maximum cumulative amount for all payments in the specified interval.

Hide object

The ISO-4217 currency code of the payment. For standing orders and payment consents, `"GBP"` must be used. For Poland, Denmark, Sweden and Norway, only the local currency is currently supported.

Possible values: `GBP`, `EUR`, `PLN`, `SEK`, `DKK`, `NOK`

Min length: `3`

Max length: `3`

The amount of the payment. Must contain at most two digits of precision e.g. `1.23`. Minimum accepted value is `1`.

Format: `double`

Payment consent periodic interval.

Possible values: `DAY`, `WEEK`, `MONTH`, `YEAR`

Where the payment consent period should start.

If the institution is Monzo, only `CONSENT` alignments are supported.

`CALENDAR`: line up with a calendar.

`CONSENT`: on the date of consent creation.

Possible values: `CALENDAR`, `CONSENT`

(Deprecated) Additional payment consent options. Please use `payer_details` to specify the account.

Hide object

When `true`, Plaid will attempt to request refund details from the payee's financial institution. Support varies between financial institutions and will not always be available. If refund details could be retrieved, they will be available in the `/payment_initiation/payment/get` response.

The International Bank Account Number (IBAN) for the payer's account. Where possible, the end user will be able to set up payment consent using only the specified bank account if provided.

Min length: `15`

Max length: `34`

An optional object used to restrict the accounts used for payments. If provided, the end user will be able to send payments only from the specified bank account.

Hide object

The account number of the account. Maximum of 10 characters.

Min length: `1`

Max length: `10`

The 6-character sort code of the account.

Min length: `6`

Max length: `6`

An object representing the payment consent payer details.
Payer `name` and account `numbers` are required to lock the account to which the consent can be created.

Hide object

The name of the payer as it appears in their bank account

Min length: `1`

The counterparty's bank account numbers. Exactly one of IBAN or Bacs data is required.

Hide object

An optional object used to restrict the accounts used for payments. If provided, the end user will be able to send payments only from the specified bank account.

Hide object

The account number of the account. Maximum of 10 characters.

Min length: `1`

Max length: `10`

The 6-character sort code of the account.

Min length: `6`

Max length: `6`

International Bank Account Number (IBAN).

Min length: `15`

Max length: `34`

The optional address of the payment recipient's bank account. Required by most institutions outside of the UK.

Hide object

An array of length 1-2 representing the street address where the recipient is located. Maximum of 70 characters.

Min items: `1`

Min length: `1`

The city where the recipient is located. Maximum of 35 characters.

Min length: `1`

Max length: `35`

The postal code where the recipient is located. Maximum of 16 characters.

Min length: `1`

Max length: `16`

The ISO 3166-1 alpha-2 country code where the recipient is located.

Min length: `2`

Max length: `2`

The payer's birthdate, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) (YYYY-MM-DD) format.

Format: `date`

The payer's phone numbers in E.164 format: +{countrycode}{number}

The payer's emails

/payment\_initiation/consent/create

Nodeâ¼

```
const request: PaymentInitiationConsentCreateRequest = {
  recipient_id: recipientID,
  reference: 'TestPaymentConsent',
  type: PaymentInitiationConsentType.Commercial,
  constraints: {
    valid_date_time: {
      to: '2024-12-31T23:59:59Z',
    },
    max_payment_amount: {
      currency: PaymentAmountCurrency.Gbp,
      value: 15,
    },
    periodic_amounts: [
      {
        amount: {
          currency: PaymentAmountCurrency.Gbp,
          value: 40,
        },
        alignment: PaymentConsentPeriodicAlignment.Calendar,
        interval: PaymentConsentPeriodicInterval.Month,
      },
    ],
  },
};

try {
  const response = await plaidClient.paymentInitiationConsentCreate(request);
  const consentID = response.data.consent_id;
  const status = response.data.status;
} catch (error) {
  // handle error
}
```

/payment\_initiation/consent/create

**Response fields**

A unique ID identifying the payment consent.

The status of the payment consent.

`UNAUTHORISED`: Consent created, but requires user authorisation.

`REJECTED`: Consent authorisation was rejected by the bank.

`AUTHORISED`: Consent is active and ready to be used.

`REVOKED`: Consent has been revoked and can no longer be used.

`EXPIRED`: Consent is no longer valid.

Possible values: `UNAUTHORISED`, `AUTHORISED`, `REVOKED`, `REJECTED`, `EXPIRED`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "consent_id": "consent-id-production-feca8a7a-5491-4444-9999-f3062bb735d3",
  "status": "UNAUTHORISED",
  "request_id": "4ciYmmesdqSiUAB"
}
```

=\*=\*=\*=[#### `/payment_initiation/consent/get`](/docs/api/products/payment-initiation/#payment_initiationconsentget)

[#### Get payment consent](/docs/api/products/payment-initiation/#get-payment-consent)

The [`/payment_initiation/consent/get`](/docs/api/products/payment-initiation/#payment_initiationconsentget) endpoint can be used to check the status of a payment consent, as well as to receive basic information such as recipient and constraints.

/payment\_initiation/consent/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The `consent_id` returned from `/payment_initiation/consent/create`.

Nodeâ¼

```
const request: PaymentInitiationConsentGetRequest = {
  consent_id: consentID,
};

try {
  const response = await plaidClient.paymentInitiationConsentGet(request);
  const consentID = response.data.consent_id;
  const status = response.data.status;
} catch (error) {
  // handle error
}
```

/payment\_initiation/consent/get

**Response fields**

Collapse all

The consent ID.

Min length: `1`

The status of the payment consent.

`UNAUTHORISED`: Consent created, but requires user authorisation.

`REJECTED`: Consent authorisation was rejected by the bank.

`AUTHORISED`: Consent is active and ready to be used.

`REVOKED`: Consent has been revoked and can no longer be used.

`EXPIRED`: Consent is no longer valid.

Possible values: `UNAUTHORISED`, `AUTHORISED`, `REVOKED`, `REJECTED`, `EXPIRED`

Consent creation timestamp, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date-time`

The ID of the recipient the payment consent is for.

Min length: `1`

A reference for the payment consent.

Limitations that will be applied to payments initiated using the payment consent.

Hide object

Life span for the payment consent. After the `to` date the payment consent expires and can no longer be used for payment initiation.

Hide object

The date and time from which the consent should be active, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date-time`

The date and time at which the consent expires, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date-time`

Maximum amount of a single payment initiated using the payment consent.

Hide object

The ISO-4217 currency code of the payment. For standing orders and payment consents, `"GBP"` must be used. For Poland, Denmark, Sweden and Norway, only the local currency is currently supported.

Possible values: `GBP`, `EUR`, `PLN`, `SEK`, `DKK`, `NOK`

Min length: `3`

Max length: `3`

The amount of the payment. Must contain at most two digits of precision e.g. `1.23`. Minimum accepted value is `1`.

Format: `double`

A list of amount limitations per period of time.

Min items: `1`

Hide object

Maximum cumulative amount for all payments in the specified interval.

Hide object

The ISO-4217 currency code of the payment. For standing orders and payment consents, `"GBP"` must be used. For Poland, Denmark, Sweden and Norway, only the local currency is currently supported.

Possible values: `GBP`, `EUR`, `PLN`, `SEK`, `DKK`, `NOK`

Min length: `3`

Max length: `3`

The amount of the payment. Must contain at most two digits of precision e.g. `1.23`. Minimum accepted value is `1`.

Format: `double`

Payment consent periodic interval.

Possible values: `DAY`, `WEEK`, `MONTH`, `YEAR`

Where the payment consent period should start.

If the institution is Monzo, only `CONSENT` alignments are supported.

`CALENDAR`: line up with a calendar.

`CONSENT`: on the date of consent creation.

Possible values: `CALENDAR`, `CONSENT`

Deprecated, use the 'type' field instead.

Possible values: `ME_TO_ME`, `EXTERNAL`

Payment consent type. Defines possible use case for payments made with the given consent.

`SWEEPING`: Allows moving money between accounts owned by the same user.

`COMMERCIAL`: Allows initiating payments from the user's account to third parties.

Possible values: `SWEEPING`, `COMMERCIAL`

Details about external payment refund

Hide object

The name of the account holder.

The International Bank Account Number (IBAN) for the account.

An object containing a Bacs account number and sort code. If an IBAN is not provided or if this recipient needs to accept domestic GBP-denominated payments, Bacs data is required.

Hide object

The account number of the account. Maximum of 10 characters.

Min length: `1`

Max length: `10`

The 6-character sort code of the account.

Min length: `6`

Max length: `6`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "4ciYuuesdqSiUAB",
  "consent_id": "consent-id-production-feca8a7a-5491-4aef-9298-f3062bb735d3",
  "status": "AUTHORISED",
  "created_at": "2021-10-30T15:26:48Z",
  "recipient_id": "recipient-id-production-9b6b4679-914b-445b-9450-efbdb80296f6",
  "reference": "ref-00001",
  "constraints": {
    "valid_date_time": {
      "from": "2021-12-25T11:12:13Z",
      "to": "2022-12-31T15:26:48Z"
    },
    "max_payment_amount": {
      "currency": "GBP",
      "value": 100
    },
    "periodic_amounts": [
      {
        "amount": {
          "currency": "GBP",
          "value": 300
        },
        "interval": "WEEK",
        "alignment": "CALENDAR"
      }
    ]
  },
  "type": "SWEEPING"
}
```

=\*=\*=\*=[#### `/payment_initiation/consent/revoke`](/docs/api/products/payment-initiation/#payment_initiationconsentrevoke)

[#### Revoke payment consent](/docs/api/products/payment-initiation/#revoke-payment-consent)

The [`/payment_initiation/consent/revoke`](/docs/api/products/payment-initiation/#payment_initiationconsentrevoke) endpoint can be used to revoke the payment consent. Once the consent is revoked, it is not possible to initiate payments using it.

/payment\_initiation/consent/revoke

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The consent ID.

Nodeâ¼

```
const request: PaymentInitiationConsentRevokeRequest = {
  consent_id: consentID,
};
try {
  const response = await plaidClient.paymentInitiationConsentRevoke(request);
} catch (error) {
  // handle error
}
```

/payment\_initiation/consent/revoke

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "4ciYaaesdqSiUAB"
}
```

=\*=\*=\*=[#### `/payment_initiation/consent/payment/execute`](/docs/api/products/payment-initiation/#payment_initiationconsentpaymentexecute)

[#### Execute a single payment using consent](/docs/api/products/payment-initiation/#execute-a-single-payment-using-consent)

The [`/payment_initiation/consent/payment/execute`](/docs/api/products/payment-initiation/#payment_initiationconsentpaymentexecute) endpoint can be used to execute payments using payment consent.

/payment\_initiation/consent/payment/execute

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The consent ID.

The amount and currency of a payment

Hide object

The ISO-4217 currency code of the payment. For standing orders and payment consents, `"GBP"` must be used. For Poland, Denmark, Sweden and Norway, only the local currency is currently supported.

Possible values: `GBP`, `EUR`, `PLN`, `SEK`, `DKK`, `NOK`

Min length: `3`

Max length: `3`

The amount of the payment. Must contain at most two digits of precision e.g. `1.23`. Minimum accepted value is `1`.

Format: `double`

A random key provided by the client, per unique consent payment. Maximum of 128 characters.

The API supports idempotency for safely retrying requests without accidentally performing the same operation twice. If a request to execute a consent payment fails due to a network connection error, you can retry the request with the same idempotency key to guarantee that only a single payment is created. If the request was successfully processed, it will prevent any payment that uses the same idempotency key, and was received within 48 hours of the first request, from being processed.

Max length: `128`

Min length: `1`

A reference for the payment. This must be an alphanumeric string with at most 18 characters and must not contain any special characters (since not all institutions support them).
If not provided, Plaid will automatically fall back to the reference from consent. In order to track settlement via Payment Confirmation, each payment must have a unique reference. If the reference provided through the API is not unique, Plaid will adjust it.
Some institutions may limit the reference to less than 18 characters. If necessary, Plaid will adjust the reference by truncating it to fit the institution's requirements.
Both the originally provided and automatically adjusted references (if any) can be found in the `reference` and `adjusted_reference` fields, respectively.

Min length: `1`

Max length: `18`

Deprecated, payments will be executed within the type of the consent.

A scope of the payment. Must be one of the scopes mentioned in the consent.
Optional if the appropriate consent has only one scope defined, required otherwise.

Possible values: `ME_TO_ME`, `EXTERNAL`

Decides the mode under which the payment processing should be performed, using `IMMEDIATE` as default.

`IMMEDIATE`: Will immediately execute the payment, waiting for a response from the ASPSP before returning the result of the payment initiation. This is ideal for user-present flows.

`ASYNC`: Will accept a payment execution request and schedule it for processing, immediately returning the new `payment_id`. Listen for webhooks to obtain real-time updates on the payment status. This is ideal for non user-present flows.

Possible values: `ASYNC`, `IMMEDIATE`

/payment\_initiation/consent/payment/execute

Nodeâ¼

```
const request: PaymentInitiationConsentPaymentExecuteRequest = {
  consent_id: consentID,
  amount: {
    currency: PaymentAmountCurrency.Gbp,
    value: 7.99,
  },
  reference: 'Payment1',
  idempotency_key: idempotencyKey,
};
try {
  const response = await plaidClient.paymentInitiationConsentPaymentExecute(
    request,
  );
  const paymentID = response.data.payment_id;
  const status = response.data.status;
} catch (error) {
  // handle error
}
```

/payment\_initiation/consent/payment/execute

**Response fields**

Collapse all

A unique ID identifying the payment

The status of the payment.

Core lifecycle statuses:

**`PAYMENT_STATUS_INPUT_NEEDED`**: Transitional. The payment is awaiting user input to continue processing. It may re-enter this state if additional input is required.

**`PAYMENT_STATUS_AUTHORISING`:** Transitional. The payment is being authorised by the financial institution. It will automatically move on once authorisation completes.

**`PAYMENT_STATUS_INITIATED`:** The payment has been authorised and accepted by the financial institution. In many EU markets, `PAYMENT_STATUS_EXECUTED` is not supported, and a payment will remain in `PAYMENT_STATUS_INITIATED` until the funds settle, making this a terminal success state in those cases. A payment in `PAYMENT_STATUS_INITIATED` should be treated as a successfully submitted payment; do not gate downstream processing on reaching `PAYMENT_STATUS_EXECUTED`. For a full explanation of payment statuses and how to handle each, see the [Payment Status guide](https://plaid.com/docs/payment-initiation/payment-status/).

**`PAYMENT_STATUS_EXECUTED`: Terminal.** The funds have left the payer's account and the payment is en route to settlement. Note that this status does not confirm that funds have arrived in the recipient's account; do not use it as proof of fund receipt. Support is more common in the UK than in the EU; where unsupported, a successful payment remains in `PAYMENT_STATUS_INITIATED` before settling. When using Plaid Virtual Accounts, `PAYMENT_STATUS_EXECUTED` is not terminal -- the payment will continue to `PAYMENT_STATUS_SETTLED` once funds are available.

**`PAYMENT_STATUS_SETTLED`: Terminal.** The funds are available in the recipient's account. Only available to customers using [Plaid Virtual Accounts](https://plaid.com/docs/payment-initiation/virtual-accounts/).

Failure statuses:

**`PAYMENT_STATUS_INSUFFICIENT_FUNDS`: Terminal.** The payment failed due to insufficient funds. No further retries will succeed until the payer's balance is replenished.

**`PAYMENT_STATUS_FAILED`: Terminal (retryable).** The payment could not be initiated due to a system error or outage. Retry once the root cause is resolved.

**`PAYMENT_STATUS_BLOCKED`: Terminal (retryable).** The payment was blocked by Plaid (e.g., flagged as risky). Resolve any compliance or risk issues and retry.

**`PAYMENT_STATUS_REJECTED`: Terminal.** The payment was rejected by the financial institution. No automatic retry is possible.

**`PAYMENT_STATUS_CANCELLED`: Terminal.** The end user cancelled the payment during authorisation.

Standing-order statuses:

**`PAYMENT_STATUS_ESTABLISHED`: Terminal.** A recurring/standing order has been successfully created.

Deprecated (to be removed in a future release):

`PAYMENT_STATUS_UNKNOWN`: The payment status is unknown.

`PAYMENT_STATUS_PROCESSING`: The payment is currently being processed.

`PAYMENT_STATUS_COMPLETED`: Indicates that the standing order has been successfully established.

Possible values: `PAYMENT_STATUS_INPUT_NEEDED`, `PAYMENT_STATUS_PROCESSING`, `PAYMENT_STATUS_INITIATED`, `PAYMENT_STATUS_COMPLETED`, `PAYMENT_STATUS_INSUFFICIENT_FUNDS`, `PAYMENT_STATUS_FAILED`, `PAYMENT_STATUS_BLOCKED`, `PAYMENT_STATUS_UNKNOWN`, `PAYMENT_STATUS_EXECUTED`, `PAYMENT_STATUS_SETTLED`, `PAYMENT_STATUS_AUTHORISING`, `PAYMENT_STATUS_CANCELLED`, `PAYMENT_STATUS_ESTABLISHED`, `PAYMENT_STATUS_REJECTED`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

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

Response Object

```
{
  "payment_id": "payment-id-sandbox-feca8a7a-5591-4aef-9297-f3062bb735d3",
  "request_id": "4ciYccesdqSiUAB",
  "status": "PAYMENT_STATUS_INITIATED"
}
```

[### Webhooks](/docs/api/products/payment-initiation/#webhooks)

Updates are sent to indicate that the status of an initiated payment has changed. All Payment Initiation webhooks have a `webhook_type` of `PAYMENT_INITIATION`.

=\*=\*=\*=[#### `PAYMENT_STATUS_UPDATE`](/docs/api/products/payment-initiation/#payment_status_update)

Fired when the status of a payment has changed. For a full explanation of payment statuses and how to handle each, see the [Payment Status guide](https://plaid.com/docs/payment-initiation/payment-status/).

Note: For standard Payment Initiation, Plaid payment statuses do not constitute proof that funds have arrived in the recipient's account, and you should not use `new_payment_status` to confirm fund settlement. For options that provide confirmation of fund receipt, see [Virtual Accounts](https://plaid.com/docs/payment-initiation/virtual-accounts/payment-confirmation/).

**Properties**

Collapse all

`PAYMENT_INITIATION`

`PAYMENT_STATUS_UPDATE`

The `payment_id` for the payment being updated

The transaction ID that this payment is associated with, if any. This is present only when a payment was initiated using virtual accounts.

The status of the payment.

Core lifecycle statuses:

**`PAYMENT_STATUS_INPUT_NEEDED`**: Transitional. The payment is awaiting user input to continue processing. It may re-enter this state if additional input is required.

**`PAYMENT_STATUS_AUTHORISING`:** Transitional. The payment is being authorised by the financial institution. It will automatically move on once authorisation completes.

**`PAYMENT_STATUS_INITIATED`:** The payment has been authorised and accepted by the financial institution. In many EU markets, `PAYMENT_STATUS_EXECUTED` is not supported, and a payment will remain in `PAYMENT_STATUS_INITIATED` until the funds settle, making this a terminal success state in those cases. A payment in `PAYMENT_STATUS_INITIATED` should be treated as a successfully submitted payment; do not gate downstream processing on reaching `PAYMENT_STATUS_EXECUTED`. For a full explanation of payment statuses and how to handle each, see the [Payment Status guide](https://plaid.com/docs/payment-initiation/payment-status/).

**`PAYMENT_STATUS_EXECUTED`: Terminal.** The funds have left the payer's account and the payment is en route to settlement. Note that this status does not confirm that funds have arrived in the recipient's account; do not use it as proof of fund receipt. Support is more common in the UK than in the EU; where unsupported, a successful payment remains in `PAYMENT_STATUS_INITIATED` before settling. When using Plaid Virtual Accounts, `PAYMENT_STATUS_EXECUTED` is not terminal -- the payment will continue to `PAYMENT_STATUS_SETTLED` once funds are available.

**`PAYMENT_STATUS_SETTLED`: Terminal.** The funds are available in the recipient's account. Only available to customers using [Plaid Virtual Accounts](https://plaid.com/docs/payment-initiation/virtual-accounts/).

Failure statuses:

**`PAYMENT_STATUS_INSUFFICIENT_FUNDS`: Terminal.** The payment failed due to insufficient funds. No further retries will succeed until the payer's balance is replenished.

**`PAYMENT_STATUS_FAILED`: Terminal (retryable).** The payment could not be initiated due to a system error or outage. Retry once the root cause is resolved.

**`PAYMENT_STATUS_BLOCKED`: Terminal (retryable).** The payment was blocked by Plaid (e.g., flagged as risky). Resolve any compliance or risk issues and retry.

**`PAYMENT_STATUS_REJECTED`: Terminal.** The payment was rejected by the financial institution. No automatic retry is possible.

**`PAYMENT_STATUS_CANCELLED`: Terminal.** The end user cancelled the payment during authorisation.

Standing-order statuses:

**`PAYMENT_STATUS_ESTABLISHED`: Terminal.** A recurring/standing order has been successfully created.

Deprecated (to be removed in a future release):

`PAYMENT_STATUS_UNKNOWN`: The payment status is unknown.

`PAYMENT_STATUS_PROCESSING`: The payment is currently being processed.

`PAYMENT_STATUS_COMPLETED`: Indicates that the standing order has been successfully established.

Possible values: `PAYMENT_STATUS_INPUT_NEEDED`, `PAYMENT_STATUS_PROCESSING`, `PAYMENT_STATUS_INITIATED`, `PAYMENT_STATUS_COMPLETED`, `PAYMENT_STATUS_INSUFFICIENT_FUNDS`, `PAYMENT_STATUS_FAILED`, `PAYMENT_STATUS_BLOCKED`, `PAYMENT_STATUS_UNKNOWN`, `PAYMENT_STATUS_EXECUTED`, `PAYMENT_STATUS_SETTLED`, `PAYMENT_STATUS_AUTHORISING`, `PAYMENT_STATUS_CANCELLED`, `PAYMENT_STATUS_ESTABLISHED`, `PAYMENT_STATUS_REJECTED`

The status of the payment.

Core lifecycle statuses:

**`PAYMENT_STATUS_INPUT_NEEDED`**: Transitional. The payment is awaiting user input to continue processing. It may re-enter this state if additional input is required.

**`PAYMENT_STATUS_AUTHORISING`:** Transitional. The payment is being authorised by the financial institution. It will automatically move on once authorisation completes.

**`PAYMENT_STATUS_INITIATED`:** The payment has been authorised and accepted by the financial institution. In many EU markets, `PAYMENT_STATUS_EXECUTED` is not supported, and a payment will remain in `PAYMENT_STATUS_INITIATED` until the funds settle, making this a terminal success state in those cases. A payment in `PAYMENT_STATUS_INITIATED` should be treated as a successfully submitted payment; do not gate downstream processing on reaching `PAYMENT_STATUS_EXECUTED`. For a full explanation of payment statuses and how to handle each, see the [Payment Status guide](https://plaid.com/docs/payment-initiation/payment-status/).

**`PAYMENT_STATUS_EXECUTED`: Terminal.** The funds have left the payer's account and the payment is en route to settlement. Note that this status does not confirm that funds have arrived in the recipient's account; do not use it as proof of fund receipt. Support is more common in the UK than in the EU; where unsupported, a successful payment remains in `PAYMENT_STATUS_INITIATED` before settling. When using Plaid Virtual Accounts, `PAYMENT_STATUS_EXECUTED` is not terminal -- the payment will continue to `PAYMENT_STATUS_SETTLED` once funds are available.

**`PAYMENT_STATUS_SETTLED`: Terminal.** The funds are available in the recipient's account. Only available to customers using [Plaid Virtual Accounts](https://plaid.com/docs/payment-initiation/virtual-accounts/).

Failure statuses:

**`PAYMENT_STATUS_INSUFFICIENT_FUNDS`: Terminal.** The payment failed due to insufficient funds. No further retries will succeed until the payer's balance is replenished.

**`PAYMENT_STATUS_FAILED`: Terminal (retryable).** The payment could not be initiated due to a system error or outage. Retry once the root cause is resolved.

**`PAYMENT_STATUS_BLOCKED`: Terminal (retryable).** The payment was blocked by Plaid (e.g., flagged as risky). Resolve any compliance or risk issues and retry.

**`PAYMENT_STATUS_REJECTED`: Terminal.** The payment was rejected by the financial institution. No automatic retry is possible.

**`PAYMENT_STATUS_CANCELLED`: Terminal.** The end user cancelled the payment during authorisation.

Standing-order statuses:

**`PAYMENT_STATUS_ESTABLISHED`: Terminal.** A recurring/standing order has been successfully created.

Deprecated (to be removed in a future release):

`PAYMENT_STATUS_UNKNOWN`: The payment status is unknown.

`PAYMENT_STATUS_PROCESSING`: The payment is currently being processed.

`PAYMENT_STATUS_COMPLETED`: Indicates that the standing order has been successfully established.

Possible values: `PAYMENT_STATUS_INPUT_NEEDED`, `PAYMENT_STATUS_PROCESSING`, `PAYMENT_STATUS_INITIATED`, `PAYMENT_STATUS_COMPLETED`, `PAYMENT_STATUS_INSUFFICIENT_FUNDS`, `PAYMENT_STATUS_FAILED`, `PAYMENT_STATUS_BLOCKED`, `PAYMENT_STATUS_UNKNOWN`, `PAYMENT_STATUS_EXECUTED`, `PAYMENT_STATUS_SETTLED`, `PAYMENT_STATUS_AUTHORISING`, `PAYMENT_STATUS_CANCELLED`, `PAYMENT_STATUS_ESTABLISHED`, `PAYMENT_STATUS_REJECTED`

The original value of the reference when creating the payment.

The value of the reference sent to the bank after adjustment to pass bank validation rules.

The original value of the `start_date` provided during the creation of a standing order. If the payment is not a standing order, this field will be `null`.

Format: `date`

The start date sent to the bank after adjusting for holidays or weekends. Will be provided in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DD). If the start date did not require adjustment, or if the payment is not a standing order, this field will be `null`.

Format: `date`

The timestamp of the update, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format, e.g. `"2017-09-14T14:42:19.350Z"`

Format: `date-time`

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

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "PAYMENT_INITIATION",
  "webhook_code": "PAYMENT_STATUS_UPDATE",
  "payment_id": "payment-id-production-2ba30780-d549-4335-b1fe-c2a938aa39d2",
  "new_payment_status": "PAYMENT_STATUS_INITIATED",
  "old_payment_status": "PAYMENT_STATUS_PROCESSING",
  "original_reference": "Account Funding 99744",
  "adjusted_reference": "Account Funding 99",
  "original_start_date": "2017-09-14",
  "adjusted_start_date": "2017-09-15",
  "timestamp": "2017-09-14T14:42:19.350Z",
  "environment": "production"
}
```

=\*=\*=\*=[#### `CONSENT_STATUS_UPDATE`](/docs/api/products/payment-initiation/#consent_status_update)

Fired when the status of a payment consent has changed.

**Properties**

Collapse all

`PAYMENT_INITIATION`

`CONSENT_STATUS_UPDATE`

The `id` for the consent being updated

The status of the payment consent.

`UNAUTHORISED`: Consent created, but requires user authorisation.

`REJECTED`: Consent authorisation was rejected by the bank.

`AUTHORISED`: Consent is active and ready to be used.

`REVOKED`: Consent has been revoked and can no longer be used.

`EXPIRED`: Consent is no longer valid.

Possible values: `UNAUTHORISED`, `AUTHORISED`, `REVOKED`, `REJECTED`, `EXPIRED`

The status of the payment consent.

`UNAUTHORISED`: Consent created, but requires user authorisation.

`REJECTED`: Consent authorisation was rejected by the bank.

`AUTHORISED`: Consent is active and ready to be used.

`REVOKED`: Consent has been revoked and can no longer be used.

`EXPIRED`: Consent is no longer valid.

Possible values: `UNAUTHORISED`, `AUTHORISED`, `REVOKED`, `REJECTED`, `EXPIRED`

The timestamp of the update, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format, e.g. `"2017-09-14T14:42:19.350Z"`

Format: `date-time`

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

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "PAYMENT_INITIATION",
  "webhook_code": "CONSENT_STATUS_UPDATE",
  "consent_id": "payment-consent-id-production-e7258765-69f9-46b1-9c67-d2800448e5ff",
  "old_status": "UNAUTHORISED",
  "new_status": "AUTHORISED",
  "timestamp": "2017-09-14T14:42:19.350Z",
  "environment": "production"
}
```
