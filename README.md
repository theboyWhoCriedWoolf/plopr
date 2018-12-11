## **plopR** - A React Plop Generator

A React plop generator to quickly and simply create React components with the latest React features, such as Hooks, Lazy and more.

> Quickly generate both Components & Containers with actions, reducers, Intl and test scaffolding.

### Installation

```js
// install using npm
npm -i -D plopr
// using yarn
yarn add plopr --dev
```

### Getting Started

```js
"Scripts": {
    // key can be any name or value you wish
    "plopr": "plopr"
}
```

Now, just call it with with whatever package manager you want. `yarn plopr`. Thats it!.

### Available Prompts

Plopr offers the following Prompts (for now anyway):

#### Component

```js
// Component type
 - [Stateless, Pure Stateless, Component]
// Component Name
 - [Name]
// Translations
 - [Intl]
// Load component asynchronously
 - [Anync Loadable]
```

#### Container

```js
// Component type
 - [Stateless, Pure Stateless, Component]
// Component Name
 - [Name]
// Headers using react-helmet
 - [Headers]
// Actions and Reducers using React Hooks
 - [Actions and Reducers]
// Translations
 - [Intl]
// Load component asynchronously
 - [Anync Loadable]
```

### Options

Plopr allows you to set two options:

```js
// set the app src folder - (default is src)
plopr --appSrc={your application src folder}
// allows you to change the default output path of components
// - containers = {appSrc}/containers
// - components = {appSrc}/components
plopr --freestyle
```

## Contribution

Please feel free to contribute. This generator was made to provide a basic starting point, however it is easily extensible.

made with :purple_heart:.
