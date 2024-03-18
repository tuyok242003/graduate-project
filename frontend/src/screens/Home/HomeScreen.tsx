import { ICategories } from '@/interfaces/Category';
import { IProducts } from '@/interfaces/Products';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loader from '../../components/Footer'
import Message from '../../components/Message';
import Meta from '../../components/Meta';
import PostCarousel from '../../components/PostCarousel.tsx';
import Product from '../../components/Product';
import {
  useGetProductsQuery,
  useSearchProductsByCategoryQuery,
} from '../../redux/query/productsApiSlice';
const HomeScreen = () => {
 
  const { data, isLoading, error } = useGetProductsQuery();
  const [selectedCategory] = useState<ICategories | null>(
    null
  );
  const reponse = useSearchProductsByCategoryQuery({
    category: selectedCategory,
  });
  // const handleCategoryClick = (categoryId: ICategories) => {
  //   setSelectedCategory(categoryId);
  // };

  return (
    <>
     
        <PostCarousel />
    
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
 
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
