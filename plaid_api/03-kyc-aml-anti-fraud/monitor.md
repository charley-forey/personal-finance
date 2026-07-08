---
title: "Monitor"
source_url: "https://plaid.com/docs/api/products/monitor/"
section: "KYC/AML and Anti-Fraud"
section_id: "03-kyc-aml-anti-fraud"
slug: "monitor"
endpoints:
  - "/watchlist_screening/individual/create"
  - "/watchlist_screening/individual/get"
  - "/watchlist_screening/individual/list"
  - "/watchlist_screening/individual/update"
  - "/watchlist_screening/individual/history/list"
  - "/watchlist_screening/individual/review/create"
  - "/watchlist_screening/individual/review/list"
  - "/watchlist_screening/individual/hit/list"
  - "/watchlist_screening/individual/program/get"
  - "/watchlist_screening/individual/program/list"
  - "/watchlist_screening/entity/create"
  - "/watchlist_screening/entity/get"
  - "/watchlist_screening/entity/list"
  - "/watchlist_screening/entity/update"
  - "/watchlist_screening/entity/history/list"
  - "/watchlist_screening/entity/review/create"
  - "/watchlist_screening/entity/review/list"
  - "/watchlist_screening/entity/hit/list"
  - "/watchlist_screening/entity/program/get"
  - "/watchlist_screening/entity/program/list"
  - "/dashboard_user/get"
  - "/dashboard_user/list"
  - "SCREENING: STATUS_UPDATED"
  - "ENTITY_SCREENING: STATUS_UPDATED"
  - "Webhooks"
  - "webhook_type"
  - "webhook_code"
doc_type: "plaid_api_reference"
purpose: "AI agent context for personal finance operating system"
---
# Monitor

