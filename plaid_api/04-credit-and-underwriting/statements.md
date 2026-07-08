---
title: "Statements"
source_url: "https://plaid.com/docs/api/products/statements/"
section: "Credit and Underwriting"
section_id: "04-credit-and-underwriting"
slug: "statements"
endpoints:
  - "/statements/list"
  - "/statements/download"
  - "/statements/refresh"
  - "STATEMENTS_REFRESH_COMPLETE"
  - "Webhooks"
  - "webhook_type"
  - "webhook_code"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Statements

> **Source:** [https://plaid.com/docs/api/products/statements/](https://plaid.com/docs/api/products/statements/)
> **Section:** Credit and Underwriting

## Endpoints & Webhooks on this page

- `/statements/list`
- `/statements/download`
- `/statements/refresh`
- `STATEMENTS_REFRESH_COMPLETE`
- `Webhooks`
- `webhook_type`
- `webhook_code`

---

# Statements

#### API reference for Statements endpoints and webhooks

For how-to guidance, see the [Statements documentation](/docs/statements/).

| Endpoint | Description |
| --- | --- |
| [`/statements/list`](/docs/api/products/statements/#statementslist) | Get a list of statements available to download |
| [`/statements/download`](/docs/api/products/statements/#statementsdownload) | Download a single bank statement |
| [`/statements/refresh`](/docs/api/products/statements/#statementsrefresh) | Trigger on-demand statement extractions |

| Webhook Name | Description |
| --- | --- |
| [`STATEMENTS_REFRESH_COMPLETE`](/docs/api/products/statements/#statements_refresh_complete) | Statements refresh completed |

[### Endpoints](/docs/api/products/statements/#endpoints)=\*=\*=\*=[#### `/statements/list`](/docs/api/products/statements/#statementslist)

[#### Retrieve a list of all statements associated with an Item.](/docs/api/products/statements/#retrieve-a-list-of-all-statements-associated-with-an-item.)

The [`/statements/list`](/docs/api/products/statements/#statementslist) endpoint retrieves a list of all statements associated with an Item.

/statements/list

**Request fields**

The access token associated with the Item for which data is being requested.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

/statements/list

Nodeâ¼

```
const listRequest: StatementsListRequest = {
  access_token: access_token,
};
const listResponse = await plaidClient.statementsList(listRequest);
accounts = listResponse.data.accounts;
statements = listResponse.data.accounts[0].statements;
```

/statements/list

**Response fields**

Collapse all

Hide object

Plaid's unique identifier for the account.

The last 2-4 alphanumeric characters of an account's official account number. Note that the mask may be non-unique between an Item's accounts, and it may also not match the mask that the bank displays to the user.

The name of the account, either assigned by the user or by the financial institution itself.

The official name of the account as given by the financial institution.

The subtype of the account. For a full list of valid types and subtypes, see the [Account schema](https://plaid.com/docs/api/accounts#account-type-schema).

The type of account. For a full list of valid types and subtypes, see the [Account schema](https://plaid.com/docs/api/accounts#account-type-schema).

The list of statements' metadata associated with this account.

Hide object

Plaid's unique identifier for the statement.

Date when the statement was posted by the FI, if known

Format: `date`

Month of the year. Possible values: 1 through 12 (January through December).

The year of the statement, e.g. 2024.

Minimum: `2010`

The Plaid Institution ID associated with the Item.

The name of the institution associated with the Item.

The Plaid Item ID. The `item_id` is always unique; linking the same account at the same institution twice will result in two Items with different `item_id` values. Like all Plaid identifiers, the `item_id` is case-sensitive.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "item_id": "eVBnVMp7zdTJLkRNr33Rs6zr7KNJqBFL9DrE6",
  "institution_id": "ins_3",
  "institution_name": "Chase",
  "accounts": [
    {
      "account_id": "3gE5gnRzNyfXpBK5wEEKcymJ5albGVUqg77gr",
      "account_mask": "0000",
      "account_name": "Plaid Saving",
      "account_official_name": "Plaid Silver Standard 0.1% Interest Saving",
      "account_subtype": "savings",
      "account_type": "depository",
      "statements": [
        {
          "statement_id": "vzeNDwK7KQIm4yEog683uElbp9GRLEFXGK98D",
          "month": 5,
          "year": 2023,
          "date_posted": "2023-05-01"
        }
      ]
    }
  ],
  "request_id": "eYupqX1mZkEuQRx"
}
```

=\*=\*=\*=[#### `/statements/download`](/docs/api/products/statements/#statementsdownload)

[#### Retrieve a single statement.](/docs/api/products/statements/#retrieve-a-single-statement.)

The [`/statements/download`](/docs/api/products/statements/#statementsdownload) endpoint retrieves a single statement PDF in binary format. The response will contain a `Plaid-Content-Hash` header containing a SHA 256 checksum of the statement. This can be used to verify that the file being sent by Plaid is the same file that was downloaded to your system.

/statements/download

**Request fields**

The access token associated with the Item for which data is being requested.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Plaid's unique identifier for the statement.

/statements/download

Nodeâ¼

```
let downloadRequest: StatementsDownloadRequest = {
  access_token: accessToken,
  statement_id: statement.statement_id,
};
let downloadResponse = await plaidClient.statementsDownload(
  downloadRequest,
  {responseType: 'arraybuffer'},
);
let pdf = downloadResponse.data.toString('base64');
```

[##### Response](/docs/api/products/statements/#response)

This endpoint returns a single statement, exactly as provided by the financial institution, in the form of binary PDF data.

=\*=\*=\*=[#### `/statements/refresh`](/docs/api/products/statements/#statementsrefresh)

[#### Refresh statements data.](/docs/api/products/statements/#refresh-statements-data.)

[`/statements/refresh`](/docs/api/products/statements/#statementsrefresh) initiates an on-demand extraction to fetch the statements for the provided dates.

/statements/refresh

**Request fields**

The access token associated with the Item for which data is being requested.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

The start date for statements, in "YYYY-MM-DD" format, e.g. "2023-08-30". To determine whether a statement falls within the specified date range, Plaid will use the statement posted date. The statement posted date is typically either the last day of the statement period, or the following day.

Format: `date`

The end date for statements, in "YYYY-MM-DD" format, e.g. "2023-10-30". You can request up to two years of data. To determine whether a statement falls within the specified date range, Plaid will use the statement posted date. The statement posted date is typically either the last day of the statement period, or the following day.

Format: `date`

/statements/refresh

Nodeâ¼

```
const refreshRequest: StatementsRefreshRequest = {
  access_token: accessToken,
  start_date: '2023-11-01',
  end_date: '2024-02-01',
};
const refreshResponse = await plaidClient.statementsRefresh(refreshRequest);
```

/statements/refresh

**Response fields**

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "request_id": "eYupqX1mZkEuQRx"
}
```

[### Webhooks](/docs/api/products/statements/#webhooks)

Statement webhooks are sent to indicate that statements refresh has finished processing. All webhooks related to statements have a `webhook_type` of `STATEMENTS`.

=\*=\*=\*=[#### `STATEMENTS_REFRESH_COMPLETE`](/docs/api/products/statements/#statements_refresh_complete)

Fired when refreshed statements extraction is completed or failed to be completed. Triggered by calling [`/statements/refresh`](/docs/api/products/statements/#statementsrefresh).

**Properties**

`STATEMENTS`

`STATEMENTS_REFRESH_COMPLETE`

The Plaid Item ID. The `item_id` is always unique; linking the same account at the same institution twice will result in two Items with different `item_id` values. Like all Plaid identifiers, the `item_id` is case-sensitive.

The result of the statement refresh extraction

`SUCCESS`: The statements were successfully extracted and can be listed via `/statements/list` and downloaded via `/statements/download`.

`FAILURE`: The statements failed to be extracted.

Possible values: `SUCCESS`, `FAILURE`

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "STATEMENTS",
  "webhook_code": "STATEMENTS_REFRESH_COMPLETE",
  "item_id": "eVBnVMp7zdTJLkRNr33Rs6zr7KNJqBFL9DrE6",
  "result": "SUCCESS",
  "environment": "production"
}
```
