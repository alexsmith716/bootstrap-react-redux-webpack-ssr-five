//  enable runtime transpilation to use ES6/7 in node
require('@babel/polyfill');
const path = require('path');
const fs = require('fs');

const babelrc = fs.readFileSync('./.babelrc', 'utf8');
let config;
// 
try {
  config = JSON.parse(babelrc);
  if (Array.isArray(config.plugins)) {
    // config.plugins.push('dynamic-import-node');
    // config.plugins.push('dynamic-import-webpack');
    config.plugins.push(["universal-import", { "babelServer": true }]);
    config.plugins.push(["css-modules-transform", {
      "preprocessCss": "./loaders/sassLoader.js",
      "extensions": [".css", ".scss"], 
      "generateScopedName": "[name]__[local]",
    }]);
    // config.plugins.push(["universal-import", { "babelServer": true }]);
  }
  console.error('>>>>>>>>>>>>>>>>>>> server.babel > SUCCESS: parsing .babelrc !!: ', config)
} catch (err) {
  console.error('>>>>>>>>>>>>>>>>>>> server.babel > Error parsing .babelrc: ', err)
}

require('@babel/register')(config);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Plugins run before Presets
// Plugin ordering is first to last
// Preset ordering is reversed (last to first)
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// https://github.com/css-modules/css-modules-require-hook#processoropts-object
// https://github.com/michalkvasnicak/babel-plugin-css-modules-transform
// https://babeljs.io/docs/en/config-files/#env-option