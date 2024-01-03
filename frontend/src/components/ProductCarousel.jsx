import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from './Message';
import { useGetPostsQuery } from '../slices/postSlice';

const PostCarousel = () => {
  const { data: posts, isLoading, error } = useGetPostsQuery();

  return isLoading ? null : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <Carousel pause='hover' className='bg-primary mb-4'>
      {posts.map((post) => (
        <Carousel.Item key={post._id}>
          <Link to={`/post/${post._id}`}>
            <Image
              style={{ width: 1300, height: 600 }}
              src={post.img}
              alt={post.name}
              fluid
            />
            <Carousel.Caption className='carousel-caption'>
              <h2 className='text-white text-right'>{post.name}</h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default PostCarousel;
