const config = require('./../../config').config;

const GetModel = (model, schema) => (conn = false) => {
    const db = (!conn) ? config().masterdb : conn.db;
    return (global.dbconnections[db]) ?
        global.dbconnections[db].model(model, schema) : global.dbconnections.admin.model(model, schema);
};

module.exports = {
    GetModel
};

