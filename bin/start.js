const path = require('path');
const express = require('express');
// const helmet = require('helmet');
// const headers = require('../server/utils/headers');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const http = require('http');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const webpack = require('webpack');
// const webpackDevMiddleware = require('webpack-dev-middleware');
// const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../config/config');

const clientConfigDev = require('../webpack/dev.client');
// const serverConfigDev = require('../webpack/dev.server');

const clientConfigProd = require('../webpack/prod.client');
const serverConfigProd = require('../webpack/prod.server');

// const { publicPath } = clientConfigDev.output
const outputPath = clientConfigDev.output.path;

console.log('>>>>>>>> BIN > START > STATS COMPILER COMPLETED BUILD !! outputPath: ', outputPath);

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
  const parseIntPort = parseInt(val, 10);
  if (Number.isNaN(parseIntPort)) {
    // named pipe
    return val;
  }
  if (parseIntPort >= 0) {
    // port number
    return parseIntPort;
  }
  return false;
};

const port = normalizePort(config.port);

// const serverOptions = {
//   contentBase: 'http://localhost:3001/dist/client/',
//   quiet: true,
//   noInfo: true,
//   hot: true,
//   inline: true,
//   lazy: false,
//   publicPath: 'http://localhost:3001/dist/client/',
//   headers: { 'Access-Control-Allow-Origin': '*' }
// };

// app.set('port', port);
app.use(morgan('dev'));

// app.use(helmet());
// app.use(helmet.contentSecurityPolicy(config.app.csp));
// app.use(helmet.xssFilter());
// app.use(headers);

app.use(cookieParser());
app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'build', 'static', 'favicon.ico')));

// #########################################################################

let isBuilt = false;

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    console.error('>>>>>>>> BIN > START > ERROR > Address in use, retrying...');
    setTimeout(() => {
      server.close();
      server.listen(port, config.host);
    }, 1000);
  }
});

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  console.log('>>>>>>>> BIN > START > Express server Listening on: ', bind);
  mongoose.Promise = global.Promise;
  mongoose.connect(
    dbURL,
    mongooseOptions,
    err => {
      if (err) {
        console.error('>>>>>>>> BIN > START > Please make sure Mongodb is installed and running!');
      } else {
        console.error('>>>>>>>> BIN > START > Mongodb is installed and running!');
      }
    }
  );
});

const done = () => !isBuilt
  && server.listen(port, err => {
    isBuilt = true;
    console.log('>>>>>>>> BIN > START > STATS COMPILER COMPLETED BUILD !! __DEVELOPMENT__: ', __DEVELOPMENT__);
    if (err) {
      console.error('>>>>>>>> BIN > START > ERROR:', err);
    }
    console.info('>>>>>>>> BIN > START > Express server Running on Host:', config.host);
    console.info('>>>>>>>> BIN > START > Express server Running on Port:', port);
  });