> **Source:** [https://plaid.com/docs/api/products/monitor/](https://plaid.com/docs/api/products/monitor/)
> **Section:** KYC/AML and Anti-Fraud

## Endpoints & Webhooks on this page

- `/watchlist_screening/individual/create`
- `/watchlist_screening/individual/get`
- `/watchlist_screening/individual/list`
- `/watchlist_screening/individual/update`
- `/watchlist_screening/individual/history/list`
- `/watchlist_screening/individual/review/create`
- `/watchlist_screening/individual/review/list`
- `/watchlist_screening/individual/hit/list`
- `/watchlist_screening/individual/program/get`
- `/watchlist_screening/individual/program/list`
- `/watchlist_screening/entity/create`
- `/watchlist_screening/entity/get`
- `/watchlist_screening/entity/list`
- `/watchlist_screening/entity/update`
- `/watchlist_screening/entity/history/list`
- `/watchlist_screening/entity/review/create`
- `/watchlist_screening/entity/review/list`
- `/watchlist_screening/entity/hit/list`
- `/watchlist_screening/entity/program/get`
- `/watchlist_screening/entity/program/list`
- `/dashboard_user/get`
- `/dashboard_user/list`
- `SCREENING: STATUS_UPDATED`
- `ENTITY_SCREENING: STATUS_UPDATED`
- `Webhooks`
- `webhook_type`
- `webhook_code`

---

# Monitor

#### API reference for Monitor endpoints and webhooks

For how-to guidance, see the [Monitor documentation](/docs/monitor/).

| Endpoints |  |
| --- | --- |
| [`/watchlist_screening/individual/create`](/docs/api/products/monitor/#watchlist_screeningindividualcreate) | Create a watchlist screening for a person |
| [`/watchlist_screening/individual/get`](/docs/api/products/monitor/#watchlist_screeningindividualget) | Retrieve an individual watchlist screening |
| [`/watchlist_screening/individual/list`](/docs/api/products/monitor/#watchlist_screeningindividuallist) | List individual watchlist screenings |
| [`/watchlist_screening/individual/update`](/docs/api/products/monitor/#watchlist_screeningindividualupdate) | Update individual watchlist screening |
| [`/watchlist_screening/individual/history/list`](/docs/api/products/monitor/#watchlist_screeningindividualhistorylist) | List history for individual watchlist screenings |
| [`/watchlist_screening/individual/review/create`](/docs/api/products/monitor/#watchlist_screeningindividualreviewcreate) | Create a review for an individual watchlist screening |
| [`/watchlist_screening/individual/review/list`](/docs/api/products/monitor/#watchlist_screeningindividualreviewlist) | List reviews for individual watchlist screenings |
| [`/watchlist_screening/individual/hit/list`](/docs/api/products/monitor/#watchlist_screeningindividualhitlist) | List hits for individual watchlist screenings |
| [`/watchlist_screening/individual/program/get`](/docs/api/products/monitor/#watchlist_screeningindividualprogramget) | Get individual watchlist screening programs |
| [`/watchlist_screening/individual/program/list`](/docs/api/products/monitor/#watchlist_screeningindividualprogramlist) | List individual watchlist screening programs |
| [`/watchlist_screening/entity/create`](/docs/api/products/monitor/#watchlist_screeningentitycreate) | Create a watchlist screening for an entity |
| [`/watchlist_screening/entity/get`](/docs/api/products/monitor/#watchlist_screeningentityget) | Retrieve an entity watchlist screening |
| [`/watchlist_screening/entity/list`](/docs/api/products/monitor/#watchlist_screeningentitylist) | List entity watchlist screenings |
| [`/watchlist_screening/entity/update`](/docs/api/products/monitor/#watchlist_screeningentityupdate) | Update entity watchlist screening |
| [`/watchlist_screening/entity/history/list`](/docs/api/products/monitor/#watchlist_screeningentityhistorylist) | List history for entity watchlist screenings |
| [`/watchlist_screening/entity/review/create`](/docs/api/products/monitor/#watchlist_screeningentityreviewcreate) | Create a review for an entity watchlist screening |
| [`/watchlist_screening/entity/review/list`](/docs/api/products/monitor/#watchlist_screeningentityreviewlist) | List reviews for entity watchlist screenings |
| [`/watchlist_screening/entity/hit/list`](/docs/api/products/monitor/#watchlist_screeningentityhitlist) | List hits for entity watchlist screenings |
| [`/watchlist_screening/entity/program/get`](/docs/api/products/monitor/#watchlist_screeningentityprogramget) | Get entity watchlist screening programs |
| [`/watchlist_screening/entity/program/list`](/docs/api/products/monitor/#watchlist_screeningentityprogramlist) | List entity watchlist screening programs |

| See also |  |
| --- | --- |
| [`/dashboard_user/get`](/docs/api/kyc-aml-users/#dashboard_userget) | Retrieve information about a dashboard user |
| [`/dashboard_user/list`](/docs/api/kyc-aml-users/#dashboard_userlist) | List dashboard users |

| Webhooks |  |
| --- | --- |
| [`SCREENING: STATUS_UPDATED`](/docs/api/products/monitor/#screening-status_updated) | The status of an individual watchlist screening has changed |
| [`ENTITY_SCREENING: STATUS_UPDATED`](/docs/api/products/monitor/#entity_screening-status_updated) | The status of an entity watchlist screening has changed |

[### Endpoints](/docs/api/products/monitor/#endpoints)=\*=\*=\*=[#### `/watchlist_screening/individual/create`](/docs/api/products/monitor/#watchlist_screeningindividualcreate)

[#### Create a watchlist screening for a person](/docs/api/products/monitor/#create-a-watchlist-screening-for-a-person)

Create a new Watchlist Screening to check your customer against watchlists defined in the associated Watchlist Program. If your associated program has ongoing screening enabled, this is the profile information that will be used to monitor your customer over time.

/watchlist\_screening/individual/create

**Request fields**

Collapse all

Search inputs for creating a watchlist screening

Hide object

ID of the associated program.

The legal name of the individual being screened. Must have at least one alphabetical character, have a maximum length of 100 characters, and not include leading or trailing spaces.

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

The numeric or alphanumeric identifier associated with this document. Must be between 4 and 32 characters long, and cannot have leading or trailing spaces.

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

/watchlist\_screening/individual/create

Nodeâ¼

```
const request: WatchlistScreeningIndividualCreateRequest = {
  search_terms: {
    watchlist_program_id: 'prg_2eRPsDnL66rZ7H',
    legal_name: 'Aleksey Potemkin',
    date_of_birth: '1990-05-29',
    document_number: 'C31195855',
    country: 'US',
  },
  client_user_id: 'example-client-user-id-123',
};

try {
  const response = await client.watchlistScreeningIndividualCreate(request);
} catch (error) {
  // handle error
}
```

/watchlist\_screening/individual/create

**Response fields**

Collapse all

ID of the associated screening.

Search terms for creating an individual watchlist screening

Hide object

ID of the associated program.

The legal name of the individual being screened. Must have at least one alphabetical character, have a maximum length of 100 characters, and not include leading or trailing spaces.

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

The numeric or alphanumeric identifier associated with this document. Must be between 4 and 32 characters long, and cannot have leading or trailing spaces.

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

The current version of the search terms. Starts at `1` and increments with each edit to `search_terms`.

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

A status enum indicating whether a screening is still pending review, has been rejected, or has been cleared.

Possible values: `rejected`, `pending_review`, `cleared`

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

Information about the last change made to the parent object specifying what caused the change as well as when it occurred.

Hide object

A type indicating who or what last touched this object. `dashboard`, `link`, and `api` indicate the originating surface; `system` indicates Plaid. `retro` indicates a screening created retroactively via a bulk screening creation.

Possible values: `dashboard`, `link`, `api`, `system`, `retro`

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

An ISO8601 formatted timestamp.

Format: `date-time`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "id": "scr_52xR9LKo77r1Np",
  "search_terms": {
    "watchlist_program_id": "prg_2eRPsDnL66rZ7H",
    "legal_name": "Aleksey Potemkin",
    "date_of_birth": "1990-05-29",
    "document_number": "C31195855",
    "country": "US",
    "version": 1
  },
  "assignee": "54350110fedcbaf01234ffee",
  "status": "cleared",
  "client_user_id": "your-db-id-3b24110",
  "audit_trail": {
    "source": "dashboard",
    "dashboard_user_id": "54350110fedcbaf01234ffee",
    "timestamp": "2020-07-24T03:26:02Z"
  },
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/watchlist_screening/individual/get`](/docs/api/products/monitor/#watchlist_screeningindividualget)

[#### Retrieve an individual watchlist screening](/docs/api/products/monitor/#retrieve-an-individual-watchlist-screening)

Retrieve a previously created individual watchlist screening

/watchlist\_screening/individual/get

**Request fields**

ID of the associated screening.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

/watchlist\_screening/individual/get

Nodeâ¼

```
const request: WatchlistScreeningIndividualGetRequest = {
  watchlist_screening_id: 'scr_52xR9LKo77r1Np',
};

try {
  const response = await client.watchlistScreeningIndividualGet(request);
} catch (error) {
  // handle error
}
```

/watchlist\_screening/individual/get

**Response fields**

Collapse all

ID of the associated screening.

Search terms for creating an individual watchlist screening

Hide object

ID of the associated program.

The legal name of the individual being screened. Must have at least one alphabetical character, have a maximum length of 100 characters, and not include leading or trailing spaces.

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

The numeric or alphanumeric identifier associated with this document. Must be between 4 and 32 characters long, and cannot have leading or trailing spaces.

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

The current version of the search terms. Starts at `1` and increments with each edit to `search_terms`.

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

A status enum indicating whether a screening is still pending review, has been rejected, or has been cleared.

Possible values: `rejected`, `pending_review`, `cleared`

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

Information about the last change made to the parent object specifying what caused the change as well as when it occurred.

Hide object

A type indicating who or what last touched this object. `dashboard`, `link`, and `api` indicate the originating surface; `system` indicates Plaid. `retro` indicates a screening created retroactively via a bulk screening creation.

Possible values: `dashboard`, `link`, `api`, `system`, `retro`

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

An ISO8601 formatted timestamp.

Format: `date-time`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "id": "scr_52xR9LKo77r1Np",
  "search_terms": {
    "watchlist_program_id": "prg_2eRPsDnL66rZ7H",
    "legal_name": "Aleksey Potemkin",
    "date_of_birth": "1990-05-29",
    "document_number": "C31195855",
    "country": "US",
    "version": 1
  },
  "assignee": "54350110fedcbaf01234ffee",
  "status": "cleared",
  "client_user_id": "your-db-id-3b24110",
  "audit_trail": {
    "source": "dashboard",
    "dashboard_user_id": "54350110fedcbaf01234ffee",
    "timestamp": "2020-07-24T03:26:02Z"
  },
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/watchlist_screening/individual/list`](/docs/api/products/monitor/#watchlist_screeningindividuallist)

[#### List Individual Watchlist Screenings](/docs/api/products/monitor/#list-individual-watchlist-screenings)

List previously created watchlist screenings for individuals

/watchlist\_screening/individual/list

**Request fields**

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

ID of the associated program.

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

A status enum indicating whether a screening is still pending review, has been rejected, or has been cleared.

Possible values: `rejected`, `pending_review`, `cleared`

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

An identifier that determines which page of results you receive.

/watchlist\_screening/individual/list

Nodeâ¼

```
const request: WatchlistScreeningIndividualListRequest = {
  watchlist_program_id: 'prg_2eRPsDnL66rZ7H',
  client_user_id: 'example-client-user-id-123',
};

try {
  const response = await client.watchlistScreeningIndividualList(request);
} catch (error) {
  // handle error
}
```

/watchlist\_screening/individual/list

**Response fields**

Collapse all

List of individual watchlist screenings

Hide object

ID of the associated screening.

Search terms for creating an individual watchlist screening

Hide object

ID of the associated program.

The legal name of the individual being screened. Must have at least one alphabetical character, have a maximum length of 100 characters, and not include leading or trailing spaces.

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

The numeric or alphanumeric identifier associated with this document. Must be between 4 and 32 characters long, and cannot have leading or trailing spaces.

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

The current version of the search terms. Starts at `1` and increments with each edit to `search_terms`.

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

A status enum indicating whether a screening is still pending review, has been rejected, or has been cleared.

Possible values: `rejected`, `pending_review`, `cleared`

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

Information about the last change made to the parent object specifying what caused the change as well as when it occurred.

Hide object

A type indicating who or what last touched this object. `dashboard`, `link`, and `api` indicate the originating surface; `system` indicates Plaid. `retro` indicates a screening created retroactively via a bulk screening creation.

Possible values: `dashboard`, `link`, `api`, `system`, `retro`

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

An ISO8601 formatted timestamp.

Format: `date-time`

An identifier that determines which page of results you receive.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "watchlist_screenings": [
    {
      "id": "scr_52xR9LKo77r1Np",
      "search_terms": {
        "watchlist_program_id": "prg_2eRPsDnL66rZ7H",
        "legal_name": "Aleksey Potemkin",
        "date_of_birth": "1990-05-29",
        "document_number": "C31195855",
        "country": "US",
        "version": 1
      },
      "assignee": "54350110fedcbaf01234ffee",
      "status": "cleared",
      "client_user_id": "your-db-id-3b24110",
      "audit_trail": {
        "source": "dashboard",
        "dashboard_user_id": "54350110fedcbaf01234ffee",
        "timestamp": "2020-07-24T03:26:02Z"
      }
    }
  ],
  "next_cursor": "eyJkaXJlY3Rpb24iOiJuZXh0Iiwib2Zmc2V0IjoiMTU5NDM",
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/watchlist_screening/individual/update`](/docs/api/products/monitor/#watchlist_screeningindividualupdate)

[#### Update individual watchlist screening](/docs/api/products/monitor/#update-individual-watchlist-screening)

Update a specific individual watchlist screening. This endpoint can be used to add additional customer information, correct outdated information, add a reference id, assign the individual to a reviewer, and update which program it is associated with. Please note that you may not update `search_terms` and `status` at the same time since editing `search_terms` may trigger an automatic `status` change.

/watchlist\_screening/individual/update

**Request fields**

Collapse all

ID of the associated screening.

Search terms for editing an individual watchlist screening

Hide object

ID of the associated program.

The legal name of the individual being screened. Must have at least one alphabetical character, have a maximum length of 100 characters, and not include leading or trailing spaces.

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

The numeric or alphanumeric identifier associated with this document. Must be between 4 and 32 characters long, and cannot have leading or trailing spaces.

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

A status enum indicating whether a screening is still pending review, has been rejected, or has been cleared.

Possible values: `rejected`, `pending_review`, `cleared`

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

A list of fields to reset back to null

Possible values: `assignee`

/watchlist\_screening/individual/update

Nodeâ¼

```
const request: WatchlistScreeningIndividualUpdateRequest = {
  watchlist_screening_id: 'scr_52xR9LKo77r1Np',
  status: 'cleared',
};

try {
  const response = await client.watchlistScreeningIndividualUpdate(request);
} catch (error) {
  // handle error
}
```

/watchlist\_screening/individual/update

**Response fields**

Collapse all

ID of the associated screening.

Search terms for creating an individual watchlist screening

Hide object

ID of the associated program.

The legal name of the individual being screened. Must have at least one alphabetical character, have a maximum length of 100 characters, and not include leading or trailing spaces.

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

The numeric or alphanumeric identifier associated with this document. Must be between 4 and 32 characters long, and cannot have leading or trailing spaces.

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

The current version of the search terms. Starts at `1` and increments with each edit to `search_terms`.

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

A status enum indicating whether a screening is still pending review, has been rejected, or has been cleared.

Possible values: `rejected`, `pending_review`, `cleared`

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

Information about the last change made to the parent object specifying what caused the change as well as when it occurred.

Hide object

A type indicating who or what last touched this object. `dashboard`, `link`, and `api` indicate the originating surface; `system` indicates Plaid. `retro` indicates a screening created retroactively via a bulk screening creation.

Possible values: `dashboard`, `link`, `api`, `system`, `retro`

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

An ISO8601 formatted timestamp.

Format: `date-time`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "id": "scr_52xR9LKo77r1Np",
  "search_terms": {
    "watchlist_program_id": "prg_2eRPsDnL66rZ7H",
    "legal_name": "Aleksey Potemkin",
    "date_of_birth": "1990-05-29",
    "document_number": "C31195855",
    "country": "US",
    "version": 1
  },
  "assignee": "54350110fedcbaf01234ffee",
  "status": "cleared",
  "client_user_id": "your-db-id-3b24110",
  "audit_trail": {
    "source": "dashboard",
    "dashboard_user_id": "54350110fedcbaf01234ffee",
    "timestamp": "2020-07-24T03:26:02Z"
  },
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/watchlist_screening/individual/history/list`](/docs/api/products/monitor/#watchlist_screeningindividualhistorylist)

[#### List history for individual watchlist screenings](/docs/api/products/monitor/#list-history-for-individual-watchlist-screenings)

List all changes to the individual watchlist screening in reverse-chronological order. If the watchlist screening has not been edited, no history will be returned.

/watchlist\_screening/individual/history/list

**Request fields**

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

ID of the associated screening.

An identifier that determines which page of results you receive.

/watchlist\_screening/individual/history/list

Nodeâ¼

```
const request: WatchlistScreeningIndividualHistoryListRequest = {
  watchlist_screening_id: 'scr_52xR9LKo77r1Np',
};

try {
  const response = await client.watchlistScreeningIndividualHistoryList(
    request,
  );
} catch (error) {
  // handle error
}
```

/watchlist\_screening/individual/history/list

**Response fields**

Collapse all

List of individual watchlist screenings

Hide object

ID of the associated screening.

Search terms for creating an individual watchlist screening

Hide object

ID of the associated program.

The legal name of the individual being screened. Must have at least one alphabetical character, have a maximum length of 100 characters, and not include leading or trailing spaces.

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

The numeric or alphanumeric identifier associated with this document. Must be between 4 and 32 characters long, and cannot have leading or trailing spaces.

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

The current version of the search terms. Starts at `1` and increments with each edit to `search_terms`.

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

A status enum indicating whether a screening is still pending review, has been rejected, or has been cleared.

Possible values: `rejected`, `pending_review`, `cleared`

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

Information about the last change made to the parent object specifying what caused the change as well as when it occurred.

Hide object

A type indicating who or what last touched this object. `dashboard`, `link`, and `api` indicate the originating surface; `system` indicates Plaid. `retro` indicates a screening created retroactively via a bulk screening creation.

Possible values: `dashboard`, `link`, `api`, `system`, `retro`

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

An ISO8601 formatted timestamp.

Format: `date-time`

An identifier that determines which page of results you receive.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "watchlist_screenings": [
    {
      "id": "scr_52xR9LKo77r1Np",
      "search_terms": {
        "watchlist_program_id": "prg_2eRPsDnL66rZ7H",
        "legal_name": "Aleksey Potemkin",
        "date_of_birth": "1990-05-29",
        "document_number": "C31195855",
        "country": "US",
        "version": 1
      },
      "assignee": "54350110fedcbaf01234ffee",
      "status": "cleared",
      "client_user_id": "your-db-id-3b24110",
      "audit_trail": {
        "source": "dashboard",
        "dashboard_user_id": "54350110fedcbaf01234ffee",
        "timestamp": "2020-07-24T03:26:02Z"
      }
    }
  ],
  "next_cursor": "eyJkaXJlY3Rpb24iOiJuZXh0Iiwib2Zmc2V0IjoiMTU5NDM",
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/watchlist_screening/individual/review/create`](/docs/api/products/monitor/#watchlist_screeningindividualreviewcreate)

[#### Create a review for an individual watchlist screening](/docs/api/products/monitor/#create-a-review-for-an-individual-watchlist-screening)

Create a review for the individual watchlist screening. Reviews are compliance reports created by users in your organization regarding the relevance of potential hits found by Plaid.

/watchlist\_screening/individual/review/create

**Request fields**

Hits to mark as a true positive after thorough manual review. These hits will never recur or be updated once confirmed. In most cases, confirmed hits indicate that the customer should be rejected.

Hits to mark as a false positive after thorough manual review. These hits will never recur or be updated once dismissed.

A comment submitted by a team member as part of reviewing a watchlist screening.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

ID of the associated screening.

/watchlist\_screening/individual/review/create

Nodeâ¼

```
const request: WatchlistScreeningIndividualReviewCreateRequest = {
  confirmed_hits: ['scrhit_52xR9LKo77r1Np'],
  dismissed_hits: [],
  watchlist_screening_id: 'scr_52xR9LKo77r1Np',
};

try {
  const response = await client.watchlistScreeningIndividualReviewCreate(
    request,
  );
} catch (error) {
  // handle error
}
```

/watchlist\_screening/individual/review/create

**Response fields**

Collapse all

ID of the associated review.

Hits marked as a true positive after thorough manual review. These hits will never recur or be updated once confirmed. In most cases, confirmed hits indicate that the customer should be rejected.

Hits marked as a false positive after thorough manual review. These hits will never recur or be updated once dismissed.

A comment submitted by a team member as part of reviewing a watchlist screening.

Information about the last change made to the parent object specifying what caused the change as well as when it occurred.

Hide object

A type indicating who or what last touched this object. `dashboard`, `link`, and `api` indicate the originating surface; `system` indicates Plaid. `retro` indicates a screening created retroactively via a bulk screening creation.

Possible values: `dashboard`, `link`, `api`, `system`, `retro`

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

An ISO8601 formatted timestamp.

Format: `date-time`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "id": "rev_aCLNRxK3UVzn2r",
  "confirmed_hits": [
    "scrhit_52xR9LKo77r1Np"
  ],
  "dismissed_hits": [
    "scrhit_52xR9LKo77r1Np"
  ],
  "comment": "These look like legitimate matches, rejecting the customer.",
  "audit_trail": {
    "source": "dashboard",
    "dashboard_user_id": "54350110fedcbaf01234ffee",
    "timestamp": "2020-07-24T03:26:02Z"
  },
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/watchlist_screening/individual/review/list`](/docs/api/products/monitor/#watchlist_screeningindividualreviewlist)

[#### List reviews for individual watchlist screenings](/docs/api/products/monitor/#list-reviews-for-individual-watchlist-screenings)

List all reviews for the individual watchlist screening.

/watchlist\_screening/individual/review/list

**Request fields**

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

ID of the associated screening.

An identifier that determines which page of results you receive.

/watchlist\_screening/individual/review/list

Nodeâ¼

```
const request: WatchlistScreeningIndividualReviewListRequest = {
  watchlist_screening_id: 'scr_52xR9LKo77r1Np',
};

try {
  const response = await client.watchlistScreeningIndividualReviewList(request);
} catch (error) {
  // handle error
}
```

/watchlist\_screening/individual/review/list

**Response fields**

Collapse all

List of screening reviews

Hide object

ID of the associated review.

Hits marked as a true positive after thorough manual review. These hits will never recur or be updated once confirmed. In most cases, confirmed hits indicate that the customer should be rejected.

Hits marked as a false positive after thorough manual review. These hits will never recur or be updated once dismissed.

A comment submitted by a team member as part of reviewing a watchlist screening.

Information about the last change made to the parent object specifying what caused the change as well as when it occurred.

Hide object

A type indicating who or what last touched this object. `dashboard`, `link`, and `api` indicate the originating surface; `system` indicates Plaid. `retro` indicates a screening created retroactively via a bulk screening creation.

Possible values: `dashboard`, `link`, `api`, `system`, `retro`

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

An ISO8601 formatted timestamp.

Format: `date-time`

An identifier that determines which page of results you receive.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "watchlist_screening_reviews": [
    {
      "id": "rev_aCLNRxK3UVzn2r",
      "confirmed_hits": [
        "scrhit_52xR9LKo77r1Np"
      ],
      "dismissed_hits": [
        "scrhit_52xR9LKo77r1Np"
      ],
      "comment": "These look like legitimate matches, rejecting the customer.",
      "audit_trail": {
        "source": "dashboard",
        "dashboard_user_id": "54350110fedcbaf01234ffee",
        "timestamp": "2020-07-24T03:26:02Z"
      }
    }
  ],
  "next_cursor": "eyJkaXJlY3Rpb24iOiJuZXh0Iiwib2Zmc2V0IjoiMTU5NDM",
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/watchlist_screening/individual/hit/list`](/docs/api/products/monitor/#watchlist_screeningindividualhitlist)

[#### List hits for individual watchlist screening](/docs/api/products/monitor/#list-hits-for-individual-watchlist-screening)

List all hits found by Plaid for a particular individual watchlist screening.

/watchlist\_screening/individual/hit/list

**Request fields**

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

ID of the associated screening.

An identifier that determines which page of results you receive.

/watchlist\_screening/individual/hit/list

Nodeâ¼

```
const request: WatchlistScreeningIndividualHitListRequest = {
  watchlist_screening_id: 'scr_52xR9LKo77r1Np',
};

try {
  const response = await client.watchlistScreeningIndividualHitList(request);
} catch (error) {
  // handle error
}
```

/watchlist\_screening/individual/hit/list

**Response fields**

Collapse all

List of individual watchlist screening hits

Hide object

ID of the associated screening hit.

The current state of review. All watchlist screening hits begin in a `pending_review` state but can be changed by creating a review. When a hit is in the `pending_review` state, it will always show the latest version of the watchlist data Plaid has available and be compared against the latest customer information saved in the watchlist screening. Once a hit has been marked as `confirmed` or `dismissed` it will no longer be updated so that the state is as it was when the review was first conducted.

Possible values: `confirmed`, `pending_review`, `dismissed`

An ISO8601 formatted timestamp.

Format: `date-time`

An ISO8601 formatted timestamp.

Format: `date-time`

An ISO8601 formatted timestamp.

Format: `date-time`

Shorthand identifier for a specific screening list for individuals.
`AU_CON`: Australia Department of Foreign Affairs and Trade Consolidated List
`CA_CON`: Government of Canada Consolidated List of Sanctions
`EU_CON`: European External Action Service Consolidated List
`IZ_CIA`: CIA List of Chiefs of State and Cabinet Members
`IZ_IPL`: Interpol Red Notices for Wanted Persons List
`IZ_PEP`: Politically Exposed Persons List
`IZ_UNC`: United Nations Consolidated Sanctions
`IZ_WBK`: World Bank Listing of Ineligible Firms and Individuals
`UK_HMC`: Foreign, Commonwealth & Development Office UK Sanctions List
`US_DPL`: Bureau of Industry and Security Denied Persons List
`US_DTC`: US Department of State AECA Debarred
`US_FBI`: US Department of Justice FBI Wanted List
`US_FSE`: US OFAC Foreign Sanctions Evaders
`US_ISN`: US Department of State Nonproliferation Sanctions
`US_MBS`: US Non-SDN Menu-Based Sanctions
`US_PLC`: US OFAC Palestinian Legislative Council
`US_SAM`: US System for Award Management Exclusion List
`US_SDN`: US OFAC Specially Designated Nationals List
`US_SSI`: US OFAC Sectoral Sanctions Identifications
`SG_SOF`: Government of Singapore Terrorists and Terrorist Entities
`TR_TWL`: Government of Turkey Terrorist Wanted List
`TR_DFD`: Government of Turkey Domestic Freezing Decisions
`TR_FOR`: Government of Turkey Foreign Freezing Requests
`TR_WMD`: Government of Turkey Weapons of Mass Destruction
`TR_CMB`: Government of Turkey Capital Markets Board

Possible values: `AU_CON`, `CA_CON`, `EU_CON`, `IZ_CIA`, `IZ_IPL`, `IZ_PEP`, `IZ_UNC`, `IZ_WBK`, `UK_HMC`, `US_DPL`, `US_DTC`, `US_FBI`, `US_FSE`, `US_ISN`, `US_MBS`, `US_PLC`, `US_SAM`, `US_SDN`, `US_SSI`, `SG_SOF`, `TR_TWL`, `TR_DFD`, `TR_FOR`, `TR_WMD`, `TR_CMB`

A universal identifier for a watchlist individual that is stable across searches and updates.

The identifier provided by the source sanction or watchlist. When one is not provided by the source, this is `null`.

Sub-program designations that may be attached to the watchlist entry by the issuing authority. For OFAC SDN
entries these are the program codes published in the SDN list (for example `SDGT` for Specially
Designated Global Terrorists, `SDNTK` for Specially Designated Narcotics Trafficking Kingpins,
`IRAN`, `RUSSIA-EO14024`). New codes are added by sanctioning authorities without prior notice,
so callers should treat unknown values as opaque strings rather than enum members.

Analysis information describing why a screening hit matched the provided user information

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

The version of the screening's `search_terms` that were compared when the screening hit was added. Screening hits are immutable once they have been reviewed. If changes are detected due to updates to the screening's `search_terms`, the associated program, or the list's source data prior to review, the screening hit will be updated to reflect those changes.

Information associated with the watchlist hit

Hide object

Dates of birth associated with the watchlist hit

Hide object

Summary object reflecting the match result of the associated data

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

A date range with a start and end date

Hide object

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

A date in the format YYYY-MM-DD (RFC 3339 Section 5.6).

Format: `date`

Documents associated with the watchlist hit

Hide object

Summary object reflecting the match result of the associated data

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

An official document, usually issued by a governing body or institution, with an associated identifier.

Hide object

The kind of official document represented by this object.

`birth_certificate` - A certificate of birth

`drivers_license` - A license to operate a motor vehicle

`immigration_number` - Immigration or residence documents

`military_id` - Identification issued by a military group

`other` - Any document not covered by other categories

`passport` - An official passport issued by a government

`personal_identification` - Any generic personal identification that is not covered by other categories

`ration_card` - Identification that entitles the holder to rations

`ssn` - United States Social Security Number

`student_id` - Identification issued by an educational institution

`tax_id` - Identification issued for the purpose of collecting taxes

`travel_document` - Visas, entry permits, refugee documents, etc.

`voter_id` - Identification issued for the purpose of voting

Possible values: `birth_certificate`, `drivers_license`, `immigration_number`, `military_id`, `other`, `passport`, `personal_identification`, `ration_card`, `ssn`, `student_id`, `tax_id`, `travel_document`, `voter_id`

The numeric or alphanumeric identifier associated with this document. Must be between 4 and 32 characters long, and cannot have leading or trailing spaces.

Locations associated with the watchlist hit

Hide object

Summary object reflecting the match result of the associated data

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Location information for the associated individual watchlist hit

Hide object

The full location string, potentially including elements like street, city, postal codes and country codes. Note that this is not necessarily a complete or well-formatted address.

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

Names associated with the watchlist hit

Hide object

Summary object reflecting the match result of the associated data

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Name information for the associated individual watchlist hit

Hide object

The full name of the individual, including all parts.

Primary names are those most commonly used to refer to this person. Only one name will ever be marked as primary.

Names that are explicitly marked as low quality either by their `source` list, or by `plaid` by a series of additional checks done by Plaid. Plaid does not ever surface a hit as a result of a weak name alone. If a name has no quality issues, this value will be `none`.

Possible values: `none`, `source`, `plaid`

An identifier that determines which page of results you receive.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "watchlist_screening_hits": [
    {
      "id": "scrhit_52xR9LKo77r1Np",
      "review_status": "pending_review",
      "first_active": "2020-07-24T03:26:02Z",
      "inactive_since": "2020-07-24T03:26:02Z",
      "historical_since": "2020-07-24T03:26:02Z",
      "list_code": "US_SDN",
      "plaid_uid": "uid_3NggckTimGSJHS",
      "source_uid": "26192ABC",
      "sub_programs": [
        "SDGT"
      ],
      "analysis": {
        "dates_of_birth": "match",
        "documents": "match",
        "locations": "match",
        "names": "match",
        "search_terms_version": 1
      },
      "data": {
        "dates_of_birth": [
          {
            "analysis": {
              "summary": "match"
            },
            "data": {
              "beginning": "1990-05-29",
              "ending": "1990-05-29"
            }
          }
        ],
        "documents": [
          {
            "analysis": {
              "summary": "match"
            },
            "data": {
              "type": "passport",
              "number": "C31195855"
            }
          }
        ],
        "locations": [
          {
            "analysis": {
              "summary": "match"
            },
            "data": {
              "full": "Florida, US",
              "country": "US"
            }
          }
        ],
        "names": [
          {
            "analysis": {
              "summary": "match"
            },
            "data": {
              "full": "Aleksey Potemkin",
              "is_primary": false,
              "weak_alias_determination": "none"
            }
          }
        ]
      }
    }
  ],
  "next_cursor": "eyJkaXJlY3Rpb24iOiJuZXh0Iiwib2Zmc2V0IjoiMTU5NDM",
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/watchlist_screening/individual/program/get`](/docs/api/products/monitor/#watchlist_screeningindividualprogramget)

[#### Get individual watchlist screening program](/docs/api/products/monitor/#get-individual-watchlist-screening-program)

Get an individual watchlist screening program

/watchlist\_screening/individual/program/get

**Request fields**

ID of the associated program.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

/watchlist\_screening/individual/program/get

Nodeâ¼

```
const request: WatchlistScreeningIndividualProgramGetRequest = {
  watchlist_program_id: 'prg_2eRPsDnL66rZ7H',
};

try {
  const response = await client.watchlistScreeningIndividualProgramGet(request);
} catch (error) {
  // handle error
}
```

/watchlist\_screening/individual/program/get

**Response fields**

Collapse all

ID of the associated program.

An ISO8601 formatted timestamp.

Format: `date-time`

Indicator specifying whether the program is enabled and will perform daily rescans.

Watchlists enabled for the associated program

Possible values: `AU_CON`, `CA_CON`, `EU_CON`, `IZ_CIA`, `IZ_IPL`, `IZ_PEP`, `IZ_UNC`, `IZ_WBK`, `UK_HMC`, `US_DPL`, `US_DTC`, `US_FBI`, `US_FSE`, `US_ISN`, `US_MBS`, `US_PLC`, `US_SAM`, `US_SDN`, `US_SSI`, `SG_SOF`, `TR_TWL`, `TR_DFD`, `TR_FOR`, `TR_WMD`, `TR_CMB`

A name for the program to define its purpose. For example, "High Risk Individuals", "US Cardholders", or "Applicants".

The valid name matching sensitivity configurations for a screening program. Note that while certain matching techniques may be more prevalent on less strict settings, all matching algorithms are enabled for every sensitivity.

`coarse` - See more potential matches. This sensitivity will see more broad phonetic matches across alphabets that make missing a potential hit very unlikely. This setting is noisier and will require more manual review.

`balanced` - A good default for most companies. This sensitivity is balanced to show high quality hits with reduced noise.

`strict` - Aggressive false positive reduction. This sensitivity will require names to be more similar than `coarse` and `balanced` settings, relying less on phonetics, while still accounting for character transpositions, missing tokens, and other common permutations.

`exact` - Matches must be nearly exact. This sensitivity will only show hits with exact or nearly exact name matches with only basic correction such as extraneous symbols and capitalization. This setting is generally not recommended unless you have a very specific use case.

Possible values: `coarse`, `balanced`, `strict`, `exact`

Information about the last change made to the parent object specifying what caused the change as well as when it occurred.

Hide object

A type indicating who or what last touched this object. `dashboard`, `link`, and `api` indicate the originating surface; `system` indicates Plaid. `retro` indicates a screening created retroactively via a bulk screening creation.

Possible values: `dashboard`, `link`, `api`, `system`, `retro`

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

An ISO8601 formatted timestamp.

Format: `date-time`

Archived programs are read-only and cannot screen new customers nor participate in ongoing monitoring.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "id": "prg_2eRPsDnL66rZ7H",
  "created_at": "2020-07-24T03:26:02Z",
  "is_rescanning_enabled": true,
  "lists_enabled": [
    "US_SDN"
  ],
  "name": "Sample Program",
  "name_sensitivity": "balanced",
  "audit_trail": {
    "source": "dashboard",
    "dashboard_user_id": "54350110fedcbaf01234ffee",
    "timestamp": "2020-07-24T03:26:02Z"
  },
  "is_archived": false,
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/watchlist_screening/individual/program/list`](/docs/api/products/monitor/#watchlist_screeningindividualprogramlist)

[#### List individual watchlist screening programs](/docs/api/products/monitor/#list-individual-watchlist-screening-programs)

List all individual watchlist screening programs

/watchlist\_screening/individual/program/list

**Request fields**

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

An identifier that determines which page of results you receive.

/watchlist\_screening/individual/program/list

Nodeâ¼

```
try {
  const response = await client.watchlistScreeningIndividualProgramList({});
} catch (error) {
  // handle error
}
```

/watchlist\_screening/individual/program/list

**Response fields**

Collapse all

List of individual watchlist screening programs

Hide object

ID of the associated program.

An ISO8601 formatted timestamp.

Format: `date-time`

Indicator specifying whether the program is enabled and will perform daily rescans.

Watchlists enabled for the associated program

Possible values: `AU_CON`, `CA_CON`, `EU_CON`, `IZ_CIA`, `IZ_IPL`, `IZ_PEP`, `IZ_UNC`, `IZ_WBK`, `UK_HMC`, `US_DPL`, `US_DTC`, `US_FBI`, `US_FSE`, `US_ISN`, `US_MBS`, `US_PLC`, `US_SAM`, `US_SDN`, `US_SSI`, `SG_SOF`, `TR_TWL`, `TR_DFD`, `TR_FOR`, `TR_WMD`, `TR_CMB`

A name for the program to define its purpose. For example, "High Risk Individuals", "US Cardholders", or "Applicants".

The valid name matching sensitivity configurations for a screening program. Note that while certain matching techniques may be more prevalent on less strict settings, all matching algorithms are enabled for every sensitivity.

`coarse` - See more potential matches. This sensitivity will see more broad phonetic matches across alphabets that make missing a potential hit very unlikely. This setting is noisier and will require more manual review.

`balanced` - A good default for most companies. This sensitivity is balanced to show high quality hits with reduced noise.

`strict` - Aggressive false positive reduction. This sensitivity will require names to be more similar than `coarse` and `balanced` settings, relying less on phonetics, while still accounting for character transpositions, missing tokens, and other common permutations.

`exact` - Matches must be nearly exact. This sensitivity will only show hits with exact or nearly exact name matches with only basic correction such as extraneous symbols and capitalization. This setting is generally not recommended unless you have a very specific use case.

Possible values: `coarse`, `balanced`, `strict`, `exact`

Information about the last change made to the parent object specifying what caused the change as well as when it occurred.

Hide object

A type indicating who or what last touched this object. `dashboard`, `link`, and `api` indicate the originating surface; `system` indicates Plaid. `retro` indicates a screening created retroactively via a bulk screening creation.

Possible values: `dashboard`, `link`, `api`, `system`, `retro`

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

An ISO8601 formatted timestamp.

Format: `date-time`

Archived programs are read-only and cannot screen new customers nor participate in ongoing monitoring.

An identifier that determines which page of results you receive.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "watchlist_programs": [
    {
      "id": "prg_2eRPsDnL66rZ7H",
      "created_at": "2020-07-24T03:26:02Z",
      "is_rescanning_enabled": true,
      "lists_enabled": [
        "US_SDN"
      ],
      "name": "Sample Program",
      "name_sensitivity": "balanced",
      "audit_trail": {
        "source": "dashboard",
        "dashboard_user_id": "54350110fedcbaf01234ffee",
        "timestamp": "2020-07-24T03:26:02Z"
      },
      "is_archived": false
    }
  ],
  "next_cursor": "eyJkaXJlY3Rpb24iOiJuZXh0Iiwib2Zmc2V0IjoiMTU5NDM",
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/watchlist_screening/entity/create`](/docs/api/products/monitor/#watchlist_screeningentitycreate)

[#### Create a watchlist screening for an entity](/docs/api/products/monitor/#create-a-watchlist-screening-for-an-entity)

Create a new entity watchlist screening to check your customer against watchlists defined in the associated entity watchlist program. If your associated program has ongoing screening enabled, this is the profile information that will be used to monitor your customer over time.

/watchlist\_screening/entity/create

**Request fields**

Collapse all

Search inputs for creating an entity watchlist screening

Hide object

ID of the associated entity program.

The name of the organization being screened. Must have at least one alphabetical character, have a maximum length of 100 characters, and not include leading or trailing spaces.

The numeric or alphanumeric identifier associated with this document. Must be between 4 and 32 characters long, and cannot have leading or trailing spaces.

A valid email address. Must not have leading or trailing spaces and address must be RFC compliant. For more information, see [RFC 3696](https://datatracker.ietf.org/doc/html/rfc3696).

Format: `email`

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

A phone number in E.164 format.

An 'http' or 'https' URL (must begin with either of those).

Format: `uri`

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

/watchlist\_screening/entity/create

Nodeâ¼

```
const request: WatchlistScreeningEntityCreateRequest = {
  search_terms: {
    entity_watchlist_program_id: 'entprg_2eRPsDnL66rZ7H',
    legal_name: 'Example Screening Entity',
    document_number: 'C31195855',
    email_address: 'user@example.com',
    country: 'US',
    phone_number: '+14025671234',
    url: 'https://example.com',
  },
  client_user_id: 'example-client-user-id-123',
};

try {
  const response = await client.watchlistScreeningEntityCreate(request);
} catch (error) {
  // handle error
}
```

/watchlist\_screening/entity/create

**Response fields**

Collapse all

ID of the associated entity screening.

Search terms associated with an entity used for searching against watchlists

Hide object

ID of the associated entity program.

The name of the organization being screened. Must have at least one alphabetical character, have a maximum length of 100 characters, and not include leading or trailing spaces.

The numeric or alphanumeric identifier associated with this document. Must be between 4 and 32 characters long, and cannot have leading or trailing spaces.

A valid email address. Must not have leading or trailing spaces and address must be RFC compliant. For more information, see [RFC 3696](https://datatracker.ietf.org/doc/html/rfc3696).

Format: `email`

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

A phone number in E.164 format.

An 'http' or 'https' URL (must begin with either of those).

Format: `uri`

The current version of the search terms. Starts at `1` and increments with each edit to `search_terms`.

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

A status enum indicating whether a screening is still pending review, has been rejected, or has been cleared.

Possible values: `rejected`, `pending_review`, `cleared`

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

Information about the last change made to the parent object specifying what caused the change as well as when it occurred.

Hide object

A type indicating who or what last touched this object. `dashboard`, `link`, and `api` indicate the originating surface; `system` indicates Plaid. `retro` indicates a screening created retroactively via a bulk screening creation.

Possible values: `dashboard`, `link`, `api`, `system`, `retro`

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

An ISO8601 formatted timestamp.

Format: `date-time`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "id": "entscr_52xR9LKo77r1Np",
  "search_terms": {
    "entity_watchlist_program_id": "entprg_2eRPsDnL66rZ7H",
    "legal_name": "Al-Qaida",
    "document_number": "C31195855",
    "email_address": "user@example.com",
    "country": "US",
    "phone_number": "+14025671234",
    "url": "https://example.com",
    "version": 1
  },
  "assignee": "54350110fedcbaf01234ffee",
  "status": "cleared",
  "client_user_id": "your-db-id-3b24110",
  "audit_trail": {
    "source": "dashboard",
    "dashboard_user_id": "54350110fedcbaf01234ffee",
    "timestamp": "2020-07-24T03:26:02Z"
  },
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/watchlist_screening/entity/get`](/docs/api/products/monitor/#watchlist_screeningentityget)

[#### Get an entity screening](/docs/api/products/monitor/#get-an-entity-screening)

Retrieve an entity watchlist screening.

/watchlist\_screening/entity/get

**Request fields**

ID of the associated entity screening.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

/watchlist\_screening/entity/get

Nodeâ¼

```
const request: WatchlistScreeningEntityGetRequest = {
  entity_watchlist_screening_id: 'entscr_52xR9LKo77r1Np',
};

try {
  const response = await client.watchlistScreeningEntityGet(request);
} catch (error) {
  // handle error
}
```

/watchlist\_screening/entity/get

**Response fields**

Collapse all

ID of the associated entity screening.

Search terms associated with an entity used for searching against watchlists

Hide object

ID of the associated entity program.

The name of the organization being screened. Must have at least one alphabetical character, have a maximum length of 100 characters, and not include leading or trailing spaces.

The numeric or alphanumeric identifier associated with this document. Must be between 4 and 32 characters long, and cannot have leading or trailing spaces.

A valid email address. Must not have leading or trailing spaces and address must be RFC compliant. For more information, see [RFC 3696](https://datatracker.ietf.org/doc/html/rfc3696).

Format: `email`

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

A phone number in E.164 format.

An 'http' or 'https' URL (must begin with either of those).

Format: `uri`

The current version of the search terms. Starts at `1` and increments with each edit to `search_terms`.

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

A status enum indicating whether a screening is still pending review, has been rejected, or has been cleared.

Possible values: `rejected`, `pending_review`, `cleared`

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

Information about the last change made to the parent object specifying what caused the change as well as when it occurred.

Hide object

A type indicating who or what last touched this object. `dashboard`, `link`, and `api` indicate the originating surface; `system` indicates Plaid. `retro` indicates a screening created retroactively via a bulk screening creation.

Possible values: `dashboard`, `link`, `api`, `system`, `retro`

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

An ISO8601 formatted timestamp.

Format: `date-time`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "id": "entscr_52xR9LKo77r1Np",
  "search_terms": {
    "entity_watchlist_program_id": "entprg_2eRPsDnL66rZ7H",
    "legal_name": "Al-Qaida",
    "document_number": "C31195855",
    "email_address": "user@example.com",
    "country": "US",
    "phone_number": "+14025671234",
    "url": "https://example.com",
    "version": 1
  },
  "assignee": "54350110fedcbaf01234ffee",
  "status": "cleared",
  "client_user_id": "your-db-id-3b24110",
  "audit_trail": {
    "source": "dashboard",
    "dashboard_user_id": "54350110fedcbaf01234ffee",
    "timestamp": "2020-07-24T03:26:02Z"
  },
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/watchlist_screening/entity/list`](/docs/api/products/monitor/#watchlist_screeningentitylist)

[#### List entity watchlist screenings](/docs/api/products/monitor/#list-entity-watchlist-screenings)

List all entity screenings.

/watchlist\_screening/entity/list

**Request fields**

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

ID of the associated entity program.

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

A status enum indicating whether a screening is still pending review, has been rejected, or has been cleared.

Possible values: `rejected`, `pending_review`, `cleared`

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

An identifier that determines which page of results you receive.

/watchlist\_screening/entity/list

Nodeâ¼

```
const request: WatchlistScreeningEntityListRequest = {
  entity_watchlist_program_id: 'entprg_2eRPsDnL66rZ7H',
};

try {
  const response = await client.watchlistScreeningEntityList(request);
} catch (error) {
  // handle error
}
```

/watchlist\_screening/entity/list

**Response fields**

Collapse all

List of entity watchlist screening

Hide object

ID of the associated entity screening.

Search terms associated with an entity used for searching against watchlists

Hide object

ID of the associated entity program.

The name of the organization being screened. Must have at least one alphabetical character, have a maximum length of 100 characters, and not include leading or trailing spaces.

The numeric or alphanumeric identifier associated with this document. Must be between 4 and 32 characters long, and cannot have leading or trailing spaces.

A valid email address. Must not have leading or trailing spaces and address must be RFC compliant. For more information, see [RFC 3696](https://datatracker.ietf.org/doc/html/rfc3696).

Format: `email`

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

A phone number in E.164 format.

An 'http' or 'https' URL (must begin with either of those).

Format: `uri`

The current version of the search terms. Starts at `1` and increments with each edit to `search_terms`.

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

A status enum indicating whether a screening is still pending review, has been rejected, or has been cleared.

Possible values: `rejected`, `pending_review`, `cleared`

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

Information about the last change made to the parent object specifying what caused the change as well as when it occurred.

Hide object

A type indicating who or what last touched this object. `dashboard`, `link`, and `api` indicate the originating surface; `system` indicates Plaid. `retro` indicates a screening created retroactively via a bulk screening creation.

Possible values: `dashboard`, `link`, `api`, `system`, `retro`

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

An ISO8601 formatted timestamp.

Format: `date-time`

An identifier that determines which page of results you receive.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "entity_watchlist_screenings": [
    {
      "id": "entscr_52xR9LKo77r1Np",
      "search_terms": {
        "entity_watchlist_program_id": "entprg_2eRPsDnL66rZ7H",
        "legal_name": "Al-Qaida",
        "document_number": "C31195855",
        "email_address": "user@example.com",
        "country": "US",
        "phone_number": "+14025671234",
        "url": "https://example.com",
        "version": 1
      },
      "assignee": "54350110fedcbaf01234ffee",
      "status": "cleared",
      "client_user_id": "your-db-id-3b24110",
      "audit_trail": {
        "source": "dashboard",
        "dashboard_user_id": "54350110fedcbaf01234ffee",
        "timestamp": "2020-07-24T03:26:02Z"
      }
    }
  ],
  "next_cursor": "eyJkaXJlY3Rpb24iOiJuZXh0Iiwib2Zmc2V0IjoiMTU5NDM",
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/watchlist_screening/entity/update`](/docs/api/products/monitor/#watchlist_screeningentityupdate)

[#### Update an entity screening](/docs/api/products/monitor/#update-an-entity-screening)

Update an entity watchlist screening.

/watchlist\_screening/entity/update

**Request fields**

Collapse all

ID of the associated entity screening.

Search terms for editing an entity watchlist screening

Hide object

ID of the associated entity program.

The name of the organization being screened. Must have at least one alphabetical character, have a maximum length of 100 characters, and not include leading or trailing spaces.

The numeric or alphanumeric identifier associated with this document. Must be between 4 and 32 characters long, and cannot have leading or trailing spaces.

A valid email address. Must not have leading or trailing spaces and address must be RFC compliant. For more information, see [RFC 3696](https://datatracker.ietf.org/doc/html/rfc3696).

Format: `email`

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

A phone number in E.164 format.

An 'http' or 'https' URL (must begin with either of those).

Format: `uri`

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

A status enum indicating whether a screening is still pending review, has been rejected, or has been cleared.

Possible values: `rejected`, `pending_review`, `cleared`

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

A list of fields to reset back to null

Possible values: `assignee`

/watchlist\_screening/entity/update

Nodeâ¼

```
const request: WatchlistScreeningEntityUpdateRequest = {
  entity_watchlist_screening_id: 'entscr_52xR9LKo77r1Np',
  status: 'cleared',
};

try {
  const response = await client.watchlistScreeningEntityUpdate(request);
} catch (error) {
  // handle error
}
```

/watchlist\_screening/entity/update

**Response fields**

Collapse all

ID of the associated entity screening.

Search terms associated with an entity used for searching against watchlists

Hide object

ID of the associated entity program.

The name of the organization being screened. Must have at least one alphabetical character, have a maximum length of 100 characters, and not include leading or trailing spaces.

The numeric or alphanumeric identifier associated with this document. Must be between 4 and 32 characters long, and cannot have leading or trailing spaces.

A valid email address. Must not have leading or trailing spaces and address must be RFC compliant. For more information, see [RFC 3696](https://datatracker.ietf.org/doc/html/rfc3696).

Format: `email`

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

A phone number in E.164 format.

An 'http' or 'https' URL (must begin with either of those).

Format: `uri`

The current version of the search terms. Starts at `1` and increments with each edit to `search_terms`.

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

A status enum indicating whether a screening is still pending review, has been rejected, or has been cleared.

Possible values: `rejected`, `pending_review`, `cleared`

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

Information about the last change made to the parent object specifying what caused the change as well as when it occurred.

Hide object

A type indicating who or what last touched this object. `dashboard`, `link`, and `api` indicate the originating surface; `system` indicates Plaid. `retro` indicates a screening created retroactively via a bulk screening creation.

Possible values: `dashboard`, `link`, `api`, `system`, `retro`

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

An ISO8601 formatted timestamp.

Format: `date-time`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "id": "entscr_52xR9LKo77r1Np",
  "search_terms": {
    "entity_watchlist_program_id": "entprg_2eRPsDnL66rZ7H",
    "legal_name": "Al-Qaida",
    "document_number": "C31195855",
    "email_address": "user@example.com",
    "country": "US",
    "phone_number": "+14025671234",
    "url": "https://example.com",
    "version": 1
  },
  "assignee": "54350110fedcbaf01234ffee",
  "status": "cleared",
  "client_user_id": "your-db-id-3b24110",
  "audit_trail": {
    "source": "dashboard",
    "dashboard_user_id": "54350110fedcbaf01234ffee",
    "timestamp": "2020-07-24T03:26:02Z"
  },
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/watchlist_screening/entity/history/list`](/docs/api/products/monitor/#watchlist_screeningentityhistorylist)

[#### List history for entity watchlist screenings](/docs/api/products/monitor/#list-history-for-entity-watchlist-screenings)

List all changes to the entity watchlist screening in reverse-chronological order. If the watchlist screening has not been edited, no history will be returned.

/watchlist\_screening/entity/history/list

**Request fields**

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

ID of the associated entity screening.

An identifier that determines which page of results you receive.

/watchlist\_screening/entity/history/list

Nodeâ¼

```
const request: WatchlistScreeningEntityHistoryListRequest = {
  entity_watchlist_screening_id: 'entscr_52xR9LKo77r1Np',
};

try {
  const response = await client.watchlistScreeningEntityHistoryList(request);
} catch (error) {
  // handle error
}
```

/watchlist\_screening/entity/history/list

**Response fields**

Collapse all

List of entity watchlist screening

Hide object

ID of the associated entity screening.

Search terms associated with an entity used for searching against watchlists

Hide object

ID of the associated entity program.

The name of the organization being screened. Must have at least one alphabetical character, have a maximum length of 100 characters, and not include leading or trailing spaces.

The numeric or alphanumeric identifier associated with this document. Must be between 4 and 32 characters long, and cannot have leading or trailing spaces.

A valid email address. Must not have leading or trailing spaces and address must be RFC compliant. For more information, see [RFC 3696](https://datatracker.ietf.org/doc/html/rfc3696).

Format: `email`

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

A phone number in E.164 format.

An 'http' or 'https' URL (must begin with either of those).

Format: `uri`

The current version of the search terms. Starts at `1` and increments with each edit to `search_terms`.

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

A status enum indicating whether a screening is still pending review, has been rejected, or has been cleared.

Possible values: `rejected`, `pending_review`, `cleared`

A unique ID that identifies the end user in your system. Either a `user_id` or the `client_user_id` must be provided. This ID can also be used to associate user-specific data from other Plaid products. Financial Account Matching requires this field and the `/link/token/create` `client_user_id` to be consistent. Personally identifiable information, such as an email address or phone number, should not be used in the `client_user_id`.

Information about the last change made to the parent object specifying what caused the change as well as when it occurred.

Hide object

A type indicating who or what last touched this object. `dashboard`, `link`, and `api` indicate the originating surface; `system` indicates Plaid. `retro` indicates a screening created retroactively via a bulk screening creation.

Possible values: `dashboard`, `link`, `api`, `system`, `retro`

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

An ISO8601 formatted timestamp.

Format: `date-time`

An identifier that determines which page of results you receive.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "entity_watchlist_screenings": [
    {
      "id": "entscr_52xR9LKo77r1Np",
      "search_terms": {
        "entity_watchlist_program_id": "entprg_2eRPsDnL66rZ7H",
        "legal_name": "Al-Qaida",
        "document_number": "C31195855",
        "email_address": "user@example.com",
        "country": "US",
        "phone_number": "+14025671234",
        "url": "https://example.com",
        "version": 1
      },
      "assignee": "54350110fedcbaf01234ffee",
      "status": "cleared",
      "client_user_id": "your-db-id-3b24110",
      "audit_trail": {
        "source": "dashboard",
        "dashboard_user_id": "54350110fedcbaf01234ffee",
        "timestamp": "2020-07-24T03:26:02Z"
      }
    }
  ],
  "next_cursor": "eyJkaXJlY3Rpb24iOiJuZXh0Iiwib2Zmc2V0IjoiMTU5NDM",
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/watchlist_screening/entity/review/create`](/docs/api/products/monitor/#watchlist_screeningentityreviewcreate)

[#### Create a review for an entity watchlist screening](/docs/api/products/monitor/#create-a-review-for-an-entity-watchlist-screening)

Create a review for an entity watchlist screening. Reviews are compliance reports created by users in your organization regarding the relevance of potential hits found by Plaid.

/watchlist\_screening/entity/review/create

**Request fields**

Hits to mark as a true positive after thorough manual review. These hits will never recur or be updated once confirmed. In most cases, confirmed hits indicate that the customer should be rejected.

Hits to mark as a false positive after thorough manual review. These hits will never recur or be updated once dismissed.

A comment submitted by a team member as part of reviewing a watchlist screening.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

ID of the associated entity screening.

/watchlist\_screening/entity/review/create

Nodeâ¼

```
const request: WatchlistScreeningEntityReviewCreateRequest = {
  confirmed_hits: ['entscrhit_52xR9LKo77r1Np'],
  dismissed_hits: [],
  entity_watchlist_screening_id: 'entscr_52xR9LKo77r1Np',
};

try {
  const response = await client.watchlistScreeningEntityReviewCreate(request);
} catch (error) {
  // handle error
}
```

/watchlist\_screening/entity/review/create

**Response fields**

Collapse all

ID of the associated entity review.

Hits marked as a true positive after thorough manual review. These hits will never recur or be updated once confirmed. In most cases, confirmed hits indicate that the customer should be rejected.

Hits marked as a false positive after thorough manual review. These hits will never recur or be updated once dismissed.

A comment submitted by a team member as part of reviewing a watchlist screening.

Information about the last change made to the parent object specifying what caused the change as well as when it occurred.

Hide object

A type indicating who or what last touched this object. `dashboard`, `link`, and `api` indicate the originating surface; `system` indicates Plaid. `retro` indicates a screening created retroactively via a bulk screening creation.

Possible values: `dashboard`, `link`, `api`, `system`, `retro`

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

An ISO8601 formatted timestamp.

Format: `date-time`

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "id": "entrev_aCLNRxK3UVzn2r",
  "confirmed_hits": [
    "enthit_52xR9LKo77r1Np"
  ],
  "dismissed_hits": [
    "enthit_52xR9LKo77r1Np"
  ],
  "comment": "These look like legitimate matches, rejecting the customer.",
  "audit_trail": {
    "source": "dashboard",
    "dashboard_user_id": "54350110fedcbaf01234ffee",
    "timestamp": "2020-07-24T03:26:02Z"
  },
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/watchlist_screening/entity/review/list`](/docs/api/products/monitor/#watchlist_screeningentityreviewlist)

[#### List reviews for entity watchlist screenings](/docs/api/products/monitor/#list-reviews-for-entity-watchlist-screenings)

List all reviews for a particular entity watchlist screening. Reviews are compliance reports created by users in your organization regarding the relevance of potential hits found by Plaid.

/watchlist\_screening/entity/review/list

**Request fields**

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

ID of the associated entity screening.

An identifier that determines which page of results you receive.

/watchlist\_screening/entity/review/list

Nodeâ¼

```
const request: WatchlistScreeningEntityReviewListRequest = {
  entity_watchlist_screening_id: 'entscr_52xR9LKo77r1Np',
};

try {
  const response = await client.watchlistScreeningEntityReviewList(request);
} catch (error) {
  // handle error
}
```

/watchlist\_screening/entity/review/list

**Response fields**

Collapse all

List of entity watchlist screening reviews

Hide object

ID of the associated entity review.

Hits marked as a true positive after thorough manual review. These hits will never recur or be updated once confirmed. In most cases, confirmed hits indicate that the customer should be rejected.

Hits marked as a false positive after thorough manual review. These hits will never recur or be updated once dismissed.

A comment submitted by a team member as part of reviewing a watchlist screening.

Information about the last change made to the parent object specifying what caused the change as well as when it occurred.

Hide object

A type indicating who or what last touched this object. `dashboard`, `link`, and `api` indicate the originating surface; `system` indicates Plaid. `retro` indicates a screening created retroactively via a bulk screening creation.

Possible values: `dashboard`, `link`, `api`, `system`, `retro`

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

An ISO8601 formatted timestamp.

Format: `date-time`

An identifier that determines which page of results you receive.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "entity_watchlist_screening_reviews": [
    {
      "id": "entrev_aCLNRxK3UVzn2r",
      "confirmed_hits": [
        "enthit_52xR9LKo77r1Np"
      ],
      "dismissed_hits": [
        "enthit_52xR9LKo77r1Np"
      ],
      "comment": "These look like legitimate matches, rejecting the customer.",
      "audit_trail": {
        "source": "dashboard",
        "dashboard_user_id": "54350110fedcbaf01234ffee",
        "timestamp": "2020-07-24T03:26:02Z"
      }
    }
  ],
  "next_cursor": "eyJkaXJlY3Rpb24iOiJuZXh0Iiwib2Zmc2V0IjoiMTU5NDM",
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/watchlist_screening/entity/hit/list`](/docs/api/products/monitor/#watchlist_screeningentityhitlist)

[#### List hits for entity watchlist screenings](/docs/api/products/monitor/#list-hits-for-entity-watchlist-screenings)

List all hits for the entity watchlist screening.

/watchlist\_screening/entity/hit/list

**Request fields**

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

ID of the associated entity screening.

An identifier that determines which page of results you receive.

/watchlist\_screening/entity/hit/list

Nodeâ¼

```
const request: WatchlistScreeningEntityHitListRequest = {
  entity_watchlist_screening_id: 'entscr_52xR9LKo77r1Np',
};

try {
  const response = await client.watchlistScreeningEntityHitList(request);
} catch (error) {
  // handle error
}
```

/watchlist\_screening/entity/hit/list

**Response fields**

Collapse all

List of entity watchlist screening hits

Hide object

ID of the associated entity screening hit.

The current state of review. All watchlist screening hits begin in a `pending_review` state but can be changed by creating a review. When a hit is in the `pending_review` state, it will always show the latest version of the watchlist data Plaid has available and be compared against the latest customer information saved in the watchlist screening. Once a hit has been marked as `confirmed` or `dismissed` it will no longer be updated so that the state is as it was when the review was first conducted.

Possible values: `confirmed`, `pending_review`, `dismissed`

An ISO8601 formatted timestamp.

Format: `date-time`

An ISO8601 formatted timestamp.

Format: `date-time`

An ISO8601 formatted timestamp.

Format: `date-time`

Shorthand identifier for a specific screening list for entities.
`AU_CON`: Australia Department of Foreign Affairs and Trade Consolidated List
`CA_CON`: Government of Canada Consolidated List of Sanctions
`EU_CON`: European External Action Service Consolidated List
`IZ_SOE`: State Owned Enterprise List
`IZ_UNC`: United Nations Consolidated Sanctions
`IZ_WBK`: World Bank Listing of Ineligible Firms and Individuals
`US_CAP`: US OFAC Correspondent Account or Payable-Through Account Sanctions
`US_FSE`: US OFAC Foreign Sanctions Evaders
`US_MBS`: US Non-SDN Menu-Based Sanctions
`US_SDN`: US Specially Designated Nationals List
`US_SSI`: US OFAC Sectoral Sanctions Identifications
`US_CMC`: US OFAC Non-SDN Chinese Military-Industrial Complex List
`US_UVL`: Bureau of Industry and Security Unverified List
`US_SAM`: US System for Award Management Exclusion List
`US_TEL`: US Terrorist Exclusion List
`UK_HMC`: Foreign, Commonwealth & Development Office UK Sanctions List

Possible values: `CA_CON`, `EU_CON`, `IZ_SOE`, `IZ_UNC`, `IZ_WBK`, `US_CAP`, `US_FSE`, `US_MBS`, `US_SDN`, `US_SSI`, `US_CMC`, `US_UVL`, `US_SAM`, `US_TEL`, `AU_CON`, `UK_HMC`

A universal identifier for a watchlist individual that is stable across searches and updates.

The identifier provided by the source sanction or watchlist. When one is not provided by the source, this is `null`.

Sub-program designations that may be attached to the watchlist entry by the issuing authority. For OFAC SDN
entries these are the program codes published in the SDN list (for example `SDGT` for Specially
Designated Global Terrorists, `SDNTK` for Specially Designated Narcotics Trafficking Kingpins,
`IRAN`, `RUSSIA-EO14024`). New codes are added by sanctioning authorities without prior notice,
so callers should treat unknown values as opaque strings rather than enum members.

Analysis information describing why a screening hit matched the provided entity information

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

The version of the entity screening's `search_terms` that were compared when the entity screening hit was added. Entity screening hits are immutable once they have been reviewed. If changes are detected due to updates to the entity screening's `search_terms`, the associated entity program, or the list's source data prior to review, the entity screening hit will be updated to reflect those changes.

Information associated with the entity watchlist hit

Hide object

Documents associated with the watchlist hit

Hide object

Summary object reflecting the match result of the associated data

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

An official document, usually issued by a governing body or institution, with an associated identifier.

Hide object

The kind of official document represented by this object.

`bik` - Russian bank code

`business_number` - A number that uniquely identifies the business within a category of businesses

`imo` - Number assigned to the entity by the International Maritime Organization

`other` - Any document not covered by other categories

`swift` - Number identifying a bank and branch.

`tax_id` - Identification issued for the purpose of collecting taxes

Possible values: `bik`, `business_number`, `imo`, `other`, `swift`, `tax_id`

The numeric or alphanumeric identifier associated with this document. Must be between 4 and 32 characters long, and cannot have leading or trailing spaces.

Email addresses associated with the watchlist hit

Hide object

Summary object reflecting the match result of the associated data

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Email address information for the associated entity watchlist hit

Hide object

A valid email address. Must not have leading or trailing spaces and address must be RFC compliant. For more information, see [RFC 3696](https://datatracker.ietf.org/doc/html/rfc3696).

Format: `email`

Locations associated with the watchlist hit

Hide object

Summary object reflecting the match result of the associated data

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Location information for the associated individual watchlist hit

Hide object

The full location string, potentially including elements like street, city, postal codes and country codes. Note that this is not necessarily a complete or well-formatted address.

Valid, capitalized, two-letter ISO code representing the country of this object. Must be in ISO 3166-1 alpha-2 form.

Names associated with the watchlist hit

Hide object

Summary object reflecting the match result of the associated data

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Name information for the associated entity watchlist hit

Hide object

The full name of the entity.

Primary names are those most commonly used to refer to this entity. Only one name will ever be marked as primary.

Names that are explicitly marked as low quality either by their `source` list, or by `plaid` by a series of additional checks done by Plaid. Plaid does not ever surface a hit as a result of a weak name alone. If a name has no quality issues, this value will be `none`.

Possible values: `none`, `source`, `plaid`

Phone numbers associated with the watchlist hit

Hide object

Summary object reflecting the match result of the associated data

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

Phone number information associated with the entity screening hit

Hide object

An enum indicating whether a phone number is a phone line or a fax line.

Possible values: `phone`, `fax`

A phone number in E.164 format.

URLs associated with the watchlist hit

Hide object

Summary object reflecting the match result of the associated data

Hide object

An enum indicating the match type between data provided by user and data checked against an external data source.

`match` indicates that the provided input data was a strong match against external data.

`partial_match` indicates the data approximately matched against external data. For example, "Knope" vs. "Knope-Wyatt" for last name.

`no_match` indicates that Plaid was able to perform a check against an external data source and it did not match the provided input data.

`no_data` indicates that Plaid was unable to find external data to compare against the provided input data.

`no_input` indicates that Plaid was unable to perform a check because no information was provided for this field by the end user.

Possible values: `match`, `partial_match`, `no_match`, `no_data`, `no_input`

URLs associated with the entity screening hit

Hide object

An 'http' or 'https' URL (must begin with either of those).

Format: `uri`

An identifier that determines which page of results you receive.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "entity_watchlist_screening_hits": [
    {
      "id": "enthit_52xR9LKo77r1Np",
      "review_status": "pending_review",
      "first_active": "2020-07-24T03:26:02Z",
      "inactive_since": "2020-07-24T03:26:02Z",
      "historical_since": "2020-07-24T03:26:02Z",
      "list_code": "EU_CON",
      "plaid_uid": "uid_3NggckTimGSJHS",
      "source_uid": "26192ABC",
      "sub_programs": [],
      "analysis": {
        "documents": "match",
        "email_addresses": "match",
        "locations": "match",
        "names": "match",
        "phone_numbers": "match",
        "urls": "match",
        "search_terms_version": 1
      },
      "data": {
        "documents": [
          {
            "analysis": {
              "summary": "match"
            },
            "data": {
              "type": "swift",
              "number": "C31195855"
            }
          }
        ],
        "email_addresses": [
          {
            "analysis": {
              "summary": "match"
            },
            "data": {
              "email_address": "user@example.com"
            }
          }
        ],
        "locations": [
          {
            "analysis": {
              "summary": "match"
            },
            "data": {
              "full": "Florida, US",
              "country": "US"
            }
          }
        ],
        "names": [
          {
            "analysis": {
              "summary": "match"
            },
            "data": {
              "full": "Al Qaida",
              "is_primary": false,
              "weak_alias_determination": "none"
            }
          }
        ],
        "phone_numbers": [
          {
            "analysis": {
              "summary": "match"
            },
            "data": {
              "type": "phone",
              "phone_number": "+14025671234"
            }
          }
        ],
        "urls": [
          {
            "analysis": {
              "summary": "match"
            },
            "data": {
              "url": "https://example.com"
            }
          }
        ]
      }
    }
  ],
  "next_cursor": "eyJkaXJlY3Rpb24iOiJuZXh0Iiwib2Zmc2V0IjoiMTU5NDM",
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/watchlist_screening/entity/program/get`](/docs/api/products/monitor/#watchlist_screeningentityprogramget)

[#### Get entity watchlist screening program](/docs/api/products/monitor/#get-entity-watchlist-screening-program)

Get an entity watchlist screening program

/watchlist\_screening/entity/program/get

**Request fields**

ID of the associated entity program.

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

/watchlist\_screening/entity/program/get

Nodeâ¼

```
const request: WatchlistScreeningEntityProgramGetRequest = {
  entity_watchlist_program_id: 'entprg_2eRPsDnL66rZ7H',
};

try {
  const response = await client.watchlistScreeningEntityProgramGet(request);
} catch (error) {
  // handle error
}
```

/watchlist\_screening/entity/program/get

**Response fields**

Collapse all

ID of the associated entity program.

An ISO8601 formatted timestamp.

Format: `date-time`

Indicator specifying whether the program is enabled and will perform daily rescans.

Watchlists enabled for the associated program

Possible values: `CA_CON`, `EU_CON`, `IZ_SOE`, `IZ_UNC`, `IZ_WBK`, `US_CAP`, `US_FSE`, `US_MBS`, `US_SDN`, `US_SSI`, `US_CMC`, `US_UVL`, `US_SAM`, `US_TEL`, `AU_CON`, `UK_HMC`

A name for the entity program to define its purpose. For example, "High Risk Organizations" or "Applicants".

The valid name matching sensitivity configurations for a screening program. Note that while certain matching techniques may be more prevalent on less strict settings, all matching algorithms are enabled for every sensitivity.

`coarse` - See more potential matches. This sensitivity will see more broad phonetic matches across alphabets that make missing a potential hit very unlikely. This setting is noisier and will require more manual review.

`balanced` - A good default for most companies. This sensitivity is balanced to show high quality hits with reduced noise.

`strict` - Aggressive false positive reduction. This sensitivity will require names to be more similar than `coarse` and `balanced` settings, relying less on phonetics, while still accounting for character transpositions, missing tokens, and other common permutations.

`exact` - Matches must be nearly exact. This sensitivity will only show hits with exact or nearly exact name matches with only basic correction such as extraneous symbols and capitalization. This setting is generally not recommended unless you have a very specific use case.

Possible values: `coarse`, `balanced`, `strict`, `exact`

Information about the last change made to the parent object specifying what caused the change as well as when it occurred.

Hide object

A type indicating who or what last touched this object. `dashboard`, `link`, and `api` indicate the originating surface; `system` indicates Plaid. `retro` indicates a screening created retroactively via a bulk screening creation.

Possible values: `dashboard`, `link`, `api`, `system`, `retro`

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

An ISO8601 formatted timestamp.

Format: `date-time`

Archived programs are read-only and cannot screen new customers nor participate in ongoing monitoring.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "id": "entprg_2eRPsDnL66rZ7H",
  "created_at": "2020-07-24T03:26:02Z",
  "is_rescanning_enabled": true,
  "lists_enabled": [
    "EU_CON"
  ],
  "name": "Sample Program",
  "name_sensitivity": "balanced",
  "audit_trail": {
    "source": "dashboard",
    "dashboard_user_id": "54350110fedcbaf01234ffee",
    "timestamp": "2020-07-24T03:26:02Z"
  },
  "is_archived": false,
  "request_id": "saKrIBuEB9qJZng"
}
```

=\*=\*=\*=[#### `/watchlist_screening/entity/program/list`](/docs/api/products/monitor/#watchlist_screeningentityprogramlist)

[#### List entity watchlist screening programs](/docs/api/products/monitor/#list-entity-watchlist-screening-programs)

List all entity watchlist screening programs

/watchlist\_screening/entity/program/list

**Request fields**

Your Plaid API `secret`. The `secret` is required and may be provided either in the `PLAID-SECRET` header or as part of a request body.

Your Plaid API `client_id`. The `client_id` is required and may be provided either in the `PLAID-CLIENT-ID` header or as part of a request body.

An identifier that determines which page of results you receive.

/watchlist\_screening/entity/program/list

Nodeâ¼

```
try {
  const response = await client.watchlistScreeningEntityProgramList({});
} catch (error) {
  // handle error
}
```

/watchlist\_screening/entity/program/list

**Response fields**

Collapse all

List of entity watchlist screening programs

Hide object

ID of the associated entity program.

An ISO8601 formatted timestamp.

Format: `date-time`

Indicator specifying whether the program is enabled and will perform daily rescans.

Watchlists enabled for the associated program

Possible values: `CA_CON`, `EU_CON`, `IZ_SOE`, `IZ_UNC`, `IZ_WBK`, `US_CAP`, `US_FSE`, `US_MBS`, `US_SDN`, `US_SSI`, `US_CMC`, `US_UVL`, `US_SAM`, `US_TEL`, `AU_CON`, `UK_HMC`

A name for the entity program to define its purpose. For example, "High Risk Organizations" or "Applicants".

The valid name matching sensitivity configurations for a screening program. Note that while certain matching techniques may be more prevalent on less strict settings, all matching algorithms are enabled for every sensitivity.

`coarse` - See more potential matches. This sensitivity will see more broad phonetic matches across alphabets that make missing a potential hit very unlikely. This setting is noisier and will require more manual review.

`balanced` - A good default for most companies. This sensitivity is balanced to show high quality hits with reduced noise.

`strict` - Aggressive false positive reduction. This sensitivity will require names to be more similar than `coarse` and `balanced` settings, relying less on phonetics, while still accounting for character transpositions, missing tokens, and other common permutations.

`exact` - Matches must be nearly exact. This sensitivity will only show hits with exact or nearly exact name matches with only basic correction such as extraneous symbols and capitalization. This setting is generally not recommended unless you have a very specific use case.

Possible values: `coarse`, `balanced`, `strict`, `exact`

Information about the last change made to the parent object specifying what caused the change as well as when it occurred.

Hide object

A type indicating who or what last touched this object. `dashboard`, `link`, and `api` indicate the originating surface; `system` indicates Plaid. `retro` indicates a screening created retroactively via a bulk screening creation.

Possible values: `dashboard`, `link`, `api`, `system`, `retro`

ID of the associated user. To retrieve the email address or other details of the person corresponding to this ID, use `/dashboard_user/get`.

An ISO8601 formatted timestamp.

Format: `date-time`

Archived programs are read-only and cannot screen new customers nor participate in ongoing monitoring.

An identifier that determines which page of results you receive.

A unique identifier for the request, which can be used for troubleshooting. This identifier, like all Plaid identifiers, is case sensitive.

Response Object

```
{
  "entity_watchlist_programs": [
    {
      "id": "entprg_2eRPsDnL66rZ7H",
      "created_at": "2020-07-24T03:26:02Z",
      "is_rescanning_enabled": true,
      "lists_enabled": [
        "EU_CON"
      ],
      "name": "Sample Program",
      "name_sensitivity": "balanced",
      "audit_trail": {
        "source": "dashboard",
        "dashboard_user_id": "54350110fedcbaf01234ffee",
        "timestamp": "2020-07-24T03:26:02Z"
      },
      "is_archived": false
    }
  ],
  "next_cursor": "eyJkaXJlY3Rpb24iOiJuZXh0Iiwib2Zmc2V0IjoiMTU5NDM",
  "request_id": "saKrIBuEB9qJZng"
}
```

[### Webhooks](/docs/api/products/monitor/#webhooks)=\*=\*=\*=[#### `SCREENING: STATUS_UPDATED`](/docs/api/products/monitor/#screening-status_updated)

Fired when an individual screening status has changed, which can occur manually via the dashboard or during ongoing monitoring.

**Properties**

`SCREENING`

`STATUS_UPDATED`

The ID of the associated screening.

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "SCREENING",
  "webhook_code": "STATUS_UPDATED",
  "screening_id": "scr_52xR9LKo77r1Np",
  "environment": "production"
}
```

=\*=\*=\*=[#### `ENTITY_SCREENING: STATUS_UPDATED`](/docs/api/products/monitor/#entity_screening-status_updated)

Fired when an entity screening status has changed, which can occur manually via the dashboard or during ongoing monitoring.

**Properties**

`ENTITY_SCREENING`

`STATUS_UPDATED`

The ID of the associated entity screening.

The Plaid environment the webhook was sent from

Possible values: `sandbox`, `production`

API Object

```
{
  "webhook_type": "ENTITY_SCREENING",
  "webhook_code": "STATUS_UPDATED",
  "entity_screening_id": "entscr_52xR9LKo77r1Np",
  "environment": "production"
}
```
