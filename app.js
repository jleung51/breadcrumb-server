'use strict';

// Libraries
const express = require('express');
const bodyParser = require('body-parser');

// Custom modules
const time = require('./time');
const httpH = require('./httpHelpers');

// Configuration
const PORT = process.env.PORT || 3000;  // If no environment variable, the default is 3000

const app = express();
app.use(express.json());

// Filter all messages
app.use(function (req, res, next) {
  console.log('Received request: ' + httpH.stringifyReq(req));
  next();
});

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/path', function (req, res) {
  if (!httpH.requireJsonBody(res, req.body)) { return; }

  // Extract fields
  const firstName = req.body.firstName;
  if (!httpH.requireJsonField(res, firstName, 'firstName')) { return; };
  const lastName = req.body.lastName;
  if (!httpH.requireJsonField(res, lastName, 'lastName')) { return; };

  console.log("Current date and time: " + time.getDateTime());
  console.log("Received first name and last name.")

  res.status(httpH.HTTPSTATUS.CREATED).send({});
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));
