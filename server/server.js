import fs from 'fs';
import config from '../config/config';
import path from 'path';
import http from 'http';
import httpProxy from 'http-proxy';
import Cookies from 'cookies';

import { getStoredState } from 'redux-persist';
import { CookieStorage, NodeCookiesWrapper } from 'redux-persist-cookie-storage';

import React from 'react';
import ReactDOM from 'react-dom/server';
import { StaticRouter } from 'react-router';

import asyncMatchRoutes from '../server/utils/asyncMatchRoutes';
import { ReduxAsyncConnect, Provider } from '../shared';

import createMemoryHistory from 'history/createMemoryHistory';

import createStore from '../client/redux/createStore';

import { ConnectedRouter } from 'connected-react-router';
import { renderRoutes } from 'react-router-config';

import { trigger } from 'redial';

import Html from '../server/utils/Html';
import routes from '../shared/routes';
import { parse as parseUrl } from 'url';

import { createApp } from '../server/app';
import apiClient from '../server/utils/apiClient';

import { clearChunks, flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
// import { flushFiles } from 'webpack-flush-chunks';
import { getStats } from './utils/stats';
import { ReportChunks } from 'react-universal-component';

const targetUrl = `http://${config.apiHost}:${config.apiPort}`;

const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: true
});

export default ({ clientStats }) => async (req, res) => {

  if (req.url == '/manifest.json') {
    console.log('>>>>>>>>>>>>>>>>> SERVER > manifest.json <<<<<<<<<<<<<<<<<<<<<<<');
    return res.sendFile(path.join(__dirname, '..', 'build', 'static', 'manifest.json'))
  }

  if (req.url == '/dist/service-worker.js') {
    console.log('>>>>>>>>>>>>>>>>> SERVER > service-worker <<<<<<<<<<<<<<<<<<<<<<<');
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Cache-Control', 'no-store');
    return;
  }

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

    clearChunks();
    // const chunkNames = [];
    const context = {};

    // const component = (
    //   <ReportChunks report={chunkName => chunkNames.push(chunkName)}>
    //     <Provider store={store} {...providers}>
    //       <ConnectedRouter history={history}>
    //         <StaticRouter location={req.originalUrl} context={context}>
    //           <ReduxAsyncConnect routes={routes} store={store} helpers={providers}>
    //             {renderRoutes(routes)}
    //           </ReduxAsyncConnect>
    //         </StaticRouter>
    //       </ConnectedRouter>
    //     </Provider>
    //   </ReportChunks>
    // );

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

    // console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > context: ', context);

    console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > component: ', component);

    if (context.url) {
      return res.redirect(301, context.url);
    }

    const locationState = store.getState().router.location;

    if (decodeURIComponent(req.originalUrl) !== decodeURIComponent(locationState.pathname + locationState.search)) {
      return res.redirect(301, locationState.pathname);
    }

    // ------------------------------------------------------------------------------------------------------

    const chunkNames = flushChunkNames();
    const assets = flushChunks(clientStats, { chunkNames });

    // ------------------------------------------------------------------------------------------------------

    // flushChunks and flushFiles: called immediately after ReactDOMServer.renderToString. 
    // They are used in server-rendering to extract the minimal amount of chunks to send to the client, 
    // thereby solving a missing piece for code-splitting: server-side rendering

    // clearChunks();
    console.log('>>>>>>>>>>>>>>>>> SERVER > chunkNames: ', chunkNames);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > clientStats: ', clientStats);

    // let scripts = bundles.filter(bundle => bundle.file.endsWith('.js') || bundle.file.endsWith('.map'));
    // const scripts = flushFiles(webpackStats, { chunkNames, filter: bundle => bundle.file.endsWith('.js') });
    // const styles = flushFiles(webpackStats, { chunkNames, filter: bundle => bundle.file.endsWith('.css') });

    // scripts:  [ 'bootstrap.ba1b422eeb0d78f07d43.bundle.js', 'main.f8c3be17197dd531d4b5.chunk.js' ]
    // stylesheets:  [ 'main.aa610604945cbff30901.css' ]
    // const { js, styles, cssHash, scripts, stylesheets } = flushChunks( webpackStats, { chunkNames } )

    // const assets = {
    //   // react components:
    //   Js, // javascript chunks
    //   Styles, // external stylesheets
    //   Css, // raw css

    //   // strings:
    //   js, // javascript chunks
    //   styles, // external stylesheets
    //   css, // raw css

    //   cssHash,
    //   scripts,
    //   stylesheets
    // } = flushChunks( clientStats, { chunkNames } )

    // const { js, styles, cssHash, scripts, stylesheets } = flushChunks( clientStats, { chunkNames } );
    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > js: ', js);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > styles: ', styles);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > cssHash: ', cssHash);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > scripts: ', scripts);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > stylesheets: ', stylesheets);

    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > JS: ', assets.Js);
    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > STYLES: ', assets.Styles);
    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > CSS: ', assets.Css);
    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > js: ', assets.js);
    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > styles: ', assets.styles);
    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > css: ', assets.css);
    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > cssHash: ', assets.cssHash);
    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > scripts: ', assets.scripts);
    console.log('>>>>>>>>>>>>>>>>> SERVER > flushChunks > stylesheets: ', assets.stylesheets);

    console.log('>>>>>>>>>>>>>>>> SERVER > ==================== content: ', content);

    const html = <Html assets={assets} store={store} content={content} />;
    const ssrHtml = `<!doctype html>${ReactDOM.renderToString(html)}`;
    console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > RESPOND TO CLIENT !! > ReactDOM.renderToString(html):', ssrHtml);

    res.status(200).send(ssrHtml);
    // res.status(200).send('SERVER > Response Ended For Testing!!!!!!! Status 200!!!!!!!!!');

  } catch (error) {
    console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > TRY > ERROR > error: ', error);
    res.status(500);
    hydrate();
  }
};
