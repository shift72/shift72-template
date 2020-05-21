const fs = require('fs');
const chalk = require('chalk');
const merge = require('deepmerge');

bail = function(message) {
  console.error(chalk.red.bold(message));
  process.exit();
}

log = function(message) {
  console.log(chalk.green.bold(message));
}

var outputFile = process.argv[2];
var masterFile = process.argv[3];
var localFile  = process.argv[4];

if(!fs.existsSync(masterFile)) {
  bail('Core file doesn\'t exist: ' + masterFile);
}

var masterObject = JSON.parse(fs.readFileSync(masterFile));
var localObject = {};

if(!localFile) {
  log('No local file provided, copying master file wholesale');
}
else if(!fs.existsSync(localFile)) {
  log('Local file doesn\'t exist: ' + localFile);
}
else {
  try {
    localObject = JSON.parse(fs.readFileSync(localFile));
  }
  catch(e) {
    bail('Error in parsing local json file: ' + e);
  }
}

var result = merge(masterObject, localObject);

fs.writeFile(outputFile, JSON.stringify(result, null, 4), function(error) {
  if(error) {
    bail(error);
  }
  else {
    log('Written result to ' + outputFile);
  }
});
