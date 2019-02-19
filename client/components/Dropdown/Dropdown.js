import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NProgress from 'nprogress';

  // <div className="form-group">
  //   <label htmlFor="exampleFormControlSelect1">{ title }</label>
  //   <select className="form-control" id="exampleFormControlSelect1">
  //     <option>product-categories-small</option>
  //     <option>product-categories</option>
  //   </select>
  // </div>

class Dropdown extends Component {

  constructor(props) {
    super(props);

    // this.state = {};
  }

  static propTypes = {
    title: PropTypes.string,
    optionsArray: PropTypes.array.isRequired
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

    const { title, optionsArray } = this.props;

    return (

      <form>

        <div className="form-group">

          <label htmlFor="exampleFormControlSelect1">{ title }</label>

          <select className="form-control" id="exampleFormControlSelect1">

            {optionsArray.map((option, index) => (
              <React.Fragment key={index}>
                <option>{option}</option>
              </React.Fragment>
            ))}

          </select>

        </div>

      </form>
    );
  }
}

export default Dropdown;
