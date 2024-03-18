import { Button, Table } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from '../../components/Footer';
import Message from '../../components/Message';

import { displayErrorMessage } from '../../components/Error';
import { CONFIRM, NOTRECEIVED, RECEIVED } from '../../constants/constants';
import { useDeleteOrderMutation, useGetMyOrdersQuery } from '../../redux/query/apiSlice';
import { OrderScreenStyled } from './styled';
import { IButtonLink } from '../../interfaces/InShop';

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
        displayErrorMessage(err);
      }
    }
  };
  const buttonLinks: IButtonLink[] = [
    { to: NOTRECEIVED, text: 'Đơn hàng chưa giao', className: 'notreceived' },
    { to: RECEIVED, text: 'Đơn hàng đã giao', className: 'received' },
    { to: CONFIRM, text: 'Đơn hàng đã nhận', className: 'confirm' },
  ];
  return (
    <OrderScreenStyled>
      <>
        <h1>Đơn hàng bị huỷ</h1>
        {buttonLinks.map((link, index) => (
          <td key={index}>
            <LinkContainer to={link.to}>
              <Button className="btn-sm" variant="secondary">
                {link.text}
              </Button>
            </LinkContainer>
          </td>
        ))}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
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
                    <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</td>
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
                ))}
            </tbody>
          </Table>
        )}
      </>
    </OrderScreenStyled>
  );
};

export default CancelScreen;
