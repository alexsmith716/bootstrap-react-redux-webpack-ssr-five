const express = require('express');
const webpack = require('webpack');

const config = require('../config/config');
// const webpackConfig = require('./webpack.config.client.development.babel.js');
const webpackConfig = require('./webpack.config.client.development.babel.js');

webpackConfig.mode = 'development';

const compiler = webpack(webpackConfig);

const host = config.host || 'localhost';
const port = Number(config.port) + 1 || 3001;

const serverOptions = {
  contentBase: `http://${host}:${port}`,
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: { 'Access-Control-Allow-Origin': '*' }
};

const app = express();

// https://github.com/webpack/webpack-dev-middleware#server-side-rendering
// https://github.com/webpack/docs/wiki/node.js-api#stats

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));

// app.listen(port, function onAppListening(err) {
app.listen(port, function (err) {
  if (err) {
    console.error('>>>>>> webpack.dev.server > Express DEV server connection Error', err);
  } else {
    console.error('>>>>>> webpack.dev.server > Express DEV server listening on port', port);
  }
});
