---
title: "Network"
source_url: "https://plaid.com/docs/api/network/"
section: "Fundamentals"
section_id: "06-fundamentals"
slug: "network"
endpoints:
  - "/network/status/get"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Network

> **Source:** [https://plaid.com/docs/api/network/](https://plaid.com/docs/api/network/)
> **Section:** Fundamentals

## Endpoints & Webhooks on this page

- `/network/status/get`

---

# Network

#### API reference for the Plaid Network

| Endpoints |  |
| --- | --- |
| [`/network/status/get`](/docs/api/network/#networkstatusget) | Check the status of a user in the Plaid Network |

[### Endpoints](/docs/api/network/#endpoints)=\*=\*=\*=[#### `/network/status/get`](/docs/api/network/#networkstatusget)

[#### Check a user's Plaid Network status](/docs/api/network/#check-a-user's-plaid-network-status)

The [`/network/status/get`](/docs/api/network/#networkstatusget) endpoint can be used to check whether Plaid has a matching profile for the user.
This is useful for determining if a user is eligible for a streamlined experience, such as Layer. To access this endpoint, contact your Plaid account manager.

Note: it is strongly recommended to check for Layer eligibility in the frontend. [`/network/status/get`](/docs/api/network/#networkstatusget) should only be used for checking Layer eligibility if a frontend check is not possible for your use case.
For instructions on performing a frontend eligibility check, see the [Layer documentation](https://plaid.com/docs/layer/#integration-overview).

/network/status/get

**Request fields**

Collapse all

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

An object specifying information about the end user for the network status check.

Hide object

The user's phone number in [E.164](https://en.wikipedia.org/wiki/E.164) format.

The id of a template defined in Plaid Dashboard. This field is used if you have additional criteria that you want to check against (e.g. Layer eligibility).

/network/status/get

Nodeâ¼

```
const request: NetworkStatusGetRequest = {
  user: {
    phone_number: '+14155550015',
  },
};
try {
  const response = await plaidClient.networkStatusGet(request);
  const networkStatus = response.data.network_status;
} catch (error) {
  // handle error
}
```

/network/status/get

**Response fields**

Collapse all

Enum representing the overall network status of the user.

Possible values: `UNKNOWN`, `RETURNING_USER`

An object representing Layer-related metadata for the requested user.

Hide object

Indicates if the user is eligible for a Layer session.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "network_status": "RETURNING_USER",
  "request_id": "m8MDnv9okwxFNBV"
}
```
