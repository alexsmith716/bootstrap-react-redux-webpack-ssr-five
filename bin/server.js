// @flow

require('../server.babel');

global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.__DISABLE_SSR__ = false;

require('./start');
