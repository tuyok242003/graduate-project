import React from 'react';
import { Alert } from 'react-bootstrap';
import { IMessageProps } from '@/interfaces/MessageProps';
const Message: React.FC<IMessageProps> = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

Message.defaultProps = {
  variant: 'info',
};

export default Message;
