import { Button, Col, Row, Table } from 'react-bootstrap';
import { AiFillCaretRight } from 'react-icons/ai';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { IoIosAdd } from 'react-icons/io';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { displayErrorMessage } from '../../../components/Error';
import Loader from '../../../components/Loader';
import Message from '../../../components/Message';
import { PRODUCTADD } from '../../../constants/constants';
import { IProducts } from '../../../interfaces/OutShop';
import { useDeleteProductMutation, useGetProductsQuery } from '../../../redux/query/apiSlice';
import { ProductAdminStyled } from './styled';
const ProductListScreen = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetProductsQuery();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteProduct(id);
      } catch (err) {
        displayErrorMessage(err);
      }
    }
  };
  const createProductHandler = async () => {
    try {
      navigate(PRODUCTADD);
    } catch (err) {
      displayErrorMessage(err);
    }
  };
  return (
    <ProductAdminStyled>
      <>
        <Row className="align-items-center">
          <Col>
            <h1>Sản phẩm</h1>
          </Col>
          <Col className="text-end">
            <Button className="my-3" onClick={createProductHandler}>
              <FaPlus /> Create Product
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
                  <th>CATEGORY</th>
                  <th>BRAND</th>

                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data?.products.map((product: IProducts) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.productName}</td>
                    <td>{(product.category || '')?.name}</td>
                    <td>{product.brand}</td>

                    <td className="list-product">
                      <LinkContainer to={`/admin/product/${product._id}/edit`}>
                        <Button variant="light" className="btn-sm mx-2">
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <LinkContainer to={`/admin/product/${product._id}`}>
                        <Button variant="light" className="btn-sm mx-2">
                          <AiFillCaretRight />
                        </Button>
                      </LinkContainer>
                      <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(product._id)}>
                        <FaTrash className="fatrash" />
                      </Button>
                      <LinkContainer to={`/admin/varriant/${product._id}/add`}>
                        <Button variant="light" className="btn-sm mx-2">
                          <IoIosAdd />
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </>
    </ProductAdminStyled>
  );
};

export default ProductListScreen;
