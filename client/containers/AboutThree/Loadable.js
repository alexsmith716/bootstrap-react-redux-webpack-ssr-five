import React from 'react';
import universal from 'react-universal-component';
import universalImport from 'babel-plugin-universal-import/universalImport.js';
import path from 'path';

const AboutThreeLoadable = universal(() => import(/* webpackChunkName: 'about-three' */ './AboutThree'), {
  path: path.resolve(__dirname, './AboutThree'),
  resolve: () => require.resolveWeak('./AboutThree'),
  chunkName: 'about-three',
  minDelay: 500
})

// const AboutThreeLoadable = Loadable({
//   loader: () => import('./AboutThree' /* webpackChunkName: 'about-three' */).then(module => module.default),
//   loading: () => <div>Loading</div>
// });

export default AboutThreeLoadable;
