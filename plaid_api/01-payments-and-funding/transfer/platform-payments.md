---
title: "Transfer / Platform Payments"
source_url: "https://plaid.com/docs/api/products/transfer/platform-payments/"
section: "Payments and Funding"
section_id: "01-payments-and-funding"
slug: "transfer--platform-payments"
endpoints:
  - "/transfer/platform/originator/create"
  - "/transfer/platform/person/create"
  - "/transfer/platform/requirement/submit"
  - "/transfer/platform/document/submit"
  - "/transfer/originator/get"
  - "/transfer/originator/list"
  - "/transfer/originator/funding_account/create"
  - "webhook"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Transfer for Platforms

> **Source:** [https://plaid.com/docs/api/products/transfer/platform-payments/](https://plaid.com/docs/api/products/transfer/platform-payments/)
> **Section:** Payments and Funding

## Endpoints & Webhooks on this page

- `/transfer/platform/originator/create`
- `/transfer/platform/person/create`
- `/transfer/platform/requirement/submit`
- `/transfer/platform/document/submit`
- `/transfer/originator/get`
- `/transfer/originator/list`
- `/transfer/originator/funding_account/create`
- `webhook`

---

# Transfer for Platforms

#### API reference for Transfer for Platforms endpoints

For how-to guidance, see the [Transfer for Platforms documentation](/docs/transfer/platform-payments/).

| Transfer for Platforms |  |
| --- | --- |
| [`/transfer/platform/originator/create`](/docs/api/products/transfer/platform-payments/#transferplatformoriginatorcreate) | Pass transfer specific onboarding info for the originator |
| [`/transfer/platform/person/create`](/docs/api/products/transfer/platform-payments/#transferplatformpersoncreate) | Create each individual who is a beneficial owner or control person of the business |
| [`/transfer/platform/requirement/submit`](/docs/api/products/transfer/platform-payments/#transferplatformrequirementsubmit) | Pass additional data Plaid needs to make an onboarding decision for the originator |
| [`/transfer/platform/document/submit`](/docs/api/products/transfer/platform-payments/#transferplatformdocumentsubmit) | Submit documents Plaid needs to verify information about the originator |
| [`/transfer/originator/get`](/docs/api/products/transfer/platform-payments/#transferoriginatorget) | Get the status of an originator's onboarding |
| [`/transfer/originator/list`](/docs/api/products/transfer/platform-payments/#transferoriginatorlist) | Get the status of all originators' onboarding |
| [`/transfer/originator/funding_account/create`](/docs/api/products/transfer/platform-payments/#transferoriginatorfunding_accountcreate) | Create a new funding account for an originator |

=\*=\*=\*=[#### `/transfer/platform/originator/create`](/docs/api/products/transfer/platform-payments/#transferplatformoriginatorcreate)

[#### Create an originator for Transfer for Platforms customers](/docs/api/products/transfer/platform-payments/#create-an-originator-for-transfer-for-platforms-customers)

Use the [`/transfer/platform/originator/create`](/docs/api/products/transfer/platform-payments/#transferplatformoriginatorcreate) endpoint to submit information about the originator you are onboarding, including the originator's agreement to the required legal terms.

/transfer/platform/originator/create

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The client ID of the originator

Metadata related to the acceptance of Terms of Service

Hide object

Indicates whether the TOS agreement was accepted

The IP address of the originator when they accepted the TOS. Formatted as an IPv4 or IPv6 IP address

ISO8601 timestamp indicating when the originator accepted the TOS

Format: `date-time`

ISO8601 timestamp indicating the most recent time the platform collected onboarding data from the originator

Format: `date-time`

The webhook URL to which a `PLATFORM_ONBOARDING_UPDATE` webhook should be sent.

Format: `url`

/transfer/platform/originator/create

Nodeâ¼

```
const request: TransferPlatformOriginatorCreateRequest = {
    originator_client_id: "6a65dh3d1h0d1027121ak184",
    tos_acceptance_metadata: {
      agreement_accepted: true,
      originator_ip_address: "192.0.2.42",
      agreement_accepted_at: "2017-09-14T14:42:19.350Z"
    },
    originator_reviewed_at: "2024-07-29T20:22:21Z",
    webhook: "https://webhook.com/webhook"
};

try {
  const response = await client.transferPlatformOriginatorCreate(request);
} catch (error) {
  // handle error
}
```

/transfer/platform/originator/create

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "saKrIBuEB9qJZno"
}
```

=\*=\*=\*=[#### `/transfer/platform/person/create`](/docs/api/products/transfer/platform-payments/#transferplatformpersoncreate)

[#### Create a person associated with an originator](/docs/api/products/transfer/platform-payments/#create-a-person-associated-with-an-originator)

Use the [`/transfer/platform/person/create`](/docs/api/products/transfer/platform-payments/#transferplatformpersoncreate) endpoint to create a person associated with an originator (e.g. beneficial owner or control person) and optionally submit personal identification information for them.

/transfer/platform/person/create

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The client ID of the originator

The person's legal name

Hide object

A string with at least one non-whitespace character, with a max length of 100 characters.

A string with at least one non-whitespace character, with a max length of 100 characters.

A valid email address. Must not have leading or trailing spaces.

A valid phone number in E.164 format. Phone number input may be validated against valid number ranges; number strings that do not match a real-world phone numbering scheme may cause the request to fail, even in the Sandbox test environment.

Home address of a person

Hide object

The full city name.

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

The postal code of the address.

An ISO 3166-2 subdivision code.
Related terms would be "state", "province", "prefecture", "zone", "subdivision", etc.

The primary street portion of an address. A string with at least one non-whitespace alphabetical character, with a max length of 80 characters.

Extra street information, like an apartment or suite number. If provided, a string with at least one non-whitespace character, with a max length of 50 characters.

ID number of the person

Hide object

Value of the person's ID Number. Alpha-numeric, with all formatting characters stripped.

A globally unique and human readable ID type, specific to the country and document category. For more context on this field, see [Input Validation Rules](https://plaid.com/docs/identity-verification/hybrid-input-validation/#id-numbers).

Possible values: `ar_dni`, `au_drivers_license`, `au_passport`, `br_cpf`, `ca_sin`, `cl_run`, `cn_resident_card`, `co_nit`, `dk_cpr`, `eg_national_id`, `es_dni`, `es_nie`, `hk_hkid`, `in_pan`, `in_epic`, `it_cf`, `jo_civil_id`, `jp_my_number`, `ke_huduma_namba`, `kw_civil_id`, `mx_curp`, `mx_rfc`, `my_nric`, `ng_nin`, `nz_drivers_license`, `om_civil_id`, `ph_psn`, `pl_pesel`, `ro_cnp`, `sa_national_id`, `se_pin`, `sg_nric`, `tr_tc_kimlik`, `us_ssn`, `us_ssn_last_4`, `za_smart_id`

The date of birth of the person. Formatted as YYYY-MM-DD.

Format: `date`

The relationship between this person and the originator they are related to.

The percentage of ownership this person has in the onboarding business. Only applicable to beneficial owners with 25% or more ownership.

Minimum: `25`

Maximum: `100`

The title of the person at the business. Only applicable to control persons - for example, "CEO", "President", "Owner", etc.

/transfer/platform/person/create

Nodeâ¼

```
const request: TransferPlatformPersonCreateRequest = {
  originator_client_id: "6a65dh3d1h0d1027121ak184",
  name: {
    given_name: "Owen",
    family_name: "Gillespie"
  },
  email_address: "ogillespie@plaid.com",
  phone_number: "+12223334444",
  address: {
    street: "123 Main St.",
    street2: "Apt 456",
    city: "San Francisco",
    region: "CA",
    postal_code: "94580",
    country: "US"
  },
  id_number: {
    type: "us_ssn",
    value: "111223333"
  },
  date_of_birth: "2000-01-20",
  relationship_to_originator: "BENEFICIAL_OWNER",
  ownership_percentage: 50,
  title: "COO"
};

try {
  const response = await client.transferPlatformPersonCreate(request);
} catch (error) {
  // handle error
}
```

/transfer/platform/person/create

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

An ID that should be used when submitting additional requirements that are associated with this person.

Response Object

```
{
  "person_id": "4aa32e78-0cb3-4c13-b45e-7f9f2fc709d1",
  "request_id": "qpCtcJz6g3fhMdJ"
}
```

=\*=\*=\*=[#### `/transfer/platform/requirement/submit`](/docs/api/products/transfer/platform-payments/#transferplatformrequirementsubmit)

[#### Submit additional onboarding information on behalf of an originator](/docs/api/products/transfer/platform-payments/#submit-additional-onboarding-information-on-behalf-of-an-originator)

Use the [`/transfer/platform/requirement/submit`](/docs/api/products/transfer/platform-payments/#transferplatformrequirementsubmit) endpoint to submit additional onboarding information that is needed by Plaid to approve or decline the originator. See [Requirement type schema documentation](https://docs.google.com/document/d/1NEQkTD0sVK50iAQi6xHigrexDUxZ4QxXqSEfV_FFTiU/) for a list of requirement types and possible values.

/transfer/platform/requirement/submit

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The client ID of the originator

Use the `/transfer/platform/requirement/submit` endpoint to submit a list of requirement submissions that all relate to the originator. Must contain between 1 and 50 requirement submissions. See [Requirement type schema documentation](https://docs.google.com/document/d/1NEQkTD0sVK50iAQi6xHigrexDUxZ4QxXqSEfV_FFTiU/) for a list of requirements and possible values.

Max items: `50`

Min items: `1`

Hide object

The type of requirement being submitted. See [Requirement type schema documentation](https://docs.google.com/document/d/1NEQkTD0sVK50iAQi6xHigrexDUxZ4QxXqSEfV_FFTiU/) for a list of requirement types and possible values.

The value of the requirement, which can be a string or an object depending on the `requirement_type`. If it is an object, the object should be JSON marshaled into a string. See [Requirement type schema documentation](https://docs.google.com/document/d/1NEQkTD0sVK50iAQi6xHigrexDUxZ4QxXqSEfV_FFTiU/) for a list of requirement types and possible values.

The `person_id` of the person the requirement submission is related to. A `person_id` is returned by `/transfer/platform/person/create`. This field should not be included for requirements that are not related to a person.

Format: `uuid`

/transfer/platform/requirement/submit

Nodeâ¼

```
const request: TransferPlatformRequirementSubmitRequest = {
  originator_client_id: "6a65dh3d1h0d1027121ak184",
  requirement_submissions: [
    {
      requirement_type: "BUSINESS_NAME",
      value: "Owen's Widgets Inc."
    },
    {
      requirement_type: "BUSINESS_EIN",
      value: "123-45-6789"
    },
    {
      requirement_type: "BUSINESS_BANK_ACCOUNT",
      value: "{\"access_token\": \"<access token>\",\"account_id\": \"<account id>\"}"
    },
    {
      requirement_type: "BUSINESS_ORG_TYPE",
      value: "LIMITED LIABILITY COMPANY"
    },
    {
      requirement_type: "BUSINESS_INDUSTRY",
      value: "TELECOMMUNICATIONS"
    },
    {
      requirement_type: "BUSINESS_ADDRESS",
      value: "{\"city\":\"San Francisco\",\"country\":\"US\",\"postal_code\":\"94105\",\"region\":\"CA\",\"street\":\"123 Market St\",\"street2\":\"Suite 400\"}"
    },
    {
      requirement_type: "BUSINESS_WEBSITE",
      value: "https://plaid.com"
    },
    {
      requirement_type: "BUSINESS_PRODUCT_DESCRIPTION",
      value: "This is a sample description."
    },
    {
      requirement_type: "ASSOCIATED_PEOPLE",
      value: "[\"8b0e3210-767a-4882-9154-89b1e4c20493\",\"6ce1022c-d2c6-416d-a587-ed5e3f9bf941\"]"
    },
    {
      requirement_type: "PERSON_NAME",
      person_id: "6ce1022c-d2c6-416d-a587-ed5e3f9bf941",
      value: "{\"given_name\": \"Jane\",\"family_name\": \"Smith\"}"
    },
    {
      requirement_type: "PERSON_ID_NUMBER",
      person_id: "6ce1022c-d2c6-416d-a587-ed5e3f9bf941",
      value: "{\"type\": \"us_ssn\",\"value\": \"123456789\"}"
    },
    {
      requirement_type: "PERSON_ADDRESS",
      person_id: "6ce1022c-d2c6-416d-a587-ed5e3f9bf941",
      value: "{\"city\":\"San Francisco\",\"country\":\"US\",\"postal_code\":\"94105\",\"region\":\"CA\",\"street\":\"123 Market St\",\"street2\":\"Suite 100\"}"
    },
    {
      requirement_type: "PERSON_DOB",
      person_id: "6ce1022c-d2c6-416d-a587-ed5e3f9bf941",
      value: "1999-12-31"
    },
    {
      requirement_type: "PERSON_EMAIL",
      person_id: "6ce1022c-d2c6-416d-a587-ed5e3f9bf941",
      value: "sample@example.com"
    },
    {
      requirement_type: "PERSON_PHONE",
      person_id: "6ce1022c-d2c6-416d-a587-ed5e3f9bf941",
      value: "+12345678909"
    },
    {
      requirement_type: "PERSON_RELATIONSHIP",
      person_id: "6ce1022c-d2c6-416d-a587-ed5e3f9bf941",
      value: "BENEFICIAL_OWNER"
    },
    {
      requirement_type: "PERSON_PERCENT_OWNERSHIP",
      person_id: "8b0e3210-767a-4882-9154-89b1e4c20493",
      value: "50"
    },
    {
      requirement_type: "PERSON_TITLE",
      person_id: "8b0e3210-767a-4882-9154-89b1e4c20493",
      value: "COO"
    }
  ]
};

try {
  const response = await client.transferPlatformRequirementSubmit(request);
} catch (error) {
  // handle error
}
```

/transfer/platform/requirement/submit

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "saKrIBuEB9qJZno"
}
```

=\*=\*=\*=[#### `/transfer/platform/document/submit`](/docs/api/products/transfer/platform-payments/#transferplatformdocumentsubmit)[#### Upload documentation on behalf of an originator](/docs/api/products/transfer/platform-payments/#upload-documentation-on-behalf-of-an-originator)

Use the [`/transfer/platform/document/submit`](/docs/api/products/transfer/platform-payments/#transferplatformdocumentsubmit) endpoint to upload documents requested by Plaid to verify an originator's onboarding information. Unlike other endpoints, this one requires `multipart/form-data` as the content type. This endpoint is also not included in the Plaid client libraries.

/transfer/platform/document/submit

**Request fields**

The client ID of the originator

The path to the document file to upload

The type of requirement this document fulfills

The `person_id` of the person the requirement submission is related to.

A `person_id` is returned by `/transfer/platform/person/create`. This field should not be included for requirements that are not related to a person.

Format: `uuid`

/transfer/platform/document/submit

Nodeâ¼

```
import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

const form = new FormData();
form.append('originator_client_id', '6a65dh3d1h0d1027121ak184');
form.append('document_submission', fs.createReadStream('/path/to/sample/file.txt'));
form.append('requirement_type', 'BUSINESS_ADDRESS_VALIDATION');

const res = await fetch(`https://sandbox.plaid.com/transfer/platform/document/submit`, {
  method: 'POST',
  headers: {
    'Plaid-Client-ID': '<CLIENT_ID>',
    'Plaid-Secret': '<SECRET>',
    ...form.getHeaders(),
  },
  body: form,
});
const data = await res.json();
```

/transfer/platform/document/submit

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

```
{
  "request_id": "YkP5Aq2x9LkZQb7"
}
```

=\*=\*=\*=[#### `/transfer/originator/get`](/docs/api/products/transfer/platform-payments/#transferoriginatorget)

[#### Get status of an originator's onboarding](/docs/api/products/transfer/platform-payments/#get-status-of-an-originator's-onboarding)

The [`/transfer/originator/get`](/docs/api/products/transfer/platform-payments/#transferoriginatorget) endpoint gets status updates for an originator's onboarding process. This information is also available via the Transfer page on the Plaid dashboard.

/transfer/originator/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Client ID of the end customer (i.e. the originator).

/transfer/originator/get

Nodeâ¼

```
const request: TransferOriginatorGetRequest = {
  originator_client_id: '6a65dh3d1h0d1027121ak184',
};

try {
  const response = await client.transferOriginatorGet(request);
} catch (error) {
  // handle error
}
```

/transfer/originator/get

**Response fields**

Collapse all

Originator and their status.

Hide object

Originator's client ID.

Originator's diligence status.

Possible values: `not_submitted`, `submitted`, `under_review`, `approved`, `denied`, `more_information_required`

The company name of the end customer.

List of outstanding requirements that must be submitted before Plaid can approve the originator. Only populated when `transfer_diligence_status` is `more_information_required`.

Hide object

The type of requirement.

UUID of the person associated with the requirement. Only present for individual-scoped requirements.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "originator": {
    "client_id": "6a65dh3d1h0d1027121ak184",
    "transfer_diligence_status": "approved",
    "company_name": "Plaid"
  },
  "request_id": "saKrIBuEB9qJZno"
}
```

=\*=\*=\*=[#### `/transfer/originator/list`](/docs/api/products/transfer/platform-payments/#transferoriginatorlist)

[#### Get status of all originators' onboarding](/docs/api/products/transfer/platform-payments/#get-status-of-all-originators'-onboarding)

The [`/transfer/originator/list`](/docs/api/products/transfer/platform-payments/#transferoriginatorlist) endpoint gets status updates for all of your originators' onboarding. This information is also available via the Plaid dashboard.

/transfer/originator/list

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The maximum number of originators to return.

Maximum: `25`

Minimum: `1`

Default: `25`

The number of originators to skip before returning results.

Minimum: `0`

Default: `0`

/transfer/originator/list

Nodeâ¼

```
const request: TransferOriginatorListRequest = {
  count: 14,
  offset: 2,
};

try {
  const response = await client.transferOriginatorList(request);
} catch (error) {
  // handle error
}
```

/transfer/originator/list

**Response fields**

Collapse all

Hide object

Originator's client ID.

Originator's diligence status.

Possible values: `not_submitted`, `submitted`, `under_review`, `approved`, `denied`, `more_information_required`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "originators": [
    {
      "client_id": "6a65dh3d1h0d1027121ak184",
      "transfer_diligence_status": "approved"
    },
    {
      "client_id": "8g89as4d2k1d9852938ba019",
      "transfer_diligence_status": "denied"
    }
  ],
  "request_id": "4zlKapIkTm8p5KM"
}
```

=\*=\*=\*=[#### `/transfer/originator/funding_account/create`](/docs/api/products/transfer/platform-payments/#transferoriginatorfunding_accountcreate)

[#### Create a new funding account for an originator](/docs/api/products/transfer/platform-payments/#create-a-new-funding-account-for-an-originator)

Use the [`/transfer/originator/funding_account/create`](/docs/api/products/transfer/platform-payments/#transferoriginatorfunding_accountcreate) endpoint to create a new funding account for the originator.

/transfer/originator/funding\_account/create

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The Plaid client ID of the transfer originator.

The originator's funding account, linked with Plaid Link or `/transfer/migrate_account`.

Hide object

The access token associated with the Item for which data is being requested.

The Plaid `account_id` for the newly created Item.

The name for the funding account that is displayed in the Plaid dashboard.

/transfer/originator/funding\_account/create

Nodeâ¼

```
const request: TransferOriginatorFundingAccountCreateRequest = {
  originator_client_id: '6a65dh3d1h0d1027121ak184',
  funding_account: {
    access_token: 'access-sandbox-71e02f71-0960-4a27-abd2-5631e04f2175',
    account_id: '3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr',
  },
};

try {
  const response = await client.transferOriginatorFundingAccountCreate(request);
} catch (error) {
  // handle error
}
```

/transfer/originator/funding\_account/create

**Response fields**

The id of the funding account to use, available in the Plaid Dashboard. This determines which of your business checking accounts will be credited or debited.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "funding_account_id": "8945fedc-e703-463d-86b1-dc0607b55460",
  "request_id": "saKrIBuEB9qJZno"
}
```
