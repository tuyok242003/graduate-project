import React, { ReactNode } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
interface FormContainerProps {
  children: ReactNode;
}
const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
  return (
    <Container>
      <Row varoiant className='justify-content-md-center'>
        <Col xs={12} md={6}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;
