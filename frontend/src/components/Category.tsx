import React from 'react';
import { useGetCategoriesQuery } from '../redux/query/categorySlice';
import { Button, Table } from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';
const Category = (onCategoryClick: (arg0: string) => void) => {
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
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <tbody>
              {categories?.map((category) => (
                <Button
                  onClick={() => onCategoryClick(category._id)}
                  style={{ width: 100, marginLeft: 10 }}
                >
                  {category.name}
                </Button>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default Category;
