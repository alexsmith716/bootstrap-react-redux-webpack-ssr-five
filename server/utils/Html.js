import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';
import config from '../../config/config';

const Html = ({ assets, store, content }) => {

  console.log('>>>>>> HTML.JS > assets!!: ', assets);
  // console.log('>>>>>> HTML.JS > assets.styles length: ', Object.keys(assets.styles).length);
  // console.log('#######################>>>>>> HTML.JS > store: ', store);
  // console.log('>>>>>> HTML.JS > content: ', content);

  // {
  //   scripts: ['bootstrap.1028857055655ec25286.bundle.js', 'main.336c632fd2d3509b6828.chunk.js'],
  //   stylesheets: ['main.fa8250340286f1b7318e.css'],
  //   publicPath: '/dist',
  //   outputPath: undefined,
  //   cssHashRaw: {
  //     about: '/dist/about.59a596b6240bc975e9d7.css',
  //     main: '/dist/main.fa8250340286f1b7318e.css'
  //   },
  //   CssHash: [Function: CssHash],
  //   cssHash: {toString: [Function: toString]}
  // }

  const head = Helmet.renderStatic();

  return (
    <html lang="en-US">
      <head>
        {head.base.toComponent()}
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}
        {head.script.toComponent()}

        <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Election App 2018!" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Election App 2018!" />
        <meta name="theme-color" content="#1E90FF" />

        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />

      </head>

      <body>

        {/* (>>>>>>> CONTENT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<) */}
        <div id="content" dangerouslySetInnerHTML={{ __html: content }} />

        {/* (>>>>>>> STORE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<) */}
        {store && (
          <script
            dangerouslySetInnerHTML={{ __html: `window.__data=${serialize(store.getState())};` }}
            charSet="UTF-8"
          />
        )}

      </body>
    </html>
  );
};

Html.propTypes = {
  assets: PropTypes.shape({ styles: PropTypes.object, javascript: PropTypes.object }),
  bundles: PropTypes.arrayOf(PropTypes.any),
  content: PropTypes.string,
  store: PropTypes.shape({ getState: PropTypes.func }).isRequired,
};

Html.defaultProps = {
  assets: {},
  bundles: [],
  content: '',
};

export default Html;
