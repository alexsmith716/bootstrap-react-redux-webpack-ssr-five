import fs from 'fs';
import express from 'express';
import helmet from 'helmet';
import config from '../config/config';
import compression from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import morgan from 'morgan';
import path from 'path';
import http from 'http';
import favicon from 'serve-favicon';
import headers from './utils/headers';
import mongoose from 'mongoose';
import httpProxy from 'http-proxy';
import Cookies from 'cookies';

import { getStoredState } from 'redux-persist';
import { CookieStorage, NodeCookiesWrapper } from 'redux-persist-cookie-storage';

// #########################################################################

import React from 'react';
import ReactDOM from 'react-dom/server';
import { StaticRouter } from 'react-router';

import asyncMatchRoutes from './utils/asyncMatchRoutes';
import { ReduxAsyncConnect, Provider } from '../shared';

import createMemoryHistory from 'history/createMemoryHistory';

import createStore from '../client/redux/createStore';

import { ConnectedRouter } from 'connected-react-router';
import { renderRoutes } from 'react-router-config';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import { trigger } from 'redial';

import Html from './utils/Html';
import routes from '../shared/routes';
import { parse as parseUrl } from 'url';

import { createApp } from './app';
import apiClient from './utils/apiClient';

import { getStats, waitStats } from './utils/stats';

import renderClientStats from './renderClientStats';
const outputPath = path.resolve(__dirname, '..');

import webpack from 'webpack';

