// const fs = require('fs');
const path = require('path');
// const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const favicon = require('serve-favicon');
// const headers = require('../server/utils/headers');
// const httpProxy = require('http-proxy');
// const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const webpack = require('webpack');
const rimraf = require('rimraf');
const express = require('express');
const mongoose = require('mongoose');
const config = require('../config/config');
const clientConfig = require('../webpack/prod.client');
const serverConfig = require('../webpack/prod.server');

const rootPath = path.resolve(__dirname, '../');

const __DEVELOPMENT__ = process.env.NODE_ENV === 'development';

process.on('unhandledRejection', (error, promise) => {
  console.error('>>>>>>>>>>>>>>>>> SERVER > process > unhandledRejection > promise:', promise);
  console.error('>>>>>>>>>>>>>>>>> SERVER > process > unhandledRejection > error:', error);
});

const dbURL = config.mongoDBmongooseURL;

const mongooseOptions = {
  autoReconnect: true,
  keepAlive: true,
  connectTimeoutMS: 30000,
  useNewUrlParser: true
};

// const targetUrl = `http://${config.apiHost}:${config.apiPort}`;
const app = express();
const server = http.createServer(app);

// const proxy = httpProxy.createProxyServer({target: targetUrl,ws: true});

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

// #########################################################################

app.use(cookieParser());
app.use(compression());

app.use(favicon(path.join(__dirname, '..', 'build', 'static', 'favicon.ico')));

app.use(express.static(path.join(__dirname, '..', 'static')));

let isBuilt = false;

const done = () => !isBuilt
  && (() => {
    console.log('>>>>>>>> BIN > SERVER > STATS BUILD COMPLETE <<<<<<<<<<<<');
    isBuilt = true;
    mongoose.Promise = global.Promise;
    mongoose.connect(
      dbURL,
      mongooseOptions,
      err => {
        if (err) {
          console.error('####### > Please make sure Mongodb is installed and running!');
        } else {
          console.error('####### > Mongodb is installed and running!');
        }
      }
    );
    server.listen(config.port, err => {
      isBuilt = true;
      if (err) {
        console.error('>>>>>>>>>>>>>>>>> SERVER > ERROR:', err);
      }
      console.info('>>>>>>>>>>>>>>>>> SERVER > Running on Host:', config.host);
      console.info('>>>>>>>>>>>>>>>>> SERVER > Running on Port:', config.port);
    });
  })();

if (config.port) {
  rimraf.sync(path.resolve(rootPath, './build/static/dist/client'));
  rimraf.sync(path.resolve(rootPath, './build/static/dist/server'));

  if (__DEVELOPMENT__) {
    console.log('>>>>>>>> BIN > SERVER > __DEVELOPMENT__ ?: ', __DEVELOPMENT__);
    done();
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
      console.log('>>>>>>>> BIN > SERVER > clientStats > BUILT !!!! <<<<<<<<<<<<<<<');
      done();
    });
  }
} else {
  console.error('>>>>>>>>>>>>>>>>> SERVER > Missing config.port <<<<<<<<<<<<<');
}

// MONGOOSE CONNECTION EVENTS

mongoose.connection.on('connected', () => {
  console.log(`####### > Mongoose Connection: ${dbURL}`);
});

mongoose.connection.on('error', err => {
  console.log(`####### > Mongoose Connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('####### > Mongoose Connection disconnected');
});

// CLOSE MONGOOSE CONNECTION

const gracefulShutdown = (msg, cb) => {
  mongoose.connection.close(() => {
    console.log(`####### > Mongoose Connection closed through: ${msg}`);
    cb();
  });
};

// listen for Node processes / events

// Monitor App termination
// listen to Node process for SIGINT event
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    console.log('####### > Mongoose SIGINT gracefulShutdown');
    process.exit(0);
  });
});

// For nodemon restarts
// listen to Node process for SIGUSR2 event
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    console.log('####### > Mongoose SIGUSR2 gracefulShutdown');
    process.kill(process.pid, 'SIGUSR2');
  });
});

// For Heroku app termination
// listen to Node process for SIGTERM event
process.on('SIGTERM', () => {
  gracefulShutdown('Heroku app termination', () => {
    console.log('####### > Mongoose SIGTERM gracefulShutdown');
    process.exit(0);
  });
});
