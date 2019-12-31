// This Javascript module contains methods for using Google Sheets.
//
// Required packages:
//   google-auth-library
//   googleapis
//
// Use this module as follows:
//
//     const {google} = require('googleapis');
//     const sheets = require('./googleSheets');
//
//     function checkIntoEvent() {
//       // auth (google.auth.OAuth2): The authenticated Google OAuth client
//       api(function(auth) {
//         const sheets = google.sheets({version: 'v4', auth});
//         sheets.spreadsheets.values.get({
//           spreadsheetId: '16baCd9Qd9Q1kJSUGqGzhCuoMFKRxNwO6EJ2lertzDJo',
//           range: 'Class Data!A2:E',
//         }, (err, res) => {
//           if (err) return console.log('The API returned an error: ' + err);
//           // Access/modify data
//         });
//       });
//     }
//
//     sheets.api(checkIntoEvent);

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const {GoogleAuth, JWT, OAuth2Client} = require('google-auth-library');

// The file credentials.json stores the downloaded API credentials from
// Google Cloud Platform.
const CREDENTIALS_FILE = 'credentials.json';

// Upon modification, delete the file token.json
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// LOCAL FUNCTIONS

function hasEnvCredentials() {
  return process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY;
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorizeLocalCredentials(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      return getNewToken(oAuth2Client, callback);
    }

    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function authorizeEnvCredentials() {
  return new Promise(resolve => {
      const auth = new GoogleAuth();
      const jwtClient = new JWT(
          process.env.GOOGLE_CLIENT_EMAIL,
          null,
          process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), 
          SCOPES
      );

      jwtClient.authorize(() => resolve(jwtClient));
  });
}

// Object to insert 5 fields into a row of a spreadsheet
function createInputRequestObject(field1, field2, field3, field4, field5) {
  return {
    requests: [
      {
        appendCells: {
          fields: "*",
          rows: [
            {
              values: [
                {
                  userEnteredValue: {
                    stringValue: field1
                  }
                },
                {
                  userEnteredValue: {
                    stringValue: field2
                  }
                },
                {
                  userEnteredValue: {
                    stringValue: field3
                  }
                },
                {
                  userEnteredValue: {
                    stringValue: field4
                  }
                },
                {
                  userEnteredValue: {
                    stringValue: field5
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  }
}




// EXPORTS

// This function accesses the API, given any template function.
// The provided function must take in one parameter (auth) and complete
// all the required steps for a single operation.
exports.api = function(func) {
  if (hasEnvCredentials()) {
    console.log('Using Service Account credentials');
    authorizeEnvCredentials()
      .then(func)
      .catch((err) => {
          console.log('Authentication Error:', err);
      });
  }
  else {
    console.log('Using local credentials');
    fs.readFile(CREDENTIALS_FILE, (err, content) => {
      if (err) {
        return console.log('Error loading client secret file:', err);
      }
      authorizeLocalCredentials(JSON.parse(content), func);
    });
  }
}

/**
 * This function retrieves values from a spreadsheet and executes a callback.
 * 
 * Example values:
 *   spreadsheet ID: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
 *   range: 'Class Data!A2:E'
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
exports.get = function(spreadsheetId, range, callback) {
  // auth (google.auth.OAuth2): The authenticated Google OAuth client
  exports.api(function(auth) {
    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range,
    }, (err, res) => {
      if (err) {
        return console.error('Google Sheets API Error: ' + err);
      }

      callback(res.data.values);
    });
  });
}

/**
 * This example Google Sheets function adds a row of 5 items to a spreadsheet.
 * Must be fed into the Google Sheets API.
 * @see https://docs.google.com/spreadsheets/d/16baCd9Qd9Q1kJSUGqGzhCuoMFKRxNwO6EJ2lertzDJo/edit
 */
exports.addEntry = function(spreadsheetId, field1, field2, field3, field4, field5) {
  // auth (google.auth.OAuth2): The authenticated Google OAuth client
  sheets.api(function(auth) {
    const sheets = google.sheets({version: 'v4', auth});

    sheets.spreadsheets.batchUpdate({
      spreadsheetId: spreadsheetId,
      resource: createInputRequestObject(field1, field2, field3, field4, field5)
    }, (err, response) => {
      if (err) {
        console.error('Google Sheets API Error: ' + err.message);
      } else {
        console.log('Google Sheets update response: ' + response.statusText);
      }
    });

  });
}