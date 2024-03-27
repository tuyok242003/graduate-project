import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Loader from '../../components/Loader';
import Meta from '../../components/Meta';
import PostCarousel from '../../components/PostCarousel.tsx';
import Product from '../../components/Product';
import { ICategories, IProducts } from '../../interfaces/OutShop';
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

      <Loader loading={isLoading} error={!!error} />
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
    </>
  );
};

export default HomeScreen;
