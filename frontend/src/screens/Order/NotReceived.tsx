import { Button, Col, Row, Table } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { IOrder } from '../../interfaces/OutShop';
import { displayErrorMessage } from '../../components/Error';
import { useCancelOrderMutation, useGetMyOrdersQuery } from '../../redux/query/apiSlice';
import { CANCEL, CONFIRM } from '../../constants/constants';
import { OrderScreenStyled } from './styled';
import { IButtonLink } from '../../interfaces/InShop';

const NotReceivedScreen = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  const [cancelOrder] = useCancelOrderMutation();

  const CancelHandler = async (id: string, isDelivered: boolean) => {
    if (isDelivered) {
      toast.error('Không thể huỷ đơn hàng đã được giao');
      return;
    }

    const cancelMessage = 'Bạn có muốn huỷ đơn hàng!!!';
    if (window.confirm(cancelMessage)) {
      try {
        await cancelOrder(id);
        toast.success('Đơn hàng đã huỷ thành công');
      } catch (err) {
        displayErrorMessage(err);
      }
    }
  };
  const getStatusIcon = (status?: boolean, successColor = 'green', failureColor = 'red') => {
    return status ? <FaCheck style={{ color: successColor }} /> : <FaTimes style={{ color: failureColor }} />;
  };
  const buttonLinks: IButtonLink[] = [
    { to: CONFIRM, text: 'Đơn hàng đã nhận', className: 'confirm' },
    { to: CANCEL, text: 'Đơn hàng đã huỷ', className: 'cancel' },
  ];
  return (
    <OrderScreenStyled>
      <Row>
        <Col md={9}>
          <h2>Đơn hàng chưa giao</h2>
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
            <Table striped hover responsive className="table-sm">
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
                  ?.filter((order: IOrder) => !order.isDelivered)
                  .map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</td>
                      <td>{order.totalPrice}</td>
                      <td>
                        {order.isPaid
                          ? order.paidAt instanceof Date
                            ? order.paidAt.toISOString().substring(0, 10)
                            : getStatusIcon(true)
                          : getStatusIcon(false)}
                      </td>
                      <td>
                        {order.isDelivered
                          ? order.deliveredAt instanceof Date
                            ? order.deliveredAt.toISOString().substring(0, 10)
                            : getStatusIcon(true)
                          : getStatusIcon(false)}
                      </td>
                      <td>
                        <LinkContainer to={`/order/${order._id}`}>
                          <Button className="btn-sm" variant="light">
                            Chi tiết
                          </Button>
                        </LinkContainer>
                      </td>
                      <td>
                        <Button
                          onClick={() => CancelHandler(order._id, order.isDelivered)}
                          className="btn-sm"
                          variant="light"
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
    </OrderScreenStyled>
  );
};

export default NotReceivedScreen;
