import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route } from 'react-router';
import { trigger } from 'redial';
import NProgress from 'nprogress';
import asyncMatchRoutes from '../server/utils/asyncMatchRoutes';

@withRouter

class ReduxAsyncConnect extends Component {

  constructor(props) {

    super(props);

    this.state = {
      previousLocation: null
    };
  }

  static propTypes = {
    children: PropTypes.node.isRequired,
    history: PropTypes.objectOf(PropTypes.any).isRequired,
    location: PropTypes.objectOf(PropTypes.any).isRequired
  };

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > componentDidMount() <<<<<<<<<<<<<<');
    NProgress.configure({ trickleSpeed: 200 });
  }

  static getDerivedStateFromProps(props, state) {
    console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > getDerivedStateFromProps() <<<<<<<<<<<<<<');

    const navigated = props.location !== state.lastLocation;

    if (navigated) {
      // save the location so we can render the old screen
      // >> then: load data while the old screen remains
      return {
        previousLocation: null,
        lastLocation: props.location
      }
    }

    return null;
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > shouldComponentUpdate() <<<<<<<<<<<<<<');
  //   if (prevProps.list.length < this.props.list.length) {
  //     const list = this.listRef.current;
  //     return list.scrollHeight - list.scrollTop;
  //   }
  //   return null;
  // }

  // getSnapshotBeforeUpdate(prevProps, prevState) {
  //   console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > getSnapshotBeforeUpdate() <<<<<<<<<<<<<<');
  //   if (prevProps.list.length < this.props.list.length) {
  //     const list = this.listRef.current;
  //     return list.scrollHeight - list.scrollTop;
  //   }
  //   return null;
  // }

  // not called for the initial render
  async componentDidUpdate(prevProps, prevState) {

    NProgress.start();

    if (prevState.previousLocation !== null) {
      NProgress.done();
    }

    if (prevState.previousLocation === null) {

      NProgress.start();

      const { history, location, routes, store, helpers } = this.props;

      this.setState({ previousLocation: location });

      // load data while the old screen remains
      const { components, match, params } = await asyncMatchRoutes(routes, this.props.location.pathname);

      const triggerLocals = {
        ...helpers,
        store,
        match,
        params,
        history,
        location: this.props.location
      };

      console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > componentDidUpdate() > triggerLocals: ', triggerLocals);

      await trigger('fetch', components, triggerLocals);

      if (__CLIENT__) {
        await trigger('defer', components, triggerLocals);
      }
      NProgress.done();
    }
  }

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > componentWillUnmount() <<<<<<<<<<<<<<');
  }

  render() {
    const { children, location } = this.props;
    const { previousLocation } = this.state;

    // console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > render() > children:', children);
    // console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > render() > location:', location);
    // console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > render() > previousLocation:', previousLocation);

    const theRoute = <Route location={previousLocation || location} render={() => children} />;
    // console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > render() > <Route>:', theRoute);

    return <Route location={previousLocation || location} render={() => children} />;
  }
}

export default ReduxAsyncConnect;
