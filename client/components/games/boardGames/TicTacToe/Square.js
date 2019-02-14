import React from 'react';
import PropTypes from 'prop-types';


const Square = props => {

  const { onClick, value } = props;
  const styles = require('./scss/TicTacToe.scss');

  return (

    <button className={styles.square} onClick={onClick}>
      {value}
    </button>

  );
};

Square.propTypes = {
  //
};

export default Square;