import styled, { keyframes } from 'styled-components';

export const ActiveVariantItem = styled.span`
  color: red;
`;

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

export const SaleHighlight = styled.div`
  animation: ${pulse} 1s infinite;
  color: red;
`;

export const ColorWrapper = styled.div`
  display: inline-block;
  margin-right: 5px;

  &:last-child {
    margin-right: 0;
  }
`;

export const VerticalLine = styled.div`
  border-right: 1px solid #ccc;
  height: 100%;
  margin-left: 5px;
`;
