import React, { useEffect } from 'react';
import { useSearchProductsByCategoryQuery } from '../../redux/query/apiSlice';
import { ICategories, IProducts } from '../../interfaces/OutShop';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from '../Rating';
import { ProductList } from './styled';

const ProductListByCategory = ({ selectedCategory }: { selectedCategory: ICategories }) => {
  const {
    data: products,
    isLoading,
    error,
  } = useSearchProductsByCategoryQuery({
    category: selectedCategory,
  });
  useEffect(() => {}, [products, isLoading, error]);
  return (
    <ProductList>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        products && (
          <ul>
            {products.map((product: IProducts) => (
              <Card className="my-3 p-3 rounded">
                <Link to={`/product/${product._id}`}>
                  <Card.Img className="img-product" src={product.image} variant="top" />
                </Link>
                <Card.Body>
                  <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                    <Card.Title as="div" className="product-title">
                      <strong>{product.productName}</strong>
                      {/* <strong>    Giá: {product.price}</strong> */}
                    </Card.Title>
                  </Link>

                  <Card.Text as="div">
                    <Rating valueRating={product.rating} text={`${product.numReviews} reviews`} />
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </ul>
        )
      )}
    </ProductList>
  );
};

export default ProductListByCategory;
