import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../redux/slices/cartSlice';
import { RootState } from './CartScreen';
import { toast } from 'react-toastify';
import { VOUCHER } from '../constants';
interface IShippingState {
  address:string;
  city:string
  postalCode:string;
  country:string
}
const ShippingScreen = () => {
  const [state,setState] = useState<IShippingState>({
    address: '',
    city: '',
    postalCode:  '',
    country: ''
  })
  const isFormValid = () => {
   
    if (!state.address || !state.city || !state.postalCode || !state.country) {
      toast.error('Vui lòng điền đầy đủ thông tin địa chỉ.');
      return false;
    }
  
    
    if (isNaN(Number(state.postalCode))) {
      toast.error('Giá sản phẩm phải là số.');
      return false;
    }
    
    return true;
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (shipping: React.FormEvent<HTMLFormElement>) => {
    shipping.preventDefault();
    if (!isFormValid()) {
      return;
    }
    dispatch(saveShippingAddress({ address:state.address,city: state.city, postalCode:state.postalCode, country:state.country }));
    navigate(VOUCHER);
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3={false} step4={false} step5={false} />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter address'
            value={state.address}
      
            onChange={(e) => setState({...state,address:e.target.value})}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='city'>
          <Form.Label>City</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter city'
            value={state.city}
       
            onChange={(e) => setState({...state,city:e.target.value})}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='postalCode'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter postal code'
            value={state.postalCode}
            onChange={(e) => setState({...state,postalCode:e.target.value})}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='country'>
          <Form.Label>Country</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter country'
            value={state.country}
           
           
            onChange={(e) => setState({...state,country:e.target.value})}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