if (config.port) {
  console.log('>>>>>>>> BIN > START > __DEVELOPMENT__ ?: ', __DEVELOPMENT__);
  console.log('>>>>>>>> BIN > START > STATS COMPILER ATTEMPTING BUILD !! ...');

  app.use(express.static(outputPath));

  if (__DEVELOPMENT__) {
    // // https://webpack.js.org/api/node/#compiler-instance
    // // If you don’t pass the webpack runner function a callback, it will return a webpack Compiler instance.
    // // This instance can be used to manually trigger the webpack runner
    // // return a webpack Compiler instance

    // // convenient option ---------------------------------------------
    // // https://github.com/60frames/webpack-hot-server-middleware

    // const compiler = webpack([clientConfigDev, serverConfigDev]);

    // const clientCompiler = compiler.compilers[0];
    // // const serverCompiler = compiler.compilers[1];

    // const devMiddleware = webpackDevMiddleware(compiler, serverOptions);

    // app.use(devMiddleware);

    // app.use(webpackHotMiddleware(clientCompiler));

    // // execute a callback function when the compiler bundle is valid, typically after compilation
    // devMiddleware.waitUntilValid(done);

    webpack([clientConfigProd, serverConfigProd]).run((err, stats) => {
      if (err) {
        console.error('>>>>>>>> BIN > START > WEBPACK COMPILE > PROD > err: ', err.stack || err);
        if (err.details) {
          console.error('>>>>>>>> BIN > START > WEBPACK COMPILE > PROD > err.details: ', err.details);
        }
        return;
      }

      const clientStats = stats.toJson().children[0];

      if (stats.hasErrors()) {
        console.error('>>>>>>>> BIN > START > WEBPACK COMPILE > PROD > stats.hasErrors: ', clientStats.errors);
      }
      if (stats.hasWarnings()) {
        console.warn('>>>>>>>> BIN > START > WEBPACK COMPILE > PROD > stats.hasWarnings: ', clientStats.warnings);
      }

      // Done processing ---------------------------------------------------------------------
      const render = require('../build/static/dist/server/server.js').default;

      // console.log('>>>>>>>> BIN > START > WEBPACK COMPILE > render: ', render);

      app.use(render({ clientStats }));

      done();
    });
  } else {
    // webpack provides a Node.js API which can be used directly in Node.js runtime
    // the Node.js API is useful in scenarios in which you need to customize the build or development process
    // all the reporting and error handling must be done manually and webpack only does the compiling part
    // For this reason the stats configuration options will not have any effect (no stats about module builds)
    webpack([clientConfigProd, serverConfigProd]).run((err, stats) => {
      if (err) {
        console.error('>>>>>>>> BIN > START > WEBPACK COMPILE > PROD > err: ', err.stack || err);
        if (err.details) {
          console.error('>>>>>>>> BIN > START > WEBPACK COMPILE > PROD > err.details: ', err.details);
        }
        return;
      }

      const clientStats = stats.toJson().children[0];

      if (stats.hasErrors()) {
        console.error('>>>>>>>> BIN > START > WEBPACK COMPILE > PROD > stats.hasErrors: ', clientStats.errors);
      }
      if (stats.hasWarnings()) {
        console.warn('>>>>>>>> BIN > START > WEBPACK COMPILE > PROD > stats.hasWarnings: ', clientStats.warnings);
      }

      // Done processing ---------------------------------------------------------------------
      const render = require('../build/static/dist/server/server.js').default;

      // console.log('>>>>>>>> BIN > START > WEBPACK COMPILE > render: ', render);

      app.use(render({ clientStats }));

      done();
    });
  }
} else {
  console.error('>>>>>>>> BIN > START > Missing config.port <<<<<<<<<<<<<');
}

// MONGOOSE CONNECTION EVENTS

mongoose.connection.on('connected', () => {
  console.log(`>>>>>>>> BIN > START > Mongoose Connection: ${dbURL}`);
});

mongoose.connection.on('error', err => {
  console.log(`>>>>>>>> BIN > START > Mongoose Connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('>>>>>>>> BIN > START > Mongoose Connection disconnected');
});

// CLOSE MONGOOSE CONNECTION

const gracefulShutdown = (msg, cb) => {
  mongoose.connection.close(() => {
    console.log(`>>>>>>>> BIN > START > Mongoose Connection closed through: ${msg}`);
    cb();
  });
};

// listen for Node processes / events

// Monitor App termination
// listen to Node process for SIGINT event
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    console.log('>>>>>>>> BIN > START > Mongoose SIGINT gracefulShutdown');
    process.exit(0);
  });
});

// For nodemon restarts
// listen to Node process for SIGUSR2 event
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    console.log('>>>>>>>> BIN > START > Mongoose SIGUSR2 gracefulShutdown');
    process.kill(process.pid, 'SIGUSR2');
  });
});

// For Heroku app termination
// listen to Node process for SIGTERM event
process.on('SIGTERM', () => {
  gracefulShutdown('Heroku app termination', () => {
    console.log('>>>>>>>> BIN > START > Mongoose SIGTERM gracefulShutdown');
    process.exit(0);
  });
});
