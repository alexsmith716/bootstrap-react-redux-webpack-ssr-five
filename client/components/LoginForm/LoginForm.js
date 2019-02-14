import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import loginValidation from './loginValidation';


const Input = ({input, label, type, meta: { touched, error, submitError }, ...rest}) => (

  <div className={`form-group ${(error || submitError) && touched ? 'has-error' : ''}`}>

    {label === 'Username or email address' && (

      <label htmlFor={input.name} className="font-weight-600">{label}</label>
    )}

    {label === 'Password' && (

      <div className="d-flex justify-content-between">

        <label htmlFor={input.name} className="font-weight-600">{label}</label>

        <div>
          <a className="font-size-smaller-90" href="#">Forgot password?</a>
        </div>

      </div>
    )}

    <div className={input}>

      <input {...input} {...rest} type={type} className="form-control" />

      {(error || submitError) && touched && <span className="form-control-feedback" />}

      {(error || submitError) &&
        touched && (
        <div className="text-danger">
          <strong>{error || submitError}</strong>
        </div>
      )}
    </div>
  </div>

);

Input.propTypes = {
  input: PropTypes.objectOf(PropTypes.any),
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  meta: PropTypes.objectOf(PropTypes.any)
};


const LoginForm = ({ onSubmit }) => (

  <Form

    onSubmit={values => onSubmit(values).then(() => {}, err => err)}

    render = { () => (

      <form>

        <div className="form-group">
          <Field name="email" type="text" component={Input} label="Username or email address" />
        </div>

        <div className="form-group">
          <Field name="password" type="password" component={Input} label="Password" />
        </div>

        <div className="d-flex justify-content-center mt-4">
          <a className="btn btn-success btn-width-one-half" href="#">Sign in</a>
        </div>

      </form>

    )}
  />
);

export default LoginForm;
