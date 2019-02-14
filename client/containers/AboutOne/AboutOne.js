import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import AxiosComponentLoaderBasic from '../../components/AxiosComponentLoaderBasic/AxiosComponentLoaderBasic';

import Clock from '../../components/widgets/Clock/Clock';
import RandomBootstrapAlert from '../../components/widgets/RandomBootstrapAlert/RandomBootstrapAlert';
import FilterableTable from '../../components/FilterableTable/FilterableTable';

import TemperatureCalculator from '../../components/widgets/LiftingStateUp/TemperatureCalculator';


class AboutOne extends Component {

  componentDidMount() {
    console.log('>>>>>>>>>>>>>>>> AboutOne > componentDidMount() <<<<<<<<<<<<<<');
  }

  componentWillUnmount() {
    console.log('>>>>>>>>>>>>>>>> AboutOne > componentWillUnmount() <<<<<<<<<<<<<<');
  }

  render() {

    const styles = require('./scss/AboutOne.scss');
    // const uri = encodeURI('/product-categories-small.json');
    const uri = encodeURI('/product-categories.json');

    return (

      <div className="container">

        <Helmet title="About One" />

        <h1 className={styles.uniqueColor}>About One!</h1>

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

                    <AxiosComponentLoaderBasic component={FilterableTable} requestURL={uri} />

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
