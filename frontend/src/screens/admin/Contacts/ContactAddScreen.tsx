import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../../components/Loader';
import FormContainer from '../../../components/FormContainer';
import { toast } from 'react-toastify';
import { useAddContactMutation } from '../../../redux/query/contactSlice';
import { displayErrorMessage } from '../../../components/Error';
import { CONTACTLIST } from '../../../constants';
export interface IContactState {
  contactName:string;
  email:string
  phone:string
  content:string
}
const ContactAddScreen = () => {

  const [state,setState] = useState<IContactState>({
    contactName:'',
    email:'',
    phone:'' ,
  content:''
  })
  const [addContact, { isLoading: loadingAdd }] = useAddContactMutation();
  const navigate = useNavigate();
  const isFormValid = () => {
    if (!state.contactName || !state.phone || !state.email || !state.content) {
      toast.error('Vui lòng điền đầy đủ thông tin sản phẩm.');
      return false;
    }
    if (isNaN(Number(state.phone))) {
      toast.error('Số điện thoại phải là số.');
      return false;
    }
    return true;
  };
  const submitHandler = async (category: React.FormEvent<HTMLFormElement>) => {
    category.preventDefault();
    if (!isFormValid()) {
      return;
    }
    try {
      const contactData = {
       contactName: state.contactName,
      email:  state.email,
       phone: state.phone,
       content: state.content,
      };
      const { data: newContact } = await addContact(contactData).unwrap();
      toast.success('Contact added');
      navigate(`/admin/contact/${newContact._id}/edit`);
    } catch (err) {
      displayErrorMessage(err);
    }
  };
  return (
    <>
      <Link to={CONTACTLIST} className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Add Contact</h1>
        {loadingAdd && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter name'
              value={state.contactName}
              onChange={(e) => setState({...state,contactName:e.target.value})}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='email'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter email'
              value={state.email}
              onChange={(e) => setState({...state,email:e.target.value})}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='phone'>
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter phone'
              value={state.phone}
              onChange={(e) => setState({...state,phone:e.target.value})}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='content'>
            <Form.Label>Content</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter description'
              value={state.content}
              onChange={(e) => setState({...state,content:e.target.value})}
            ></Form.Control>
          </Form.Group>
          <Button type='submit' variant='primary' style={{marginTop: '1rem'}}>
            Add
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ContactAddScreen;
