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
    return;
  }

  if (req.url == '/ws') {
    console.log('>>>>>>>>>>>>>>>>> SERVER > /WS <<<<<<<<<<<<<<<<<<<<<<<');
    proxy.web(req, res, { target: `${targetUrl}/ws` });
    return;
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
    return;
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

    res.status(200);
    res.send('<!doctype html><html lang="en-US"><head><title data-react-helmet="true"></title><meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover"/><meta name="mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-capable" content="yes"/><meta name="application-name" content="Election App 2018!"/><meta name="apple-mobile-web-app-status-bar-style" content="black"/><meta name="apple-mobile-web-app-title" content="Election App 2018!"/><meta name="theme-color" content="#1E90FF"/><link rel="shortcut icon" href="/favicon.ico"/><link rel="manifest" href="/manifest.json"/></head><body><div><p><h1>HELLO WORLD!!</h1></p></div></body></html>');

  } catch (error) {
    console.log('>>>>>>>>>>>>>>>> SERVER > APP LOADER > TRY > ERROR > error: ', error);
    res.status(500);
    hydrate();
  }

};
