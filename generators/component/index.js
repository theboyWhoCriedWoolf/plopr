/**
 * Component Generator
 */

const path = require('path');
const componentExists = require('../utils/componentExists');
const insertIf = require('../utils/insertIf');
const outputPath = require('../utils/outputPath');
const ifElse = require('../utils/ifElse');

module.exports = (appSrc, freestyle = false) => ({
  description: 'Add an unconnected component',
  prompts: [
    {
      type: 'list',
      name: 'type',
      message: 'Select the type of component',
      default: 'Stateless Stateless',
      choices: () => [
        'Stateless Function',
        'Pure Stateless Function',
        'PureComponent',
        'Component',
      ],
    },
    insertIf(freestyle, {
      type: 'directory',
      name: 'from',
      message: 'Where you like to put this component?',
      basePath: path.join(process.cwd(), appSrc),
    }),
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'Button',
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
      name: 'wantMessages',
      default: false,
      message: 'Do you want i18n messages (i.e. will this component use text)?',
    },
    {
      type: 'confirm',
      name: 'wantLoadable',
      default: false,
      message: 'Do you want to load the component asynchronously?',
    },
  ].filter(Boolean),
  actions: data => {
    // Generate index.js and index.test.js
    let componentTemplate;

    switch (data.type) {
      case 'Stateless Function': {
        componentTemplate = './component/stateless.js.hbs';
        break;
      }

      case 'Pure Stateless Function': {
        componentTemplate = './component/stateless-memo.js.hbs';
        break;
      }

      default: {
        componentTemplate = './component/class.js.hbs';
      }
    }

    // helper to generate file paths
    const filePath = outputPath(appSrc, data);

    // specify actions to create component
    const actions = [
      {
        type: 'add',
        path: filePath('components', '{{properCase name}}/index.js'),
        templateFile: componentTemplate,
        abortOnFail: true,
      },
      {
        type: 'add',
        path: filePath('components', '{{properCase name}}/tests/index.test.js'),
        templateFile: './component/test.js.hbs',
        abortOnFail: true,
      },
    ];

    // If they want a i18n messages file
    if (data.wantMessages) {
      actions.push({
        type: 'add',
        path: filePath('components', '{{properCase name}}/messages.js'),
        templateFile: './component/messages.js.hbs',
        abortOnFail: true,
        data: {
          scope: `${appSrc}.${(data.from || 'containers').split('/').join('.')}`,
        },
      });
    }

    // If want Loadable.js to load the component asynchronously
    if (data.wantLoadable) {
      actions.push({
        type: 'add',
        path: filePath('components', '{{properCase name}}/Loadable.js'),
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
