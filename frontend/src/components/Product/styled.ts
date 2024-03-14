import styled, { keyframes } from "styled-components"
const blink = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`
export const ProductStyled = styled.div`
  .sale-badge {
    animation: ${blink} 1s infinite;
    position: absolute;
    top: 0;
    right: 0;
    background-color: red;
    color: white;
    padding: 5px;
    font-size: 15px;
    font-weight: bold;
  }
  .product-title {
    font-family: display;
  }
`
