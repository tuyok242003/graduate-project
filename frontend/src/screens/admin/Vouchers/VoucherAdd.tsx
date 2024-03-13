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
import { IVoucherState } from './VoucherEdit';
const VoucherAddScreen = () => {
  const [state,setState] = useState<IVoucherState>({
    voucherName:'',
    discountAmount:'',
    qty:'',
    isUsed:false,
  })
  const { data: allVouchers, isLoading: loadingVouchers } = useGetVouchersQuery();
  const [addVoucher, { isLoading: loadingAdd }] = useCreateVoucherMutation();
 
  const navigate = useNavigate();
  const isFormValid = () => { 
    if (!state.voucherName  || !state.discountAmount || !state.qty  ) {
      toast.error('Vui lòng điền đầy đủ thông tin sản phẩm.');
      return false;
    }
    if (isNaN(Number(state.discountAmount || state.qty))) {
      toast.error('Giảm phải là số');
      return false;
    }
    if (allVouchers?.some((voucher:IVouchers) => voucher.voucherName === state.voucherName)) {
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
        voucherName:state.voucherName,
        discountAmount:state.discountAmount,    
        isUsed:state.isUsed,
        qty:state.qty,
       
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
              value={state.voucherName}
                onChange={(e) => setState({...state,voucherName:e.target.value})}
                          
            ></Form.Control>
          </Form.Group>
         
          <Form.Group controlId='isUsed' >
            <Form.Label>isUsed</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter description'
              value={state.isUsed.toString()}
              onChange={(e) => setState({...state,isUsed:e.target.value === 'true'})}
            ></Form.Control>
          </Form.Group>

         

          <Form.Group controlId='discountAmount'>
            <Form.Label>Giảm (%)</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter description'
              value={state.discountAmount}
              onChange={(e) => setState({...state,discountAmount:e.target.value})}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='qty' >
            <Form.Label>Số lượng</Form.Label>
            <Form.Control
              type='text'
              placeholder='Số lượng'
              value={state.qty.toString()}
              onChange={(e) => setState({...state,qty:e.target.value})}
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
