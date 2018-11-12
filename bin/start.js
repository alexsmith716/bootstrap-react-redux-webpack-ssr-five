const path = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');
// const app = require('express');

// const clientConfig = require('../webpack/client.prod');
// const serverConfig = require('../webpack/server.prod');
const clientConfig = require('../webpack/CLIENT');
const serverConfig = require('../webpack/SERVER');

const rootPath = path.resolve(__dirname, '../');

const __DEVELOPMENT__ = process.env.NODE_ENV === 'development';

let isBuilt = false;

const done = () => !isBuilt
  && (() => {
    console.log('>>>>>>>> BIN > SERVER > STATS BUILD COMPLETE <<<<<<<<<<<<');
    isBuilt = true;
  })();

rimraf.sync(path.resolve(rootPath, './build/static/dist/client'));
rimraf.sync(path.resolve(rootPath, './build/static/dist/server'));

if (__DEVELOPMENT__) {
  console.log('>>>>>>>> BIN > SERVER > __DEVELOPMENT__ ?: ', __DEVELOPMENT__);
} else {
  console.log('>>>>>>>> BIN > SERVER > __DEVELOPMENT__ ?: ', __DEVELOPMENT__);
  webpack([clientConfig, serverConfig]).run((err, stats) => {
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
    // console.log('>>>>>>>> BIN > SERVER > clientStats > BUILT: ', clientStats);
    done();
  });
}
