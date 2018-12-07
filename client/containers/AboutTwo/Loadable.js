import React from 'react';
import universal from 'react-universal-component';
import path from 'path';

const AboutTwoLoadable = universal(() => import(/* webpackChunkName: 'about-two' */ './AboutTwo'), {
  path: path.resolve(__dirname, './AboutTwo'),
  resolve: () => require.resolveWeak('./AboutTwo'),
  chunkName: 'about-two',
  minDelay: 500
})

export default AboutTwoLoadable;
