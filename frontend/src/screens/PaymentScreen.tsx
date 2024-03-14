import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../redux/slices/cartSlice';
import {RootState} from './CartScreen'
import { PLACEORDER, SHIPPING } from '../constants';
const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state: RootState) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate(SHIPPING);        
    }
  }, [navigate, shippingAddress]);
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const dispatch = useDispatch();
  const submitHandler = (payment: React.FormEvent<HTMLFormElement>) => {
    payment.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate(PLACEORDER);
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 step4={false} step5={false} />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
          <Form.Check
  className='my-2'
  type='radio'
  label='PayPal or Credit Card'
  id='PayPal'
  name='paymentMethod'
  value='PayPal'
  checked={paymentMethod === 'PayPal'}
  onChange={(e) => setPaymentMethod(e.target.value)}
/>
<Form.Check
  className='my-2'
  type='radio'
  label='Thanh toán khi nhận hàng'
  id='Receive'
  name='paymentMethod'
  value='Thanh toán khi nhận hàng'
  checked={paymentMethod === 'Thanh toán khi nhận hàng'}
  onChange={(e) => setPaymentMethod(e.target.value)}
/>
          </Col>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
