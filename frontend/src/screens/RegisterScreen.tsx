import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from "../components/Loader"
import FormContainer from '../components/FormContainer';

import { useRegisterMutation } from '../redux/query/usersApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { IUser } from '@/interfaces/User';
import { displayErrorMessage } from '../components/Error';
import { LOGIN } from '../constants/constants';
export interface IRegisterState{
  userName:string;
  email:string
  password:string
  confirmPassword:string
}
const RegisterScreen = () => {
 
const [state,setState]= useState<IRegisterState>({
userName:'',
email:'',
password:'',
confirmPassword:''
})
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } =
    useSelector((state: { auth?: { userInfo: IUser } }) => state.auth) || {};

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (registerUser: React.FormEvent<HTMLFormElement>) => {
    registerUser.preventDefault();

    if (state.password !== state.confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await register({ userName:state.userName, email:state.email, password:state.password }).unwrap();
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
        <Form.Group className='my-2' controlId='userName'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter userName'
            value={state.userName}
            onChange={(e) => setState({...state,userName:e.target.value})}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={state.email}
            onChange={(e) => setState({...state,email:e.target.value})}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={state.password}
            onChange={(e) => setState({...state,password:e.target.value})}
          ></Form.Control>
        </Form.Group>
        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={state.confirmPassword}
            onChange={(e) => setState({...state,confirmPassword:e.target.value})}
          ></Form.Control>
        </Form.Group>

        <Button disabled={isLoading} type='submit' variant='primary'>
          Register
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className='py-3'>
        <Col>
          Already have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : LOGIN}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
