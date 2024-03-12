import { LOGIN, PAYMENT, PLACEORDER, SHIPPING, VOUCHER } from '../constants';
import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const CheckoutSteps = ({
  step1,
  step2,
  step3,
  step4,
  step5
}: {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
  step5:boolean
}) => {
  return (
    <Nav className='justify-content-center mb-4'>
      <Nav.Item>
        {step1 ? (
          <LinkContainer to={LOGIN}>
            <Nav.Link>Sign In</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Sign In</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <LinkContainer to={SHIPPING}>
            <Nav.Link>Shipping</Nav.Link>
      
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Shipping</Nav.Link>
        )}
      </Nav.Item>
      <Nav.Item>
        {step3 ? (
          <LinkContainer to={VOUCHER}>
            <Nav.Link>Add Voucher</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Voucher</Nav.Link>
        )}
      </Nav.Item>
      <Nav.Item>
        {step4 ? (
          <LinkContainer to={PAYMENT}>
            <Nav.Link>Payment</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Payment</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step5 ? (
          <LinkContainer to={PLACEORDER}>
            <Nav.Link>Place Order</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>Place Order</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
