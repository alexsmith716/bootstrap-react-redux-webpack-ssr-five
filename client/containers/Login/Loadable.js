import React from 'react';
import universal from 'react-universal-component';
import path from 'path';

const LoginLoadable = universal(() => import(/* webpackChunkName: 'login' */ './Login'), {
  path: path.resolve(__dirname, './Login'),
  resolve: () => require.resolveWeak('./Login'),
  chunkName: 'login',
  minDelay: 500
})

export default LoginLoadable;
