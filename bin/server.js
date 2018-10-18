// @flow

require('../server.babel');
// const path = require('path');
// const rootPath = path.resolve(__dirname, '..');
const webpack = require('webpack');

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.__DLLS__ = process.env.WEBPACK_DLLS === '1';

const clientConfigProd = require('../webpack/webpack.config.client.production.babel.js');
// const serverConfigProd = require('../webpack/webpack.config.server.production.babel.js');

if (__DEVELOPMENT__) {
  console.log('>>>>>>>> BIN > SERVER > __DEVELOPMENT__ ?: ', __DEVELOPMENT__);
} else {
  console.log('>>>>>>>> BIN > SERVER > __DEVELOPMENT__ ?: ', __DEVELOPMENT__);
  // webpack([clientConfigProd, serverConfigProd]).run((err, stats) => {
  webpack(clientConfigProd, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log('>>>>>>>> BIN > SERVER > clientStats > ERRORS: ', err);
    }
    console.log('>>>>>>>> BIN > SERVER > clientStats > GOOD!');
    console.log('>>>>>>>> BIN > SERVER > clientStats > GOOD > STATS!', stats);
  });
}

// require('../server/index');
