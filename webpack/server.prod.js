const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const config = require('../config/config');

const configuration = require('./webpack.config');

// ==============================================================================================

configuration.name = 'server';
configuration.target = 'node';
configuration.mode = 'production';

configuration.entry.server.push(
  '@babel/polyfill',
  // '../server/server/'
);

// ---------------------------------------------------------------------------------------

configuration.output.path = path.resolve(configuration.context, './build/static/dist/server');

// output.filename: determines the name of each output bundle
// output.filename: The bundle is written to the directory specified by 'output.path'
// configuration.output.filename = 'bundle.js';
configuration.output.filename = '[name].[chunkhash].bundle.js';

// output.chunkFilename: specifies the name of each (non-entry) chunk files
// output.chunkFilename: main option here is to specify caching
configuration.output.chunkFilename = '[name].[chunkhash].chunk.js';

// output.publicPath: specifies the public URL of the output directory
// output.publicPath: value is prefixed to every URL created by the runtime or loaders
configuration.output.publicPath = '/static/';

configuration.module.rules.push(
  {
    test: /\.(scss)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'css-loader',
        options: {
          modules: true,
          // localIdentName: '[name]__[local]__[hash:base64:5]',
          getLocalIdent: (loaderContext, localIdentName, localName, options) => {
            const fileName = path.basename(loaderContext.resourcePath)
            if (fileName.indexOf('global.scss') !== -1) {
              return localName
            } else {
              const name = fileName.replace(/\.[^/.]+$/, "")
              return `${name}__${localName}`
            }
          },
          importLoaders: 2,
          sourceMap: true,
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          config: {
            path: 'postcss.config.js'
          }
        }
      },
      {
        loader: 'resolve-url-loader'
      },
      {
        loader: 'sass-loader',
        options: {
          outputStyle: 'expanded',
          sourceMap: true,
          sourceMapContents: true,
        }
      },
      {
        loader: 'sass-resources-loader',
        options: {
          resources: [
            path.resolve(configuration.context, 'client/assets/scss/app/functions.scss'),
            path.resolve(configuration.context, 'client/assets/scss/app/variables.scss'),
            path.resolve(configuration.context, 'client/assets/scss/app/mixins.scss')
          ],
        },
      },
    ]
  },
  {
    test: /\.(css)$/,
    use: [
      {
        loader : 'css-loader',
        options: {
          modules: true,
          localIdentName: '[name]__[local]',
          importLoaders: 1,
          sourceMap: true
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          config: {
            path: 'postcss.config.js'
          }
        }
      }
    ]
  }
);

// ==============================================================================================

configuration.plugins.push(

  new webpack.DefinePlugin({
    'process.env': { NODE_ENV: JSON.stringify('production') },
    __CLIENT__: false,
    __SERVER__: true,
    __DEVELOPMENT__: false,
    __DEVTOOLS__: false,
    __DLLS__: false
  }),

);

// console.log('>>>>>>>>>>>>>>>>>>> WCCPB CLIENT configuration: ', configuration);
// console.log('>>>>>>>>>>>>>>>>>>> WCCPB CLIENT configuration.module.rules[5].options: ', configuration.module.rules[5].options);
// console.log('>>>>>>>>>>>>>>>>>>> WCCPB CLIENT configuration.module.rules: ', configuration.module.rules);
// export default configuration;
module.exports = configuration;
