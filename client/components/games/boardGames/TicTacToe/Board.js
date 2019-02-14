import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Square from './Square';


class Board extends Component {

  constructor(props) {

    super(props);

    // this.state = {

    // };
  }

  static propTypes = {
    // 
  };

  renderSquare(i) {

    return (

      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />

    );
  }

  render() {

    const styles = require('./scss/TicTacToe.scss');

    return (

      <div>

        <div className={styles.boardRow}>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>

        <div className={styles.boardRow}>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>

        <div className={styles.boardRow}>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>

      </div>

    );
  }
}

export default Board;
