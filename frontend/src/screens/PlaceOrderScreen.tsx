import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import {RootState} from './CartScreen'
import {  IOrderItem } from '@/interfaces/Order';
const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state:RootState) => state.cart);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  
 

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
   
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);
  useEffect(() => {

  }, [cart.cartItems]);
  const dispatch = useDispatch();
  const placeOrderHandler = async () => {
    try {
   
      const res = await createOrder({
        orderItems: data,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
      voucherName:cart.voucherName
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error('Voucher đã được sử dụng hoặc hết hạn');
    }
  };
  const orderItem = localStorage.getItem("selectedItems");

  const data = cart.cartItems.filter(item => {
   return orderItem?.includes(item._id); 
  });
  const totalOrder = cart.shippingPrice + data.reduce((totalPrice, item) => totalPrice + (item.qty * (item.variant ? item.variant.price : item.price)), 0);
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 step5/>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Địa chỉ:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Voucher</h2>
             
              {cart.voucherName && (cart.voucherName.name)}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Thanh toán theo:</h2>
              <strong> </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
  <h2>Order Items</h2>
  <Row>
    <Col md={2}><strong>Ảnh</strong></Col>
    <Col md={3}><strong>Sản phẩm</strong></Col>
    <Col md={2}><strong>Giá</strong></Col>
    <Col md={1} style={{width:100}}><strong>Số lượng</strong></Col>
    <Col md={2}><strong>Tổng tiền</strong></Col>
  </Row>
  {cart.cartItems.length === 0 ? (
    <Message>Your cart is empty</Message>
  ) : (
    <ListGroup variant="flush">
      {data.map((item: IOrderItem, index: number) => (
        <ListGroup.Item key={index}>
          <Row>
            <Col style={{marginRight:20}} md={2}>
              <Image  src={item.images} alt={item.color} fluid rounded />
            </Col>
            <Col md={3}>
              <Link style={{ textDecoration: 'none' }} to={`/product/${item.productId}`}>
                {item.color}
              </Link>
            </Col>
            <Col md={2}>
              {item.variant ? (
                <>
                  <p><strong>Color:</strong> {item.variant.color}</p>
                  <p><strong>Price:</strong> ${item.variant.price}</p>
                </>
              ) : item.price ? (
                <p>${item.price.toFixed(2)}</p>
              ) : (
                <p>Price not available</p>
              )}
            </Col>
            <Col md={1}>
              <p >{item.qty}</p>
            </Col>
            <Col md={2} style={{marginLeft:40}}>
              <p>${(item.qty * (item.variant ? item.variant.price : item.price)).toFixed(2)}</p>
            </Col>
          </Row>
        </ListGroup.Item>
      ))}
      <ListGroup.Item>
        <Row>
          <Col md={8}></Col>
          <Col md={2}><strong>Total</strong></Col>
          <Col md={2}><strong>${data.reduce((totalPrice, item) => totalPrice + (item.qty * (item.variant ? item.variant.price : item.price)), 0).toFixed(2)}</strong></Col>
        </Row>
      </ListGroup.Item>
    </ListGroup>
  )}
</ListGroup.Item>

                                                                         

          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${data.reduce((totalPrice, item) => totalPrice + (item.qty * (item.variant ? item.variant.price : item.price)), 0).toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
            
                                                       
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${totalOrder}</Col>
                </Row>
              </ListGroup.Item>
              
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                 
                >
                  Place Order
                </Button>
                {isLoading && (<Loader />)}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;