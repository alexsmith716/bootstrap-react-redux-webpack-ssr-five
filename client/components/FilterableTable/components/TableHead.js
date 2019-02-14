import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TableRow from './TableRow';


class TableHead extends Component {

  constructor(props) {

    super(props);

    this.tableHeadIntervalChange = this.tableHeadIntervalChange.bind(this);

    // set initial render headingColor
    this.state = {
      headingColor: 'default'
    };
  }

  static propTypes = {
    category: PropTypes.string,
    heading: PropTypes.array,
  };

  // static defaultProps = {};

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> TABLEHEAD > componentDidMount <<<<<<<<<<<<<<<<<<<<<<');
  }

  componentWillUnmount() {
    // console.log('>>>>>>>>>>>>>>>> TABLEHEAD > componentWillUnmount <<<<<<<<<<<<<<<<<<<<<<');
  }

  tableHeadIntervalChange = (headingColor) => {
    this.setState( { headingColor } );
  }

  render() {

    // console.log('>>>>>>>>>>>>>>>> TABLEHEAD > this.props.data:', this.props.data);
    const headingColor = this.state.headingColor;
    // console.log('>>>>>>>>>>>>>>>> TABLEHEAD > STATE > headingColor !!!:', headingColor);

    let rows = [];

    rows.push( <TableRow type="thead" colSpan={this.props.heading.length} category={this.props.category} headingColor={headingColor} onIntervalChange={this.tableHeadIntervalChange} key="thead-category" /> );

    rows.push( <TableRow type="thead" data={this.props.heading} key={this.props.heading} /> );

    // console.log('>>>>>>>>>>>>>>>> TABLEHEAD !!!!!!! > rows:', rows);

    return (

      <thead>

        {rows}

      </thead>

    );
  }
}

export default TableHead;
