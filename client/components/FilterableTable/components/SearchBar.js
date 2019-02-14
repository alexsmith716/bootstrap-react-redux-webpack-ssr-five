import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';


class SearchBar extends Component {

  constructor(props) {

    super(props);

    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleInStockChange = this.handleInStockChange.bind(this);

  }

  static propTypes = {
    filterText: PropTypes.string,
    inStockOnly: PropTypes.bool,
    onFilterTextChange: PropTypes.func,
    onInStockChange: PropTypes.func
  };

  handleFilterTextChange(e) {
    // console.log('>>>>>>>>>>>>>>> SearchBar > handleFilterTextChange > e.target.value:', e.target.value)
    this.props.onFilterTextChange(e.target.value);
  }
  
  handleInStockChange(e) {
    // console.log('>>>>>>>>>>>>>>> SearchBar > handleInStockChange > e.target.checked:', e.target.checked)
    this.props.onInStockChange(e.target.checked);
  }

  render() {

    const styles = require('./scss/SearchBar.scss');

    return (

      <form>

        <div className="form-group">

          <input
            type="text"
            className="form-control"
            id="searchBar"
            placeholder="Search..."
            value={this.props.filterText}
            onChange={this.handleFilterTextChange}
          />

        </div>

        <div className="form-check">

          <input
            type="checkbox"
            className="form-check-input"
            id="productsInStock"
            checked={this.props.inStockOnly}
            onChange={this.handleInStockChange}
          />

          <label className="form-check-label" htmlFor="productsInStock">
            Only show products in stock
          </label>

        </div>

      </form>
    );
  }
}

export default SearchBar;
