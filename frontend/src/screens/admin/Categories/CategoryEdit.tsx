import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { displayErrorMessage } from '../../../components/Error';
import FormContainer from '../../../components/FormContainer';
import Loader from '../../../components/Footer'
import Message from '../../../components/Message';
import { CONTACTADD } from '../../../constants/constants';
import {
  useGetCategoryDetailsQuery,
  useUpdateCategoryMutation,
} from '../../../redux/query/categorySlice';

import { CategoryAdminStyled } from './styled';

const CategoryEditScreen = () => {
  const { id: categoryId } = useParams();

  const [name, setName] = useState('');

  const {
    data: category,
    isLoading,
    refetch,
    error,
  } = useGetCategoryDetailsQuery(categoryId || '');
  const [updateCategory, { isLoading: loadingUpdate }] =
    useUpdateCategoryMutation();

  const navigate = useNavigate();

  const isFormValid = () => {
   
    if (!name ) {
      toast.error('Vui lòng điền đầy đủ thông tin sản phẩm.');
      return false}
    return true;
  ;}
const submitHandler = async (category: React.FormEvent<HTMLFormElement>) => {
  category.preventDefault()
  if (!isFormValid()) {
    return;
  }
    try {
      await updateCategory({
        categoryId,
        name,
      }).unwrap();
      toast.success('Category updated');
      refetch();
    navigate(CONTACTADD);
    } catch (err) {
      displayErrorMessage(err);
    }
  };

  useEffect(() => {
    if (category) {
      setName(category.name);
    }
  }, [category]);

  return (
  <CategoryAdminStyled>
      <>
<Link to={CONTACTADD} className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Category</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
        ) : (
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

            <Button
            className='button-category'
              type='submit'
              variant='primary'
             
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  </CategoryAdminStyled>
  );
};

export default CategoryEditScreen;
