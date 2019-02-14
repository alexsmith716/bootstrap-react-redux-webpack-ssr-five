import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import '../../../../assets/js/ticTacToe';
import Board from './Board';

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};


class TicTacToe extends Component {

  constructor(props) {
    super(props);

    this.state = {
      history: [ { squares: Array(9).fill(null) } ],
      stepNumber: 0,
      xIsNext: true
    };

  }

  static propTypes = {
    // 
  };

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> TicTacToe > componentDidMount() <<<<<<<<<<<<<<');

    // let gamesErrors = document.getElementById('games-errors');

    // if (!gamesErrors) {
    //   gamesErrors = document.createElement('div');
    //   gamesErrors.id = 'games-errors';

    //   document.body.appendChild(gamesErrors);
    // }

    // // arrow function creating a IIFE
    // ((d, id) => {

    //   if (d.getElementById(id)) return;

    //   const js = d.createElement('script');

    //   js.id = id;

    //   js.src = '/ticTacToe.js';

    //   d.body.appendChild(js);

    // })(document, 'ticTacToe');

  }

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> TicTacToe > componentWillUnmount() <<<<<<<<<<<<<<');
  }

  handleClick(i) {

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";

    this.setState({
      history: history.concat( [{ squares: squares }] ),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });

  }

  jumpTo(step) {

    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });

  }

  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const styles = require('./scss/TicTacToe.scss');

    const moves = history.map((step, move) => {

      const desc = move ? 'Go to move #' + move : 'Go to game start';

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );

    });

    let status;

    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (

      <div className={styles.game}>

        <div className={styles.gameBoard}>

          <Board squares={current.squares} onClick={i => this.handleClick(i)} />

        </div>

        <div className={styles.gameInfo}>

          <div>{status}</div>

          <ol>{moves}</ol>

        </div>

      </div>
    );
  }
}

export default TicTacToe;
