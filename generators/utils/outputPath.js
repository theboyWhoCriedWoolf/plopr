/**
 * Output path
 */

const path = require('path');
const ifElse = require('./ifElse');

const outputPath = (appSrc, data) => (baseDir, filePath) => {
  const dir = path.join(process.cwd(), appSrc, ifElse(data.from, baseDir));
  return `${dir}/${filePath}`;
};

module.exports = outputPath;
