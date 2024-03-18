import React from 'react';
import { Alert } from 'react-bootstrap';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export interface IMessageProps {
  variant?: string;
  children?: string | FetchBaseQueryError;
}
const Message: React.FC<IMessageProps> = ({ variant = 'info', children }) => {
  return <Alert variant={variant}>{typeof children === 'string' ? children : children?.status}</Alert>;
};
export default Message;
