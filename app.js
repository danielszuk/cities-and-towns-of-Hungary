"use strict";

//If the population number is below the popLimit, the town will be ignored
var defPopLimit = 0,
    popLimit;

var get_names = require('./get_names'),
    get_bound = require('./get_bound'),
    fs = require('fs'),
    arg,
    towns,
    bounds = {},
    boundNum = 0,
    actBound,
    file;

// Handle args
for( var i = process.argv.length - 1; i >= 2; i -= 1 ){
    arg = process.argv[i].split("=");
    // population limit
    if( arg[0] === "limit" ) popLimit = arg[1]
}
popLimit = popLimit || defPopLimit;

console.log("Getting the towns datas... Population limit: " + popLimit);

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
