const fs = require('fs');
const fse = require('fs-extra');
const https = require('https');
const chalk = require('chalk');

const timestampFile = './.s72';
const coreDir = './node_modules/@shift72/core-template/';
const localCoreVersion = fse.readJsonSync(coreDir + 'package.json').version;

const dateTimeMillisecondsOrigin = 0;
const dateTimeStandardFormatEnd = '1/1/2122 0:0:0 UTC';
const dateTimeMillisecondsEnd = Date.parse(dateTimeStandardFormatEnd);
const twentyFourHoursMilliseconds = 86400000;

const getCurrentDateTime = () => {
    let rawTimestamp = Date.now();
    let date = new Date(rawTimestamp);
    let dateStr = date.toUTCString();
    return dateStr;
}

const updateTimestamp = (timestampFile, currentDateTimeStandardFormat) => {
    fs.writeFileSync(timestampFile, currentDateTimeStandardFormat, () => {
        if (err) throw err;
    });
}

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
        error = new Error('Request Failed\n' + 
                          `HTTP Status Code and Message: ${statusCode} ${statusMessage}`);
    } else if (!/^application\/json/.test(contentType)) {
        error = new Error('Invalid content-type.\n' +
                          `Expected application/json but received ${contentType}`);
    }
    if (error) {
        console.error(chalk.red(error.message));
        resp.resume();
        return;
    }

    resp.setEncoding('utf8');
    let rawData = '';

    resp.on('data', (chunk) => { rawData += chunk; });
    resp.on('end', () => {
        try {
            const parsedData = JSON.parse(rawData);
            let latestCoreVersion = parsedData['latest'];
            let currentDateTimeStandardFormat = getCurrentDateTime();
            let currentDateTimeMilliseconds = Date.parse(currentDateTimeStandardFormat);
            
            if (!fs.existsSync(timestampFile)) {
                updateTimestamp(timestampFile, currentDateTimeStandardFormat);
            }

            let savedTimestamp = fs.readFileSync(timestampFile, 'utf8');
            let savedDateTimeMilliseconds = Date.parse(savedTimestamp);

            if (Number.isNaN(savedDateTimeMilliseconds) || savedDateTimeMilliseconds < dateTimeMillisecondsOrigin || savedDateTimeMilliseconds >= dateTimeMillisecondsEnd) {
                updateTimestamp(timestampFile, currentDateTimeStandardFormat);
            } else if (currentDateTimeMilliseconds - savedDateTimeMilliseconds > twentyFourHoursMilliseconds) {
                updateTimestamp(timestampFile, currentDateTimeStandardFormat);
            }

            if (localCoreVersion !== latestCoreVersion) {
                console.log(chalk.green(`Installed core version: ${localCoreVersion}`));
                console.log(chalk.green(`Available core version: ${latestCoreVersion}`));
                console.log(chalk.green('You can update your installed core version if you wish'));
            }
        } catch (err) {
            console.error(chalk.red(err.message));
        }
    });
}).on('error', (err) => {
    console.log(chalk.red(`GET error: ${err.message}`));
});
