# Template NodeJS Server

Template Node.js and Express web backend server.

## Usage

### Google Sheets

Follow [these instructions](https://developers.google.com/sheets/api/quickstart/nodejs) to create a new Google Cloud Platform project and enable the Google Sheets API.

Download the Client JSON file and rename it to `credentials.json`. Place it in this directory (it will be ignored by Git).

### Server

Start the server with one of the following commands:

```shell
npm start
```

```
node app.js
```

Google will guide you through a process to authenticate the server. This will only occur the first time.

## Deployment (Heroku)

After creating the Google Cloud Platform project in _Setup_ above, create a new set of credentials for the Service Account. Download the secret file and keep it safe.

Create a Heroku application with whichever method you prefer. In your deployment environment, set the following environment variables using values from the secret file:

Environment Variable | Value from Service Account Credentials
--- | ---
`GOOGLE_CLIENT_EMAIL` | `client_email`
`GOOGLE_PRIVATE_KEY` | `private_key`

Ensure that the client email has access to the Sheet; share access to it manually if necessary.
