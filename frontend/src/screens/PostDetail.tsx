import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetPostDetailsQuery } from '../redux/query/postSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetVoucherDetailsQuery } from '../redux/query/voucherSlice';
import { POST } from '../constants';
import { IMessageProps } from '@/interfaces/MessageProps';
const PostDetail = () => {
  const { postId } = useParams();
  const { voucherId } = useParams();
  const { data: post, isLoading, error } = useGetPostDetailsQuery(postId);
  const { data: voucher } = useGetVoucherDetailsQuery(voucherId);
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

          <Link to={POST} className='btn btn-primary'>
            Quay Lại
          </Link>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
