/*jslint node: true, nomen: true*/
"use strict";

var request = require('sync-request'),
    towns = [];

function getaPage(url, popLimit) {
    var res = request('GET', 'https://hu.wikipedia.org' + url),
        lines,
        ph = 0,
        curCity,
        nextLine,
        nextPage,
        i;

    if (res.statusCode === 200) {
        lines = res.body.toString().split("\n");
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
                        towns.push(curCity);
                        process.stdout.clearLine();
                        process.stdout.cursorTo(0);
                        process.stdout.write(curCity);
                    }
                    ph -= 2;
                }
                break;
            case 8:
                if (nextPage !== undefined) {
                    return {'status': "in_progress", 'next_page': nextPage};
                }
                return {'status': "finished"};
            }
        }
    }
}

module.exports = function (popLimit) {
    var nextPage = '/wiki/Magyarország_települései:_A,_Á',
        res;
    while (nextPage) {
        res = getaPage(nextPage, popLimit);
        if (res.status === "in_progress") {
            nextPage = res.next_page;
        } else if (res.status === "finished") {
            nextPage = undefined;
            return towns;
        }
    }
};
