import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import Message, { IMessageProps } from '../../../components/Message';
import Loader from '../../../components/Loader';
import { toast } from 'react-toastify';

import {
  useGetOrdersQuery,
  useDeleteOrderMutation,
} from '../../../slices/ordersApiSlice';

const IsCancelled = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
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
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{(error as IMessageProps).children}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
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
                    {typeof order.user === 'object' && order.user !== null
                      ? 'name' in order.user
                        ? (order.user as { name?: string }).name ||
                          'Unknown User'
                        : 'Unknown User'
                      : 'Unknown User'}
                  </td>
                  <td>
                    {order.createdAt instanceof Date
                      ? order.createdAt.toISOString().substring(0, 10)
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

export default IsCancelled;
