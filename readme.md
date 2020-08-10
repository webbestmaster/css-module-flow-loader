# css-module-flow-loader

[![Build Status](https://travis-ci.org/webbestmaster/css-module-flow-loader.svg?branch=master)](https://travis-ci.org/github/webbestmaster/css-module-flow-loader)
[![GitHub license](https://img.shields.io/npm/l/css-module-flow-loader)](https://github.com/webbestmaster/css-module-flow-loader/blob/master/license)
[![npm version](https://img.shields.io/npm/v/css-module-flow-loader.svg?style=flat)](https://www.npmjs.com/package/css-module-flow-loader)
[![GitHub stars](https://img.shields.io/github/stars/webbestmaster/css-module-flow-loader?style=social&maxAge=2592000)](https://github.com/webbestmaster/css-module-flow-loader/)

Webpack loader for creating [Flow](https://flow.org/) type definitions based on [CSS Modules](https://github.com/css-modules/css-modules) files.

This gives you:
- flow type safety showing usage of non existing classes
- auto-completing for css files in most editors

## How it works

Given the following css file using CSS Modules:
```css
.my_class {
    display: block;
}
```

`css-module-flow-loader` creates the following .flow file next to it:

```javascript
// @flow strict
/* This file is automatically generated by css-module-flow-loader */
declare module.exports: {|
    +'my_class': string;
|};
```

## How to use

The `css-module-flow-loader` need to be added right after `style-loader`:

```sh
$ npm i -D css-module-flow-loader
```

```javascript
{
  test: /\.css$/,  // or the file format you are using for your CSS Modules
  use: [
    'style-loader',
    'css-module-flow-loader',
    // other loaders here ...
  ]
}
```

## Troubleshooting

### Support for other file extensions

To support `.scss`, `.sass`, `.scss.module` or similar files extensions you need to update your `.flowconfig` file with the following section:

```
[options]
# Extensions
module.file_ext=.js
module.file_ext=.jsx
module.file_ext=.json
module.file_ext=.css
module.file_ext=.scss
module.file_ext=.sass
module.file_ext=.scss.module
// other files used by flow
```

Without this Flow might error out with `Required module not found`.
