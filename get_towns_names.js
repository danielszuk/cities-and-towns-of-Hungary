/*jslint node: true, nomen: true*/
"use strict";

var request = require('request'),
    readline = require('readline'),
    fs = require('fs'),
    cities = [],
    popLimit = 1000;

function getaPage(nextPage) {
    var ph = 0,
        curCity,
        nextLine,
        i;

    request.get('https://hu.wikipedia.org' + nextPage, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var lines = body.toString().split("\n");
            for (i = 0; i < lines.length; i += 1) {
                switch (ph) {
                case 0:
                    if (lines[i].indexOf("Magyarország településeinek ábécé szerinti tartalomjegyzéke") > -1) {
                        // console.log(lines[i]);
                        ph += 1;
                    }
                    break;
                case 1:
                    nextPage = lines[i].split("selflink")[1].split('<a href="')[1];
                    if (nextPage) {
                        nextPage = nextPage.substring(0, nextPage.indexOf('"'));
                    } else {
                        nextPage = undefined;
                    }
                    // console.log(nextPage);
                    ph += 1;
                    break;
                case 2:
                    if (lines[i].indexOf("wikitable") > -1) {
                        // console.log(lines[i]);
                        ph += 1;
                    }
                    break;
                case 3:
                    if (lines[i].indexOf("th") > -1) {
                        // console.log(lines[i]);
                        ph += 1;
                    }
                    break;
                case 4:
                    if (lines[i].indexOf("</tr>") > -1) {
                        // console.log(i);
                        ph += 1;
                    }
                    break;
                //Új sor egy helység adataihoz
                case 5:
                    if (lines[i].indexOf("<tr>") > -1) {
                        ph += 1;
                    } else if (lines[i].indexOf("</table>") > -1) {
                        ph += 3;
                    }
                    break;
                //Helység neve
                case 6:
                    curCity = lines[i].split("<a href=")[1].split("</a>")[0].split(">")[1];
                    // console.log(curCity);
                    nextLine = i + 4;
                    ph += 1;
                    break;
                //Helység népessége
                case 7:
                    if (i === nextLine) {
                        // console.log(lines[i].split(">")[1].split("<")[0]);
                        //Spaceektől megtisztítjuk a stringet és utána konvertáljuk numberré
                        if (parseInt(lines[i].split(">")[1].split("<")[0].replace(/\s/g, ''), 10) > popLimit) {
                            cities.push(curCity);
                        }
                        ph -= 2;
                    }
                    break;
                case 8:
                    if (nextPage !== undefined) {
                        getaPage(nextPage);
                    } else {
                        console.log(cities.length);
                    }
                    ph += 1;
                    break;
                }
            }
        } else {
            console.error(error);
        }
    });
}

//Startpage
getaPage('/wiki/Magyarország_települései:_A,_Á');
// getaPage('/wiki/Magyarország_települései:_Zs');
