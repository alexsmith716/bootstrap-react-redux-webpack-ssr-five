import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import NProgress from 'nprogress';
import Loading from '../Loading/Loading';
import SearchBar from './components/SearchBar';
import Tables from './components/Tables';


class FilterableTable extends Component {

  constructor(props) {

    super(props);

    this.state = {
      filterText: '',
      inStockOnly: false,
      isLoading: true,
      error: null,
      externalData: null
    };

    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleInStockChange = this.handleInStockChange.bind(this);
  }

  static propTypes = {
    requestURL: PropTypes.string.isRequired
  };

  handleFilterTextChange(filterText) {
    this.setState({ filterText: filterText });
  }

  handleInStockChange(inStockOnly) {
    this.setState({ inStockOnly: inStockOnly })
  }

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> FilterableTable > componentDidMount() <<<<<<<<<<<<<<');
  }

  componentWillMount() {
    console.log('>>>>>>>>>>>>>>>> FilterableTable > componentWillMount() <<<<<<<<<<<<<<');
    this._asyncRequest = axios.get(this.props.requestURL)
      .then(response => {
        console.log('>>>>>>>>>>>>>>>> FilterableTable > requestDataPromise() > json > SUCCESS2: ', response.data);
          this._asyncRequest = null;
          // this.setState({ externalData: response.data, isLoading: false });
          this.setIntervalCallbackID = setInterval( () => this.setIntervalCallback(response.data), 5000 );
      })
      .catch(error => {
        if (error.externalData) {
          // The request was made and the server responded with a status code that falls out of the range of 2xx
          console.log('>>>>>>>>>>>>>>>> FilterableTable > requestDataPromise() > json > ERROR.response.data: ', error.response.data);
          console.log('>>>>>>>>>>>>>>>> FilterableTable > requestDataPromise() > json > ERROR.response.status: ', error.response.status);
          console.log('>>>>>>>>>>>>>>>> FilterableTable > requestDataPromise() > json > ERROR.response.headers: ', error.response.headers);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('>>>>>>>>>>>>>>>> FilterableTable > requestDataPromise() > json > ERROR.message: ', error.message);
        }
        console.log('>>>>>>>>>>>>>>>> FilterableTable > requestDataPromise() > json > ERROR.config: ', error.config);
        this.setState({ error, isLoading: false });
      });
  }

  setIntervalCallback = (d) => this.setState({ externalData: d, isLoading: false });

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> FilterableTable > componentWillUnmount() <<<<<<<<<<<<<<');
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
    clearInterval(this.setIntervalCallbackID);
  }

  render() {

    const styles = require('./scss/FilterableTable.scss');
    const { isLoading, externalData } = this.state;

    console.log('>>>>>>>>>>>>>>>> FilterableTable > render() > STATE > isLoading: ', isLoading);
    console.log('>>>>>>>>>>>>>>>> FilterableTable > render() > STATE > externalData: ', externalData);

    if (this.state.externalData === null) {

      // Render loading state ...
      return <Loading text={ 'Render loading state ...' } />;

    } else {

      // Render real UI ...
      return <Loading text={ 'Render real UI ...' } />;

    }
  }
}

export default FilterableTable;
