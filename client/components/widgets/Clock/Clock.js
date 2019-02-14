import React, { Component } from 'react';


class Clock extends Component {

  constructor(props) {
    super(props);

    this.state = {
      date: new Date(),
    };
  }

  componentDidMount() {
    // register function to be invoked repeatedly after elapse of 1 sec
    this.timerID = setInterval( () => this.callbackFunction(), 1000 );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  callbackFunction = () => this.setState({ date: new Date(), });

  render() {

    // const styles = require('./scss/Clock.scss');

    return (

      <div>

        {this.state.date.toLocaleTimeString()}

      </div>
    );
  }
}

export default Clock;
