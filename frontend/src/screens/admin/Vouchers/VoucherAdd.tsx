import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../../components/Loader';
import FormContainer from '../../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useCreateVoucherMutation,
  useGetVouchersQuery
} from '../../../redux/query/voucherSlice';
import { IVouchers } from '@/interfaces/Voucher';
import { displayErrorMessage } from '../../../components/Error';

const VoucherAddScreen = () => {
  const [name, setName] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const { data: allVouchers, isLoading: loadingVouchers } = useGetVouchersQuery();
  const [expiryDate, setExpiryDate] = useState('');
  const [isUsed, setIsUsed] = useState(false);
const [qty,setQty] = useState('');
  const [addVoucher, { isLoading: loadingAdd }] = useCreateVoucherMutation();
 const [quantitySold,setQuantitySold] = useState('')

  const navigate = useNavigate();

  const isFormValid = () => {
   
    if (!name || !expiryDate || !discountAmount || !qty || !quantitySold ) {
      toast.error('Vui lòng điền đầy đủ thông tin sản phẩm.');
      return false;
    }
    const selectedDate = new Date(expiryDate);
    const currentDate = new Date();
    if (selectedDate <= currentDate) {
      toast.error('Vui lòng chọn ngày hết hạn trong tương lai.');
      return false;
    }
    
    if (isNaN(Number(discountAmount || qty))) {
      toast.error('Giảm phải là số');
      return false;
    }
    if (allVouchers?.some((voucher:IVouchers) => voucher.name === name)) {
      toast.error('Tên voucher đã tồn tại.');
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
      const voucherData = {
        name,
        discountAmount,
        expiryDate,
        isUsed,
        qty,
        quantitySold
      };
      const reponse = await addVoucher(voucherData).unwrap();
      toast.success('Voucher added');
      navigate(`/admin/voucherList`);
    } catch (err) {
      displayErrorMessage(err);
    }
  };
 

  return (
    <>
      <Link to='/vouchers' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Add Voucher</h1>
        {loadingAdd && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='expiryDate'>
            <Form.Label>expiryDate</Form.Label>
            <Form.Control
              type='date'
              placeholder='Enter description'
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='isUsed' >
            <Form.Label>isUsed</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter description'
              value={isUsed.toString()}
              onChange={(e) => setIsUsed(e.target.value === 'true')}
            ></Form.Control>
          </Form.Group>

         

          <Form.Group controlId='discountAmount'>
            <Form.Label>Giảm (%)</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter description'
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='qty' >
            <Form.Label>Số lượng</Form.Label>
            <Form.Control
              type='text'
              placeholder='Số lượng'
              value={qty.toString()}
              onChange={(e) => setQty(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='quantitySold' >
            <Form.Label>Đã sử dụng</Form.Label>
            <Form.Control
              type='text'
              placeholder='Đã sử dụng'
              value={quantitySold.toString()}
              onChange={(e) => setQuantitySold(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type='submit' variant='primary' style={{ marginTop: '1rem' }}>
            Add
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default VoucherAddScreen;
