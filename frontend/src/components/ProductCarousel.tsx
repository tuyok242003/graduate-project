import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message, { IMessageProps } from './Message';
import { useGetPostsQuery } from '../redux/query/postSlice';
import { IPosts } from '@/interfaces/Post';

const PostCarousel = () => {
  const { data: posts, isLoading, error } = useGetPostsQuery();

  return isLoading ? null : error ? (
    <Message variant='danger'>Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
  ) : (
    <Carousel pause='hover' className='bg-primary mb-4'>
      {posts &&
        Array.isArray(posts) && posts.map((post) => (
          <Carousel.Item key={post._id}>
            <Link to={`/post/${post._id}`}>
              <Image
                style={{ width: 1300, height: 600 }}
                src={post.image}
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
