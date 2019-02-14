import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import RegisterForm from '../../components/RegisterForm/RegisterForm';


class Register extends Component {

  render() {

    const styles = require('./scss/Register.scss');

    return (

      <div className="container">

        <div className={styles.registerContainer}>

          <Helmet title="Join Election App" />

          <div className="d-flex justify-content-center">

            <div className={styles.register}>

              <div className={`mb-3 ${styles.formTitle}`}>
                <p>
                  Join Election App
                </p>
              </div>

              <div className={styles.formContainer}>

                <RegisterForm onSubmit="" />

              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }
}

export default Register;
