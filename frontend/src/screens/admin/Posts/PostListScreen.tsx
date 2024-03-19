import { useState } from 'react';
import { Button, Col, Pagination, Row, Table } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { displayErrorMessage } from '../../../components/Error';
import Loader from '../../../components/Footer';
import Message from '../../../components/Message';
import { useDeletePostMutation, useGetPostsQuery } from '../../../redux/query/apiSlice';
import { PostStyled } from './styled';
import { currentData } from '../../../components/CurrentData';
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

  const createPostHandler = async () => {
    try {
      navigate('/admin/post/add');
      refetch();
    } catch (err) {
      displayErrorMessage(err);
    }
  };

  return (
    <PostStyled>
      <>
        <Row className="align-items-center">
          <Col>
            <h1>Posts</h1>
          </Col>
          <Col className="text-end">
            <Button className="my-3" onClick={createPostHandler}>
              <FaPlus /> Create Post
            </Button>
          </Col>
        </Row>
        {isLoading || loadingDelete ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
        ) : (
          <>
            <Table striped bordered hover responsive className="table-sm">
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
                {currentData(currentPage, ordersPerPage, posts)?.map((post) => (
                  <tr key={post._id}>
                    <td>{post._id}</td>
                    <td>{post.postName}</td>
                    <td>{post.image && <img className="img-post" src={post.image} alt={post.postName} />}</td>
                    <td>{post.content}</td>
                    <td>
                      <LinkContainer to={`/admin/post/${post._id}/edit`}>
                        <Button variant="light" className="btn-sm mx-2">
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(post._id)}>
                        <FaTrash className="fatrash" />
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
                <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </>
        )}
      </>
    </PostStyled>
  );
};

export default PostListScreen;
