import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';

import { useRegisterMutation } from '../../redux/query/apiSlice';
import { setCredentials } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { IUser } from '@/interfaces/OutShop';
import { displayErrorMessage } from '../../components/Error';
import { LOGIN } from '../../constants/constants';
import { IFormField } from '../../interfaces/InShop';
export interface IRegisterState {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
const RegisterScreen = () => {
  const [state, setState] = useState<IRegisterState>({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state: { auth?: { userInfo: IUser } }) => state.auth) || {};
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const formFields: IFormField[] = [
    {
      controlId: 'userName',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter name',
      value: state.userName,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, userName: e.target.value }),
    },
    {
      controlId: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter Email',
      value: state.email,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, email: e.target.value }),
    },
    {
      controlId: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter Password',
      value: state.password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, password: e.target.value }),
    },
    {
      controlId: 'confirmPassword',
      label: 'Confirm Password',
      placeholder: 'Enter Confirm Password',
      type: 'password',
      value: state.confirmPassword,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, confirmPassword: e.target.value }),
    },
  ];

  const submitHandler = async (registerUser: React.FormEvent<HTMLFormElement>) => {
    registerUser.preventDefault();

    if (state.password !== state.confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await register({ userName: state.userName, email: state.email, password: state.password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        displayErrorMessage(err);
      }
    }
  };

  return (
    <FormContainer>
      <h1>Register</h1>
      <Form onSubmit={submitHandler}>
        {formFields.map((field) => (
          <Form.Group key={field.controlId} className="my-2" controlId={field.controlId}>
            <Form.Label>{field.label}</Form.Label>
            <Form.Control type={field.type} placeholder={`Enter ${field.label}`} value={field.value} onChange={field.onChange} />
          </Form.Group>
        ))}
        <Button disabled={isLoading} type="submit" variant="primary">
          Register
        </Button>
        {isLoading && <Loader />}
      </Form>
      <Row className="py-3">
        <Col>
          Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : LOGIN}>Login</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
