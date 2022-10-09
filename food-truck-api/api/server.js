/* eslint-disable jsx-a11y/href-no-hash */

/**
 * The server.js file provides the startup of the
 * application/web server and resources
 **/

const express = require('express');
const bodyParser = require('body-parser');

const middleware = require('./middleware');
const response = require('../core/response');
const logger = require('log4js').getLogger('app.startup');

const util = require('util');
const utils = require('../core/utils');
const cors = require('cors');
const log = require('../core/logger');

const resources = require('./resources');

const resource = resources.resource;
const routers = middleware.routers;

let app;
let httpServer = null;

const PARAMS = {
    xRequestIdTTL: 43200, // 12 hr TTL
    basePath: '/api',
    supportedVersions: ['v1'],
    currentVersion: 'v1'
};

global.PARAMS = PARAMS;

/**
 * Shutdown the http server and clear middleware.
 * @private
 * @returns {Promise}
 */
function shutdownHttpServer() {
    return new Promise((resolve) => {
        if (httpServer) {
            httpServer.close();
            httpServer = null;
            app = null;
        } else {
            logger.warn('Close request where httpServer instance is not running.');
        }
        resolve();
    });
}

/**
 * Starts the http server
 * @returns {Promise.<http.Server>}
 */
async function startHttpServer() {
    return new Promise((resolve) => {
        logger.info('Started listening to port %s', process.env.PORT);
        resolve(app.listen(process.env.PORT));
    });
}

/**
 * Connects to resources, pools, connections etc.
 * @returns {Promise.<void>}
 */
async function initResources() {
    await resources.start();
}

/**
 * global all else failed handler.
 * @param err - the error
 * @param req - request
 * @param res - response
 * @param next - callback used if headersSent already
 */
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        next(err);
    } else {
        if (err && err.options) {
            log.error(`Error received from an api request, ${err.message}, ${err.options.uri}`);
        } else {
            log.error('', err.stack);
        }
        const statusCode = err.statusCode === 401 ? err.statusCode : 500;
        res.status(statusCode);
        // logger.info('Error handler for request body -', req.body.name);
        // logger.info('Error handler for request body -', req.body.dealId);
        log.info('Error handler with err -', err.stack);
        log.responseStatusCode(statusCode);
        res.send({
            code: -1,
            message: 'Something has gone wrong, and we did not handle this correctly.',
            XRequestId: req.headers[global.HEADERS.XREQUESTID]
        });
    }
}


/**
 * this is done before other global middleware to allow for unsecured access to ping.
 */
function addPingRoute(secured) {
    if (secured) {
        app.get(util.format('/%s', middleware.pingURISecured), (req, res) => {
            res.status(200).json({});
        });
    } else {
        app.get(util.format('/%s', middleware.pingURIUnsecured),
            (req, res) => {
                res.status(200).json({});
            });
    }
}


/**
 * Add all the routes to the express app.
 */
function addApiRoutes() {
    /**
     todo iterate versions and routes, done via router files
     todo this is config over a code implementation.
     */
    // Nothing elegant being done with api versioning just yet.
    app.use(util.format('%s/%s', PARAMS.basePath, PARAMS.currentVersion), routers.routes);
}

function finalisation() {
    app.use(errorHandler);
    app.all('*', (req, res) => response.notFound(res));
}

/**
 * Initialise the express app, middleware, route handlers etc
 * @returns {Promise.<*|Function>}
 */
async function initExpressApp() {
    logger.trace('Initialising express');
    app = express();
    logger.trace('Setting OPTIONS requests to return CORS headers');
    app.options('*', cors());

    logger.trace('Add unsecured ping route');
    addPingRoute(false);
    logger.trace('Load global middleware');
    app.use(middleware.global);

    // todo revisit for options i.e. limit etc
    logger.trace('Body parse added');
    app.use(bodyParser.json());
    logger.trace('Body parse added');
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    logger.trace('Add secured ping route');
    addPingRoute(true);
    logger.trace('Add api routes');
    addApiRoutes();
    logger.trace('finalisation middleware');
    finalisation();
}

/**
 * shutdown like start contains a single call to cleanly shutdown the application.
 * @returns {Promise.<void>}
 */
async function shutdown() {
    try {
        await shutdownHttpServer();
        await resources.close();
    } catch (err) {
        utils.echo(err);
    }
}

/**
 * This is the primary entry point for starting the application.
 * The other functions exposed here are which sart specifics are
 * for testing reasons primarily e.g. initExpressApp,initResources & startHttpServer
 * is contained herein.
 * @returns {Promise.<http.Server|*>}
 */
async function start() {
    try {
        if (httpServer) {
            await shutdown();
        }
        logger.info('Connecting to resources');
        await initResources();
        logger.info('Initialising express');
        await initExpressApp();
        logger.info('Starting httpServer');
        httpServer = await startHttpServer();
        return {
            app,
            httpServer
        };
    } catch (err) {
        logger.fatal('Startup failed %s', err);
        throw err;
    }
}

/**
 * What port is the server running on?
 */
function port() {
    return httpServer.address().port;
}

module.exports = {
    start,
    shutdown,
    resource: resources.resource,
    port
};
