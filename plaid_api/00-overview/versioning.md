---
title: "API Versioning"
source_url: "https://plaid.com/docs/api/versioning/"
section: "Overview"
section_id: "00-overview"
slug: "versioning"
endpoints:
  - "/institutions/get_by_id"
  - "/institutions/search"
  - "/item/remove"
  - "/institutions/get"
  - "/processor/auth/get"
  - "/auth/get"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# API versioning and changelog

> **Source:** [https://plaid.com/docs/api/versioning/](https://plaid.com/docs/api/versioning/)
> **Section:** Overview

## Endpoints & Webhooks on this page

- `/institutions/get_by_id`
- `/institutions/search`
- `/item/remove`
- `/institutions/get`
- `/processor/auth/get`
- `/auth/get`

---

# API versioning and changelog

#### Keep track of changes and updates to the Plaid API

[#### API versioning](/docs/api/versioning/#api-versioning)

This page covers backwards-incompatible, versioned API changes. For a list of all API updates, including non-versioned ones, see the [changelog](/docs/changelog/).

Whenever we make a backwards-incompatible change to a general availability, non-beta product, we release a new API version to avoid causing breakages for existing developers. You can then continue to use the old API version, or update your application to upgrade to the new Plaid API version. APIs for beta products are subject to breaking changes without versioning, with 30 days notice.

We consider the following changes to be backwards compatible (non-breaking):

- Adding new API endpoints
- Adding new optional parameters to existing endpoints
- Adding new data elements to existing response schemas or webhooks
- Adding new enum values, including `error_types` and `error_codes`
- Subdividing existing `error_codes` into more precise errors, and changing the http response code as necessary, as long as the error cannot be resolved via in-app logic (such as launching update mode or waiting for a few seconds and retrying) during runtime. For example, changing `PRODUCT_NOT_READY` errors to a different `error_code` would be a breaking change, since that error can be resolved by retrying a few seconds later, but converting an existing `INTERNAL_SERVER_ERROR` to a more specific error would not be.
- Changing the behavior for use cases or platforms that are explicitly not supported.
- Adding new `webhook_types` and `webhook_codes`
- Changing the length or content of any API identifier

[##### How to set your API version](/docs/api/versioning/#how-to-set-your-api-version)

The default version of the API used in any requests you make can be configured in the [Dashboard](https://dashboard.plaid.com/developers/api) and will be used when version information is not otherwise specified. You can also manually set the `Plaid-Version` header to use a specific version for a given API request.

If you're using one of the Plaid client libraries, they should all be pinned to the latest version of the API at the time when they were
released. This means that you can change the API version you're using by updating to a newer version of the client library.

API version example

Nodeâ¼

```
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

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

const client = new PlaidApi(configuration);
```

[#### Version 2020-09-14](/docs/api/versioning/#version-2020-09-14)

This version includes several changes to improve authentication, streamline and simplify the API, and improve international support.

- To improve authentication, the `public_key` has been fully removed from the API. Endpoints that previously accepted a `public_key` for authentication, namely [`/institutions/get_by_id`](/docs/api/institutions/#institutionsget_by_id) and [`/institutions/search`](/docs/api/institutions/#institutionssearch), now require a `client_id` and `secret` for authentication instead.
- [`/item/remove`](/docs/api/items/#itemremove) no longer returns a `removed` boolean. This field created developer confusion, because it was never possible for it to return `false`. A failed [`/item/remove`](/docs/api/items/#itemremove) call will result in an [error](/docs/errors/) being returned instead.
- Several undocumented and unused fields have been removed from the `institution` object returned by the institutions endpoints [`/institutions/get`](/docs/api/institutions/#institutionsget), [`/institutions/get_by_id`](/docs/api/institutions/#institutionsget_by_id), and [`/institutions/search`](/docs/api/institutions/#institutionssearch). The removed fields are: `input_spec`, `credentials`, `include_display_data`, `has_mfa`, `mfa`, and `mfa_code_type`.
- The institutions endpoints [`/institutions/get`](/docs/api/institutions/#institutionsget), [`/institutions/get_by_id`](/docs/api/institutions/#institutionsget_by_id), and [`/institutions/search`](/docs/api/institutions/#institutionssearch) now require the use of a `country_codes` parameter and no longer use `US` as a default value if `country_codes` is not specified, as this behavior caused confusion and unexpected behavior for non-US developers. As part of this change, the `country_codes` parameter has been moved out of the `options` object and is now a top-level parameter.
- To support international payments, the response schema for the partner-only [`/processor/auth/get`](/docs/api/processor-partners/#processorauthget) endpoint has changed. The 2018-05-22 and 2019-05-29 API releases previously extended the response schema for [`/auth/get`](/docs/api/products/auth/#authget) in order to support international accounts, but these changes were never extended to the [`/processor/auth/get`](/docs/api/processor-partners/#processorauthget) endpoint. This release brings the response for [`/processor/auth/get`](/docs/api/processor-partners/#processorauthget) in line with the [`/auth/get`](/docs/api/products/auth/#authget) response, allowing Plaid partners to extend support for using non-ACH payment methods, such as EFT payments (Canada) or SEPA credit and direct debit (Europe). Accommodating this change does not require any code changes from Plaid developers who use partnership integrations, only from the Plaid partners themselves.

Previous /processor/auth/get response

```
"numbers": [{
  "account": "9900009606",
  "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
  "routing": "011401533",
  "wire_routing": "021000021"
}]
```

2020-09-14 API version /processor/auth/get response

```
"numbers": {
  "ach": [{
    "account": "9900009606",
    "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
    "routing": "011401533",
    "wire_routing": "021000021"
  }],
  "eft":[{
    "account": "111122223333",
    "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
    "institution": "021",
    "branch": "01140"
  }],
  "international":[{
    "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
    "bic": "NWBKGB21",
    "iban": "GB29NWBK60161331926819"
  }],
  "bacs":[{
    "account": "31926819",
    "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
    "sort_code": "601613"
  }]
}
```

[#### Version 2019-05-29](/docs/api/versioning/#version-2019-05-29)

- The Auth `numbers` schema has been extended to support Bacs (UK) and other international (IBAN and BIC) account
  numbers used across the EU.
- Renamed the `zip` field to `postal_code` and the `state` field to `region` in all [Identity](/docs/api/products/identity/) and
  [Transactions](/docs/api/products/transactions/) responses to be more international friendly.
- [Identity](/docs/api/products/identity/) objects in [Identity responses](/docs/api/products/identity/) are now embedded on the `owners` field of the
  corresponding account.
- Address data fields for [Identity](/docs/api/products/identity/) responses are now nullable and are returned with a null value when they
  aren't available rather than an empty string.
- Added an ISO-3166-1 alpha-2 `country` field to all [Identity](/docs/api/products/identity/) and [Transactions](/docs/api/products/transactions/) responses.
- The account type `brokerage` has been renamed to `investment`.

These changes are meant to enable access to International institutions for Plaid's launch in Europe and add support for
investment accounts. Test in the [Sandbox](/docs/sandbox/) with the new API version to see the new Schema and enable support
for International institutions from the [Dashboard](https://dashboard.plaid.com/developers/api) in order to create Items for these institutions.

[##### Auth](/docs/api/versioning/#auth)

Before, `numbers` only had fields for `ach` (US accounts) and `eft` (Canadian accounts) accounts numbers:

Previous Auth response (2018-05-22 version)

```
"numbers": {
  "ach": [{
    "account": "9900009606",
    "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
    "routing": "011401533",
    "wire_routing": "021000021"
  }],
  "eft":[{
    "account": "111122223333",
    "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
    "institution": "021",
    "branch": "01140"
  }]
}
```

Now, the structure of `numbers` hasn't changed, but it can have `ach`, `eft`, `bacs` (UK accounts), or `international`
(currently EU accounts) numbers. Note that the schema for each of these numbers are different from one another. It is
possible for multiple networks to be present in the response.

New Auth response (2019-05-29 version)

```
"numbers": {
  "ach": [{
    "account": "9900009606",
    "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
    "routing": "011401533",
    "wire_routing": "021000021"
  }],
  "eft":[{
    "account": "111122223333",
    "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
    "institution": "021",
    "branch": "01140"
  }],
  "international":[{
    "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
    "bic": "NWBKGB21",
    "iban": "GB29NWBK60161331926819"
  }],
  "bacs":[{
    "account": "31926819",
    "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
    "sort_code": "601613"
  }]
}
```

[##### Identity](/docs/api/versioning/#identity)

The previous version of [Identity](/docs/api/products/identity/) had US specific field names and did not include a country as part of the
location. Furthermore, the identity data was not scoped to a specific account.

Previous Identity response (2018-05-22 version)

```
"identity": {
  "addresses": [{
    "accounts": [
      "Plaid Checking 0000",
      "Plaid Saving 1111",
      "Plaid CD 2222"
    ],
    "data": {
      "city": "Malakoff",
      "state": "NY",
      "street": "2992 Cameron Road",
      "zip": "14236"
    },
    "primary": true
  }],
  ...
}
```

Now, `identity` has international friendly field names of `region` and `postal_code` instead of `zip` and `state` as
well as an ISO-3166-1 alpha-2 `country` field. Address data fields (`city`, `region`, `street`, `postal_code`, and
`country`) are now nullable and are returned with a `null` value when they aren't available rather than as an empty
string. The identity object is now available on the "owners" key of the account, which represents ownership of specific
accounts.

New Identity response (2019-05-29 version)

```
"accounts": [{
  ...
  "owners": [{
    "addresses": [{
      "data": {
        "city": "Malakoff",
        "region": "NY",
        "street": "2992 Cameron Road",
        "postal_code": "14236",
        "country": "US"
      },
      "primary": true
    }]
  }],
  ...
}]
```

[##### Transactions](/docs/api/versioning/#transactions)

When no transactions are returned from a request, the `transactions` object will now be `null` rather than an empty array.

In addition, the same changes to [Identity](/docs/api/products/identity/) were also made to [Transactions](/docs/api/products/transactions/).

Previous Transactions response (2018-05-22 version)

```
"transactions": [{
  ...
  "location": {
    "address": "300 Post St",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94108",
    "lat": null,
    "lon": null
  },
  ...
}]
```

New Transactions response (2019-05-29 version)

```
"transactions": [{
  ...
  "location": {
    "address": "300 Post St",
    "city": "San Francisco",
    "region": "CA",
    "postal_code": "94108",
    "country": "US",
    "lat": null,
    "lon": null
  },
  ...
}]
```

[##### Institutions](/docs/api/versioning/#institutions)

Changes to the institutions schema affect responses from all of the institutions API endpoints:

- POST [`/institutions/search`](/docs/api/institutions/#institutionssearch)
- POST [`/institutions/get`](/docs/api/institutions/#institutionsget)
- POST [`/institutions/get_by_id`](/docs/api/institutions/#institutionsget_by_id)

The previous version of the Institution schema did not include the country of the institution as part of
the response.

Previous Institution response (2018-05-22 version)

```
"institution": {
  "credentials": [{
    "label": "User ID",
    "name": "username",
    "type": "text"
    }, {
    "label": "Password",
    "name": "password",
    "type": "password"
  }],
  "has_mfa": true,
  "institution_id": "ins_109512",
  "mfa": [
    "code",
    "list",
    "questions",
    "selections"
  ],
  "name": "Houndstooth Bank",
  "products": [
    "auth",
    "balance",
    "identity",
    "transactions"
  ],
  // included when options.include_status is true
  "status": {object}
}
```

New Institution response (2019-05-29 version)

```
"institution": {
  "country_codes": ["US"],
  "credentials": [{
    "label": "User ID",
    "name": "username",
    "type": "text"
    }, {
    "label": "Password",
    "name": "password",
    "type": "password"
  }],
  "has_mfa": true,
  "institution_id": "ins_109512",
  "mfa": [
    "code",
    "list",
    "questions",
    "selections"
  ],
  "name": "Houndstooth Bank",
  "products": [
    "auth",
    "balance",
    "identity",
    "transactions"
  ],
  // included when options.include_status is true
  "status": {object}
}
```

[#### Version 2018-05-22](/docs/api/versioning/#version-2018-05-22)

- The Auth `numbers` schema has changed to support ACH (US-based) and EFT (Canadian-based) account numbers
- Added the `iso_currency_code` and `unofficial_currency_code` fields to all [Accounts](/docs/api/accounts/#accounts-get-response-accounts) and
  [Transactions](/docs/api/products/transactions/) responses

Enable support for Canadian institutions from the [Dashboard](https://dashboard.plaid.com/developers/api) and then test in the [Sandbox](/docs/sandbox/) using
the test Canadian institution, Tartan-Dominion Bank of Canada (institution ID `ins_43`).

Before, `numbers` was a list of objects, each one representing the account and routing number for an ACH-eligible US
checking or savings account:

Previous Auth response (2017-03-08 version)

```
"numbers": [{
  "account": "9900009606",
  "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
  "routing": "011401533",
  "wire_routing": "021000021"
}]
```

**New Auth response (2018-05-22 version)**

Now, `numbers` can have either `ach` (US accounts) or `eft` (Canadian accounts) numbers. Note that the schema for `ach`
numbers and `eft` numbers are different from one another.

New Auth response (2018-05-22 version) for ACH numbers

```
"numbers": {
   "ach": [{
    "account": "9900009606",
    "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
    "routing": "011401533",
    "wire_routing": "021000021"
   }],
   "eft": []
}
```

New Auth response (2018-05-22 version) for EFT numbers

```
"numbers": {
   "ach":[],
   "eft":[{
    "account": "111122223333",
    "account_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
    "institution": "021",
    "branch": "01140"
   }]
}
```

[#### Version 2017-03-08](/docs/api/versioning/#version-2017-03-08)

The `2017-03-08` version was the first versioned release of the API.
