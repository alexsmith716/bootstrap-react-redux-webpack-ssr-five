import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import NProgress from 'nprogress';
import Loading from '../Loading/Loading';
import SearchBar from './components/SearchBar';
import Tables from './components/Tables';

// STATE: private and fully controlled by the component
// it's input (Prop) that the component can update/change/modify
// Because: All React components must act like pure functions with respect to their props


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

  // static defaultProps = {};

  handleFilterTextChange(filterText) {
    this.setState({ filterText: filterText });
  }

  handleInStockChange(inStockOnly) {
    this.setState({ inStockOnly: inStockOnly })
  }

  // ================================================================================================

  setTimeoutCallback = (d) => this.setState({ externalData: d, isLoading: false });

  requestDataPromise(requestURL) {
    this._asyncRequest = axios.get(requestURL)
      // map the req endpoints to props
      // .then(response => {
      //   response.data.categories.map(category => ({
      //     category: `${category.category}`,
      //     stocked: `${category.login.username}`,
      //     name: `${category.email}`,
      //     price: `${category.price}`,
      //   }))
      // })
      .then(response => {
        console.log('>>>>>>>>>>>>>>>> FilterableTable > requestDataPromise() > json > SUCCESS2: ', response.data);
          this._asyncRequest = null;
          // this.setState({ externalData: response.data, isLoading: false });
          this.setTimeoutCallbackID = setTimeout( () => this.setTimeoutCallback(response.data), 5000 );
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

  async requestDataAsyncAwait(requestURL) {
    try {
      const response = await axios.get(requestURL);
      // this.setState({ externalData: response.data, isLoading: false });
      this.setTimeoutCallbackID = setTimeout( () => this.setTimeoutCallback(response.data), 5000 );
      console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > requestDataAsyncAwait() > json > SUCCESS: ', response.data);
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > requestDataAsyncAwait() > json > ERROR: ', error);
      this.setState({ error, isLoading: false });
    }
  }

  // ================================================================================================

  static getDerivedStateFromProps(props, state) {
    if (props.requestURL !== state.prevId) {
      return {
        externalData: null,
        prevId: props.requestURL,
      };
    }

    return null;
  }

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> FilterableTable > componentDidMount() <<<<<<<<<<<<<<');
    this.requestDataPromise(this.props.requestURL);
    // this.requestDataAsyncAwait(this.props.requestURL);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('>>>>>>>>>>>>>>>> FilterableTable > componentDidUpdate() <<<<<<<<<<<<<<');
    if (this.state.externalData === null) {
      this.requestDataPromise(this.props.requestURL);
    }
  }

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> FilterableTable > componentWillUnmount() <<<<<<<<<<<<<<');
  }

  render() {

    const styles = require('./scss/FilterableTable.scss');
    const { isLoading, externalData } = this.state;
    const loadingText = 'Fetching Requested Data ...';

    console.log('>>>>>>>>>>>>>>>> FilterableTable > render() > STATE > isLoading: ', isLoading);
    console.log('>>>>>>>>>>>>>>>> FilterableTable > render() > STATE > externalData: ', externalData);

    if (this.state.externalData === null) {

      // Render loading state ...
      return (

        <div className={`container-padding-border-radius-2`}>

          <div className="container-padding-border-radius-1">

            <Loading text={ loadingText } />

          </div>

        </div>

      );

    } else {

      // Render real UI ...
      return (

        <div className={`container-padding-border-radius-2`}>

          <div className="container-flex bg-color-ivory container-padding-border-radius-1">
            <div className="width-400">

              <SearchBar 
                filterText={ this.state.filterText }
                inStockOnly={ this.state.inStockOnly }
                onFilterTextChange={ this.handleFilterTextChange }
                onInStockChange={ this.handleInStockChange }
              />

            </div>
          </div>

          <br />

          <div>

            <Tables 
              tablesData={ externalData } 
              filterText={ this.state.filterText }
              inStockOnly={ this.state.inStockOnly }
            />

          </div>
        </div>
      );
    }
  }
}

export default FilterableTable;
