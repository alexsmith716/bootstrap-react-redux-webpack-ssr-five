import React from 'react';
import universal from 'react-universal-component';
import universalImport from 'babel-plugin-universal-import/universalImport.js';
import path from 'path';

const AboutFourLoadable = universal(() => import(/* webpackChunkName: 'about-four' */ './AboutFour'), {
  path: path.resolve(__dirname, './AboutFour'),
  resolve: () => require.resolveWeak('./AboutFour'),
  chunkName: 'about-four',
  minDelay: 500
})

// const AboutFourLoadable = Loadable({
//   loader: () => import('./AboutFour' /* webpackChunkName: 'about-four' */).then(module => module.default),
//   loading: () => <div>Loading</div>
// });

export default AboutFourLoadable;
