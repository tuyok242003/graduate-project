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

} from '../../../redux/query/voucherSlice';
import { displayErrorMessage } from '../../../components/Error';
import { VOUCHERLIST } from '../../../constants';
export interface IVoucherState {
  voucherName:string
  discountAmount:string
  qty:string
  isUsed:boolean
}
const VoucherEditScreen = () => {
  const { id: voucherId } = useParams();
const [state,setState] = useState<IVoucherState>({
  voucherName:'',
  discountAmount:'',
  qty:'',
  isUsed:false
})
  const {
    data: voucher,
    isLoading,
    refetch,
    error,
  } = useGetVoucherDetailsQuery(voucherId as string);

  const [updateVoucher, { isLoading: loadingUpdate }] = useUpdateVoucherMutation();

 console.log(voucher);
 
  const navigate = useNavigate();

  const isFormValid = () => {
   
    if (!state.voucherName || !state.discountAmount ) {
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
        voucherName:state.voucherName,
        discountAmount:state.discountAmount,
        isUsed:state.isUsed
      }).unwrap();
      toast.success('Voucher updated');
      refetch();
      navigate(VOUCHERLIST);
    } catch (err) {
      displayErrorMessage(err);
    }
  };

  useEffect(() => {
    if (voucher) {
      setState({...state,
        voucherName:voucher.voucherName,
        discountAmount:voucher.discountAmount,
        isUsed:voucher.isUsed,
        qty:voucher.qty});
    }
  }, [voucher]);
  
  return (
    <>
      <Link to={VOUCHERLIST} className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Voucher</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={state.voucherName}
                onChange={(e) => setState({...state,voucherName:e.target.value})}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='qty'>
              <Form.Label>Số lượng</Form.Label>
              <Form.Control
                type='number'
                placeholder='Số lượng'
                value={state.qty}
                onChange={(e) => setState({...state,qty:e.target.value})}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='discountAmount'>
              <Form.Label>Giảm (%)</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter discountAmount'
                value={state.discountAmount}
                onChange={(e) => setState({...state,discountAmount:e.target.value})}
              ></Form.Control>
            </Form.Group>
          
            <Form.Group controlId='isUsed'>
  <Form.Label>Is Used</Form.Label>
  <div>
    <Form.Check
      type='radio'
      label='True'
      id='true'
      checked={state.isUsed === true}
      onChange={() => setState({...state,isUsed:true})}
    />
    <Form.Check
      type='radio'
      label='False'
      id='false'
      checked={state.isUsed === false}
      onChange={() => setState({...state,isUsed:false})}
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
