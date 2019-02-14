const path = require('path');
const webpack = require('webpack');
const projectRootPath = path.resolve(__dirname, '../');

// The DllPlugin and DllReferencePlugin provide means to split bundles in a way that can drastically improve build time performance
// This plugin can be used in two different modes, scoped and mapped.
// https://webpack.js.org/plugins/dll-plugin/#modes

module.exports = {

  mode: 'development',
  // devtool: 'inline-source-map', // A SourceMap is added as a DataUrl to the bundle
  devtool: 'eval',

  output: {
    // dll bundle build
    path: path.join(projectRootPath, 'build/static/dlls'),
    filename: 'dll__[name].js',
    library: 'DLL_[name]_[hash]'
  },

  performance: {
    hints: false
  },

  entry: {
    vendor: [
      '@babel/polyfill',

      // Generate this list using the following command against the stdout of
      // webpack running against the source bundle config (dev/prod.js):
      //
      // yarn webpack --config webpack/dev.client.js --display-modules | egrep -o '@babel/runtime-corejs2/\S+' | sed 's/\.js$//' | sort | uniq

      '@babel/runtime-corejs2/core-js/array/from.js',
      '@babel/runtime-corejs2/core-js/array/is-array.js',
      '@babel/runtime-corejs2/core-js/is-iterable.js',
      '@babel/runtime-corejs2/core-js/object/create.js',
      '@babel/runtime-corejs2/core-js/object/define-property.js',
      '@babel/runtime-corejs2/core-js/object/get-own-property-descriptor.js',
      '@babel/runtime-corejs2/core-js/object/get-own-property-symbols.js',
      '@babel/runtime-corejs2/core-js/object/get-prototype-of.js',
      '@babel/runtime-corejs2/core-js/object/keys.js',
      '@babel/runtime-corejs2/core-js/object/set-prototype-of.js',
      '@babel/runtime-corejs2/core-js/promise.js',
      '@babel/runtime-corejs2/core-js/symbol.js',
      '@babel/runtime-corejs2/core-js/symbol/iterator.js',
      '@babel/runtime-corejs2/helpers/arrayWithoutHoles.js',
      '@babel/runtime-corejs2/helpers/assertThisInitialized.js',
      '@babel/runtime-corejs2/helpers/asyncToGenerator.js',
      '@babel/runtime-corejs2/helpers/classCallCheck.js',
      '@babel/runtime-corejs2/helpers/createClass.js',
      '@babel/runtime-corejs2/helpers/defineProperty.js',
      '@babel/runtime-corejs2/helpers/getPrototypeOf.js',
      '@babel/runtime-corejs2/helpers/inherits.js',
      '@babel/runtime-corejs2/helpers/iterableToArray.js',
      '@babel/runtime-corejs2/helpers/nonIterableSpread.js',
      '@babel/runtime-corejs2/helpers/objectSpread.js',
      '@babel/runtime-corejs2/helpers/possibleConstructorReturn.js',
      '@babel/runtime-corejs2/helpers/setPrototypeOf.js',
      '@babel/runtime-corejs2/helpers/toConsumableArray.js',
      '@babel/runtime-corejs2/helpers/typeof.js',
      '@babel/runtime-corejs2/regenerator/index.js',

      '@fortawesome/fontawesome-free',
      'axios',
      'final-form',
      'jquery',
      'multireducer',
      'popper.js',
      'react',
      'react-dom',
      'react-final-form',
      'react-helmet',
      'react-hot-loader',
      'react-router',
      'serialize-javascript',
      'socket.io-client'
    ]
  },

  plugins: [

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),

    // create the dll-only-bundle
    // create webpack/dlls/vendor.json file which is used by the DllReferencePlugin to map dependencies
    // https://webpack.js.org/plugins/dll-plugin/#dllplugin
    new webpack.DllPlugin({
      // dll bundle reference path file (.json)
      path: path.join(projectRootPath, 'webpack/dlls/[name].json'),
      name: 'DLL_[name]_[hash]'
    })
  ]
};
