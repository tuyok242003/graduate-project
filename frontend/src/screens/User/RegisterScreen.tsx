import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../../components/FormContainer';
import { useRegisterMutation } from '../../redux/query/apiSlice';
import { selectUserInfo, setCredentials } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { displayErrorMessage } from '../../components/Error';
import { HOME, LOGIN } from '../../constants/constants';
import { IFormField } from '../../interfaces/InShop';
import { IRegisterState } from '../../interfaces/OutShop';

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
  const userInfo = useSelector(selectUserInfo);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || HOME;

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
    },
    {
      controlId: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'Enter Email',
      value: state.email,
    },
    {
      controlId: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter Password',
      value: state.password,
    },
    {
      controlId: 'confirmPassword',
      label: 'Confirm Password',
      placeholder: 'Enter Confirm Password',
      type: 'password',
      value: state.confirmPassword,
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
  const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [key]: e.target.value });
  };
  return (
    <FormContainer>
      <h1>Register</h1>
      <Form onSubmit={submitHandler}>
        {formFields.map((field) => (
          <Form.Group key={field.controlId} className="my-2" controlId={field.controlId}>
            <Form.Label>{field.label}</Form.Label>
            <Form.Control
              type={field.type}
              placeholder={`Enter ${field.label}`}
              value={field.value}
              onChange={handleChange(field.controlId)}
            />
          </Form.Group>
        ))}
        <Button disabled={isLoading} type="submit" variant="primary">
          Register
        </Button>
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
