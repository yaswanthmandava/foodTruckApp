const logger = require('./logger');

/**
 * Generic Http response handlers for codes.
 */

/**
 * Something is wrong, at a quite basic level, no https, no security to an endpoint requiring it.
 * @param res
 */
function badRequest(res) {
    logger.responseStatusCode(400);
    return res.status(400).json({});
}

/**
 * Request lacks valid authentication credentials for the target resource.
 * or not permitted.
 * @param res
 */
function unauthorized(res) {
    logger.responseStatusCode(401);
    res.status(401).json({});
}

/**
 * Request was being processed, but was failed due to validation,
 * or disallowed security permissions.
 * @param res
 */
function forbidden(res) {
    logger.responseStatusCode(403);
    res.status(403).json({});
}

/**
 * The resource has not been located, either the endpoint is unsupported
 * or the GET, PUT, PATCH methods did not identify an existing resource
 * at the url with identity.
 * @param res
 */
function notFound(res) {
    logger.responseStatusCode(404);
    res.status(404).json({});
}

/**
 * A duplicate action was tried i.e. the request was already processed before.
 * @param res
 * @param err
 */
function conflict(res, err) {
    logger.responseStatusCode(409);
    res.status(409).json(err);
}


/**
 * Api action has failed
 * @param res
 * @param err
 */
function serverError(res, err) {
    logger.responseStatusCode(500);
    res.status(500).json(err);
}

/**
 * The request for work was accepted, wait on notification or long poll as implemented.
 * @param res
 * @param msg
 */
function accepted(res, msg) {
    logger.responseStatusCode(202);
    res.status(202).json(msg);
}

/**
 * The resource being accessed has either not changed or the latest
 * known change is ar resource identifier in ETag.
 * @param res
 * @param etag
 */
function noContent(res, etag) {
    logger.responseStatusCode(204);
    res
        .header('ETag', etag)
        .status(204).json({});
}

/**
 * All good lets pass the results back now.
 * @param res
 * @param data
 */
function created(res, data) {
    logger.responseStatusCode(201);
    return res.status(201).json(data);
}

/**
 * All good lets pass the results back now.
 * @param res
 * @param data
 */
function success(res, data) {
    logger.responseStatusCode(200);
    return res.status(200).json(data);
}

module.exports = {
    badRequest,
    unauthorized,
    notFound,
    forbidden,
    accepted,
    noContent,
    success,
    conflict,
    created,
    serverError
};
