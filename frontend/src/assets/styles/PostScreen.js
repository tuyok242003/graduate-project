import styled, { keyframes } from 'styled-components';

// Define keyframes
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
`;
export const PostStyled = styled.div`
  .new-post {
    color: red;
    animation: ${blink} 1s infinite;
  }
  .post-container {
    padding: 20;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  .post-image {
    width: 150px;
    height: 100px;
  }
  .post-wrapper {
    display: 'grid';
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20;
  }
  .btn-post {
    margin-left: 20px;
  }
  .post-name {
    margin-left: 20px;
  }
`;
