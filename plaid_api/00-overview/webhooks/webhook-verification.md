---
title: "Webhooks / Webhook Verification"
source_url: "https://plaid.com/docs/api/webhooks/webhook-verification/"
section: "Overview"
section_id: "00-overview"
slug: "webhooks--webhook-verification"
endpoints:
  - "/webhook_verification_key/get"
  - "Steps to verify webhooks"
  - "firing webhooks in Sandbox"
  - "Get webhook verification key"
  - "Validate the webhook"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Verify webhooks

> **Source:** [https://plaid.com/docs/api/webhooks/webhook-verification/](https://plaid.com/docs/api/webhooks/webhook-verification/)
> **Section:** Overview

## Endpoints & Webhooks on this page

- `/webhook_verification_key/get`
- `Steps to verify webhooks`
- `firing webhooks in Sandbox`
- `Get webhook verification key`
- `Validate the webhook`

---

# Verify webhooks

#### API reference for verifying webhooks

Plaid signs all outgoing webhooks so that you can verify the authenticity of any incoming webhooks to your application. A message signature is included in the `Plaid-Verification` header (Note: this is the canonical representation of the header field, but HTTP 1.x headers should be handled as [case-insensitive](https://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.2), HTTP 2 headers are always lowercase). The verification process is optional and is not required for your application to handle Plaid webhooks.

The verification process requires understanding JSON Web Tokens (JWTs) and JSON Web Keys (JWKs). More information about these specifications can be found at [jwt.io](https://jwt.io).

Libraries for interpreting and verifying JWKs and JWTs most likely exist in your preferred language. It is highly recommended that you utilize well-tested libraries rather than trying to implement these specifications from scratch.

[#### Steps to verify webhooks](/docs/api/webhooks/webhook-verification/#steps-to-verify-webhooks)[##### Extract the JWT header](/docs/api/webhooks/webhook-verification/#extract-the-jwt-header)

Extract the Plaid-Verification HTTP header from any Plaid webhook (to get a webhook, see [firing webhooks in Sandbox](/docs/api/sandbox/#sandboxitemfire_webhook)). The value of the Plaid-Verification header is a JWT, and will be referred to as "the JWT" in following steps.

Using your preferred JWT library, decode the JWT and extract the header without validating the signature. This functionality most likely exists in your preferred JWT library. An example JWT header is shown below.

JWT header

```
{
  "alg": "ES256",
  "kid": "bfbd5111-8e33-4643-8ced-b2e642a72f3c",
  "typ": "JWT"
}
```

Ensure that the value of the `alg` (algorithm) field in the header is `"ES256"`. Reject the webhook if this is not the case.

Extract the value corresponding to the `kid` (key ID) field. This will be used to retrieve the JWK public key corresponding to the private key that was used to sign this request.

[##### Get the verification key](/docs/api/webhooks/webhook-verification/#get-the-verification-key)

Use the [`/webhook_verification_key/get`](/docs/api/webhooks/webhook-verification/#get-webhook-verification-key) endpoint to get the webhook verification key.

=\*=\*=\*=[#### `/webhook_verification_key/get`](/docs/api/webhooks/webhook-verification/#webhook_verification_keyget)

[#### Get webhook verification key](/docs/api/webhooks/webhook-verification/#get-webhook-verification-key)

Plaid signs all outgoing webhooks and provides JSON Web Tokens (JWTs) so that you can verify the authenticity of any incoming webhooks to your application. A message signature is included in the `Plaid-Verification` header.

The [`/webhook_verification_key/get`](/docs/api/webhooks/webhook-verification/#get-webhook-verification-key) endpoint provides a JSON Web Key (JWK) that can be used to verify a JWT.

/webhook\_verification\_key/get

**Request fields**

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The key ID ( `kid` ) from the JWT header.

Get webhook verification key

Nodeâ¼

```
const request: WebhookVerificationKeyGetRequest = {
  key_id: keyID,
};
try {
  const response = await plaidClient.webhookVerificationKeyGet(request);
  const key = response.data.key;
} catch (error) {
  // handle error
}
```

/webhook\_verification\_key/get

**Response fields**

Collapse all

A JSON Web Key (JWK) that can be used in conjunction with [JWT libraries](https://jwt.io/#libraries-io) to verify Plaid webhooks

Hide object

The alg member identifies the cryptographic algorithm family used with the key.

The crv member identifies the cryptographic curve used with the key.

The kid (Key ID) member can be used to match a specific key. This can be used, for instance, to choose among a set of keys within the JWK during key rollover.

The kty (key type) parameter identifies the cryptographic algorithm family used with the key, such as RSA or EC.

The use (public key use) parameter identifies the intended use of the public key.

The x member contains the x coordinate for the elliptic curve point, provided as a base64url-encoded string of the coordinate's big endian representation.

The y member contains the y coordinate for the elliptic curve point, provided as a base64url-encoded string of the coordinate's big endian representation.

The timestamp when the key was created, in Unix time.

The timestamp when the key expired, in Unix time.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "key": {
    "alg": "ES256",
    "created_at": 1560466150,
    "crv": "P-256",
    "expired_at": null,
    "kid": "bfbd5111-8e33-4643-8ced-b2e642a72f3c",
    "kty": "EC",
    "use": "sig",
    "x": "hKXLGIjWvCBv-cP5euCTxl8g9GLG9zHo_3pO5NN1DwQ",
    "y": "shhexqPB7YffGn6fR6h2UhTSuCtPmfzQJ6ENVIoO4Ys"
  },
  "request_id": "RZ6Omi1bzzwDaLo"
}
```

[##### Validate the webhook](/docs/api/webhooks/webhook-verification/#validate-the-webhook)

Interpret the returned `key` as a JWK public key. Using your preferred JWT library, verify the JWT using the JWK. If the signature is not valid, reject the webhook. Otherwise, extract the payload of the JWT. It will look something like the JSON below.

JWT Payload

```
{
  "iat": 1560211755,
  "request_body_sha256": "bbe8e9..."
}
```

Use the issued at time denoted by the `iat` field to verify that the webhook is not more than 5 minutes old. Rejecting outdated webhooks can help prevent replay attacks.

Extract the value of the `request_body_sha256` field. This will be used to check the integrity and authenticity of the webhook body.

Compute the SHA-256 of the webhook body and ensure that it matches what is specified in the `request_body_sha256` field of the validated JWT. If not, reject the webhook. It is best practice to use a constant time string/hash comparison method in your preferred language to prevent timing attacks.

Note that the `request_body_sha256` sent in the JWT payload is sensitive to the whitespace in the webhook body and uses a tab-spacing of 2. If the webhook body is stored with a tab-spacing of 4, the hash will not match.

[#### Example implementation](/docs/api/webhooks/webhook-verification/#example-implementation)

The following code shows one example method that can be used to verify webhooks sent by Plaid and cache public keys.

Sample implementations for verifying a Plaid webhook

Nodeâ¼

```
const compare = require('secure-compare');
const { jwtDecode } = require('jwt-decode'); // syntax for jwtDecode 4.0 or later
const JWT = require('jose');
const sha256 = require('js-sha256');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

// Single cached key instead of a Map
let cachedKey = null;

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

const verify = async (body, headers) => {
  const signedJwt = headers['plaid-verification'];
  const decodedToken = jwtDecode(signedJwt);
  const decodedTokenHeader = jwtDecode(signedJwt, { header: true });
  const currentKeyID = decodedTokenHeader.kid;

  // Fetch key if not already cached
  if (!cachedKey) {
    try {
      const response = await plaidClient.webhookVerificationKeyGet({
        key_id: currentKeyID,
      });
      cachedKey = response.data.key;
    } catch (error) {
      return false;
    }
  }

  // If key is still not set, verification fails
  if (!cachedKey) {
    return false;
  }

  // Validate the signature and iat
  try {
    const keyLike = await JWT.importJWK(cachedKey);
    // This will throw an error if verification fails
    await JWT.jwtVerify(signedJwt, keyLike, {
      maxTokenAge: '5 min',
    });
  } catch (error) {
    return false;
  }

  // Compare hashes
  const bodyHash = sha256(body);
  const claimedBodyHash = decodedToken.request_body_sha256;
  return compare(bodyHash, claimedBodyHash);
};
```
