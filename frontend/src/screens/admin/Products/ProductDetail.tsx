import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Form } from 'react-bootstrap';
import { useGetProductDetailsQuery } from '../../../slices/productsApiSlice';
import Rating from '../../../components/Rating';
import Loader from '../../../components/Loader';
import Message, { MessageProps } from '../../../components/Message';
import Meta from '../../../components/Meta';
import '../../../assets/styles/ProductScreen.css';
import { IReview, IVariant } from '@/interfaces/Products';
import { ICategories } from '@/interfaces/Category';
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
  } = useGetProductDetailsQuery(productId);
  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{(error as MessageProps).children}</Message>
      ) : (
        <>
          <Meta title={product.name} description={product.description} />
          <Row>
            <Col md={6}>
              <Image
                src={state?.selectedVariant ? state.selectedVariant.thumb : product.image}
                alt={product.name}
                fluid
              />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                    color = '#f8e825'
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  <Form.Label> Brand: {product.brand}</Form.Label>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Form.Label>Category: {(product.category as ICategories).name}</Form.Label>
                </ListGroup.Item>
                <ListGroup.Item style={{width:100}}>
                  <strong>Price:</strong> $
                  {state?.selectedVariant ? state.selectedVariant.price : product.price}
                </ListGroup.Item>
                <ListGroup variant='flush'>
                  {product.variants.map((variant: IVariant, index: number) => (
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
                            : product.price}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Col md={6}>
            <h4>Description:{product.description}</h4>
          </Col>

          <Row className='review'>
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant='flush'>
                {product.reviews.map((review: IReview) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating
                      value={review.rating}
                      text={`(${review.rating} stars)`}
                      color = '#f8e825'

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
  );
};

export default ProductDetail;
