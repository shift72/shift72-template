const fs = require('fs');
const chalk = require('chalk');

const src = 'local/site/static/js';
const dest = 'output/site/static/js'

console.log(chalk.dim(`copy-js: ${src} -> ${dest}`));

const files = fs.readdirSync(src);

files.forEach(file => {
  const srcFile = '' + src + '/' + file;
  const destFile = '' + dest + '/' + file;
  fs.writeFileSync(destFile, fs.readFileSync(srcFile));
});