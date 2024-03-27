import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { displayErrorMessage } from '../../../components/Error';
import FormContainer from '../../../components/FormContainer';
import Loader from '../../../components/Loader';

import { CATEGORYLIST, CONTACTADD } from '../../../constants/constants';
import { useGetCategoryDetailsQuery, useUpdateCategoryMutation } from '../../../redux/query/apiSlice';
import { CategoryAdminStyled } from './styled';
import { ValidateForm } from '../../../hepler';
const CategoryEditScreen = () => {
  const { id: categoryId } = useParams();
  const [name, setName] = useState('');
  const { data: category, isLoading, error } = useGetCategoryDetailsQuery(categoryId || '');
  const [updateCategory] = useUpdateCategoryMutation();
  const navigate = useNavigate();

  const submitHandler = async (category: React.FormEvent<HTMLFormElement>) => {
    category.preventDefault();
    if (!ValidateForm(name)) {
      return;
    }
    try {
      await updateCategory({
        categoryId,
        name,
      }).unwrap();
      toast.success('Category updated');
      navigate(CATEGORYLIST);
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
        <Link to={CONTACTADD} className="btn btn-light my-3">
          Go Back
        </Link>
        <FormContainer>
          <h1>Edit Category</h1>

          <Loader loading={isLoading} error={!!error} />

          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button className="button-category" type="submit" variant="primary">
              Update
            </Button>
          </Form>
        </FormContainer>
      </>
    </CategoryAdminStyled>
  );
};

export default CategoryEditScreen;
