import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveVoucherMethod } from '../redux/slices/cartSlice';
import { PAYMENT } from '../constants';
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
      <CheckoutSteps step1 step2 step3={false} step4={false} step5={false} />
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
