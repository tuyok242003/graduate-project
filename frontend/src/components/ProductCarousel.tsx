import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from './Message';
import { useGetPostsQuery } from '../redux/query/postSlice';
import { IPosts } from '@/interfaces/Post';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { IMessageProps } from '@/interfaces/MessageProps';
const PostCarousel = () => {
  const { data: posts, isLoading, error } = useGetPostsQuery();

  return isLoading ? null : error ? (
<<<<<<< HEAD
    <Message variant='danger'>
      {isErrorWithStatusAndData(error) ? error.data.children : 'Unknown error'}
    </Message>
=======
    <Message variant='danger'>{error}</Message>
>>>>>>> db3ead38400b9c71025e66397ccea6069d81302a
  ) : (
    <Carousel pause='hover' className='bg-primary mb-4'>
      {posts &&
        posts.map((post: IPosts) => (
          <Carousel.Item key={post._id}>
            <Link to={`/post/${post._id}`}>
              <Image
                style={{ width: 1300, height: 600 }}
                src={post.img}
                alt={post.postName}
                fluid
              />
              <Carousel.Caption className='carousel-caption'>
                <h2 className='text-white text-right'>{post.postName}</h2>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        ))}
    </Carousel>
  );
};

export default PostCarousel;
