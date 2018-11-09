import React from 'react';
import universal from 'react-universal-component';
import universalImport from 'babel-plugin-universal-import/universalImport.js';
import path from 'path';

const AboutOneLoadable = universal(() => import(/* webpackChunkName: 'about-one' */ './AboutOne'), {
  path: path.resolve(__dirname, './AboutOne'),
  resolve: () => require.resolveWeak('./AboutOne'),
  chunkName: 'about-one',
  minDelay: 500
})

// const AboutOneLoadable = Loadable({
//   loader: () => import('./AboutOne' /* webpackChunkName: 'about-one' */).then(module => module.default),
//   loading: () => <div>Loading</div>
// });

export default AboutOneLoadable;
