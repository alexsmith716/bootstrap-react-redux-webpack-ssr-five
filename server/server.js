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
// import Loadable from 'react-loadable';
// import { getBundles } from 'react-loadable/webpack';
import { trigger } from 'redial';

import Html from './utils/Html';
import routes from '../shared/routes';
import { parse as parseUrl } from 'url';

import { createApp } from './app';
import apiClient from './utils/apiClient';

import { waitStats } from './utils/stats';

import webpack from 'webpack';

import { clearChunks, flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
// import { flushFiles } from 'webpack-flush-chunks';
import { getStats } from './utils/stats';

const outputPath = path.resolve(__dirname, '..');

// ================================

if (__DEVELOPMENT__) {
  console.log('>>>>>>>>>>>>>>>>> SERVER > __DEVELOPMENT__ ?: ', __DEVELOPMENT__);
} else {
  console.log('>>>>>>>>>>>>>>>>> SERVER > __DEVELOPMENT__ ?: ', __DEVELOPMENT__);
}

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

// ###########################################################################
// ######## ---------- SPECIFY LOADABLE COMPONENTS PATH --------------- ######
// ###########################################################################

// const loadableChunksPath = path.join(__dirname, '..', 'static', 'dist', 'loadable-chunks.json');
// console.log('>>>>>>>>>>>>>>>>> SERVER > loadableChunksPath +++++++++: ', loadableChunksPath);

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

// ================================

const targetUrl = `http://${config.apiHost}:${config.apiPort}`;
const app = new express();
const server = http.createServer(app);

const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: true
});

const normalizePort = (val)  => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
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
// app.use(helmet());
// app.use(helmet.xssFilter());
// app.use(headers);

// #########################################################################

app.use(cookieParser()); // parse cookie header and populate req.cookies
app.use(compression()); // compress request response bodies

app.use(favicon(path.join(__dirname, '..', 'build', 'static', 'favicon.ico')))
app.use('/manifest.json', (req, res) => res.sendFile(path.join(__dirname, '..', 'build', 'static', 'manifest.json')));

// #########################################################################

app.use('/dist/service-worker.js', (req, res, next) => {
  console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ service-worker $$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  res.setHeader('Service-Worker-Allowed', '/');
  res.setHeader('Cache-Control', 'no-store');
  return next();
});

// #########################################################################

app.use('/dist/dlls/:dllName.js', (req, res, next) => {
  console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ DLLs $$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  fs.access(
    path.join(__dirname, '..', 'static', 'dist', 'dlls', `${req.params.dllName}.js`),
    fs.constants.R_OK,
    err => (err ? res.send(`console.log('No dll file found (${req.originalUrl})')`) : next())
  );
});

// #########################################################################

app.use(express.static(path.join(__dirname, '..', 'static')));

// #########################################################################

// app.use(headers);
app.use((req, res, next) => {
  res.setHeader('X-Forwarded-For', req.ip);
  return next();
});

// #########################################################################

app.use((req, res, next) => {
  console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ IN > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.ip +++++++++++++: ', req.ip);
  console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.method +++++++++++++++: ', req.method);
  console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.url ++++++++++++++++++: ', req.url);
  console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.path ++++++++++++++++++: ', req.path);
  // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.headers ++++++++++++++: ', req.headers);
  // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.cookies ++++++++++++++: ', req.cookies);
  // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.session ++++++++: ', req.session);
  // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.params +++++++++: ', req.params);
  console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.originalUrl ++++: ', req.originalUrl);
  console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ IN < $$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  return next();
});

// ##################################################################################################################
// ########## ------------------------------------------ API --------------------------------------------- ##########
// ##################################################################################################################

// PORT (3030)
// proxy any requests to '/api/*' >>>>>>>>> the API server
// all the data fetching calls from client go to '/api/*'
// #########################################################################


app.use('/api', (req, res) => {
  console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ /API $$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  proxy.web(req, res, { target: targetUrl });
});

app.use('/ws', (req, res) => {
  console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ /WS $$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  proxy.web(req, res, { target: `${targetUrl}/ws` });
});

console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ / $$$$$$$$$$$$$$$$$$$$$$$$$$$$$');

