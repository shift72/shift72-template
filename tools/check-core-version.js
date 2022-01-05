const fs = require('fs');
const fse = require('fs-extra');
const https = require('https');
const chalk = require('chalk');

const timeStampFile = './.s72';
const coreDir = './node_modules/@shift72/core-template/';
const currentCoreVersion = fse.readJsonSync(coreDir + 'package.json').version;

const getDateTime = () => {
    let rawTimeStamp = Date.now();
    let dateObj = new Date(rawTimeStamp);
    let date = dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    let year = dateObj.getFullYear();
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let seconds = dateObj.getSeconds();
    let dateTime = `${date}/${month}/${year}\n${hours}:${minutes}:${seconds}`;
    return dateTime;
}

let latestCoreVersion;
let currentTimeStamp;
let options = {
    hostname: 'registry.npmjs.org',
    path: '/-/package/@shift72/core-template/dist-tags',
    method: 'GET'
}

https.get(options, (resp) => {
    const { statusCode, statusMessage } = resp;
    const contentType = resp.headers['content-type'];

    let error;

    if (statusCode !== 200) {
        error = new Error('Request Failed.\n' + 
                          `Status Code: ${statusCode} ${statusMessage}`);
    } else if (!/^application\/json/.test(contentType)) {
        error = new Error('Invalid content-type.\n' +
                          `Expected application/json but received ${contentType}`);
    }
    if (error) {
        console.error(error.message);
        resp.resume();
        return;
    }

    resp.setEncoding('utf8');
    let rawData = '';

    resp.on('data', (chunk) => { rawData += chunk; });
    resp.on('end', () => {
        try {
            const parsedData = JSON.parse(rawData);
            latestCoreVersion = parsedData['latest'];
            
            if (!fs.existsSync(timeStampFile)) {
                fs.writeFileSync(timeStampFile, getDateTime(), () => {
                    if (err) throw err;
                });
            }

            currentTimeStamp = fs.readFileSync(timeStampFile, 'utf8');
            console.log(currentTimeStamp);

            if (currentCoreVersion !== latestCoreVersion) {
                return;
            }
        } catch (err) {
            console.error(err.message);
        }
    });
}).on('error', (err) => {
    console.log(`GET error: ${err.message}`);
});
