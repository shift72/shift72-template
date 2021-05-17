const fse = require('fs-extra');
const path = require('path');
const del = require('del');
const args = require('yargs').argv;
const chalk = require('chalk');

const copyFilter = (src, dest) => {
  let basename = path.basename(src);

  // Don't copy .git files
  if (basename.indexOf('.git') == 0) {
    return false;
  }

  // Don't copy DS_Store files
  if (basename.indexOf('.DS_Store') == 0) {
    return false;
  }

  // Don't copy README files
  if (basename.indexOf('README.md') == 0) {
    return false;
  }

  // Ignore these paths if this is a simple template/static image update
  if (args.mode == 'kibble:watch:local') {
    if (basename.indexOf('_variables.scss') == 0) {
      return false
    }
  }

  return true;
}

// Create destination directory if it does not exist
fse.ensureDirSync('./output');

// Only run these updates on start up
if (args.mode == 'init') {
  // Empty out destination directory except for .kibble
  paths = del.sync(['./output/**', '!./output/.kibble'], { dot: true });

  // Delete .kibble except for .kibble/private.json if it exists
  paths = del.sync(['./output/.kibble/**', '!./output/.kibble/private.json'], { dot: true });

  // Copy core into output
  const coreDir = './node_modules/@shift72/core-template/';
  const coreVersion = fse.readJsonSync(coreDir + 'package.json').version;
  console.log(chalk.green(`core-template@${coreVersion}`));
  fse.copySync(coreDir + 'site', './output/site', copyFilter);
  fse.copySync(coreDir + 'kibble.json', './output/kibble.json', copyFilter);
}

// And then copy local into output
fse.copySync('./local', './output', copyFilter);
