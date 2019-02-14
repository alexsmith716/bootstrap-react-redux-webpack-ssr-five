import React from 'react';
import PropTypes from 'prop-types';


const BoilingVerdict = props => {

  const { celsius } = props;

  if (celsius >= 100) {

    return <p>The water would boil.</p>;

  }

  return <p>The water would not boil.</p>;

}

BoilingVerdict.propTypes = {
  celsius: PropTypes.number.isRequired
};

export default BoilingVerdict;
