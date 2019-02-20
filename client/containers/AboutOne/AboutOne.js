import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import { withStore } from '../../../hoc';

import AxiosComponentLoaderBasic from '../../components/AxiosComponentLoaderBasic/AxiosComponentLoaderBasic';

import Clock from '../../components/widgets/Clock/Clock';
import RandomBootstrapAlert from '../../components/widgets/RandomBootstrapAlert/RandomBootstrapAlert';

import Dropdown from '../../components/Dropdown/Dropdown';
import FilterableTable from '../../components/FilterableTable/FilterableTable';

import TemperatureCalculator from '../../components/widgets/LiftingStateUp/TemperatureCalculator';

// --------------------------------------------------------------------------

@withStore

class AboutOne extends Component {

  constructor(props) {
    super(props);

    // thinking through react with next cool code change
    // --------------------------------------------------------------------------
    // 'AxiosComponentLoaderBasic' will take 'Required' prop 'requestURL' from 'AboutOne's state 'dropDownOptionSelected'
    // 'Dropdown's 'onChange' event will cause a lifted state change in 'AboutOne' for it's state 'dropDownOptionSelected'
    // state 'dropDownOptionSelected' is lifted from 'Dropdown' to 'AboutOne'
    // state 'dropDownOptionSelected', if changed, will cause render of 'AxiosComponentLoaderBasic' with modified 'prop' 'requestURL'
    // 'Dropdown' will take a 'Required' lifted 'state' and take a prop 'title' and 'Required' prop 'optionsArray'
    // test it tomorrow (as usual, something like that) 
    this.state = {
      dropDownOptionSelected: '',
    };
  }

  static propTypes = {
    store: PropTypes.objectOf(PropTypes.any).isRequired
  };

  // static defaultProps = {};

  handleDropdownChange = (dropDownOptionSelected) => {
    this.setState( { dropDownOptionSelected } );
  }

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> AboutOne > componentDidMount() <<<<<<<<<<<<<<');
  }

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> AboutOne > componentWillUnmount() <<<<<<<<<<<<<<');
  }

  // static contextTypes = {
  //   store: PropTypes.objectOf(PropTypes.any).isRequired
  // };

  render() {

    const styles = require('./scss/AboutOne.scss');
    // const uri = encodeURI('/product-categories-small.json');
    // const uri = encodeURI('/product-categories.json');

    const dropdownTiltle = 'Select Product Table';

    const dropdownOptions = [
      '/product-categories-small.json',
      '/product-categories.json',
      '/product-categories-small.json',
      '/product-categories.json',
      '/product-categories-small.json',
      '/product-categories.json',
      '/product-categories-small.json',
      '/product-categories.json'
    ];

    const dropDownOptionSelected = this.state.dropDownOptionSelected;
    let filterableTable;

    if (dropDownOptionSelected !== '') {
      filterableTable = <FilterableTable requestURL={ dropDownOptionSelected } />;
    }

    return (

      <div className="container">

        <Helmet title="About One" />

        <h1 className={styles.uniqueColor}>About One</h1>

        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et, consequuntur, modi mollitia corporis ipsa voluptate corrupti eum ratione ex ea praesentium quibusdam? Aut, in eum facere corrupti necessitatibus perspiciatis quis?</p>

        <div className="row">

          <div className="col-lg-12 mb-4">

            <div className="card h-100">

              <h2 className="card-header text-center">
                Clock: state and lifecycle in a basic React component!
              </h2>

              <div className="card-body text-center">

                <div className="card-title">

                  <RandomBootstrapAlert />

                  <p>With supporting text below as a natural lead-in to additional content.</p>

                  <a href="#" className="btn btn-primary">Go somewhere</a>

                </div>
              </div>

              <div className="card-footer text-muted text-center">

                <Clock />

              </div>
            </div>
          </div>
        </div>

        <div className="row">

          <div className="col-lg-12 mb-4">

            <div className="card h-100">

              <h2 className="card-header text-center">
                Thinking in React!
              </h2>

              <div className="card-body">

                <h5 className="card-title text-center">
                  Filterable Product Table
                </h5>

                <div className={`${styles.cardBodyContainer}`}>

                  <div className={`${styles.cardBodyContent}`}>

                    <div className={`container-padding-border-radius-2`}>
                    
                      <div className="container-flex bg-color-ivory container-padding-border-radius-1">
                        <div className="width-400">
                    
                          <Dropdown
                            title={dropdownTiltle}
                            optionsArray={dropdownOptions}
                            dropDownOptionSelected={dropDownOptionSelected}
                            onDropdownChange={ this.handleDropdownChange }
                          />
                    
                        </div>
                      </div>
                    
                    </div>

                    <br/>

                    { filterableTable }

                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="row">

          <div className="col-lg-12 mb-4">

            <div className="card h-100">

              <h2 className="card-header text-center">
                Thinking in React!
              </h2>

              <div className="card-body">

                <h5 className="card-title text-center">
                  Lifting State Up
                </h5>

                <div className={`${styles.cardBodyContainer}`}>

                  <div className={`${styles.cardBodyContent}`}>

                    <TemperatureCalculator />

                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default AboutOne;
