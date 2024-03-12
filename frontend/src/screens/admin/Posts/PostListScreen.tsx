import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Pagination } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Message, { IMessageProps } from '../../../components/Message';
import Loader from '../../../components/Loader';
import { toast } from 'react-toastify';
import {
  useGetPostsQuery,
  useDeletePostMutation,
  useCreatePostMutation,
} from '../../../redux/query/postSlice';
import { useState } from 'react';
import { displayErrorMessage } from '../../../components/Error';

const PostListScreen = () => {
  const { data: posts, isLoading, error, refetch } = useGetPostsQuery();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeletePostMutation();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const deleteHandler = async (_id: string) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteProduct(_id);
        refetch();
      } catch (err) {
        toast.error('Error');
      }
    }
  };
  const [createPosst, { isLoading: loadingCreate, error: createError }] =
    useCreatePostMutation();
  const createPostHandler = async () => {
    try {
      navigate('/admin/post/add');
      refetch();
    } catch (err) {
      displayErrorMessage(err);
    }
  };
  const indexOfLastPost = currentPage * ordersPerPage;
  const indexOfFirstPost = indexOfLastPost - ordersPerPage;
  const currentPosts = posts?.slice(indexOfFirstPost, indexOfLastPost);
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
        <Message variant='danger'>Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
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
              {currentPosts?.map((post) => (
                <tr key={post._id}>
                  <td>{post._id}</td>
                  <td>{post.name}</td>
                  <td>
                    {post.image && (
                      <img
                        src={post.image}
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
                      onClick={() =>deleteHandler(post._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            {Array.from({
              length: Math.ceil((posts?.length || 0) / ordersPerPage) || 1,
            }).map((page, index) => (
              <Pagination.Item
                key={index}
                active={index + 1 === currentPage}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </>
  );
};

export default PostListScreen;
