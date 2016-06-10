/*jslint node: true, nomen: true*/
"use strict";

//If the population number is below the popLimit, the town will be ignored
var popLimit = 5000;

var get_names = require('./get_names'),
    get_bound = require('./get_bound'),
    fs = require('fs'),
    towns,
    bounds = {},
    boundNum = 0,
    actBound,
    file;

towns = get_names(popLimit);

file = fs.createWriteStream('output/towns.js');
file.write("towns=");
file.write(JSON.stringify(towns));
file.end();

process.stdout.clearLine();
process.stdout.cursorTo(0);
process.stdout.write(towns.length + " towns names succesfully writed to output/towns.js\n");

towns.forEach(function (town) {
    actBound = get_bound(town);
    if (actBound) {
        bounds[town] = actBound;
        boundNum += 1;
    } else {
        console.error("Can't get bounds for the town, named: " + town);
    }
});

file = fs.createWriteStream('output/bounds.js');
file.write("bounds=");
file.write(JSON.stringify(bounds));
file.end();

process.stdout.clearLine();
process.stdout.cursorTo(0);
process.stdout.write(boundNum + " towns bounds-data succesfully writed to output/bounds.js\n");
