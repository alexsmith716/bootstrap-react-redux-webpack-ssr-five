import React, { Component } from 'react';
import Helmet from 'react-helmet';

import TicTacToe from '../../../components/games/boardGames/TicTacToe/TicTacToe';


class BoardGames extends Component {

  UNSAFE_componentWillMount() {
    console.log('>>>>>>>>>>>>>>>> BOARDGAMES > UNSAFE_componentWillMount() <<<<<<<<<<<<<<');
  }

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> BOARDGAMES > componentDidMount() <<<<<<<<<<<<<<');
  }

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> BOARDGAMES > componentWillUnmount() <<<<<<<<<<<<<<');
  }

  render() {

    const styles = require('./scss/BoardGames.scss');

    return (

      <div className="container">

        <Helmet title="Board Games" />

        <h1 className={`mt-4 mb-3 ${styles.uniqueColor}`}>Board Games</h1>

        <div className="row">

          <div className="col-lg-12">

            <TicTacToe />

          </div>
        </div>

      </div>
    );
  }
}

export default BoardGames;
