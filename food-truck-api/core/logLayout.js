const moment = require('moment');
const os = require('os');

function constructLogMessage(dataObj) {
    let message = '';
    dataObj.forEach((data) => { message = `${message} ${data}`; });
    return JSON.stringify(message.replace(/[\r\n]/g, ' | ').trim());
}

const logLayout = {
    json: function json() {
        return (logEvent) => {
            const apiRoute = 'app.routes';
            const message = constructLogMessage(logEvent.data);
            const category = logEvent.categoryName;
            const xRequestId = category === apiRoute && logEvent.context && logEvent.context.xReqId ? logEvent.context.xReqId : '-';
            const statusCode = category === apiRoute && logEvent.context && logEvent.context.statusCode ? logEvent.context.statusCode : '';
            const method = category === apiRoute && logEvent.context && logEvent.context.method ? logEvent.context.method : '';
            const uri = category === apiRoute && logEvent.context && logEvent.context.uri ? logEvent.context.uri : '';
            // const host = logEvent.context && logEvent.context.host ? logEvent.context.host : '-';
            const host = os && os.hostname() ? os.hostname() : '';
            const dateTime = moment(logEvent.startTime).format('YYYY-MM-DD HH:mm:ss');

            let logMessage = `${dateTime} ${host} FoodTruck ${logEvent.pid} ${category} ${logEvent.level.levelStr} `;
            logMessage = `${logMessage} ${xRequestId}`;
            logMessage = statusCode.toString().trim().length > 0 ? `${logMessage} ${method} ${uri} ${statusCode}` : logMessage;
            logMessage = statusCode.toString().trim().length === 0 ? `${logMessage} ${message}` : logMessage;

            return logMessage;
        };
    }
};

module.exports = logLayout;
