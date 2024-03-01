import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../../components/Loader';
import FormContainer from '../../../components/FormContainer';
import { toast } from 'react-toastify';
import { useAddContactMutation } from '../../../slices/contactSlice';

const ContactAddScreen = () => {
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [content, setContent] = useState('');

  const [addContact, { isLoading: loadingAdd }] = useAddContactMutation();

  const navigate = useNavigate();
  const isFormValid = () => {
   
    if (!name || !phone || !email || !content) {
      toast.error('Vui lòng điền đầy đủ thông tin sản phẩm.');
      return false;
    }
  
    
    if (isNaN(Number(phone))) {
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
        name,
        email,
        phone,
        content,
      };

      const { data: newContact } = await addContact(contactData).unwrap();

      toast.success('Contact added');
      navigate(`/admin/contact/${newContact._id}/edit`);
    } catch (err) {
      const error = err as { data?: { message?: string }; error?: string };

      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <Link to='/admin/contactList' className='btn btn-light my-3'>
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='email'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='phone'>
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter phone'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='content'>
            <Form.Label>Content</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter description'
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' style={{ marginTop: '1rem' }}>
            Add
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ContactAddScreen;
