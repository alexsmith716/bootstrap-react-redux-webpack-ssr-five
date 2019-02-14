import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Table from './Table';


class Tables extends Component {

  constructor(props) {

    super(props);

    // this.state = {

    // };
  }

  static propTypes = {
    tablesData: PropTypes.array.isRequired,
    filterText: PropTypes.string,
    inStockOnly: PropTypes.bool
  };

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> TABLES > componentDidMount <<<<<<<<<<<<<<<<<<<<<<');
  }

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> TABLES > componentWillUnmount <<<<<<<<<<<<<<<<<<<<<<');
  }

  render() {

    const filterText = this.props.filterText;
    const inStockOnly = this.props.inStockOnly;

    const tables = [];
    let tableObject = { category: '', heading: [], tableData: [] };
    let lastCategory = null;
    let tableDataArr = [];

    // tableObject = {
    //   category: 'Sporting Goods 2',
    //   heading: [ 'stocked', 'name', 'price', 'size' ],
    //   tableData: [ 
    //     [ true, 'Baseball 1', '9.99', 'large' ],
    //     [ true, 'Baseball 2', '11.99', 'medium' ],
    //     [ true, 'Baseball 3', '10.99', 'large' ]
    //   ] 
    // };

    // ======================================================================================================

    this.props.tablesData.forEach((tablesDataObject, index, arr) => {

      if (tablesDataObject.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
        return;
      }

      if (inStockOnly && !tablesDataObject.stocked) {
        return;
      }

      // ================================================================================

      // evaluate if category is already a 'Table' 'tableObject'
      tables.forEach((obj, index, arr) => {

        if (obj.props.data.category === tablesDataObject.category) {

          Object.values(tablesDataObject).map((obj, index) => {
            obj !== tablesDataObject.category ? tableDataArr.push( String(obj) ) : null;
          });

          obj.props.data.tableData.push( tableDataArr );
        }
      });

      // ================================================================================

      if (tablesDataObject.category !== lastCategory) {

        tableObject.category = tablesDataObject.category;

        // -------------------------- HEADING ------------------------------------

        Object.keys(tablesDataObject).forEach((obj) => {
          obj !== 'category' ? tableObject.heading.push( obj ) : null;
        })

        // -------------------------- TABLEDATA ------------------------------------

        Object.values(tablesDataObject).map((obj, index) => {
          obj !== tablesDataObject.category ? tableDataArr.push( String(obj) ) : null;
        });

        tableObject.tableData.push( tableDataArr )

        // -----------------------------------------------------------------------

        tables.push(
          <Table data={ tableObject } key={index}/>
        );
      }

      tableDataArr = [];
      tableObject = { category: '', heading: [], tableData: [] };
      lastCategory = tablesDataObject.category;
    });

    return (

      <div>

        {tables}

      </div>
    );
  }
}

export default Tables;

// # of unique category's === # of table's
// # of category's === # of table <tr> rows
// # of keys's === # of table <td> columns
