import React from 'react';
import { Row, Col, Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useGetPostsQuery } from '../slices/postSlice';
import Loader from '../components/Loader';
import Message, { MessageProps } from '../components/Message';
import '../assets/styles/PostScreen.css';
import { Posts } from '@/interfaces/Post';
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
        <Message variant='danger'>{(error as MessageProps).children}</Message>
      ) : (
        <Row>
          <Col md={8}>
            {posts?.map((post: Posts) => (
              <div key={post._id} className='mb-4 d-flex post-container'>
                <img
                  src={post.img}
                  alt={post.content}
                  className='mr-4 post-image'
                />
                <div className='post-content'>
                  <h5 style={{ marginLeft: 20 }}>{post.name}</h5>
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
                .map((post: Posts) => (
                  <ListGroup.Item key={post._id}>{post.name}</ListGroup.Item>
                ))}
            </ListGroup>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default PostScreen;
