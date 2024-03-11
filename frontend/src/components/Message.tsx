import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import React from 'react';
<<<<<<< HEAD
import { Alert } from 'react-bootstrap';
import { IMessageProps } from '@/interfaces/MessageProps';
const Message: React.FC<IMessageProps> = ({ variant, children }) => {
=======
import { Alert, AlertProps } from 'react-bootstrap';
export interface IMessageProps {
  variant?: AlertProps['variant'];
  children?:FetchBaseQueryError
}
const Message = ({ variant, children }:IMessageProps) => {
>>>>>>> db3ead38400b9c71025e66397ccea6069d81302a
  return <Alert variant={variant}>{children}</Alert>;
};

Message.defaultProps = {
  variant: 'info',
};

export default Message;
