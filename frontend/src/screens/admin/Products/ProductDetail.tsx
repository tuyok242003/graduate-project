import { useState } from 'react';
import { Card, Col, Form, Image, ListGroup, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import Loader from '../../../components/Footer'
import Message from '../../../components/Message';
import Meta from '../../../components/Meta';
import Rating from '../../../components/Rating';
import { useGetProductDetailsQuery } from '../../../redux/query/productsApiSlice';

import { IReview, IVariant } from '@/interfaces/Products';
import { ProductScreenStyled } from '../../../screens/Product/styled';


interface IState {
  selectedVariant:IVariant | null,
  activeVariantId:string | null
}
const ProductDetail = () => {
  const { id: productId } = useParams();
  const [state, setState] = useState<IState | null>(null)
  const handleVariantClick = (variant: IVariant) => {
     setState({...state,selectedVariant:variant,activeVariantId:variant.id})
  };
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId  || '');
  return (
    <ProductScreenStyled>
      <>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
      ) : (
        <>
          <Meta title={product?.productName} description={product?.description} />
          <Row>
            <Col md={6}>
              <Image
                src={state?.selectedVariant ? state.selectedVariant.thumb : product?.image}
                alt={product?.productName}
                fluid
              />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product?.productName}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    text={`${product?.numReviews} reviews`}
                  
                    valueRating={0}
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  <Form.Label> Brand: {product?.brand}</Form.Label>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Form.Label>Category: {product?.category.name}</Form.Label>
                </ListGroup.Item>
                <ListGroup.Item >
                  <strong>Price:</strong> $
                  {state?.selectedVariant ? state.selectedVariant.price : product?.price}
                </ListGroup.Item>
                <ListGroup variant='flush'>
                  {product?.variants.map((variant: IVariant, index: number) => (
                    <ListGroup.Item
                      key={index}
                      onClick={() => handleVariantClick(variant)}
                      style={{ cursor: 'pointer' }}
                      className={`variant-item ${
                        state?.activeVariantId === variant.id ? 'active-variant' : ''
                      }`}
                    >
                      <span className='color-name'>{variant.color}</span>
                     
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>
                          $
                          {state?.selectedVariant
                            ? state.selectedVariant.price
                            : product?.price}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Col md={6}>
            <h4>Description:{product?.description}</h4>
          </Col>
          <Row className='review'>
            <Col md={6}>
              <h2>Reviews</h2>
              {product?.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant='flush'>
                {product?.reviews.map((review: IReview) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating
                      valueRating={review.rating}
                      text={`(${review.rating} stars)`}
                  

                    />
                    <p>{review.createdAt?.toString().substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
    </ProductScreenStyled>
  );
};

export default ProductDetail;
