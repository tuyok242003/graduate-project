import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import Message, { MessageProps } from '../components/Message';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

import {
  useGetMyOrdersQuery,
  useDeleteOrderMutation,
} from '../slices/ordersApiSlice';

const CancelScreen = () => {
  const { data: orders, isLoading, error, refetch } = useGetMyOrdersQuery();
  console.log(orders);
  const [deleteOrder] = useDeleteOrderMutation();

  const deleteHandler = async (id: string) => {
    if (window.confirm('Bạn có muốn xoá đơn hàng không')) {
      try {
        await deleteOrder(id);
        refetch();
      } catch (err) {
        const error = err as { data?: { message?: string }; error?: string };
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <>
      <h1>Đơn hàng bị huỷ</h1>
      <td>
        <LinkContainer to={`/notReceived`}>
          <Button className='btn-sm' variant='secondary'>
            Đơn hàng chưa giao
          </Button>
        </LinkContainer>
      </td>
      <td>
        <LinkContainer to={`/received`} style={{ marginLeft: 10 }}>
          <Button className='btn-sm' variant='secondary'>
            Đơn hàng đã giao
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
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>

              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders
              ?.filter((order) => order.isCancelled)
              .map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : ''}
                  </td>
                  <td>${order.totalPrice}</td>
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
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button variant='light' className='btn-sm'>
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                  <td>
                    <Button
                      onClick={() => deleteHandler(order._id)}
                      className='btn-sm'
                      variant='light'
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default CancelScreen;
