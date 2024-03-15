import { Button, Col, Row, Table } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Message from '../components/Message';

import { displayErrorMessage } from '../components/Error';
import {
  useConfirmOrderMutation,
  useGetMyOrdersQuery,
} from '../redux/query/ordersApiSlice';

const ReceivedScreen = () => {
  const { data: orders, isLoading, error, refetch } = useGetMyOrdersQuery();
  const [confirmlOrder] = useConfirmOrderMutation();
  const navigate = useNavigate();
  const confirmHandler = async (
    id: string,
    isDelivered: boolean,
    isConfirmed: boolean
  ) => {
    if (!isDelivered) {
      toast.error('Không thể nhận đơn hàng khi chưa vận chuyển');
      return;
    }
    if (isConfirmed) {
      toast.error('Đơn hàng đã được nhận trước đó');
      return;
    }
    const confirmMessage = 'Bạn đã nhận đơn hàng rồi!!!';
    if (window.confirm(confirmMessage)) {
      try {
        await confirmlOrder(id);
        navigate('/');
        refetch();
        toast.success('Đơn hàng đã được nhận thành công');
      } catch (err) {
        displayErrorMessage(err);
      }
    }
  };
  return (
    <Row>
      <Col md={9}>
        <h2>Đơn hàng đã giao</h2>
        <td>
          <LinkContainer to={`/notReceived`}>
            <Button className='btn-sm' variant='secondary'>
              Đơn hàng chưa giao
            </Button>
          </LinkContainer>
        </td>
        <td>
          <LinkContainer to={`/cancel`} style={{ marginLeft: 10 }}>
            <Button className='btn-sm' variant='secondary'>
              Đơn hàng đã huỷ
            </Button>
          </LinkContainer>
        </td>
        <td>
          <LinkContainer to={`/confirm`} style={{ marginLeft: 10 }}>
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
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>

                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders
                ?.filter((order) => order.isDelivered)
                .map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : ''}
                    </td>
                    <td>{order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
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
                      {order.isDelivered ? (
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
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button className='btn-sm' variant='light'>
                          Chi tiết
                        </Button>
                      </LinkContainer>
                    </td>
                    <td>
                      <Button
                        onClick={() =>
                          confirmHandler(
                            order._id,
                            order.isDelivered,
                            order.isConfirmed !== undefined
                              ? order.isConfirmed
                              : false
                          )
                        }
                        className='btn-sm'
                        variant='light'
                        disabled={order.isConfirmed}
                      >
                        Nhận đơn hàng
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ReceivedScreen;
