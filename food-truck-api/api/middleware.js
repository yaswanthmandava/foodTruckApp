/*
    The module for adding "general" middleware i.e.
    Logging
    Required Header Checks
    Security
    Body Parsing
    URI conformance / parameter checking
    Exception responses
*/
const uuid = require('uuid');
const gm = require('./middleware-global');

const HEADERS = {
    HTTPS: 'https',
    XREQUESTID: 'x-request-id',
    AUTHORIZATION: 'authorization',
    XFORWARDEDPROTO: 'x-forwarded-proto'
};

global.HEADERS = HEADERS;

// todo make into a version map
const routers = require('./v1/routers');

// todo make this a secure seeded salted very long string base64 encoded
let pingURIUnsecured = uuid.v4();
let pingURISecured = uuid.v4();

if (process.env.PING_URI_UNSECURED) {
    pingURIUnsecured = process.env.PING_URI_UNSECURED;
}

if (process.env.PING_URI_SECURED) {
    pingURISecured = process.env.PING_URI_SECURED;
}

module.exports = {
    global: gm.globalMiddleware(),
    routers,
    pingURIUnsecured,
    pingURISecured
};
