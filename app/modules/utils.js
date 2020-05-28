'use strict';

const DateTime = require('luxon').DateTime;

function toISO8601Date(date) {
    if(date) {
        let result = DateTime.fromJSDate(date).toISODate();

        return result;
    }
}

function toISO8601DateTime(dateTime) {
    if(dateTime) {
        let result = DateTime.fromJSDate(dateTime).toISO({ includeOffset: false });

        return result;
    }
}

exports.toISO8601Date = toISO8601Date;
exports.toISO8601DateTime = toISO8601DateTime;