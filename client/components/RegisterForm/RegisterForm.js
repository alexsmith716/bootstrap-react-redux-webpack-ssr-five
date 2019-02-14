import React from 'react';
import { Form, Field } from 'react-final-form';
import PropTypes from 'prop-types';


const Input = ({input, label, type, meta: { touched, error, submitError }, ...rest}) => (

  <div className={`form-group ${(error || submitError) && touched ? 'has-error' : ''}`}>

    <label htmlFor={input.name} className="font-weight-600">{label}</label>

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
  input: PropTypes.objectOf(PropTypes.any).isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  meta: PropTypes.objectOf(PropTypes.any).isRequired
};


const RegisterForm = ({ onSubmit }) => (

  <Form

    onSubmit={values => onSubmit(values).then(() => {}, err => err)}

    render = { () => (

      <form>

        <div className="form-group">
          <Field name="username" type="text" component={Input} label="Username" />
        </div>

        <div className="form-group">
          <Field name="email" type="text" component={Input} label="Email Address" />
        </div>

        <div className="form-group">
          <Field name="password" type="password" component={Input} label="Password" />
        </div>

        <div className="form-group">
          <Field name="password_confirmation" type="password" component={Input} label="Password confirmation" />
        </div>

        <div className="d-flex justify-content-center mt-4">
          <a className="btn btn-success btn-width-one-third" href="#">Register</a>
        </div>

      </form>

    )}
  />
);

export default RegisterForm;
