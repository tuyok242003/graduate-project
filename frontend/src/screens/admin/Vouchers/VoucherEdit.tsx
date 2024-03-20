import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../../components/Message';
import Loader from '../../../components/Loader';
import FormContainer from '../../../components/FormContainer';
import { toast } from 'react-toastify';
import { useGetVoucherDetailsQuery, useUpdateVoucherMutation } from '../../../redux/query/apiSlice';
import { displayErrorMessage } from '../../../components/Error';
import { VOUCHERLIST } from '../../../constants/constants';
import { VoucherAdminStyled } from './styled';
import { IFormField } from '../../../interfaces/InShop';

export interface IVoucherState {
  voucherName: string;
  discountAmount: string;
  qty: string;
  isUsed: boolean;
}

const VoucherEditScreen = () => {
  const { id: voucherId } = useParams();
  const [state, setState] = useState<IVoucherState>({
    voucherName: '',
    discountAmount: '',
    qty: '',
    isUsed: false,
  });

  const { data: voucher, isLoading, error } = useGetVoucherDetailsQuery(voucherId || '');
  const [updateVoucher, { isLoading: loadingUpdate }] = useUpdateVoucherMutation();
  const navigate = useNavigate();

  const isFormValid = () => {
    if (!state.voucherName || !state.discountAmount) {
      toast.error('Vui lòng điền đầy đủ thông tin Voucher');
      return false;
    }
    return true;
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid()) {
      return;
    }
    try {
      await updateVoucher({
        voucherId,
        voucherName: state.voucherName,
        discountAmount: state.discountAmount,
        isUsed: state.isUsed,
        qty: state.qty,
      }).unwrap();
      toast.success('Voucher updated');

      navigate(VOUCHERLIST);
    } catch (err) {
      displayErrorMessage(err);
    }
  };

  useEffect(() => {
    if (voucher) {
      setState({
        ...state,
        voucherName: voucher.voucherName,
        discountAmount: voucher.discountAmount,
        isUsed: voucher.isUsed,
        qty: voucher.qty,
      });
    }
  }, [voucher]); // eslint-disable-line react-hooks/exhaustive-deps

  const formFields: IFormField[] = [
    {
      controlId: 'voucherName',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter Name',
      value: state.voucherName,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, voucherName: e.target.value }),
    },
    {
      controlId: 'qty',
      label: 'Số lượng',
      type: 'number',
      placeholder: 'Enter Qty',
      value: state.qty,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, qty: e.target.value }),
    },
    {
      controlId: 'discountAmount',
      label: 'Giảm (%)',
      placeholder: 'Enter discountAmount',
      type: 'text',
      value: state.discountAmount,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, discountAmount: e.target.value }),
    },
  ];

  return (
    <VoucherAdminStyled>
      <>
        <Link to={VOUCHERLIST} className="btn btn-light my-3">
          Go Back
        </Link>
        <FormContainer>
          <h1>Edit Voucher</h1>

          {isLoading || loadingUpdate ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">Đã xảy ra lỗi. Vui lòng thử lại sau</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              {formFields.map((field) => (
                <Form.Group key={field.controlId} controlId={field.controlId}>
                  <Form.Label>{field.label}</Form.Label>
                  <Form.Control
                    type={field.type}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </Form.Group>
              ))}
              <Button type="submit" variant="primary" className="button-voucher">
                Update
              </Button>
            </Form>
          )}
        </FormContainer>
      </>
    </VoucherAdminStyled>
  );
};

export default VoucherEditScreen;
