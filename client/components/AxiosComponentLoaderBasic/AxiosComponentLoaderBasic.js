import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import NProgress from 'nprogress';
import Loading from '../Loading/Loading';

// STATE: private and fully controlled by the component

class AxiosComponentLoaderBasic extends React.Component {
  
  constructor(props) {

    super(props);

    // this.state = {
    //   isLoading: true,
    //   error: null,
    //   data: []
    // };
  }

  static propTypes = {
    component: PropTypes.func.isRequired,
    requestURL: PropTypes.string.isRequired
  };

  // requestDataPromise() {
  //   axios.get(this.props.requestURL)
  //     .then(response => {
  //       console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > requestDataPromise() > json > SUCCESS: ', response.data);
  //       this.setIntervalCallbackID = setInterval( () => this.setIntervalCallback(response.data), 5000 );
  //       // this.setState({ data: response.data, isLoading: false });
  //     })
  //     .catch(error => {
  //       if (error.response) {
  //         // The request was made and the server responded with a status code that falls out of the range of 2xx
  //         console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > requestDataPromise() > json > ERROR.response.data: ', error.response.data);
  //         console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > requestDataPromise() > json > ERROR.response.status: ', error.response.status);
  //         console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > requestDataPromise() > json > ERROR.response.headers: ', error.response.headers);
  //       } else {
  //         // Something happened in setting up the request that triggered an Error
  //         console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > requestDataPromise() > json > ERROR.message: ', error.message);
  //       }
  //       console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > requestDataPromise() > json > ERROR.config: ', error.config);
  //       this.setState({ error, isLoading: false });
  //     });
  // }

  // async requestDataAsyncAwait() {
  //   try {
  //     const response = await axios.get(this.props.requestURL);
  //     this.setIntervalCallbackID = setInterval( () => this.setIntervalCallback(response.data), 5000 );
  //     // this.setState({ data: response.data, isLoading: false });
  //     console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > requestDataAsyncAwait() > json > SUCCESS: ', response.data);
  //   } catch (error) {
  //     console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > requestDataAsyncAwait() > json > ERROR: ', error);
  //     this.setState({ error, isLoading: false });
  //   }
  // }

  // setIntervalCallback = (d) => this.setState({ data: d, isLoading: false });

  // componentDidMount() {
  //   console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > componentDidMount() <<<<<<<<<<<<<<');
  //   this.requestDataPromise();
  //   // this.requestDataAsyncAwait();
  // }

  // componentWillUnmount() {
  //   console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > componentWillUnmount() <<<<<<<<<<<<<<');
  //   clearInterval(this.setIntervalCallbackID);
  // }

  render() {

    //const { isLoading, data } = this.state;
    console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > render() <<<<<<<<<<<<<<');

    let Component = this.props.component;
    const u = this.props.requestURL;
    //const t = 'Loading...';

    //if ( !isLoading ) {

      return <Component requestURL={ u } />;

    //} else {

      //return <Loading text={ t } />;

    //}
  }
}

export default AxiosComponentLoaderBasic;
