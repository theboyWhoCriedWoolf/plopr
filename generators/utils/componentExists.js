const fs = require('fs');
const path = require('path');

/**
 * Check if exists
 * before trying to load contents
 */
function readDir(dir) {
  const dirPath = path.join(process.cwd(), dir);

  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs.readdirSync(dirPath);
}

/**
 * Specify all component
 * locations
 */
const components = baseDir => [
  `${baseDir}/components`, // components
  `${baseDir}/containers`, // containers
  `${baseDir}/utils`, // utils
];

/**
 * Test if component already exists
 */
function componentExists(comp, baseDir = '', from = '') {
  return [...components(baseDir), from].find(dir => readDir(dir).indexOf(comp) >= 0);
}

module.exports = componentExists;
