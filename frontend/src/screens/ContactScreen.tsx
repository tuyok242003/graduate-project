import React, { useState } from 'react';
import { useAddContactMutation } from '../redux/query/contactSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import { Button, Form } from 'react-bootstrap';
import Loader from '../components/Footer'
import { displayErrorMessage } from '../components/Error';
import { IContactState } from './admin/Contacts/ContactAddScreen';
const ContactScreen = () => {
  const [state,setState] = useState<IContactState>({
    contactName:'',
    email:'',
    phone:'' ,
  content:''
  })
  const [addContact, { isLoading: loadingAdd }] = useAddContactMutation();
  const navigate = useNavigate();
  const handleAddContact = async (contact: React.FormEvent<HTMLFormElement>) => {
    contact.preventDefault();
    try {
      // Gọi hàm mutate để thêm liên hệ mới
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
    <div className='container mt-5'>
      <h2 className='font-weight-bold text-danger'>Liên hệ</h2>

      <div className='row'>
        <div className='col-md-6'>
          <FormContainer>
            {loadingAdd && <Loader />}
            <Form
              style={{ width: 400, paddingRight: 50 }}
              onSubmit={handleAddContact}
            >
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
              <Button
                type='submit'
                variant='primary'
                style={{ marginTop: '1rem', marginLeft: 20 }}
              >
                Gửi
              </Button>
            </Form>
          </FormContainer>
        </div>

        <div className='col-md-6'>
          <div className='mb-3'>
            <h4>Liên hệ với chúng tôi qua:</h4>
            <p>
              <b>Email:</b> hieudtph27992@gmail.com
            </p>
            <p>
              <b>Phone:</b> +84 382387055
            </p>
          </div>

          <div className='width: 100%;'>
            <iframe
              width='90%'
              height='320'
              className='border:0'
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.835352125567!2d105.72923707400938!3d21.039272987419803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345550b525aa03%3A0x3fdefc40f69a023a!2zQ2FvIMSR4bqzbmcgRlBUIFBo4buRIFRy4buLbmggVsSDbiBCw7QgLCBQaMaw4budbmcgUGjGsMahbmcgQ2FuaCAsIHF14bqtbiBU4burIExpw6pt!5e0!3m2!1svi!2s!4v1703865598841!5m2!1svi!2s'
              title='Bản đồ Trường Cao đẳng FPT, Hà Nội'
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactScreen;
