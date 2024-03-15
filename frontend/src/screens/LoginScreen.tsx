import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer';
import { useLoginMutation } from '../redux/query/usersApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import { IUser } from '@/interfaces/User';
import { displayErrorMessage } from '../components/Error';
import { FORGOTPASSWORD, REGISTER } from '../constants/constants';
interface ILoginState{
  email:string
  password:string
}
const LoginScreen = () => {
  const [state,setState] = useState<ILoginState>({
    email:'',
    password:''
  })
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
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
  const submitHandler = async (loginUser: React.FormEvent<HTMLFormElement>) => {
    loginUser.preventDefault();
    try {
      const res = await login({ email:state.email, password:state.password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      displayErrorMessage(err);
    }
  };
  return (
    <FormContainer>
      <h1>Sign In</h1>
      <Form onSubmit={submitHandler}>
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
        <Button disabled={isLoading} type='submit' variant='primary'>
          Sign In
        </Button>
        {isLoading && <Loader />}
      </Form>
      <Row className='py-3'>
        <Link
          to={
            redirect
              ? `/forgotPassword?redirect=${redirect}`
              : FORGOTPASSWORD
          }
        >
          ForgotPassword
        </Link>
      </Row>
      <Row className='py-3'>
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : REGISTER}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
