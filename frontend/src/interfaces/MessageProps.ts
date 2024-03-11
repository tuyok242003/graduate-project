import { AlertProps } from "react-bootstrap";

export interface IMessageProps {
  variant?: AlertProps['variant'];
  children: React.ReactNode;
}