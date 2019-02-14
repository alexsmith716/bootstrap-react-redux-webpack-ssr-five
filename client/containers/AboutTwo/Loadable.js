import React from 'react';
import universal from 'react-universal-component';
import path from 'path';

const AboutTwoLoadable = universal(() => import(/* webpackChunkName: 'abouttwo' */ './AboutTwo'), {
  path: path.resolve(__dirname, './AboutTwo'),
  resolve: () => require.resolveWeak('./AboutTwo'),
  chunkName: 'abouttwo',
  minDelay: 500
})

export default AboutTwoLoadable;
