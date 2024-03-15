import React from 'react';
import { useGetCategoriesQuery } from '../../redux/query/categorySlice';
import { Button, Table } from 'react-bootstrap';
import Loader from '../Footer'
import Message from '../Message';
import { ICategories } from '@/interfaces/Category';
import { CategoryStyled } from './styled';
interface IOnCategory{
  onCategoryClick:ICategories
}
const Category = ({ onCategoryClick }:IOnCategory) => {
  const { data: categories, isLoading, error } = useGetCategoriesQuery();

  if (isLoading) {
    return <p>Loading categories...</p>;
  }

  if (error) {
    return <p>Error fetching categories. Please try again later.</p>;
  }
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
      <CategoryStyled>
          <>
          <Table striped bordered hover responsive className='table-sm'>
            <tbody>
              {categories?.map((category:ICategories) => (
                <Button
                >
                  {category.name}
                </Button>
              ))}
            </tbody>
          </Table>
        </>
      </CategoryStyled>
      )}
    </>
  );
};

export default Category;
