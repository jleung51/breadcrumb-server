# API Specification

This is the API specification for the Breadcrumb Node.js and Express web backend server.

## Acronym Guide

Acronym | Definition
--- | ---
FCM | Firebase Cloud Messaging

## Endpoint: Create FCM Token

This request sends an FCM token to the server to be stored until deletion.

Each token uniquely identifies a single installed instance of the Breadcrumb app.

When the Firebase Realtime Database is modified to add a crumb, the server will send notifications to all devices registered by this endpoint.

### Request

#### Method and URL

```
POST /fcm/tokens/{token}
```

#### Headers

Key | Value
--- | ---
`Content-Type` | `application/json`

### Response

#### Status Code

Status | Meaning
 --- | ---
`201 Created` | Token creation successful.
`409 Conflict` | Token already exists.
`500 Internal Server Error` | The server made an error and was unable to recover.



## Endpoint: Delete FCM Token

This request deletes an FCM token from the server.

Future notifications sent by the server will no longer be sent to this token.

### Request

#### Method and URL

```
DELETE /fcm/tokens/{token}
```

#### Headers

Key | Value
--- | ---
`Content-Type` | `application/json`

### Response

#### Status Code

Status | Meaning
 --- | ---
`200 OK` | Token deletion successful.
`404 Not Found` | Token does not exist.
`500 Internal Server Error` | The server made an error and was unable to recover.
