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

  // static defaultProps = {};

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> Loading > componentDidMount() <<<<<<<<<<<<<<');
    NProgress.configure({ trickleSpeed: 200 });
    NProgress.start();
  }

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> Loading > componentWillUnmount() <<<<<<<<<<<<<<');
    NProgress.done();
  }

  render() {

    const t = this.props.text;

    return (

      <div className="alert alert-warning text-center" role="alert">{ t }</div>

    );
  }
}

export default Loading;
