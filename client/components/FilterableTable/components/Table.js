import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TableHead from './TableHead';
import TableBody from './TableBody';

// <table className="table table-striped table-bordered table-sm">

class Table extends Component {

  constructor(props) {

    super(props);

    // this.state = {};
  }

  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> TABLE > componentDidMount <<<<<<<<<<<<<<<<<<<<<<');
  }

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> TABLE > componentWillUnmount <<<<<<<<<<<<<<<<<<<<<<');
  }

  render() {

    const styles = require('./scss/Table.scss');

    return (

      <div className="table-responsive">

        <table className="table table-striped table-bordered table-sm">

          <TableHead category={ this.props.data.category } heading={ this.props.data.heading } />

          <TableBody tableData={ this.props.data.tableData } />

        </table>

      </div>

    );
  }
}

export default Table;

// # of unique category's === # of table's
// # of category's === # of table <tr> rows
// # of keys's === # of table <td> columns

// <table className="table table-striped">

//   <thead>

//     <tr className="table-info">
//       <th colSpan={ tempColSpan }>{ `${category } `}</th>
//     </tr>

//     <tr>
//       <th scope="col">Name</th>
//       <th scope="col">Price</th>
//       <th scope="col">Size</th>
//       <th scope="col">Color</th>
//       <th scope="col">Make</th>
//       <th scope="col">Model</th>
//       <th scope="col">ID</th>
//       <th scope="col">State</th>
//       <th scope="col">Logo</th>
//       <th scope="col">Count</th>
//       <th scope="col">Ordered</th>
//     </tr>

//   </thead>

//   <tbody>
//     <tr>
//       <td>Football</td>
//       <td>49.99</td>
//       <td>large</td>
//       <td>brown</td>
//       <td>NFL</td>
//       <td>Bullet</td>
//       <td>4001</td>
//       <td>CA</td>
//       <td>true</td>
//       <td>231</td>
//       <td>false</td>
//     </tr>
//   </tbody>
// </table>
