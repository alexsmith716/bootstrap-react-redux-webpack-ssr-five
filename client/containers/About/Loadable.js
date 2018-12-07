import React from 'react';
import universal from 'react-universal-component';
// import universalImport from 'babel-plugin-universal-import/universalImport.js';
import path from 'path';

// const AboutLoadable = universal(() => import(/* webpackChunkName: 'about' */ './About'));

// const AboutLoadable = universal(universalImport({
//   chunkName: () => 'about',
//   path: () => path.join(__dirname, './About.js'),
//   resolve: () => require.resolveWeak('./About.js'),
//   load: () => Promise.all([
//     import( /* webpackChunkName: 'about' */ './About.js')
//   ]).then(proms => proms[0])
// }))

// const AboutLoadable = universal(() => import(/* webpackChunkName: 'about' */ './About'), {
const AboutLoadable = universal(() => import(/* webpackChunkName: 'about' */ './About'), {
  path: path.resolve(__dirname, './About'),
  resolve: () => require.resolveWeak('./About'),
  chunkName: 'about',
  minDelay: 500
})

export default AboutLoadable;
