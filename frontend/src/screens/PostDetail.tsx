import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetPostDetailsQuery } from '../slices/postSlice';
import Loader from '../components/Loader';
import Message, { IMessageProps } from '../components/Message';
import { useGetVoucherDetailsQuery } from '../slices/voucherSlice';
const PostDetail = () => {
  const { postId } = useParams();
  const {voucherId} = useParams()
  const { data: post, isLoading, error } = useGetPostDetailsQuery(postId);
const {data:voucher}= useGetVoucherDetailsQuery(voucherId)
  return (
    <div className='container mt-4'>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{(error as IMessageProps).children}</Message>
      ) : (
        <div className='post-content'>
          <div className='post-header'>
            <h1>{post.post.name}</h1>
            <img
              src={post.post.img}
              alt={post.post.content}
              className='img-fluid rounded post-image'
              style={{ width: 500 }}
            />
          </div>
          <p className='fs-5'>{post.post.content}</p>

          <Link to='/posts' className='btn btn-primary'>
            Quay Lại
          </Link>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
