/*jslint node: true, nomen: true*/
"use strict";

var request = require('sync-request');

function getBound(town) {
    var res = request('GET', 'https://maps.googleapis.com/maps/api/geocode/json?&address=' + encodeURI(town));
    if (res.statusCode === 200) {
        res = JSON.parse(res.body).results[0];
        if (res) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write(town + " bounds added");
            return res.geometry.viewport;
        }
        return undefined;
    }
    return console.error("Get_bounds error: " + res.statusCode, res);
}

module.exports = getBound;
