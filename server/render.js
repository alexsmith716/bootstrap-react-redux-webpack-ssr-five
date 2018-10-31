import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom/server';

import { clearChunks, flushChunkNames } from 'react-universal-component/server';
// import flushChunks from 'webpack-flush-chunks';
import { flushFiles } from 'webpack-flush-chunks';

import { getStats } from './utils/stats';

const outputPath = path.resolve(__dirname, '..');

export default () => (req, res) => {

  clearChunks();

  console.log('>>>>>>>>>>>>>>>> RENDER > ==================== res.locals.component: ', res.locals.component);

  try {

    const content = ReactDOM.renderToString(res.locals.component);

  } catch (error) {
    console.log('>>>>>>>>>>>>>>>> RENDER > APP LOADER > TRY > ERROR > error: ', error);
    res.status(500).send('RENDER > Response Ended For Testing!!!!!!! Status 500!!!!!!!!!');
  }

  console.log('>>>>>>>>>>>>>>>> RENDER > ==================== content!!!!!!: ', content);

  res.status(200).send('SERVER > Response Ended For Testing!!!!!!! Status 200!!!!!!!!!');

}