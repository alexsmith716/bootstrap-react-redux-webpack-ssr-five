import React from 'react';
import universal from 'react-universal-component';
import path from 'path';

const AboutOneLoadable = universal(() => import(/* webpackChunkName: 'about-one' */ './AboutOne'), {
  path: path.resolve(__dirname, './AboutOne'),
  resolve: () => require.resolveWeak('./AboutOne'),
  chunkName: 'about-one',
  minDelay: 500
})

export default AboutOneLoadable;
