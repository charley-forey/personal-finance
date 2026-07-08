---
title: "Reseller Partners"
source_url: "https://plaid.com/docs/api/partner/"
section: "Partnerships"
section_id: "07-partnerships"
slug: "partner"
endpoints:
  - "/partner/customer/create"
  - "/partner/customer/get"
  - "/partner/customer/oauth_institutions/get"
  - "/partner/customer/enable"
  - "/partner/customer/remove"
  - "END_CUSTOMER_OAUTH_STATUS_UPDATED"
  - "Webhooks"
  - "webhook_type"
  - "webhook_code"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Partner endpoints and webhooks

> **Source:** [https://plaid.com/docs/api/partner/](https://plaid.com/docs/api/partner/)
> **Section:** Partnerships

## Endpoints & Webhooks on this page

- `/partner/customer/create`
- `/partner/customer/get`
- `/partner/customer/oauth_institutions/get`
- `/partner/customer/enable`
- `/partner/customer/remove`
- `END_CUSTOMER_OAUTH_STATUS_UPDATED`
- `Webhooks`
- `webhook_type`
- `webhook_code`

---

# Partner endpoints and webhooks

#### Create and manage end customers

For general, non-reference documentation, see [Reseller partners](/docs/account/resellers/).

| Endpoints |  |
| --- | --- |
| [`/partner/customer/create`](/docs/api/partner/#partnercustomercreate) | Create an end customer |
| [`/partner/customer/get`](/docs/api/partner/#partnercustomerget) | Get the status of an end customer |
| [`/partner/customer/oauth_institutions/get`](/docs/api/partner/#partnercustomeroauth_institutionsget) | Get the OAuth-institution registration status for an end customer |
| [`/partner/customer/enable`](/docs/api/partner/#partnercustomerenable) | Enable an end customer in Production |
| [`/partner/customer/remove`](/docs/api/partner/#partnercustomerremove) | Remove an end customer |

| Webhooks |  |
| --- | --- |
| [`END_CUSTOMER_OAUTH_STATUS_UPDATED`](/docs/api/partner/#end_customer_oauth_status_updated) | Customer OAuth status updated |

[### Endpoints](/docs/api/partner/#endpoints)=\*=\*=\*=[#### `/partner/customer/create`](/docs/api/partner/#partnercustomercreate)

[#### Creates a new end customer for a Plaid reseller.](/docs/api/partner/#creates-a-new-end-customer-for-a-plaid-reseller.)

The [`/partner/customer/create`](/docs/api/partner/#partnercustomercreate) endpoint is used by reseller partners to create end customers. To create end customers, it should be called in the Production environment only, even when creating Sandbox API keys. If called in the Sandbox environment, it will return a sample response, but no customer will be created and the API keys will not be valid.

/partner/customer/create

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The company name of the end customer being created. This will be used to display the end customer in the Plaid Dashboard. It will not be shown to end users.

Denotes whether or not the partner has completed attestation of diligence for the end customer to be created.

The products to be enabled for the end customer. If empty or `null`, this field will default to the products enabled for the reseller at the time this endpoint is called.

Possible values: `assets`, `auth`, `balance`, `identity`, `income_verification`, `investments`, `investments_auth`, `liabilities`, `transactions`, `employment`, `cra_base_report`, `cra_income_insights`, `cra_partner_insights`

If `true`, the end customer's default Link customization will be set to match the partner's. You can always change the end customer's Link customization in the Plaid Dashboard. See the [Link Customization docs](https://plaid.com/docs/link/customization/) for more information. If you require the ability to programmatically create end customers using multiple different Link customization profiles, contact your Plaid account manager for assistance.

Important: Data Transparency Messaging (DTM) use cases will not be copied to the end customer's Link customization unless the **Publish changes** button is clicked after the use cases are applied. Link will not work in Production unless the end customer's DTM use cases are configured. For more details, see [Data Transparency Messaging](https://plaid.com/docs/link/data-transparency-messaging-migration-guide/).

Base64-encoded representation of the end customer's logo. Must be a PNG of size 1024x1024 under 4MB. The logo will be shared with financial institutions and shown to the end user during Link flows. A logo is required if `create_link_customization` is `true`. If `create_link_customization` is `false` and the logo is omitted, the partner's logo will be used if one exists, otherwise a stock logo will be used.

The end customer's legal name. This will be shared with financial institutions as part of the OAuth registration process. It will not be shown to end users.

The end customer's website.

The name of the end customer's application. This will be shown to end users when they go through the Plaid Link flow. The application name must be unique and cannot match the name of another application already registered with Plaid.

The technical contact for the end customer. Defaults to partner's technical contact if omitted.

Hide object

The billing contact for the end customer. Defaults to partner's billing contact if omitted.

Hide object

This information is public. Users of your app will see this information when managing connections between your app and their bank accounts in Plaid Portal. Defaults to partner's customer support info if omitted. This field is mandatory for partners whose Plaid accounts were created after November 26, 2024 and will be mandatory for all partners by the 1033 compliance deadline.

Hide object

This field is mandatory for partners whose Plaid accounts were created after November 26, 2024 and will be mandatory for all partners by the 1033 compliance deadline.

The end customer's address.

Hide object

ISO-3166-1 alpha-2 country code standard.

Denotes whether the partner has forwarded the Plaid bank addendum to the end customer.

Assets under management for the given end customer. Required for end customers with monthly service commitments.

Hide object

A list of URIs indicating the destination(s) where a user can be forwarded after completing the Link flow; used to support OAuth authentication flows when launching Link in the browser or another app. URIs should not contain any query parameters. When used in Production, URIs must use https. To modify redirect URIs for an end customer after creating them, go to the end customer's [API page](https://dashboard.plaid.com/team/api) in the Dashboard.

The unique identifier assigned to a financial institution by regulatory authorities, if applicable. For banks, this is the FDIC Certificate Number. For credit unions, this is the Credit Union Charter Number.

/partner/customer/create

Nodeâ¼

```
const request: PartnerCustomerCreateRequest = {
  address: {
    city: city,
    country_code: countryCode,
    postal_code: postalCode,
    region: region,
    street: street,
  },
  application_name: applicationName,
  billing_contact: {
    email: billingEmail,
    given_name: billingGivenName,
    family_name: billingFamilyName,
  },
  customer_support_info: {
    email: supportEmail,
    phone_number: supportPhoneNumber,
    contact_url: supportContactUrl,
    link_update_url: linkUpdateUrl,
  },
  company_name: companyName,
  is_bank_addendum_completed: true,
  is_diligence_attested: true,
  legal_entity_name: legalEntityName,
  products: products,
  technical_contact: {
    email: technicalEmail,
    given_name: technicalGivenName,
    family_name: technicalFamilyName,
  },
  website: website,
};
try {
  const response = await plaidClient.partnerCustomerCreate(request);
  const endCustomer = response.data.end_customer;
} catch (error) {
  // handle error
}
```

/partner/customer/create

**Response fields**

The details for the newly created end customer, including secrets for non-Production environments.

Hide object

The `client_id` of the end customer.

The company name associated with the end customer.

The status of the given end customer.

`UNDER_REVIEW`: The end customer has been created and enabled in the Sandbox environment. The end customer must be manually reviewed by the Plaid team before it can be enabled in Production, at which point its status will automatically transition to `PENDING_ENABLEMENT` or `DENIED`.

`PENDING_ENABLEMENT`: The end customer is ready to be fully enabled in the Production environment. Call the `/partner/customer/enable` endpoint to enable the end customer in full Production.

`ACTIVE`: The end customer has been fully enabled in all environments.

`DENIED`: The end customer has been created and enabled in the Sandbox environment, but it did not pass review by the Plaid team and therefore cannot be enabled for Production access. Talk to your account manager for more information.

Possible values: `UNDER_REVIEW`, `PENDING_ENABLEMENT`, `ACTIVE`, `DENIED`

The secrets for the newly created end customer.

Hide object

The end customer's secret key for the Sandbox environment.

The end customer's secret key for the Production environment. The end customer will be provided with a limited number of credits to test in the Production environment before full enablement.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "end_customer": {
    "client_id": "7f57eb3d2a9j6480121fx361",
    "company_name": "Plaid",
    "status": "ACTIVE",
    "secrets": {
      "sandbox": "b60b5201d006ca5a7081d27c824d77",
      "production": "79g03eoofwl8240v776r2h667442119"
    }
  },
  "request_id": "4zlKapIkTm8p5KM"
}
```

=\*=\*=\*=[#### `/partner/customer/get`](/docs/api/partner/#partnercustomerget)

[#### Returns a Plaid reseller's end customer.](/docs/api/partner/#returns-a-plaid-reseller's-end-customer.)

The [`/partner/customer/get`](/docs/api/partner/#partnercustomerget) endpoint is used by reseller partners to retrieve data about a single end customer.

/partner/customer/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

/partner/customer/get

Nodeâ¼

```
const request: PartnerCustomerGetRequest = {
  end_customer_client_id: clientId,
};
try {
  const response = await plaidClient.partnerCustomerGet(request);
  const endCustomer = response.data.end_customer;
} catch (error) {
  // handle error
}
```

/partner/customer/get

**Response fields**

Collapse all

The details for an end customer.

Hide object

The `client_id` of the end customer.

The company name associated with the end customer.

The status of the given end customer.

`UNDER_REVIEW`: The end customer has been created and enabled in the Sandbox environment. The end customer must be manually reviewed by the Plaid team before it can be enabled in Production, at which point its status will automatically transition to `PENDING_ENABLEMENT` or `DENIED`.

`PENDING_ENABLEMENT`: The end customer is ready to be fully enabled in the Production environment. Call the `/partner/customer/enable` endpoint to enable the end customer in full Production.

`ACTIVE`: The end customer has been fully enabled in all environments.

`DENIED`: The end customer has been created and enabled in the Sandbox environment, but it did not pass review by the Plaid team and therefore cannot be enabled for Production access. Talk to your account manager for more information.

Possible values: `UNDER_REVIEW`, `PENDING_ENABLEMENT`, `ACTIVE`, `DENIED`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "end_customer": {
    "client_id": "7f57eb3d2a9j6480121fx361",
    "company_name": "Plaid",
    "status": "ACTIVE"
  },
  "request_id": "4zlKapIkTm8p5KM"
}
```

=\*=\*=\*=[#### `/partner/customer/oauth_institutions/get`](/docs/api/partner/#partnercustomeroauth_institutionsget)

[#### Returns OAuth-institution registration information for a given end customer.](/docs/api/partner/#returns-oauth-institution-registration-information-for-a-given-end-customer.)

The [`/partner/customer/oauth_institutions/get`](/docs/api/partner/#partnercustomeroauth_institutionsget) endpoint is used by reseller partners to retrieve OAuth-institution registration information about a single end customer. To learn how to set up a webhook to listen to status update events, visit the [reseller documentation](https://plaid.com/docs/account/resellers/#enabling-end-customers).

/partner/customer/oauth\_institutions/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

/partner/customer/oauth\_institutions/get

Nodeâ¼

```
const request: PartnerCustomerOAuthInstitutionsGetRequest = {
  end_customer_client_id: clientId,
};
try {
  const response = await plaidClient.partnerCustomerOauthInstitutionsGet(
    request,
  );
} catch (error) {
  // handle error
}
```

/partner/customer/oauth\_institutions/get

**Response fields**

Collapse all

The status of the addendum to the Plaid MSA ("flowdown") for the end customer.

Possible values: `NOT_STARTED`, `IN_REVIEW`, `NEGOTIATION`, `COMPLETE`

The status of the end customer's security questionnaire.

Possible values: `NOT_STARTED`, `RECEIVED`, `COMPLETE`

The OAuth institutions with which the end customer's application is being registered.

Hide object

Registration statuses by environment.

Hide object

The registration status for the end customer's application.

Possible values: `NOT_STARTED`, `PROCESSING`, `APPROVED`, `ENABLED`, `ATTENTION_REQUIRED`

The registration status for the end customer's application.

Possible values: `NOT_STARTED`, `PROCESSING`, `APPROVED`, `ENABLED`, `ATTENTION_REQUIRED`

The date on which the end customer's application was approved by the institution, or an empty string if their application has not yet been approved.

The date on which non-OAuth Item adds will no longer be supported for this institution, or an empty string if no such date has been set by the institution.

The errors encountered while registering the end customer's application with the institutions.

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
  "flowdown_status": "COMPLETE",
  "questionnaire_status": "COMPLETE",
  "institutions": [
    {
      "name": "Chase",
      "institution_id": "ins_56",
      "environments": {
        "production": "PROCESSING"
      },
      "production_enablement_date": null,
      "classic_disablement_date": "2022-06-30"
    },
    {
      "name": "Capital One",
      "institution_id": "ins_128026",
      "environments": {
        "production": "ENABLED"
      },
      "production_enablement_date": "2022-12-19",
      "classic_disablement_date": null
    },
    {
      "name": "Bank of America",
      "institution_id": "ins_1",
      "environments": {
        "production": "ATTENTION_REQUIRED"
      },
      "production_enablement_date": null,
      "classic_disablement_date": null,
      "errors": [
        {
          "error_type": "PARTNER_ERROR",
          "error_code": "OAUTH_REGISTRATION_ERROR",
          "error_message": "Application logo is required",
          "display_message": null,
          "request_id": "4zlKapIkTm8p5KM"
        }
      ]
    }
  ],
  "request_id": "4zlKapIkTm8p5KM"
}
```

=\*=\*=\*=[#### `/partner/customer/enable`](/docs/api/partner/#partnercustomerenable)

[#### Enables a Plaid reseller's end customer in the Production environment.](/docs/api/partner/#enables-a-plaid-reseller's-end-customer-in-the-production-environment.)

The [`/partner/customer/enable`](/docs/api/partner/#partnercustomerenable) endpoint is used by reseller partners to enable an end customer in the full Production environment.

/partner/customer/enable

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

/partner/customer/enable

Nodeâ¼

```
const request: PartnerCustomerEnableRequest = {
  end_customer_client_id: clientId,
};
try {
  const response = await plaidClient.partnerCustomerEnable(request);
  const productionSecret = response.data.production_secret;
} catch (error) {
  // handle error
}
```

/partner/customer/enable

**Response fields**

The end customer's secret key for the Production environment.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "production_secret": "79g03eoofwl8240v776r2h667442119",
  "request_id": "4zlKapIkTm8p5KM"
}
```

=\*=\*=\*=[#### `/partner/customer/remove`](/docs/api/partner/#partnercustomerremove)

[#### Removes a Plaid reseller's end customer.](/docs/api/partner/#removes-a-plaid-reseller's-end-customer.)

The [`/partner/customer/remove`](/docs/api/partner/#partnercustomerremove) endpoint is used by reseller partners to remove an end customer. Removing an end customer will remove it from view in the Plaid Dashboard and deactivate its API keys. This endpoint can only be used to remove an end customer that has not yet been enabled in full Production.

/partner/customer/remove

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The `client_id` of the end customer to be removed.

/partner/customer/remove

Nodeâ¼

```
const request: PartnerCustomerRemoveRequest = {
  end_customer_client_id: clientId,
};
try {
  const response = await plaidClient.partnerCustomerRemove(request);
} catch (error) {
  // handle error
}
```

/partner/customer/remove

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "4zlKapIkTm8p5KM"
}
```

[### Webhooks](/docs/api/partner/#webhooks)=\*=\*=\*=[#### `END_CUSTOMER_OAUTH_STATUS_UPDATED`](/docs/api/partner/#end_customer_oauth_status_updated)

The webhook of type `PARTNER` and code `END_CUSTOMER_OAUTH_STATUS_UPDATED` will be fired when a partner's end customer has an update on their OAuth registration status with an institution.

**Properties**

`PARTNER`

`END_CUSTOMER_OAUTH_STATUS_UPDATED`

The client ID of the end customer

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

The institution ID

The institution name

The OAuth status of the update

Possible values: `not-started`, `processing`, `approved`, `enabled`, `attention-required`

API Object

```
{
  "webhook_type": "PARTNER",
  "webhook_code": "END_CUSTOMER_OAUTH_STATUS_UPDATED",
  "end_customer_client_id": "634758733ebb4f00134b85ea",
  "environment": "production",
  "institution_id": "ins_127989",
  "institution_name": "Bank of America",
  "status": "attention-required"
}
```
