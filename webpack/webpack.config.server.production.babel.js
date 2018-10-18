// webpack.config.server.development.babel.js
// const configServer = require('./webpack.config.server.production.babel');
// const { setDevFileServer } = require('./devserver');
// module.exports = setDevFileServer(configServer);

// const { serverConfiguration } = require('universal-webpack');
// const settings = require('./universal-webpack-settings');
const configuration = require('./webpack.config');
const path = require('path');

configuration.name = 'server';
configuration.target = 'node';

configuration.module.rules.push(
  {
    test: /\.(scss)$/,
    use: [
      {
        loader: 'style-loader'
      },
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
        }
      },
      {
        loader: 'sass-resources-loader',
        options: {
          resources: [
            path.resolve(configuration.context, 'client/assets/scss/app/functions.scss'),
            path.resolve(configuration.context, 'client/assets/scss/app/variables.scss'),
            path.resolve(configuration.context, 'client/assets/scss/app/mixins.scss'),
          ],
        },
      },
    ]
  },
  {
    test: /\.(css)$/,
    use: [
      {
        loader: 'style-loader'
      },
      {
        loader : 'css-loader',
        options: {
          modules: true,
          localIdentName: '[name]__[local]__[hash:base64:5]',
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
      },
    ]
  },
);

// console.log('>>>>>>>>>>>>>> WEBPACK SERVER DEV > CONFIG >>>>>>>>>>>>>>>:', configuration)
// const configurationServer = serverConfiguration(configuration, settings);
// console.log('>>>>>>>>>>>>>> WEBPACK SERVER DEV > CONFIG > UW >>>>>>>>>>:', configurationServer)

// module.exports = configurationServer;
module.exports = configuration;
