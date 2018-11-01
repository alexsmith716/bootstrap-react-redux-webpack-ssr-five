// @flow

const voo = require('../server.babel');

console.error('>>>>>>>>>>>>>>>>>>> BIN > SERVER > server.babel: ', voo);

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
global.__DLLS__ = process.env.WEBPACK_DLLS === '1';

// require('../server/index');
require('../server/server');
