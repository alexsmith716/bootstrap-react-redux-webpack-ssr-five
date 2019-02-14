import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TableRow from './TableRow';


class TableHead extends Component {

  constructor(props) {

    super(props);

    this.state = {
      // headingColor: this.getRandomAlert()
      headingColor: 'default'
    };
  }

  static propTypes = {
    category: PropTypes.string,
    heading: PropTypes.array,
  };

  static defaultProps = {
    //
  };

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> TABLEHEAD > componentDidMount <<<<<<<<<<<<<<<<<<<<<<');
    this.timerID = setInterval( () => this.callbackFunction(), 5000 );
  }

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> TABLEHEAD > componentWillUnmount <<<<<<<<<<<<<<<<<<<<<<');
    clearInterval(this.timerID);
  }

  getRandomAlert = () => {
    const alerts = ['active','default', 'primary','secondary','success','danger','warning','info','light', 'dark'];
    const randomAlert = alerts[ Math.floor( Math.random() * alerts.length ) ];
    return randomAlert;
  }

  callbackFunction = () => this.setState({ headingColor: this.getRandomAlert() });

  render() {

    // console.log('>>>>>>>>>>>>>>>> TABLEHEAD > this.props.data:', this.props.data);
    const headingColor = this.state.headingColor;
    // console.log('>>>>>>>>>>>>>>>> TABLEHEAD > STATE > headingColor !!!:', headingColor);

    let rows = [];

    rows.push( <TableRow type="thead" colSpan={ this.props.heading.length } category={ this.props.category } headingColor={ headingColor } key="thead-category" /> );

    rows.push( <TableRow type="thead" data={ this.props.heading } key={ this.props.heading } /> );

    // console.log('>>>>>>>>>>>>>>>> TABLEHEAD !!!!!!! > rows:', rows);

    return (

      <thead>

        {rows}

      </thead>

    );
  }
}

export default TableHead;
