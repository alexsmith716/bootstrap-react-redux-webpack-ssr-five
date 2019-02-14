import React from 'react';
import universal from 'react-universal-component';
import path from 'path';

const AboutFourLoadable = universal(() => import(/* webpackChunkName: 'aboutfour' */ './AboutFour'), {
  path: path.resolve(__dirname, './AboutFour'),
  resolve: () => require.resolveWeak('./AboutFour'),
  chunkName: 'aboutfour',
  minDelay: 500
})

export default AboutFourLoadable;
