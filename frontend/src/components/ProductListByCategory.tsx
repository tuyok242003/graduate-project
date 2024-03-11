import React, { useEffect } from 'react';
import { useSearchProductsByCategoryQuery } from '../redux/query/productsApiSlice';
import { ICategories } from '@/interfaces/Category';
import { IProducts } from '@/interfaces/Products';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const ProductListByCategory = ({
  selectedCategory,
}: {
  selectedCategory: ICategories;
}) => {
  const {
    data: products,
    isLoading,
    error,
  } = useSearchProductsByCategoryQuery({
    category: selectedCategory,
    keyword: '',
    pageNumber: 1,
  });

  useEffect(() => {}, [products, isLoading, error]);

  return (
    <div>
      {isLoading && <p>Loading...</p>}

      {products && (
        <ul>
          {products.products.map((product: IProducts) => (
            <Card
              className='my-3 p-3 rounded'
              style={{ height: 400, width: 300 }}
            >
              <Link to={`/product/${product._id}`}>
                <Card.Img
                  style={{ height: 250 }}
                  src={product.image}
                  variant='top'
                />
              </Link>
              <Card.Body>
                <Link
                  to={`/product/${product._id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Card.Title
                    style={{ marginTop: 10 }}
                    as='div'
                    className='product-title'
                  >
                    <strong>{product.productName}</strong>
                    {/* <strong>    Giá: {product.price}</strong> */}
                  </Card.Title>
                </Link>

                <Card.Text as='div'>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                    color='#f8e825'
                  />
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductListByCategory;
