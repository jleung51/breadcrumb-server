# Breadcrumb: NodeJS Server

NodeJS web backend server for **Breadcrumb**, an app to keep your friends and family updated with your locations during your travels.

The app allows a traveller to save a "breadcrumb" with the current location, time, and a custom description. Friends and family with the app receive a notification and are able to view previous breadcrumbs.

Inspired by the fairy tale Hansel and Gretel, children who drop breadcrumbs while following a witch into the woods so they can find their way back out.

## Other Repositories

See the Android app here: https://github.com/jleung51/breadcrumb-android

## Usage

### Google Services

Follow [these instructions](https://developers.google.com/sheets/api/quickstart/nodejs) to create a new Google Cloud Platform project and enable the Google Sheets API.

Download the Client JSON file and rename it to `credentials.json`. Place it in this directory (it will be ignored by Git).

### Server

Start the server with one of the following commands:

```shell
npm start
```

```shell
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
