const compression = require('compression');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const validations = require('../core/validations');
const config = require('./config').config;
const response = require('../core/response');
const noCacheMiddleware = require('./middleware-no-cache');
const logsMiddleware = require('./middleware-log');
const mongoose = require('mongoose');
const logger = require('../core/logger');
const models = require('./../api/v1/models/index');

/**
 * The global middleware set returned as an array of middleware
 * functions.
 * Interceptions for
 * security
 * cors
 * route availability
 * headers
 * and forcing associated failure response if not met.
 * @returns {Array}
 */
function globalMiddleware() {
    const envConfig = config();
    const middlewareList = [];

    /* todo
        logging
    */

    middlewareList.push(compression());

    /**
     * check if https has been used.
     * @param req - request
     */
    function httpsCheck(req) {
        return ((req.headers[global.HEADERS.XFORWARDEDPROTO] === global.HEADERS.HTTPS) ||
            (req.protocol === global.HEADERS.HTTPS));
    }

    /*
     In environments other than localhost the env setting must be true
     i.e. from API gateway
    */
    if (envConfig.checkHttps) {
        middlewareList.push(
            (req, res, next) => {
                if (httpsCheck(req)) {
                    next();
                } else {
                    response.badRequest(res);
                }
            });
    }

    function setClientdb(req, res, next) {
        const orgName = req.headers.orgDB || envConfig.masterdb;
        if (!global.dbconnections[orgName]) {
            const db = mongoose.connection.useDb(orgName);
            Object.keys(models).map((model) => {
                const schema = models[model];
                return db.modelNames().includes(model) ?
                    db.model(model) :
                    db.model(model, schema);
            });
            global.dbconnections[orgName] = db;
        }
        req.userContext = {
            db: orgName
        };
        next();
    }


    /**
     * Do the check for the minimum headers expected
     * Specific routes can be more specific as required by headers.
     * @param req - request
     * @returns {boolean} - true if present, false otherwise.
     */
    function hasMinimumRequiredHeaders(req) {
        return true;
    }

    // Ensure X-Request-Id and Authorization are present minimally.
    middlewareList.push(
        (req, res, next) => {
            if (hasMinimumRequiredHeaders(req)) {
                next();
            } else {
                response.badRequest(res);
            }
        });

    // Ensure x-jwt-assertion is present and valid.
    middlewareList.push(
        async (req, res, next) => {
            next();
        });
    middlewareList.push(setClientdb);
    middlewareList.push(
        (req, res, next) => {
            next();
        }
    );

    middlewareList.push(cors());
    middlewareList.push(noCacheMiddleware);
    middlewareList.push(logsMiddleware);

    return middlewareList;
}

module.exports = {
    globalMiddleware
};
