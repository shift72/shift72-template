const chalk = require('chalk');
const fse = require('fs-extra');
const sass = require('sass');

let error = message => {
  console.error(chalk.renderSync.bold(message));
  process.exit();
};

let log = message => {
  console.log(chalk.green.bold(message))
};

// copy local scss to output
fse.ensureDirSync('./output/site/styles/local');
fse.copySync('./local/site/styles', './output/site/styles/local');

// concat core and local variables files
let localVars = fse.readFileSync('./output/site/styles/local/_variables.scss');
let coreVars = fse.readFileSync('./node_modules/@shift72/core-template/site/styles/_variables.scss');
fse.writeFileSync('./output/site/styles/_variables.scss', [coreVars, localVars].join('\n'));

// do sass
let result = sass.renderSync({
  file: './output/site/styles/main.scss',
  includePaths: ['node_modules'],
  sourceMap: true,
  outFile: './output/site/static/styles/main.css',
  quietDeps: true
});

// write output
fse.writeFile('./output/site/static/styles/main.css', result.css, e => {
  e ? error(e) : log('Dart SASS - Written result to ./output/site/static/styles/main.css')
});
fse.writeFile('./output/site/static/styles/main.css.map', result.map, e => {
  e ? error(e) : log('Dart SASS - Written result to ./output/site/static/styles/main.css.map')
});
