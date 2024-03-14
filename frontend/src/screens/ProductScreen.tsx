import { useState,useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from '../redux/query/productsApiSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message, { IMessageProps } from '../components/Message';
import Meta from '../components/Meta';
import { addToCart } from '../redux/slices/cartSlice';
import { IReview, IVariant } from '@/interfaces/Products';
import { displayErrorMessage } from '../components/Error';
import { ActiveVariantItem } from '@/assets/styles/ProductScreen';
import { CART } from '../constants';
const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedVariantQty, setSelectedVariantQty] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<IVariant | null>(null);

  const addToCartHandler = () => {
    if (
      selectedVariantQty > 0 &&
      selectedVariant &&
    
      selectedVariant !== null
    ) {
      const variantToAdd = {
        ...selectedVariant,
        qty: selectedVariantQty,
      };
      dispatch(addToCart(variantToAdd));
      toast.success('Product added to cart successfully');
    } else {
      toast.error('Please select a variant and choose a valid quantity');
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const buyNowHandler = () => {
    if (
      selectedVariant &&
      typeof selectedVariant === 'object' &&
      selectedVariant !== null
    ) {
      dispatch(addToCart({ ...selectedVariant, qty: selectedVariantQty }));
      toast.success('Product added to cart successfully');
      navigate(CART);
    } else {
      toast.error('Please select a variant');
    }
  };

  const handleVariantClick = (variant: IVariant) => {
    setSelectedVariant(variant);
    setSelectedVariantQty(variant.countInStock > 0 ? 1 : 0);
  };
  const decreaseQty = () => {
    if (
      selectedVariantQty < (selectedVariant ? selectedVariant.countInStock : 1)
    ) {
      setSelectedVariantQty(selectedVariantQty - 1);
    }
  };
  const increaseQty = () => {
    if (
      selectedVariantQty < (selectedVariant ? selectedVariant.countInStock : 1)
    ) {
      setSelectedVariantQty(selectedVariantQty + 1);
    }
  };
  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId as string);

  const { userInfo } =
    useSelector((state: { auth?: { userInfo: IReview } }) => state.auth) || {};

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (productHandler: React.FormEvent<HTMLFormElement>) => {
    productHandler.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment
      }).unwrap();
      refetch();
      toast.success('Review created successfully');
    } catch (err) {
      displayErrorMessage(err);
    }
  };

  return (
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
                style={{ width: 400, height: 450 }}
                src={selectedVariant ? selectedVariant.thumb : product?.image}
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
                {selectedVariant && selectedVariant?.discount > 0 && (
  <ListGroup.Item className="sale-highlight">
    <strong>Sale: </strong>
    {selectedVariant?.discount}%
  </ListGroup.Item>
)}
                <ListGroup.Item>
                  <strong>Đã bán: </strong>
                  {selectedVariant
                    ? selectedVariant.quantitySold
                    : product?.quantitySold}
                </ListGroup.Item>
                <Row>
  {product?.variants.map((variant: IVariant, index: number) => (
    <Col md={4} key={index}>
      <ListGroup variant='flush'>
        <ListGroup.Item
          onClick={() => handleVariantClick(variant)}
          style={{ cursor: 'pointer' }}
          className={`variant-item ${
            selectedVariant &&
            'id' in variant &&
            selectedVariant.id === variant.id
              ? 'active-variant'
              : ''
          }`}
        >
          {variant.color}
        </ListGroup.Item>
      </ListGroup>
    </Col>
  ))}
</Row>

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
                          {selectedVariant
                            ? selectedVariant.price
                            : product?.price}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {selectedVariant && selectedVariant.countInStock > 0
                          ? 'In Stock'
                          : 'Out Of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item style={{ marginLeft: 70 }}>
                    <strong style={{ paddingRight: 10, marginBottom: 40 }}>
                      Số lượng:{' '}
                    </strong>
                    {selectedVariant
                      ? selectedVariant.countInStock
                      : product?.countInStock}
                    <Col>
                      <Button
                        style={{ marginRight: 10 }}
                        variant='outline-secondary'
                        className='qty-btn'
                        onClick={decreaseQty}
                        disabled={selectedVariantQty <= 1}
                      >
                        -
                      </Button>
                      <span className='qty-value'>{selectedVariantQty}</span>
                      <Button
                        style={{ marginLeft: 10 }}
                        variant='outline-secondary'
                        className='qty-btn'
                        onClick={increaseQty}
                       
                      >
                        +
                      </Button>
                    </Col>
                  </ListGroup.Item>
                  {/* Qty Select */}

                  <ListGroup.Item>
                    <Button
                      style={{ border: 'none' }}
                      className='btn-block'
                      type='button'
                      disabled={
                        !selectedVariant ||
                    
                        selectedVariant.countInStock === 0
                      }
                      onClick={addToCartHandler}
                    >
                      Add To Cart
                    </Button>
                    <Button
                      style={{
                        marginLeft: 15,
                        background: 'green',
                        border: 'none',
                      }}
                      className='btn-block'
                      type='button'
                      disabled={
                        !selectedVariant ||
                        product?.countInStock === 0 ||
                        selectedVariant.countInStock === 0
                      }
                      onClick={buyNowHandler}
                    >
                      Buy Now
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Col md={6}>
            <h4>Mô tả:</h4>
            <p>{product?.description}</p>
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

                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>

                  {loadingProductReview && <Loader />}

                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group className='my-2' controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          required
                          value={rating.toString()}
                          onChange={(e) =>
                            setRating(parseInt(e.target.value, 10))
                          }
                        >
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className='my-2' controlId='comment'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          required
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingProductReview}
                        type='submit'
                        variant='primary'
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                     Vui lòng đăng nhập
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
