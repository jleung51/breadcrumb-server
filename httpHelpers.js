// This Javascript module contains methods for HTTP validation and statuses.
//
// Use this module as follows:
//     const httpH = require('./httpHelpers');
//     httph.requireJsonBody(res, firstName);

// ENUMS

const HTTPSTATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// HELPER FUNCTIONS

function isEmptyOrNull(obj) {
  return !obj || Object.keys(obj).length === 0;
}

// EXPORTS

exports.HTTPSTATUS = HTTPSTATUS;

// This function compiles the request method, URL, and JSON body into a string.
exports.stringifyReq = function(req) {
  if (req == {}) {
    return "";
  }
  return req.method + ' ' + req.url + ' ' + JSON.stringify(req.body);
}

exports.setHttpError = function(res, status, msg) {
  console.log("HTTP " + status + ": " + msg);
  res.status(status).send({
    'status': status,
    'message': msg
  });
}

// This function sets the HTTP error if the body is null or empty.
// Returns: Whether or not the body was present.
exports.requireJsonBody = function(res, field) {
  if (isEmptyOrNull(field)) {
    exports.setHttpError(res, HTTPSTATUS.BAD_REQUEST,
      'A JSON request body and header is required.');
    return false;
  }
  return true;
}

// Sets the HTTP error if the field is not present.
// Returns: Whether or not the field was present.
exports.requireJsonField = function(res, field, fieldName) {
  if (!field) {
    exports.setHttpError(res, HTTPSTATUS.BAD_REQUEST,
      'Field ' + fieldName + ' is required');
    return false;
  }
  return true;
}
