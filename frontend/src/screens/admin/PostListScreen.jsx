import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import {
  useGetPostsQuery,
  useDeletePostMutation,
  useCreatePostMutation,
} from '../../slices/postSlice';

const PostListScreen = () => {
  const { data: posts, isLoading, error, refetch } = useGetPostsQuery();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeletePostMutation();
  const navigate = useNavigate();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  const [{ isLoading: loadingCreate }] = useCreatePostMutation();
  const createPostHandler = async () => {
    try {
      navigate('/admin/post/add');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Posts</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createPostHandler}>
            <FaPlus /> Create Post
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}

      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>IMG</th>
                <th>CONTENT</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {posts?.map((post) => (
                <tr key={post._id}>
                  <td>{post._id}</td>
                  <td>{post.name}</td>
                  <td>
                    {post.img && (
                      <img
                        src={post.img}
                        alt={post.name}
                        style={{ maxWidth: '100px' }}
                      />
                    )}
                  </td>
                  <td>{post.content}</td>
                  <td>
                    <LinkContainer to={`/admin/post/${post._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(post._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default PostListScreen;
