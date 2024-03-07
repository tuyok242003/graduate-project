import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message, { IMessageProps } from '../../../components/Message';
import Loader from '../../../components/Loader';
import FormContainer from '../../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetVoucherDetailsQuery,
  useUpdateVoucherMutation,

} from '../../../slices/voucherSlice';

const VoucherEditScreen = () => {
  const { id: voucherId } = useParams();

  const [name, setName] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [qty,setQty] = useState('')
  const [isUsed, setIsUsed] = useState(false);
  const {
    data: voucher,
    isLoading,
    refetch,
    error,
  } = useGetVoucherDetailsQuery(voucherId);

  const [updateVoucher, { isLoading: loadingUpdate }] = useUpdateVoucherMutation();

 console.log(voucher);
 
  const navigate = useNavigate();

  const isFormValid = () => {
   
    if (!name || !discountAmount || !expiryDate ) {
      toast.error('Vui lòng điền đầy đủ thông tin Voucher');
      return false;
    }
    return true;
  };
  const submitHandler = async (voucher: React.FormEvent<HTMLFormElement>) => {
    voucher.preventDefault();
    if (!isFormValid()) {
      return;
    }
    try {
      await updateVoucher({
        voucherId,
        name,
        discountAmount,
        expiryDate,
        isUsed 
      }).unwrap();
      toast.success('Voucher updated');
      refetch();
      navigate('/admin/voucherlist');
    } catch (err) {
      const error = err as { data?: { message?: string }; error?: string };

      toast.error(error?.data?.message || error.error);
    }
  };

  useEffect(() => {
    if (voucher) {
      setName(voucher.name);
      setDiscountAmount(voucher.discountAmount);
      setExpiryDate(voucher.expiryDate);
      setIsUsed(voucher.isUsed)
      setQty(voucher.qty)
    }
  }, [voucher]);
  
  return (
    <>
      <Link to='/admin/voucherlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Voucher</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{(error as IMessageProps).children}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='qty'>
              <Form.Label>Số lượng</Form.Label>
              <Form.Control
                type='number'
                placeholder='Số lượng'
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='discountAmount'>
              <Form.Label>Giảm (%)</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter discountAmount'
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='expiryDate'>
              <Form.Label>expiryDate</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter expiryDate'
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='isUsed'>
  <Form.Label>Is Used</Form.Label>
  <div>
    <Form.Check
      type='radio'
      label='True'
      id='true'
      checked={isUsed === true}
      onChange={() => setIsUsed(true)}
    />
    <Form.Check
      type='radio'
      label='False'
      id='false'
      checked={isUsed === false}
      onChange={() => setIsUsed(false)}
    />
  </div>
</Form.Group>


            <Button
              type='submit'
              variant='primary'
              style={{ marginTop: '1rem' }}
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default VoucherEditScreen;
