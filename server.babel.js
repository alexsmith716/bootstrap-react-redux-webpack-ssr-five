//  enable runtime transpilation to use ES6/7 in node
require('@babel/polyfill');
const path = require('path');
const fs = require('fs');

const babelrc = fs.readFileSync('./.babelrc', 'utf8');
let config = {};

try {
  config = JSON.parse(babelrc);
  // if (Array.isArray(config.plugins)) {
  // 	const ioui = config.plugins.indexOf('universal-import');
  //   if (ioui) {
  //     config.plugins.splice(ioui,1);
  //   }
  // }
  console.error('>>>>>>>>>>>>>>>>>>> server.babel > SUCCESS: parsing .babelrc !!typeof: ', typeof config);
  console.error('>>>>>>>>>>>>>>>>>>> server.babel > SUCCESS: parsing .babelrc !!: ', config);
} catch (err) {
  console.error('>>>>>>>>>>>>>>>>>>> server.babel > Error parsing .babelrc: ', err);
}

require('@babel/register')(config);

// ok, makes sense, now i remember!
// https://github.com/faceyspacey/babel-plugin-universal-import
// https://github.com/faceyspacey/babel-plugin-universal-import#typescript-and-non-babel-environments

// // https://github.com/istarkov/babel-plugin-webpack-loaders
// Babel 6 plugin allows you to use webpack loaders in Babel
// replaces require - import statements with webpack loaders results
// plugin tests all require paths with test regexps from the loaders in the webpack config, and then for each successful test:
//  1) synchronously executes webpack
//  2) parses webpack output using babel-parse
//  3) replaces the required ast with the parsed ast output

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Plugins run before Presets
// Plugin ordering is first to last
// Preset ordering is reversed (last to first)
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// https://babeljs.io/docs/en/babel-register
// https://babeljs.io/docs/en/babel-register#babel-disable-cache
// ###########################################################################################

// https://github.com/css-modules/css-modules-require-hook#processoropts-object
// https://github.com/michalkvasnicak/babel-plugin-css-modules-transform
// https://babeljs.io/docs/en/config-files/#env-option
