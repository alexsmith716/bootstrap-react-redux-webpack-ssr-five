import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route } from 'react-router';
import { trigger } from 'redial';
// import NProgress from 'nprogress';
import asyncMatchRoutes from '../server/utils/asyncMatchRoutes';

// >>>>>>>>>>>>>>>> ReduxAsyncConnect > componentDidMount() 111111a :  
// Object { pathname: "/", search: "", hash: "", state: undefined }
// 
// >>>>>>>>>>>>>>>> ReduxAsyncConnect > componentDidMount() 222222a :  
// Object { pathname: "/aboutone", search: "", hash: "", state: undefined, key: "huaezb" }
// 
// >>>>>>>>>>>>>>>> ReduxAsyncConnect > componentDidMount() 33333a :  true 
// >>>>>>>>>>>>>>>> ReduxAsyncConnect > componentDidMount() 444444a :  true


// "/" to "/aboutone"
// >>>>>>>>>>>>>>>> ReduxAsyncConnect > componentDidMount() 111111z :  
// Object { pathname: "/", search: "", hash: "", state: undefined }
// 
// >>>>>>>>>>>>>>>> ReduxAsyncConnect > componentDidMount() 222222z :  
// Object { pathname: "/aboutone", search: "", hash: "", state: undefined, key: "65av8p" }
// 
// >>>>>>>>>>>>>>>> ReduxAsyncConnect > componentDidMount() 33333z :  true
// >>>>>>>>>>>>>>>> ReduxAsyncConnect > componentDidMount() 444444z :  true


// "/aboutone" to "/abouttwo"
// >>>>>>>>>>>>>>>> ReduxAsyncConnect > componentDidMount() 111111z :  
// Object { pathname: "/aboutone", search: "", hash: "", state: undefined, key: "65av8p" }
// 
// >>>>>>>>>>>>>>>> ReduxAsyncConnect > componentDidMount() 222222z :  
// Object { pathname: "/abouttwo", search: "", hash: "", state: undefined, key: "cd5wch" }
// 
// >>>>>>>>>>>>>>>> ReduxAsyncConnect > componentDidMount() 33333z :  true
// >>>>>>>>>>>>>>>> ReduxAsyncConnect > componentDidMount() 444444z :  true

@withRouter

export default class ReduxAsyncConnect extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    history: PropTypes.objectOf(PropTypes.any).isRequired,
    location: PropTypes.objectOf(PropTypes.any).isRequired
  };

  state = {
    previousLocation: null
  };

  static getDerivedStateFromProps(props, state) {

    console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > getDerivedStateFromProps() <<<<<<<<<<<<<<');

    console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > getDerivedStateFromProps() 111111z : ', state.lastLocation); // <<< pathname: "/"
    console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > getDerivedStateFromProps() 222222z : ', props.location); // <<< pathname: "/aboutone"

    const navigated = props.location !== state.lastLocation;
    console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > getDerivedStateFromProps() 33333z : ', navigated);

    if (navigated) {
      console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > getDerivedStateFromProps() 444444z : ', navigated);
      // save the location so we can render the old screen
      // >> then: load data while the old screen remains
      return {
        previousLocation: null,
        lastLocation: props.location
      }
    }

    return null;

  }

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > componentDidMount() <<<<<<<<<<<<<<');
  }

  async componentDidUpdate(prevProps, prevState) {

    console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > componentDidUpdate() <<<<<<<<<<<<<<');

    if (prevState.previousLocation === null) {

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

    }
  }

  render() {
    const { children, location } = this.props;
    const { previousLocation } = this.state;

    console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > render() > children:', children);
    console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > render() > location:', location);
    console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > render() > previousLocation:', previousLocation);

    const theRoute = <Route location={previousLocation || location} render={() => children} />;
    console.log('>>>>>>>>>>>>>>>> ReduxAsyncConnect > render() > <Route>:', theRoute);

    return <Route location={previousLocation || location} render={() => children} />;
  }
}
