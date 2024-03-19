import { Button, Table } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from '../../../components/Footer';
import Message from '../../../components/Message';
import { displayErrorMessage } from '../../../components/Error';
import { useDeleteOrderMutation, useGetOrdersQuery } from '../../../redux/query/apiSlice';
import { IsOrderStyled } from './styled';
const IsCancelled = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
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
    <IsOrderStyled>
      <>
        <h1>Đơn hàng bị huỷ</h1>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
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
                ? orders
                    ?.filter((order) => order.isCancelled)
                    .map((order) => (
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>
                          {typeof order.user === 'object' && order.user !== null
                            ? 'name' in order.user
                              ? order.user.name || 'Unknown User'
                              : 'Unknown User'
                            : 'Unknown User'}
                        </td>
                        <td>{order.createdAt instanceof Date ? order.createdAt.toISOString().substring(0, 10) : ''}</td>
                        <td>${order.totalPrice}</td>
                        <td>
                          {order.isPaid ? (
                            order.paidAt instanceof Date ? (
                              order.paidAt.toISOString().substring(0, 10)
                            ) : (
                              <FaCheck className="facheck" />
                            )
                          ) : (
                            <FaTimes className="fatimes" />
                          )}
                        </td>

                        <td>
                          <LinkContainer to={`/order/${order._id}`}>
                            <Button variant="light" className="btn-sm">
                              Details
                            </Button>
                          </LinkContainer>
                        </td>
                        <td>
                          <Button onClick={() => deleteHandler(order._id)} className="btn-sm" variant="light">
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                : null}
            </tbody>
          </Table>
        )}
      </>
    </IsOrderStyled>
  );
};

export default IsCancelled;
