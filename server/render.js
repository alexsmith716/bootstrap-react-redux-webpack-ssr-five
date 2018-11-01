import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom/server';

import { clearChunks, flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import { flushFiles } from 'webpack-flush-chunks';
import { getStats } from './utils/stats';

const outputPath = path.resolve(__dirname, '..');

export default () => (req, res) => {

  console.log('>>>>>>>>>>>>>>>> RENDER > res.locals.component: ', res.locals.component);

  try {

    const content = ReactDOM.renderToString(res.locals.component);

    const clientStats = getStats();

    // console.log('>>>>>>>>>>>>>>>>> RENDER > clientStats: ', clientStats);

    clearChunks();

    const chunkNames = flushChunkNames();

    console.log('>>>>>>>>>>>>>>>>> RENDER > chunkNames: ', chunkNames);

    const {
      // react components:
      Js, // javascript chunks
      Styles, // external stylesheets
      Css, // raw css

      // strings:
      js, // javascript chunks
      styles, // external stylesheets
      css, // raw css

      // arrays of file names (not including publicPath):
      scripts,
      stylesheets,
      
      publicPath
    } = flushChunks(clientStats, {
      chunkNames,
      before: ['bootstrap'],
      after: ['main'],
      rootDir: path.join(__dirname, '..'),
      outputPath
    })

    console.log('>>>>>>>>>>>>>>>>> RENDER > flushChunks > JS: ', Js);
    console.log('>>>>>>>>>>>>>>>>> RENDER > flushChunks > STYLES: ', Styles);
    console.log('>>>>>>>>>>>>>>>>> RENDER > flushChunks > CSS: ', Css);
    console.log('>>>>>>>>>>>>>>>>> RENDER > flushChunks > js: ', js);
    console.log('>>>>>>>>>>>>>>>>> RENDER > flushChunks > styles: ', styles);
    console.log('>>>>>>>>>>>>>>>>> RENDER > flushChunks > css: ', css);
    console.log('>>>>>>>>>>>>>>>>> RENDER > flushChunks > scripts: ', scripts);
    console.log('>>>>>>>>>>>>>>>>> RENDER > flushChunks > stylesheets: ', stylesheets);

    console.log('>>>>>>>>>>>>>>>> RENDER > ==================== content!!!!!!: ', content);
    res.status(200).send('RENDER > Response Ended For Testing!!!!!!! Status 200!!!!!!!!!');

  } catch (error) {
    console.log('>>>>>>>>>>>>>>>> RENDER > TRY > ERROR > error: ', error);
    res.status(500).send('RENDER > Response Ended For Testing!!!!!!! Status 500!!!!!!!!!');
  }
};