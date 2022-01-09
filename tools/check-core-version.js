const fs = require('fs');
const fse = require('fs-extra');
const https = require('https');
const chalk = require('chalk');

const timeStampFile = './.s72';
const coreDir = './node_modules/@shift72/core-template/';
const localCoreVersion = fse.readJsonSync(coreDir + 'package.json').version;
const dateTimeStandardFormatOrigin = '1/1/1970 0:0:0 UTC';
const dateTimeMillisecondsOrigin = 0;
const dateTimeStandardFormatEnd = '1/1/2122 0:0:0 UTC';
const dateTimeMillisecondsEnd = Date.parse(dateTimeStandardFormatEnd);
const twentyFourHoursMilliseconds = 86400000;

const getCurrentDateTime = () => {
    let rawTimeStamp = Date.now();
    let dateObj = new Date(rawTimeStamp);
    let date = dateObj.getUTCDate();
    let month = dateObj.getUTCMonth() + 1;
    let year = dateObj.getUTCFullYear();
    let hours = dateObj.getUTCHours();
    let minutes = dateObj.getUTCMinutes();
    let seconds = dateObj.getUTCSeconds();
    let dateTime = `${date}/${month}/${year} ${hours}:${minutes}:${seconds} UTC`;
    return dateTime;
}

let latestCoreVersion;
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
            let currentDateTimeStandardFormat = getCurrentDateTime();
            let currentDateTimeMilliseconds = Date.parse(currentDateTimeStandardFormat);
            
            // AC: .s72 file does not exist
            if (!fs.existsSync(timeStampFile)) {
                fs.writeFileSync(timeStampFile, currentDateTimeStandardFormat, () => {
                    if (err) throw err;
                });
            }

            let savedTimeStamp = fs.readFileSync(timeStampFile, 'utf8');

            let savedDateTimeMilliseconds = Date.parse(savedTimeStamp);
            // AC: The timestamp is invalid
            if (Number.isNaN(savedDateTimeMilliseconds) || savedDateTimeMilliseconds < dateTimeMillisecondsOrigin || savedDateTimeMilliseconds >= dateTimeMillisecondsEnd) {
                fs.writeFileSync(timeStampFile, currentDateTimeStandardFormat, () => {
                    if (err) throw err;
                });
            } else if (currentDateTimeMilliseconds - savedDateTimeMilliseconds > twentyFourHoursMilliseconds) { // AC: The timestamp is in the past
                fs.writeFileSync(timeStampFile, currentDateTimeStandardFormat, () => {
                    if (err) throw err;
                });
            } else if (currentDateTimeMilliseconds - savedDateTimeMilliseconds < twentyFourHoursMilliseconds) { // AC: The timestamp is in the future
                fs.writeFileSync(timeStampFile, currentDateTimeStandardFormat, () => {
                    if (err) throw err;
                });
            }

            if (localCoreVersion !== latestCoreVersion) {
                return;
            }
        } catch (err) {
            console.error(err.message);
        }
    });
}).on('error', (err) => {
    console.log(`GET error: ${err.message}`);
});
