const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const config = require('../config/config');

const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { StatsWriterPlugin } = require('webpack-stats-plugin');
// const StatsPlugin = require('stats-webpack-plugin');

const configuration = require('./webpack.config');

const bundleAnalyzerPath = path.resolve(configuration.context, './build/analyzers/bundleAnalyzer');
const assetsPath = path.resolve(configuration.context, './build/static/dist');
const serverPath = path.resolve(configuration.context, './build/server');

// ==============================================================================================

const babelrc = fs.readFileSync('./.babelrc', 'utf8');
let prodconfig = {};

try {
  prodconfig = JSON.parse(babelrc);
    if (Array.isArray(prodconfig.plugins)) {
      prodconfig.plugins.push('universal-import');
    }
    console.error('>>>>>>>>>>>>>>>>>>> WCCPB > SUCCESS: parsing .babelrc !!: ', prodconfig)
} catch (err) {
  console.error('>>>>>>>>>>>>>>>>>>> WCCPB > ERROR: parsing .babelrc: ', err)
}

const babelrcObject = Object.assign({}, prodconfig);

// ==============================================================================================

function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  } else {
    return false;
  }
}

configuration.name = 'client';
configuration.target = 'web';
configuration.mode = 'production';
configuration.devtool = 'source-map';

configuration.entry.main.push(
  '@babel/polyfill',
  './client/assets/scss/bootstrap/bootstrap.global.scss',
  'bootstrap',
  './client/index.js'
);

// ---------------------------------------------------------------------------------------

// output.filename: determines the name of each output bundle
// output.filename: The bundle is written to the directory specified by 'output.path'
// configuration.output.filename = 'bundle.js';
configuration.output.filename = '[name].[chunkhash].bundle.js';

// output.chunkFilename: specifies the name of each (non-entry) chunk files
// output.chunkFilename: main option here is to specify caching
configuration.output.chunkFilename = '[name].[chunkhash].chunk.js';

// output.publicPath: specifies the public URL of the output directory
// output.publicPath: value is prefixed to every URL created by the runtime or loaders
configuration.output.publicPath = '/dist/';

configuration.module.rules.push(
  {
    test: /\.jsx?$/,
    loader: 'babel-loader',
    exclude: /node_modules(\/|\\)(?!(@feathersjs))/,
    options: babelrcObject
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
  }
);

configuration.optimization = {
  minimizer: [
    // minify javascript 
    new TerserPlugin({
      cache: true,
      parallel: true,
      sourceMap: true
    }),
    // minify css (default: cssnano)
    new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: {
        map: { 
          inline: false, 
          annotation: true
        }
      }
    })
  ],
  // Code Splitting: Prevent Duplication: Use the SplitChunksPlugin to dedupe and split chunks.
  splitChunks: {
    // 'splitChunks.cacheGroups' inherits and/or overrides any options from splitChunks
    // 'test', 'priority' and 'reuseExistingChunk' can only be configured on 'splitChunks.cacheGroups'
    // following config objects to 'name' are defaults
    chunks: 'async',
    minSize: 30000,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    automaticNameDelimiter: '~',
    name: true,
    cacheGroups: {
      // no difference between the builds of below 'optimization.splitChunks.cacheGroups' objects
      // going with the default for now and moving on
      // ------------------------------------
      // "modified config":
      // vendors: {
      //   name: 'vendors',
      //   reuseExistingChunk: true,
      //   chunks: chunk => ['main',].includes(chunk.name),
      //   test: module => /[\\/]node_modules[\\/]/.test(module.context),
      //   chunks: 'async',
      //   // chunks: 'initial',
      //   // chunks: 'all',
      //   // minSize: 0,
      //   minSize: 30000,
      //   maxSize: 0,
      //   minChunks: 1,
      //   maxAsyncRequests: 5,
      //   maxInitialRequests: 3,
      //   // priority: -10
      //   // priority: 10,
      // }
      // ------------------------------------
      // "webpack's default config":
      // default config loads all css on SSR
      // that's a main difference compared to 'faceyspacey/universal-demo'
      // 'faceyspacey/universal-demo' loads css on-demand
      // tried many configs but so far default config works
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: -10
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true
      },
      // vendor: {
      //   test: /(node_modules|vendors).+(?<!css)$/,
      //   name: 'vendor',
      //   chunks: 'all',
      // },
      // Extracting CSS based on entry (builds a global && local css file)
      // >>>>>>>> GOOD TO KNOW NOT TO NAME A 'cacheGroups' AFTER A ENTRY POINT <<<<<<<<
      // builds a 'main.css' for all the globals and a 'mainStyles.css' for all locals
      // https://github.com/webpack-contrib/mini-css-extract-plugin#extracting-css-based-on-entry
      // mainStyles: {
      //   name: 'mainStyles',
      //   test: (m,c,entry = 'main') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
      //   chunks: 'async',
      //   // chunks: 'all',
      //   // chunks: 'initial',
      //   enforce: true
      // },
      // Extracting all CSS in a single file
      // https://github.com/webpack-contrib/mini-css-extract-plugin#extracting-all-css-in-a-single-file
      // 'cacheGroups' could be named:
      //    * following 'routes.js' component names 
      //       * ("/" route exact >>>>>>> container/component 'Home.js')
      //    * following the container/component where they are referenced
      //       * ('App.js')
      //    * following CSS Modules global/local scoping 
      // scopedLocal: {
      //   name: 'scopedLocal',
      //   test: /\.(css|scss)$/,
      //   // chunks: 'all',
      //   chunks: 'async',
      //   // chunks: 'initial',
      //   enforce: true
      // }
      // ------------------------------------
    }
  },
  // adds an additional chunk to each entrypoint containing only the runtime
  // runtimeChunk: true
  // creates a runtime file to be shared for all generated chunks
  runtimeChunk: {
    name: 'bootstrap'
  }
};

