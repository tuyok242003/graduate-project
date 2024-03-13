import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetPostDetailsQuery } from '../redux/query/postSlice';
import Loader from '../components/Loader';
import Message, { IMessageProps } from '../components/Message';
import { useGetVoucherDetailsQuery } from '../redux/query/voucherSlice';
const PostDetail = () => {
  const { postId } = useParams();
  const {voucherId} = useParams()
  const { data: post, isLoading, error } = useGetPostDetailsQuery(postId as string);
const {data:voucher}= useGetVoucherDetailsQuery(voucherId as string)
  return (
    <div className='container mt-4'>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
      ) : (
        <div className='post-content'>
          <div className='post-header'>
            <h1>{post?.postName}</h1>
            <img
              src={post?.image}
              alt={post?.content}
              className='img-fluid rounded post-image'
              style={{ width: 500 }}
            />
          </div>
          <p className='fs-5'>{post?.content}</p>

          <Link to='/posts' className='btn btn-primary'>
            Quay Lại
          </Link>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
