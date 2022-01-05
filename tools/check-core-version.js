const fse = require('fs-extra');
const https = require('https');
const chalk = require('chalk');

const coreDir = './node_modules/@shift72/core-template/';
const currentCoreVersion = fse.readJsonSync(coreDir + 'package.json').version;
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

            if (currentCoreVersion !== latestCoreVersion) {
                // make timestamp
                return;
            }
        } catch (err) {
            console.error(err.message);
        }
    });
}).on('error', (err) => {
    console.log(`GET error: ${err.message}`);
});
