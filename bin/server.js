// @flow

require('../server.babel');
// const path = require('path');
// const fs = require('fs');
// const rootPath = path.resolve(__dirname, '..');
const webpack = require('webpack');

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.__DLLS__ = process.env.WEBPACK_DLLS === '1';

const clientConfigProd = require('../webpack/webpack.config.client.production.babel.js');
// const serverConfigProd = require('../webpack/webpack.config.server.production.babel.js');
// ---------------------------------------------------------------------------------------------
let isBuilt = false;
// ---------------------------------------------------------------------------------------------
const done = () => !isBuilt
  && (() => {
    console.log('>>>>>>>> BIN > SERVER > STATS BUILD COMPLETE <<<<<<<<<<<<');
    isBuilt = true;
  })();
// ---------------------------------------------------------------------------------------------
if (__DEVELOPMENT__) {
  console.log('>>>>>>>> BIN > SERVER > __DEVELOPMENT__ ?: ', __DEVELOPMENT__);
} else {
  console.log('>>>>>>>> BIN > SERVER > __DEVELOPMENT__ ?: ', __DEVELOPMENT__);
  // webpack([clientConfigProd, serverConfigProd]).run((err, stats) => {
  webpack(clientConfigProd).run((err, stats) => {
    if (err) {
      console.error('>>>>>>>> BIN > SERVER > WEBPACK COMPILE > err: ', err.stack || err);
      if (err.details) {
        console.error('>>>>>>>> BIN > SERVER > WEBPACK COMPILE > err.details: ', err.details);
      }
      return;
    }
    const clientStats = stats.toJson().children[0];
    // https://nodejs.org/api/fs.html
    if (stats.hasErrors()) {
      console.error('>>>>>>>> BIN > SERVER > WEBPACK COMPILE > stats.hasErrors: ', clientStats.errors);
    }
    if (stats.hasWarnings()) {
      console.warn('>>>>>>>> BIN > SERVER > WEBPACK COMPILE > stats.hasWarnings: ', clientStats.warnings);
    }
    console.log('>>>>>>>> BIN > SERVER > clientStats > BUILT: ', clientStats);
    done();
  });
}

// require('../server/index');
