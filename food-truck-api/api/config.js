const dotenv = require('dotenv');
const log4js = require('log4js');

const logger = log4js.getLogger();

function getConfig() {
    // Loads env variables from .env file (does nothing when the file does not exist)
    dotenv.config();

    const cfg = {
        checkHttps: process.env.CHECK_HTTPS === 'true',
        mongoUrl: process.env.MONGO_URL,
        masterdb: process.env.MASTERDB
    };

    return cfg;
}

function validateConfig() {
    // if a value is set in process.env, it is always a string
    // if a value is not set in process.env, it is undefined
    // therefore we need to test for both cases
    const cfg = getConfig();
    Object.keys(cfg).forEach((key) => {
        if (cfg[key] === 'undefined' || typeof cfg[key] === 'undefined' || cfg[key] === '') {
            throw new Error(`Please define "${key}" configuration value. See your .env file or the environment variables of your system to configure the missing parameters.`);
        }
    });

    return true;
}

module.exports = {
    config: getConfig,
    validateConfig
};
