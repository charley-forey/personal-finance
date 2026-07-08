---
title: "Identity Verification"
source_url: "https://plaid.com/docs/api/products/identity-verification/"
section: "KYC/AML and Anti-Fraud"
section_id: "03-kyc-aml-anti-fraud"
slug: "identity-verification"
endpoints:
  - "/identity_verification/create"
  - "/identity_verification/get"
  - "/identity_verification/list"
  - "/identity_verification/retry"
  - "/dashboard_user/get"
  - "/dashboard_user/list"
  - "STATUS_UPDATED"
  - "STEP_UPDATED"
  - "RETRIED"
  - "/user/update"
  - "Webhooks"
  - "webhook_type"
  - "webhook_code"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Identity Verification

> **Source:** [https://plaid.com/docs/api/products/identity-verification/](https://plaid.com/docs/api/products/identity-verification/)
> **Section:** KYC/AML and Anti-Fraud

## Endpoints & Webhooks on this page

- `/identity_verification/create`
- `/identity_verification/get`
- `/identity_verification/list`
- `/identity_verification/retry`
- `/dashboard_user/get`
- `/dashboard_user/list`
- `STATUS_UPDATED`
- `STEP_UPDATED`
- `RETRIED`
- `/user/update`
- `Webhooks`
- `webhook_type`
- `webhook_code`

---

# Identity Verification

#### API reference for Identity Verification endpoints and webhooks

For how-to guidance, see the [Identity Verification documentation](/docs/identity-verification/).

| Endpoints |  |
| --- | --- |
| [`/identity_verification/create`](/docs/api/products/identity-verification/#identity_verificationcreate) | Create a new identity verification |
| [`/identity_verification/get`](/docs/api/products/identity-verification/#identity_verificationget) | Retrieve a previously created identity verification |
| [`/identity_verification/list`](/docs/api/products/identity-verification/#identity_verificationlist) | Filter and list identity verifications |
| [`/identity_verification/retry`](/docs/api/products/identity-verification/#identity_verificationretry) | Allow a user to retry an identity verification |

| See also |  |
| --- | --- |
| [`/dashboard_user/get`](/docs/api/kyc-aml-users/#dashboard_userget) | Retrieve information about a dashboard user |
| [`/dashboard_user/list`](/docs/api/kyc-aml-users/#dashboard_userlist) | List dashboard users |

| Webhooks |  |
| --- | --- |
| [`STATUS_UPDATED`](/docs/api/products/identity-verification/#status_updated) | The status of an identity verification has been updated |
| [`STEP_UPDATED`](/docs/api/products/identity-verification/#step_updated) | A step in the identity verification process has been completed |
| [`RETRIED`](/docs/api/products/identity-verification/#retried) | An identity verification has been retried |

[### Endpoints](/docs/api/products/identity-verification/#endpoints)=\*=\*=\*=[#### `/identity_verification/create`](/docs/api/products/identity-verification/#identity_verificationcreate)

[#### Create a new Identity Verification](/docs/api/products/identity-verification/#create-a-new-identity-verification)

Create a new Identity Verification for the user specified by the `client_user_id` and/or `user_id` field. At least one of these two fields must be provided. The requirements and behavior of the verification are determined by the `template_id` provided. If `user_id` is provided, there must be an associated user; otherwise, an error will be returned.

If you don't know whether an active Identity Verification exists for a given `client_user_id` and/or `user_id`, you can specify `"is_idempotent": true` in the request body. With idempotency enabled, a new Identity Verification will only be created if one does not already exist for the associated `client_user_id` and/or `user_id`, and `template_id`. If an Identity Verification is found, it will be returned unmodified with a `200 OK` HTTP status code.

If `user_id` is not provided, you can also use this endpoint to supply information you already have collected about the user; if any of these fields are specified, the screens prompting the user to enter them will be skipped during the Link flow. If `user_id` is provided, user information can not be included in the request body. Please use the [`/user/update`](/docs/api/users/#userupdate) endpoint to update user data instead.

/identity\_verification/create

**Request fields**

Collapse all

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

Unique user identifier, created by calling `/user/create`. Either a `user_id` or the `client_user_id` must be provided. The `user_id` may only be used instead of the `client_user_id` if you were not a pre-existing user of `/user/create` as of December 10, 2025, or if you have since [migrated to the new User APIs](https://plaid.com/docs/api/users/migrate-to-new-user-apis); for more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis). If both this field and a `client_user_id` are present in a request, the `user_id` must have been created from the provided `client_user_id`.

A flag specifying whether you would like Plaid to expose a shareable URL for the verification being created.

ID of the associated Identity Verification template. Like all Plaid identifiers, this is case-sensitive.

A flag specifying whether the end user has already agreed to a privacy policy specifying that their data will be shared with Plaid for verification purposes.

If `gave_consent` is set to `true`, the `accept_tos` step will be marked as `skipped` and the end user's session will start at the next step requirement.

Default: `false`

User information collected outside of Link, most likely via your own onboarding process.

Each of the following identity fields are optional:

`email_address`

`phone_number`

`date_of_birth`

`name`

`address`

`id_number`

Specifically, these fields are optional in that they can either be fully provided (satisfying every required field in their subschema) or omitted from the request entirely by not providing the key or value.
Providing these fields via the API will result in Link skipping the data collection process for the associated user. All verification steps enabled in the associated Identity Verification Template will still be run. Verification steps will either be run immediately, or once the user completes the `accept_tos` step, depending on the value provided to the `gave_consent` field.
If you are not using the shareable URL feature, you can optionally provide these fields via `/link/token/create` instead; both `/identity_verification/create` and `/link/token/create` are valid ways to provide this information. Note that if you provide a non-`null` user data object via `/identity_verification/create`, any user data fields entered via `/link/token/create` for the same `client_user_id` will be ignored when prefilling Link.

Hide object

A valid email address. Must not have leading or trailing spaces and address must be RFC compliant. For more information, see [RFC 3696](https://datatracker.ietf.org/doc/html/rfc3696).

Format: `email`

A valid phone number in E.164 format.

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

You can use this field to pre-populate the user's legal name; if it is provided here, they will not be prompted to enter their name in the identity verification attempt.

Hide object

A string with at least one non-whitespace character, with a max length of 100 characters.

A string with at least one non-whitespace character, with a max length of 100 characters.

Home address for the user. Supported values are: not provided, address with only country code or full address.

For more context on this field, see [Input Validation by Country](https://plaid.com/docs/identity-verification/hybrid-input-validation/#input-validation-by-country).

Hide object

The primary street portion of an address. If an address is provided, this field will always be filled. A string with at least one non-whitespace alphabetical character, with a max length of 80 characters.

Extra street information, like an apartment or suite number. If provided, a string with at least one non-whitespace character, with a max length of 50 characters.

City from the address. A string with at least one non-whitespace alphabetical character, with a max length of 100 characters.

A subdivision code. "Subdivision" is a generic term for "state", "province", "prefecture", "zone", etc. For the list of valid codes, see [country subdivision codes](https://plaid.com/documents/country_subdivision_codes.json). Country prefixes are omitted, since they are inferred from the `country` field.

The postal code for the associated address. Between 2 and 10 alphanumeric characters. For US-based addresses this must be 5 numeric digits.

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

ID number submitted by the user, currently used only for the Identity Verification product. If the user has not submitted this data yet, this field will be `null`. Otherwise, both fields are guaranteed to be filled.

Hide object

Value of the identity document typed in by the user. Alpha-numeric, with all formatting characters stripped. For specific format requirements by ID type, see [Input Validation Rules](https://plaid.com/docs/identity-verification/hybrid-input-validation/#id-numbers).

A globally unique and human readable ID type, specific to the country and document category. For more context on this field, see [Input Validation Rules](https://plaid.com/docs/identity-verification/hybrid-input-validation/#id-numbers).

Possible values: `ar_dni`, `au_drivers_license`, `au_passport`, `br_cpf`, `ca_sin`, `cl_run`, `cn_resident_card`, `co_nit`, `dk_cpr`, `eg_national_id`, `es_dni`, `es_nie`, `hk_hkid`, `in_pan`, `in_epic`, `it_cf`, `jo_civil_id`, `jp_my_number`, `ke_huduma_namba`, `kw_civil_id`, `mx_curp`, `mx_rfc`, `my_nric`, `ng_nin`, `nz_drivers_license`, `om_civil_id`, `ph_psn`, `pl_pesel`, `ro_cnp`, `sa_national_id`, `se_pin`, `sg_nric`, `tr_tc_kimlik`, `us_ssn`, `us_ssn_last_4`, `za_smart_id`

Specifying `user.client_user_id` is deprecated. Please provide `client_user_id` at the root level instead.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

An optional flag specifying how you would like Plaid to handle attempts to create an Identity Verification when an Identity Verification already exists for the provided `client_user_id` and `template_id`.
If idempotency is enabled, Plaid will return the existing Identity Verification. If idempotency is disabled, Plaid will reject the request with a `400 Bad Request` status code if an Identity Verification already exists for the supplied `client_user_id` and `template_id`.

/identity\_verification/create

Nodeâ¼

```
const request: IdentityVerificationCreateRequest = {
  client_user_id: 'user-sandbox-b0e2c4ee-a763-4df5-bfe9-46a46bce993d',
  is_shareable: true,
  template_id: 'idvtmp_52xR9LKo77r1Np',
  gave_consent: true,
  user: {
    email_address: 'acharleston@email.com',
    phone_number: '+12345678909',
    date_of_birth: '1975-01-18',
    name: {
      given_name: 'Anna',
      family_name: 'Charleston',
    },
    address: {
      street: '100 Market Street',
      street2: 'Apt 1A',
      city: 'San Francisco',
      region: 'CA',
      postal_code: '94103',
      country: 'US',
    },
    id_number: {
      value: '123456789',
      type: 'us_ssn',
    },
  },
};
try {
  const response = await client.identityVerificationCreate(request);
} catch (error) {
  // handle error
}
```

/identity\_verification/create

**Response fields**

Collapse all

ID of the associated Identity Verification attempt.

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

An ISO8601 formatted timestamp.

Format: `date-time`

An ISO8601 formatted timestamp.

Format: `date-time`

The ID for the Identity Verification preceding this session. This field will only be filled if the current Identity Verification is a retry of a previous attempt.

A shareable URL that can be sent directly to the user to complete verification

The resource ID and version number of the template configuring the behavior of a given Identity Verification.

Hide object

ID of the associated Identity Verification template. Like all Plaid identifiers, this is case-sensitive.

Version of the associated Identity Verification template.

The identity data that was either collected from the user or provided via API in order to perform an Identity Verification.

Hide object

A valid phone number in E.164 format.

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

An IPv4 or IPv6 address.

A valid email address. Must not have leading or trailing spaces and address must be RFC compliant. For more information, see [RFC 3696](https://datatracker.ietf.org/doc/html/rfc3696).

Format: `email`

The full name provided by the user. If the user has not submitted their name, this field will be null. Otherwise, both fields are guaranteed to be filled.

Hide object

A string with at least one non-whitespace character, with a max length of 100 characters.

A string with at least one non-whitespace character, with a max length of 100 characters.

Even if an address has been collected, some fields may be null depending on the region's addressing system. For example:

Addresses from the United Kingdom will not include a region

Addresses from Hong Kong will not include postal code

Hide object

The primary street portion of an address. If an address is provided, this field will always be filled. A string with at least one non-whitespace alphabetical character, with a max length of 80 characters.

Extra street information, like an apartment or suite number. If provided, a string with at least one non-whitespace character, with a max length of 50 characters.

City from the address. A string with at least one non-whitespace alphabetical character, with a max length of 100 characters.

A subdivision code. "Subdivision" is a generic term for "state", "province", "prefecture", "zone", etc. For the list of valid codes, see [country subdivision codes](https://plaid.com/documents/country_subdivision_codes.json). Country prefixes are omitted, since they are inferred from the `country` field.

The postal code for the associated address. Between 2 and 10 alphanumeric characters. For US-based addresses this must be 5 numeric digits.

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

ID number submitted by the user, currently used only for the Identity Verification product. If the user has not submitted this data yet, this field will be `null`. Otherwise, both fields are guaranteed to be filled.

Hide object

Value of the identity document typed in by the user. Alpha-numeric, with all formatting characters stripped. For specific format requirements by ID type, see [Input Validation Rules](https://plaid.com/docs/identity-verification/hybrid-input-validation/#id-numbers).

A globally unique and human readable ID type, specific to the country and document category. For more context on this field, see [Input Validation Rules](https://plaid.com/docs/identity-verification/hybrid-input-validation/#id-numbers).

Possible values: `ar_dni`, `au_drivers_license`, `au_passport`, `br_cpf`, `ca_sin`, `cl_run`, `cn_resident_card`, `co_nit`, `dk_cpr`, `eg_national_id`, `es_dni`, `es_nie`, `hk_hkid`, `in_pan`, `in_epic`, `it_cf`, `jo_civil_id`, `jp_my_number`, `ke_huduma_namba`, `kw_civil_id`, `mx_curp`, `mx_rfc`, `my_nric`, `ng_nin`, `nz_drivers_license`, `om_civil_id`, `ph_psn`, `pl_pesel`, `ro_cnp`, `sa_national_id`, `se_pin`, `sg_nric`, `tr_tc_kimlik`, `us_ssn`, `us_ssn_last_4`, `za_smart_id`

The status of this Identity Verification attempt.

`active` - The Identity Verification attempt is incomplete. The user may have completed part of the session, but has neither failed nor passed.

`success` - The Identity Verification attempt has completed, passing all steps defined to the associated Identity Verification template.

`failed` - The user failed one or more steps in the session and was told to contact support.

`expired` - The Identity Verification attempt was active for a long period of time without being completed and was automatically marked as expired. Note that sessions currently do not expire. Automatic expiration is expected to be enabled in the future.

`canceled` - The Identity Verification attempt was canceled, either via the dashboard by a user, or via API. The user may have completed part of the session, but has neither failed nor passed.

`pending_review` - The Identity Verification attempt template was configured to perform a screening that had one or more hits needing review.

Possible values: `active`, `success`, `failed`, `expired`, `canceled`, `pending_review`

Each step will be one of the following values:

`active` - This step is the user's current step. They are either in the process of completing this step, or they recently closed their Identity Verification attempt while in the middle of this step. Only one step will be marked as `active` at any given point.

`success` - The Identity Verification attempt has completed this step.

`failed` - The user failed this step. This can either cause the user to fail the session as a whole, or cause them to fall back to another step depending on how the Identity Verification template is configured. A failed step does not imply a failed session.

`waiting_for_prerequisite` - The user needs to complete another step first, before they progress to this step. This step may never run, depending on if the user fails an earlier step or if the step is only run as a fallback.

`not_applicable` - This step will not be run for this session.

`skipped` - The retry instructions that created this Identity Verification attempt specified that this step should be skipped.

`expired` - This step had not yet been completed when the Identity Verification attempt as a whole expired.

`canceled` - The Identity Verification attempt was canceled before the user completed this step.

`pending_review` - The Identity Verification attempt template was configured to perform a screening that had one or more hits needing review.

`manually_approved` - The step was manually overridden to pass by a team member in the dashboard.

`manually_rejected` - The step was manually overridden to fail by a team member in the dashboard.

Hide object

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

Data, images, analysis, and results from the `documentary_verification` step. This field will be `null` unless `steps.documentary_verification` has reached a terminal state of either `success` or `failed`.

Hide object

The outcome status for the associated Identity Verification attempt's `documentary_verification` step. This field will always have the same value as `steps.documentary_verification`.

An array of documents submitted to the `documentary_verification` step. Each entry represents one user submission, where each submission will contain both a front and back image, or just a front image, depending on the document type.

Note: Plaid will automatically let a user submit a new set of document images up to three times if we detect that a previous attempt might have failed due to user error. For example, if the first set of document images are blurry or obscured by glare, the user will be asked to capture their documents again, resulting in at least two separate entries within `documents`. If the overall `documentary_verification` is `failed`, the user has exhausted their retry attempts.

Hide object

An outcome status for this specific document submission. Distinct from the overall `documentary_verification.status` that summarizes the verification outcome from one or more documents.

Possible values: `success`, `failed`, `manually_approved`

The `attempt` field begins with 1 and increments with each subsequent document upload.

URLs for downloading original and cropped images for this document submission. The URLs are designed to only allow downloading, not hot linking, so the URL will only serve the document image for 60 seconds before expiring. The expiration time is 60 seconds after the `GET` request for the associated Identity Verification attempt. A new expiring URL is generated with each request, so you can always rerequest the Identity Verification attempt if one of your URLs expires.

Hide object

Temporary URL that expires after 60 seconds for downloading the uncropped original image of the front of the document.

Temporary URL that expires after 60 seconds for downloading the original image of the back of the document. Might be null if the back of the document was not collected.

Temporary URL that expires after 60 seconds for downloading a cropped image containing just the front of the document.

Temporary URL that expires after 60 seconds for downloading a cropped image containing just the back of the document. Might be null if the back of the document was not collected.

Temporary URL that expires after 60 seconds for downloading a crop of just the user's face from the document image. Might be null if the document does not contain a face photo.

Data extracted from a user-submitted document.

Hide object

Alpha-numeric ID number extracted via OCR from the user's document image.

The type of identity document detected in the images provided. Will always be one of the following values:

`drivers_license` - A driver's license issued by the associated country, establishing identity without any guarantee as to citizenship, and granting driving privileges

`id_card` - A general national identification card, distinct from driver's licenses as it only establishes identity

`passport` - A travel passport issued by the associated country for one of its citizens

`residence_permit_card` - An identity document issued by the associated country permitting a foreign citizen to *temporarily* reside there

`resident_card` - An identity document issued by the associated country permitting a foreign citizen to *permanently* reside there

`visa` - An identity document issued by the associated country permitting a foreign citizen entry for a short duration and for a specific purpose, typically no longer than 6 months

Note: This value may be different from the ID type that the user selects within Link. For example, if they select "Driver's License" but then submit a picture of a passport, this field will say `passport`

Possible values: `drivers_license`, `id_card`, `passport`, `residence_permit_card`, `resident_card`, `visa`

The expiration date of the document in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

The issue date of the document in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

A subdivision code. "Subdivision" is a generic term for "state", "province", "prefecture", "zone", etc. For the list of valid codes, see [country subdivision codes](https://plaid.com/documents/country_subdivision_codes.json). Country prefixes are omitted, since they are inferred from the `country` field.

A date extracted from the document in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

The address extracted from the document. The address must at least contain the following fields to be a valid address: `street`, `city`, `country`. If any are missing or unable to be extracted, the address will be null.

`region`, and `postal_code` may be null based on the addressing system. For example:

Addresses from the United Kingdom will not include a region

Addresses from Hong Kong will not include postal code

Note: Optical Character Recognition (OCR) technology may sometimes extract incorrect data from a document.

Hide object

The full street address extracted from the document.

City extracted from the document.

A subdivision code extracted from the document. Related terms would be "state", "province", "prefecture", "zone", "subdivision", etc. For a full list of valid codes, see [country subdivision codes](https://plaid.com/documents/country_subdivision_codes.json). Country prefixes are omitted, since they can be inferred from the `country` field.

The postal code extracted from the document. Between 2 and 10 alphanumeric characters. For US-based addresses this must be 5 numeric digits.

Valid, capitalized, two-letter ISO code representing the country extracted from the document. Must be in ISO 3166-1 alpha-2 form.

The individual's name extracted from the document.

Hide object

A string with at least one non-whitespace character, with a max length of 100 characters.

A string with at least one non-whitespace character, with a max length of 100 characters.

High level descriptions of how the associated document was processed. If a document fails verification, the details in the `analysis` object should help clarify why the document was rejected.

Hide object

High level summary of whether the document in the provided image matches the formatting rules and security checks for the associated jurisdiction.

For example, most identity documents have formatting rules like the following:

The image of the person's face must have a certain contrast in order to highlight skin tone

The subject in the document's image must remove eye glasses and pose in a certain way

The informational fields (name, date of birth, ID number, etc.) must be colored and aligned according to specific rules

Security features like watermarks and background patterns must be present

So a `match` status for this field indicates that the document in the provided image seems to conform to the various formatting and security rules associated with the detected document.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

A high level description of the quality of the image the user submitted.

For example, an image that is blurry, distorted by glare from a nearby light source, or improperly framed might be marked as low or medium quality. Poor quality images are more likely to fail OCR and/or template conformity checks.

Note: By default, Plaid will let a user recapture document images twice before failing the entire session if we attribute the failure to low image quality.

Possible values: `high`, `medium`, `low`

Analysis of the data extracted from the submitted document.

Hide object

A match summary describing the cross comparison between the subject's name, extracted from the document image, and the name they separately provided to the identity verification attempt.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

A match summary describing the cross comparison between the subject's date of birth, extracted from the document image, and the date of birth they separately provided to the identity verification attempt.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

A description of whether the associated document was expired when the verification was performed.

Note: In the case where an expiration date is not present on the document or failed to be extracted, this value will be `no_data`.

Possible values: `not_expired`, `expired`, `no_data`

A binary match indicator specifying whether the country that issued the provided document matches the country that the user separately provided to Plaid.

Note: You can configure whether a `no_match` on `issuing_country` fails the `documentary_verification` by editing your Plaid Template.

Possible values: `match`, `no_match`

Details about the fraud analysis performed on the document.

Hide object

Whether the submitted document type is supported for fraud analysis.

`success` - The document type is supported.

`failed` - The document type is not supported.

Possible values: `success`, `failed`

The outcome of the portrait presence check.

`success` - A portrait was detected.

`failed` - No portrait was detected.

Possible values: `success`, `failed`

The outcome of the portrait details check including photo embedding and face landmark checks.

`success` - The portrait passed all validity checks.

`failed` - The portrait did not pass one or more validity checks.

Possible values: `success`, `failed`

The outcome of the image composition check.

`success` - The image is a valid physical document capture.

`failed` - The image appears to be a photograph of a screen or a digital forgery.

Possible values: `success`, `failed`

The outcome of the integrity check for document security elements.

`success` - Data is consistent across all checked security elements.

`failed` - Inconsistencies were detected across one or more security elements.

Possible values: `success`, `failed`

The outcome of the document detail check for correct styling and layout.

`success` - The document passed all authenticity checks.

`failed` - The document did not pass one or more authenticity checks.

Possible values: `success`, `failed`

The outcome of the issue date validity check.

`success` - The issue date is valid.

`failed` - The issue date is invalid or could not be verified.

`no_data` - The check could not be performed due to insufficient data.

Possible values: `success`, `failed`, `no_data`

Details about the image quality of the document.

Hide object

The outcome of the glare check.

`success` - The image is free of glare.

`failed` - The image contains glare that may obscure document details.

Possible values: `success`, `failed`

The outcome of the dimensions check.

`success` - The image meets the minimum size and resolution requirements.

`failed` - The image does not meet the minimum size or resolution requirements.

Possible values: `success`, `failed`

The outcome of the blur check.

`success` - The image is sufficiently sharp.

`failed` - The image is too blurry for analysis.

Possible values: `success`, `failed`

Analyzed AAMVA data for the associated hit.

Note: This field is only available for U.S. driver's licenses issued by participating states.

Hide object

The overall outcome of checking the associated hit against the issuing state database.

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the associated hit against state databases.

`match` - The field is an exact match with the state database.

`partial_match` - The field is a partial match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the associated hit against state databases.

`match` - The field is an exact match with the state database.

`partial_match` - The field is a partial match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the associated hit against state databases.

`match` - The field is an exact match with the state database.

`partial_match` - The field is a partial match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

The outcome of checking the associated hit against state databases.

`match` - The field is an exact match with the state database.

`partial_match` - The field is a partial match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

The outcome of checking the associated hit against state databases.

`match` - The field is an exact match with the state database.

`partial_match` - The field is a partial match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

An ISO8601 formatted timestamp.

Format: `date-time`

Additional information for the `selfie_check` step. This field will be `null` unless `steps.selfie_check` has reached a terminal state of either `success` or `failed`.

Hide object

The outcome status for the associated Identity Verification attempt's `selfie_check` step. This field will always have the same value as `steps.selfie_check`.

Possible values: `success`, `failed`

An array of selfies submitted to the `selfie_check` step. Each entry represents one user submission.

Hide object

An outcome status for this specific selfie. Distinct from the overall `selfie_check.status` that summarizes the verification outcome from one or more selfies.

Possible values: `success`, `failed`

The `attempt` field begins with 1 and increments with each subsequent selfie upload.

The image or video capture of a selfie. Only one of `image_url` or `video_url` will be populated per selfie. In the vast majority of sessions Plaid records a short video of the user, so `video_url` is populated and `image_url` is `null`. `image_url` is only populated in the rare passive-liveness fallback case, where the user's device could not complete the standard video liveness capture (for example, a camera or streaming error) and submitted a single still image instead.

Hide object

Temporary URL for downloading a still-image selfie capture. This field is only populated when the session fell back to passive (image-based) liveness. For the majority of selfie checks this field is `null` and `video_url` is populated instead.

Temporary URL for downloading a video selfie capture. This is the standard selfie capture for Identity Verification. Plaid records a short video of the user during the Selfie Check liveness step, so this field is populated for the vast majority of selfie checks.

High level descriptions of how the associated selfie was processed. If a selfie fails verification, the details in the `analysis` object should help clarify why the selfie was rejected.

Hide object

Information about the comparison between the selfie and the document (if documentary verification also ran).

Possible values: `match`, `no_match`, `no_input`

Assessment of whether the selfie capture is of a real human being, as opposed to a picture of a human on a screen, a picture of a paper cut out, someone wearing a mask, or a deepfake.

Possible values: `success`, `failed`

Age-estimation results from the selfie capture. This field is `null` when an age range could not be estimated from the selfie capture.

Hide object

An enum indicating whether the reported age aligns with the estimated selfie capture age range.

`match` indicates that the reported age falls within the estimated selfie capture age range.

`warning` indicates that the reported age falls outside the estimated selfie capture age range, but is close enough that the result should be reviewed.

`no_match` indicates that the reported age falls far outside the estimated selfie capture age range.

`no_data` indicates that there was not enough data available at age-estimation time to compare the reported age against the estimated selfie capture age range.

Possible values: `match`, `warning`, `no_match`, `no_data`

The user's age at the time of the selfie capture, calculated from the date of birth submitted during Identity Verification. If multiple date of birth sources are available, the date of birth submitted in the flow session takes priority over the document date of birth. This field is `null` when the date of birth is unavailable.

Lower bound of the estimated age range from the selfie capture.

Upper bound of the estimated age range from the selfie capture.

Additional information for the `kyc_check` (Data Source Verification) step. This field will be `null` unless `steps.kyc_check` has reached a terminal state of either `success` or `failed`.

Hide object

The outcome status for the associated Identity Verification attempt's `kyc_check` step. This field will always have the same value as `steps.kyc_check`.

Result summary object specifying how the `address` field matched.

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Field describing whether the associated address is a post office box. Will be `yes` when a P.O. box is detected, `no` when Plaid confirmed the address is not a P.O. box, and `no_data` when Plaid was not able to determine if the address is a P.O. box.

Possible values: `yes`, `no`, `no_data`

Field describing whether the associated address is being used for commercial or residential purposes.

Note: This value will be `no_data` when Plaid does not have sufficient data to determine the address's use.

Possible values: `residential`, `commercial`, `no_data`

Result summary object specifying how the `name` field matched.

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Result summary object specifying how the `date_of_birth` field matched.

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Result summary object specifying how the `id_number` field matched.

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Result summary object specifying how the `phone` field matched.

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Additional information for the `risk_check` step.

Hide object

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

Result summary object specifying values for `behavior` attributes of risk check, when available.

Hide object

Field describing the overall user interaction signals of a behavior risk check. This value represents how familiar the user is with the personal data they provide, based on a number of signals that are collected during their session.

`genuine` indicates the user has high familiarity with the data they are providing, and that fraud is unlikely.

`neutral` indicates some signals are present in between `risky` and `genuine`, but there are not enough clear signals to determine an outcome.

`risky` indicates the user has low familiarity with the data they are providing, and that fraud is likely.

`no_data` indicates there is not sufficient information to give an accurate signal.

Possible values: `genuine`, `neutral`, `risky`, `no_data`

Field describing the outcome of a fraud ring behavior risk check.

`yes` indicates that fraud ring activity was detected.

`no` indicates that fraud ring activity was not detected.

`no_data` indicates there was not enough information available to give an accurate signal.

Possible values: `yes`, `no`, `no_data`

Field describing the outcome of a bot detection behavior risk check.

`yes` indicates that automated activity was detected.

`no` indicates that automated activity was not detected.

`no_data` indicates there was not enough information available to give an accurate signal.

Possible values: `yes`, `no`, `no_data`

Result summary object specifying values for `email` attributes of risk check.

Hide object

SMTP-MX check to confirm the email address exists if known.

Possible values: `yes`, `no`, `no_data`

Count of all known breaches of this email address if known.

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

Indicates whether the email address domain is a free provider such as Gmail or Hotmail if known.

Possible values: `yes`, `no`, `no_data`

Indicates whether the email address domain is custom if known, i.e. a company domain and not free or disposable.

Possible values: `yes`, `no`, `no_data`

Indicates whether the email domain is listed as disposable if known. Disposable domains are often used to create email addresses that are part of a fake set of user details.

Possible values: `yes`, `no`, `no_data`

Indicates whether the email address top level domain, which is the last part of the domain, is fraudulent or risky if known. In most cases, a suspicious top level domain is also associated with a disposable or high-risk domain.

Possible values: `yes`, `no`, `no_data`

Indicates whether the email address domain is an educational institution domain if known.

Possible values: `yes`, `no`, `no_data`

Indicates whether the email address includes the date of birth or year of birth if known.

Possible values: `yes`, `no`, `no_data`

Indicates whether the provided name matches the email address according to the KYC name-matches-email inference result if known.

`match` - "The email's name identifiers match the user's name."

`partial_match` - "The email's name identifiers partially match the user's name."

`no_match` - "The email's name identifiers do not match the user's name."

`indeterminate` - "The email does not contain any name identifiers, and a match could not be determined."

`no_input` - "The user's profile does not contain the required user inputs to determine a match."

`no_data` - "Field could not be verified against available sources."

Possible values: `no_input`, `indeterminate`, `no_match`, `partial_match`, `match`, `no_data`

A list of online services where this email address has been detected to have accounts or other activity.

Possible values: `aboutme`, `adobe`, `adult_sites`, `airbnb`, `altbalaji`, `amazon`, `apple`, `archiveorg`, `atlassian`, `bitmoji`, `bodybuilding`, `booking`, `bukalapak`, `codecademy`, `deliveroo`, `diigo`, `discord`, `disneyplus`, `duolingo`, `ebay`, `envato`, `eventbrite`, `evernote`, `facebook`, `firefox`, `flickr`, `flipkart`, `foursquare`, `freelancer`, `gaana`, `giphy`, `github`, `google`, `gravatar`, `hubspot`, `imgur`, `instagram`, `jdid`, `kakao`, `kommo`, `komoot`, `lastfm`, `lazada`, `line`, `linkedin`, `mailru`, `microsoft`, `myspace`, `netflix`, `nike`, `ok`, `patreon`, `pinterest`, `plurk`, `quora`, `qzone`, `rambler`, `rappi`, `replit`, `samsung`, `seoclerks`, `shopclues`, `skype`, `snapchat`, `snapdeal`, `soundcloud`, `spotify`, `starz`, `strava`, `taringa`, `telegram`, `tiki`, `tokopedia`, `treehouse`, `tumblr`, `twitter`, `venmo`, `viber`, `vimeo`, `vivino`, `vkontakte`, `wattpad`, `weibo`, `whatsapp`, `wordpress`, `xing`, `yahoo`, `yandex`, `zalo`, `zoho`

Result summary object specifying values for `phone` attributes of risk check.

Hide object

A list of online services where this phone number has been detected to have accounts or other activity.

Possible values: `aboutme`, `adobe`, `adult_sites`, `airbnb`, `altbalaji`, `amazon`, `apple`, `archiveorg`, `atlassian`, `bitmoji`, `bodybuilding`, `booking`, `bukalapak`, `codecademy`, `deliveroo`, `diigo`, `discord`, `disneyplus`, `duolingo`, `ebay`, `envato`, `eventbrite`, `evernote`, `facebook`, `firefox`, `flickr`, `flipkart`, `foursquare`, `freelancer`, `gaana`, `giphy`, `github`, `google`, `gravatar`, `hubspot`, `imgur`, `instagram`, `jdid`, `kakao`, `kommo`, `komoot`, `lastfm`, `lazada`, `line`, `linkedin`, `mailru`, `microsoft`, `myspace`, `netflix`, `nike`, `ok`, `patreon`, `pinterest`, `plurk`, `quora`, `qzone`, `rambler`, `rappi`, `replit`, `samsung`, `seoclerks`, `shopclues`, `skype`, `snapchat`, `snapdeal`, `soundcloud`, `spotify`, `starz`, `strava`, `taringa`, `telegram`, `tiki`, `tokopedia`, `treehouse`, `tumblr`, `twitter`, `venmo`, `viber`, `vimeo`, `vivino`, `vkontakte`, `wattpad`, `weibo`, `whatsapp`, `wordpress`, `xing`, `yahoo`, `yandex`, `zalo`, `zoho`

Array of result summary objects specifying values for `device` attributes of risk check.

Hide object

An enum indicating whether a network proxy is present and if so what type it is.

`none_detected` indicates the user is not on a detectable proxy network.

`tor` indicates the user was using a Tor browser, which sends encrypted traffic on a decentralized network and is somewhat similar to a VPN (Virtual Private Network).

`vpn` indicates the user is on a VPN (Virtual Private Network)

`web_proxy` indicates the user is on a web proxy server, which may allow them to conceal information such as their IP address or other identifying information.

`public_proxy` indicates the user is on a public web proxy server, which is similar to a web proxy but can be shared by multiple users. This may allow multiple users to appear as if they have the same IP address for instance.

Possible values: `none_detected`, `tor`, `vpn`, `web_proxy`, `public_proxy`

Count of spam lists the IP address is associated with if known.

UTC offset of the timezone associated with the IP address.

Result summary object capturing abuse signals related to `identity abuse`, e.g. stolen and synthetic identity fraud. These attributes are only available for US identities and some signals may not be available depending on what information was collected.

Hide object

Field containing the data used in determining the outcome of the synthetic identity risk check.

Contains the following fields:

`score` - A score from 0 to 100 indicating the likelihood that the user is a synthetic identity.

Hide object

A score from 0 to 100 indicating the likelihood that the user is a synthetic identity.

Field containing the data used in determining the outcome of the stolen identity risk check.

Contains the following fields:

`score` - A score from 0 to 100 indicating the likelihood that the user is a stolen identity.

Hide object

A score from 0 to 100 indicating the likelihood that the user is a stolen identity.

The attributes related to the facial duplicates captured in risk check.

Hide object

ID of the associated Identity Verification attempt.

Similarity score of the match. Ranges from 0 to 100.

Whether this match occurred after the session was complete. For example, this would be `true` if a later session ended up matching this one.

The trust index score for the `risk_check` step.

Additional information for the `verify_sms` step.

Hide object

The outcome status for the associated Identity Verification attempt's `verify_sms` step. This field will always have the same value as `steps.verify_sms`.

Possible values: `success`, `failed`

An array where each entry represents a verification attempt for the `verify_sms` step. Each entry represents one user-submitted phone number. Phone number edits, and in some cases error handling due to edge cases like rate limiting, may generate additional verifications.

Hide object

The outcome status for the individual SMS verification.

Possible values: `pending`, `success`, `failed`, `canceled`

The attempt field begins with 1 and increments with each subsequent SMS verification.

A phone number in E.164 format.

The number of delivery attempts made within the verification to send the SMS code to the user. Each delivery attempt represents the user taking action from the front end UI to request creation and delivery of a new SMS verification code, or to resend an existing SMS verification code. There is a limit of 3 delivery attempts per verification.

The number of attempts made by the user within the verification to verify the SMS code by entering it into the front end UI. There is a limit of 3 solve attempts per verification.

An ISO8601 formatted timestamp.

Format: `date-time`

An ISO8601 formatted timestamp.

Format: `date-time`

An ISO8601 formatted timestamp.

Format: `date-time`

ID of the associated screening.

ID of the associated Beacon User.

Unique user identifier, created by calling `/user/create`. Either a `user_id` or the `client_user_id` must be provided. The `user_id` may only be used instead of the `client_user_id` if you were not a pre-existing user of `/user/create` as of December 10, 2025, or if you have since [migrated to the new User APIs](https://plaid.com/docs/api/users/migrate-to-new-user-apis); for more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis). If both this field and a `client_user_id` are present in a request, the `user_id` must have been created from the provided `client_user_id`.

An ISO8601 formatted timestamp.

Format: `date-time`

Information about a Protect event including Trust Index score and fraud attributes.

Hide object

The event ID.

The timestamp of the event, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format, e.g. `"2017-09-14T14:42:19.350Z"`

Format: `date-time`

Represents a calculated Trust Index Score.

Hide object

The overall trust index score.

The versioned name of the Trust Index model used for scoring.

Contains sub-score metadata.

Hide object

Represents Trust Index Subscore.

Hide object

The subscore score.

Represents Trust Index Subscore.

Hide object

The subscore score.

Event fraud attributes as an arbitrary set of key-value pairs. The set of attributes returned varies by model.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "id": "idv_52xR9LKo77r1Np",
  "client_user_id": "your-db-id-3b24110",
  "created_at": "2020-07-24T03:26:02Z",
  "completed_at": "2020-07-24T03:26:02Z",
  "previous_attempt_id": "idv_42cF1MNo42r9Xj",
  "shareable_url": "https://flow.plaid.com/verify/idv_4FrXJvfQU3zGUR?key=e004115db797f7cc3083bff3167cba30644ef630fb46f5b086cde6cc3b86a36f",
  "template": {
    "id": "idvtmp_4FrXJvfQU3zGUR",
    "version": 2
  },
  "user": {
    "phone_number": "+12345678909",
    "date_of_birth": "1990-05-29",
    "ip_address": "192.0.2.42",
    "email_address": "user@example.com",
    "name": {
      "given_name": "Leslie",
      "family_name": "Knope"
    },
    "address": {
      "street": "123 Main St.",
      "street2": "Unit 42",
      "city": "Pawnee",
      "region": "IN",
      "postal_code": "46001",
      "country": "US"
    },
    "id_number": {
      "value": "123456789",
      "type": "us_ssn"
    }
  },
  "status": "success",
  "steps": {
    "accept_tos": "success",
    "verify_sms": "success",
    "kyc_check": "success",
    "documentary_verification": "success",
    "selfie_check": "success",
    "watchlist_screening": "success",
    "risk_check": "success"
  },
  "documentary_verification": {
    "status": "success",
    "documents": [
      {
        "status": "success",
        "attempt": 1,
        "images": {
          "original_front": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/documents/1/original_front.jpeg",
          "original_back": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/documents/1/original_back.jpeg",
          "cropped_front": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/documents/1/cropped_front.jpeg",
          "cropped_back": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/documents/1/cropped_back.jpeg",
          "face": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/documents/1/face.jpeg"
        },
        "extracted_data": {
          "id_number": "AB123456",
          "category": "drivers_license",
          "expiration_date": "2030-05-29",
          "issue_date": "2020-05-29",
          "issuing_country": "US",
          "issuing_region": "IN",
          "date_of_birth": "1990-05-29",
          "address": {
            "street": "123 Main St. Unit 42",
            "city": "Pawnee",
            "region": "IN",
            "postal_code": "46001",
            "country": "US"
          },
          "name": {
            "given_name": "Leslie",
            "family_name": "Knope"
          }
        },
        "analysis": {
          "authenticity": "match",
          "image_quality": "high",
          "extracted_data": {
            "name": "match",
            "date_of_birth": "match",
            "expiration_date": "not_expired",
            "issuing_country": "match"
          },
          "aamva_verification": {
            "is_verified": true,
            "id_number": "match",
            "id_issue_date": "match",
            "id_expiration_date": "match",
            "street": "match",
            "city": "match",
            "postal_code": "match",
            "date_of_birth": "match",
            "gender": "match",
            "height": "match",
            "eye_color": "match",
            "first_name": "match",
            "middle_name": "match",
            "last_name": "match"
          },
          "fraud_analysis_details": {
            "type_supported": "success",
            "portrait_presence_check": "success",
            "portrait_details_check": "success",
            "image_composition_check": "success",
            "integrity_check": "success",
            "detail_check": "success",
            "issue_date_check": "success"
          },
          "image_quality_details": {
            "glare_check": "success",
            "blur_check": "success",
            "dimensions_check": "success"
          }
        },
        "redacted_at": "2020-07-24T03:26:02Z"
      }
    ]
  },
  "selfie_check": {
    "status": "success",
    "selfies": [
      {
        "status": "success",
        "attempt": 1,
        "capture": {
          "image_url": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/selfie/liveness.jpeg",
          "video_url": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/selfie/liveness.webm"
        },
        "analysis": {
          "document_comparison": "match",
          "liveness_check": "success",
          "age_check": {
            "status": "match",
            "reported_age": 36,
            "age_estimate_lower_bound": 32,
            "age_estimate_upper_bound": 38
          }
        }
      }
    ]
  },
  "kyc_check": {
    "status": "success",
    "address": {
      "summary": "match",
      "po_box": "yes",
      "type": "residential"
    },
    "name": {
      "summary": "match"
    },
    "date_of_birth": {
      "summary": "match"
    },
    "id_number": {
      "summary": "match"
    },
    "phone_number": {
      "summary": "match",
      "area_code": "match"
    }
  },
  "risk_check": {
    "status": "success",
    "behavior": {
      "user_interactions": "risky",
      "fraud_ring_detected": "yes",
      "bot_detected": "yes"
    },
    "email": {
      "is_deliverable": "yes",
      "breach_count": 1,
      "first_breached_at": "1990-05-29",
      "last_breached_at": "1990-05-29",
      "domain_registered_at": "1990-05-29",
      "domain_is_free_provider": "yes",
      "domain_is_custom": "yes",
      "domain_is_disposable": "yes",
      "top_level_domain_is_suspicious": "yes",
      "is_edu": "yes",
      "includes_date_of_birth": "yes",
      "name": "match",
      "linked_services": [
        "apple"
      ]
    },
    "phone": {
      "linked_services": [
        "apple"
      ]
    },
    "devices": [
      {
        "ip_proxy_type": "none_detected",
        "ip_spam_list_count": 1,
        "ip_timezone_offset": "+06:00:00"
      }
    ],
    "identity_abuse_signals": {
      "synthetic_identity": {
        "score": 0
      },
      "stolen_identity": {
        "score": 0
      }
    },
    "facial_duplicates": [
      {
        "id": "idv_52xR9LKo77r1Np",
        "similarity": 95,
        "matched_after_completed": true
      }
    ],
    "trust_index_score": 86
  },
  "verify_sms": {
    "status": "success",
    "verifications": [
      {
        "status": "success",
        "attempt": 1,
        "phone_number": "+12345678909",
        "delivery_attempt_count": 1,
        "solve_attempt_count": 1,
        "initially_sent_at": "2020-07-24T03:26:02Z",
        "last_sent_at": "2020-07-24T03:26:02Z",
        "redacted_at": "2020-07-24T03:26:02Z"
      }
    ]
  },
  "watchlist_screening_id": "scr_52xR9LKo77r1Np",
  "beacon_user_id": "becusr_42cF1MNo42r9Xj",
  "user_id": "usr_dddAs9ewdcDQQQ",
  "redacted_at": "2020-07-24T03:26:02Z",
  "latest_scored_protect_event": {
    "event_id": "ptevt_7AJYTMFxRUgJ",
    "timestamp": "2020-07-24T03:26:02Z",
    "trust_index": {
      "score": 86,
      "model": "trust_index.2.0.0",
      "subscores": {
        "device_and_connection": {
          "score": 87
        },
        "bank_account_insights": {
          "score": 85
        }
      }
    },
    "fraud_attributes": {
      "fraud_attributes": {
        "link_session.linked_bank_accounts.user_pi_matches_owners": true,
        "link_session.linked_bank_accounts.connected_apps.days_since_first_connection": 582,
        "session.challenged_with_mfa": false,
        "user.bank_accounts.num_of_frozen_or_restricted_accounts": 0,
        "user.linked_bank_accounts.num_family_names": 1,
        "user.linked_bank_accounts.num_of_connected_banks": 1,
        "user.link_sessions.days_since_first_link_session": 150,
        "user.pi.email.history_yrs": 7.03,
        "user.pi.email.num_social_networks_linked": 12,
        "user.pi.ssn.user_likely_has_better_ssn": false
      }
    }
  },
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/identity_verification/get`](/docs/api/products/identity-verification/#identity_verificationget)

[#### Retrieve Identity Verification](/docs/api/products/identity-verification/#retrieve-identity-verification)

Retrieve a previously created Identity Verification.

/identity\_verification/get

**Request fields**

ID of the associated Identity Verification attempt.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

/identity\_verification/get

Nodeâ¼

```
const request: IdentityVerificationGetRequest = {
  identity_verification_id: 'idv_52xR9LKo77r1Np',
};
try {
  const response = await plaidClient.identityVerificationGet(request);
} catch (error) {
  // handle error
}
```

/identity\_verification/get

**Response fields**

Collapse all

ID of the associated Identity Verification attempt.

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

An ISO8601 formatted timestamp.

Format: `date-time`

An ISO8601 formatted timestamp.

Format: `date-time`

The ID for the Identity Verification preceding this session. This field will only be filled if the current Identity Verification is a retry of a previous attempt.

A shareable URL that can be sent directly to the user to complete verification

The resource ID and version number of the template configuring the behavior of a given Identity Verification.

Hide object

ID of the associated Identity Verification template. Like all Plaid identifiers, this is case-sensitive.

Version of the associated Identity Verification template.

The identity data that was either collected from the user or provided via API in order to perform an Identity Verification.

Hide object

A valid phone number in E.164 format.

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

An IPv4 or IPv6 address.

A valid email address. Must not have leading or trailing spaces and address must be RFC compliant. For more information, see [RFC 3696](https://datatracker.ietf.org/doc/html/rfc3696).

Format: `email`

The full name provided by the user. If the user has not submitted their name, this field will be null. Otherwise, both fields are guaranteed to be filled.

Hide object

A string with at least one non-whitespace character, with a max length of 100 characters.

A string with at least one non-whitespace character, with a max length of 100 characters.

Even if an address has been collected, some fields may be null depending on the region's addressing system. For example:

Addresses from the United Kingdom will not include a region

Addresses from Hong Kong will not include postal code

Hide object

The primary street portion of an address. If an address is provided, this field will always be filled. A string with at least one non-whitespace alphabetical character, with a max length of 80 characters.

Extra street information, like an apartment or suite number. If provided, a string with at least one non-whitespace character, with a max length of 50 characters.

City from the address. A string with at least one non-whitespace alphabetical character, with a max length of 100 characters.

A subdivision code. "Subdivision" is a generic term for "state", "province", "prefecture", "zone", etc. For the list of valid codes, see [country subdivision codes](https://plaid.com/documents/country_subdivision_codes.json). Country prefixes are omitted, since they are inferred from the `country` field.

The postal code for the associated address. Between 2 and 10 alphanumeric characters. For US-based addresses this must be 5 numeric digits.

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

ID number submitted by the user, currently used only for the Identity Verification product. If the user has not submitted this data yet, this field will be `null`. Otherwise, both fields are guaranteed to be filled.

Hide object

Value of the identity document typed in by the user. Alpha-numeric, with all formatting characters stripped. For specific format requirements by ID type, see [Input Validation Rules](https://plaid.com/docs/identity-verification/hybrid-input-validation/#id-numbers).

A globally unique and human readable ID type, specific to the country and document category. For more context on this field, see [Input Validation Rules](https://plaid.com/docs/identity-verification/hybrid-input-validation/#id-numbers).

Possible values: `ar_dni`, `au_drivers_license`, `au_passport`, `br_cpf`, `ca_sin`, `cl_run`, `cn_resident_card`, `co_nit`, `dk_cpr`, `eg_national_id`, `es_dni`, `es_nie`, `hk_hkid`, `in_pan`, `in_epic`, `it_cf`, `jo_civil_id`, `jp_my_number`, `ke_huduma_namba`, `kw_civil_id`, `mx_curp`, `mx_rfc`, `my_nric`, `ng_nin`, `nz_drivers_license`, `om_civil_id`, `ph_psn`, `pl_pesel`, `ro_cnp`, `sa_national_id`, `se_pin`, `sg_nric`, `tr_tc_kimlik`, `us_ssn`, `us_ssn_last_4`, `za_smart_id`

The status of this Identity Verification attempt.

`active` - The Identity Verification attempt is incomplete. The user may have completed part of the session, but has neither failed nor passed.

`success` - The Identity Verification attempt has completed, passing all steps defined to the associated Identity Verification template.

`failed` - The user failed one or more steps in the session and was told to contact support.

`expired` - The Identity Verification attempt was active for a long period of time without being completed and was automatically marked as expired. Note that sessions currently do not expire. Automatic expiration is expected to be enabled in the future.

`canceled` - The Identity Verification attempt was canceled, either via the dashboard by a user, or via API. The user may have completed part of the session, but has neither failed nor passed.

`pending_review` - The Identity Verification attempt template was configured to perform a screening that had one or more hits needing review.

Possible values: `active`, `success`, `failed`, `expired`, `canceled`, `pending_review`

Each step will be one of the following values:

`active` - This step is the user's current step. They are either in the process of completing this step, or they recently closed their Identity Verification attempt while in the middle of this step. Only one step will be marked as `active` at any given point.

`success` - The Identity Verification attempt has completed this step.

`failed` - The user failed this step. This can either cause the user to fail the session as a whole, or cause them to fall back to another step depending on how the Identity Verification template is configured. A failed step does not imply a failed session.

`waiting_for_prerequisite` - The user needs to complete another step first, before they progress to this step. This step may never run, depending on if the user fails an earlier step or if the step is only run as a fallback.

`not_applicable` - This step will not be run for this session.

`skipped` - The retry instructions that created this Identity Verification attempt specified that this step should be skipped.

`expired` - This step had not yet been completed when the Identity Verification attempt as a whole expired.

`canceled` - The Identity Verification attempt was canceled before the user completed this step.

`pending_review` - The Identity Verification attempt template was configured to perform a screening that had one or more hits needing review.

`manually_approved` - The step was manually overridden to pass by a team member in the dashboard.

`manually_rejected` - The step was manually overridden to fail by a team member in the dashboard.

Hide object

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

Data, images, analysis, and results from the `documentary_verification` step. This field will be `null` unless `steps.documentary_verification` has reached a terminal state of either `success` or `failed`.

Hide object

The outcome status for the associated Identity Verification attempt's `documentary_verification` step. This field will always have the same value as `steps.documentary_verification`.

An array of documents submitted to the `documentary_verification` step. Each entry represents one user submission, where each submission will contain both a front and back image, or just a front image, depending on the document type.

Note: Plaid will automatically let a user submit a new set of document images up to three times if we detect that a previous attempt might have failed due to user error. For example, if the first set of document images are blurry or obscured by glare, the user will be asked to capture their documents again, resulting in at least two separate entries within `documents`. If the overall `documentary_verification` is `failed`, the user has exhausted their retry attempts.

Hide object

An outcome status for this specific document submission. Distinct from the overall `documentary_verification.status` that summarizes the verification outcome from one or more documents.

Possible values: `success`, `failed`, `manually_approved`

The `attempt` field begins with 1 and increments with each subsequent document upload.

URLs for downloading original and cropped images for this document submission. The URLs are designed to only allow downloading, not hot linking, so the URL will only serve the document image for 60 seconds before expiring. The expiration time is 60 seconds after the `GET` request for the associated Identity Verification attempt. A new expiring URL is generated with each request, so you can always rerequest the Identity Verification attempt if one of your URLs expires.

Hide object

Temporary URL that expires after 60 seconds for downloading the uncropped original image of the front of the document.

Temporary URL that expires after 60 seconds for downloading the original image of the back of the document. Might be null if the back of the document was not collected.

Temporary URL that expires after 60 seconds for downloading a cropped image containing just the front of the document.

Temporary URL that expires after 60 seconds for downloading a cropped image containing just the back of the document. Might be null if the back of the document was not collected.

Temporary URL that expires after 60 seconds for downloading a crop of just the user's face from the document image. Might be null if the document does not contain a face photo.

Data extracted from a user-submitted document.

Hide object

Alpha-numeric ID number extracted via OCR from the user's document image.

The type of identity document detected in the images provided. Will always be one of the following values:

`drivers_license` - A driver's license issued by the associated country, establishing identity without any guarantee as to citizenship, and granting driving privileges

`id_card` - A general national identification card, distinct from driver's licenses as it only establishes identity

`passport` - A travel passport issued by the associated country for one of its citizens

`residence_permit_card` - An identity document issued by the associated country permitting a foreign citizen to *temporarily* reside there

`resident_card` - An identity document issued by the associated country permitting a foreign citizen to *permanently* reside there

`visa` - An identity document issued by the associated country permitting a foreign citizen entry for a short duration and for a specific purpose, typically no longer than 6 months

Note: This value may be different from the ID type that the user selects within Link. For example, if they select "Driver's License" but then submit a picture of a passport, this field will say `passport`

Possible values: `drivers_license`, `id_card`, `passport`, `residence_permit_card`, `resident_card`, `visa`

The expiration date of the document in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

The issue date of the document in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

A subdivision code. "Subdivision" is a generic term for "state", "province", "prefecture", "zone", etc. For the list of valid codes, see [country subdivision codes](https://plaid.com/documents/country_subdivision_codes.json). Country prefixes are omitted, since they are inferred from the `country` field.

A date extracted from the document in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

The address extracted from the document. The address must at least contain the following fields to be a valid address: `street`, `city`, `country`. If any are missing or unable to be extracted, the address will be null.

`region`, and `postal_code` may be null based on the addressing system. For example:

Addresses from the United Kingdom will not include a region

Addresses from Hong Kong will not include postal code

Note: Optical Character Recognition (OCR) technology may sometimes extract incorrect data from a document.

Hide object

The full street address extracted from the document.

City extracted from the document.

A subdivision code extracted from the document. Related terms would be "state", "province", "prefecture", "zone", "subdivision", etc. For a full list of valid codes, see [country subdivision codes](https://plaid.com/documents/country_subdivision_codes.json). Country prefixes are omitted, since they can be inferred from the `country` field.

The postal code extracted from the document. Between 2 and 10 alphanumeric characters. For US-based addresses this must be 5 numeric digits.

Valid, capitalized, two-letter ISO code representing the country extracted from the document. Must be in ISO 3166-1 alpha-2 form.

The individual's name extracted from the document.

Hide object

A string with at least one non-whitespace character, with a max length of 100 characters.

A string with at least one non-whitespace character, with a max length of 100 characters.

High level descriptions of how the associated document was processed. If a document fails verification, the details in the `analysis` object should help clarify why the document was rejected.

Hide object

High level summary of whether the document in the provided image matches the formatting rules and security checks for the associated jurisdiction.

For example, most identity documents have formatting rules like the following:

The image of the person's face must have a certain contrast in order to highlight skin tone

The subject in the document's image must remove eye glasses and pose in a certain way

The informational fields (name, date of birth, ID number, etc.) must be colored and aligned according to specific rules

Security features like watermarks and background patterns must be present

So a `match` status for this field indicates that the document in the provided image seems to conform to the various formatting and security rules associated with the detected document.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

A high level description of the quality of the image the user submitted.

For example, an image that is blurry, distorted by glare from a nearby light source, or improperly framed might be marked as low or medium quality. Poor quality images are more likely to fail OCR and/or template conformity checks.

Note: By default, Plaid will let a user recapture document images twice before failing the entire session if we attribute the failure to low image quality.

Possible values: `high`, `medium`, `low`

Analysis of the data extracted from the submitted document.

Hide object

A match summary describing the cross comparison between the subject's name, extracted from the document image, and the name they separately provided to the identity verification attempt.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

A match summary describing the cross comparison between the subject's date of birth, extracted from the document image, and the date of birth they separately provided to the identity verification attempt.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

A description of whether the associated document was expired when the verification was performed.

Note: In the case where an expiration date is not present on the document or failed to be extracted, this value will be `no_data`.

Possible values: `not_expired`, `expired`, `no_data`

A binary match indicator specifying whether the country that issued the provided document matches the country that the user separately provided to Plaid.

Note: You can configure whether a `no_match` on `issuing_country` fails the `documentary_verification` by editing your Plaid Template.

Possible values: `match`, `no_match`

Details about the fraud analysis performed on the document.

Hide object

Whether the submitted document type is supported for fraud analysis.

`success` - The document type is supported.

`failed` - The document type is not supported.

Possible values: `success`, `failed`

The outcome of the portrait presence check.

`success` - A portrait was detected.

`failed` - No portrait was detected.

Possible values: `success`, `failed`

The outcome of the portrait details check including photo embedding and face landmark checks.

`success` - The portrait passed all validity checks.

`failed` - The portrait did not pass one or more validity checks.

Possible values: `success`, `failed`

The outcome of the image composition check.

`success` - The image is a valid physical document capture.

`failed` - The image appears to be a photograph of a screen or a digital forgery.

Possible values: `success`, `failed`

The outcome of the integrity check for document security elements.

`success` - Data is consistent across all checked security elements.

`failed` - Inconsistencies were detected across one or more security elements.

Possible values: `success`, `failed`

The outcome of the document detail check for correct styling and layout.

`success` - The document passed all authenticity checks.

`failed` - The document did not pass one or more authenticity checks.

Possible values: `success`, `failed`

The outcome of the issue date validity check.

`success` - The issue date is valid.

`failed` - The issue date is invalid or could not be verified.

`no_data` - The check could not be performed due to insufficient data.

Possible values: `success`, `failed`, `no_data`

Details about the image quality of the document.

Hide object

The outcome of the glare check.

`success` - The image is free of glare.

`failed` - The image contains glare that may obscure document details.

Possible values: `success`, `failed`

The outcome of the dimensions check.

`success` - The image meets the minimum size and resolution requirements.

`failed` - The image does not meet the minimum size or resolution requirements.

Possible values: `success`, `failed`

The outcome of the blur check.

`success` - The image is sufficiently sharp.

`failed` - The image is too blurry for analysis.

Possible values: `success`, `failed`

Analyzed AAMVA data for the associated hit.

Note: This field is only available for U.S. driver's licenses issued by participating states.

Hide object

The overall outcome of checking the associated hit against the issuing state database.

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the associated hit against state databases.

`match` - The field is an exact match with the state database.

`partial_match` - The field is a partial match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the associated hit against state databases.

`match` - The field is an exact match with the state database.

`partial_match` - The field is a partial match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the associated hit against state databases.

`match` - The field is an exact match with the state database.

`partial_match` - The field is a partial match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

The outcome of checking the associated hit against state databases.

`match` - The field is an exact match with the state database.

`partial_match` - The field is a partial match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

The outcome of checking the associated hit against state databases.

`match` - The field is an exact match with the state database.

`partial_match` - The field is a partial match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

An ISO8601 formatted timestamp.

Format: `date-time`

Additional information for the `selfie_check` step. This field will be `null` unless `steps.selfie_check` has reached a terminal state of either `success` or `failed`.

Hide object

The outcome status for the associated Identity Verification attempt's `selfie_check` step. This field will always have the same value as `steps.selfie_check`.

Possible values: `success`, `failed`

An array of selfies submitted to the `selfie_check` step. Each entry represents one user submission.

Hide object

An outcome status for this specific selfie. Distinct from the overall `selfie_check.status` that summarizes the verification outcome from one or more selfies.

Possible values: `success`, `failed`

The `attempt` field begins with 1 and increments with each subsequent selfie upload.

The image or video capture of a selfie. Only one of `image_url` or `video_url` will be populated per selfie. In the vast majority of sessions Plaid records a short video of the user, so `video_url` is populated and `image_url` is `null`. `image_url` is only populated in the rare passive-liveness fallback case, where the user's device could not complete the standard video liveness capture (for example, a camera or streaming error) and submitted a single still image instead.

Hide object

Temporary URL for downloading a still-image selfie capture. This field is only populated when the session fell back to passive (image-based) liveness. For the majority of selfie checks this field is `null` and `video_url` is populated instead.

Temporary URL for downloading a video selfie capture. This is the standard selfie capture for Identity Verification. Plaid records a short video of the user during the Selfie Check liveness step, so this field is populated for the vast majority of selfie checks.

High level descriptions of how the associated selfie was processed. If a selfie fails verification, the details in the `analysis` object should help clarify why the selfie was rejected.

Hide object

Information about the comparison between the selfie and the document (if documentary verification also ran).

Possible values: `match`, `no_match`, `no_input`

Assessment of whether the selfie capture is of a real human being, as opposed to a picture of a human on a screen, a picture of a paper cut out, someone wearing a mask, or a deepfake.

Possible values: `success`, `failed`

Age-estimation results from the selfie capture. This field is `null` when an age range could not be estimated from the selfie capture.

Hide object

An enum indicating whether the reported age aligns with the estimated selfie capture age range.

`match` indicates that the reported age falls within the estimated selfie capture age range.

`warning` indicates that the reported age falls outside the estimated selfie capture age range, but is close enough that the result should be reviewed.

`no_match` indicates that the reported age falls far outside the estimated selfie capture age range.

`no_data` indicates that there was not enough data available at age-estimation time to compare the reported age against the estimated selfie capture age range.

Possible values: `match`, `warning`, `no_match`, `no_data`

The user's age at the time of the selfie capture, calculated from the date of birth submitted during Identity Verification. If multiple date of birth sources are available, the date of birth submitted in the flow session takes priority over the document date of birth. This field is `null` when the date of birth is unavailable.

Lower bound of the estimated age range from the selfie capture.

Upper bound of the estimated age range from the selfie capture.

Additional information for the `kyc_check` (Data Source Verification) step. This field will be `null` unless `steps.kyc_check` has reached a terminal state of either `success` or `failed`.

Hide object

The outcome status for the associated Identity Verification attempt's `kyc_check` step. This field will always have the same value as `steps.kyc_check`.

Result summary object specifying how the `address` field matched.

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Field describing whether the associated address is a post office box. Will be `yes` when a P.O. box is detected, `no` when Plaid confirmed the address is not a P.O. box, and `no_data` when Plaid was not able to determine if the address is a P.O. box.

Possible values: `yes`, `no`, `no_data`

Field describing whether the associated address is being used for commercial or residential purposes.

Note: This value will be `no_data` when Plaid does not have sufficient data to determine the address's use.

Possible values: `residential`, `commercial`, `no_data`

Result summary object specifying how the `name` field matched.

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Result summary object specifying how the `date_of_birth` field matched.

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Result summary object specifying how the `id_number` field matched.

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Result summary object specifying how the `phone` field matched.

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Additional information for the `risk_check` step.

Hide object

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

Result summary object specifying values for `behavior` attributes of risk check, when available.

Hide object

Field describing the overall user interaction signals of a behavior risk check. This value represents how familiar the user is with the personal data they provide, based on a number of signals that are collected during their session.

`genuine` indicates the user has high familiarity with the data they are providing, and that fraud is unlikely.

`neutral` indicates some signals are present in between `risky` and `genuine`, but there are not enough clear signals to determine an outcome.

`risky` indicates the user has low familiarity with the data they are providing, and that fraud is likely.

`no_data` indicates there is not sufficient information to give an accurate signal.

Possible values: `genuine`, `neutral`, `risky`, `no_data`

Field describing the outcome of a fraud ring behavior risk check.

`yes` indicates that fraud ring activity was detected.

`no` indicates that fraud ring activity was not detected.

`no_data` indicates there was not enough information available to give an accurate signal.

Possible values: `yes`, `no`, `no_data`

Field describing the outcome of a bot detection behavior risk check.

`yes` indicates that automated activity was detected.

`no` indicates that automated activity was not detected.

`no_data` indicates there was not enough information available to give an accurate signal.

Possible values: `yes`, `no`, `no_data`

Result summary object specifying values for `email` attributes of risk check.

Hide object

SMTP-MX check to confirm the email address exists if known.

Possible values: `yes`, `no`, `no_data`

Count of all known breaches of this email address if known.

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

Indicates whether the email address domain is a free provider such as Gmail or Hotmail if known.

Possible values: `yes`, `no`, `no_data`

Indicates whether the email address domain is custom if known, i.e. a company domain and not free or disposable.

Possible values: `yes`, `no`, `no_data`

Indicates whether the email domain is listed as disposable if known. Disposable domains are often used to create email addresses that are part of a fake set of user details.

Possible values: `yes`, `no`, `no_data`

Indicates whether the email address top level domain, which is the last part of the domain, is fraudulent or risky if known. In most cases, a suspicious top level domain is also associated with a disposable or high-risk domain.

Possible values: `yes`, `no`, `no_data`

Indicates whether the email address domain is an educational institution domain if known.

Possible values: `yes`, `no`, `no_data`

Indicates whether the email address includes the date of birth or year of birth if known.

Possible values: `yes`, `no`, `no_data`

Indicates whether the provided name matches the email address according to the KYC name-matches-email inference result if known.

`match` - "The email's name identifiers match the user's name."

`partial_match` - "The email's name identifiers partially match the user's name."

`no_match` - "The email's name identifiers do not match the user's name."

`indeterminate` - "The email does not contain any name identifiers, and a match could not be determined."

`no_input` - "The user's profile does not contain the required user inputs to determine a match."

`no_data` - "Field could not be verified against available sources."

Possible values: `no_input`, `indeterminate`, `no_match`, `partial_match`, `match`, `no_data`

A list of online services where this email address has been detected to have accounts or other activity.

Possible values: `aboutme`, `adobe`, `adult_sites`, `airbnb`, `altbalaji`, `amazon`, `apple`, `archiveorg`, `atlassian`, `bitmoji`, `bodybuilding`, `booking`, `bukalapak`, `codecademy`, `deliveroo`, `diigo`, `discord`, `disneyplus`, `duolingo`, `ebay`, `envato`, `eventbrite`, `evernote`, `facebook`, `firefox`, `flickr`, `flipkart`, `foursquare`, `freelancer`, `gaana`, `giphy`, `github`, `google`, `gravatar`, `hubspot`, `imgur`, `instagram`, `jdid`, `kakao`, `kommo`, `komoot`, `lastfm`, `lazada`, `line`, `linkedin`, `mailru`, `microsoft`, `myspace`, `netflix`, `nike`, `ok`, `patreon`, `pinterest`, `plurk`, `quora`, `qzone`, `rambler`, `rappi`, `replit`, `samsung`, `seoclerks`, `shopclues`, `skype`, `snapchat`, `snapdeal`, `soundcloud`, `spotify`, `starz`, `strava`, `taringa`, `telegram`, `tiki`, `tokopedia`, `treehouse`, `tumblr`, `twitter`, `venmo`, `viber`, `vimeo`, `vivino`, `vkontakte`, `wattpad`, `weibo`, `whatsapp`, `wordpress`, `xing`, `yahoo`, `yandex`, `zalo`, `zoho`

Result summary object specifying values for `phone` attributes of risk check.

Hide object

A list of online services where this phone number has been detected to have accounts or other activity.

Possible values: `aboutme`, `adobe`, `adult_sites`, `airbnb`, `altbalaji`, `amazon`, `apple`, `archiveorg`, `atlassian`, `bitmoji`, `bodybuilding`, `booking`, `bukalapak`, `codecademy`, `deliveroo`, `diigo`, `discord`, `disneyplus`, `duolingo`, `ebay`, `envato`, `eventbrite`, `evernote`, `facebook`, `firefox`, `flickr`, `flipkart`, `foursquare`, `freelancer`, `gaana`, `giphy`, `github`, `google`, `gravatar`, `hubspot`, `imgur`, `instagram`, `jdid`, `kakao`, `kommo`, `komoot`, `lastfm`, `lazada`, `line`, `linkedin`, `mailru`, `microsoft`, `myspace`, `netflix`, `nike`, `ok`, `patreon`, `pinterest`, `plurk`, `quora`, `qzone`, `rambler`, `rappi`, `replit`, `samsung`, `seoclerks`, `shopclues`, `skype`, `snapchat`, `snapdeal`, `soundcloud`, `spotify`, `starz`, `strava`, `taringa`, `telegram`, `tiki`, `tokopedia`, `treehouse`, `tumblr`, `twitter`, `venmo`, `viber`, `vimeo`, `vivino`, `vkontakte`, `wattpad`, `weibo`, `whatsapp`, `wordpress`, `xing`, `yahoo`, `yandex`, `zalo`, `zoho`

Array of result summary objects specifying values for `device` attributes of risk check.

Hide object

An enum indicating whether a network proxy is present and if so what type it is.

`none_detected` indicates the user is not on a detectable proxy network.

`tor` indicates the user was using a Tor browser, which sends encrypted traffic on a decentralized network and is somewhat similar to a VPN (Virtual Private Network).

`vpn` indicates the user is on a VPN (Virtual Private Network)

`web_proxy` indicates the user is on a web proxy server, which may allow them to conceal information such as their IP address or other identifying information.

`public_proxy` indicates the user is on a public web proxy server, which is similar to a web proxy but can be shared by multiple users. This may allow multiple users to appear as if they have the same IP address for instance.

Possible values: `none_detected`, `tor`, `vpn`, `web_proxy`, `public_proxy`

Count of spam lists the IP address is associated with if known.

UTC offset of the timezone associated with the IP address.

Result summary object capturing abuse signals related to `identity abuse`, e.g. stolen and synthetic identity fraud. These attributes are only available for US identities and some signals may not be available depending on what information was collected.

Hide object

Field containing the data used in determining the outcome of the synthetic identity risk check.

Contains the following fields:

`score` - A score from 0 to 100 indicating the likelihood that the user is a synthetic identity.

Hide object

A score from 0 to 100 indicating the likelihood that the user is a synthetic identity.

Field containing the data used in determining the outcome of the stolen identity risk check.

Contains the following fields:

`score` - A score from 0 to 100 indicating the likelihood that the user is a stolen identity.

Hide object

A score from 0 to 100 indicating the likelihood that the user is a stolen identity.

The attributes related to the facial duplicates captured in risk check.

Hide object

ID of the associated Identity Verification attempt.

Similarity score of the match. Ranges from 0 to 100.

Whether this match occurred after the session was complete. For example, this would be `true` if a later session ended up matching this one.

The trust index score for the `risk_check` step.

Additional information for the `verify_sms` step.

Hide object

The outcome status for the associated Identity Verification attempt's `verify_sms` step. This field will always have the same value as `steps.verify_sms`.

Possible values: `success`, `failed`

An array where each entry represents a verification attempt for the `verify_sms` step. Each entry represents one user-submitted phone number. Phone number edits, and in some cases error handling due to edge cases like rate limiting, may generate additional verifications.

Hide object

The outcome status for the individual SMS verification.

Possible values: `pending`, `success`, `failed`, `canceled`

The attempt field begins with 1 and increments with each subsequent SMS verification.

A phone number in E.164 format.

The number of delivery attempts made within the verification to send the SMS code to the user. Each delivery attempt represents the user taking action from the front end UI to request creation and delivery of a new SMS verification code, or to resend an existing SMS verification code. There is a limit of 3 delivery attempts per verification.

The number of attempts made by the user within the verification to verify the SMS code by entering it into the front end UI. There is a limit of 3 solve attempts per verification.

An ISO8601 formatted timestamp.

Format: `date-time`

An ISO8601 formatted timestamp.

Format: `date-time`

An ISO8601 formatted timestamp.

Format: `date-time`

ID of the associated screening.

ID of the associated Beacon User.

Unique user identifier, created by calling `/user/create`. Either a `user_id` or the `client_user_id` must be provided. The `user_id` may only be used instead of the `client_user_id` if you were not a pre-existing user of `/user/create` as of December 10, 2025, or if you have since [migrated to the new User APIs](https://plaid.com/docs/api/users/migrate-to-new-user-apis); for more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis). If both this field and a `client_user_id` are present in a request, the `user_id` must have been created from the provided `client_user_id`.

An ISO8601 formatted timestamp.

Format: `date-time`

Information about a Protect event including Trust Index score and fraud attributes.

Hide object

The event ID.

The timestamp of the event, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format, e.g. `"2017-09-14T14:42:19.350Z"`

Format: `date-time`

Represents a calculated Trust Index Score.

Hide object

The overall trust index score.

The versioned name of the Trust Index model used for scoring.

Contains sub-score metadata.

Hide object

Represents Trust Index Subscore.

Hide object

The subscore score.

Represents Trust Index Subscore.

Hide object

The subscore score.

Event fraud attributes as an arbitrary set of key-value pairs. The set of attributes returned varies by model.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "id": "idv_52xR9LKo77r1Np",
  "client_user_id": "your-db-id-3b24110",
  "created_at": "2020-07-24T03:26:02Z",
  "completed_at": "2020-07-24T03:26:02Z",
  "previous_attempt_id": "idv_42cF1MNo42r9Xj",
  "shareable_url": "https://flow.plaid.com/verify/idv_4FrXJvfQU3zGUR?key=e004115db797f7cc3083bff3167cba30644ef630fb46f5b086cde6cc3b86a36f",
  "template": {
    "id": "idvtmp_4FrXJvfQU3zGUR",
    "version": 2
  },
  "user": {
    "phone_number": "+12345678909",
    "date_of_birth": "1990-05-29",
    "ip_address": "192.0.2.42",
    "email_address": "user@example.com",
    "name": {
      "given_name": "Leslie",
      "family_name": "Knope"
    },
    "address": {
      "street": "123 Main St.",
      "street2": "Unit 42",
      "city": "Pawnee",
      "region": "IN",
      "postal_code": "46001",
      "country": "US"
    },
    "id_number": {
      "value": "123456789",
      "type": "us_ssn"
    }
  },
  "status": "success",
  "steps": {
    "accept_tos": "success",
    "verify_sms": "success",
    "kyc_check": "success",
    "documentary_verification": "success",
    "selfie_check": "success",
    "watchlist_screening": "success",
    "risk_check": "success"
  },
  "documentary_verification": {
    "status": "success",
    "documents": [
      {
        "status": "success",
        "attempt": 1,
        "images": {
          "original_front": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/documents/1/original_front.jpeg",
          "original_back": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/documents/1/original_back.jpeg",
          "cropped_front": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/documents/1/cropped_front.jpeg",
          "cropped_back": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/documents/1/cropped_back.jpeg",
          "face": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/documents/1/face.jpeg"
        },
        "extracted_data": {
          "id_number": "AB123456",
          "category": "drivers_license",
          "expiration_date": "2030-05-29",
          "issue_date": "2020-05-29",
          "issuing_country": "US",
          "issuing_region": "IN",
          "date_of_birth": "1990-05-29",
          "address": {
            "street": "123 Main St. Unit 42",
            "city": "Pawnee",
            "region": "IN",
            "postal_code": "46001",
            "country": "US"
          },
          "name": {
            "given_name": "Leslie",
            "family_name": "Knope"
          }
        },
        "analysis": {
          "authenticity": "match",
          "image_quality": "high",
          "extracted_data": {
            "name": "match",
            "date_of_birth": "match",
            "expiration_date": "not_expired",
            "issuing_country": "match"
          },
          "aamva_verification": {
            "is_verified": true,
            "id_number": "match",
            "id_issue_date": "match",
            "id_expiration_date": "match",
            "street": "match",
            "city": "match",
            "postal_code": "match",
            "date_of_birth": "match",
            "gender": "match",
            "height": "match",
            "eye_color": "match",
            "first_name": "match",
            "middle_name": "match",
            "last_name": "match"
          },
          "fraud_analysis_details": {
            "type_supported": "success",
            "portrait_presence_check": "success",
            "portrait_details_check": "success",
            "image_composition_check": "success",
            "integrity_check": "success",
            "detail_check": "success",
            "issue_date_check": "success"
          },
          "image_quality_details": {
            "glare_check": "success",
            "blur_check": "success",
            "dimensions_check": "success"
          }
        },
        "redacted_at": "2020-07-24T03:26:02Z"
      }
    ]
  },
  "selfie_check": {
    "status": "success",
    "selfies": [
      {
        "status": "success",
        "attempt": 1,
        "capture": {
          "image_url": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/selfie/liveness.jpeg",
          "video_url": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/selfie/liveness.webm"
        },
        "analysis": {
          "document_comparison": "match",
          "liveness_check": "success",
          "age_check": {
            "status": "match",
            "reported_age": 36,
            "age_estimate_lower_bound": 32,
            "age_estimate_upper_bound": 38
          }
        }
      }
    ]
  },
  "kyc_check": {
    "status": "success",
    "address": {
      "summary": "match",
      "po_box": "yes",
      "type": "residential"
    },
    "name": {
      "summary": "match"
    },
    "date_of_birth": {
      "summary": "match"
    },
    "id_number": {
      "summary": "match"
    },
    "phone_number": {
      "summary": "match",
      "area_code": "match"
    }
  },
  "risk_check": {
    "status": "success",
    "behavior": {
      "user_interactions": "risky",
      "fraud_ring_detected": "yes",
      "bot_detected": "yes"
    },
    "email": {
      "is_deliverable": "yes",
      "breach_count": 1,
      "first_breached_at": "1990-05-29",
      "last_breached_at": "1990-05-29",
      "domain_registered_at": "1990-05-29",
      "domain_is_free_provider": "yes",
      "domain_is_custom": "yes",
      "domain_is_disposable": "yes",
      "top_level_domain_is_suspicious": "yes",
      "is_edu": "yes",
      "includes_date_of_birth": "yes",
      "name": "match",
      "linked_services": [
        "apple"
      ]
    },
    "phone": {
      "linked_services": [
        "apple"
      ]
    },
    "devices": [
      {
        "ip_proxy_type": "none_detected",
        "ip_spam_list_count": 1,
        "ip_timezone_offset": "+06:00:00"
      }
    ],
    "identity_abuse_signals": {
      "synthetic_identity": {
        "score": 0
      },
      "stolen_identity": {
        "score": 0
      }
    },
    "facial_duplicates": [
      {
        "id": "idv_52xR9LKo77r1Np",
        "similarity": 95,
        "matched_after_completed": true
      }
    ],
    "trust_index_score": 86
  },
  "verify_sms": {
    "status": "success",
    "verifications": [
      {
        "status": "success",
        "attempt": 1,
        "phone_number": "+12345678909",
        "delivery_attempt_count": 1,
        "solve_attempt_count": 1,
        "initially_sent_at": "2020-07-24T03:26:02Z",
        "last_sent_at": "2020-07-24T03:26:02Z",
        "redacted_at": "2020-07-24T03:26:02Z"
      }
    ]
  },
  "watchlist_screening_id": "scr_52xR9LKo77r1Np",
  "beacon_user_id": "becusr_42cF1MNo42r9Xj",
  "user_id": "usr_dddAs9ewdcDQQQ",
  "redacted_at": "2020-07-24T03:26:02Z",
  "latest_scored_protect_event": {
    "event_id": "ptevt_7AJYTMFxRUgJ",
    "timestamp": "2020-07-24T03:26:02Z",
    "trust_index": {
      "score": 86,
      "model": "trust_index.2.0.0",
      "subscores": {
        "device_and_connection": {
          "score": 87
        },
        "bank_account_insights": {
          "score": 85
        }
      }
    },
    "fraud_attributes": {
      "fraud_attributes": {
        "link_session.linked_bank_accounts.user_pi_matches_owners": true,
        "link_session.linked_bank_accounts.connected_apps.days_since_first_connection": 582,
        "session.challenged_with_mfa": false,
        "user.bank_accounts.num_of_frozen_or_restricted_accounts": 0,
        "user.linked_bank_accounts.num_family_names": 1,
        "user.linked_bank_accounts.num_of_connected_banks": 1,
        "user.link_sessions.days_since_first_link_session": 150,
        "user.pi.email.history_yrs": 7.03,
        "user.pi.email.num_social_networks_linked": 12,
        "user.pi.ssn.user_likely_has_better_ssn": false
      }
    }
  },
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/identity_verification/list`](/docs/api/products/identity-verification/#identity_verificationlist)

[#### List Identity Verifications](/docs/api/products/identity-verification/#list-identity-verifications)

Filter and list Identity Verifications created by your account

/identity\_verification/list

**Request fields**

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

ID of the associated Identity Verification template. Like all Plaid identifiers, this is case-sensitive.

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

A unique user identifier, created by calling `/user/create`. Either a `user_id` or the `client_user_id` must be provided. The `user_id` may only be used instead of the `client_user_id` if you were not a pre-existing user of `/user/create` as of December 10, 2025, or if you have since [migrated to the new User APIs](https://plaid.com/docs/api/users/migrate-to-new-user-apis); for more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis). If both this field and the `client_user_id` are present in the request, the `user_id` must have been created from the provided `client_user_id`.

An identifier that determines which page of results you receive.

/identity\_verification/list

Nodeâ¼

```
const request: IdentityVerificationListRequest = {
  template_id: 'idvtmp_52xR9LKo77r1Np',
  client_user_id: 'user-sandbox-b0e2c4ee-a763-4df5-bfe9-46a46bce993d',
};
try {
  const response = await plaidClient.identityVerificationList(request);
} catch (error) {
  // handle error
}
```

/identity\_verification/list

**Response fields**

Collapse all

List of Plaid sessions

Hide object

ID of the associated Identity Verification attempt.

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

An ISO8601 formatted timestamp.

Format: `date-time`

An ISO8601 formatted timestamp.

Format: `date-time`

The ID for the Identity Verification preceding this session. This field will only be filled if the current Identity Verification is a retry of a previous attempt.

A shareable URL that can be sent directly to the user to complete verification

The resource ID and version number of the template configuring the behavior of a given Identity Verification.

Hide object

ID of the associated Identity Verification template. Like all Plaid identifiers, this is case-sensitive.

Version of the associated Identity Verification template.

The identity data that was either collected from the user or provided via API in order to perform an Identity Verification.

Hide object

A valid phone number in E.164 format.

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

An IPv4 or IPv6 address.

A valid email address. Must not have leading or trailing spaces and address must be RFC compliant. For more information, see [RFC 3696](https://datatracker.ietf.org/doc/html/rfc3696).

Format: `email`

The full name provided by the user. If the user has not submitted their name, this field will be null. Otherwise, both fields are guaranteed to be filled.

Hide object

A string with at least one non-whitespace character, with a max length of 100 characters.

A string with at least one non-whitespace character, with a max length of 100 characters.

Even if an address has been collected, some fields may be null depending on the region's addressing system. For example:

Addresses from the United Kingdom will not include a region

Addresses from Hong Kong will not include postal code

Hide object

The primary street portion of an address. If an address is provided, this field will always be filled. A string with at least one non-whitespace alphabetical character, with a max length of 80 characters.

Extra street information, like an apartment or suite number. If provided, a string with at least one non-whitespace character, with a max length of 50 characters.

City from the address. A string with at least one non-whitespace alphabetical character, with a max length of 100 characters.

A subdivision code. "Subdivision" is a generic term for "state", "province", "prefecture", "zone", etc. For the list of valid codes, see [country subdivision codes](https://plaid.com/documents/country_subdivision_codes.json). Country prefixes are omitted, since they are inferred from the `country` field.

The postal code for the associated address. Between 2 and 10 alphanumeric characters. For US-based addresses this must be 5 numeric digits.

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

ID number submitted by the user, currently used only for the Identity Verification product. If the user has not submitted this data yet, this field will be `null`. Otherwise, both fields are guaranteed to be filled.

Hide object

Value of the identity document typed in by the user. Alpha-numeric, with all formatting characters stripped. For specific format requirements by ID type, see [Input Validation Rules](https://plaid.com/docs/identity-verification/hybrid-input-validation/#id-numbers).

A globally unique and human readable ID type, specific to the country and document category. For more context on this field, see [Input Validation Rules](https://plaid.com/docs/identity-verification/hybrid-input-validation/#id-numbers).

Possible values: `ar_dni`, `au_drivers_license`, `au_passport`, `br_cpf`, `ca_sin`, `cl_run`, `cn_resident_card`, `co_nit`, `dk_cpr`, `eg_national_id`, `es_dni`, `es_nie`, `hk_hkid`, `in_pan`, `in_epic`, `it_cf`, `jo_civil_id`, `jp_my_number`, `ke_huduma_namba`, `kw_civil_id`, `mx_curp`, `mx_rfc`, `my_nric`, `ng_nin`, `nz_drivers_license`, `om_civil_id`, `ph_psn`, `pl_pesel`, `ro_cnp`, `sa_national_id`, `se_pin`, `sg_nric`, `tr_tc_kimlik`, `us_ssn`, `us_ssn_last_4`, `za_smart_id`

The status of this Identity Verification attempt.

`active` - The Identity Verification attempt is incomplete. The user may have completed part of the session, but has neither failed nor passed.

`success` - The Identity Verification attempt has completed, passing all steps defined to the associated Identity Verification template.

`failed` - The user failed one or more steps in the session and was told to contact support.

`expired` - The Identity Verification attempt was active for a long period of time without being completed and was automatically marked as expired. Note that sessions currently do not expire. Automatic expiration is expected to be enabled in the future.

`canceled` - The Identity Verification attempt was canceled, either via the dashboard by a user, or via API. The user may have completed part of the session, but has neither failed nor passed.

`pending_review` - The Identity Verification attempt template was configured to perform a screening that had one or more hits needing review.

Possible values: `active`, `success`, `failed`, `expired`, `canceled`, `pending_review`

Each step will be one of the following values:

`active` - This step is the user's current step. They are either in the process of completing this step, or they recently closed their Identity Verification attempt while in the middle of this step. Only one step will be marked as `active` at any given point.

`success` - The Identity Verification attempt has completed this step.

`failed` - The user failed this step. This can either cause the user to fail the session as a whole, or cause them to fall back to another step depending on how the Identity Verification template is configured. A failed step does not imply a failed session.

`waiting_for_prerequisite` - The user needs to complete another step first, before they progress to this step. This step may never run, depending on if the user fails an earlier step or if the step is only run as a fallback.

`not_applicable` - This step will not be run for this session.

`skipped` - The retry instructions that created this Identity Verification attempt specified that this step should be skipped.

`expired` - This step had not yet been completed when the Identity Verification attempt as a whole expired.

`canceled` - The Identity Verification attempt was canceled before the user completed this step.

`pending_review` - The Identity Verification attempt template was configured to perform a screening that had one or more hits needing review.

`manually_approved` - The step was manually overridden to pass by a team member in the dashboard.

`manually_rejected` - The step was manually overridden to fail by a team member in the dashboard.

Hide object

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

Data, images, analysis, and results from the `documentary_verification` step. This field will be `null` unless `steps.documentary_verification` has reached a terminal state of either `success` or `failed`.

Hide object

The outcome status for the associated Identity Verification attempt's `documentary_verification` step. This field will always have the same value as `steps.documentary_verification`.

An array of documents submitted to the `documentary_verification` step. Each entry represents one user submission, where each submission will contain both a front and back image, or just a front image, depending on the document type.

Note: Plaid will automatically let a user submit a new set of document images up to three times if we detect that a previous attempt might have failed due to user error. For example, if the first set of document images are blurry or obscured by glare, the user will be asked to capture their documents again, resulting in at least two separate entries within `documents`. If the overall `documentary_verification` is `failed`, the user has exhausted their retry attempts.

Hide object

An outcome status for this specific document submission. Distinct from the overall `documentary_verification.status` that summarizes the verification outcome from one or more documents.

Possible values: `success`, `failed`, `manually_approved`

The `attempt` field begins with 1 and increments with each subsequent document upload.

URLs for downloading original and cropped images for this document submission. The URLs are designed to only allow downloading, not hot linking, so the URL will only serve the document image for 60 seconds before expiring. The expiration time is 60 seconds after the `GET` request for the associated Identity Verification attempt. A new expiring URL is generated with each request, so you can always rerequest the Identity Verification attempt if one of your URLs expires.

Hide object

Temporary URL that expires after 60 seconds for downloading the uncropped original image of the front of the document.

Temporary URL that expires after 60 seconds for downloading the original image of the back of the document. Might be null if the back of the document was not collected.

Temporary URL that expires after 60 seconds for downloading a cropped image containing just the front of the document.

Temporary URL that expires after 60 seconds for downloading a cropped image containing just the back of the document. Might be null if the back of the document was not collected.

Temporary URL that expires after 60 seconds for downloading a crop of just the user's face from the document image. Might be null if the document does not contain a face photo.

Data extracted from a user-submitted document.

Hide object

Alpha-numeric ID number extracted via OCR from the user's document image.

The type of identity document detected in the images provided. Will always be one of the following values:

`drivers_license` - A driver's license issued by the associated country, establishing identity without any guarantee as to citizenship, and granting driving privileges

`id_card` - A general national identification card, distinct from driver's licenses as it only establishes identity

`passport` - A travel passport issued by the associated country for one of its citizens

`residence_permit_card` - An identity document issued by the associated country permitting a foreign citizen to *temporarily* reside there

`resident_card` - An identity document issued by the associated country permitting a foreign citizen to *permanently* reside there

`visa` - An identity document issued by the associated country permitting a foreign citizen entry for a short duration and for a specific purpose, typically no longer than 6 months

Note: This value may be different from the ID type that the user selects within Link. For example, if they select "Driver's License" but then submit a picture of a passport, this field will say `passport`

Possible values: `drivers_license`, `id_card`, `passport`, `residence_permit_card`, `resident_card`, `visa`

The expiration date of the document in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

The issue date of the document in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

A subdivision code. "Subdivision" is a generic term for "state", "province", "prefecture", "zone", etc. For the list of valid codes, see [country subdivision codes](https://plaid.com/documents/country_subdivision_codes.json). Country prefixes are omitted, since they are inferred from the `country` field.

A date extracted from the document in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

The address extracted from the document. The address must at least contain the following fields to be a valid address: `street`, `city`, `country`. If any are missing or unable to be extracted, the address will be null.

`region`, and `postal_code` may be null based on the addressing system. For example:

Addresses from the United Kingdom will not include a region

Addresses from Hong Kong will not include postal code

Note: Optical Character Recognition (OCR) technology may sometimes extract incorrect data from a document.

Hide object

The full street address extracted from the document.

City extracted from the document.

A subdivision code extracted from the document. Related terms would be "state", "province", "prefecture", "zone", "subdivision", etc. For a full list of valid codes, see [country subdivision codes](https://plaid.com/documents/country_subdivision_codes.json). Country prefixes are omitted, since they can be inferred from the `country` field.

The postal code extracted from the document. Between 2 and 10 alphanumeric characters. For US-based addresses this must be 5 numeric digits.

Valid, capitalized, two-letter ISO code representing the country extracted from the document. Must be in ISO 3166-1 alpha-2 form.

The individual's name extracted from the document.

Hide object

A string with at least one non-whitespace character, with a max length of 100 characters.

A string with at least one non-whitespace character, with a max length of 100 characters.

High level descriptions of how the associated document was processed. If a document fails verification, the details in the `analysis` object should help clarify why the document was rejected.

Hide object

High level summary of whether the document in the provided image matches the formatting rules and security checks for the associated jurisdiction.

For example, most identity documents have formatting rules like the following:

The image of the person's face must have a certain contrast in order to highlight skin tone

The subject in the document's image must remove eye glasses and pose in a certain way

The informational fields (name, date of birth, ID number, etc.) must be colored and aligned according to specific rules

Security features like watermarks and background patterns must be present

So a `match` status for this field indicates that the document in the provided image seems to conform to the various formatting and security rules associated with the detected document.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

A high level description of the quality of the image the user submitted.

For example, an image that is blurry, distorted by glare from a nearby light source, or improperly framed might be marked as low or medium quality. Poor quality images are more likely to fail OCR and/or template conformity checks.

Note: By default, Plaid will let a user recapture document images twice before failing the entire session if we attribute the failure to low image quality.

Possible values: `high`, `medium`, `low`

Analysis of the data extracted from the submitted document.

Hide object

A match summary describing the cross comparison between the subject's name, extracted from the document image, and the name they separately provided to the identity verification attempt.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

A match summary describing the cross comparison between the subject's date of birth, extracted from the document image, and the date of birth they separately provided to the identity verification attempt.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

A description of whether the associated document was expired when the verification was performed.

Note: In the case where an expiration date is not present on the document or failed to be extracted, this value will be `no_data`.

Possible values: `not_expired`, `expired`, `no_data`

A binary match indicator specifying whether the country that issued the provided document matches the country that the user separately provided to Plaid.

Note: You can configure whether a `no_match` on `issuing_country` fails the `documentary_verification` by editing your Plaid Template.

Possible values: `match`, `no_match`

Details about the fraud analysis performed on the document.

Hide object

Whether the submitted document type is supported for fraud analysis.

`success` - The document type is supported.

`failed` - The document type is not supported.

Possible values: `success`, `failed`

The outcome of the portrait presence check.

`success` - A portrait was detected.

`failed` - No portrait was detected.

Possible values: `success`, `failed`

The outcome of the portrait details check including photo embedding and face landmark checks.

`success` - The portrait passed all validity checks.

`failed` - The portrait did not pass one or more validity checks.

Possible values: `success`, `failed`

The outcome of the image composition check.

`success` - The image is a valid physical document capture.

`failed` - The image appears to be a photograph of a screen or a digital forgery.

Possible values: `success`, `failed`

The outcome of the integrity check for document security elements.

`success` - Data is consistent across all checked security elements.

`failed` - Inconsistencies were detected across one or more security elements.

Possible values: `success`, `failed`

The outcome of the document detail check for correct styling and layout.

`success` - The document passed all authenticity checks.

`failed` - The document did not pass one or more authenticity checks.

Possible values: `success`, `failed`

The outcome of the issue date validity check.

`success` - The issue date is valid.

`failed` - The issue date is invalid or could not be verified.

`no_data` - The check could not be performed due to insufficient data.

Possible values: `success`, `failed`, `no_data`

Details about the image quality of the document.

Hide object

The outcome of the glare check.

`success` - The image is free of glare.

`failed` - The image contains glare that may obscure document details.

Possible values: `success`, `failed`

The outcome of the dimensions check.

`success` - The image meets the minimum size and resolution requirements.

`failed` - The image does not meet the minimum size or resolution requirements.

Possible values: `success`, `failed`

The outcome of the blur check.

`success` - The image is sufficiently sharp.

`failed` - The image is too blurry for analysis.

Possible values: `success`, `failed`

Analyzed AAMVA data for the associated hit.

Note: This field is only available for U.S. driver's licenses issued by participating states.

Hide object

The overall outcome of checking the associated hit against the issuing state database.

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the associated hit against state databases.

`match` - The field is an exact match with the state database.

`partial_match` - The field is a partial match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the associated hit against state databases.

`match` - The field is an exact match with the state database.

`partial_match` - The field is a partial match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the associated hit against state databases.

`match` - The field is an exact match with the state database.

`partial_match` - The field is a partial match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

The outcome of checking the associated hit against state databases.

`match` - The field is an exact match with the state database.

`partial_match` - The field is a partial match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

The outcome of checking the associated hit against state databases.

`match` - The field is an exact match with the state database.

`partial_match` - The field is a partial match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

An ISO8601 formatted timestamp.

Format: `date-time`

Additional information for the `selfie_check` step. This field will be `null` unless `steps.selfie_check` has reached a terminal state of either `success` or `failed`.

Hide object

The outcome status for the associated Identity Verification attempt's `selfie_check` step. This field will always have the same value as `steps.selfie_check`.

Possible values: `success`, `failed`

An array of selfies submitted to the `selfie_check` step. Each entry represents one user submission.

Hide object

An outcome status for this specific selfie. Distinct from the overall `selfie_check.status` that summarizes the verification outcome from one or more selfies.

Possible values: `success`, `failed`

The `attempt` field begins with 1 and increments with each subsequent selfie upload.

The image or video capture of a selfie. Only one of `image_url` or `video_url` will be populated per selfie. In the vast majority of sessions Plaid records a short video of the user, so `video_url` is populated and `image_url` is `null`. `image_url` is only populated in the rare passive-liveness fallback case, where the user's device could not complete the standard video liveness capture (for example, a camera or streaming error) and submitted a single still image instead.

Hide object

Temporary URL for downloading a still-image selfie capture. This field is only populated when the session fell back to passive (image-based) liveness. For the majority of selfie checks this field is `null` and `video_url` is populated instead.

Temporary URL for downloading a video selfie capture. This is the standard selfie capture for Identity Verification. Plaid records a short video of the user during the Selfie Check liveness step, so this field is populated for the vast majority of selfie checks.

High level descriptions of how the associated selfie was processed. If a selfie fails verification, the details in the `analysis` object should help clarify why the selfie was rejected.

Hide object

Information about the comparison between the selfie and the document (if documentary verification also ran).

Possible values: `match`, `no_match`, `no_input`

Assessment of whether the selfie capture is of a real human being, as opposed to a picture of a human on a screen, a picture of a paper cut out, someone wearing a mask, or a deepfake.

Possible values: `success`, `failed`

Age-estimation results from the selfie capture. This field is `null` when an age range could not be estimated from the selfie capture.

Hide object

An enum indicating whether the reported age aligns with the estimated selfie capture age range.

`match` indicates that the reported age falls within the estimated selfie capture age range.

`warning` indicates that the reported age falls outside the estimated selfie capture age range, but is close enough that the result should be reviewed.

`no_match` indicates that the reported age falls far outside the estimated selfie capture age range.

`no_data` indicates that there was not enough data available at age-estimation time to compare the reported age against the estimated selfie capture age range.

Possible values: `match`, `warning`, `no_match`, `no_data`

The user's age at the time of the selfie capture, calculated from the date of birth submitted during Identity Verification. If multiple date of birth sources are available, the date of birth submitted in the flow session takes priority over the document date of birth. This field is `null` when the date of birth is unavailable.

Lower bound of the estimated age range from the selfie capture.

Upper bound of the estimated age range from the selfie capture.

Additional information for the `kyc_check` (Data Source Verification) step. This field will be `null` unless `steps.kyc_check` has reached a terminal state of either `success` or `failed`.

Hide object

The outcome status for the associated Identity Verification attempt's `kyc_check` step. This field will always have the same value as `steps.kyc_check`.

Result summary object specifying how the `address` field matched.

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Field describing whether the associated address is a post office box. Will be `yes` when a P.O. box is detected, `no` when Plaid confirmed the address is not a P.O. box, and `no_data` when Plaid was not able to determine if the address is a P.O. box.

Possible values: `yes`, `no`, `no_data`

Field describing whether the associated address is being used for commercial or residential purposes.

Note: This value will be `no_data` when Plaid does not have sufficient data to determine the address's use.

Possible values: `residential`, `commercial`, `no_data`

Result summary object specifying how the `name` field matched.

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Result summary object specifying how the `date_of_birth` field matched.

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Result summary object specifying how the `id_number` field matched.

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Result summary object specifying how the `phone` field matched.

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Additional information for the `risk_check` step.

Hide object

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

Result summary object specifying values for `behavior` attributes of risk check, when available.

Hide object

Field describing the overall user interaction signals of a behavior risk check. This value represents how familiar the user is with the personal data they provide, based on a number of signals that are collected during their session.

`genuine` indicates the user has high familiarity with the data they are providing, and that fraud is unlikely.

`neutral` indicates some signals are present in between `risky` and `genuine`, but there are not enough clear signals to determine an outcome.

`risky` indicates the user has low familiarity with the data they are providing, and that fraud is likely.

`no_data` indicates there is not sufficient information to give an accurate signal.

Possible values: `genuine`, `neutral`, `risky`, `no_data`

Field describing the outcome of a fraud ring behavior risk check.

`yes` indicates that fraud ring activity was detected.

`no` indicates that fraud ring activity was not detected.

`no_data` indicates there was not enough information available to give an accurate signal.

Possible values: `yes`, `no`, `no_data`

Field describing the outcome of a bot detection behavior risk check.

`yes` indicates that automated activity was detected.

`no` indicates that automated activity was not detected.

`no_data` indicates there was not enough information available to give an accurate signal.

Possible values: `yes`, `no`, `no_data`

Result summary object specifying values for `email` attributes of risk check.

Hide object

SMTP-MX check to confirm the email address exists if known.

Possible values: `yes`, `no`, `no_data`

Count of all known breaches of this email address if known.

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

Indicates whether the email address domain is a free provider such as Gmail or Hotmail if known.

Possible values: `yes`, `no`, `no_data`

Indicates whether the email address domain is custom if known, i.e. a company domain and not free or disposable.

Possible values: `yes`, `no`, `no_data`

Indicates whether the email domain is listed as disposable if known. Disposable domains are often used to create email addresses that are part of a fake set of user details.

Possible values: `yes`, `no`, `no_data`

Indicates whether the email address top level domain, which is the last part of the domain, is fraudulent or risky if known. In most cases, a suspicious top level domain is also associated with a disposable or high-risk domain.

Possible values: `yes`, `no`, `no_data`

Indicates whether the email address domain is an educational institution domain if known.

Possible values: `yes`, `no`, `no_data`

Indicates whether the email address includes the date of birth or year of birth if known.

Possible values: `yes`, `no`, `no_data`

Indicates whether the provided name matches the email address according to the KYC name-matches-email inference result if known.

`match` - "The email's name identifiers match the user's name."

`partial_match` - "The email's name identifiers partially match the user's name."

`no_match` - "The email's name identifiers do not match the user's name."

`indeterminate` - "The email does not contain any name identifiers, and a match could not be determined."

`no_input` - "The user's profile does not contain the required user inputs to determine a match."

`no_data` - "Field could not be verified against available sources."

Possible values: `no_input`, `indeterminate`, `no_match`, `partial_match`, `match`, `no_data`

A list of online services where this email address has been detected to have accounts or other activity.

Possible values: `aboutme`, `adobe`, `adult_sites`, `airbnb`, `altbalaji`, `amazon`, `apple`, `archiveorg`, `atlassian`, `bitmoji`, `bodybuilding`, `booking`, `bukalapak`, `codecademy`, `deliveroo`, `diigo`, `discord`, `disneyplus`, `duolingo`, `ebay`, `envato`, `eventbrite`, `evernote`, `facebook`, `firefox`, `flickr`, `flipkart`, `foursquare`, `freelancer`, `gaana`, `giphy`, `github`, `google`, `gravatar`, `hubspot`, `imgur`, `instagram`, `jdid`, `kakao`, `kommo`, `komoot`, `lastfm`, `lazada`, `line`, `linkedin`, `mailru`, `microsoft`, `myspace`, `netflix`, `nike`, `ok`, `patreon`, `pinterest`, `plurk`, `quora`, `qzone`, `rambler`, `rappi`, `replit`, `samsung`, `seoclerks`, `shopclues`, `skype`, `snapchat`, `snapdeal`, `soundcloud`, `spotify`, `starz`, `strava`, `taringa`, `telegram`, `tiki`, `tokopedia`, `treehouse`, `tumblr`, `twitter`, `venmo`, `viber`, `vimeo`, `vivino`, `vkontakte`, `wattpad`, `weibo`, `whatsapp`, `wordpress`, `xing`, `yahoo`, `yandex`, `zalo`, `zoho`

Result summary object specifying values for `phone` attributes of risk check.

Hide object

A list of online services where this phone number has been detected to have accounts or other activity.

Possible values: `aboutme`, `adobe`, `adult_sites`, `airbnb`, `altbalaji`, `amazon`, `apple`, `archiveorg`, `atlassian`, `bitmoji`, `bodybuilding`, `booking`, `bukalapak`, `codecademy`, `deliveroo`, `diigo`, `discord`, `disneyplus`, `duolingo`, `ebay`, `envato`, `eventbrite`, `evernote`, `facebook`, `firefox`, `flickr`, `flipkart`, `foursquare`, `freelancer`, `gaana`, `giphy`, `github`, `google`, `gravatar`, `hubspot`, `imgur`, `instagram`, `jdid`, `kakao`, `kommo`, `komoot`, `lastfm`, `lazada`, `line`, `linkedin`, `mailru`, `microsoft`, `myspace`, `netflix`, `nike`, `ok`, `patreon`, `pinterest`, `plurk`, `quora`, `qzone`, `rambler`, `rappi`, `replit`, `samsung`, `seoclerks`, `shopclues`, `skype`, `snapchat`, `snapdeal`, `soundcloud`, `spotify`, `starz`, `strava`, `taringa`, `telegram`, `tiki`, `tokopedia`, `treehouse`, `tumblr`, `twitter`, `venmo`, `viber`, `vimeo`, `vivino`, `vkontakte`, `wattpad`, `weibo`, `whatsapp`, `wordpress`, `xing`, `yahoo`, `yandex`, `zalo`, `zoho`

Array of result summary objects specifying values for `device` attributes of risk check.

Hide object

An enum indicating whether a network proxy is present and if so what type it is.

`none_detected` indicates the user is not on a detectable proxy network.

`tor` indicates the user was using a Tor browser, which sends encrypted traffic on a decentralized network and is somewhat similar to a VPN (Virtual Private Network).

`vpn` indicates the user is on a VPN (Virtual Private Network)

`web_proxy` indicates the user is on a web proxy server, which may allow them to conceal information such as their IP address or other identifying information.

`public_proxy` indicates the user is on a public web proxy server, which is similar to a web proxy but can be shared by multiple users. This may allow multiple users to appear as if they have the same IP address for instance.

Possible values: `none_detected`, `tor`, `vpn`, `web_proxy`, `public_proxy`

Count of spam lists the IP address is associated with if known.

UTC offset of the timezone associated with the IP address.

Result summary object capturing abuse signals related to `identity abuse`, e.g. stolen and synthetic identity fraud. These attributes are only available for US identities and some signals may not be available depending on what information was collected.

Hide object

Field containing the data used in determining the outcome of the synthetic identity risk check.

Contains the following fields:

`score` - A score from 0 to 100 indicating the likelihood that the user is a synthetic identity.

Hide object

A score from 0 to 100 indicating the likelihood that the user is a synthetic identity.

Field containing the data used in determining the outcome of the stolen identity risk check.

Contains the following fields:

`score` - A score from 0 to 100 indicating the likelihood that the user is a stolen identity.

Hide object

A score from 0 to 100 indicating the likelihood that the user is a stolen identity.

The attributes related to the facial duplicates captured in risk check.

Hide object

ID of the associated Identity Verification attempt.

Similarity score of the match. Ranges from 0 to 100.

Whether this match occurred after the session was complete. For example, this would be `true` if a later session ended up matching this one.

The trust index score for the `risk_check` step.

Additional information for the `verify_sms` step.

Hide object

The outcome status for the associated Identity Verification attempt's `verify_sms` step. This field will always have the same value as `steps.verify_sms`.

Possible values: `success`, `failed`

An array where each entry represents a verification attempt for the `verify_sms` step. Each entry represents one user-submitted phone number. Phone number edits, and in some cases error handling due to edge cases like rate limiting, may generate additional verifications.

Hide object

The outcome status for the individual SMS verification.

Possible values: `pending`, `success`, `failed`, `canceled`

The attempt field begins with 1 and increments with each subsequent SMS verification.

A phone number in E.164 format.

The number of delivery attempts made within the verification to send the SMS code to the user. Each delivery attempt represents the user taking action from the front end UI to request creation and delivery of a new SMS verification code, or to resend an existing SMS verification code. There is a limit of 3 delivery attempts per verification.

The number of attempts made by the user within the verification to verify the SMS code by entering it into the front end UI. There is a limit of 3 solve attempts per verification.

An ISO8601 formatted timestamp.

Format: `date-time`

An ISO8601 formatted timestamp.

Format: `date-time`

An ISO8601 formatted timestamp.

Format: `date-time`

ID of the associated screening.

ID of the associated Beacon User.

Unique user identifier, created by calling `/user/create`. Either a `user_id` or the `client_user_id` must be provided. The `user_id` may only be used instead of the `client_user_id` if you were not a pre-existing user of `/user/create` as of December 10, 2025, or if you have since [migrated to the new User APIs](https://plaid.com/docs/api/users/migrate-to-new-user-apis); for more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis). If both this field and a `client_user_id` are present in a request, the `user_id` must have been created from the provided `client_user_id`.

An ISO8601 formatted timestamp.

Format: `date-time`

Information about a Protect event including Trust Index score and fraud attributes.

Hide object

The event ID.

The timestamp of the event, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format, e.g. `"2017-09-14T14:42:19.350Z"`

Format: `date-time`

Represents a calculated Trust Index Score.

Hide object

The overall trust index score.

The versioned name of the Trust Index model used for scoring.

Contains sub-score metadata.

Hide object

Represents Trust Index Subscore.

Hide object

The subscore score.

Represents Trust Index Subscore.

Hide object

The subscore score.

Event fraud attributes as an arbitrary set of key-value pairs. The set of attributes returned varies by model.

An identifier that determines which page of results you receive.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "identity_verifications": [
    {
      "id": "idv_52xR9LKo77r1Np",
      "client_user_id": "your-db-id-3b24110",
      "created_at": "2020-07-24T03:26:02Z",
      "completed_at": "2020-07-24T03:26:02Z",
      "previous_attempt_id": "idv_42cF1MNo42r9Xj",
      "shareable_url": "https://flow.plaid.com/verify/idv_4FrXJvfQU3zGUR?key=e004115db797f7cc3083bff3167cba30644ef630fb46f5b086cde6cc3b86a36f",
      "template": {
        "id": "idvtmp_4FrXJvfQU3zGUR",
        "version": 2
      },
      "user": {
        "phone_number": "+12345678909",
        "date_of_birth": "1990-05-29",
        "ip_address": "192.0.2.42",
        "email_address": "user@example.com",
        "name": {
          "given_name": "Leslie",
          "family_name": "Knope"
        },
        "address": {
          "street": "123 Main St.",
          "street2": "Unit 42",
          "city": "Pawnee",
          "region": "IN",
          "postal_code": "46001",
          "country": "US"
        },
        "id_number": {
          "value": "123456789",
          "type": "us_ssn"
        }
      },
      "status": "success",
      "steps": {
        "accept_tos": "success",
        "verify_sms": "success",
        "kyc_check": "success",
        "documentary_verification": "success",
        "selfie_check": "success",
        "watchlist_screening": "success",
        "risk_check": "success"
      },
      "documentary_verification": {
        "status": "success",
        "documents": [
          {
            "status": "success",
            "attempt": 1,
            "images": {
              "original_front": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/documents/1/original_front.jpeg",
              "original_back": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/documents/1/original_back.jpeg",
              "cropped_front": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/documents/1/cropped_front.jpeg",
              "cropped_back": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/documents/1/cropped_back.jpeg",
              "face": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/documents/1/face.jpeg"
            },
            "extracted_data": {
              "id_number": "AB123456",
              "category": "drivers_license",
              "expiration_date": "2030-05-29",
              "issue_date": "2020-05-29",
              "issuing_country": "US",
              "issuing_region": "IN",
              "date_of_birth": "1990-05-29",
              "address": {
                "street": "123 Main St. Unit 42",
                "city": "Pawnee",
                "region": "IN",
                "postal_code": "46001",
                "country": "US"
              },
              "name": {
                "given_name": "Leslie",
                "family_name": "Knope"
              }
            },
            "analysis": {
              "authenticity": "match",
              "image_quality": "high",
              "extracted_data": {
                "name": "match",
                "date_of_birth": "match",
                "expiration_date": "not_expired",
                "issuing_country": "match"
              },
              "aamva_verification": {
                "is_verified": true,
                "id_number": "match",
                "id_issue_date": "match",
                "id_expiration_date": "match",
                "street": "match",
                "city": "match",
                "postal_code": "match",
                "date_of_birth": "match",
                "gender": "match",
                "height": "match",
                "eye_color": "match",
                "first_name": "match",
                "middle_name": "match",
                "last_name": "match"
              },
              "fraud_analysis_details": {
                "type_supported": "success",
                "portrait_presence_check": "success",
                "portrait_details_check": "success",
                "image_composition_check": "success",
                "integrity_check": "success",
                "detail_check": "success",
                "issue_date_check": "success"
              },
              "image_quality_details": {
                "glare_check": "success",
                "blur_check": "success",
                "dimensions_check": "success"
              }
            },
            "redacted_at": "2020-07-24T03:26:02Z"
          }
        ]
      },
      "selfie_check": {
        "status": "success",
        "selfies": [
          {
            "status": "success",
            "attempt": 1,
            "capture": {
              "image_url": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/selfie/liveness.jpeg",
              "video_url": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/selfie/liveness.webm"
            },
            "analysis": {
              "document_comparison": "match",
              "liveness_check": "success",
              "age_check": {
                "status": "match",
                "reported_age": 36,
                "age_estimate_lower_bound": 32,
                "age_estimate_upper_bound": 38
              }
            }
          }
        ]
      },
      "kyc_check": {
        "status": "success",
        "address": {
          "summary": "match",
          "po_box": "yes",
          "type": "residential"
        },
        "name": {
          "summary": "match"
        },
        "date_of_birth": {
          "summary": "match"
        },
        "id_number": {
          "summary": "match"
        },
        "phone_number": {
          "summary": "match",
          "area_code": "match"
        }
      },
      "risk_check": {
        "status": "success",
        "behavior": {
          "user_interactions": "risky",
          "fraud_ring_detected": "yes",
          "bot_detected": "yes"
        },
        "email": {
          "is_deliverable": "yes",
          "breach_count": 1,
          "first_breached_at": "1990-05-29",
          "last_breached_at": "1990-05-29",
          "domain_registered_at": "1990-05-29",
          "domain_is_free_provider": "yes",
          "domain_is_custom": "yes",
          "domain_is_disposable": "yes",
          "top_level_domain_is_suspicious": "yes",
          "is_edu": "yes",
          "includes_date_of_birth": "yes",
          "name": "match",
          "linked_services": [
            "apple"
          ]
        },
        "phone": {
          "linked_services": [
            "apple"
          ]
        },
        "devices": [
          {
            "ip_proxy_type": "none_detected",
            "ip_spam_list_count": 1,
            "ip_timezone_offset": "+06:00:00"
          }
        ],
        "identity_abuse_signals": {
          "synthetic_identity": {
            "score": 0
          },
          "stolen_identity": {
            "score": 0
          }
        },
        "facial_duplicates": [
          {
            "id": "idv_52xR9LKo77r1Np",
            "similarity": 95,
            "matched_after_completed": true
          }
        ],
        "trust_index_score": 86
      },
      "verify_sms": {
        "status": "success",
        "verifications": [
          {
            "status": "success",
            "attempt": 1,
            "phone_number": "+12345678909",
            "delivery_attempt_count": 1,
            "solve_attempt_count": 1,
            "initially_sent_at": "2020-07-24T03:26:02Z",
            "last_sent_at": "2020-07-24T03:26:02Z",
            "redacted_at": "2020-07-24T03:26:02Z"
          }
        ]
      },
      "watchlist_screening_id": "scr_52xR9LKo77r1Np",
      "beacon_user_id": "becusr_42cF1MNo42r9Xj",
      "user_id": "usr_dddAs9ewdcDQQQ",
      "redacted_at": "2020-07-24T03:26:02Z",
      "latest_scored_protect_event": {
        "event_id": "ptevt_7AJYTMFxRUgJ",
        "timestamp": "2020-07-24T03:26:02Z",
        "trust_index": {
          "score": 86,
          "model": "trust_index.2.0.0",
          "subscores": {
            "device_and_connection": {
              "score": 87
            },
            "bank_account_insights": {
              "score": 85
            }
          }
        },
        "fraud_attributes": {
          "fraud_attributes": {
            "link_session.linked_bank_accounts.user_pi_matches_owners": true,
            "link_session.linked_bank_accounts.connected_apps.days_since_first_connection": 582,
            "session.challenged_with_mfa": false,
            "user.bank_accounts.num_of_frozen_or_restricted_accounts": 0,
            "user.linked_bank_accounts.num_family_names": 1,
            "user.linked_bank_accounts.num_of_connected_banks": 1,
            "user.link_sessions.days_since_first_link_session": 150,
            "user.pi.email.history_yrs": 7.03,
            "user.pi.email.num_social_networks_linked": 12,
            "user.pi.ssn.user_likely_has_better_ssn": false
          }
        }
      }
    }
  ],
  "next_cursor": "eyJkaXJlY3Rpb24iOiJuZXh0Iiwib2Zmc2V0IjoiMTU5NDM",
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/identity_verification/retry`](/docs/api/products/identity-verification/#identity_verificationretry)

[#### Retry an Identity Verification](/docs/api/products/identity-verification/#retry-an-identity-verification)

Allow a customer to retry their Identity Verification

/identity\_verification/retry

**Request fields**

Collapse all

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

ID of the associated Identity Verification template. Like all Plaid identifiers, this is case-sensitive.

An instruction specifying what steps the new Identity Verification attempt should require the user to complete:

`reset` - Restart the user at the beginning of the session, regardless of whether they successfully completed part of their previous session.

`incomplete` - Start the new session at the step that the user failed in the previous session, skipping steps that have already been successfully completed.

`infer` - If the most recent Identity Verification attempt associated with the given `client_user_id` has a status of `failed` or `expired`, retry using the `incomplete` strategy. Otherwise, use the `reset` strategy.

`custom` - Start the new session with a custom configuration, specified by the value of the `steps` field

Note:

The `incomplete` strategy cannot be applied if the session's failing step is `screening` or `risk_check`.

The `infer` strategy cannot be applied if the session's status is still `active`

Possible values: `reset`, `incomplete`, `infer`, `custom`

User information collected outside of Link, most likely via your own onboarding process.

Each of the following identity fields are optional:

`email_address`

`phone_number`

`date_of_birth`

`name`

`address`

`id_number`

Specifically, these fields are optional in that they can either be fully provided (satisfying every required field in their subschema) or omitted from the request entirely by not providing the key or value.
Providing these fields via the API will result in Link skipping the data collection process for the associated user. All verification steps enabled in the associated Identity Verification Template will still be run. Verification steps will either be run immediately, or once the user completes the `accept_tos` step, depending on the value provided to the `gave_consent` field.

Hide object

A valid email address. Must not have leading or trailing spaces and address must be RFC compliant. For more information, see [RFC 3696](https://datatracker.ietf.org/doc/html/rfc3696).

Format: `email`

A valid phone number in E.164 format.

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

You can use this field to pre-populate the user's legal name; if it is provided here, they will not be prompted to enter their name in the identity verification attempt.

Hide object

A string with at least one non-whitespace character, with a max length of 100 characters.

A string with at least one non-whitespace character, with a max length of 100 characters.

Home address for the user. Supported values are: not provided, address with only country code or full address.

For more context on this field, see [Input Validation by Country](https://plaid.com/docs/identity-verification/hybrid-input-validation/#input-validation-by-country).

Hide object

The primary street portion of an address. If an address is provided, this field will always be filled. A string with at least one non-whitespace alphabetical character, with a max length of 80 characters.

Extra street information, like an apartment or suite number. If provided, a string with at least one non-whitespace character, with a max length of 50 characters.

City from the address. A string with at least one non-whitespace alphabetical character, with a max length of 100 characters.

A subdivision code. "Subdivision" is a generic term for "state", "province", "prefecture", "zone", etc. For the list of valid codes, see [country subdivision codes](https://plaid.com/documents/country_subdivision_codes.json). Country prefixes are omitted, since they are inferred from the `country` field.

The postal code for the associated address. Between 2 and 10 alphanumeric characters. For US-based addresses this must be 5 numeric digits.

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

ID number submitted by the user, currently used only for the Identity Verification product. If the user has not submitted this data yet, this field will be `null`. Otherwise, both fields are guaranteed to be filled.

Hide object

Value of the identity document typed in by the user. Alpha-numeric, with all formatting characters stripped. For specific format requirements by ID type, see [Input Validation Rules](https://plaid.com/docs/identity-verification/hybrid-input-validation/#id-numbers).

A globally unique and human readable ID type, specific to the country and document category. For more context on this field, see [Input Validation Rules](https://plaid.com/docs/identity-verification/hybrid-input-validation/#id-numbers).

Possible values: `ar_dni`, `au_drivers_license`, `au_passport`, `br_cpf`, `ca_sin`, `cl_run`, `cn_resident_card`, `co_nit`, `dk_cpr`, `eg_national_id`, `es_dni`, `es_nie`, `hk_hkid`, `in_pan`, `in_epic`, `it_cf`, `jo_civil_id`, `jp_my_number`, `ke_huduma_namba`, `kw_civil_id`, `mx_curp`, `mx_rfc`, `my_nric`, `ng_nin`, `nz_drivers_license`, `om_civil_id`, `ph_psn`, `pl_pesel`, `ro_cnp`, `sa_national_id`, `se_pin`, `sg_nric`, `tr_tc_kimlik`, `us_ssn`, `us_ssn_last_4`, `za_smart_id`

Instructions for the `custom` retry strategy specifying which steps should be required or skipped.

Note:

This field must be provided when the retry strategy is `custom` and must be omitted otherwise.

Custom retries override settings in your Plaid Template. For example, if your Plaid Template has `verify_sms` disabled, a custom retry with `verify_sms` enabled will still require the step.

The `selfie_check` step is currently not supported on the sandbox server. Sandbox requests will silently disable the `selfie_check` step when provided.

Hide object

A boolean field specifying whether the new session should require or skip the `verify_sms` step.

A boolean field specifying whether the new session should require or skip the `kyc_check` (Data Source Verification) step.

A boolean field specifying whether the new session should require or skip the `documentary_verification` step.

A boolean field specifying whether the new session should require or skip the `selfie_check` step. If a previous session has already passed the `selfie_check` step, the new selfie check will be a Selfie Reauthentication check, in which the selfie is tested for liveness and for consistency with the previous selfie.

A flag specifying whether you would like Plaid to expose a shareable URL for the verification being retried. If a value for this flag is not specified, the `is_shareable` setting from the original verification attempt will be used.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

/identity\_verification/retry

Nodeâ¼

```
const request: IdentityVerificationRetryRequest = {
  client_user_id: 'user-sandbox-b0e2c4ee-a763-4df5-bfe9-46a46bce993d',
  template_id: 'idvtmp_52xR9LKo77r1Np',
  strategy: 'reset',
  user: {
    email_address: 'acharleston@email.com',
    phone_number: '+12345678909',
    date_of_birth: '1975-01-18',
    name: {
      given_name: 'Anna',
      family_name: 'Charleston',
    },
    address: {
      street: '100 Market Street',
      street2: 'Apt 1A',
      city: 'San Francisco',
      region: 'CA',
      postal_code: '94103',
      country: 'US',
    },
    id_number: {
      value: '123456789',
      type: 'us_ssn',
    },
  },
};
try {
  const response = await plaidClient.identityVerificationRetry(request);
} catch (error) {
  // handle error
}
```

/identity\_verification/retry

**Response fields**

Collapse all

ID of the associated Identity Verification attempt.

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

An ISO8601 formatted timestamp.

Format: `date-time`

An ISO8601 formatted timestamp.

Format: `date-time`

The ID for the Identity Verification preceding this session. This field will only be filled if the current Identity Verification is a retry of a previous attempt.

A shareable URL that can be sent directly to the user to complete verification

The resource ID and version number of the template configuring the behavior of a given Identity Verification.

Hide object

ID of the associated Identity Verification template. Like all Plaid identifiers, this is case-sensitive.

Version of the associated Identity Verification template.

The identity data that was either collected from the user or provided via API in order to perform an Identity Verification.

Hide object

A valid phone number in E.164 format.

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

An IPv4 or IPv6 address.

A valid email address. Must not have leading or trailing spaces and address must be RFC compliant. For more information, see [RFC 3696](https://datatracker.ietf.org/doc/html/rfc3696).

Format: `email`

The full name provided by the user. If the user has not submitted their name, this field will be null. Otherwise, both fields are guaranteed to be filled.

Hide object

A string with at least one non-whitespace character, with a max length of 100 characters.

A string with at least one non-whitespace character, with a max length of 100 characters.

Even if an address has been collected, some fields may be null depending on the region's addressing system. For example:

Addresses from the United Kingdom will not include a region

Addresses from Hong Kong will not include postal code

Hide object

The primary street portion of an address. If an address is provided, this field will always be filled. A string with at least one non-whitespace alphabetical character, with a max length of 80 characters.

Extra street information, like an apartment or suite number. If provided, a string with at least one non-whitespace character, with a max length of 50 characters.

City from the address. A string with at least one non-whitespace alphabetical character, with a max length of 100 characters.

A subdivision code. "Subdivision" is a generic term for "state", "province", "prefecture", "zone", etc. For the list of valid codes, see [country subdivision codes](https://plaid.com/documents/country_subdivision_codes.json). Country prefixes are omitted, since they are inferred from the `country` field.

The postal code for the associated address. Between 2 and 10 alphanumeric characters. For US-based addresses this must be 5 numeric digits.

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

ID number submitted by the user, currently used only for the Identity Verification product. If the user has not submitted this data yet, this field will be `null`. Otherwise, both fields are guaranteed to be filled.

Hide object

Value of the identity document typed in by the user. Alpha-numeric, with all formatting characters stripped. For specific format requirements by ID type, see [Input Validation Rules](https://plaid.com/docs/identity-verification/hybrid-input-validation/#id-numbers).

A globally unique and human readable ID type, specific to the country and document category. For more context on this field, see [Input Validation Rules](https://plaid.com/docs/identity-verification/hybrid-input-validation/#id-numbers).

Possible values: `ar_dni`, `au_drivers_license`, `au_passport`, `br_cpf`, `ca_sin`, `cl_run`, `cn_resident_card`, `co_nit`, `dk_cpr`, `eg_national_id`, `es_dni`, `es_nie`, `hk_hkid`, `in_pan`, `in_epic`, `it_cf`, `jo_civil_id`, `jp_my_number`, `ke_huduma_namba`, `kw_civil_id`, `mx_curp`, `mx_rfc`, `my_nric`, `ng_nin`, `nz_drivers_license`, `om_civil_id`, `ph_psn`, `pl_pesel`, `ro_cnp`, `sa_national_id`, `se_pin`, `sg_nric`, `tr_tc_kimlik`, `us_ssn`, `us_ssn_last_4`, `za_smart_id`

The status of this Identity Verification attempt.

`active` - The Identity Verification attempt is incomplete. The user may have completed part of the session, but has neither failed nor passed.

`success` - The Identity Verification attempt has completed, passing all steps defined to the associated Identity Verification template.

`failed` - The user failed one or more steps in the session and was told to contact support.

`expired` - The Identity Verification attempt was active for a long period of time without being completed and was automatically marked as expired. Note that sessions currently do not expire. Automatic expiration is expected to be enabled in the future.

`canceled` - The Identity Verification attempt was canceled, either via the dashboard by a user, or via API. The user may have completed part of the session, but has neither failed nor passed.

`pending_review` - The Identity Verification attempt template was configured to perform a screening that had one or more hits needing review.

Possible values: `active`, `success`, `failed`, `expired`, `canceled`, `pending_review`

Each step will be one of the following values:

`active` - This step is the user's current step. They are either in the process of completing this step, or they recently closed their Identity Verification attempt while in the middle of this step. Only one step will be marked as `active` at any given point.

`success` - The Identity Verification attempt has completed this step.

`failed` - The user failed this step. This can either cause the user to fail the session as a whole, or cause them to fall back to another step depending on how the Identity Verification template is configured. A failed step does not imply a failed session.

`waiting_for_prerequisite` - The user needs to complete another step first, before they progress to this step. This step may never run, depending on if the user fails an earlier step or if the step is only run as a fallback.

`not_applicable` - This step will not be run for this session.

`skipped` - The retry instructions that created this Identity Verification attempt specified that this step should be skipped.

`expired` - This step had not yet been completed when the Identity Verification attempt as a whole expired.

`canceled` - The Identity Verification attempt was canceled before the user completed this step.

`pending_review` - The Identity Verification attempt template was configured to perform a screening that had one or more hits needing review.

`manually_approved` - The step was manually overridden to pass by a team member in the dashboard.

`manually_rejected` - The step was manually overridden to fail by a team member in the dashboard.

Hide object

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

Data, images, analysis, and results from the `documentary_verification` step. This field will be `null` unless `steps.documentary_verification` has reached a terminal state of either `success` or `failed`.

Hide object

The outcome status for the associated Identity Verification attempt's `documentary_verification` step. This field will always have the same value as `steps.documentary_verification`.

An array of documents submitted to the `documentary_verification` step. Each entry represents one user submission, where each submission will contain both a front and back image, or just a front image, depending on the document type.

Note: Plaid will automatically let a user submit a new set of document images up to three times if we detect that a previous attempt might have failed due to user error. For example, if the first set of document images are blurry or obscured by glare, the user will be asked to capture their documents again, resulting in at least two separate entries within `documents`. If the overall `documentary_verification` is `failed`, the user has exhausted their retry attempts.

Hide object

An outcome status for this specific document submission. Distinct from the overall `documentary_verification.status` that summarizes the verification outcome from one or more documents.

Possible values: `success`, `failed`, `manually_approved`

The `attempt` field begins with 1 and increments with each subsequent document upload.

URLs for downloading original and cropped images for this document submission. The URLs are designed to only allow downloading, not hot linking, so the URL will only serve the document image for 60 seconds before expiring. The expiration time is 60 seconds after the `GET` request for the associated Identity Verification attempt. A new expiring URL is generated with each request, so you can always rerequest the Identity Verification attempt if one of your URLs expires.

Hide object

Temporary URL that expires after 60 seconds for downloading the uncropped original image of the front of the document.

Temporary URL that expires after 60 seconds for downloading the original image of the back of the document. Might be null if the back of the document was not collected.

Temporary URL that expires after 60 seconds for downloading a cropped image containing just the front of the document.

Temporary URL that expires after 60 seconds for downloading a cropped image containing just the back of the document. Might be null if the back of the document was not collected.

Temporary URL that expires after 60 seconds for downloading a crop of just the user's face from the document image. Might be null if the document does not contain a face photo.

Data extracted from a user-submitted document.

Hide object

Alpha-numeric ID number extracted via OCR from the user's document image.

The type of identity document detected in the images provided. Will always be one of the following values:

`drivers_license` - A driver's license issued by the associated country, establishing identity without any guarantee as to citizenship, and granting driving privileges

`id_card` - A general national identification card, distinct from driver's licenses as it only establishes identity

`passport` - A travel passport issued by the associated country for one of its citizens

`residence_permit_card` - An identity document issued by the associated country permitting a foreign citizen to *temporarily* reside there

`resident_card` - An identity document issued by the associated country permitting a foreign citizen to *permanently* reside there

`visa` - An identity document issued by the associated country permitting a foreign citizen entry for a short duration and for a specific purpose, typically no longer than 6 months

Note: This value may be different from the ID type that the user selects within Link. For example, if they select "Driver's License" but then submit a picture of a passport, this field will say `passport`

Possible values: `drivers_license`, `id_card`, `passport`, `residence_permit_card`, `resident_card`, `visa`

The expiration date of the document in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

The issue date of the document in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

A subdivision code. "Subdivision" is a generic term for "state", "province", "prefecture", "zone", etc. For the list of valid codes, see [country subdivision codes](https://plaid.com/documents/country_subdivision_codes.json). Country prefixes are omitted, since they are inferred from the `country` field.

A date extracted from the document in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

The address extracted from the document. The address must at least contain the following fields to be a valid address: `street`, `city`, `country`. If any are missing or unable to be extracted, the address will be null.

`region`, and `postal_code` may be null based on the addressing system. For example:

Addresses from the United Kingdom will not include a region

Addresses from Hong Kong will not include postal code

Note: Optical Character Recognition (OCR) technology may sometimes extract incorrect data from a document.

Hide object

The full street address extracted from the document.

City extracted from the document.

A subdivision code extracted from the document. Related terms would be "state", "province", "prefecture", "zone", "subdivision", etc. For a full list of valid codes, see [country subdivision codes](https://plaid.com/documents/country_subdivision_codes.json). Country prefixes are omitted, since they can be inferred from the `country` field.

The postal code extracted from the document. Between 2 and 10 alphanumeric characters. For US-based addresses this must be 5 numeric digits.

Valid, capitalized, two-letter ISO code representing the country extracted from the document. Must be in ISO 3166-1 alpha-2 form.

The individual's name extracted from the document.

Hide object

A string with at least one non-whitespace character, with a max length of 100 characters.

A string with at least one non-whitespace character, with a max length of 100 characters.

High level descriptions of how the associated document was processed. If a document fails verification, the details in the `analysis` object should help clarify why the document was rejected.

Hide object

High level summary of whether the document in the provided image matches the formatting rules and security checks for the associated jurisdiction.

For example, most identity documents have formatting rules like the following:

The image of the person's face must have a certain contrast in order to highlight skin tone

The subject in the document's image must remove eye glasses and pose in a certain way

The informational fields (name, date of birth, ID number, etc.) must be colored and aligned according to specific rules

Security features like watermarks and background patterns must be present

So a `match` status for this field indicates that the document in the provided image seems to conform to the various formatting and security rules associated with the detected document.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

A high level description of the quality of the image the user submitted.

For example, an image that is blurry, distorted by glare from a nearby light source, or improperly framed might be marked as low or medium quality. Poor quality images are more likely to fail OCR and/or template conformity checks.

Note: By default, Plaid will let a user recapture document images twice before failing the entire session if we attribute the failure to low image quality.

Possible values: `high`, `medium`, `low`

Analysis of the data extracted from the submitted document.

Hide object

A match summary describing the cross comparison between the subject's name, extracted from the document image, and the name they separately provided to the identity verification attempt.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

A match summary describing the cross comparison between the subject's date of birth, extracted from the document image, and the date of birth they separately provided to the identity verification attempt.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

A description of whether the associated document was expired when the verification was performed.

Note: In the case where an expiration date is not present on the document or failed to be extracted, this value will be `no_data`.

Possible values: `not_expired`, `expired`, `no_data`

A binary match indicator specifying whether the country that issued the provided document matches the country that the user separately provided to Plaid.

Note: You can configure whether a `no_match` on `issuing_country` fails the `documentary_verification` by editing your Plaid Template.

Possible values: `match`, `no_match`

Details about the fraud analysis performed on the document.

Hide object

Whether the submitted document type is supported for fraud analysis.

`success` - The document type is supported.

`failed` - The document type is not supported.

Possible values: `success`, `failed`

The outcome of the portrait presence check.

`success` - A portrait was detected.

`failed` - No portrait was detected.

Possible values: `success`, `failed`

The outcome of the portrait details check including photo embedding and face landmark checks.

`success` - The portrait passed all validity checks.

`failed` - The portrait did not pass one or more validity checks.

Possible values: `success`, `failed`

The outcome of the image composition check.

`success` - The image is a valid physical document capture.

`failed` - The image appears to be a photograph of a screen or a digital forgery.

Possible values: `success`, `failed`

The outcome of the integrity check for document security elements.

`success` - Data is consistent across all checked security elements.

`failed` - Inconsistencies were detected across one or more security elements.

Possible values: `success`, `failed`

The outcome of the document detail check for correct styling and layout.

`success` - The document passed all authenticity checks.

`failed` - The document did not pass one or more authenticity checks.

Possible values: `success`, `failed`

The outcome of the issue date validity check.

`success` - The issue date is valid.

`failed` - The issue date is invalid or could not be verified.

`no_data` - The check could not be performed due to insufficient data.

Possible values: `success`, `failed`, `no_data`

Details about the image quality of the document.

Hide object

The outcome of the glare check.

`success` - The image is free of glare.

`failed` - The image contains glare that may obscure document details.

Possible values: `success`, `failed`

The outcome of the dimensions check.

`success` - The image meets the minimum size and resolution requirements.

`failed` - The image does not meet the minimum size or resolution requirements.

Possible values: `success`, `failed`

The outcome of the blur check.

`success` - The image is sufficiently sharp.

`failed` - The image is too blurry for analysis.

Possible values: `success`, `failed`

Analyzed AAMVA data for the associated hit.

Note: This field is only available for U.S. driver's licenses issued by participating states.

Hide object

The overall outcome of checking the associated hit against the issuing state database.

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the associated hit against state databases.

`match` - The field is an exact match with the state database.

`partial_match` - The field is a partial match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the associated hit against state databases.

`match` - The field is an exact match with the state database.

`partial_match` - The field is a partial match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the particular field against state databases.

`match` - The field is an exact match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `no_match`, `no_data`

The outcome of checking the associated hit against state databases.

`match` - The field is an exact match with the state database.

`partial_match` - The field is a partial match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

The outcome of checking the associated hit against state databases.

`match` - The field is an exact match with the state database.

`partial_match` - The field is a partial match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

The outcome of checking the associated hit against state databases.

`match` - The field is an exact match with the state database.

`partial_match` - The field is a partial match with the state database.

`no_match` - The field is not an exact match with the state database.

`no_data` - The field was unable to be checked against state databases.

Possible values: `match`, `partial_match`, `no_match`, `no_data`

An ISO8601 formatted timestamp.

Format: `date-time`

Additional information for the `selfie_check` step. This field will be `null` unless `steps.selfie_check` has reached a terminal state of either `success` or `failed`.

Hide object

The outcome status for the associated Identity Verification attempt's `selfie_check` step. This field will always have the same value as `steps.selfie_check`.

Possible values: `success`, `failed`

An array of selfies submitted to the `selfie_check` step. Each entry represents one user submission.

Hide object

An outcome status for this specific selfie. Distinct from the overall `selfie_check.status` that summarizes the verification outcome from one or more selfies.

Possible values: `success`, `failed`

The `attempt` field begins with 1 and increments with each subsequent selfie upload.

The image or video capture of a selfie. Only one of `image_url` or `video_url` will be populated per selfie. In the vast majority of sessions Plaid records a short video of the user, so `video_url` is populated and `image_url` is `null`. `image_url` is only populated in the rare passive-liveness fallback case, where the user's device could not complete the standard video liveness capture (for example, a camera or streaming error) and submitted a single still image instead.

Hide object

Temporary URL for downloading a still-image selfie capture. This field is only populated when the session fell back to passive (image-based) liveness. For the majority of selfie checks this field is `null` and `video_url` is populated instead.

Temporary URL for downloading a video selfie capture. This is the standard selfie capture for Identity Verification. Plaid records a short video of the user during the Selfie Check liveness step, so this field is populated for the vast majority of selfie checks.

High level descriptions of how the associated selfie was processed. If a selfie fails verification, the details in the `analysis` object should help clarify why the selfie was rejected.

Hide object

Information about the comparison between the selfie and the document (if documentary verification also ran).

Possible values: `match`, `no_match`, `no_input`

Assessment of whether the selfie capture is of a real human being, as opposed to a picture of a human on a screen, a picture of a paper cut out, someone wearing a mask, or a deepfake.

Possible values: `success`, `failed`

Age-estimation results from the selfie capture. This field is `null` when an age range could not be estimated from the selfie capture.

Hide object

An enum indicating whether the reported age aligns with the estimated selfie capture age range.

`match` indicates that the reported age falls within the estimated selfie capture age range.

`warning` indicates that the reported age falls outside the estimated selfie capture age range, but is close enough that the result should be reviewed.

`no_match` indicates that the reported age falls far outside the estimated selfie capture age range.

`no_data` indicates that there was not enough data available at age-estimation time to compare the reported age against the estimated selfie capture age range.

Possible values: `match`, `warning`, `no_match`, `no_data`

The user's age at the time of the selfie capture, calculated from the date of birth submitted during Identity Verification. If multiple date of birth sources are available, the date of birth submitted in the flow session takes priority over the document date of birth. This field is `null` when the date of birth is unavailable.

Lower bound of the estimated age range from the selfie capture.

Upper bound of the estimated age range from the selfie capture.

Additional information for the `kyc_check` (Data Source Verification) step. This field will be `null` unless `steps.kyc_check` has reached a terminal state of either `success` or `failed`.

Hide object

The outcome status for the associated Identity Verification attempt's `kyc_check` step. This field will always have the same value as `steps.kyc_check`.

Result summary object specifying how the `address` field matched.

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Field describing whether the associated address is a post office box. Will be `yes` when a P.O. box is detected, `no` when Plaid confirmed the address is not a P.O. box, and `no_data` when Plaid was not able to determine if the address is a P.O. box.

Possible values: `yes`, `no`, `no_data`

Field describing whether the associated address is being used for commercial or residential purposes.

Note: This value will be `no_data` when Plaid does not have sufficient data to determine the address's use.

Possible values: `residential`, `commercial`, `no_data`

Result summary object specifying how the `name` field matched.

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Result summary object specifying how the `date_of_birth` field matched.

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Result summary object specifying how the `id_number` field matched.

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Result summary object specifying how the `phone` field matched.

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Additional information for the `risk_check` step.

Hide object

The status of a step in the Identity Verification process.

Possible values: `success`, `active`, `failed`, `waiting_for_prerequisite`, `not_applicable`, `skipped`, `expired`, `canceled`, `pending_review`, `manually_approved`, `manually_rejected`

Result summary object specifying values for `behavior` attributes of risk check, when available.

Hide object

Field describing the overall user interaction signals of a behavior risk check. This value represents how familiar the user is with the personal data they provide, based on a number of signals that are collected during their session.

`genuine` indicates the user has high familiarity with the data they are providing, and that fraud is unlikely.

`neutral` indicates some signals are present in between `risky` and `genuine`, but there are not enough clear signals to determine an outcome.

`risky` indicates the user has low familiarity with the data they are providing, and that fraud is likely.

`no_data` indicates there is not sufficient information to give an accurate signal.

Possible values: `genuine`, `neutral`, `risky`, `no_data`

Field describing the outcome of a fraud ring behavior risk check.

`yes` indicates that fraud ring activity was detected.

`no` indicates that fraud ring activity was not detected.

`no_data` indicates there was not enough information available to give an accurate signal.

Possible values: `yes`, `no`, `no_data`

Field describing the outcome of a bot detection behavior risk check.

`yes` indicates that automated activity was detected.

`no` indicates that automated activity was not detected.

`no_data` indicates there was not enough information available to give an accurate signal.

Possible values: `yes`, `no`, `no_data`

Result summary object specifying values for `email` attributes of risk check.

Hide object

SMTP-MX check to confirm the email address exists if known.

Possible values: `yes`, `no`, `no_data`

Count of all known breaches of this email address if known.

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

Indicates whether the email address domain is a free provider such as Gmail or Hotmail if known.

Possible values: `yes`, `no`, `no_data`

Indicates whether the email address domain is custom if known, i.e. a company domain and not free or disposable.

Possible values: `yes`, `no`, `no_data`

Indicates whether the email domain is listed as disposable if known. Disposable domains are often used to create email addresses that are part of a fake set of user details.

Possible values: `yes`, `no`, `no_data`

Indicates whether the email address top level domain, which is the last part of the domain, is fraudulent or risky if known. In most cases, a suspicious top level domain is also associated with a disposable or high-risk domain.

Possible values: `yes`, `no`, `no_data`

Indicates whether the email address domain is an educational institution domain if known.

Possible values: `yes`, `no`, `no_data`

Indicates whether the email address includes the date of birth or year of birth if known.

Possible values: `yes`, `no`, `no_data`

Indicates whether the provided name matches the email address according to the KYC name-matches-email inference result if known.

`match` - "The email's name identifiers match the user's name."

`partial_match` - "The email's name identifiers partially match the user's name."

`no_match` - "The email's name identifiers do not match the user's name."

`indeterminate` - "The email does not contain any name identifiers, and a match could not be determined."

`no_input` - "The user's profile does not contain the required user inputs to determine a match."

`no_data` - "Field could not be verified against available sources."

Possible values: `no_input`, `indeterminate`, `no_match`, `partial_match`, `match`, `no_data`

A list of online services where this email address has been detected to have accounts or other activity.

Possible values: `aboutme`, `adobe`, `adult_sites`, `airbnb`, `altbalaji`, `amazon`, `apple`, `archiveorg`, `atlassian`, `bitmoji`, `bodybuilding`, `booking`, `bukalapak`, `codecademy`, `deliveroo`, `diigo`, `discord`, `disneyplus`, `duolingo`, `ebay`, `envato`, `eventbrite`, `evernote`, `facebook`, `firefox`, `flickr`, `flipkart`, `foursquare`, `freelancer`, `gaana`, `giphy`, `github`, `google`, `gravatar`, `hubspot`, `imgur`, `instagram`, `jdid`, `kakao`, `kommo`, `komoot`, `lastfm`, `lazada`, `line`, `linkedin`, `mailru`, `microsoft`, `myspace`, `netflix`, `nike`, `ok`, `patreon`, `pinterest`, `plurk`, `quora`, `qzone`, `rambler`, `rappi`, `replit`, `samsung`, `seoclerks`, `shopclues`, `skype`, `snapchat`, `snapdeal`, `soundcloud`, `spotify`, `starz`, `strava`, `taringa`, `telegram`, `tiki`, `tokopedia`, `treehouse`, `tumblr`, `twitter`, `venmo`, `viber`, `vimeo`, `vivino`, `vkontakte`, `wattpad`, `weibo`, `whatsapp`, `wordpress`, `xing`, `yahoo`, `yandex`, `zalo`, `zoho`

Result summary object specifying values for `phone` attributes of risk check.

Hide object

A list of online services where this phone number has been detected to have accounts or other activity.

Possible values: `aboutme`, `adobe`, `adult_sites`, `airbnb`, `altbalaji`, `amazon`, `apple`, `archiveorg`, `atlassian`, `bitmoji`, `bodybuilding`, `booking`, `bukalapak`, `codecademy`, `deliveroo`, `diigo`, `discord`, `disneyplus`, `duolingo`, `ebay`, `envato`, `eventbrite`, `evernote`, `facebook`, `firefox`, `flickr`, `flipkart`, `foursquare`, `freelancer`, `gaana`, `giphy`, `github`, `google`, `gravatar`, `hubspot`, `imgur`, `instagram`, `jdid`, `kakao`, `kommo`, `komoot`, `lastfm`, `lazada`, `line`, `linkedin`, `mailru`, `microsoft`, `myspace`, `netflix`, `nike`, `ok`, `patreon`, `pinterest`, `plurk`, `quora`, `qzone`, `rambler`, `rappi`, `replit`, `samsung`, `seoclerks`, `shopclues`, `skype`, `snapchat`, `snapdeal`, `soundcloud`, `spotify`, `starz`, `strava`, `taringa`, `telegram`, `tiki`, `tokopedia`, `treehouse`, `tumblr`, `twitter`, `venmo`, `viber`, `vimeo`, `vivino`, `vkontakte`, `wattpad`, `weibo`, `whatsapp`, `wordpress`, `xing`, `yahoo`, `yandex`, `zalo`, `zoho`

Array of result summary objects specifying values for `device` attributes of risk check.

Hide object

An enum indicating whether a network proxy is present and if so what type it is.

`none_detected` indicates the user is not on a detectable proxy network.

`tor` indicates the user was using a Tor browser, which sends encrypted traffic on a decentralized network and is somewhat similar to a VPN (Virtual Private Network).

`vpn` indicates the user is on a VPN (Virtual Private Network)

`web_proxy` indicates the user is on a web proxy server, which may allow them to conceal information such as their IP address or other identifying information.

`public_proxy` indicates the user is on a public web proxy server, which is similar to a web proxy but can be shared by multiple users. This may allow multiple users to appear as if they have the same IP address for instance.

Possible values: `none_detected`, `tor`, `vpn`, `web_proxy`, `public_proxy`

Count of spam lists the IP address is associated with if known.

UTC offset of the timezone associated with the IP address.

Result summary object capturing abuse signals related to `identity abuse`, e.g. stolen and synthetic identity fraud. These attributes are only available for US identities and some signals may not be available depending on what information was collected.

Hide object

Field containing the data used in determining the outcome of the synthetic identity risk check.

Contains the following fields:

`score` - A score from 0 to 100 indicating the likelihood that the user is a synthetic identity.

Hide object

A score from 0 to 100 indicating the likelihood that the user is a synthetic identity.

Field containing the data used in determining the outcome of the stolen identity risk check.

Contains the following fields:

`score` - A score from 0 to 100 indicating the likelihood that the user is a stolen identity.

Hide object

A score from 0 to 100 indicating the likelihood that the user is a stolen identity.

The attributes related to the facial duplicates captured in risk check.

Hide object

ID of the associated Identity Verification attempt.

Similarity score of the match. Ranges from 0 to 100.

Whether this match occurred after the session was complete. For example, this would be `true` if a later session ended up matching this one.

The trust index score for the `risk_check` step.

Additional information for the `verify_sms` step.

Hide object

The outcome status for the associated Identity Verification attempt's `verify_sms` step. This field will always have the same value as `steps.verify_sms`.

Possible values: `success`, `failed`

An array where each entry represents a verification attempt for the `verify_sms` step. Each entry represents one user-submitted phone number. Phone number edits, and in some cases error handling due to edge cases like rate limiting, may generate additional verifications.

Hide object

The outcome status for the individual SMS verification.

Possible values: `pending`, `success`, `failed`, `canceled`

The attempt field begins with 1 and increments with each subsequent SMS verification.

A phone number in E.164 format.

The number of delivery attempts made within the verification to send the SMS code to the user. Each delivery attempt represents the user taking action from the front end UI to request creation and delivery of a new SMS verification code, or to resend an existing SMS verification code. There is a limit of 3 delivery attempts per verification.

The number of attempts made by the user within the verification to verify the SMS code by entering it into the front end UI. There is a limit of 3 solve attempts per verification.

An ISO8601 formatted timestamp.

Format: `date-time`

An ISO8601 formatted timestamp.

Format: `date-time`

An ISO8601 formatted timestamp.

Format: `date-time`

ID of the associated screening.

ID of the associated Beacon User.

Unique user identifier, created by calling `/user/create`. Either a `user_id` or the `client_user_id` must be provided. The `user_id` may only be used instead of the `client_user_id` if you were not a pre-existing user of `/user/create` as of December 10, 2025, or if you have since [migrated to the new User APIs](https://plaid.com/docs/api/users/migrate-to-new-user-apis); for more details, see [New User APIs](https://plaid.com/docs/api/users/user-apis). If both this field and a `client_user_id` are present in a request, the `user_id` must have been created from the provided `client_user_id`.

An ISO8601 formatted timestamp.

Format: `date-time`

Information about a Protect event including Trust Index score and fraud attributes.

Hide object

The event ID.

The timestamp of the event, in [ISO 8601](https://wikipedia.org/wiki/ISO_8601) format, e.g. `"2017-09-14T14:42:19.350Z"`

Format: `date-time`

Represents a calculated Trust Index Score.

Hide object

The overall trust index score.

The versioned name of the Trust Index model used for scoring.

Contains sub-score metadata.

Hide object

Represents Trust Index Subscore.

Hide object

The subscore score.

Represents Trust Index Subscore.

Hide object

The subscore score.

Event fraud attributes as an arbitrary set of key-value pairs. The set of attributes returned varies by model.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "id": "idv_52xR9LKo77r1Np",
  "client_user_id": "your-db-id-3b24110",
  "created_at": "2020-07-24T03:26:02Z",
  "completed_at": "2020-07-24T03:26:02Z",
  "previous_attempt_id": "idv_42cF1MNo42r9Xj",
  "shareable_url": "https://flow.plaid.com/verify/idv_4FrXJvfQU3zGUR?key=e004115db797f7cc3083bff3167cba30644ef630fb46f5b086cde6cc3b86a36f",
  "template": {
    "id": "idvtmp_4FrXJvfQU3zGUR",
    "version": 2
  },
  "user": {
    "phone_number": "+12345678909",
    "date_of_birth": "1990-05-29",
    "ip_address": "192.0.2.42",
    "email_address": "user@example.com",
    "name": {
      "given_name": "Leslie",
      "family_name": "Knope"
    },
    "address": {
      "street": "123 Main St.",
      "street2": "Unit 42",
      "city": "Pawnee",
      "region": "IN",
      "postal_code": "46001",
      "country": "US"
    },
    "id_number": {
      "value": "123456789",
      "type": "us_ssn"
    }
  },
  "status": "success",
  "steps": {
    "accept_tos": "success",
    "verify_sms": "success",
    "kyc_check": "success",
    "documentary_verification": "success",
    "selfie_check": "success",
    "watchlist_screening": "success",
    "risk_check": "success"
  },
  "documentary_verification": {
    "status": "success",
    "documents": [
      {
        "status": "success",
        "attempt": 1,
        "images": {
          "original_front": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/documents/1/original_front.jpeg",
          "original_back": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/documents/1/original_back.jpeg",
          "cropped_front": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/documents/1/cropped_front.jpeg",
          "cropped_back": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/documents/1/cropped_back.jpeg",
          "face": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/documents/1/face.jpeg"
        },
        "extracted_data": {
          "id_number": "AB123456",
          "category": "drivers_license",
          "expiration_date": "2030-05-29",
          "issue_date": "2020-05-29",
          "issuing_country": "US",
          "issuing_region": "IN",
          "date_of_birth": "1990-05-29",
          "address": {
            "street": "123 Main St. Unit 42",
            "city": "Pawnee",
            "region": "IN",
            "postal_code": "46001",
            "country": "US"
          },
          "name": {
            "given_name": "Leslie",
            "family_name": "Knope"
          }
        },
        "analysis": {
          "authenticity": "match",
          "image_quality": "high",
          "extracted_data": {
            "name": "match",
            "date_of_birth": "match",
            "expiration_date": "not_expired",
            "issuing_country": "match"
          },
          "aamva_verification": {
            "is_verified": true,
            "id_number": "match",
            "id_issue_date": "match",
            "id_expiration_date": "match",
            "street": "match",
            "city": "match",
            "postal_code": "match",
            "date_of_birth": "match",
            "gender": "match",
            "height": "match",
            "eye_color": "match",
            "first_name": "match",
            "middle_name": "match",
            "last_name": "match"
          },
          "fraud_analysis_details": {
            "type_supported": "success",
            "portrait_presence_check": "success",
            "portrait_details_check": "success",
            "image_composition_check": "success",
            "integrity_check": "success",
            "detail_check": "success",
            "issue_date_check": "success"
          },
          "image_quality_details": {
            "glare_check": "success",
            "blur_check": "success",
            "dimensions_check": "success"
          }
        },
        "redacted_at": "2020-07-24T03:26:02Z"
      }
    ]
  },
  "selfie_check": {
    "status": "success",
    "selfies": [
      {
        "status": "success",
        "attempt": 1,
        "capture": {
          "image_url": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/selfie/liveness.jpeg",
          "video_url": "https://example.plaid.com/verifications/idv_52xR9LKo77r1Np/selfie/liveness.webm"
        },
        "analysis": {
          "document_comparison": "match",
          "liveness_check": "success",
          "age_check": {
            "status": "match",
            "reported_age": 36,
            "age_estimate_lower_bound": 32,
            "age_estimate_upper_bound": 38
          }
        }
      }
    ]
  },
  "kyc_check": {
    "status": "success",
    "address": {
      "summary": "match",
      "po_box": "yes",
      "type": "residential"
    },
    "name": {
      "summary": "match"
    },
    "date_of_birth": {
      "summary": "match"
    },
    "id_number": {
      "summary": "match"
    },
    "phone_number": {
      "summary": "match",
      "area_code": "match"
    }
  },
  "risk_check": {
    "status": "success",
    "behavior": {
      "user_interactions": "risky",
      "fraud_ring_detected": "yes",
      "bot_detected": "yes"
    },
    "email": {
      "is_deliverable": "yes",
      "breach_count": 1,
      "first_breached_at": "1990-05-29",
      "last_breached_at": "1990-05-29",
      "domain_registered_at": "1990-05-29",
      "domain_is_free_provider": "yes",
      "domain_is_custom": "yes",
      "domain_is_disposable": "yes",
      "top_level_domain_is_suspicious": "yes",
      "is_edu": "yes",
      "includes_date_of_birth": "yes",
      "name": "match",
      "linked_services": [
        "apple"
      ]
    },
    "phone": {
      "linked_services": [
        "apple"
      ]
    },
    "devices": [
      {
        "ip_proxy_type": "none_detected",
        "ip_spam_list_count": 1,
        "ip_timezone_offset": "+06:00:00"
      }
    ],
    "identity_abuse_signals": {
      "synthetic_identity": {
        "score": 0
      },
      "stolen_identity": {
        "score": 0
      }
    },
    "facial_duplicates": [
      {
        "id": "idv_52xR9LKo77r1Np",
        "similarity": 95,
        "matched_after_completed": true
      }
    ],
    "trust_index_score": 86
  },
  "verify_sms": {
    "status": "success",
    "verifications": [
      {
        "status": "success",
        "attempt": 1,
        "phone_number": "+12345678909",
        "delivery_attempt_count": 1,
        "solve_attempt_count": 1,
        "initially_sent_at": "2020-07-24T03:26:02Z",
        "last_sent_at": "2020-07-24T03:26:02Z",
        "redacted_at": "2020-07-24T03:26:02Z"
      }
    ]
  },
  "watchlist_screening_id": "scr_52xR9LKo77r1Np",
  "beacon_user_id": "becusr_42cF1MNo42r9Xj",
  "user_id": "usr_dddAs9ewdcDQQQ",
  "redacted_at": "2020-07-24T03:26:02Z",
  "latest_scored_protect_event": {
    "event_id": "ptevt_7AJYTMFxRUgJ",
    "timestamp": "2020-07-24T03:26:02Z",
    "trust_index": {
      "score": 86,
      "model": "trust_index.2.0.0",
      "subscores": {
        "device_and_connection": {
          "score": 87
        },
        "bank_account_insights": {
          "score": 85
        }
      }
    },
    "fraud_attributes": {
      "fraud_attributes": {
        "link_session.linked_bank_accounts.user_pi_matches_owners": true,
        "link_session.linked_bank_accounts.connected_apps.days_since_first_connection": 582,
        "session.challenged_with_mfa": false,
        "user.bank_accounts.num_of_frozen_or_restricted_accounts": 0,
        "user.linked_bank_accounts.num_family_names": 1,
        "user.linked_bank_accounts.num_of_connected_banks": 1,
        "user.link_sessions.days_since_first_link_session": 150,
        "user.pi.email.history_yrs": 7.03,
        "user.pi.email.num_social_networks_linked": 12,
        "user.pi.ssn.user_likely_has_better_ssn": false
      }
    }
  },
  "request_id": "saKrIBuEB9qJZng"
}
```

[### Webhooks](/docs/api/products/identity-verification/#webhooks)=\*=\*=\*=[#### `STATUS_UPDATED`](/docs/api/products/identity-verification/#status_updated)

Fired when the status of an identity verification has been updated, which can be triggered via the dashboard or the API.

**Properties**

`IDENTITY_VERIFICATION`

`STATUS_UPDATED`

The ID of the associated Identity Verification attempt.

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "IDENTITY_VERIFICATION",
  "webhook_code": "STATUS_UPDATED",
  "identity_verification_id": "idv_52xR9LKo77r1Np",
  "environment": "production"
}
```

=\*=\*=\*=[#### `STEP_UPDATED`](/docs/api/products/identity-verification/#step_updated)

Fired when an end user has completed a step of the Identity Verification process.

**Properties**

`IDENTITY_VERIFICATION`

`STEP_UPDATED`

The ID of the associated Identity Verification attempt.

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "IDENTITY_VERIFICATION",
  "webhook_code": "STEP_UPDATED",
  "identity_verification_id": "idv_52xR9LKo77r1Np",
  "environment": "production"
}
```

=\*=\*=\*=[#### `RETRIED`](/docs/api/products/identity-verification/#retried)

Fired when an identity verification has been retried, which can be triggered via the dashboard or the API.

**Properties**

`IDENTITY_VERIFICATION`

`RETRIED`

The ID of the associated Identity Verification attempt.

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "IDENTITY_VERIFICATION",
  "webhook_code": "RETRIED",
  "identity_verification_id": "idv_52xR9LKo77r1Np",
  "environment": "production"
}
```
