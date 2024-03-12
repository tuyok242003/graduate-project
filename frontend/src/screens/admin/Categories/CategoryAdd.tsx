import React, { useState } from 'react';
import { useCreateCategoryMutation, useGetCategoriesQuery } from '../../../redux/query/categorySlice';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import FormContainer from '../../../components/FormContainer';
import Loader from '../../../components/Loader';
import { ICategories } from '@/interfaces/Category';
import { displayErrorMessage } from '../../../components/Error';
import { CONTACTADD } from '../../../constants';

const CategoryAdd = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { data: categories, isLoading: loadingCategories } = useGetCategoriesQuery();
  const [addCategory, { isLoading: loadingAdd }] = useCreateCategoryMutation();

  const isFormValid = () => {
    if (!name) {
      toast.error('Vui lòng điền đầy đủ thông tin sản phẩm.');
      return false;
    }
   
    return true;
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid()) {
      return;
    }
    try {
      const {} = await addCategory( name as string);
      toast.success('Danh mục đã được thêm.');
      navigate('/admin/categoryList/');
    } catch (err) {
      displayErrorMessage(err);
    }
  };

  return (
    <>
      <Link to={CONTACTADD} className='btn btn-light my-3'>
        Quay lại
      </Link>
      <FormContainer>
        <h1>Thêm Danh mục</h1>
        {loadingAdd && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Tên</Form.Label>
            <Form.Control
              type='text'
              placeholder='Nhập tên'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Button type='submit' variant='primary' style={{ marginTop: '1rem' }}>
            Thêm
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default CategoryAdd;
