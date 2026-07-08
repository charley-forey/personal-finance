---
title: "Virtual Accounts"
source_url: "https://plaid.com/docs/api/products/virtual-accounts/"
section: "Payments and Funding"
section_id: "01-payments-and-funding"
slug: "virtual-accounts"
endpoints:
  - "/wallet/create"
  - "/wallet/get"
  - "/wallet/list"
  - "/wallet/transaction/execute"
  - "/wallet/transaction/get"
  - "/wallet/transaction/list"
  - "/payment_initiation/payment/reverse"
  - "WALLET_TRANSACTION_STATUS_UPDATE"
  - "Webhooks"
  - "webhook_type"
  - "webhook_code"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Virtual Accounts (UK and Europe)

> **Source:** [https://plaid.com/docs/api/products/virtual-accounts/](https://plaid.com/docs/api/products/virtual-accounts/)
> **Section:** Payments and Funding

## Endpoints & Webhooks on this page

- `/wallet/create`
- `/wallet/get`
- `/wallet/list`
- `/wallet/transaction/execute`
- `/wallet/transaction/get`
- `/wallet/transaction/list`
- `/payment_initiation/payment/reverse`
- `WALLET_TRANSACTION_STATUS_UPDATE`
- `Webhooks`
- `webhook_type`
- `webhook_code`

---

# Virtual Accounts (UK and Europe)

#### API reference for Virtual Accounts endpoints and webhooks

Manage the entire lifecycle of a payment. For how-to guidance, see the [Virtual Accounts documentation](/docs/payment-initiation/virtual-accounts/).

| Endpoints |  |
| --- | --- |
| [`/wallet/create`](/docs/api/products/virtual-accounts/#walletcreate) | Create a virtual account |
| [`/wallet/get`](/docs/api/products/virtual-accounts/#walletget) | Fetch a virtual account |
| [`/wallet/list`](/docs/api/products/virtual-accounts/#walletlist) | List all virtual accounts |
| [`/wallet/transaction/execute`](/docs/api/products/virtual-accounts/#wallettransactionexecute) | Execute a transaction |
| [`/wallet/transaction/get`](/docs/api/products/virtual-accounts/#wallettransactionget) | Fetch a transaction |
| [`/wallet/transaction/list`](/docs/api/products/virtual-accounts/#wallettransactionlist) | List all transactions |

| See also |  |
| --- | --- |
| [`/payment_initiation/payment/reverse`](/docs/api/products/payment-initiation/#payment_initiationpaymentreverse) | Refund a payment from a virtual account |

| Webhooks |  |
| --- | --- |
| [`WALLET_TRANSACTION_STATUS_UPDATE`](/docs/api/products/virtual-accounts/#wallet_transaction_status_update) | The status of a transaction has changed |

[### Endpoints](/docs/api/products/virtual-accounts/#endpoints)=\*=\*=\*=[#### `/wallet/create`](/docs/api/products/virtual-accounts/#walletcreate)

[#### Create an e-wallet](/docs/api/products/virtual-accounts/#create-an-e-wallet)

Create an e-wallet. The response is the newly created e-wallet object.

/wallet/create

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

An ISO-4217 currency code, used with e-wallets and transactions.

Possible values: `GBP`, `EUR`

Min length: `3`

Max length: `3`

/wallet/create

Nodeâ¼

```
const request: WalletCreateRequest = {
  iso_currency_code: isoCurrencyCode,
};
try {
  const response = await plaidClient.walletCreate(request);
  const walletID = response.data.wallet_id;
  const balance = response.data.balance;
  const numbers = response.data.numbers;
  const recipientID = response.data.recipient_id;
} catch (error) {
  // handle error
}
```

/wallet/create

**Response fields**

Collapse all

A unique ID identifying the e-wallet

An object representing the e-wallet balance

Hide object

The ISO-4217 currency code of the balance

The total amount of funds in the account

Format: `double`

The total amount of funds in the account after subtracting pending debit transaction amounts

Format: `double`

An object representing the e-wallet account numbers

Hide object

An object containing a Bacs account number and sort code. If an IBAN is not provided or if you need to accept domestic GBP-denominated payments, Bacs data is required.

Hide object

The account number of the account. Maximum of 10 characters.

Min length: `1`

Max length: `10`

The 6-character sort code of the account.

Min length: `6`

Max length: `6`

Account numbers using the International Bank Account Number and BIC/SWIFT code format.

Hide object

International Bank Account Number (IBAN).

Min length: `15`

Max length: `34`

The Business Identifier Code, also known as SWIFT code, for this bank account.

Min length: `8`

Max length: `11`

The ID of the recipient that corresponds to the e-wallet account numbers

The status of the wallet.

`UNKNOWN`: The wallet status is unknown.

`ACTIVE`: The wallet is active and ready to send money to and receive money from.

`CLOSED`: The wallet is closed. Any transactions made to or from this wallet will error.

Possible values: `UNKNOWN`, `ACTIVE`, `CLOSED`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "wallet_id": "wallet-id-production-53e58b32-fc1c-46fe-bbd6-e584b27a88",
  "recipient_id": "recipient-id-production-9b6b4679-914b-445b-9450-efbdb80296f6",
  "balance": {
    "iso_currency_code": "GBP",
    "current": 123.12,
    "available": 100.96
  },
  "request_id": "4zlKapIkTm8p5KM",
  "numbers": {
    "bacs": {
      "account": "12345678",
      "sort_code": "123456"
    }
  },
  "status": "ACTIVE"
}
```

=\*=\*=\*=[#### `/wallet/get`](/docs/api/products/virtual-accounts/#walletget)

[#### Fetch an e-wallet](/docs/api/products/virtual-accounts/#fetch-an-e-wallet)

Fetch an e-wallet. The response includes the current balance.

/wallet/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The ID of the e-wallet

Min length: `1`

/wallet/get

Nodeâ¼

```
const request: WalletGetRequest = {
  wallet_id: walletID,
};
try {
  const response = await plaidClient.walletGet(request);
  const walletID = response.data.wallet_id;
  const balance = response.data.balance;
  const numbers = response.data.numbers;
  const recipientID = response.data.recipient_id;
} catch (error) {
  // handle error
}
```

/wallet/get

**Response fields**

Collapse all

A unique ID identifying the e-wallet

An object representing the e-wallet balance

Hide object

The ISO-4217 currency code of the balance

The total amount of funds in the account

Format: `double`

The total amount of funds in the account after subtracting pending debit transaction amounts

Format: `double`

An object representing the e-wallet account numbers

Hide object

An object containing a Bacs account number and sort code. If an IBAN is not provided or if you need to accept domestic GBP-denominated payments, Bacs data is required.

Hide object

The account number of the account. Maximum of 10 characters.

Min length: `1`

Max length: `10`

The 6-character sort code of the account.

Min length: `6`

Max length: `6`

Account numbers using the International Bank Account Number and BIC/SWIFT code format.

Hide object

International Bank Account Number (IBAN).

Min length: `15`

Max length: `34`

The Business Identifier Code, also known as SWIFT code, for this bank account.

Min length: `8`

Max length: `11`

The ID of the recipient that corresponds to the e-wallet account numbers

The status of the wallet.

`UNKNOWN`: The wallet status is unknown.

`ACTIVE`: The wallet is active and ready to send money to and receive money from.

`CLOSED`: The wallet is closed. Any transactions made to or from this wallet will error.

Possible values: `UNKNOWN`, `ACTIVE`, `CLOSED`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "wallet_id": "wallet-id-production-53e58b32-fc1c-46fe-bbd6-e584b27a88",
  "recipient_id": "recipient-id-production-9b6b4679-914b-445b-9450-efbdb80296f6",
  "balance": {
    "iso_currency_code": "GBP",
    "current": 123.12,
    "available": 100.96
  },
  "request_id": "4zlKapIkTm8p5KM",
  "numbers": {
    "bacs": {
      "account": "12345678",
      "sort_code": "123456"
    },
    "international": {
      "iban": "GB33BUKB20201555555555",
      "bic": "BUKBGB22"
    }
  },
  "status": "ACTIVE"
}
```

=\*=\*=\*=[#### `/wallet/list`](/docs/api/products/virtual-accounts/#walletlist)

[#### Fetch a list of e-wallets](/docs/api/products/virtual-accounts/#fetch-a-list-of-e-wallets)

This endpoint lists all e-wallets in descending order of creation.

/wallet/list

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

An ISO-4217 currency code, used with e-wallets and transactions.

Possible values: `GBP`, `EUR`

Min length: `3`

Max length: `3`

A base64 value representing the latest e-wallet that has already been requested. Set this to `next_cursor` received from the previous `/wallet/list` request. If provided, the response will only contain e-wallets created before that e-wallet. If omitted, the response will contain e-wallets starting from the most recent, and in descending order.

Max length: `1024`

The number of e-wallets to fetch

Minimum: `1`

Maximum: `20`

Default: `10`

/wallet/list

Nodeâ¼

```
const request: WalletListRequest = {
  iso_currency_code: 'GBP',
  count: 10,
};
try {
  const response = await plaidClient.walletList(request);
  const wallets = response.data.wallets;
  const nextCursor = response.data.next_cursor;
} catch (error) {
  // handle error
}
```

/wallet/list

**Response fields**

Collapse all

An array of e-wallets

Hide object

A unique ID identifying the e-wallet

An object representing the e-wallet balance

Hide object

The ISO-4217 currency code of the balance

The total amount of funds in the account

Format: `double`

The total amount of funds in the account after subtracting pending debit transaction amounts

Format: `double`

An object representing the e-wallet account numbers

Hide object

An object containing a Bacs account number and sort code. If an IBAN is not provided or if you need to accept domestic GBP-denominated payments, Bacs data is required.

Hide object

The account number of the account. Maximum of 10 characters.

Min length: `1`

Max length: `10`

The 6-character sort code of the account.

Min length: `6`

Max length: `6`

Account numbers using the International Bank Account Number and BIC/SWIFT code format.

Hide object

International Bank Account Number (IBAN).

Min length: `15`

Max length: `34`

The Business Identifier Code, also known as SWIFT code, for this bank account.

Min length: `8`

Max length: `11`

The ID of the recipient that corresponds to the e-wallet account numbers

The status of the wallet.

`UNKNOWN`: The wallet status is unknown.

`ACTIVE`: The wallet is active and ready to send money to and receive money from.

`CLOSED`: The wallet is closed. Any transactions made to or from this wallet will error.

Possible values: `UNKNOWN`, `ACTIVE`, `CLOSED`

Cursor used for fetching e-wallets created before the latest e-wallet provided in this response

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "wallets": [
    {
      "wallet_id": "wallet-id-production-53e58b32-fc1c-46fe-bbd6-e584b27a88",
      "recipient_id": "recipient-id-production-9b6b4679-914b-445b-9450-efbdb80296f6",
      "balance": {
        "iso_currency_code": "GBP",
        "current": 123.12,
        "available": 100.96
      },
      "numbers": {
        "bacs": {
          "account": "12345678",
          "sort_code": "123456"
        }
      },
      "status": "ACTIVE"
    },
    {
      "wallet_id": "wallet-id-production-53e58b32-fc1c-46fe-bbd6-e584b27a999",
      "recipient_id": "recipient-id-production-9b6b4679-914b-445b-9450-efbdb80296f7",
      "balance": {
        "iso_currency_code": "EUR",
        "current": 456.78,
        "available": 100.96
      },
      "numbers": {
        "international": {
          "iban": "GB22HBUK40221241555626",
          "bic": "HBUKGB4B"
        }
      },
      "status": "ACTIVE"
    }
  ],
  "request_id": "4zlKapIkTm8p5KM"
}
```

=\*=\*=\*=[#### `/wallet/transaction/execute`](/docs/api/products/virtual-accounts/#wallettransactionexecute)

[#### Execute a transaction using an e-wallet](/docs/api/products/virtual-accounts/#execute-a-transaction-using-an-e-wallet)

Execute a transaction using the specified e-wallet.
Specify the e-wallet to debit from, the counterparty to credit to, the idempotency key to prevent duplicate transactions, the amount and reference for the transaction.
Transactions will settle in seconds to several days, depending on the underlying payment rail.

/wallet/transaction/execute

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

A random key provided by the client, per unique wallet transaction. Maximum of 128 characters.

The API supports idempotency for safely retrying requests without accidentally performing the same operation twice. If a request to execute a wallet transaction fails due to a network connection error, then after a minimum delay of one minute, you can retry the request with the same idempotency key to guarantee that only a single wallet transaction is created. If the request was successfully processed, it will prevent any transaction that uses the same idempotency key, and was received within 24 hours of the first request, from being processed.

Max length: `128`

Min length: `1`

The ID of the e-wallet to debit from

Min length: `1`

An object representing the e-wallet transaction's counterparty

Hide object

The name of the counterparty

Min length: `1`

The counterparty's bank account numbers. Exactly one of IBAN or Bacs data is required.

Hide object

The account number and sort code of the counterparty's account

Hide object

The account number of the account. Maximum of 10 characters.

Min length: `1`

Max length: `10`

The 6-character sort code of the account.

Min length: `6`

Max length: `6`

International Bank Account Number for a Wallet Transaction

Hide object

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

The counterparty's birthdate, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) (YYYY-MM-DD) format.

Format: `date`

The amount and currency of a transaction

Hide object

An ISO-4217 currency code, used with e-wallets and transactions.

Possible values: `GBP`, `EUR`

Min length: `3`

Max length: `3`

The amount of the transaction. Must contain at most two digits of precision e.g. `1.23`.

Format: `double`

Minimum: `0.01`

A reference for the transaction. This must be an alphanumeric string with 6 to 18 characters and must not contain any special characters or spaces.
Ensure that the `reference` field is unique for each transaction.

Max length: `18`

Min length: `6`

The original source of the funds. This field is required by local regulation for certain businesses (e.g. money remittance) to send payouts to recipients in the EU and UK.

Hide object

The full name associated with the source of the funds.

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

The account number from which the funds are sourced.

The Business Identifier Code, also known as SWIFT code, for this bank account.

Min length: `8`

Max length: `11`

/wallet/transaction/execute

Nodeâ¼

```
const request: WalletTransactionExecuteRequest = {
  wallet_id: walletID,
  counterparty: {
    name: 'Test',
    numbers: {
      bacs: {
        account: '12345678',
        sort_code: '123456',
      },
    },
  },
  amount: {
    value: 1,
    iso_currency_code: 'GBP',
  },
  reference: 'TransactionABC123',
  idempotency_key: '39fae5f2-b2b4-48b6-a363-5328995b2753',
};
try {
  const response = await plaidClient.walletTransactionExecute(request);
  const transactionID = response.data.transaction_id;
  const status = response.data.status;
} catch (error) {
  // handle error
}
```

/wallet/transaction/execute

**Response fields**

A unique ID identifying the transaction

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
  "transaction_id": "wallet-transaction-id-production-53e58b32-fc1c-46fe-bbd6-e584b27a88",
  "status": "EXECUTED",
  "request_id": "4zlKapIkTm8p5KM"
}
```

=\*=\*=\*=[#### `/wallet/transaction/get`](/docs/api/products/virtual-accounts/#wallettransactionget)

[#### Fetch an e-wallet transaction](/docs/api/products/virtual-accounts/#fetch-an-e-wallet-transaction)

Fetch a specific e-wallet transaction

/wallet/transaction/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The ID of the transaction to fetch

Min length: `1`

/wallet/transaction/get

Nodeâ¼

```
const request: WalletTransactionGetRequest = {
  transaction_id: transactionID,
};
try {
  const response = await plaidClient.walletTransactionGet(request);
  const transactionID = response.data.transaction_id;
  const reference = response.data.reference;
  const type = response.data.type;
  const amount = response.data.amount;
  const counterparty = response.data.counterparty;
  const status = response.data.status;
  const createdAt = response.data.created_at;
} catch (error) {
  // handle error
}
```

/wallet/transaction/get

**Response fields**

Collapse all

A unique ID identifying the transaction

The EMI (E-Money Institution) wallet that this payment is associated with, if any. This wallet is used as an intermediary account to enable Plaid to reconcile the settlement of funds for Payment Initiation requests.

A reference for the transaction

The type of the transaction. The supported transaction types that are returned are:
`BANK_TRANSFER:` a transaction which credits an e-wallet through an external bank transfer.

`PAYOUT:` a transaction which debits an e-wallet by disbursing funds to a counterparty.

`PIS_PAY_IN:` a payment which credits an e-wallet through Plaid's Payment Initiation Services (PIS) APIs. For more information see the [Payment Initiation endpoints](https://plaid.com/docs/api/products/payment-initiation/).

`REFUND:` a transaction which debits an e-wallet by refunding a previously initiated payment made through Plaid's [PIS APIs](https://plaid.com/docs/api/products/payment-initiation/).

`FUNDS_SWEEP`: an automated transaction which debits funds from an e-wallet to a designated client-owned account.

`RETURN`: an automated transaction where a debit transaction was reversed and money moved back to originating account.

`RECALL`: a transaction where the sending bank has requested the return of funds due to a fraud claim, technical error, or other issue associated with the payment.

`ACCOUNT_FUNDING`: an incoming transfer from an allowlisted account. Not automatically refunded.

`AUTO_REFUND`: an outgoing refund automatically initiated by Plaid in response to an unexpected `BANK_TRANSFER`.

Possible values: `BANK_TRANSFER`, `PAYOUT`, `PIS_PAY_IN`, `REFUND`, `FUNDS_SWEEP`, `RETURN`, `RECALL`, `ACCOUNT_FUNDING`, `AUTO_REFUND`

The payment scheme used to execute this transaction. This is present only for transaction types `PAYOUT` and `REFUND`.

`FASTER_PAYMENTS`: The standard payment scheme within the UK.

`SEPA_CREDIT_TRANSFER`: The standard payment to a beneficiary within the SEPA area.

`SEPA_CREDIT_TRANSFER_INSTANT`: Instant payment to a beneficiary within the SEPA area.

Possible values: `null`, `FASTER_PAYMENTS`, `SEPA_CREDIT_TRANSFER`, `SEPA_CREDIT_TRANSFER_INSTANT`

The amount and currency of a transaction

Hide object

An ISO-4217 currency code, used with e-wallets and transactions.

Possible values: `GBP`, `EUR`

Min length: `3`

Max length: `3`

The amount of the transaction. Must contain at most two digits of precision e.g. `1.23`.

Format: `double`

Minimum: `0.01`

An object representing the e-wallet transaction's counterparty

Hide object

The name of the counterparty

Min length: `1`

The counterparty's bank account numbers. Exactly one of IBAN or Bacs data is required.

Hide object

The account number and sort code of the counterparty's account

Hide object

The account number of the account. Maximum of 10 characters.

Min length: `1`

Max length: `10`

The 6-character sort code of the account.

Min length: `6`

Max length: `6`

International Bank Account Number for a Wallet Transaction

Hide object

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

The counterparty's birthdate, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) (YYYY-MM-DD) format.

Format: `date`

The status of the transaction.

`AUTHORISING`: The transaction is being processed for validation and compliance.

`INITIATED`: The transaction has been initiated and is currently being processed.

`EXECUTED`: The transaction has been successfully executed and is considered complete. This is only applicable for debit transactions.

`SETTLED`: The transaction has settled and funds are available for use. This is only applicable for credit transactions. A transaction will typically settle within seconds to several days, depending on which payment rail is used.

`FAILED`: The transaction failed to process successfully. This is a terminal status.

`BLOCKED`: The transaction has been blocked for violating compliance rules. This is a terminal status.

Possible values: `AUTHORISING`, `INITIATED`, `EXECUTED`, `SETTLED`, `BLOCKED`, `FAILED`

Timestamp when the transaction was created, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date-time`

The date and time of the last time the `status` was updated, in IS0 8601 format

Format: `date-time`

Result of payee verification check for EUR payouts. Payee verification checks whether the payee name provided matches the account holder name at the destination institution.

`FULL_MATCH`: The payee name fully matches the account holder.

`PARTIAL_MATCH`: The payee name partially matches the account holder.

`NO_MATCH`: The payee name does not match the account holder.

`ERROR`: An error occurred during payee verification.

`CHECK_NOT_POSSIBLE`: Payee verification could not be performed.

This field is only populated for applicable EUR payout transactions and will be `null` for other transaction types.

Possible values: `FULL_MATCH`, `PARTIAL_MATCH`, `NO_MATCH`, `ERROR`, `CHECK_NOT_POSSIBLE`

The payment id that this transaction is associated with, if any. This is present only for transaction types `PIS_PAY_IN` and `REFUND`.

The error code of a failed transaction. Error codes include:
`EXTERNAL_SYSTEM`: The transaction was declined by an external system.
`EXPIRED`: The transaction request has expired.
`CANCELLED`: The transaction request was rescinded.
`INVALID`: The transaction did not meet certain criteria, such as an inactive account or no valid counterparty, etc.
`ACCOUNT_INVALID`: The transaction could not be processed because the wallet account is invalid or inactive.
`AUTHENTICATION_FAILED`: The transaction could not be processed because authentication with the wallet provider failed.
`UNKNOWN`: The transaction was unsuccessful, but the exact cause is unknown.

Possible values: `EXTERNAL_SYSTEM`, `EXPIRED`, `CANCELLED`, `INVALID`, `ACCOUNT_INVALID`, `AUTHENTICATION_FAILED`, `UNKNOWN`

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

A list of wallet transactions that this transaction is associated with, if any.

Hide object

The ID of the related transaction.

The type of the transaction.

Possible values: `PAYOUT`, `RETURN`, `REFUND`, `FUNDS_SWEEP`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "transaction_id": "wallet-transaction-id-sandbox-feca8a7a-5591-4aef-9297-f3062bb735d3",
  "wallet_id": "wallet-id-production-53e58b32-fc1c-46fe-bbd6-e584b27a88",
  "type": "PAYOUT",
  "reference": "Payout 99744",
  "amount": {
    "iso_currency_code": "GBP",
    "value": 123.12
  },
  "status": "EXECUTED",
  "created_at": "2020-12-02T21:14:54Z",
  "last_status_update": "2020-12-02T21:15:01Z",
  "counterparty": {
    "numbers": {
      "bacs": {
        "account": "31926819",
        "sort_code": "601613"
      }
    },
    "name": "John Smith"
  },
  "request_id": "4zlKapIkTm8p5KM",
  "related_transactions": [
    {
      "id": "wallet-transaction-id-sandbox-2ba30780-d549-4335-b1fe-c2a938aa39d2",
      "type": "RETURN"
    }
  ]
}
```

=\*=\*=\*=[#### `/wallet/transaction/list`](/docs/api/products/virtual-accounts/#wallettransactionlist)

[#### List e-wallet transactions](/docs/api/products/virtual-accounts/#list-e-wallet-transactions)

This endpoint lists the latest transactions of the specified e-wallet. Transactions are returned in descending order by the `created_at` time.

/wallet/transaction/list

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The ID of the e-wallet to fetch transactions from

Min length: `1`

A value representing the latest transaction to be included in the response. Set this from `next_cursor` received in the previous `/wallet/transaction/list` request. If provided, the response will only contain that transaction and transactions created before it. If omitted, the response will contain transactions starting from the most recent, and in descending order by the `created_at` time.

Max length: `256`

The number of transactions to fetch

Minimum: `1`

Maximum: `200`

Default: `10`

Additional wallet transaction options

Hide object

Timestamp in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DDThh:mm:ssZ) for filtering transactions, inclusive of the provided date.

Format: `date-time`

Timestamp in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format (YYYY-MM-DDThh:mm:ssZ) for filtering transactions, inclusive of the provided date.

Format: `date-time`

/wallet/transaction/list

Nodeâ¼

```
const request: WalletTransactionListRequest = {
  wallet_id: walletID,
  count: 10,
};
try {
  const response = await plaidClient.walletTransactionList(request);
  const transactions = response.data.transactions;
  const nextCursor = response.data.next_cursor;
} catch (error) {
  // handle error
}
```

/wallet/transaction/list

**Response fields**

Collapse all

An array of transactions of an e-wallet, associated with the given `wallet_id`

Hide object

A unique ID identifying the transaction

The EMI (E-Money Institution) wallet that this payment is associated with, if any. This wallet is used as an intermediary account to enable Plaid to reconcile the settlement of funds for Payment Initiation requests.

A reference for the transaction

The type of the transaction. The supported transaction types that are returned are:
`BANK_TRANSFER:` a transaction which credits an e-wallet through an external bank transfer.

`PAYOUT:` a transaction which debits an e-wallet by disbursing funds to a counterparty.

`PIS_PAY_IN:` a payment which credits an e-wallet through Plaid's Payment Initiation Services (PIS) APIs. For more information see the [Payment Initiation endpoints](https://plaid.com/docs/api/products/payment-initiation/).

`REFUND:` a transaction which debits an e-wallet by refunding a previously initiated payment made through Plaid's [PIS APIs](https://plaid.com/docs/api/products/payment-initiation/).

`FUNDS_SWEEP`: an automated transaction which debits funds from an e-wallet to a designated client-owned account.

`RETURN`: an automated transaction where a debit transaction was reversed and money moved back to originating account.

`RECALL`: a transaction where the sending bank has requested the return of funds due to a fraud claim, technical error, or other issue associated with the payment.

`ACCOUNT_FUNDING`: an incoming transfer from an allowlisted account. Not automatically refunded.

`AUTO_REFUND`: an outgoing refund automatically initiated by Plaid in response to an unexpected `BANK_TRANSFER`.

Possible values: `BANK_TRANSFER`, `PAYOUT`, `PIS_PAY_IN`, `REFUND`, `FUNDS_SWEEP`, `RETURN`, `RECALL`, `ACCOUNT_FUNDING`, `AUTO_REFUND`

The payment scheme used to execute this transaction. This is present only for transaction types `PAYOUT` and `REFUND`.

`FASTER_PAYMENTS`: The standard payment scheme within the UK.

`SEPA_CREDIT_TRANSFER`: The standard payment to a beneficiary within the SEPA area.

`SEPA_CREDIT_TRANSFER_INSTANT`: Instant payment to a beneficiary within the SEPA area.

Possible values: `null`, `FASTER_PAYMENTS`, `SEPA_CREDIT_TRANSFER`, `SEPA_CREDIT_TRANSFER_INSTANT`

The amount and currency of a transaction

Hide object

An ISO-4217 currency code, used with e-wallets and transactions.

Possible values: `GBP`, `EUR`

Min length: `3`

Max length: `3`

The amount of the transaction. Must contain at most two digits of precision e.g. `1.23`.

Format: `double`

Minimum: `0.01`

An object representing the e-wallet transaction's counterparty

Hide object

The name of the counterparty

Min length: `1`

The counterparty's bank account numbers. Exactly one of IBAN or Bacs data is required.

Hide object

The account number and sort code of the counterparty's account

Hide object

The account number of the account. Maximum of 10 characters.

Min length: `1`

Max length: `10`

The 6-character sort code of the account.

Min length: `6`

Max length: `6`

International Bank Account Number for a Wallet Transaction

Hide object

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

The counterparty's birthdate, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) (YYYY-MM-DD) format.

Format: `date`

The status of the transaction.

`AUTHORISING`: The transaction is being processed for validation and compliance.

`INITIATED`: The transaction has been initiated and is currently being processed.

`EXECUTED`: The transaction has been successfully executed and is considered complete. This is only applicable for debit transactions.

`SETTLED`: The transaction has settled and funds are available for use. This is only applicable for credit transactions. A transaction will typically settle within seconds to several days, depending on which payment rail is used.

`FAILED`: The transaction failed to process successfully. This is a terminal status.

`BLOCKED`: The transaction has been blocked for violating compliance rules. This is a terminal status.

Possible values: `AUTHORISING`, `INITIATED`, `EXECUTED`, `SETTLED`, `BLOCKED`, `FAILED`

Timestamp when the transaction was created, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format.

Format: `date-time`

The date and time of the last time the `status` was updated, in IS0 8601 format

Format: `date-time`

Result of payee verification check for EUR payouts. Payee verification checks whether the payee name provided matches the account holder name at the destination institution.

`FULL_MATCH`: The payee name fully matches the account holder.

`PARTIAL_MATCH`: The payee name partially matches the account holder.

`NO_MATCH`: The payee name does not match the account holder.

`ERROR`: An error occurred during payee verification.

`CHECK_NOT_POSSIBLE`: Payee verification could not be performed.

This field is only populated for applicable EUR payout transactions and will be `null` for other transaction types.

Possible values: `FULL_MATCH`, `PARTIAL_MATCH`, `NO_MATCH`, `ERROR`, `CHECK_NOT_POSSIBLE`

The payment id that this transaction is associated with, if any. This is present only for transaction types `PIS_PAY_IN` and `REFUND`.

The error code of a failed transaction. Error codes include:
`EXTERNAL_SYSTEM`: The transaction was declined by an external system.
`EXPIRED`: The transaction request has expired.
`CANCELLED`: The transaction request was rescinded.
`INVALID`: The transaction did not meet certain criteria, such as an inactive account or no valid counterparty, etc.
`ACCOUNT_INVALID`: The transaction could not be processed because the wallet account is invalid or inactive.
`AUTHENTICATION_FAILED`: The transaction could not be processed because authentication with the wallet provider failed.
`UNKNOWN`: The transaction was unsuccessful, but the exact cause is unknown.

Possible values: `EXTERNAL_SYSTEM`, `EXPIRED`, `CANCELLED`, `INVALID`, `ACCOUNT_INVALID`, `AUTHENTICATION_FAILED`, `UNKNOWN`

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

A list of wallet transactions that this transaction is associated with, if any.

Hide object

The ID of the related transaction.

The type of the transaction.

Possible values: `PAYOUT`, `RETURN`, `REFUND`, `FUNDS_SWEEP`

The value that, when used as the optional `cursor` parameter to `/wallet/transaction/list`, will return the corresponding transaction as its first entry.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "next_cursor": "YWJjMTIzIT8kKiYoKSctPUB",
  "transactions": [
    {
      "transaction_id": "wallet-transaction-id-sandbox-feca8a7a-5591-4aef-9297-f3062bb735d3",
      "wallet_id": "wallet-id-production-53e58b32-fc1c-46fe-bbd6-e584b27a88",
      "type": "PAYOUT",
      "reference": "Payout 99744",
      "amount": {
        "iso_currency_code": "GBP",
        "value": 123.12
      },
      "status": "EXECUTED",
      "created_at": "2020-12-02T21:14:54Z",
      "last_status_update": "2020-12-02T21:15:01Z",
      "counterparty": {
        "numbers": {
          "bacs": {
            "account": "31926819",
            "sort_code": "601613"
          }
        },
        "name": "John Smith"
      },
      "related_transactions": [
        {
          "id": "wallet-transaction-id-sandbox-2ba30780-d549-4335-b1fe-c2a938aa39d2",
          "type": "RETURN"
        }
      ]
    },
    {
      "transaction_id": "wallet-transaction-id-sandbox-feca8a7a-5591-4aef-9297-f3062bb735d3",
      "wallet_id": "wallet-id-production-53e58b32-fc1c-46fe-bbd6-e584b27a88",
      "type": "PAYOUT",
      "reference": "Payout 99744",
      "amount": {
        "iso_currency_code": "EUR",
        "value": 456.78
      },
      "status": "EXECUTED",
      "created_at": "2020-12-02T21:14:54Z",
      "last_status_update": "2020-12-02T21:15:01Z",
      "counterparty": {
        "numbers": {
          "international": {
            "iban": "GB33BUKB20201555555555"
          }
        },
        "name": "John Smith"
      },
      "related_transactions": []
    }
  ],
  "request_id": "4zlKapIkTm8p5KM"
}
```

[### Webhooks](/docs/api/products/virtual-accounts/#webhooks)

Updates are sent to indicate that the status of transaction has changed. All virtual account webhooks have a `webhook_type` of `WALLET`.

=\*=\*=\*=[#### `WALLET_TRANSACTION_STATUS_UPDATE`](/docs/api/products/virtual-accounts/#wallet_transaction_status_update)

Fired when the status of a wallet transaction has changed.

**Properties**

Collapse all

`WALLET`

`WALLET_TRANSACTION_STATUS_UPDATE`

The `transaction_id` for the wallet transaction being updated

The `payment_id` associated with the transaction. This will be present in case of `REFUND` and `PIS_PAY_IN`.

The EMI (E-Money Institution) wallet that this payment is associated with. This wallet is used as an intermediary account to enable Plaid to reconcile the settlement of funds for Payment Initiation requests.

The status of the transaction.

`AUTHORISING`: The transaction is being processed for validation and compliance.

`INITIATED`: The transaction has been initiated and is currently being processed.

`EXECUTED`: The transaction has been successfully executed and is considered complete. This is only applicable for debit transactions.

`SETTLED`: The transaction has settled and funds are available for use. This is only applicable for credit transactions. A transaction will typically settle within seconds to several days, depending on which payment rail is used.

`FAILED`: The transaction failed to process successfully. This is a terminal status.

`BLOCKED`: The transaction has been blocked for violating compliance rules. This is a terminal status.

Possible values: `AUTHORISING`, `INITIATED`, `EXECUTED`, `SETTLED`, `BLOCKED`, `FAILED`

The status of the transaction.

`AUTHORISING`: The transaction is being processed for validation and compliance.

`INITIATED`: The transaction has been initiated and is currently being processed.

`EXECUTED`: The transaction has been successfully executed and is considered complete. This is only applicable for debit transactions.

`SETTLED`: The transaction has settled and funds are available for use. This is only applicable for credit transactions. A transaction will typically settle within seconds to several days, depending on which payment rail is used.

`FAILED`: The transaction failed to process successfully. This is a terminal status.

`BLOCKED`: The transaction has been blocked for violating compliance rules. This is a terminal status.

Possible values: `AUTHORISING`, `INITIATED`, `EXECUTED`, `SETTLED`, `BLOCKED`, `FAILED`

The error code of a failed transaction. Error codes include:
`EXTERNAL_SYSTEM`: The transaction was declined by an external system.
`EXPIRED`: The transaction request has expired.
`CANCELLED`: The transaction request was rescinded.
`INVALID`: The transaction did not meet certain criteria, such as an inactive account or no valid counterparty, etc.
`ACCOUNT_INVALID`: The transaction could not be processed because the wallet account is invalid or inactive.
`AUTHENTICATION_FAILED`: The transaction could not be processed because authentication with the wallet provider failed.
`UNKNOWN`: The transaction was unsuccessful, but the exact cause is unknown.

Possible values: `EXTERNAL_SYSTEM`, `EXPIRED`, `CANCELLED`, `INVALID`, `ACCOUNT_INVALID`, `AUTHENTICATION_FAILED`, `UNKNOWN`

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
  "webhook_type": "WALLET",
  "webhook_code": "WALLET_TRANSACTION_STATUS_UPDATE",
  "transaction_id": "wallet-transaction-id-production-2ba30780-d549-4335-b1fe-c2a938aa39d2",
  "payment_id": "payment-id-production-feca8a7a-5591-4aef-9297-f3062bb735d3",
  "wallet_id": "wallet-id-production-53e58b32-fc1c-46fe-bbd6-e584b27a88",
  "new_status": "SETTLED",
  "old_status": "INITIATED",
  "timestamp": "2017-09-14T14:42:19.350Z",
  "environment": "production"
}
```
