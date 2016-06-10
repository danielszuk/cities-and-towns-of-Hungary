/*jslint node: true, nomen: true*/
"use strict";

//If the population number below of popLimit, the town will be ignored
var popLimit = 3000;

var get_names = require('./get_names'),
    fs = require('fs'),
    towns,
    file;

towns = get_names(popLimit);

file = fs.createWriteStream('output/towns.js');
file.write("towns=");
file.write(JSON.stringify(towns));
file.end();

console.log(towns.length + " towns data succesfully writed to output/towns.js");
