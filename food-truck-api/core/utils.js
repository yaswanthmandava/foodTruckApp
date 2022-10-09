const { config } = require('../api/config');
const request = require('request-promise-native');
const uuid = require('uuid');
const fs = require('fs');
const logger = require('../core/logger');
const moment = require('moment');

/**
 * returns 1st argument, a convenience for handling err when intentionally suppressing errors
 * @param {type} val - anything
 * @returns {type} - as passed in
 */
function echo(val) {
    return val;
}

function getUTCDate(year, month, dayOfMonth) {
    const date = new Date();
    date.setUTCFullYear(year);
    date.setUTCMonth(month);
    date.setUTCDate(dayOfMonth);
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    return date;
}

function isEmpty(obj) {
    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== 'object') return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    /* eslint-disable no-restricted-syntax */
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }

    return true;
}

function toHashMap(data, keyField, valueField) {
    const result = {};
    data.forEach((element) => {
        result[element[keyField]] = element[valueField];
    });
    return result;
}

function validateDate(date){
    return moment(date, "YYYY-MM-DD").isValid();
}

module.exports = {
    echo,
    getUTCDate,
    isEmpty,
    toHashMap,
    validateDate
};
