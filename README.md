# cities-and-towns-of-hungary
Get the cities and towns of Hungary names, and latitude, longitude bounds

#Requirements
1. You need node.js installed on your system ([Node.js](https://nodejs.org))
2. You need npm installed on your system ([npm](https://www.npmjs.com/))

#Usage
1. Install npm packages `npm install`
1. Run the application `node app`
2. The towns names saved to **output/towns.js** (array format)
3. The towns bounds saved to **output/bounds.js** (object format)

#Options and defaults
1. With the limit parameter (e.g. `node app limit=15000`) you can set the population limit (the town which population is below the limit, not added to the list)
**By default the population limit is 0.**
