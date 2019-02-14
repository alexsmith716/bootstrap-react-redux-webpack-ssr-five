import React from 'react';
import universal from 'react-universal-component';
import path from 'path';

const StickyFooterLoadable = universal(() => import(/* webpackChunkName: 'stickyfooter' */ './StickyFooter'), {
  path: path.resolve(__dirname, './StickyFooter'),
  resolve: () => require.resolveWeak('./StickyFooter'),
  chunkName: 'stickyfooter',
  minDelay: 500
})

export default StickyFooterLoadable;
