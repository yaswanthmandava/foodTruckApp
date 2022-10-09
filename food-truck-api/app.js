/*
    Call through to the apps' index file to start the
    Middleware
    Resources
    HttpServer
*/
const log4js = require('log4js');
const log4jsConfig = require('./log4js.json');
const logLayout = require('./core/logLayout');

log4js.addLayout('json', logLayout.json);

log4js.configure(log4jsConfig);
const logger = log4js.getLogger('app.startup');

const { validateConfig } = require('./api/config');

logger.info('Server startup commencing');

try {
    validateConfig();
} catch (err) {
    logger.fatal(`Invalid config: ${err.message}`);
    process.exit(1);
}
const util = require('util');

const cluster = require('cluster');

const server = require('./api/server');
let coreCount = require('os').cpus().length;

process.env.NODE_ENV = process.env.NODE_ENV || null;

process.env.PORT = process.env.PORT || 3000;

if (!process.env.NODE_ENV) {
    logger.fatal('NODE_ENV environment variable not set will exit. No restart will be attempted internally.');
    setTimeout(() => {
        process.exit(1);
    }, 1000);
}

if (process.env.NODE_ENV === 'development') {
    coreCount = 1;

}

const apps = [];

if (cluster.isMaster) {
    for (let i = 0; i < coreCount; i += 1) {
        cluster.fork();
    }

    cluster.on('online', (worker) => {
        logger.info(util.format('Worker %s is online', worker.process.pid));
    });

    cluster.on('exit', (worker, code, signal) => {
        logger.warn('Worker %s died with code: %s, and signal: %s', worker.process.pid, code, signal);
        logger.warn('Starting a new worker');
        cluster.fork();
    });
} else {
    server.start()
        .then((theApp) => {
            apps.push(theApp);
            logger.info('Instance started.');
        })
        .catch((err) => {
            logger.fatal('An instance has failed to start %s', err.stderr || err.message || JSON.stringify(err));
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        });
}
