const path = require('path');
const webpack = require('webpack');
const dllHelpers = require('./dllreferenceplugin');
const config = require('../config/config');

const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const rootPath = path.resolve(__dirname, '..');
const assetsPath = path.resolve(rootPath, './build/static/dist/client');

const host = process.env.HOST || 'localhost';
const port = +process.env.PORT + 1 || 3001;

// ==============================================================================================

var validDLLs = dllHelpers.isValidDLLs('vendor', configuration.output.path);

if (process.env.WEBPACK_DLLS === '1' && !validDLLs) {
  process.env.WEBPACK_DLLS = '0';
  console.warn('>>>>>> webpack.config.client.development.babel > WEBPACK_DLLS disabled !! <<<<<<<<<<');
} else {
  console.warn('>>>>>> webpack.config.client.development.babel > WEBPACK_DLLS ENABLED !! <<<<<<<<<<');
};

// ==============================================================================================

let configuration = {

  context: path.resolve(__dirname, '..'),

  name: 'client',
  target: 'web',
  mode: 'development',
  devtool: 'source-map',
  // devtool: 'inline-source-map', // https://webpack.js.org/guides/development/#source-maps

  entry: {
    main: [
      'webpack-hot-middleware/client?path=http://localhost:3001/__webpack_hmr',
      './client/assets/scss/bootstrap/bootstrap.global.scss',
      'bootstrap',
      './client/index.js'
    ]
  },

  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    path: path.resolve(__dirname, '../build/static/dist/client'),
    publicPath: `http://${host}:${port}/dist/`
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules(\/|\\)(?!(@feathersjs))/
      },
      {
        test: /\.(scss)$/,
        exclude: /node_modules/,
        use: [
          ExtractCssChunks.loader,
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
                path.resolve(rootPath, 'client/assets/scss/app/functions.scss'),
                path.resolve(rootPath, 'client/assets/scss/app/variables.scss'),
                path.resolve(rootPath, 'client/assets/scss/app/mixins.scss')
              ],
            },
          },
        ]
      },
      {
        test: /\.(css)$/,
        use: [
          ExtractCssChunks.loader,
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
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
        },
      },
      {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          mimetype: 'application/font-woff'
        }
      }, 
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          mimetype: 'application/octet-stream'
        }
      }, 
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      }, 
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          mimetype: 'image/svg+xml'
        }
      },
    ]
  },

  performance: {
    hints: false
  },

  resolve: {
    modules: [ 'client', 'node_modules' ],
    extensions: ['.json', '.js', '.jsx'],
  },

  plugins: [

    new webpack.HotModuleReplacementPlugin(),

    new ExtractCssChunks({
      filename: '[name].[contenthash].css',
      // chunkFilename: '[name].[contenthash].chunk.css',
      hot: true,
      orderWarning: true,
      reloadAll: true,
      cssModules: true
    }),

    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('development') },
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: false
    }),

    // new webpack.NamedModulesPlugin(),

    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   reportFilename: '../../analyzers/bundleAnalyzer/client-production.html',
    //   // analyzerMode: 'server',
    //   // analyzerPort: 8888,
    //   // defaultSizes: 'parsed',
    //   openAnalyzer: false,
    //   generateStatsFile: false
    // }),

    // https://webpack.js.org/plugins/provide-plugin/
    // ProvidePlugin: Whenever the identifier is encountered as free variable in a module, 
    //    the module is loaded automatically and the identifier is filled with the exports of 
    //    the loaded module (of property in order to support named exports).

    // To automatically load jquery point variables it exposes to the corresponding node module
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      jquery: 'jquery',
      Popper: ['popper.js', 'default'],
      Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
      Button: "exports-loader?Button!bootstrap/js/dist/button",
      Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
      Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
      Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
      Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
      Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
      Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
      Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
      Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
      Util: "exports-loader?Util!bootstrap/js/dist/util",
    })
  ]
};

if (process.env.WEBPACK_DLLS === '1' && validDLLs) {
  dllHelpers.installVendorDLL(configuration, 'vendor');
};

module.exports = configuration;