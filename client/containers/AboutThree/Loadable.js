import React from 'react';
import universal from 'react-universal-component';
import path from 'path';

const AboutThreeLoadable = universal(() => import(/* webpackChunkName: 'aboutthree' */ './AboutThree'), {
  path: path.resolve(__dirname, './AboutThree'),
  resolve: () => require.resolveWeak('./AboutThree'),
  chunkName: 'aboutthree',
  minDelay: 500
})

export default AboutThreeLoadable;
