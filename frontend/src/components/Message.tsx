import React from 'react';
import { Alert, AlertProps } from 'react-bootstrap';
export interface MessageProps {
  variant?: AlertProps['variant'];
  children: React.ReactNode;
}
const Message: React.FC<MessageProps> = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

Message.defaultProps = {
  variant: 'info',
};

export default Message;
