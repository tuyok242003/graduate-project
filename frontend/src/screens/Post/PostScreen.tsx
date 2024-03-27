import { Button, Col, ListGroup, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { PostStyled } from '../../assets/styles/PostScreen';
import Loader from '../../components/Loader';
import { useGetPostsQuery } from '../../redux/query/apiSlice';
const PostScreen = () => {
  const navigate = useNavigate();
  const { data: posts, isLoading, error } = useGetPostsQuery();
  const handleReadMore = (post_id: string) => {
    console.log('Clicked Read More', post_id);
    navigate(`/post/${post_id}`);
  };
  return (
    <PostStyled>
      <div className="container mt-4">
        <h1 className="mb-4">Latest Posts</h1>
        <Loader loading={isLoading} error={!!error} />
        <Row>
          <Col md={8}>
            {posts?.map((post) => (
              <div key={post._id} className="mb-4 d-flex post-container">
                <img src={post.image} alt={post.content} className="post-image" />
                <div className="post-content">
                  <h5 className="post-name">{post.postName}</h5>
                  <Button className="btn-post" variant="primary" onClick={() => handleReadMore(post._id)}>
                    Read More
                  </Button>
                </div>
              </div>
            ))}
          </Col>
          <Col md={4}>
            <h3 className="mb-3">
              <span className="new-post">New Posts</span>
            </h3>
            <ListGroup>
              {posts?.slice(0, 5).map((post) => <ListGroup.Item key={post._id}>{post.postName}</ListGroup.Item>)}
            </ListGroup>
          </Col>
        </Row>
      </div>
    </PostStyled>
  );
};

export default PostScreen;
