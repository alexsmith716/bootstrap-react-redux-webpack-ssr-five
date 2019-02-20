import React, { Component } from 'react';
import PropTypes from 'prop-types';

// STATE: private and fully controlled by the component
// it's input (Prop) that the component can update/change/modify
// Because: All React components must act like pure functions with respect to their props


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

    return (

      <Component requestURL={ loaderURI } />

    );
  }
}

export default AxiosComponentLoaderBasic;

