import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NProgress from 'nprogress';


class Dropdown extends Component {

  constructor(props) {
    super(props);

    // this.state = {};
  }

  static propTypes = {
    // text: PropTypes.string
  };

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

    // const t = this.props.text;

    return (

      <form>

        <div className="form-group">
          <label htmlFor="exampleFormControlSelect1">Product Tables</label>
          <select className="form-control" id="exampleFormControlSelect1">
            <option>product-categories-small</option>
            <option>product-categories</option>
            <option>product-categories-small</option>
            <option>product-categories</option>
          </select>
        </div>

      </form>
    );
  }
}

export default Dropdown;
