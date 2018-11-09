import React from 'react';
import universal from 'react-universal-component';
import universalImport from 'babel-plugin-universal-import/universalImport.js';
import path from 'path';

const AboutTwoLoadable = universal(() => import(/* webpackChunkName: 'about-two' */ './AboutTwo'), {
  path: path.resolve(__dirname, './AboutTwo'),
  resolve: () => require.resolveWeak('./AboutTwo'),
  chunkName: 'about-two',
  minDelay: 500
})

// const AboutTwoLoadable = Loadable({
//   loader: () => import('./AboutTwo' /* webpackChunkName: 'about-two' */).then(module => module.default),
//   loading: () => <div>Loading</div>
// });

export default AboutTwoLoadable;
