import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../../components/FormContainer';
import CheckoutSteps from '../../components/CheckoutStep';
import { saveVoucherMethod } from '../../redux/slices/cartSlice';

import { PAYMENT } from '../../constants/constants';
const VoucherScreen = () => {
 
  const navigate = useNavigate();
  const [nameVoucher, setName] = useState('');
const dispatch = useDispatch();
const submitHandler = (voucher: React.FormEvent<HTMLFormElement>) => {
  voucher.preventDefault();
    dispatch(saveVoucherMethod(nameVoucher));
    navigate(PAYMENT);
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2  />
      <h1>Voucher</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='voucher'>
          <Form.Control
            type='text'
            placeholder='Enter voucher'
            value={nameVoucher}    
      
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default VoucherScreen;
