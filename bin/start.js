global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.__DLLS__ = process.env.WEBPACK_DLLS === '1';

const path = require('path');
// const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const favicon = require('serve-favicon');
// const headers = require('../server/utils/headers');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const webpack = require('webpack');
const rimraf = require('rimraf');
const express = require('express');
const mongoose = require('mongoose');
const config = require('../config/config');

const clientConfigProd = require('../webpack/prod.client');
const serverConfigProd = require('../webpack/prod.server');

// const { publicPath } = clientConfigProd.output;
const outputPath = clientConfigProd.output.path;
const rootPath = path.resolve(__dirname, '../');

process.on('unhandledRejection', (error, promise) => {
  console.error('>>>>>>>> BIN > START > process > unhandledRejection > error:', error);
  console.error('>>>>>>>> BIN > START > process > unhandledRejection > promise:', promise);
});

const dbURL = config.mongoDBmongooseURL;

const mongooseOptions = {
  autoReconnect: true,
  keepAlive: true,
  connectTimeoutMS: 30000,
  useNewUrlParser: true
};

const app = express();
const server = http.createServer(app);

const normalizePort = val => {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
};

const port = normalizePort(config.port);

app.set('port', port);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'build', 'static', 'favicon.ico')));

app.use(express.static(outputPath));

// #########################################################################

// app.use(headers);

// #########################################################################

let isBuilt = false;

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log('>>>>>>>> BIN > SERVER > Express server Listening on: ', bind);
  mongoose.Promise = global.Promise;
  mongoose.connect(
    dbURL,
    mongooseOptions,
    err => {
      if (err) {
        console.error('>>>>>>>> BIN > SERVER > Please make sure Mongodb is installed and running!');
      } else {
        console.error('>>>>>>>> BIN > SERVER > Mongodb is installed and running!');
      }
    }
  );
});

const done = () => !isBuilt
  && server.listen(config.port, err => {
    isBuilt = true;
    console.log('>>>>>>>> BIN > SERVER > STATS COMPILER BUILD COMPLETE !!');
    if (err) {
      console.error('>>>>>>>> BIN > SERVER > ERROR:', err);
    }
    console.info('>>>>>>>> BIN > SERVER > Express server Running on Host:', config.host);
    console.info('>>>>>>>> BIN > SERVER > Express server Running on Port:', config.port);
  });

(() => {
  if (config.port) {
    rimraf.sync(path.resolve(rootPath, './build/static/dist/client'));
    rimraf.sync(path.resolve(rootPath, './build/static/dist/server'));

    console.log('>>>>>>>> BIN > SERVER > __DEVELOPMENT__ ?: ', __DEVELOPMENT__);
    console.log('>>>>>>>> BIN > SERVER > STATS COMPILER ATTEMPTING BUILD !! ...');

    // https://webpack.js.org/api/node/

    if (__DEVELOPMENT__) {
      // https://webpack.js.org/api/node/#compiler-instance
      // If you don’t pass the webpack runner function a callback, it will return a webpack Compiler instance.
      // This instance can be used to manually trigger the webpack runner
      // const compiler = webpack([clientConfigDev, configDevServer]);
      // const clientCompiler = compiler.compilers[0];
      // return a webpack Compiler instance
      done();
    } else {
      webpack([clientConfigProd, serverConfigProd]).run((err, stats) => {
        if (err) {
          console.error('>>>>>>>> BIN > SERVER > WEBPACK COMPILE > err: ', err.stack || err);
          if (err.details) {
            console.error('>>>>>>>> BIN > SERVER > WEBPACK COMPILE > err.details: ', err.details);
          }
          return;
        }

        const clientStats = stats.toJson().children[0];

        if (stats.hasErrors()) {
          console.error('>>>>>>>> BIN > SERVER > WEBPACK COMPILE > stats.hasErrors: ', clientStats.errors);
        }
        if (stats.hasWarnings()) {
          console.warn('>>>>>>>> BIN > SERVER > WEBPACK COMPILE > stats.hasWarnings: ', clientStats.warnings);
        }

        const render = require('../build/static/dist/server/server.js').default;

        console.log('>>>>>>>> BIN > SERVER > WEBPACK COMPILE > render: ', render);

        app.use(render({ clientStats }));

        done();
      });
    }
  } else {
    console.error('>>>>>>>> BIN > SERVER > Missing config.port <<<<<<<<<<<<<');
  }
})();

// MONGOOSE CONNECTION EVENTS

mongoose.connection.on('connected', () => {
  console.log(`>>>>>>>> BIN > SERVER > Mongoose Connection: ${dbURL}`);
});

mongoose.connection.on('error', err => {
  console.log(`>>>>>>>> BIN > SERVER > Mongoose Connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('>>>>>>>> BIN > SERVER > Mongoose Connection disconnected');
});

// CLOSE MONGOOSE CONNECTION

const gracefulShutdown = (msg, cb) => {
  mongoose.connection.close(() => {
    console.log(`>>>>>>>> BIN > SERVER > Mongoose Connection closed through: ${msg}`);
    cb();
  });
};

// listen for Node processes / events

// Monitor App termination
// listen to Node process for SIGINT event
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    console.log('>>>>>>>> BIN > SERVER > Mongoose SIGINT gracefulShutdown');
    process.exit(0);
  });
});

// For nodemon restarts
// listen to Node process for SIGUSR2 event
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    console.log('>>>>>>>> BIN > SERVER > Mongoose SIGUSR2 gracefulShutdown');
    process.kill(process.pid, 'SIGUSR2');
  });
});

// For Heroku app termination
// listen to Node process for SIGTERM event
process.on('SIGTERM', () => {
  gracefulShutdown('Heroku app termination', () => {
    console.log('>>>>>>>> BIN > SERVER > Mongoose SIGTERM gracefulShutdown');
    process.exit(0);
  });
});
