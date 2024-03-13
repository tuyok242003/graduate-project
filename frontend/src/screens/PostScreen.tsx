import React from 'react';
import { Row, Col, Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useGetPostsQuery } from '../redux/query/postSlice';
import Loader from '../components/Loader';
import Message, { IMessageProps } from '../components/Message';
import '../assets/styles/PostScreen.css';
import { IPosts } from '@/interfaces/Post';
const PostScreen = () => {
  const navigate = useNavigate();
  const { data: posts, isLoading, error } = useGetPostsQuery();
  console.log('error', error);
  console.log('data', posts);

  const handleReadMore = (post_id: string) => {
    console.log('Clicked Read More', post_id);
    navigate(`/post/${post_id}`);
  };
  return (
    <div className='container mt-4'>
      <h1 className='mb-4'>Latest Posts</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
      ) : (
        <Row>
          <Col md={8}>
            {posts?.map((post) => (
              <div key={post._id} className='mb-4 d-flex post-container'>
                <img
                  src={post.image}
                  alt={post.content}
                  className='mr-4 post-image'
                />
                <div className='post-content'>
                  <h5 style={{ marginLeft: 20 }}>{post.postName}</h5>
                  <Button
                    variant='primary'
                    onClick={() => handleReadMore(post._id)}
                    style={{ marginLeft: 20 }}
                  >
                    Read More
                  </Button>
                </div>
              </div>
            ))}
          </Col>
          <Col md={4}>
            <h3 className='mb-3'>
              <span
                className='text-danger'
                style={{ animation: 'blink 1s infinite' }}
              >
                New Posts
              </span>
            </h3>
            <ListGroup>
              {posts
                ?.slice(0, 5)
                .map((post) => (
                  <ListGroup.Item key={post._id}>{post.postName}</ListGroup.Item>
                ))}
            </ListGroup>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default PostScreen;
