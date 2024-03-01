import React, { useState } from 'react';
import { useAddContactMutation } from '../slices/contactSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import { Button, Form } from 'react-bootstrap';
import Loader from '../components/Loader';

const ContactScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [content, setContent] = useState('');

  const [addContact, { isLoading: loadingAdd }] = useAddContactMutation();
  const navigate = useNavigate();
  const handleAddContact = async (contact: React.FormEvent<HTMLFormElement>) => {
    contact.preventDefault();
    try {
      // Gọi hàm mutate để thêm liên hệ mới
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
                  placeholder='Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId='phone'>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Phone'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId='content'>
                <Form.Label>Content</Form.Label>
                <Form.Control
                  style={{ height: 100 }}
                  type='text'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
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
