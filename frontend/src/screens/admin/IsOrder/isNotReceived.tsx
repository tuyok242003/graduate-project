import { Button, Col, Row, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../../components/Footer';
import Message from '../../../components/Message';

import { displayErrorMessage } from '../../../components/Error';
import { CANCEL, CONFIRM, RECEIVED } from '../../../constants/constants';
import {
  useCancelOrderMutation,
  useGetOrdersQuery,
} from '../../../redux/query/ordersApiSlice';
import { IsOrderStyled } from './styled';

const IsNotReceived = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [cancelOrder] = useCancelOrderMutation();
  const navigate = useNavigate();
  const CancelHandler = async (id: string, isDelivered: boolean) => {
    if (isDelivered) {
      toast.error('Không thể huỷ đơn hàng đã được giao');
      return;
    }
    if (!isDelivered) {
      toast.error('Đơn hàng đã được huỷ trước đó');
      return;
    }

    const cancelMessage = 'Bạn có muốn huỷ đơn hàng!!!';
    if (window.confirm(cancelMessage)) {
      try {
        await cancelOrder(id);
        navigate('/');
        refetch();
        toast.success('Đơn hàng đã huỷ thành công');
      } catch (err) {
        displayErrorMessage(err);
      }
    }
  };
  return (
  
    <IsOrderStyled>
      <Row>
      <Col md={9}>
        <h2>Đơn hàng chưa giao</h2>
        <td>
          <LinkContainer to={RECEIVED}>
            <Button className='btn-sm' variant='secondary'>
              Đơn hàng đã giao
            </Button>
          </LinkContainer>
        </td>
        <td>
          <LinkContainer className='cancel' to={CANCEL} >
            <Button className='btn-sm' variant='secondary'>
              Đơn hàng đã huỷ
            </Button>
          </LinkContainer>
        </td>
        <td>
          <LinkContainer className='confirm' to={CONFIRM} >
            <Button className='btn-sm' variant='secondary'>
              Đơn hàng đã nhận
            </Button>
          </LinkContainer>
        </td>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
        ) : (
          <Table striped hover responsive className='table-sm'>
            <thead>
            
            </thead>
            {/* <tbody>
              {orders
                ?.filter((order) => !order.isDelivered)
                .map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>
                      {' '}
                      {order.createdAt instanceof Date
                        ? order.createdAt.toISOString().substring(0, 10)
                        : ''}
                    </td>
                    <td>{order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        order.deliveredAt instanceof Date ? (
                          order.deliveredAt.toISOString().substring(0, 10)
                        ) : (
                          <FaCheck style={{ color: 'green' }} />
                        )
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.paidAt instanceof Date ? (
                          order.paidAt.toISOString().substring(0, 10)
                        ) : (
                          <FaCheck style={{ color: 'green' }} />
                        )
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button className='btn-sm' variant='light'>
                          Chi tiết
                        </Button>
                      </LinkContainer>
                    </td>
                    <td>
                      <Button
                        onClick={() =>
                          CancelHandler(order._id, order.isDelivered)
                        }
                        className='btn-sm'
                        variant='light'
                      >
                        Huỷ đơn hàng
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody> */}
          </Table>
        )}
      </Col>
    </Row>
    </IsOrderStyled>
  )
};

export default IsNotReceived;
