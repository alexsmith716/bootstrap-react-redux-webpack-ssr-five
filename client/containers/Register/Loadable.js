import React from 'react';
import universal from 'react-universal-component';
import path from 'path';

const RegisterLoadable = universal(() => import(/* webpackChunkName: 'register' */ './Register'), {
  path: path.resolve(__dirname, './Register'),
  resolve: () => require.resolveWeak('./Register'),
  chunkName: 'register',
  minDelay: 500
})

export default RegisterLoadable;

//import React from 'react';
//import Loadable from 'react-loadable';
//
//const RegisterLoadable = Loadable({
//
//  loader: () => import('./Register' /* webpackChunkName: 'register' */).then(module => module.default),
//  // loader: () => import('./Register').then(module => module.default),
//
//  loading: () => <div>Loading</div>
//
//});
//
//export default RegisterLoadable;
