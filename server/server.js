import fs from 'fs';
import config from '../config/config';
import path from 'path';
import http from 'http';
import httpProxy from 'http-proxy';
import Cookies from 'cookies';

import { getStoredState } from 'redux-persist';
import { CookieStorage, NodeCookiesWrapper } from 'redux-persist-cookie-storage';

import React from 'react';

// ----------------------------------
import asyncMatchRoutes from '../server/utils/asyncMatchRoutes';
// ----------------------------------

// ----------------------------------
import { ReduxAsyncConnect, Provider } from '../shared';
// ----------------------------------

// ----------------------------------
import { ConnectedRouter } from 'connected-react-router';
import { StaticRouter } from 'react-router';
// ----------------------------------

// ----------------------------------
import { renderRoutes } from 'react-router-config';
// ----------------------------------

// ----------------------------------
import ReactDOM from 'react-dom/server';
// ----------------------------------

import createMemoryHistory from 'history/createMemoryHistory';

import createStore from '../client/redux/createStore';

import routes from '../shared/routes';

import { trigger } from 'redial';

import { createApp } from './app';
// import { createApp } from '../server/appServer';
import apiClient from './utils/apiClient';

// holds a global cache of all the universal components that are rendered and makes them available via flushChunkNames
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import { flushFiles } from 'webpack-flush-chunks';

import Html from '../server/utils/Html';

// ------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------

const targetUrl = `http://${config.apiHost}:${config.apiPort}`;

const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: true
});

