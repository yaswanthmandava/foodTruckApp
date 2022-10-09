/* eslint-disable jsx-a11y/href-no-hash */
/*
    Perform "key" data validations
*/

const uuidv4RegExp = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

function hasStringValue(value) {
    // perform regexp
    return (value != null) && typeof value === 'string' && value.length > 0;
}

function uuidv4(value) {
    // perform regexp
    return (value != null) && typeof value === 'string' && value.length > 0 && value.match(uuidv4RegExp);
}

module.exports = {
    uuidv4,
    hasStringValue
};

