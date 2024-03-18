import { ICategories } from '../../../interfaces/OutShop';
import { useState } from 'react';
import { Button, Col, Pagination, Row, Table } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../../components/Footer';
import Message from '../../../components/Message';
import { CATEGORYADD } from '../../../constants/constants';
import { useCreateCategoryMutation, useDeleteCategoryMutation, useGetCategoriesQuery } from '../../../redux/query/apiSlice';

const CategoryListScreen = () => {
  const { data, isLoading, error, refetch } = useGetCategoriesQuery();
  console.log(data);

  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteCategoryMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 5;
  const navigate = useNavigate();
  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        toast.error('Error');
      }
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, { isLoading: loadingCreate, error: createError }] = useCreateCategoryMutation();
  const createCategoryHandler = async () => {
    try {
      navigate(CATEGORYADD);
      refetch();
    } catch (err) {
      toast.error('Error');
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>categories</h1>
        </Col>
        <Col className="text-end">
          <Button className="my-3" onClick={createCategoryHandler}>
            <FaPlus /> Create Category
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}

      {loadingDelete && <Loader />}

      {isLoading ? (
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.map((category: ICategories) => (
                <tr key={category._id}>
                  <td>{category._id}</td>
                  <td>{category.name}</td>

                  <td>
                    <LinkContainer to={`/admin/category/${category._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(category._id)}>
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            {Array.from({
              length: Math.ceil((data?.length || 0) / categoriesPerPage) || 1,
            }).map((page, index) => (
              <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </>
  );
};

export default CategoryListScreen;
