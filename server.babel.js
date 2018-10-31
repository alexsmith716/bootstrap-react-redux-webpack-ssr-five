//  enable runtime transpilation to use ES6/7 in node
require('@babel/polyfill');

const fs = require('fs');

const babelrc = fs.readFileSync('./.babelrc', 'utf8');
let config;

try {
  config = JSON.parse(babelrc);
  if (Array.isArray(config.plugins)) {
    // config.plugins.push("dynamic-import-node");
    // config.plugins.push(["dynamic-import-node", { "noInterop": true }]);
    // config.plugins.push("dynamic-import-webpack");
    config.plugins.push(["css-modules-transform", {"generateScopedName": "[name]__[local]"}]);
    config.plugins.push(["universal-import", {"babelServer": true}]);
  }
  console.error('>>>>>>>>>>>>>>>>>>> server.babel > SUCCESS: parsing .babelrc !!: ', config)
} catch (err) {
  console.error('>>>>>>>>>>>>>>>>>>> server.babel > Error parsing .babelrc: ', err)
}

require('@babel/register')(config);