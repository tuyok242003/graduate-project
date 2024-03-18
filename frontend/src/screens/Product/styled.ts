import styled, { keyframes } from "styled-components"
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
`

export const ProductScreenStyled = styled.div`
  .color-wrapper {
    display: inline-block; /* Cho phép các div bao ngoài được hiển thị trên cùng một hàng */
    margin-right: 5px; /* Tạo khoảng cách giữa các cột */
  }

  .color-wrapper:last-child {
    margin-right: 0; /* Loại bỏ khoảng cách của div cuối cùng */
  }
  .vertical-line {
    border-right: 1px solid #ccc;
    height: 100%;
    margin-left: 5px;
  }
  .variant-item.active-variant {
    color: red;
  }
  .sale-highlight {
    animation: ${pulse} 1s infinite;
    color: red;
  }
  .image-product {
    width: 400px;
    height: 450px;
  }
  .variant-item {
    cursor: pointer;
  }
  .qty {
    margin-left: 70px;
  }
  .number-product {
    padding-right: 10px;
    margin-bottom: 40px;
  }
  .qty-btn {
    margin-right: 10px;
  }
  .qty-btnnn {
    margin-left: 10px;
  }
  .btn-block {
    border: none;
  }
  .btn-blockbuy {
    margin-left: 15px;
    background: green;
    border: none;
  }
`
