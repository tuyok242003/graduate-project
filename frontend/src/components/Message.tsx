import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import React from 'react';
import { Alert, AlertProps } from 'react-bootstrap';
export interface IMessageProps {
  variant?: AlertProps['variant'];
  children?:FetchBaseQueryError
}
const Message = ({ variant, children }:IMessageProps) => {
  return <Alert variant={variant}>{children}</Alert>;
};

Message.defaultProps = {
  variant: 'info',
};

export default Message;
