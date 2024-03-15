import { IOrder } from '@/interfaces/Order';
import { Button, Table } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { displayErrorMessage } from '../components/Error';
import Loader from '../components/Footer'
import Message from '../components/Message';
import { CANCEL } from '../constants/constants';
import {
  useDeleteOrderMutation,
  useGetMyOrdersQuery,
} from '../redux/query/ordersApiSlice';

const ConfirmScreen = () => {
  const { data: orders, isLoading, error, refetch } = useGetMyOrdersQuery();
  console.log(orders);
  const [deleteOrder] = useDeleteOrderMutation();

  const deleteHandler = async (id: string) => {
    if (window.confirm('Bạn có muốn xoá đơn hàng không')) {
      try {
        await deleteOrder(id);
        refetch();
      } catch (err) {
        displayErrorMessage(err);
      }
    }
  };

  return (
    <>
      <h1>Đơn hàng đã nhận</h1>
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
        <LinkContainer to={CANCEL} style={{ marginLeft: 10 }}>
          <Button className='btn-sm' variant='secondary'>
            Đơn hàng đã huỷ
          </Button>
        </LinkContainer>
      </td>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
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
              ?.filter((order:IOrder) => order.isConfirmed)
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

export default ConfirmScreen;
