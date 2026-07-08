---
title: "Look up Dashboard Users"
source_url: "https://plaid.com/docs/api/kyc-aml-users/"
section: "KYC/AML and Anti-Fraud"
section_id: "03-kyc-aml-anti-fraud"
slug: "kyc-aml-users"
endpoints:
  - "/dashboard_user/get"
  - "/dashboard_user/list"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Dashboard User Audit API

> **Source:** [https://plaid.com/docs/api/kyc-aml-users/](https://plaid.com/docs/api/kyc-aml-users/)
> **Section:** KYC/AML and Anti-Fraud

## Endpoints & Webhooks on this page

- `/dashboard_user/get`
- `/dashboard_user/list`

---

# Dashboard User Audit API

#### API reference for viewing Dashboard users for Monitor

These endpoints are used to look up a Dashboard user, as referenced in an `audit_trail` object from the [Monitor](/docs/api/products/monitor/) API.

| Endpoints |  |
| --- | --- |
| [`/dashboard_user/get`](/docs/api/kyc-aml-users/#dashboard_userget) | Retrieve information about Dashboard user |
| [`/dashboard_user/list`](/docs/api/kyc-aml-users/#dashboard_userlist) | List Dashboard users |

=\*=\*=\*=[#### `/dashboard_user/get`](/docs/api/kyc-aml-users/#dashboard_userget)

[#### Retrieve a Dashboard user](/docs/api/kyc-aml-users/#retrieve-a-dashboard-user)

The [`/dashboard_user/get`](/docs/api/kyc-aml-users/#dashboard_userget) endpoint provides details (such as email address) about a specific Dashboard user based on the `dashboard_user_id` field, which is returned in the `audit_trail` object of certain Monitor and Beacon endpoints. This can be used to identify the specific reviewer who performed a Dashboard action.

/dashboard\_user/get

**Request fields**

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

/dashboard\_user/get

Nodeâ¼

```
const request: DashboardUserGetRequest = {
  dashboard_user_id: 'usr_1SUuwqBdK75GKi',
};

try {
  const response = await client.dashboardUserGet(request);
} catch (error) {
  // handle error
}
```

/dashboard\_user/get

**Response fields**

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

An ISO8601 formatted timestamp.

Format: `date-time`

A valid email address. Must not have leading or trailing spaces and address must be RFC compliant. For more information, see [RFC 3696](https://datatracker.ietf.org/doc/html/rfc3696).

Format: `email`

The current status of the user.

Possible values: `invited`, `active`, `deactivated`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "id": "54350110fedcbaf01234ffee",
  "created_at": "2020-07-24T03:26:02Z",
  "email_address": "user@example.com",
  "status": "active",
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/dashboard_user/list`](/docs/api/kyc-aml-users/#dashboard_userlist)

[#### List Dashboard users](/docs/api/kyc-aml-users/#list-dashboard-users)

The [`/dashboard_user/list`](/docs/api/kyc-aml-users/#dashboard_userlist) endpoint provides details (such as email address) about all Dashboard users associated with your account. This can be used to audit or track the list of reviewers for Monitor, Beacon, and Identity Verification products.

/dashboard\_user/list

**Request fields**

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

An identifier that determines which page of results you receive.

/dashboard\_user/list

Nodeâ¼

```
try {
  const response = await client.dashboardUserList({});
} catch (error) {
  // handle error
}
```

/dashboard\_user/list

**Response fields**

Collapse all

List of dashboard users

Hide object

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

An ISO8601 formatted timestamp.

Format: `date-time`

A valid email address. Must not have leading or trailing spaces and address must be RFC compliant. For more information, see [RFC 3696](https://datatracker.ietf.org/doc/html/rfc3696).

Format: `email`

The current status of the user.

Possible values: `invited`, `active`, `deactivated`

An identifier that determines which page of results you receive.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "dashboard_users": [
    {
      "id": "54350110fedcbaf01234ffee",
      "created_at": "2020-07-24T03:26:02Z",
      "email_address": "user@example.com",
      "status": "active"
    }
  ],
  "next_cursor": "eyJkaXJlY3Rpb24iOiJuZXh0Iiwib2Zmc2V0IjoiMTU5NDM",
  "request_id": "saKrIBuEB9qJZng"
}
```
