import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useAddContactMutation } from '../../slices/contactSlice';

const ContactAddScreen = () => {
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [content, setContent] = useState('');

  const [addContact, { isLoading: loadingAdd }] = useAddContactMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const contactData = {
        name,
        email,
        phone,
        content,
      };

      // Call the addcontact mutation to add a new contact
      const { data: newContact } = await addContact(contactData).unwrap();

      toast.success('Contact added');
      navigate(`/admin/contact/${newContact._id}/edit`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
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
