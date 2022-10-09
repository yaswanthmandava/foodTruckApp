const createNamespace = require('continuation-local-storage').createNamespace;
const logger = require('../core/logger');

const myRequest = createNamespace('foodtruck-log-nameSpace');

module.exports = (req, res, next) => {
    const reqParam = {
        xReqId: req.headers[global.HEADERS.XREQUESTID],
        host: req.headers.host,
        method: req.method,
        uri: req.headers.referer
    };
    myRequest.run(() => {
        myRequest.set('reqParam', reqParam);
        logger.create();
        next();
    });
};
