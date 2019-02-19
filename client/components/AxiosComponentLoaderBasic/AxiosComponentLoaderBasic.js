import React, { Component } from 'react';
import PropTypes from 'prop-types';

// STATE: private and fully controlled by the component

class AxiosComponentLoaderBasic extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      loaderURI: null
    };
  }

  static propTypes = {
    component: PropTypes.func.isRequired,
    requestURL: PropTypes.string.isRequired
  };

  // ================================================================================================

  static getDerivedStateFromProps(props, state) {
    if (props.requestURL !== state.prevId) {
      return {
        loaderURI: props.requestURL,
        prevId: props.requestURL
      };
    }

    return null;
  }

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > componentDidMount() <<<<<<<<<<<<<<');
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > componentDidUpdate() <<<<<<<<<<<<<<');
  }

  render() {

    const { loaderURI } = this.state;
    console.log('>>>>>>>>>>>>>>>> AxiosComponentLoaderBasic > render() <<<<<<<<<<<<<<');

    let Component = this.props.component;
    // const u = this.props.requestURL;
    //const t = 'Loading...';

    //if ( !isLoading ) {

      return <Component requestURL={ loaderURI } />;

    //} else {

      //return <Loading text={ t } />;

    //}
  }
}

export default AxiosComponentLoaderBasic;
