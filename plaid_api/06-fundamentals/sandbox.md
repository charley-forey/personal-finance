---
title: "Sandbox"
source_url: "https://plaid.com/docs/api/sandbox/"
section: "Fundamentals"
section_id: "06-fundamentals"
slug: "sandbox"
endpoints:
  - "/sandbox/public_token/create"
  - "/sandbox/processor_token/create"
  - "/sandbox/item/reset_login"
  - "/sandbox/user/reset_login"
  - "/sandbox/item/fire_webhook"
  - "/sandbox/item/set_verification_status"
  - "/sandbox/transfer/fire_webhook"
  - "/sandbox/transfer/simulate"
  - "/sandbox/transfer/refund/simulate"
  - "/sandbox/transfer/ledger/deposit/simulate"
  - "/sandbox/transfer/ledger/simulate_available"
  - "/sandbox/transfer/ledger/withdraw/simulate"
  - "/sandbox/transfer/test_clock/create"
  - "/sandbox/transfer/test_clock/advance"
  - "/sandbox/transfer/test_clock/get"
  - "/sandbox/transfer/test_clock/list"
  - "/sandbox/income/fire_webhook"
  - "/sandbox/cra/cashflow_updates/update"
  - "/sandbox/payment/simulate"
  - "/sandbox/transactions/create"
  - "/item/public_token/exchange"
  - "webhook"
  - "Fire a test webhook"
  - "webhook_type"
  - "webhook_code"
  - "webhook_fired"
  - "Manually fire a Transfer webhook"
  - "/transfer/event/sync"
  - "/transfer/event/list"
  - "Manually fire an Income webhook"
  - "webhook_codes"
  - "/transactions/get"
  - "/transactions/sync"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Sandbox endpoints

