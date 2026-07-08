---
title: "Processor Tokens"
source_url: "https://plaid.com/docs/api/processors/"
section: "Partnerships"
section_id: "07-partnerships"
slug: "processors"
endpoints:
  - "/processor/token/create"
  - "/processor/token/permissions/set"
  - "/processor/token/permissions/get"
  - "/processor/stripe/bank_account_token/create"
  - "/sandbox/processor_token/create"
  - "/item/remove"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Processor token endpoints

> **Source:** [https://plaid.com/docs/api/processors/](https://plaid.com/docs/api/processors/)
> **Section:** Partnerships

## Endpoints & Webhooks on this page

- `/processor/token/create`
- `/processor/token/permissions/set`
- `/processor/token/permissions/get`
- `/processor/stripe/bank_account_token/create`
- `/sandbox/processor_token/create`
- `/item/remove`

---

# Processor token endpoints

#### API reference for endpoints for use with Plaid partners

Processor token endpoints are used to create tokens that are then sent to a Plaid partner for use in a Plaid integration. For a full list of integrations, see the [Plaid Dashboard](https://dashboard.plaid.com/developers/integrations). For specific information on Auth integrations, see [Auth payment partners](/docs/auth/partnerships/).

Are you a Plaid processor partner looking for API docs? The documentation on API endpoints for use by partners has moved to [Processor partner endpoints](/docs/api/processor-partners/).

| In this section |  |
| --- | --- |
| [`/processor/token/create`](/docs/api/processors/#processortokencreate) | Create a processor token |
| [`/processor/stripe/bank_account_token/create`](/docs/api/processors/#processorstripebank_account_tokencreate) | Create a bank account token for use with Stripe |
| [`/processor/token/permissions/set`](/docs/api/processors/#processortokenpermissionsset) | Set product permissions for a processor token |
| [`/processor/token/permissions/get`](/docs/api/processors/#processortokenpermissionsget) | Get product permissions for a processor token |

| See also |  |
| --- | --- |
| [`/sandbox/processor_token/create`](/docs/api/sandbox/#sandboxprocessor_tokencreate) | Create a test Item and processor token (Sandbox only) |

=\*=\*=\*=[#### `/processor/token/create`](/docs/api/processors/#processortokencreate)

[#### Create processor token](/docs/api/processors/#create-processor-token)

Used to create a token suitable for sending to one of Plaid's partners to enable integrations. Note that Stripe partnerships use bank account tokens instead; see [`/processor/stripe/bank_account_token/create`](/docs/api/processors/#processorstripebank_account_tokencreate) for creating tokens for use with Stripe integrations. If using multiple processors, multiple different processor tokens can be created for a single access token. Once created, a processor token for a given Item can be modified by calling [`/processor/token/permissions/set`](/docs/api/processors/#processortokenpermissionsset). To revoke the processor's access, the entire Item must be deleted by calling [`/item/remove`](/docs/api/items/#itemremove).

/processor/token/create

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The access token associated with the Item for which data is being requested.

The `account_id` value obtained from the `onSuccess` callback in Link

The processor you are integrating with.

Possible values: `dwolla`, `galileo`, `modern_treasury`, `ocrolus`, `vesta`, `drivewealth`, `vopay`, `achq`, `check`, `checkbook`, `circle`, `sila_money`, `rize`, `svb_api`, `unit`, `wyre`, `lithic`, `alpaca`, `astra`, `moov`, `treasury_prime`, `marqeta`, `checkout`, `solid`, `highnote`, `gemini`, `apex_clearing`, `gusto`, `adyen`, `atomic`, `i2c`, `wepay`, `riskified`, `utb`, `adp_roll`, `fortress_trust`, `bond`, `bakkt`, `teal`, `zero_hash`, `taba_pay`, `knot`, `sardine`, `alloy`, `finix`, `nuvei`, `layer`, `boom`, `paynote`, `stake`, `wedbush`, `esusu`, `ansa`, `scribeup`, `straddle`, `loanpro`, `bloom_credit`, `sfox`, `brale`, `parafin`, `cardless`, `open_ledger`, `valon`, `gainbridge`, `cardlytics`, `pinwheel`, `thread_bank`, `array`, `fiant`, `oatfi`, `curinos`, `frame`, `interchecks`, `interchange`, `atomicfi`, `pay`, `natural`, `kanmon`, `kick`

/processor/token/create

Nodeâ¼

```
const {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  ProcessorTokenCreateRequest,
} = require('plaid');
// Change sandbox to production when you're ready to go live!
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

const plaidClient = new PlaidApi(configuration);

try {
  // Exchange the public_token from Plaid Link for an access token.
  const tokenResponse = await plaidClient.itemPublicTokenExchange({
    public_token: PUBLIC_TOKEN,
  });
  const accessToken = tokenResponse.data.access_token;

  // Create a processor token for a specific account id.
  const request: ProcessorTokenCreateRequest = {
    access_token: accessToken,
    account_id: accountID,
    processor: 'dwolla',
  };
  const processorTokenResponse = await plaidClient.processorTokenCreate(
    request,
  );
  const processorToken = processorTokenResponse.data.processor_token;
} catch (error) {
  // handle error
}
```

/processor/token/create

**Response fields**

The `processor_token` that can then be used by the Plaid partner to make API requests

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "processor_token": "processor-sandbox-0asd1-a92nc",
  "request_id": "xrQNYZ7Zoh6R7gV"
}
```

=\*=\*=\*=[#### `/processor/token/permissions/set`](/docs/api/processors/#processortokenpermissionsset)

[#### Control a processor's access to products](/docs/api/processors/#control-a-processor's-access-to-products)

Used to control a processor's access to products on the given processor token. By default, a processor will have access to all available products on the corresponding item. To restrict access to a particular set of products, call this endpoint with the desired products. To restore access to all available products, call this endpoint with an empty list. This endpoint can be called multiple times as your needs and your processor's needs change.

/processor/token/permissions/set

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The processor token obtained from the Plaid integration partner. Processor tokens are in the format: `processor-<environment>-<identifier>`

A list of products the processor token should have access to. An empty list will grant access to all products.

Possible values: `assets`, `auth`, `balance`, `balance_plus`, `beacon`, `identity`, `identity_match`, `investments`, `investments_auth`, `liabilities`, `payment_initiation`, `identity_verification`, `transactions`, `credit_details`, `income`, `income_verification`, `standing_orders`, `transfer`, `employment`, `recurring_transactions`, `transactions_refresh`, `signal`, `statements`, `processor_payments`, `processor_identity`, `profile`, `cra_base_report`, `cra_income_insights`, `cra_partner_insights`, `cra_network_insights`, `cra_cashflow_insights`, `cra_monitoring`, `cra_lend_score`, `cra_plaid_credit_score`, `cra_qualify`, `layer`, `pay_by_bank`, `protect_linked_bank`, `protect_transactions`

/processor/token/permissions/set

Nodeâ¼

```
try {
  const request: ProcessorTokenPermissionsSetRequest = {
    processor_token: processorToken,
    products: ['auth', 'balance', 'identity'],
  };
  const response = await plaidClient.processorTokenPermissionsSet(request);
} catch (error) {
  // handle error
}
```

/processor/token/permissions/set

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "xrQNYZ7Zoh6R7gV"
}
```

=\*=\*=\*=[#### `/processor/token/permissions/get`](/docs/api/processors/#processortokenpermissionsget)

[#### Get a processor token's product permissions](/docs/api/processors/#get-a-processor-token's-product-permissions)

Used to get a processor token's product permissions. The `products` field will be an empty list if the processor can access all available products.

/processor/token/permissions/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The processor token obtained from the Plaid integration partner. Processor tokens are in the format: `processor-<environment>-<identifier>`

/processor/token/permissions/get

Nodeâ¼

```
try {
  const request: ProcessorTokenPermissionsGetRequest = {
    processor_token: processorToken,
  };
  const response = await plaidClient.processorTokenPermissionsGet(request);
  const products = response.data.products;
} catch (error) {
  // handle error
}
```

/processor/token/permissions/get

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

A list of products the processor token should have access to. An empty list means that the processor has access to all available products, including future products.

Possible values: `assets`, `auth`, `balance`, `balance_plus`, `beacon`, `identity`, `identity_match`, `investments`, `investments_auth`, `liabilities`, `payment_initiation`, `identity_verification`, `transactions`, `credit_details`, `income`, `income_verification`, `standing_orders`, `transfer`, `employment`, `recurring_transactions`, `transactions_refresh`, `signal`, `statements`, `processor_payments`, `processor_identity`, `profile`, `cra_base_report`, `cra_income_insights`, `cra_partner_insights`, `cra_network_insights`, `cra_cashflow_insights`, `cra_monitoring`, `cra_lend_score`, `cra_plaid_credit_score`, `cra_qualify`, `layer`, `pay_by_bank`, `protect_linked_bank`, `protect_transactions`

Response Object

```
{
  "request_id": "xrQNYZ7Zoh6R7gV",
  "products": [
    "auth",
    "balance",
    "identity"
  ]
}
```

=\*=\*=\*=[#### `/processor/stripe/bank_account_token/create`](/docs/api/processors/#processorstripebank_account_tokencreate)

[#### Create Stripe bank account token](/docs/api/processors/#create-stripe-bank-account-token)

Used to create a token suitable for sending to Stripe to enable Plaid-Stripe integrations. For a detailed guide on integrating Stripe, see [Add Stripe to your app](https://plaid.com/docs/auth/partnerships/stripe/).

Note that the Stripe bank account token is a one-time use token. To store bank account information for later use, you can use a Stripe customer object and create an associated bank account from the token, or you can use a Stripe Custom account and create an associated external bank account from the token. This bank account information should work indefinitely, unless the user's bank account information changes or they revoke Plaid's permissions to access their account. Stripe bank account information cannot be modified once the bank account token has been created. If you ever need to change the bank account details used by Stripe for a specific customer, have the user go through Link again and create a new bank account token from the new `access_token`.

To revoke a bank account token, the entire underlying access token must be revoked using [`/item/remove`](/docs/api/items/#itemremove).

/processor/stripe/bank\_account\_token/create

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The access token associated with the Item for which data is being requested.

The `account_id` value obtained from the `onSuccess` callback in Link

/processor/stripe/bank\_account\_token/create

Nodeâ¼

```
// Change sandbox to production when you're ready to go live!
const {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  ProcessorStripeBankAccountTokenCreateRequest,
} = require('plaid');
const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

const plaidClient = new PlaidApi(configuration);

try {
  // Exchange the public_token from Plaid Link for an access token.
  const tokenResponse = await plaidClient.itemPublicTokenExchange({
    public_token: PUBLIC_TOKEN,
  });
  const accessToken = tokenResponse.data.access_token;

  // Generate a bank account token
  const request: ProcessorStripeBankAccountTokenCreateRequest = {
    access_token: accessToken,
    account_id: accountID,
  };
  const stripeTokenResponse = await plaidClient.processorStripeBankAccountTokenCreate(
    request,
  );
  const bankAccountToken = stripeTokenResponse.data.stripe_bank_account_token;
} catch (error) {
  // handle error
}
```

/processor/stripe/bank\_account\_token/create

**Response fields**

A token that can be sent to Stripe for use in making API calls to Plaid

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "stripe_bank_account_token": "btok_5oEetfLzPklE1fwJZ7SG",
  "request_id": "xrQNYZ7Zoh6R7gV"
}
```
