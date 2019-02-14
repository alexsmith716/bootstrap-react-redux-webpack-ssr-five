import React, { Component } from 'react';


class RandomBootstrapAlert extends Component {

  constructor(props) {
    super(props);

    this.state = {
      alertColor: this.getRandomAlert()
    };
  }

  componentDidMount() {
    // register function to be invoked repeatedly after elapse of 1 sec
    this.timerID = setInterval( () => this.callbackFunction(), 3000 );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  getRandomAlert = () => {
    const alerts = ['primary','secondary','success','danger','warning','info','light','dark'];
    const randomAlert = alerts[ Math.floor( Math.random() * alerts.length ) ];
    return randomAlert;
  }

  callbackFunction = () => this.setState({ alertColor: this.getRandomAlert() });

  render() {

    // const styles = require('./scss/RandomBootstrapAlert.scss');

    return (

      <div className={`alert alert-${this.state.alertColor}`} role="alert">{`This is a Bootstrap v4 ${this.state.alertColor.toUpperCase()} alert`}</div>

    );
  }
}

export default RandomBootstrapAlert;
