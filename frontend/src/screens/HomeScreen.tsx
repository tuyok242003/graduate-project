import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import {
  useGetProductsQuery,
  useSearchProductsByCategoryQuery,
} from '../redux/query/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message, { IMessageProps } from '../components/Message';
import PostCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { ICategories } from '@/interfaces/Category';
import { IProducts } from '@/interfaces/Products';
const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery();
  const [selectedCategory, setSelectedCategory] = useState<ICategories | null>(
    null
  );
  const { data: categoryData } = useSearchProductsByCategoryQuery({
    category: selectedCategory,
  });
  const handleCategoryClick = (categoryId: ICategories) => {
    setSelectedCategory(categoryId);
  };

  return (
    <>
      {!keyword ? (
        <PostCarousel />
      ) : (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
      ) : (
        <>
          <Meta />
          <h1 hidden>
            {selectedCategory
              ? `Products in ${selectedCategory}`
              : 'Latest Products'}
          </h1>
          {/* <div>
            <Category onCategoryClick={handleCategoryClick} />
            {selectedCategory && (
              <button
                className='btn btn-light mb-4'
                onClick={() => setSelectedCategory(null)}
              >
                Show All
              </button>
            )}
          </div> */}
          <Row>
            {
              data?.products.map((product:IProducts) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))
            }
          </Row>
          <Row></Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;