proxy.on('error', (error, req, res) => {

  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }

  if (!res.headersSent) {
    res.writeHead(500, { 'content-type': 'application/json' });
  }

  const json = {
    error: 'proxy_error',
    reason: error.message
  };

  res.end(JSON.stringify(json));
});

// ##################################################################################################################
// ########## ---------------------------------------- SERVER -------------------------------------------- ##########
// ##################################################################################################################

app.use(async (req, res, next) => {

  console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > SetUpComponent !! START !! $$$$$$$$$$$$$$$$$$$$$$');

  // ###########################################################################
  // ######## ----- CONFIGURE SERVER FOR API COMM (REST/AXIOS-AJAX) ----- ######
  // ###########################################################################

  // passing session cookie (req)
  const providers = {
    app: createApp(req),
    client: apiClient(req)
  };
  // console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > providers.app !!: ', providers.app);
  // console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > providers.client !!: ', providers.client);


  // ###########################################################################
  // ######## ----------- CREATE NON-DOM HISTORY OBJECT ----------------- ######
  // ###########################################################################

  // manage session history
  // API to manage the history stack, navigate, confirm navigation and persist state between sessions
  // history object is mutable
  // create non-dom 'createMemoryHistory()' method
  // create method with option 'initialEntries'
  // option 'initialEntries' assigned value 'req.originalUrl' (requested URL)
  const history = createMemoryHistory({ initialEntries: [req.originalUrl] });

  console.log('>>>>>>>>>>>>>>>>>>> SERVER.JS > APP LOADER > history: ', history)


  // ###########################################################################
  // ######## ------- SET THE CURRENT USER DEPENDING ON THE ------------- ######
  // ######## ---------- STATE OF COOKIE CREATED ON CLIENT ------------ ########
  // ###########################################################################

  // redux-persist-cookie-storage: redux persist cookie
  // Read-only mode: using getStoredState()
  // create cookie jar 'Cookies()'
  // pass 'cookie jar' to Redux Persist storage 'NodeCookiesWrapper()'
  const cookieJar = new NodeCookiesWrapper(new Cookies(req, res)); // node module for getting and setting HTTP cookies

  const persistConfig = {
    key: 'root',
    storage: new CookieStorage(cookieJar),
    stateReconciler: (inboundState, originalState) => originalState,
    whitelist: ['auth', 'info',]
  };

  let preloadedState;

  // read stored cookies: getStoredState()
  // preloadedState:
  //    {
  //    auth: {loaded: false,loading: false,error: {}},
  //    info: {loaded: true,loading: false,data: {message: 'This came from the api server',time: 1530540780215}}
  //    }

  try {
    // Returns a promise of restored state (getStoredState())
    preloadedState = await getStoredState(persistConfig);
    console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > preloadedState !! 1111111111');
  } catch (e) {
    preloadedState = {};
    console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > preloadedState !! 222222222');
  }
  console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > preloadedState !! =======================: ', preloadedState);

  // ###########################################################################
  // ######## -------------------- CREATE STORE ----------------------- ########
  // ###########################################################################

  const store = createStore({
    history,
    data: preloadedState,
    helpers: providers
  });

  // store.subscribe(() =>
  //   console.log('>>>>>>>>>>>>>>>>>>> SERVER.JS > APP LOADER > store.getState(): ', store.getState())
  // )

  // ###########################################################################
  // ######## ----------------- function hydrate ---------------------- ########
  // ###########################################################################

  function hydrate() {
    res.write('<!doctype html>');
    // ReactDOM.renderToNodeStream():
    // Returns a Readable stream that outputs an HTML string
    // HTML output by this stream is exactly equal to what ReactDOM.renderToString() returns
    ReactDOM.renderToNodeStream(<Html assets={webpackAssets} store={store} />).pipe(res);
  }

  if (__DISABLE_SSR__) {
    return hydrate();
  }

  // ###########################################################################
  // ######## ----------------- TRY SUCESSFUL SSR ---------------------- #######
  // ###########################################################################

  // ------------------------------------------------------------------------------------------------------

  try {

    const { components, match, params } = await asyncMatchRoutes(routes, req.path);

    const locals = {
      ...providers,
      store,
      match,
      params,
      history,
      location: history.location
    };

    await trigger( 'fetch', components, locals);

    const context = {};

    const component = (
      <Provider store={store} {...providers}>
        <ConnectedRouter history={history}>
          <StaticRouter location={req.originalUrl} context={context}>
            <ReduxAsyncConnect routes={routes} store={store} helpers={providers}>
              {renderRoutes(routes)}
            </ReduxAsyncConnect>
          </StaticRouter>
        </ConnectedRouter>
      </Provider>
    );
    
    // console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADERSS > ==================== component: ', component);

    // ------------------------------------------------------------------------------------------------------

    // console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > context: ', context);

    // test context prop to find out what the result of rendering was
    // context.url ? the app redirected
    // 301: status.redirect
    // send a redirect from the server
    if (context.url) {
      return res.redirect(301, context.url);
    }

    const locationState = store.getState().router.location;

    // console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > store.getState: ', store.getState());
    // console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > locationState: ', locationState);

    // decodeURIComponent: decode percent-encoded characters in the query string
    // parses a URL Query String into a collection of key and value pairs
    // 'foo=bar&abc=xyz&abc=123' >>>> '{foo: 'bar',abc: ['xyz', '123']}'
    // https://nodejs.org/api/all.html#querystring_querystring_parse_str_sep_eq_options
    if (decodeURIComponent(req.originalUrl) !== decodeURIComponent(locationState.pathname + locationState.search)) {
      return res.redirect(301, locationState.pathname);
    }

    // ------------------------------------------------------------------------------------------------------

    const content = ReactDOM.renderToString(component);

    // ------------------------------------------------------------------------------------------------------

    const clientStats = getStats();
    // console.log('>>>>>>>>>>>>>>>>> SERVER > clientStats: ', clientStats);
    clearChunks();
    const chunkNames = flushChunkNames();
    console.log('>>>>>>>>>>>>>>>>> SERVER > chunkNames: ', chunkNames);

    // const scripts = flushFiles(clientStats, { chunkNames, filter: 'js' });
    // const styles = flushFiles(clientStats, { chunkNames, filter: 'css' });

    // scripts:  [ 'bootstrap.ba1b422eeb0d78f07d43.bundle.js', 'main.f8c3be17197dd531d4b5.chunk.js' ]
    // stylesheets:  [ 'main.aa610604945cbff30901.css' ]
    const { js, styles, cssHash, scripts, stylesheets } = flushChunks( clientStats, { chunkNames } )

    // const {
    //   // react components:
    //   Js, // javascript chunks
    //   Styles, // external stylesheets
    //   Css, // raw css

    //   // strings:
    //   js, // javascript chunks
    //   styles, // external stylesheets
    //   css, // raw css

    //   // arrays of file names (not including publicPath):
    //   scripts,
    //   stylesheets,
    //   
    //   publicPath
    // } = flushChunks(clientStats, {
    //   chunkNames,
    //   before: ['bootstrap'],
    //   after: ['main'],
    //   rootDir: path.join(__dirname, '..'),
    //   outputPath
    // })

    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > JS: ', Js);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > STYLES: ', Styles);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > CSS: ', Css);
    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > js: ', js);
    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > styles: ', styles);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > css: ', css);
    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > cssHash: ', cssHash);
    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > scripts: ', scripts);
    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > stylesheets: ', stylesheets);

    console.log('>>>>>>>>>>>>>>>> SERVER > ==================== content!!!!!!: ', content);

    // const html = <Html assets={webpackAssets} store={store} content={content} bundles={scripts} />;
    // const ssrHtml = `<!doctype html>${ReactDOM.renderToString(html)}`;
    // console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > RESPOND TO CLIENT !! > ReactDOM.renderToString(html):', ssrHtml);

    res.status(200).send('SERVER > Response Ended For Testing!!!!!!! Status 200!!!!!!!!!');

  } catch (error) {
    console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > TRY > ERROR > error: ', error);
    res.status(500);
    hydrate();
  }

});

// #########################################################################

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
