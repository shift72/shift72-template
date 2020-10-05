module.exports = (file) => {
  if (file === 'output/site/static/js/rollup-target.js')
    return false;
  return true;
};