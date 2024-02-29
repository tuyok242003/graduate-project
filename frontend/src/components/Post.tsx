import { Posts } from '@/interfaces/Post';
import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Post = ({ post }: { post: Posts }) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`/post/${post._id}`}>
        <Card.Img src={post.img} variant='top' />
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
