import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Message, { IMessageProps } from '../../../components/Message';
import Loader from '../../../components/Loader';
import { AiFillCaretRight, AiTwotoneFileAdd } from 'react-icons/ai';

import {
  useGetProductsQuery,
  useDeleteProductMutation,
 
} from '../../../redux/query/productsApiSlice';
import { toast } from 'react-toastify';
import { IProducts } from '@/interfaces/Products';
import { ICategories } from '@/interfaces/Category';
import { displayErrorMessage } from '../../../components/Error';
import { PRODUCTADD, USERLIST } from '../../../constants';

const ProductListScreen = () => {
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useGetProductsQuery();

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        displayErrorMessage(err);
      }
    }
  };

 
  const createProductHandler = async () => {
    try {
      navigate(PRODUCTADD);
      refetch();
    } catch (err) {
      displayErrorMessage(err);
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Sản phẩm</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={createProductHandler}>
            <FaPlus /> Create Product
          </Button>
        </Col>
      </Row>
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
          
                <th>CATEGORY</th>
                <th>BRAND</th>
                
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.products.map((product:IProducts) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.productName}</td>
                  <td>{(product.category as ICategories)?.categoryName}</td>
                  <td>{product.brand}</td>
           
                  <td style={{ width: 200 }}>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <LinkContainer to={`/admin/product/${product._id}`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <AiFillCaretRight />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                    <LinkContainer to={`/admin/varriant/${product._id}/add`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <AiTwotoneFileAdd />
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
  );
};

export default ProductListScreen;
