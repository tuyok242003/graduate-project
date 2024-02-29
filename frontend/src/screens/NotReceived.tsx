import React from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaTimes, FaCheck } from 'react-icons/fa';
import Message, { MessageProps } from '../components/Message';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import {
  useGetMyOrdersQuery,
  useCancelOrderMutation,
} from '../slices/ordersApiSlice';

const NotReceivedScreen = () => {
  const { data: orders, isLoading, error, refetch } = useGetMyOrdersQuery();
  const [cancelOrder, { isLoading: loadingUpdateOrder }] =
    useCancelOrderMutation();
  const navigate = useNavigate;
  const CancelHandler = async (id: string, isDelivered: boolean) => {
    if (isDelivered) {
      toast.error('Không thể huỷ đơn hàng đã được giao');
      return;
    }

    const cancelMessage = 'Bạn có muốn huỷ đơn hàng!!!';
    if (window.confirm(cancelMessage)) {
      try {
        await cancelOrder(id);

        refetch();

        toast.success('Đơn hàng đã huỷ thành công');
      } catch (err) {
        const error = err as { data?: { message?: string }; error?: string };
        toast.error(error?.data?.message || error.error);
      }
    }
  };
  return (
    <Row>
      <Col md={9}>
        <h2>Đơn hàng chưa giao</h2>
        <td>
          <LinkContainer to={`/received`}>
            <Button className='btn-sm' variant='secondary'>
              Đơn hàng đã giao
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
          <Message variant='danger'>{(error as MessageProps).children}</Message>
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
                ?.filter((order) => !order.isDelivered)
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
                        <FaCheck style={{ color: 'green' }} />
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
                          CancelHandler(order._id, order.isDelivered)
                        }
                        className='btn-sm'
                        variant='light'
                        disabled={order.isCancelled}
                      >
                        Huỷ đơn hàng
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

export default NotReceivedScreen;