export default ({ clientStats }) => async (req, res) => {

  // progressive app manifest
  // https://www.w3.org/TR/appmanifest/
  if (req.url == '/manifest.json') {
    console.log('>>>>>>>>>>>>>>>>> SERVER > manifest.json <<<<<<<<<<<<<<<<<<<<<<<');
    return res.sendFile(path.join(__dirname, '..', 'build', 'static', 'manifest.json'));
  }

  // if (req.url == '/dist/service-worker.js') {
  //   console.log('>>>>>>>>>>>>>>>>> SERVER > service-worker <<<<<<<<<<<<<<<<<<<<<<<');
  //   res.setHeader('Service-Worker-Allowed', '/');
  //   res.setHeader('Cache-Control', 'no-store');
  //   return;
  // }

  if (req.url == '/dlls/:dllName.js') {
    console.log('>>>>>>>>>>>>>>>>> SERVER > /dlls/:dllName.js <<<<<<<<<<<<<<<<<<<<<<<');
    return fs.access(
      path.join(__dirname, '..', 'build', 'static', 'dist', 'dlls', `${req.params.dllName}.js`),
      fs.constants.R_OK,
      err => (err ? res.send(`console.log('No dll file found (${req.originalUrl})')`) : null)
    );
  };

  res.setHeader('X-Forwarded-For', req.ip);

  console.log('>>>>>>>>>>>>>>>>> SERVER > IN > <<<<<<<<<<<<<<<<<<<<<<<');
  // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.ip +++++++++++++: ', req.ip);
  console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.method +++++++++++++++: ', req.method);
  console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.url ++++++++++++++++++: ', req.url);
  console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.path ++++++++++++++++++: ', req.path);
  // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.headers ++++++++++++++: ', req.headers);
  // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.cookies ++++++++++++++: ', req.cookies);
  // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.session ++++++++: ', req.session);
  // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.params +++++++++: ', req.params);
  console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.originalUrl ++++: ', req.originalUrl);
  console.log('>>>>>>>>>>>>>>>>> SERVER > IN < <<<<<<<<<<<<<<<<<<<<<<<');

  // #########################################################################

  if (req.url == '/api') {
    console.log('>>>>>>>>>>>>>>>>> SERVER > /API <<<<<<<<<<<<<<<<<<<<<<<');
    proxy.web(req, res, { target: targetUrl });
    //return;
  }

  if (req.url == '/ws') {
    console.log('>>>>>>>>>>>>>>>>> SERVER > /WS <<<<<<<<<<<<<<<<<<<<<<<');
    proxy.web(req, res, { target: `${targetUrl}/ws` });
    //return;
  }

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

  console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > SetUpComponent !! START !! <<<<<<<<<<<<<<<<<<<<<<<');

  const providers = {
    app: createApp(req),
    client: apiClient(req)
  };

  const history = createMemoryHistory({ initialEntries: [req.originalUrl] });

  console.log('>>>>>>>>>>>>>>>>>>> SERVER.JS > APP LOADER > history: ', history)

  const cookieJar = new NodeCookiesWrapper(new Cookies(req, res)); // node module for getting and setting HTTP cookies

  const persistConfig = {
    key: 'root',
    storage: new CookieStorage(cookieJar),
    stateReconciler: (inboundState, originalState) => originalState,
    whitelist: ['auth', 'info',]
  };

  let preloadedState;

  try {
    // Returns a promise of restored state (getStoredState())
    preloadedState = await getStoredState(persistConfig);
    console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > preloadedState !! 1111111111');
  } catch (e) {
    preloadedState = {};
    console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > preloadedState !! 222222222');
  }
  console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > preloadedState !! =======================: ', preloadedState);

  const store = createStore({
    history,
    data: preloadedState,
    helpers: providers
  });

  console.log('>>>>>>>>>>>>>>>>>>> SERVER.JS > APP LOADER > STORE: ', store);

  try {

    const { components, match, params } = await asyncMatchRoutes(routes, req.path);

    console.log('>>>>>>>>>>>>>>>> SERVER > await asyncMatchRoutes > components: ', components);
    console.log('>>>>>>>>>>>>>>>> SERVER > await asyncMatchRoutes > match: ', match);
    console.log('>>>>>>>>>>>>>>>> SERVER > await asyncMatchRoutes > params: ', params);

    const locals = {
      ...providers,
      store,
      match,
      params,
      history,
      location: history.location
    };

    await trigger( 'fetch', components, locals);

    // const chunkNames = [];
    const context = {};

    // build step and render step ARE separate
    // const component = (
    //   <ReportChunks report={chunkName => chunkNames.push(chunkName)}>
    //    ...
    //   </ReportChunks>
    // );

    // build step and render step NOT separate
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
  
    const content = ReactDOM.renderToString(component);

    // ------------------------------------------------------------------------------------------------------

    // array of chunks flushed from react-universal-component
    const chunkNames = flushChunkNames();

    console.log('>>>>>>>>>>>>>>>>> SERVER > HERE !!! > chunkNames: ', chunkNames);

    // flushChunks and flushFiles: called immediately after ReactDOMServer.renderToString. 
    // They are used in server-rendering to extract the minimal amount of chunks to send to the client, 
    // thereby solving a missing piece for code-splitting: server-side rendering

    // ------------------------------------------------------------------------------------------------------

    const flushedFiles = flushFiles(clientStats, { chunkNames });
    // const flushedFilesFilter = flushedFiles.filter(file => file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.map'));

    console.log('>>>>>>>>>>>>>>>>> SERVER > flushFiles > flushedFiles: ', flushedFiles);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushFiles > flushedFilesFilter: ', flushedFilesFilter);

    // -----------------------------------------------------------------------------

    const assets = flushChunks(clientStats, { chunkNames });

    // const assets = {
    //   // react components:
    //   Js,                // javascript chunks
    //   Styles,            // external stylesheets
    //   Css,               // raw css
    // 
    //   // strings:
    //   js,                // javascript chunks
    //   styles,            // external stylesheets
    //   css,               // raw css
    // 
    //   // arrays of file names:
    //   scripts,
    //   stylesheets,
    // 
    //   // cssHash for use with babel-plugin-dual-import:
    //   cssHashRaw,        // hash object of chunk names to css file paths
    //   cssHash,           // string: <script>window.__CSS_CHUNKS__ = ${JSON.stringify(cssHashRaw)}</script>
    //   CssHash,           // react component of above
    // 
    //   // important paths:
    //   publicPath,
    //   outputPath
    // } = flushChunks( clientStats, { chunkNames } )

    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > JS: ', assets.Js);
    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > STYLES: ', assets.Styles);
    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > CSS: ', assets.Css);

    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > .js: ', assets.js);
    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > styles: ', assets.styles);
    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > .css: ', assets.css);

    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > scripts: ', assets.scripts);
    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > stylesheets: ', assets.stylesheets);

    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > cssHashRaw: ', assets.cssHashRaw);
    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > cssHash: ', assets.cssHash);
    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > CssHash: ', assets.CssHash);

    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > publicPath: ', assets.publicPath);
    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > outputPath: ', assets.outputPath);

    // ------------------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------

    function hydrate() {
      res.write('<!doctype html>');
      ReactDOM.renderToNodeStream(<Html assets={assets} store={store} />).pipe(res);
    }

    console.log('>>>>>>>>>>>>>>>>> SERVER > __DISABLE_SSR__:', __DISABLE_SSR__);
    if (__DISABLE_SSR__) {
      return hydrate();
    }

    // ------------------------------------------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------

    // console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > context: ', context);

    if (context.url) {
      return res.redirect(301, context.url);
    }

    const locationState = store.getState().router.location;

    console.log('>>>>>>>>>>>>>>>>> SERVER > locationState:', locationState);

    if (decodeURIComponent(req.originalUrl) !== decodeURIComponent(locationState.pathname + locationState.search)) {
      return res.redirect(301, locationState.pathname);
    }

    // ------------------------------------------------------------------------------------------------------

    console.log('>>>>>>>>>>>>>>>> SERVER > ==================== content: ', content);

    // const html = <Html assets={assets} store={store} content={content} bundles={flushedFiles} />;

    const html = <Html assets={assets} store={store} content={content} />;

    // const ssrHtml = `<!doctype html>${ReactDOM.renderToString(html)}`;
    // console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > RESPOND TO CLIENT !! > ReactDOM.renderToString(html):', ssrHtml);

    res.status(200).send(`<!doctype html>${ReactDOM.renderToString(html)}`);
    // res.status(200).send('SERVER > Response Ended For Testing!!!!!!! Status 200!!!!!!!!!');

  } catch (error) {
    console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > TRY > ERROR > error: ', error);
    res.status(500);
    hydrate();
  }
};
