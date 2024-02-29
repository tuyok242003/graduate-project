import React, { useState } from 'react';
import { useCreateCategoryMutation } from '../../../slices/categorySlice';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import FormContainer from '../../../components/FormContainer';
import Loader from '../../../components/Loader';

const CategoryAdd = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const [addCategory, { isLoading: loadingAdd }] = useCreateCategoryMutation();
  const isFormValid = () => {
   
    if (!name ) {
      toast.error('Vui lòng điền đầy đủ thông tin sản phẩm.');
      return false}
    return true;
  }
const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  if (!isFormValid()) {
    return;
  } try {
      const {} = await addCategory({
        name,
      }).unwrap();
      toast.success('Category added');
      navigate('/admin/categoryList/');
    } catch (err) {
      const error = err as { data?: { message?: string }; error?: string };
      toast.error(error?.data?.message || error.error);
    }
  };
  return (
    <>
      <Link to='/admin/categoryList' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Add Category</h1>
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

          <Button type='submit' variant='primary' style={{ marginTop: '1rem' }}>
            Add
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default CategoryAdd;
