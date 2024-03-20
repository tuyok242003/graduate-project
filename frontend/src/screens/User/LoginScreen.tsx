import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { displayErrorMessage } from '../../components/Error';
import FormContainer from '../../components/FormContainer';
import Loader from '../../components/Loader';
import { FORGOTPASSWORD, HOME, REGISTER } from '../../constants/constants';
import { useLoginMutation } from '../../redux/query/apiSlice';
import { selectUserInfo, setCredentials } from '../../redux/slices/authSlice';
import { IFormField } from '@/interfaces/InShop';
import { UserScreenStyled } from './styled';
interface ILoginState {
  email: string;
  password: string;
}
const LoginScreen = () => {
  const [state, setState] = useState<ILoginState>({
    email: '',
    password: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const userInfo = useSelector(selectUserInfo);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || HOME;
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  const submitHandler = async (loginUser: React.FormEvent<HTMLFormElement>) => {
    loginUser.preventDefault();
    try {
      const res = await login({ email: state.email, password: state.password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      displayErrorMessage(err);
    }
  };
  const FormFiled: IFormField[] = [
    {
      controlId: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter email',
      value: state.email,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, email: e.target.value }),
    },
    {
      controlId: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter password',
      value: state.password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, password: e.target.value }),
    },
  ];
  return (
    <UserScreenStyled>
      <FormContainer>
        <h1>Sign In</h1>
        <Form onSubmit={submitHandler}>
          {FormFiled.map((field) => (
            <Form.Group controlId={field.controlId} key={field.controlId}>
              <Form.Label>{field.label}</Form.Label>
              <Form.Control type={field.type} placeholder={field.placeholder} value={field.value} onChange={field.onChange} />
            </Form.Group>
          ))}
          <Button className="btn-sm" disabled={isLoading} type="submit" variant="primary">
            Sign In
          </Button>
          {isLoading && <Loader />}
        </Form>
        <Row className="py-3">
          <Link to={redirect ? `/forgotPassword?redirect=${redirect}` : FORGOTPASSWORD}>ForgotPassword</Link>
        </Row>
        <Row className="py-3">
          <Col>
            New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : REGISTER}>Register</Link>
          </Col>
        </Row>
      </FormContainer>
    </UserScreenStyled>
  );
};

export default LoginScreen;
