import { ICategories } from '../../interfaces/OutShop';
import { IProducts } from '../../interfaces/OutShop';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import Meta from '../../components/Meta';
import PostCarousel from '../../components/PostCarousel.tsx';
import Product from '../../components/Product';
import { useGetProductsQuery } from '../../redux/query/apiSlice';
const HomeScreen = () => {
  const { data, isLoading, error } = useGetProductsQuery();
  const [selectedCategory] = useState<ICategories | null>(null);
  // const handleCategoryClick = (categoryId: ICategories) => {
  //   setSelectedCategory(categoryId);
  // };

  return (
    <>
      <PostCarousel />

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
      ) : (
        <>
          <Meta />
          <h1 hidden>{selectedCategory ? `Products in ${selectedCategory}` : 'Latest Products'}</h1>
          <Row>
            {data?.products.map((product: IProducts) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Row></Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;
