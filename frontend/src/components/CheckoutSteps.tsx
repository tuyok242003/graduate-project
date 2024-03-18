import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { LOGIN, PAYMENT, PLACEORDER, SHIPPING, VOUCHER } from '../constants/constants';

interface CheckoutStep {
  link: string;
  title: string;
  completed: boolean;
}

const checkoutSteps: CheckoutStep[] = [
  { link: LOGIN, title: 'Sign In', completed: false },
  { link: SHIPPING, title: 'Shipping', completed: false },
  { link: VOUCHER, title: 'Add Voucher', completed: false },
  { link: PAYMENT, title: 'Payment', completed: false },
  { link: PLACEORDER, title: 'Place Order', completed: false },
];

const CheckoutSteps: React.FC<{
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
  step5: boolean;
}> = ({ step1, step2, step3, step4, step5 }) => {
  const steps: boolean[] = [step1, step2, step3, step4, step5];

  return (
    <Nav className='justify-content-center mb-4'>
      {checkoutSteps.map((step, index) => (
        <Nav.Item key={step.link}>
          {steps[index] ? (
            <LinkContainer to={step.link}>
              <Nav.Link>{step.title}</Nav.Link>
            </LinkContainer>
          ) : (
            <Nav.Link disabled>{step.title}</Nav.Link>
          )}
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default CheckoutSteps;
