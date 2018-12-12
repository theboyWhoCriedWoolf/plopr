const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const promptDirectory = require('inquirer-directory');
const { argv } = require('yargs');

// import generators
const componentGenerator = require('./component');
const containerGenerator = require('./container');

module.exports = plop => {
  // gather cli arguments
  const appSrc = argv.appSrc || 'src';
  const { freestyle } = argv;

  // generators
  plop.setGenerator('component', componentGenerator(appSrc, freestyle));
  plop.setGenerator('container', containerGenerator(appSrc, freestyle));

  /**
   * Helpers
   */
  plop.setPrompt('directory', promptDirectory);
  plop.addHelper('curly', (object, open) => (open ? '{' : '}'));
  plop.addHelper('directory', comp => {
    try {
      fs.accessSync(path.join(__dirname, `../../app/containers/${comp}`), fs.F_OK);
      return `containers/${comp}`;
    } catch (e) {
      return `components/${comp}`;
    }
  });

  /**
   * Action types
   */
  plop.setActionType('prettify', (answers, config) => {
    const folderPath = `${path.join(
      process.cwd(),
      appSrc,
      config.path,
      plop.getHelper('properCase')(answers.name),
      '**.js',
    )}`;

    exec(`prettier --write "${folderPath}" && eslint "${folderPath}" --fix `);
    return folderPath;
  });
};
