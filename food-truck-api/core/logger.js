const log = require('log4js').getLogger('app.routes');
const getNamespace = require('continuation-local-storage').getNamespace;

const formatMessage = () => {
    const myRequest = getNamespace('FoodTruck-log-nameSpace');
    let reqParam;
    if (myRequest) {
        reqParam = myRequest.get('reqParam');
        if (reqParam) {
            log.addContext('xReqId', reqParam.xReqId);
            log.addContext('host', reqParam.host);
            log.addContext('appName', 'FoodTruck');
            log.addContext('method', reqParam.method);
            log.addContext('uri', reqParam.uri);
        }
    }
};
const logger = {
    fatal: (...message) => {
        formatMessage();
        log.fatal(...message);
    },
    error: (...message) => {
        formatMessage();
        log.error(...message);
    },
    warn: (...message) => {
        formatMessage();
        log.warn(...message);
    },
    all: (...message) => {
        formatMessage();
        log.all(...message);
    },
    info: (...message) => {
        formatMessage();
        log.info(...message);
    },
    debug: (...message) => {
        formatMessage();
        log.debug(...message);
    },
    trace: (...message) => {
        formatMessage();
        log.trace(...message);
    },
    off: (...message) => {
        formatMessage();
        log.off(...message);
    },
    create: () => {
        formatMessage();
    },
    responseStatusCode: (statusCode) => {
        formatMessage();
        log.addContext('statusCode', statusCode);
        log.info('');
        log.removeContext('statusCode');
    }
};

module.exports = logger;
