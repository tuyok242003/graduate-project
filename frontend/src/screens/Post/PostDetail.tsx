import { Link, useParams } from 'react-router-dom';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { useGetPostDetailsQuery } from '../../redux/query/apiSlice';
import { POST } from '../../constants/constants';
import { PostScreenStyled } from './styled';

const PostDetail = () => {
  const { postId } = useParams();
  const { data: post, isLoading, error } = useGetPostDetailsQuery(postId || '');
  console.log(post);

  return (
    <PostScreenStyled>
      <div className="container mt-4">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
        ) : (
          <div className="post-content">
            <div className="post-header">
              <h1>{post?.postName}</h1>
              <img src={post?.image} alt={post?.content} className="img-fluid rounded post-image" />
            </div>
            <p className="fs-5">{post?.content}</p>
            <Link to={POST} className="btn btn-primary">
              Quay Lại
            </Link>
          </div>
        )}
      </div>
    </PostScreenStyled>
  );
};

export default PostDetail;
