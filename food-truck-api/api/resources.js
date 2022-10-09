/*
    load all the required resources i.e.
    db, redis, mq etc that the app uses.
 */

const url = require('url');
const mongoose = require('mongoose');

const utils = require('../core/utils');
const envConfig = require('./config').config;
const models = require('./v1/models');
const logger = require('log4js').getLogger('app.resource');

const resource = {};
mongoose.Promise = Promise;

function registerSchema(orgName) {
    const db = mongoose.connection.useDb(orgName);
    Object.keys(models).map((model) => {
        const schema = models[model];
        return db.modelNames().includes(model) ?
            db.model(model) :
            db.model(model, schema);
    });
    return db;
}

/**
 * initialise the mongo db
 * @returns {Promise.<void>}
 */
async function initialiseMongo() {
    try {
        const mongoUrl = envConfig().mongoUrl;
        const db = await mongoose.connect(mongoUrl);
        global.dbconnections = {
            admin: registerSchema(envConfig().masterdb)
        };
        logger.addContext('resourceName', 'Mongo');
        logger.info('connected to host %s', mongoUrl);
        return db;
    } catch (err) {
        logger.fatal('Failed to connect to Mongo');
        throw err;
    }
}

/**
 * Gracefully shut down resources.
 * @returns Promise
 */
async function close() {
    try {
        if (resource.mongo) {
            await resource.mongo.close();
        }
    } catch (e) {
        utils.echo(e);
    }
}


/**
 * Intialise the applications' resources
 * @returns Promise
 */
async function start() {
    await close();
    resource.mongo = await initialiseMongo();
}

module.exports = {
    start,
    close,
    resource
};
