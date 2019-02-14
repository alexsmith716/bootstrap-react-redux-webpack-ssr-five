import React, { Component } from 'react';
// import Board from './Board';

class TicTacToe extends Component {

  state = {
    showTicTacComplete: false
  };

  handleToggleTicTacComplete = () => {
    const { showTicTacComplete } = this.state;
    this.setState({ showTicTacComplete: !showTicTacComplete });
  };

  render() {

    const { showTicTacComplete } = this.state;
    const ticTacEmpty = require('./img/tictac-empty.png');
    const ticTacComplete = require('./img/tictac-numbers.png');
    const styles = require('./scss/TicTacToe.scss');

    return (

      <div className="container">

        <h1 className={`mt-4 mb-3 ${styles.ticTacToeUniqueColor}`}>Game Tic-Tac-Toe</h1>

        <div className="row">
          <div className="col-lg-12">
            <img className="img-fluid rounded mb-4" src={ticTacComplete} alt="Tic-Tac-Toe Complete" />
          </div>
        </div>

      </div>

    );
  }
}

export default TicTacToe;