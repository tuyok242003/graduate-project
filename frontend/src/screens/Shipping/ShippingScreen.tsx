import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CheckoutSteps from '../../components/CheckoutStep';
import FormContainer from '../../components/FormContainer';
import { VOUCHER } from '../../constants/constants';
import { saveShippingAddress } from '../../redux/slices/cartSlice';
import { IFormField } from '../../interfaces/InShop';

// Khai báo các trường form ở đây

interface IShippingState {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const ShippingScreen = () => {
  const [state, setState] = useState<IShippingState>({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const formFields: IFormField[] = [
    {
      controlId: 'address',
      label: 'Address',
      value: state.address,
      type: 'text',
      placeholder: 'Enter address',
    },
    {
      controlId: 'city',
      label: 'City',
      value: state.city,
      type: 'text',
      placeholder: 'Enter city',
    },
    {
      controlId: 'postalCode',
      label: 'Postal Code',
      value: state.postalCode,
      type: 'text',
      placeholder: 'Enter postal code',
    },
    {
      controlId: 'country',
      label: 'Country',
      value: state.country,
      type: 'text',
      placeholder: 'Enter country',
    },
  ];
  const ValidateForm = () => {
    if (!state.address || !state.city || !state.postalCode || !state.country) {
      toast.error('Please fill in all address information.');
      return false;
    }

    if (isNaN(Number(state.postalCode))) {
      toast.error('Postal code must be a number.');
      return false;
    }

    return true;
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (shipping: React.FormEvent<HTMLFormElement>) => {
    shipping.preventDefault();
    if (!ValidateForm()) {
      return;
    }
    dispatch(
      saveShippingAddress({ address: state.address, city: state.city, postalCode: state.postalCode, country: state.country }),
    );
    navigate(VOUCHER);
  };
  const handleChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [key]: e.target.value });
  };
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        {/* Sử dụng map để tạo ra các Form.Group từ danh sách các trường */}
        {formFields.map((field) => (
          <Form.Group key={field.controlId} className="my-2" controlId={field.controlId}>
            <Form.Label>{field.label}</Form.Label>
            <Form.Control
              type={field.type}
              placeholder={field.placeholder}
              value={field.value}
              onChange={handleChange(field.controlId)}
            ></Form.Control>
          </Form.Group>
        ))}
        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