> **Source:** [https://plaid.com/docs/api/sandbox/](https://plaid.com/docs/api/sandbox/)
> **Section:** Fundamentals

## Endpoints & Webhooks on this page

- `/sandbox/public_token/create`
- `/sandbox/processor_token/create`
- `/sandbox/item/reset_login`
- `/sandbox/user/reset_login`
- `/sandbox/item/fire_webhook`
- `/sandbox/item/set_verification_status`
- `/sandbox/transfer/fire_webhook`
- `/sandbox/transfer/simulate`
- `/sandbox/transfer/refund/simulate`
- `/sandbox/transfer/ledger/deposit/simulate`
- `/sandbox/transfer/ledger/simulate_available`
- `/sandbox/transfer/ledger/withdraw/simulate`
- `/sandbox/transfer/test_clock/create`
- `/sandbox/transfer/test_clock/advance`
- `/sandbox/transfer/test_clock/get`
- `/sandbox/transfer/test_clock/list`
- `/sandbox/income/fire_webhook`
- `/sandbox/cra/cashflow_updates/update`
- `/sandbox/payment/simulate`
- `/sandbox/transactions/create`
- `/item/public_token/exchange`
- `webhook`
- `Fire a test webhook`
- `webhook_type`
- `webhook_code`
- `webhook_fired`
- `Manually fire a Transfer webhook`
- `/transfer/event/sync`
- `/transfer/event/list`
- `Manually fire an Income webhook`
- `webhook_codes`
- `/transactions/get`
- `/transactions/sync`

---

# Sandbox endpoints

#### API reference for Sandbox endpoints

[#### Introduction](/docs/api/sandbox/#introduction)

Plaid's Sandbox environment provides a number of endpoints that can be used to configure testing scenarios. These endpoints are unique to the Sandbox environment and cannot be used in Production. For more information on these endpoints, see [Sandbox](/docs/sandbox/).

| In this section |  |
| --- | --- |
| [`/sandbox/public_token/create`](/docs/api/sandbox/#sandboxpublic_tokencreate) | Bypass the Link flow for creating an Item |
| [`/sandbox/processor_token/create`](/docs/api/sandbox/#sandboxprocessor_tokencreate) | Bypass the Link flow for creating an Item for a processor partner |
| [`/sandbox/item/reset_login`](/docs/api/sandbox/#sandboxitemreset_login) | Trigger the `ITEM_LOGIN_REQUIRED` state for an Item |
| [`/sandbox/user/reset_login`](/docs/api/sandbox/#sandboxuserreset_login) | (Income and Check) Force Item(s) for a Sandbox user into an error state |
| [`/sandbox/item/fire_webhook`](/docs/api/sandbox/#sandboxitemfire_webhook) | Fire a specific webhook |
| [`/sandbox/item/set_verification_status`](/docs/api/sandbox/#sandboxitemset_verification_status) | (Auth) Set a verification status for testing micro-deposits |
| [`/sandbox/transfer/fire_webhook`](/docs/api/sandbox/#sandboxtransferfire_webhook) | (Transfer) Fire a specific webhook |
| [`/sandbox/transfer/ledger/deposit/simulate`](/docs/api/sandbox/#sandboxtransferledgerdepositsimulate) | (Transfer) Simulate a deposit sweep event |
| [`/sandbox/transfer/ledger/simulate_available`](/docs/api/sandbox/#sandboxtransferledgersimulate_available) | (Transfer) Simulate converting pending balance into available balance |
| [`/sandbox/transfer/ledger/withdraw/simulate`](/docs/api/sandbox/#sandboxtransferledgerwithdrawsimulate) | (Transfer) Simulate a withdraw sweep event |
| [`/sandbox/transfer/simulate`](/docs/api/sandbox/#sandboxtransfersimulate) | (Transfer) Simulate a transfer event |
| [`/sandbox/transfer/refund/simulate`](/docs/api/sandbox/#sandboxtransferrefundsimulate) | (Transfer) Simulate a refund event |
| [`/sandbox/transfer/test_clock/create`](/docs/api/sandbox/#sandboxtransfertest_clockcreate) | (Transfer) Create a test clock for testing recurring transfers |
| [`/sandbox/transfer/test_clock/advance`](/docs/api/sandbox/#sandboxtransfertest_clockadvance) | (Transfer) Advance the time on a test clock |
| [`/sandbox/transfer/test_clock/get`](/docs/api/sandbox/#sandboxtransfertest_clockget) | (Transfer) Get details about a test clock |
| [`/sandbox/transfer/test_clock/list`](/docs/api/sandbox/#sandboxtransfertest_clocklist) | (Transfer) Get details about all test clocks |
| [`/sandbox/income/fire_webhook`](/docs/api/sandbox/#sandboxincomefire_webhook) | (Income) Fire a specific webhook |
| [`/sandbox/cra/cashflow_updates/update`](/docs/api/sandbox/#sandboxcracashflow_updatesupdate) | (Check) Simulate an update for Cash Flow Updates |
| [`/sandbox/payment/simulate`](/docs/api/sandbox/#sandboxpaymentsimulate) | (Payment Initiation) Simulate a payment |
| [`/sandbox/transactions/create`](/docs/api/sandbox/#sandboxtransactionscreate) | (Transactions) Create custom transactions for Items |

=\*=\*=\*=[#### `/sandbox/public_token/create`](/docs/api/sandbox/#sandboxpublic_tokencreate)

[#### Create a test Item](/docs/api/sandbox/#create-a-test-item)

Use the [`/sandbox/public_token/create`](/docs/api/sandbox/#sandboxpublic_tokencreate) endpoint to create a valid `public_token` for an arbitrary institution ID, initial products, and test credentials. The created `public_token` maps to a new Sandbox Item. You can then call [`/item/public_token/exchange`](/docs/api/items/#itempublic_tokenexchange) to exchange the `public_token` for an `access_token` and perform all API actions. [`/sandbox/public_token/create`](/docs/api/sandbox/#sandboxpublic_tokencreate) can also be used with the [`user_custom` test username](https://plaid.com/docs/sandbox/user-custom) to generate a test account with custom data, or with Plaid's [pre-populated Sandbox test accounts](https://plaid.com/docs/sandbox/test-credentials/).

/sandbox/public\_token/create

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The ID of the institution the Item will be associated with

The products to initially pull for the Item. May be any products that the specified `institution_id` supports. This array may not be empty.

Min items: `1`

Possible values: `assets`, `auth`, `cra_base_report`, `cra_income_insights`, `cra_lend_score`, `cra_partner_insights`, `cra_monitoring`, `identity`, `income_verification`, `investments_auth`, `investments`, `liabilities`, `payment_initiation`, `signal`, `standing_orders`, `statements`, `transactions`, `transfer`

An optional set of options to be used when configuring the Item. If specified, must not be `null`.

Hide object

Specify a webhook to associate with the new Item.

Format: `url`

Test username to use for the creation of the Sandbox Item. Default value is `user_good`.

Default: `user_good`

Test password to use for the creation of the Sandbox Item. Default value is `pass_good`.

Default: `pass_good`

An optional set of parameters corresponding to transactions options.

Hide object

The earliest date for which to fetch transaction history. Dates should be formatted as YYYY-MM-DD.

Format: `date`

The most recent date for which to fetch transaction history. Dates should be formatted as YYYY-MM-DD.

Format: `date`

An optional set of parameters corresponding to statements options.

Hide object

The earliest date for which to fetch statements history. Dates should be formatted as YYYY-MM-DD.

Format: `date`

The most recent date for which to fetch statements history. Dates should be formatted as YYYY-MM-DD.

Format: `date`

A set of parameters for income verification options. This field is required if `income_verification` is included in the `initial_products` array.

Hide object

The types of source income data that users will be permitted to share. Options include `bank` and `payroll`. Currently you can only specify one of these options.

Possible values: `bank`, `payroll`

Specifies options for Bank Income. This field is required if `income_verification` is included in the `initial_products` array and `bank` is specified in `income_source_types`.

Hide object

The number of days of data to request for the Bank Income product

The user token associated with the user for which data is being requested. This field is used only by customers with pre-existing integrations that already use the `user_token` field. All other customers should use the `user_id` instead. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

A unique user identifier, created by `/user/create`. Integrations that began using `/user/create` after December 10, 2025 use this field to identify a user instead of the `user_token`. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

/sandbox/public\_token/create

Nodeâ¼

```
const publicTokenRequest: SandboxPublicTokenCreateRequest = {
  institution_id: institutionID,
  initial_products: initialProducts,
};
try {
  const publicTokenResponse = await client.sandboxPublicTokenCreate(
    publicTokenRequest,
  );
  const publicToken = publicTokenResponse.data.public_token;
  // The generated public_token can now be exchanged
  // for an access_token
  const exchangeRequest: ItemPublicTokenExchangeRequest = {
    public_token: publicToken,
  };
  const exchangeTokenResponse = await client.itemPublicTokenExchange(
    exchangeRequest,
  );
  const accessToken = exchangeTokenResponse.data.access_token;
} catch (error) {
  // handle error
}
```

/sandbox/public\_token/create

**Response fields**

A public token that can be exchanged for an access token using `/item/public_token/exchange`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "public_token": "public-sandbox-b0e2c4ee-a763-4df5-bfe9-46a46bce993d",
  "request_id": "Aim3b"
}
```

=\*=\*=\*=[#### `/sandbox/processor_token/create`](/docs/api/sandbox/#sandboxprocessor_tokencreate)

[#### Create a test Item and processor token](/docs/api/sandbox/#create-a-test-item-and-processor-token)

Use the [`/sandbox/processor_token/create`](/docs/api/sandbox/#sandboxprocessor_tokencreate) endpoint to create a valid `processor_token` for an arbitrary institution ID and test credentials. The created `processor_token` corresponds to a new Sandbox Item. You can then use this `processor_token` with the `/processor/` API endpoints in Sandbox. You can also use [`/sandbox/processor_token/create`](/docs/api/sandbox/#sandboxprocessor_tokencreate) with the [`user_custom` test username](https://plaid.com/docs/sandbox/user-custom) to generate a test account with custom data.

/sandbox/processor\_token/create

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The ID of the institution the Item will be associated with

An optional set of options to be used when configuring the Item. If specified, must not be `null`.

Hide object

Test username to use for the creation of the Sandbox Item. Default value is `user_good`.

Default: `user_good`

Test password to use for the creation of the Sandbox Item. Default value is `pass_good`.

Default: `pass_good`

/sandbox/processor\_token/create

Nodeâ¼

```
const request: SandboxProcessorTokenCreateRequest = {
  institution_id: institutionID,
};
try {
  const response = await plaidClient.sandboxProcessorTokenCreate(request);
  const processorToken = response.data.processor_token;
} catch (error) {
  // handle error
}
```

/sandbox/processor\_token/create

**Response fields**

A processor token that can be used to call the `/processor/` endpoints.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "processor_token": "processor-sandbox-b0e2c4ee-a763-4df5-bfe9-46a46bce993d",
  "request_id": "Aim3b"
}
```

=\*=\*=\*=[#### `/sandbox/item/reset_login`](/docs/api/sandbox/#sandboxitemreset_login)

[#### Force a Sandbox Item into an error state](/docs/api/sandbox/#force-a-sandbox-item-into-an-error-state)

[`/sandbox/item/reset_login`](/docs/api/sandbox/#sandboxitemreset_login) forces an Item into an `ITEM_LOGIN_REQUIRED` state in order to simulate an Item whose login is no longer valid. This makes it easy to test Link's [update mode](https://plaid.com/docs/link/update-mode) flow in the Sandbox environment. After calling [`/sandbox/item/reset_login`](/docs/api/sandbox/#sandboxitemreset_login), you can then use Plaid Link update mode to restore the Item to a good state. An `ITEM_LOGIN_REQUIRED` webhook will also be fired after a call to this endpoint, if one is associated with the Item.
In the Sandbox, Items will transition to an `ITEM_LOGIN_REQUIRED` error state automatically after 30 days, even if this endpoint is not called.

/sandbox/item/reset\_login

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The access token associated with the Item for which data is being requested.

/sandbox/item/reset\_login

Nodeâ¼

```
const request: SandboxItemResetLoginRequest = {
  access_token: accessToken,
};
try {
  const response = await plaidClient.sandboxItemResetLogin(request);
} catch (error) {
  // handle error
}
```

/sandbox/item/reset\_login

**Response fields**

`true` if the call succeeded

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "reset_login": true,
  "request_id": "m8MDnv9okwxFNBV"
}
```

=\*=\*=\*=[#### `/sandbox/user/reset_login`](/docs/api/sandbox/#sandboxuserreset_login)

[#### Force item(s) for a Sandbox User into an error state](/docs/api/sandbox/#force-item(s)-for-a-sandbox-user-into-an-error-state)

[`/sandbox/user/reset_login`](/docs/api/sandbox/#sandboxuserreset_login) functions the same as [`/sandbox/item/reset_login`](/docs/api/sandbox/#sandboxitemreset_login), but will modify Items related to a User. This endpoint forces each Item into an `ITEM_LOGIN_REQUIRED` state in order to simulate an Item whose login is no longer valid. This makes it easy to test Link's [update mode](https://plaid.com/docs/link/update-mode) flow in the Sandbox environment. After calling [`/sandbox/user/reset_login`](/docs/api/sandbox/#sandboxuserreset_login), you can then use Plaid Link update mode to restore Items associated with the User to a good state. An `ITEM_LOGIN_REQUIRED` webhook will also be fired after a call to this endpoint, if one is associated with the Item.
In the Sandbox, Items will transition to an `ITEM_LOGIN_REQUIRED` error state automatically after 30 days, even if this endpoint is not called.

/sandbox/user/reset\_login

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The user token associated with the user for which data is being requested. This field is used only by customers with pre-existing integrations that already use the `user_token` field. All other customers should use the `user_id` instead. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

An array of `item_id`s associated with the User to be reset. If empty or `null`, this field will default to resetting all Items associated with the User.

A unique user identifier, created by `/user/create`. Integrations that began using `/user/create` after December 10, 2025 use this field to identify a user instead of the `user_token`. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

/sandbox/user/reset\_login

Nodeâ¼

```
const request: SandboxUserResetLoginRequest = {
  user_id: 'usr_9nSp2KuZ2x4JDw',
  item_ids: ['eVBnVMp7zdTJLkRNr33Rs6zr7KNJqBFL9DrE6']
};
try {
  const response = await plaidClient.sandboxUserResetLogin(request);
} catch (error) {
  // handle error
}
```

/sandbox/user/reset\_login

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "n7XQnv8ozwyFPBC"
}
```

=\*=\*=\*=[#### `/sandbox/item/fire_webhook`](/docs/api/sandbox/#sandboxitemfire_webhook)

[#### Fire a test webhook](/docs/api/sandbox/#fire-a-test-webhook)

The [`/sandbox/item/fire_webhook`](/docs/api/sandbox/#sandboxitemfire_webhook) endpoint is used to test that code correctly handles webhooks. This endpoint can trigger the following webhooks:

`DEFAULT_UPDATE`: Webhook to be fired for a given Sandbox Item simulating a default update event for the respective product as specified with the `webhook_type` in the request body. Valid Sandbox `DEFAULT_UPDATE` webhook types include: `AUTH`, `IDENTITY`, `TRANSACTIONS`, `INVESTMENTS_TRANSACTIONS`, `LIABILITIES`, `HOLDINGS`. If the Item does not support the product, a `SANDBOX_PRODUCT_NOT_ENABLED` error will result.

`NEW_ACCOUNTS_AVAILABLE`: Fired to indicate that a new account is available on the Item and you can launch update mode to request access to it.

`SMS_MICRODEPOSITS_VERIFICATION`: Fired when a given Same-Day Micro-deposit Item is verified via SMS verification.

`LOGIN_REPAIRED`: Fired when an Item recovers from the `ITEM_LOGIN_REQUIRED` without the user going through update mode in your app.

`PENDING_DISCONNECT`: Fired when an Item will stop working in the near future (e.g. due to a planned bank migration) and must be sent through update mode to continue working.

`RECURRING_TRANSACTIONS_UPDATE`: Recurring Transactions webhook to be fired for a given Sandbox Item. If the Item does not support Recurring Transactions, a `SANDBOX_PRODUCT_NOT_ENABLED` error will result.

`SYNC_UPDATES_AVAILABLE`: Transactions webhook to be fired for a given Sandbox Item. If the Item does not support Transactions, a `SANDBOX_PRODUCT_NOT_ENABLED` error will result.

`PRODUCT_READY`: Assets webhook to be fired when a given asset report has been successfully generated. If the Item does not support Assets, a `SANDBOX_PRODUCT_NOT_ENABLED` error will result.

`ERROR`: Assets webhook to be fired when asset report generation has failed. If the Item does not support Assets, a `SANDBOX_PRODUCT_NOT_ENABLED` error will result.

`USER_PERMISSION_REVOKED`: Indicates an end user has revoked the permission that they previously granted to access an Item. May not always fire upon revocation, as some institutions' consent portals do not trigger this webhook. Upon receiving this webhook, it is recommended to delete any stored data from Plaid associated with the account or Item.

`USER_ACCOUNT_REVOKED`: Fired when an end user has revoked access to their account on the Data Provider's portal. This webhook is currently sent only for PNC Items, but may be sent in the future for other financial institutions. Upon receiving this webhook, it is recommended to delete any stored data from Plaid associated with the account or Item.

Note that this endpoint is provided for developer ease-of-use and is not required for testing webhooks; webhooks will also fire in Sandbox under the same conditions that they would in Production (except for webhooks of type `TRANSFER`).

/sandbox/item/fire\_webhook

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The access token associated with the Item for which data is being requested.

The webhook types that can be fired by this test endpoint.

Possible values: `AUTH`, `HOLDINGS`, `INVESTMENTS_TRANSACTIONS`, `ITEM`, `LIABILITIES`, `TRANSACTIONS`, `ASSETS`

The webhook codes that can be fired by this test endpoint.

Possible values: `DEFAULT_UPDATE`, `NEW_ACCOUNTS_AVAILABLE`, `SMS_MICRODEPOSITS_VERIFICATION`, `USER_PERMISSION_REVOKED`, `USER_ACCOUNT_REVOKED`, `PENDING_DISCONNECT`, `RECURRING_TRANSACTIONS_UPDATE`, `LOGIN_REPAIRED`, `SYNC_UPDATES_AVAILABLE`, `PRODUCT_READY`, `ERROR`

/sandbox/item/fire\_webhook

Nodeâ¼

```
// Fire a DEFAULT_UPDATE webhook for an Item
const request: SandboxItemFireWebhookRequest = {
  access_token: accessToken,
  webhook_code: 'DEFAULT_UPDATE'
};
try {
  const response = await plaidClient.sandboxItemFireWebhook(request);
} catch (error) {
  // handle error
}
```

/sandbox/item/fire\_webhook

**Response fields**

Value is `true` if the test `webhook_code` was successfully fired.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "webhook_fired": true,
  "request_id": "1vwmF5TBQwiqfwP"
}
```

=\*=\*=\*=[#### `/sandbox/item/set_verification_status`](/docs/api/sandbox/#sandboxitemset_verification_status)

[#### Set verification status for Sandbox account](/docs/api/sandbox/#set-verification-status-for-sandbox-account)

The [`/sandbox/item/set_verification_status`](/docs/api/sandbox/#sandboxitemset_verification_status) endpoint can be used to change the verification status of an Item in the Sandbox in order to simulate the Automated Micro-deposit flow.

For more information on testing Automated Micro-deposits in Sandbox, see [Auth full coverage testing](https://plaid.com/docs/auth/coverage/testing#).

/sandbox/item/set\_verification\_status

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The access token associated with the Item for which data is being requested.

The `account_id` of the account whose verification status is to be modified

The verification status to set the account to.

Possible values: `automatically_verified`, `verification_expired`

/sandbox/item/set\_verification\_status

Nodeâ¼

```
const request: SandboxItemSetVerificationStatusRequest = {
  access_token: accessToken,
  account_id: accountID,
  verification_status: 'automatically_verified',
};
try {
  const response = await plaidClient.sandboxItemSetVerificationStatus(request);
} catch (error) {
  // handle error
}
```

/sandbox/item/set\_verification\_status

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "1vwmF5TBQwiqfwP"
}
```

=\*=\*=\*=[#### `/sandbox/transfer/fire_webhook`](/docs/api/sandbox/#sandboxtransferfire_webhook)

[#### Manually fire a Transfer webhook](/docs/api/sandbox/#manually-fire-a-transfer-webhook)

Use the [`/sandbox/transfer/fire_webhook`](/docs/api/sandbox/#sandboxtransferfire_webhook) endpoint to manually trigger a `TRANSFER_EVENTS_UPDATE` webhook in the Sandbox environment.

/sandbox/transfer/fire\_webhook

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The URL to which the webhook should be sent.

Format: `url`

/sandbox/transfer/fire\_webhook

Nodeâ¼

```
const request: SandboxTransferFireWebhookRequest = {
  webhook: 'https://www.example.com',
};
try {
  const response = await plaidClient.sandboxTransferFireWebhook(request);
  // empty response upon success
} catch (error) {
  // handle error
}
```

/sandbox/transfer/fire\_webhook

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/sandbox/transfer/simulate`](/docs/api/sandbox/#sandboxtransfersimulate)

[#### Simulate a transfer event in Sandbox](/docs/api/sandbox/#simulate-a-transfer-event-in-sandbox)

Use the [`/sandbox/transfer/simulate`](/docs/api/sandbox/#sandboxtransfersimulate) endpoint to simulate a transfer event in the Sandbox environment. Note that while an event will be simulated and will appear when using endpoints such as [`/transfer/event/sync`](/docs/api/products/transfer/reading-transfers/#transfereventsync) or [`/transfer/event/list`](/docs/api/products/transfer/reading-transfers/#transfereventlist), no transactions will actually take place and funds will not move between accounts, even within the Sandbox.

/sandbox/transfer/simulate

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Plaid's unique identifier for a transfer.

Plaid's unique identifier for a test clock. If provided, the event to be simulated is created at the `virtual_time` on the provided `test_clock`.

The asynchronous event to be simulated. May be: `posted`, `settled`, `failed`, `funds_available`, or `returned`.

An error will be returned if the event type is incompatible with the current transfer status. Compatible status --> event type transitions include:

`pending` --> `failed`

`pending` --> `posted`

`posted` --> `returned`

`posted` --> `settled`

`settled` --> `funds_available` (only applicable to ACH debits.)

The failure reason if the event type for a transfer is `"failed"` or `"returned"`. Null value otherwise.

Hide object

The failure code, e.g. `R01`. A failure code will be provided if and only if the transfer status is `returned`. See [ACH return codes](https://plaid.com/docs/errors/transfer/#ach-return-codes) for a full listing of ACH return codes and [RTP/RfP error codes](https://plaid.com/docs/errors/transfer/#rtprfp-error-codes) for RTP error codes.

The ACH return code, e.g. `R01`. A return code will be provided if and only if the transfer status is `returned`. For a full listing of ACH return codes, see [Transfer errors](https://plaid.com/docs/errors/transfer/#ach-return-codes).

A human-readable description of the reason for the failure or reversal.

The webhook URL to which a `TRANSFER_EVENTS_UPDATE` webhook should be sent.

Format: `url`

/sandbox/transfer/simulate

Nodeâ¼

```
const request: SandboxTransferSimulateRequest = {
  transfer_id,
  event_type: 'posted',
  failure_reason: failureReason,
};
try {
  const response = await plaidClient.sandboxTransferSimulate(request);
  // empty response upon success
} catch (error) {
  // handle error
}
```

/sandbox/transfer/simulate

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/sandbox/transfer/refund/simulate`](/docs/api/sandbox/#sandboxtransferrefundsimulate)

[#### Simulate a refund event in Sandbox](/docs/api/sandbox/#simulate-a-refund-event-in-sandbox)

Use the [`/sandbox/transfer/refund/simulate`](/docs/api/sandbox/#sandboxtransferrefundsimulate) endpoint to simulate a refund event in the Sandbox environment. Note that while an event will be simulated and will appear when using endpoints such as [`/transfer/event/sync`](/docs/api/products/transfer/reading-transfers/#transfereventsync) or [`/transfer/event/list`](/docs/api/products/transfer/reading-transfers/#transfereventlist), no transactions will actually take place and funds will not move between accounts, even within the Sandbox.

/sandbox/transfer/refund/simulate

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Plaid's unique identifier for a refund.

Plaid's unique identifier for a test clock. If provided, the event to be simulated is created at the `virtual_time` on the provided `test_clock`.

The asynchronous event to be simulated. May be: `refund.posted`, `refund.settled`, `refund.failed`, or `refund.returned`.

An error will be returned if the event type is incompatible with the current refund status. Compatible status --> event type transitions include:

`refund.pending` --> `refund.failed`

`refund.pending` --> `refund.posted`

`refund.posted` --> `refund.returned`

`refund.posted` --> `refund.settled`

`refund.posted` events can only be simulated if the refunded transfer has been transitioned to settled. This mimics the ordering of events in Production.

The failure reason if the event type for a transfer is `"failed"` or `"returned"`. Null value otherwise.

Hide object

The failure code, e.g. `R01`. A failure code will be provided if and only if the transfer status is `returned`. See [ACH return codes](https://plaid.com/docs/errors/transfer/#ach-return-codes) for a full listing of ACH return codes and [RTP/RfP error codes](https://plaid.com/docs/errors/transfer/#rtprfp-error-codes) for RTP error codes.

The ACH return code, e.g. `R01`. A return code will be provided if and only if the transfer status is `returned`. For a full listing of ACH return codes, see [Transfer errors](https://plaid.com/docs/errors/transfer/#ach-return-codes).

A human-readable description of the reason for the failure or reversal.

The webhook URL to which a `TRANSFER_EVENTS_UPDATE` webhook should be sent.

Format: `url`

/sandbox/transfer/refund/simulate

Nodeâ¼

```
const request: SandboxTransferRefundSimulateRequest = {
  refund_id: refundId,
  event_type: 'refund.posted',
};
try {
  const response = await plaidClient.sandboxTransferRefundSimulate(request);
  // empty response upon success
} catch (error) {
  // handle error
}
```

/sandbox/transfer/refund/simulate

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/sandbox/transfer/ledger/deposit/simulate`](/docs/api/sandbox/#sandboxtransferledgerdepositsimulate)

[#### Simulate a ledger deposit event in Sandbox](/docs/api/sandbox/#simulate-a-ledger-deposit-event-in-sandbox)

Use the [`/sandbox/transfer/ledger/deposit/simulate`](/docs/api/sandbox/#sandboxtransferledgerdepositsimulate) endpoint to simulate a ledger deposit event in the Sandbox environment.

/sandbox/transfer/ledger/deposit/simulate

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Plaid's unique identifier for a sweep.

The asynchronous event to be simulated. May be: `posted`, `settled`, `failed`, or `returned`.

An error will be returned if the event type is incompatible with the current ledger sweep status. Compatible status --> event type transitions include:

`sweep.pending` --> `sweep.posted`

`sweep.pending` --> `sweep.failed`

`sweep.posted` --> `sweep.settled`

`sweep.posted` --> `sweep.returned`

`sweep.settled` --> `sweep.returned`

Possible values: `sweep.posted`, `sweep.settled`, `sweep.returned`, `sweep.failed`

The failure reason if the event type for a transfer is `"failed"` or `"returned"`. Null value otherwise.

Hide object

The failure code, e.g. `R01`. A failure code will be provided if and only if the transfer status is `returned`. See [ACH return codes](https://plaid.com/docs/errors/transfer/#ach-return-codes) for a full listing of ACH return codes and [RTP/RfP error codes](https://plaid.com/docs/errors/transfer/#rtprfp-error-codes) for RTP error codes.

The ACH return code, e.g. `R01`. A return code will be provided if and only if the transfer status is `returned`. For a full listing of ACH return codes, see [Transfer errors](https://plaid.com/docs/errors/transfer/#ach-return-codes).

A human-readable description of the reason for the failure or reversal.

/sandbox/transfer/ledger/deposit/simulate

Nodeâ¼

```
const request: SandboxTransferLedgerDepositSimulateRequest = {
  sweep_id: 'f4ba7a287eae4d228d12331b68a9f35a',
  event_type: 'sweep.posted',
};
try {
  const response = await plaidClient.sandboxTransferLedgerDepositSimulate(
    request,
  );
  // empty response upon success
} catch (error) {
  // handle error
}
```

/sandbox/transfer/ledger/deposit/simulate

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/sandbox/transfer/ledger/simulate_available`](/docs/api/sandbox/#sandboxtransferledgersimulate_available)

[#### Simulate converting pending balance to available balance](/docs/api/sandbox/#simulate-converting-pending-balance-to-available-balance)

Use the [`/sandbox/transfer/ledger/simulate_available`](/docs/api/sandbox/#sandboxtransferledgersimulate_available) endpoint to simulate converting pending balance to available balance for all originators in the Sandbox environment.

/sandbox/transfer/ledger/simulate\_available

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Specify which ledger balance to simulate converting pending balance to available balance. If this field is left blank, this will default to the id of the default ledger balance.

Client ID of the end customer (i.e. the originator). Only applicable to Transfer for Platforms customers.

Plaid's unique identifier for a test clock. If provided, only the pending balance that is due before the `virtual_time` on the test clock will be converted.

The webhook URL to which a `TRANSFER_EVENTS_UPDATE` webhook should be sent.

Format: `url`

/sandbox/transfer/ledger/simulate\_available

Nodeâ¼

```
try {
  const response = await plaidClient.sandboxTransferLedgerSimulateAvailable({});
} catch (error) {
  // handle error
}
```

/sandbox/transfer/ledger/simulate\_available

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/sandbox/transfer/ledger/withdraw/simulate`](/docs/api/sandbox/#sandboxtransferledgerwithdrawsimulate)

[#### Simulate a ledger withdraw event in Sandbox](/docs/api/sandbox/#simulate-a-ledger-withdraw-event-in-sandbox)

Use the [`/sandbox/transfer/ledger/withdraw/simulate`](/docs/api/sandbox/#sandboxtransferledgerwithdrawsimulate) endpoint to simulate a ledger withdraw event in the Sandbox environment.

/sandbox/transfer/ledger/withdraw/simulate

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Plaid's unique identifier for a sweep.

The asynchronous event to be simulated. May be: `posted`, `settled`, `failed`, or `returned`.

An error will be returned if the event type is incompatible with the current ledger sweep status. Compatible status --> event type transitions include:

`sweep.pending` --> `sweep.posted`

`sweep.pending` --> `sweep.failed`

`sweep.posted` --> `sweep.settled`

`sweep.posted` --> `sweep.returned`

`sweep.settled` --> `sweep.returned`

Possible values: `sweep.posted`, `sweep.settled`, `sweep.returned`, `sweep.failed`

The failure reason if the event type for a transfer is `"failed"` or `"returned"`. Null value otherwise.

Hide object

The failure code, e.g. `R01`. A failure code will be provided if and only if the transfer status is `returned`. See [ACH return codes](https://plaid.com/docs/errors/transfer/#ach-return-codes) for a full listing of ACH return codes and [RTP/RfP error codes](https://plaid.com/docs/errors/transfer/#rtprfp-error-codes) for RTP error codes.

The ACH return code, e.g. `R01`. A return code will be provided if and only if the transfer status is `returned`. For a full listing of ACH return codes, see [Transfer errors](https://plaid.com/docs/errors/transfer/#ach-return-codes).

A human-readable description of the reason for the failure or reversal.

/sandbox/transfer/ledger/withdraw/simulate

Nodeâ¼

```
const request: SandboxTransferLedgerWithdrawSimulateRequest = {
  sweep_id: 'f4ba7a287eae4d228d12331b68a9f35a',
  event_type: 'sweep.posted',
};
try {
  const response = await plaidClient.sandboxTransferLedgerWithdrawSimulate(
    request,
  );
  // empty response upon success
} catch (error) {
  // handle error
}
```

/sandbox/transfer/ledger/withdraw/simulate

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/sandbox/transfer/test_clock/create`](/docs/api/sandbox/#sandboxtransfertest_clockcreate)

[#### Create a test clock](/docs/api/sandbox/#create-a-test-clock)

Use the [`/sandbox/transfer/test_clock/create`](/docs/api/sandbox/#sandboxtransfertest_clockcreate) endpoint to create a `test_clock` in the Sandbox environment.

A test clock object represents an independent timeline and has a `virtual_time` field indicating the current timestamp of the timeline. Test clocks are used for testing recurring transfers in Sandbox.

A test clock can be associated with up to 5 recurring transfers.

/sandbox/transfer/test\_clock/create

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The virtual timestamp on the test clock. If not provided, the current timestamp will be used. This will be of the form `2006-01-02T15:04:05Z`.

Format: `date-time`

/sandbox/transfer/test\_clock/create

Nodeâ¼

```
const request: SandboxTransferTestClockCreateRequest = {
  virtual_time: '2006-01-02T15:04:05Z',
};
try {
  const response = await plaidClient.sandboxTransferTestClockCreate(request);
  const test_clock = response.data.test_clock;
} catch (error) {
  // handle error
}
```

/sandbox/transfer/test\_clock/create

**Response fields**

Collapse all

Defines the test clock for a transfer.

Hide object

Plaid's unique identifier for a test clock. This field is only populated in the Sandbox environment, and only if a `test_clock_id` was included in the `/transfer/recurring/create` request. For more details, see [Simulating recurring transfers](https://plaid.com/docs/transfer/sandbox/#simulating-recurring-transfers).

The virtual timestamp on the test clock. This will be of the form `2006-01-02T15:04:05Z`.

Format: `date-time`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "test_clock": {
    "test_clock_id": "b33a6eda-5e97-5d64-244a-a9274110151c",
    "virtual_time": "2006-01-02T15:04:05Z"
  },
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/sandbox/transfer/test_clock/advance`](/docs/api/sandbox/#sandboxtransfertest_clockadvance)

[#### Advance a test clock](/docs/api/sandbox/#advance-a-test-clock)

Use the [`/sandbox/transfer/test_clock/advance`](/docs/api/sandbox/#sandboxtransfertest_clockadvance) endpoint to advance a `test_clock` in the Sandbox environment.

A test clock object represents an independent timeline and has a `virtual_time` field indicating the current timestamp of the timeline. A test clock can be advanced by incrementing `virtual_time`, but may never go back to a lower `virtual_time`.

If a test clock is advanced, we will simulate the changes that ought to occur during the time that elapsed.

For example, a client creates a weekly recurring transfer with a test clock set at t. When the client advances the test clock by setting `virtual_time` = t + 15 days, 2 new originations should be created, along with the webhook events.

The advancement of the test clock from its current `virtual_time` should be limited such that there are no more than 20 originations resulting from the advance operation on each `recurring_transfer` associated with the `test_clock`.

For example, if the recurring transfer associated with this test clock originates once every 4 weeks, you can advance the `virtual_time` up to 80 weeks on each API call.

/sandbox/transfer/test\_clock/advance

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Plaid's unique identifier for a test clock. This field is only populated in the Sandbox environment, and only if a `test_clock_id` was included in the `/transfer/recurring/create` request. For more details, see [Simulating recurring transfers](https://plaid.com/docs/transfer/sandbox/#simulating-recurring-transfers).

The virtual timestamp on the test clock. This will be of the form `2006-01-02T15:04:05Z`.

Format: `date-time`

/sandbox/transfer/test\_clock/advance

Nodeâ¼

```
const request: SandboxTransferTestClockAdvanceRequest = {
  test_clock_id: 'b33a6eda-5e97-5d64-244a-a9274110151c',
  new_virtual_time: '2006-01-02T15:04:05Z',
};
try {
  const response = await plaidClient.sandboxTransferTestClockAdvance(request);
} catch (error) {
  // handle error
}
```

/sandbox/transfer/test\_clock/advance

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/sandbox/transfer/test_clock/get`](/docs/api/sandbox/#sandboxtransfertest_clockget)

[#### Get a test clock](/docs/api/sandbox/#get-a-test-clock)

Use the [`/sandbox/transfer/test_clock/get`](/docs/api/sandbox/#sandboxtransfertest_clockget) endpoint to get a `test_clock` in the Sandbox environment.

/sandbox/transfer/test\_clock/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Plaid's unique identifier for a test clock. This field is only populated in the Sandbox environment, and only if a `test_clock_id` was included in the `/transfer/recurring/create` request. For more details, see [Simulating recurring transfers](https://plaid.com/docs/transfer/sandbox/#simulating-recurring-transfers).

/sandbox/transfer/test\_clock/get

Nodeâ¼

```
const request: SandboxTransferTestClockGetRequest = {
  test_clock_id: 'b33a6eda-5e97-5d64-244a-a9274110151c',
};
try {
  const response = await plaidClient.sandboxTransferTestClockGet(request);
  const test_clock = response.data.test_clock;
} catch (error) {
  // handle error
}
```

/sandbox/transfer/test\_clock/get

**Response fields**

Collapse all

Defines the test clock for a transfer.

Hide object

Plaid's unique identifier for a test clock. This field is only populated in the Sandbox environment, and only if a `test_clock_id` was included in the `/transfer/recurring/create` request. For more details, see [Simulating recurring transfers](https://plaid.com/docs/transfer/sandbox/#simulating-recurring-transfers).

The virtual timestamp on the test clock. This will be of the form `2006-01-02T15:04:05Z`.

Format: `date-time`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "test_clock": {
    "test_clock_id": "b33a6eda-5e97-5d64-244a-a9274110151c",
    "virtual_time": "2006-01-02T15:04:05Z"
  },
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/sandbox/transfer/test_clock/list`](/docs/api/sandbox/#sandboxtransfertest_clocklist)

[#### List test clocks](/docs/api/sandbox/#list-test-clocks)

Use the [`/sandbox/transfer/test_clock/list`](/docs/api/sandbox/#sandboxtransfertest_clocklist) endpoint to see a list of all your test clocks in the Sandbox environment, by ascending `virtual_time`. Results are paginated; use the `count` and `offset` query parameters to retrieve the desired test clocks.

/sandbox/transfer/test\_clock/list

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The start virtual timestamp of test clocks to return. This should be in RFC 3339 format (i.e. `2019-12-06T22:35:49Z`)

Format: `date-time`

The end virtual timestamp of test clocks to return. This should be in RFC 3339 format (i.e. `2019-12-06T22:35:49Z`)

Format: `date-time`

The maximum number of test clocks to return.

Minimum: `1`

Maximum: `25`

Default: `25`

The number of test clocks to skip before returning results.

Default: `0`

Minimum: `0`

/sandbox/transfer/test\_clock/list

Nodeâ¼

```
const request: SandboxTransferTestClockListRequest = {
  count: 2,
};
try {
  const response = await plaidClient.sandboxTransferTestClockList(request);
  const test_clocks = response.data.test_clocks;
} catch (error) {
  // handle error
}
```

/sandbox/transfer/test\_clock/list

**Response fields**

Collapse all

Hide object

Plaid's unique identifier for a test clock. This field is only populated in the Sandbox environment, and only if a `test_clock_id` was included in the `/transfer/recurring/create` request. For more details, see [Simulating recurring transfers](https://plaid.com/docs/transfer/sandbox/#simulating-recurring-transfers).

The virtual timestamp on the test clock. This will be of the form `2006-01-02T15:04:05Z`.

Format: `date-time`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "test_clocks": [
    {
      "test_clock_id": "b33a6eda-5e97-5d64-244a-a9274110151c",
      "virtual_time": "2006-01-02T15:04:05Z"
    },
    {
      "test_clock_id": "a33a6eda-5e97-5d64-244a-a9274110152d",
      "virtual_time": "2006-02-02T15:04:05Z"
    }
  ],
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/sandbox/income/fire_webhook`](/docs/api/sandbox/#sandboxincomefire_webhook)

[#### Manually fire an Income webhook](/docs/api/sandbox/#manually-fire-an-income-webhook)

Use the [`/sandbox/income/fire_webhook`](/docs/api/sandbox/#sandboxincomefire_webhook) endpoint to manually trigger a Payroll or Document Income webhook in the Sandbox environment.

/sandbox/income/fire\_webhook

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The Item ID associated with the verification.

The Plaid `user_id` of the User associated with this webhook, warning, or error.

The URL to which the webhook should be sent.

Format: `url`

`VERIFICATION_STATUS_PROCESSING_COMPLETE`: The income verification status processing has completed. If the user uploaded multiple documents, this webhook will fire when all documents have finished processing. Call the `/income/verification/paystubs/get` endpoint and check the document metadata to see which documents were successfully parsed.

`VERIFICATION_STATUS_PROCESSING_FAILED`: A failure occurred when attempting to process the verification documentation.

`VERIFICATION_STATUS_PENDING_APPROVAL`: (deprecated) The income verification has been sent to the user for review.

Possible values: `VERIFICATION_STATUS_PROCESSING_COMPLETE`, `VERIFICATION_STATUS_PROCESSING_FAILED`, `VERIFICATION_STATUS_PENDING_APPROVAL`

The webhook codes that can be fired by this test endpoint.

Possible values: `INCOME_VERIFICATION`, `INCOME_VERIFICATION_RISK_SIGNALS`

/sandbox/income/fire\_webhook

Nodeâ¼

```
const request: SandboxIncomeFireWebhookRequest = {
  item_id: 'Rn3637v1adCNj5Dl1LG6idQBzqBLwRcRZLbgM',
  webhook: 'https://webhook.com/',
  webhook_code: 'INCOME_VERIFICATION',
  verification_status: 'VERIFICATION_STATUS_PROCESSING_COMPLETE',
};
try {
  const response = await plaidClient.sandboxIncomeFireWebhook(request);
  // empty response upon success
} catch (error) {
  // handle error
}
```

/sandbox/income/fire\_webhook

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/sandbox/cra/cashflow_updates/update`](/docs/api/sandbox/#sandboxcracashflow_updatesupdate)

[#### Trigger an update for Cash Flow Updates](/docs/api/sandbox/#trigger-an-update-for-cash-flow-updates)

Use the [`/sandbox/cra/cashflow_updates/update`](/docs/api/sandbox/#sandboxcracashflow_updatesupdate) endpoint to manually trigger an update for Cash Flow Updates (Monitoring) in the Sandbox environment.

/sandbox/cra/cashflow\_updates/update

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The user token associated with the user for which data is being requested. This field is used only by customers with pre-existing integrations that already use the `user_token` field. All other customers should use the `user_id` instead. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

Webhook codes corresponding to the Cash Flow Updates events to be simulated.

Possible values: `LARGE_DEPOSIT_DETECTED`, `LOW_BALANCE_DETECTED`, `NEW_LOAN_PAYMENT_DETECTED`, `NSF_OVERDRAFT_DETECTED`

A unique user identifier, created by `/user/create`. Integrations that began using `/user/create` after December 10, 2025 use this field to identify a user instead of the `user_token`. For more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis).

/sandbox/cra/cashflow\_updates/update

Nodeâ¼

```
const request: SandboxCraCashflowUpdatesUpdateRequest = {
  user_id: 'usr_9nSp2KuZ2x4JDw',
  webhook_codes: ['LARGE_DEPOSIT_DETECTED', 'LOW_BALANCE_DETECTED'],
};
try {
  const response = await plaidClient.sandboxCraCashflowUpdatesUpdate(request);
  // empty response upon success
} catch (error) {
  // handle error
}
```

/sandbox/cra/cashflow\_updates/update

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "mdqfuVxeoza6mhu"
}
```

=\*=\*=\*=[#### `/sandbox/payment/simulate`](/docs/api/sandbox/#sandboxpaymentsimulate)

[#### Simulate a payment event in Sandbox](/docs/api/sandbox/#simulate-a-payment-event-in-sandbox)

Use the [`/sandbox/payment/simulate`](/docs/api/sandbox/#sandboxpaymentsimulate) endpoint to simulate various payment events in the Sandbox environment. This endpoint will trigger the corresponding payment status webhook.

/sandbox/payment/simulate

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The ID of the payment to simulate

The webhook url to use for any payment events triggered by the simulated status change.

The status to set the payment to.

Valid statuses include:

- `PAYMENT_STATUS_INITIATED`
- `PAYMENT_STATUS_INSUFFICIENT_FUNDS`
- `PAYMENT_STATUS_FAILED`
- `PAYMENT_STATUS_EXECUTED`
- `PAYMENT_STATUS_SETTLED`
- `PAYMENT_STATUS_CANCELLED`
- `PAYMENT_STATUS_REJECTED`

/sandbox/payment/simulate

Nodeâ¼

```
const request: SandboxPaymentSimulateRequest = {
  payment_id: 'payment-id-sandbox-feca8a7a-5591-4aef-9297-f3062bb735d3',
  webhook: 'https://webhook.com/',
  status: "PAYMENT_STATUS_INITIATED"
};
try {
  const response = await plaidClient.sandboxPaymentSimulate(request);
} catch (error) {
  // handle error
}
```

/sandbox/payment/simulate

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

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

Response Object

```
{
  "request_id": "m8MDnv9okwxFNBV",
  "old_status": "PAYMENT_STATUS_INPUT_NEEDED",
  "new_status": "PAYMENT_STATUS_INITIATED"
}
```

=\*=\*=\*=[#### `/sandbox/transactions/create`](/docs/api/sandbox/#sandboxtransactionscreate)

[#### Create sandbox transactions](/docs/api/sandbox/#create-sandbox-transactions)

Use the [`/sandbox/transactions/create`](/docs/api/sandbox/#sandboxtransactionscreate) endpoint to create new transactions for an existing Item. This endpoint can be used to add up to 10 transactions to any Item at a time.

This endpoint can only be used with Items that were created in the Sandbox environment using the `user_transactions_dynamic` test user. You can use this to add transactions to test the [`/transactions/get`](/docs/api/products/transactions/#transactionsget) and [`/transactions/sync`](/docs/api/products/transactions/#transactionssync) endpoints.

Custom transactions are only applied to the depository account. Support for per-account targeting may be added in the future.

/sandbox/transactions/create

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The access token associated with the Item for which data is being requested.

List of transactions to be added

Hide object

The date of the transaction, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) (YYYY-MM-DD) format. Transaction date must be the present date or a date up to 14 days in the past. Future dates are not allowed.

Format: `date`

The date the transaction posted, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) (YYYY-MM-DD) format. Posted date must be the present date or a date up to 14 days in the past. Future dates are not allowed.

Format: `date`

The transaction amount. Can be negative.

Format: `double`

The transaction description.

The ISO-4217 format currency code for the transaction. Defaults to USD.

/sandbox/transactions/create

Nodeâ¼

```
const request: SandboxTransactionsCreateRequest = {
  access_token: accessToken,
  transactions: [
    {
      amount: 100.50,
      date_posted: '2025-06-08',
      date_transacted: '2025-06-08',
      description: 'Tim Hortons'
    },
    {
      amount: -25.75,
      date_posted: '2025-06-08',
      date_transacted: '2025-06-08',
      description: 'BestBuy',
      iso_currency_code: 'CAD'
    }
  ]
};
try {
  const response = await plaidClient.sandboxTransactionsCreate(request);
} catch (error) {
  // handle error
}
```

/sandbox/transactions/create

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "m8MDnv9okwxFNBV"
}
```
