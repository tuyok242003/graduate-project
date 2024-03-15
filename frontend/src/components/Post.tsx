import { IPosts } from '@/interfaces/Post';
import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Post = ( post :IPosts ) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`/post/${post._id}`}>
        <Card.Img src={post.image} variant='top' alt='Ảnh bài viết' />
      </Link>
      <Card.Body>
        <Link to={`/post/${post._id}`}>
          <Card.Title as='div' className='product-title'>
            <strong>{post.content}</strong>
          </Card.Title>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default Post;
