import { Carousel, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGetPostsQuery } from '../../redux/query/apiSlice';
import { PostCarouselStyled } from './styled';
import Loader from '../Loader';

const PostCarousel = () => {
  const { data: posts, isLoading, error } = useGetPostsQuery();

  return (
    <PostCarouselStyled>
      <Loader loading={isLoading} error={!!error} />
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
