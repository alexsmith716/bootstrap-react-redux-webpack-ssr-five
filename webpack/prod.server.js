const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const config = require('../config/config');

const rootPath = path.resolve(__dirname, '..');

module.exports = {

  context: path.resolve(__dirname, '..'),

  name: 'server',
  target: 'node',
  mode: 'production',

  entry: {
    server: [
      '@babel/polyfill',
      './server/server.js'
    ]
  },

  output: {

    path: path.resolve('./build/static/dist/server'),

    filename: 'server.js',

    publicPath: '/static/',

    libraryTarget: 'commonjs2'

  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules(\/|\\)(?!(@feathersjs))/,
        loader: 'babel-loader'
      },
      {
        test: /\.(scss)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'css-loader/locals',
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
          {
            loader : 'css-loader/locals',
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

    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') },
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false,
      __DLLS__: false
    }),

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

