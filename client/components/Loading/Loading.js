import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NProgress from 'nprogress';


class Loading extends Component {

  constructor(props) {
    super(props);

    // this.state = {};
  }

  static propTypes = {
    text: PropTypes.string
  };

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> Loading > componentDidMount() <<<<<<<<<<<<<<');
    NProgress.configure({ trickleSpeed: 200 });
    NProgress.start();
  }

  // issue with NProgress not showing after 1st render
  // async componentDidUpdate(prevProps, prevState) {

  //   NProgress.start();

  //   if (prevState.previousLocation !== null) {
  //     NProgress.done();
  //   }

  //   if (prevState.previousLocation === null) {

  //     NProgress.start();

  //     const { history, location, routes, store, helpers } = this.props;

  //     this.setState({ previousLocation: location });

  //     // load data while the old screen remains
  //     const { components, match, params } = await asyncMatchRoutes(routes, this.props.location.pathname);

  //     const triggerLocals = {
  //       ...helpers,
  //       store,
  //       match,
  //       params,
  //       history,
  //       location: this.props.location
  //     };

  //     console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > componentDidUpdate() > triggerLocals: ', triggerLocals);

  //     await trigger('fetch', components, triggerLocals);

  //     if (__CLIENT__) {
  //       await trigger('defer', components, triggerLocals);
  //     }
  //     NProgress.done();
  //   }
  // }

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> Loading > componentWillUnmount() <<<<<<<<<<<<<<');
    NProgress.done();
  }

  render() {

    const t = this.props.text;

    return (

      <div>{ t }</div>

    );
  }
}

export default Loading;