// ==============================================================================================

configuration.plugins.push(

  new CleanWebpackPlugin([bundleAnalyzerPath,assetsPath,serverPath], { root: configuration.context }),

  // new StatsPlugin('stats.json', {
  //   chunkModules: true,
  //   exclude: [/node_modules[\\\/]react/]
  // }),

  // new StatsWriterPlugin({
  //   filename: 'stats.json',
  //   fields: null,
  //   // transform(data, opts) {
  //   //   return JSON.stringify(data);
  //   // }
  // }),

  // new webpack.LoaderOptionsPlugin({
  //   options: {
  //     context: __dirname,
  //   }
  // }),

  // new ExtractCssChunks(),
  new ExtractCssChunks({
    filename: '[name].[contenthash].css',
    // chunkFilename: '[name].[contenthash].chunk.css',
    hot: false,
    orderWarning: true,
    // reloadAll: true,
    cssModules: true
  }),

  // new MiniCssExtractPlugin({
  //   // For long term caching (according to 'mini-css-extract-plugin' docs)
  //   filename: '[name].[contenthash].css',
  //   // chunkFilename: '[name].[contenthash].chunk.css',
  // }),

  // post-process your chunks by merging them
  // https://webpack.js.org/plugins/limit-chunk-count-plugin/
  // will create 1 css chunk ('main.css')
  // new webpack.optimize.LimitChunkCountPlugin({
  //   maxChunks: 1,
  //   // minChunkSize: 1000
  // }),

  new webpack.DefinePlugin({
    'process.env': { NODE_ENV: JSON.stringify('production') },
    __CLIENT__: true,
    __SERVER__: false,
    __DEVELOPMENT__: false,
    __DEVTOOLS__: false,
    __DLLS__: false
  }),

  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: path.join(configuration.context, './server/pwa.js')
  }),

  // https://github.com/goldhand/sw-precache-webpack-plugin
  // https://github.com/GoogleChromeLabs/sw-precache
  new SWPrecacheWebpackPlugin({
    cacheId: 'bootstrap-react-redux-webpack-ssr-four',
    filename: 'service-worker.js',
    maximumFileSizeToCacheInBytes: 8388608,

    staticFileGlobs: [`${path.dirname(assetsPath)}/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff,woff2}`],
    stripPrefix: path.dirname(assetsPath),

    directoryIndex: '/',
    verbose: true,
    // clientsClaim: true,
    // skipWaiting: false,
    navigateFallback: '/dist/index.html'
  }),

  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: '../../analyzers/bundleAnalyzer/client-production.html',
    // analyzerMode: 'server',
    // analyzerPort: 8888,
    // defaultSizes: 'parsed',
    openAnalyzer: false,
    generateStatsFile: false
  })
);

// console.log('>>>>>>>>>>>>>>>>>>> WCCPB CLIENT configuration: ', configuration);
// console.log('>>>>>>>>>>>>>>>>>>> WCCPB CLIENT configuration.module.rules[5].options: ', configuration.module.rules[5].options);
// console.log('>>>>>>>>>>>>>>>>>>> WCCPB CLIENT configuration.module.rules: ', configuration.module.rules);
// export default configuration;
module.exports = configuration;
