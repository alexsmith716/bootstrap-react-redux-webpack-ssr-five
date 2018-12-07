import React from 'react';
import universal from 'react-universal-component';
import path from 'path';

const StickyFooterLoadable = universal(() => import(/* webpackChunkName: 'sticky-footer' */ './StickyFooter'), {
  path: path.resolve(__dirname, './StickyFooter'),
  resolve: () => require.resolveWeak('./StickyFooter'),
  chunkName: 'sticky-footer',
  minDelay: 500
})

export default StickyFooterLoadable;
