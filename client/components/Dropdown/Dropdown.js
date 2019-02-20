import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NProgress from 'nprogress';

// STATE: private and fully controlled by the component
// it's input (Prop) that the component can update/change/modify
// Because: All React components must act like pure functions with respect to their props


class Dropdown extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  static propTypes = {
    title: PropTypes.string,
    optionsArray: PropTypes.array.isRequired,
    dropDownOptionSelected: PropTypes.string,
    onDropdownChange: PropTypes.func
  };

  // static defaultProps = {};

  // ================================================================================================

  // 'handleChange' calling prop method 'AboutOne'
  handleChange = (e) => {
    this.props.onDropdownChange(e.target.value);
  }

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> Loading > componentDidMount() <<<<<<<<<<<<<<');
    // NProgress.configure({ trickleSpeed: 200 });
    // NProgress.start();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('>>>>>>>>>>>>>>>> Loading > componentDidUpdate() <<<<<<<<<<<<<<');
    if (this.state.value === '') {
      console.log('>>>>>>>>>>>>>>>> Loading > componentDidUpdate() > handleChange() >  setState1: ', this.state.value);
    } else {
      console.log('>>>>>>>>>>>>>>>> Loading > componentDidUpdate() > handleChange() >  setState2: ', this.state.value);
    }
  }

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> Loading > componentWillUnmount() <<<<<<<<<<<<<<');
    // NProgress.done();
  }

  render() {

    const { title, optionsArray, dropDownOptionSelected } = this.props;
    const { value } = this.state;

    return (

      <form>

        <div className="form-group">

          <label htmlFor="exampleFormControlSelect1">{ title }</label>

          <select
            className="custom-select
            custom-select-sm"
            id="exampleFormControlSelect1"
            value={dropDownOptionSelected}
            onChange={this.handleChange}
          >

            <option value="">{ title }...</option>

            {optionsArray.map((option, index) => (
              <React.Fragment key={index}>
                <option value={option}>{option}</option>
              </React.Fragment>
            ))}

          </select>

        </div>

      </form>
    );
  }
}

export default Dropdown;
