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

// Styled-components for elements
export const NewPosts = styled.div`
  color: red;
  animation: ${blink} 1s infinite;
`;

export const PostContainer = styled.div`
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 20px;
`;

export const PostImage = styled.img`
  width: 100px; /* Điều chỉnh kích thước ảnh theo ý muốn */
  height: auto;
`;

export const PostsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;
