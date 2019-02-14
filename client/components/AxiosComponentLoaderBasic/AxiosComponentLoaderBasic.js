import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

class AxiosComponentLoaderBasic extends React.Component {
  
  constructor(props) {

    super(props);

    this.state = {
      data: []
    };
  }

  static propTypes = {
    component: PropTypes.func.isRequired,
    requestURL: PropTypes.string.isRequired
  };

  componentDidMount() {

    console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > componentDidMount() <<<<<<<<<<<<<<');
    console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > componentDidMount() > typeof props.requestURL: ', typeof this.props.requestURL);
    console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > componentDidMount() > props.requestURL: ', this.props.requestURL);

    axios.get(decodeURI(this.props.requestURL))
      .then(response => {
        console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > componentDidMount() > json > SUCCESS typeof: ', typeof response.data);
        console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > componentDidMount() > json > SUCCESS data: ', response.data);
        this.setState({ data: response.data });
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
      });
  }

  render () {

    let Component = this.props.component;

    console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > render() > Component: ', this.props.component);

    return <Component content={ this.state.data } />;

  }
}

export default AxiosComponentLoaderBasic;
