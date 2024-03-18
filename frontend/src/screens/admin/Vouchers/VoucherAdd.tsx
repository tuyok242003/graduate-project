import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Loader from '../../../components/Footer';
import FormContainer from '../../../components/FormContainer';
import { toast } from 'react-toastify';
import { useCreateVoucherMutation, useGetVouchersQuery } from '../../../redux/query/apiSlice';
import { IVouchers } from '../../../interfaces/OutShop';
import { displayErrorMessage } from '../../../components/Error';
import { IVoucherState } from './VoucherEdit';
import { VOUCHERLIST } from '../../../constants/constants';
import { VoucherAdminStyled } from './styled';
const VoucherAddScreen = () => {
  const [state, setState] = useState<IVoucherState>({
    voucherName: '',
    discountAmount: '',
    qty: '',
    isUsed: false,
  });
  const { data: allVouchers } = useGetVouchersQuery();
  const [addVoucher, { isLoading: loadingAdd }] = useCreateVoucherMutation();

  const navigate = useNavigate();
  const isFormValid = () => {
    if (!state.voucherName || !state.discountAmount || !state.qty) {
      toast.error('Vui lòng điền đầy đủ thông tin sản phẩm.');
      return false;
    }
    if (isNaN(Number(state.discountAmount || state.qty))) {
      toast.error('Giảm phải là số');
      return false;
    }
    if (allVouchers?.some((voucher: IVouchers) => voucher.voucherName === state.voucherName)) {
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
        voucherName: state.voucherName,
        discountAmount: state.discountAmount,
        isUsed: state.isUsed,
        qty: state.qty,
      };
      await addVoucher(voucherData).unwrap();
      toast.success('Voucher added');
      navigate(VOUCHERLIST);
    } catch (err) {
      displayErrorMessage(err);
    }
  };
  const formFields = [
    {
      controlId: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter name',
      value: state.voucherName,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, voucherName: e.target.value }),
    },
    //  {
    //     controlId: 'isUsed',
    //     label: 'isUsed',
    //      type: 'boolean',
    //     placeholder: 'Enter isUsed',
    //     value: state.isUsed},
    {
      controlId: 'discountAmount',
      label: 'discountAmount',
      type: 'number',
      placeholder: 'Enter discountAmount',
      value: state.discountAmount,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, discountAmount: e.target.value }),
    },
    {
      controlId: 'qty',
      label: 'Qty',
      type: 'number',
      placeholder: 'Enter qty',
      value: state.qty,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, qty: e.target.value }),
    },
  ];

  return (
    <VoucherAdminStyled>
      <>
        <Link to={VOUCHERLIST} className="btn btn-light my-3">
          Go Back
        </Link>
        <FormContainer>
          <h1>Add Contact</h1>
          {loadingAdd && <Loader />}
          <Form onSubmit={submitHandler}>
            {formFields.map((field) => (
              <Form.Group controlId={field.controlId} key={field.controlId}>
                <Form.Label>{field.label}</Form.Label>
                <Form.Control type={field.type} placeholder={field.placeholder} value={field.value} onChange={field.onChange} />
              </Form.Group>
            ))}
            <Button type="submit" variant="primary" className="button-contact">
              Add
            </Button>
          </Form>
        </FormContainer>
      </>
    </VoucherAdminStyled>
  );
};

export default VoucherAddScreen;
