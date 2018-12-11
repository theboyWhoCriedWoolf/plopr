/**
 * Container Generator
 */

const path = require('path');
const componentExists = require('../utils/componentExists');
const insertIf = require('../utils/insertIf');
const outputPath = require('../utils/outputPath');
const ifElse = require('../utils/ifElse');

module.exports = (appSrc, freestyle) => ({
  description: 'Add a container component',
  prompts: [
    {
      type: 'list',
      name: 'type',
      message: 'Select the base component type:',
      default: 'Stateless Function',
      choices: () => [
        'Stateless Function',
        'Pure Stateless Function',
        'PureComponent',
        'Component',
      ],
    },
    // insert only if freestyling
    insertIf(freestyle, {
      type: 'directory',
      name: 'from',
      message: 'Where you like to put this component?',
      default: path.join(process.cwd(), appSrc),
      basePath: path.join(process.cwd(), appSrc),
    }),
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'Form',
      validate: (value, { from }) => {
        if (/.+/.test(value)) {
          return componentExists(value, appSrc, `${appSrc}/${from}`)
            ? 'A component or container with this name already exists'
            : true;
        }

        return 'The name is required';
      },
    },
    {
      type: 'confirm',
      name: 'wantHeaders',
      default: false,
      message: 'Do you want headers?',
    },
    {
      type: 'confirm',
      name: 'wantActionsAndReducer',
      default: false,
      message: 'Do you want an actions/constants/reducer tuple for this container?',
    },
    {
      type: 'confirm',
      name: 'wantMessages',
      default: false,
      message: 'Do you want i18n messages (i.e. will this component use text)?',
    },
    {
      type: 'confirm',
      name: 'wantLoadable',
      default: true,
      message: 'Do you want to load resources asynchronously?',
    },
  ].filter(Boolean),
  actions: data => {
    // Generate index.js and index.test.js
    let componentTemplate;

    switch (data.type) {
      case 'Stateless Function': {
        componentTemplate = './container/stateless.js.hbs';
        break;
      }
      case 'Pure Stateless Function': {
        componentTemplate = './container/stateless-memo.js.hbs';
        break;
      }
      default: {
        componentTemplate = './container/class.js.hbs';
      }
    }
    // helper to generate file paths
    const filePath = outputPath(appSrc, data);

    // add additional data to customise templates
    const templateData = {
      scope: `${appSrc}.${(data.from || 'containers').split('/').join('.')}`,
      appSrc: path.join(appSrc, data.from || ''),
    };

    const actions = [
      {
        type: 'add',
        path: filePath('containers', '{{properCase name}}/index.js'),
        templateFile: componentTemplate,
        abortOnFail: true,
      },
      {
        type: 'add',
        path: filePath('containers', '{{properCase name}}/tests/index.test.js'),
        templateFile: './container/test.js.hbs',
        abortOnFail: true,
      },
    ];

    // If component wants messages
    if (data.wantMessages) {
      actions.push({
        type: 'add',
        path: filePath('containers', '{{properCase name}}/messages.js'),
        templateFile: './container/messages.js.hbs',
        abortOnFail: true,
        data: templateData,
      });
    }

    // If they want actions and a reducer, generate actions.js, constants.js,
    // reducer.js and the corresponding tests for actions and the reducer
    if (data.wantActionsAndReducer) {
      // Actions
      actions.push({
        type: 'add',
        path: filePath('containers', '{{properCase name}}/actions.js'),
        templateFile: './container/actions.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: filePath('containers', '{{properCase name}}/tests/actions.test.js'),
        templateFile: './container/actions.test.js.hbs',
        abortOnFail: true,
      });

      // Constants
      actions.push({
        type: 'add',
        path: filePath('containers', '{{properCase name}}/constants.js'),
        templateFile: './container/constants.js.hbs',
        abortOnFail: true,
      });

      // Reducer
      actions.push({
        type: 'add',
        path: filePath('containers', '{{properCase name}}/reducer.js'),
        templateFile: './container/reducer.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: filePath('containers', '{{properCase name}}/tests/reducer.test.js'),
        templateFile: './container/reducer.test.js.hbs',
        abortOnFail: true,
      });
    }

    // async loading
    if (data.wantLoadable) {
      actions.push({
        type: 'add',
        path: filePath('containers', '{{properCase name}}/Loadable.js'),
        templateFile: './component/loadable.js.hbs',
        abortOnFail: true,
      });
    }

    // prettify
    actions.push({
      type: 'prettify',
      path: ifElse(data.from, '/containers/'),
    });

    return actions;
  },
});
