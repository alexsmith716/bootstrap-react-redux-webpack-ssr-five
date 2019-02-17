import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import Loading from '../Loading/Loading';

class AxiosComponentLoaderBasic extends React.Component {
  
  constructor(props) {

    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      isLoading: true,
      error: null,
      data: []
    };
  }

  static propTypes = {
    component: PropTypes.func.isRequired,
    requestURL: PropTypes.string.isRequired
  };

  requestData() {
    axios.get(decodeURI(this.props.requestURL))
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
        console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > componentDidMount() > json > SUCCESS typeof: ', typeof response.data);
        console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > componentDidMount() > json > SUCCESS data: ', response.data);
        this.setState({ data: response.data, isLoading: false });
      })
      .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code that falls out of the range of 2xx
          console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > componentDidMount() > json > ERROR.response.data: ', error.response.data);
          console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > componentDidMount() > json > ERROR.response.status: ', error.response.status);
          console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > componentDidMount() > json > ERROR.response.headers: ', error.response.headers);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > componentDidMount() > json > ERROR.message: ', error.message);
        }
        console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > componentDidMount() > json > ERROR.config: ', error.config);
        this.setState({ error, isLoading: false });
      });
  }

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > componentDidMount() <<<<<<<<<<<<<<');
    this.requestData();
  }

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > componentWillUnmount() <<<<<<<<<<<<<<');
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // Update component state whenever the data source changes
    this.setState({
      comments: DataSource.getComments()
    });
  }

  render () {

    const { isLoading, data } = this.state;

    let Component = this.props.component;

    if ( !isLoading ) {

      return <Component content={ data } />;

    } else {

      return <Loading text={ 'Loading...' } />;

    }
  }
}

export default AxiosComponentLoaderBasic;
