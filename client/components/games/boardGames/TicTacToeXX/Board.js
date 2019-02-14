import React, { Component } from 'react';
import Square from './Square';

class Board extends Component {

  createBoard(row, col) {

    return board;
  }

  renderSquare(i) {

    return (
      <Square

      />
    );
  }

  render() {
    return <div>{this.createBoard(3, 3)}</div>;
  }
}

export default Board;
