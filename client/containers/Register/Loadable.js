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
