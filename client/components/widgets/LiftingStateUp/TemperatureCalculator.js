import React, { Component } from 'react';
import PropTypes from 'prop-types';

import BoilingVerdict from './BoilingVerdict';
import TemperatureInput from './TemperatureInput';
import { toCelsius, toFahrenheit, tryConvert } from './stateHelpers';

// Lifting State Up: 
//  what prop is private (for whatever reason) and controlled to a particular component (state)
//  share the above state (private prop) to a child component as props from a parent
//  if a parent component owns shared state, it becomes the 'source of truth' for state props passed to all children

// are DOM nodes the same? >>>>>>>>> do they reference the same object <<<<<<<<<<<<<
// (isSameNode || isEqualNode)
// class instances rendered into the same DOM node (<div><Clock /></div> && <div><Clock /></div>) are using the same instance

// affecting the JS 'onChange' event handler in the HTML '<input>' element in child component 'TemperatureInput'


class TemperatureCalculator extends Component {

  // implement the 'constructor' for a subclass instance
  // called before mounting
  // initializes local state (assigns an object to 'this.state')
  // subclass instance properties and methods are defined in the constructor
  constructor(props) {

    // define 'this.props'
    super(props);

    // when you define a class component, an 'event handler' is a method on the class
    // bind event handler methods to an instance ('this')

    // the 'bind(this)' binding is necessary to make 'this' work in the callback/return
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);

    // initialize state to subclass instance
    this.state = {
      temperature: '',
      scale: 'c'
    };
  }

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> TemperatureCalculator > componentDidMount <<<<<<<<<<<<<<<<<<<<<<');
  }

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> TemperatureCalculator > componentWillUnmount <<<<<<<<<<<<<<<<<<<<<<');
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('>>>>>>>>>>>>>>>> TemperatureCalculator > shouldComponentUpdate <<<<<<<<<<<<<<<<<<<<<<');
  // };

  // static getDerivedStateFromProps(props, state) {
  //   console.log('>>>>>>>>>>>>>>>> TemperatureCalculator > getDerivedStateFromProps <<<<<<<<<<<<<<<<<<<<<<');
  // };

  // yes, single parameter (skip parenthesis) more than one (parenthesis required)
  // one returned expression (skip curly braces) more than one (curly braces required with return keyword)
  handleCelsiusChange = (temperature) => {
    this.setState( { scale: 'c', temperature } );
  }

  handleFahrenheitChange = (temperature) => {
    this.setState( { scale: 'f', temperature } );
  }

  // examine 'this.props' and 'this.state' and return a React element
  // called each time an update happens (state update, network update, HMR update)
  render() {

    const scale = this.state.scale;
    const temperature = this.state.temperature;

    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    const styles = require('./scss/TemperatureCalculator.scss');

    // const styles = require('./scss/TemperatureCalculator.scss');

    // FIRE JS EVENT HANDLER: 'onChange'
    // 'onChange' event initiates 'this.handleChange'
    // 'handleChange' passes the value of '<input>' to (e.target.value)
    // 'handleChange' calls its prop method 'this.props.onTemperatureChange(e.target.value)'

    // >>>>>>>>> PROP >>>>>>>>>>> 'onTemperatureChange' <<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    // 'onTemperatureChange' of the 'Celsius' 'TemperatureInput' is this component's 'handleCelsiusChange' method
    // 'onTemperatureChange' of the 'Fahrenheit' 'TemperatureInput' is this component's 'handleFahrenheitChange' method

    console.log('>>>>>>>>>>>>>>>> TemperatureCalculator > RENDER !!!!!! > temperature: ', temperature , ' > scale: ', scale);

    return (

      <div className="row justify-content-md-center">
        <div className="col-md-auto">

          <div className="container-flex bg-color-ivory container-padding-border-radius-2">
            <div className="width-400">

              <form>

                <TemperatureInput
                  scale="c"
                  temperature={ celsius }
                  onTemperatureChange={ this.handleCelsiusChange } />

                <TemperatureInput
                  scale="f"
                  temperature={ fahrenheit }
                  onTemperatureChange={ this.handleFahrenheitChange } />

              </form>

              <BoilingVerdict celsius={ parseFloat(celsius) } />

            </div>
          </div>

        </div>
      </div>
    );
  }
};

export default TemperatureCalculator;
