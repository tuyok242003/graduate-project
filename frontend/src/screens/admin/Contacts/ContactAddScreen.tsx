/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../../components/Loader';
import FormContainer from '../../../components/FormContainer';
import { toast } from 'react-toastify';
import { useAddContactMutation } from '../../../redux/query/apiSlice';
import { displayErrorMessage } from '../../../components/Error';
import { CONTACTLIST } from '../../../constants/constants';
import { ContactAdminStyle } from './styled';
import { IFormField } from '../../../interfaces/InShop';
import { IContactState } from '../../../interfaces/OutShop';

const ContactAddScreen = () => {
  const [state, setState] = useState<IContactState>({
    contactName: '',
    email: '',
    phone: '',
    content: '',
  });
  const [addContact, { isLoading: loadingAdd }] = useAddContactMutation();
  const navigate = useNavigate();

  const formFields: IFormField[] = [
    {
      controlId: 'contactName',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter name',
      value: state.contactName,
    },
    {
      controlId: 'email',
      label: 'Email',
      type: 'text',
      placeholder: 'Enter email',
      value: state.email,
    },
    {
      controlId: 'phone',
      label: 'Phone',
      type: 'text',
      placeholder: 'Enter phone',
      value: state.phone,
    },
    {
      controlId: 'content',
      label: 'Content',
      type: 'text',
      placeholder: 'Enter description',
      value: state.content,
    },
  ];
  const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [key]: e.target.value });
  };
  const ValidateForm = () => {
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
    if (!ValidateForm()) {
      return;
    }
    try {
      const contactData = {
        contactName: state.contactName,
        email: state.email,
        phone: state.phone,
        content: state.content,
      };
      const { data: newContact } = await addContact(contactData).unwrap();
      toast.success('Contact added');
      navigate(CONTACTLIST);
    } catch (err) {
      displayErrorMessage(err);
    }
  };

  return (
    <ContactAdminStyle>
      <>
        <Link to={CONTACTLIST} className="btn btn-light my-3">
          Go Back
        </Link>
        <FormContainer>
          <h1>Add Contact</h1>
          {loadingAdd && <Loader />}
          <Form onSubmit={submitHandler}>
            {formFields.map((field) => (
              <Form.Group controlId={field.controlId} key={field.controlId}>
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                  type={field.type}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={handleChange(field.controlId)}
                />
              </Form.Group>
            ))}
            <Button type="submit" variant="primary" className="button-contact">
              Add
            </Button>
          </Form>
        </FormContainer>
      </>
    </ContactAdminStyle>
  );
};

export default ContactAddScreen;
