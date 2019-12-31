# API Specification

This is the API specification for the Node.js and Express web backend server.

## ACTION

This request does something.

### Request

#### Method and URL

```
POST /url/path/here
```

#### Headers

Key | Value
--- | ---
`Content-Type` | `application/json`


#### JSON Body

```json
{
  "firstName": string,
  "lastName": string
}
```

### Response

#### Status Code

Status | Meaning
 --- | ---
`201 Created` | Check-in successful.
`400 Bad Request` | A field in the request body was missing or invalid.
`409 Conflict` | Email already checked in.
`500 Internal Server Error` | The server made an error and was unable to recover.

#### JSON Body

```json
{}
```
