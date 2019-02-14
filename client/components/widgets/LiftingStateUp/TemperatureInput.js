import React, { Component } from 'react';
import PropTypes from 'prop-types';

const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};


class TemperatureInput extends Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  // -----------------------------------------------------------

  static propTypes = {
    scale: PropTypes.string,
    temperature: PropTypes.string,
    onTemperatureChange: PropTypes.func
  };

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> TemperatureInput > componentDidMount <<<<<<<<<<<<<<<<<<<<<<');
  }

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> TemperatureInput > componentWillUnmount <<<<<<<<<<<<<<<<<<<<<<');
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('>>>>>>>>>>>>>>>> TemperatureInput > shouldComponentUpdate <<<<<<<<<<<<<<<<<<<<<<');
  // };

  // static getDerivedStateFromProps(props, state) {
  //   console.log('>>>>>>>>>>>>>>>> TemperatureInput > getDerivedStateFromProps <<<<<<<<<<<<<<<<<<<<<<');
  // };

  // -----------------------------------------------------------

  // 'handleChange' calling prop method 'onTemperatureChange'
  handleChange = (e) => {
    this.props.onTemperatureChange(e.target.value);
  }

  // -----------------------------------------------------------

  render() {

    const temperature = this.props.temperature;
    const scale = this.props.scale;

    console.log('>>>>>>>>>>>>>>>> TemperatureInput > RENDER !!!!!! > temperature: ', temperature , ' > scale: ', scale);

    return (

      <div className="form-group">

        <label htmlFor="temperatureInput">Enter temperature in { scaleNames[scale] }:</label>

        <input
          type="text"
          className="form-control"
          id="temperatureInput"

          placeholder={ `${scaleNames[scale]} value...` }

          value={ temperature }

          onChange={ this.handleChange }

        />

      </div>

    );
  }
};

export default TemperatureInput;