import { clearChunks, flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
// import { flushFiles } from 'webpack-flush-chunks'

// ###########################################################################
// ######## ---------- SPECIFY LOADABLE COMPONENTS PATH --------------- ######
// ###########################################################################

const loadableChunksPath = path.join(__dirname, '..', 'static', 'dist', 'loadable-chunks.json');
// /Users/../bootstrap-redux-react-loadable-webpack-dllplugin/build/public/assets/loadable-chunks.json
console.log('>>>>>>>>>>>>>>>>> SERVER > loadableChunksPath +++++++++: ', loadableChunksPath);

const webpackStatsPath = path.join(__dirname, '..', 'build', 'static', 'dist', 'stats.json');
console.log('>>>>>>>>>>>>>>>>> SERVER > webpackStatsPath +++++++++: ', webpackStatsPath);

const clientConfigProd = require('../webpack/webpack.config.client.production.babel.js');

// ###########################################################################
// ######## ------------------- CONFIGURE MONGOOSE -------------------- ######
// ###########################################################################

const dbURL = config.mongoDBmongooseURL;

if (process.env.NODE_ENV === 'production') {
  // dbURL = config.mongoLabURL;
};

const mongooseOptions = {
  autoReconnect: true,
  keepAlive: true,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
};

mongoose.Promise = global.Promise;

mongoose.connect(dbURL, mongooseOptions).then(
  () => { console.log('####### > Mongodb is installed and running!'); },
  err => { console.error('####### > Please make sure Mongodb is installed and running!'); }
);

// https://mongoosejs.com/docs/connections.html#multiple_connections
// mongoose.createConnection('mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]', options);

// ###########################################################################
// ######## ----------------- CATCH UNCAUGHT ERRORS ------------------- ######
// ###########################################################################

// catch uncaught errors at a global level:
// promises swallow errors without a catch() statement
// always call .catch() on your promises
// 'unhandledrejection' event is fired when a Promise is rejected but there is no rejection handler to deal with the rejection
process.on('unhandledRejection', (error, promise) => {
  console.error('>>>>>>>>>>>>>>>>> SERVER > process > unhandledRejection > promise:', promise);
  console.error('>>>>>>>>>>>>>>>>> SERVER > process > unhandledRejection > error:', error);
});

const app = new express();
const server = http.createServer(app);

if (__DEVELOPMENT__) {
  console.log('>>>>>>>>>>>>>>>>> SERVER > __DEVELOPMENT__ ?: ', __DEVELOPMENT__);
} else {
  console.log('>>>>>>>>>>>>>>>>> SERVER > __DEVELOPMENT__ ?: ', __DEVELOPMENT__);
}

app.use((req, res) => {
  console.log('>>>>>>>>>>>>>>>>> SERVER > APP > USE !!! <<<<<<<<<<<<<<<<<');
});
// app.use((req, res) => {
// 
//   clearChunks();
// 
//   const chunkNames = flushChunkNames();
//   const { js, styles, cssHash, scripts, stylesheets } = flushChunks(webpackStats, { chunkNames });
// 
//   console.log('>>>>>>>>>>>>>>>>> renderClientStats > req.path: ', req.path)
//   console.log('>>>>>>>>>>>>>>>>> renderClientStats > chunkNames: ', chunkNames)
//   console.log('>>>>>>>>>>>>>>>>> renderClientStats > js: ', js)
//   console.log('>>>>>>>>>>>>>>>>> renderClientStats > scripts: ', scripts)
//   console.log('>>>>>>>>>>>>>>>>> renderClientStats > stylesheets: ', stylesheets)
// 
//   // >>>>>>>>>>>>>>>>> renderClientStats > req.path:  /
//   // >>>>>>>>>>>>>>>>> renderClientStats > chunkNames:  []
//   // >>>>>>>>>>>>>>>>> renderClientStats > js:  { toString: [Function: toString] }
//   // >>>>>>>>>>>>>>>>> renderClientStats > scripts:  [ 'bootstrap.5de8ed1ad9607da14ec0.bundle.js', 'main.59e6aaae336101753abc.chunk.js' ]
//   // >>>>>>>>>>>>>>>>> renderClientStats > stylesheets:  [ 'main.css' ]
// 
// });

(async () => {
  if (config.port) {
    try {
      const wsp = await waitStats(webpackStatsPath);
      // console.log('>>>>>>>>>>>>>>>>> SERVER > waitStats > webpackStats: ', wsp);
    } catch (error) {
      console.error('>>>>>>>>>>>>>>>>> SERVER > Preload Error ------:', err);
    }
    server.listen(config.port, err => {
      if (err) {
        console.error('>>>>>>>>>>>>>>>>> SERVER > ERROR:', err);
      }
      console.info('>>>>>>>>>>>>>>>>> SERVER > Running on Host:', config.host);
      console.info('>>>>>>>>>>>>>>>>> SERVER > Running on Port:', config.port);
    });
  } else {
    console.error('>>>>>>>>>>>>>>>>> SERVER > Missing config.port <<<<<<<<<<<<<');
  }
})();

// #########################################################################

// MONGOOSE CONNECTION EVENTS

mongoose.connection.on('connected', () => {
  console.log('####### > Mongoose Connection: ' + dbURL);
});

mongoose.connection.on('error', (err) => {
  console.log('####### > Mongoose Connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
  console.log('####### > Mongoose Connection disconnected');
});

// CLOSE MONGOOSE CONNECTION

let gracefulShutdown = (msg, cb) => {
  mongoose.connection.close(() => {
    console.log('####### > Mongoose Connection closed through: ' + msg);
    cb();
  })
};

// listen for Node processes / events

// Monitor App termination
// listen to Node process for SIGINT event
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    console.log('####### > Mongoose SIGINT gracefulShutdown');
    process.exit(0);
  })
});

// For nodemon restarts
// listen to Node process for SIGUSR2 event
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    console.log('####### > Mongoose SIGUSR2 gracefulShutdown');
    process.kill(process.pid, 'SIGUSR2');
  })
});

// For Heroku app termination
// listen to Node process for SIGTERM event
process.on('SIGTERM', () => {
  gracefulShutdown('Heroku app termination', () => {
    console.log('####### > Mongoose SIGTERM gracefulShutdown');
    process.exit(0);
  })
});
