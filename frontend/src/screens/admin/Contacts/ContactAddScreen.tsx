import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../../components/Footer';
import FormContainer from '../../../components/FormContainer';
import { toast } from 'react-toastify';
import { useAddContactMutation } from '../../../redux/query/apiSlice';
import { displayErrorMessage } from '../../../components/Error';
import { CONTACTLIST } from '../../../constants/constants';
import { ContactAdminStyle } from './styled';
import { IFormField } from '../../../interfaces/InShop';
export interface IContactState {
  contactName: string;
  email: string;
  phone: string;
  content: string;
}

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
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, contactName: e.target.value }),
    },
    {
      controlId: 'email',
      label: 'Email',
      type: 'text',
      placeholder: 'Enter email',
      value: state.email,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, email: e.target.value }),
    },
    {
      controlId: 'phone',
      label: 'Phone',
      type: 'text',
      placeholder: 'Enter phone',
      value: state.phone,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, phone: e.target.value }),
    },
    {
      controlId: 'content',
      label: 'Content',
      type: 'text',
      placeholder: 'Enter description',
      value: state.content,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, content: e.target.value }),
    },
  ];

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
        email: state.email,
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
                <Form.Control type={field.type} placeholder={field.placeholder} value={field.value} onChange={field.onChange} />
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
