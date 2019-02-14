import React from 'react';
import universal from 'react-universal-component';
import path from 'path';

const BoardGamesLoadable = universal(() => import(/* webpackChunkName: 'boardgames' */ './BoardGames'), {
  path: path.resolve(__dirname, './BoardGames'),
  resolve: () => require.resolveWeak('./BoardGames'),
  chunkName: 'boardgames',
  minDelay: 500
})

export default BoardGamesLoadable;
