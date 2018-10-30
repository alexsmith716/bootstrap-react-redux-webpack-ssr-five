
require('source-map-support/register');

var startServer = require('universal-webpack/server');
var settings = require('../webpack/universal-webpack-settings');
var configuration = require('../webpack/webpack.config');

console.log('>>>>>>>>>>>>>>> SERVER > INDEX.JS > configuration >>>>>>>>>>>>>>>: ', configuration);
console.log('>>>>>>>>>>>>>>> SERVER > INDEX.JS > settings >>>>>>>>>>>>>>>>>>>>: ', settings);

startServer(configuration, settings);
