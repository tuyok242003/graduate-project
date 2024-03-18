import { Carousel, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGetPostsQuery } from '../../redux/query/apiSlice';
import Message from '../Message';
import { PostCarouselStyled } from './styled';

const PostCarousel = () => {
  const { data: posts, isLoading, error } = useGetPostsQuery();

  return isLoading ? null : error ? (
    <Message variant="danger">Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
  ) : (
    <PostCarouselStyled>
      <Carousel pause="hover" className="bg-primary mb-4">
        {posts &&
          Array.isArray(posts) &&
          posts.map((post) => (
            <Carousel.Item key={post._id}>
              <Link to={`/post/${post._id}`}>
                <Image className="img-post" src={post.image} alt={post.postName} fluid />
                <Carousel.Caption className="carousel-caption">
                  <h2 className="text-white text-right">{post.postName}</h2>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
          ))}
      </Carousel>
    </PostCarouselStyled>
  );
};

export default PostCarousel;
