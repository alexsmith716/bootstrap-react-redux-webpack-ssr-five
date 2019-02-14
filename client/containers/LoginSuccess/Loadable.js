import React from 'react';
import universal from 'react-universal-component';
import path from 'path';

const LoginSuccessLoadable = universal(() => import(/* webpackChunkName: 'loginsuccess' */ './LoginSuccess'), {
  path: path.resolve(__dirname, './LoginSuccess'),
  resolve: () => require.resolveWeak('./LoginSuccess'),
  chunkName: 'loginsuccess',
  minDelay: 500
})

export default LoginSuccessLoadable;

// import React from 'react';
// import Loadable from 'react-loadable';
// 
// const LoginSuccessLoadable = Loadable({
// 
//   loader: () => import('./LoginSuccess' /* webpackChunkName: 'login-success' */).then(module => module.default),
//   // loader: () => import('./LoginSuccess').then(module => module.default),
// 
//   loading: () => <div>Loading</div>
// 
// });
// 
// 
// export default LoginSuccessLoadable;
