import { Button, Col, Row, Table } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from '../../../components/Loader';
import { CANCEL, CONFIRM, NOTRECEIVED } from '../../../constants/constants';
import { IOrder } from '../../../interfaces/OutShop';
import { useGetOrdersQuery } from '../../../redux/query/apiSlice';

const IsReceived = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const getStatusIcon = (status?: boolean) => {
    return status ? <FaCheck className="facheck" /> : <FaTimes className="fatimes" />;
  };
  const buttonLinks = [
    { to: NOTRECEIVED, text: 'Đơn hàng chưa giao', className: 'notreceived' },
    { to: CANCEL, text: 'Đơn hàng đã huỷ', className: 'cancel' },
    { to: CONFIRM, text: 'Đơn hàng đã nhận', className: 'confirm' },
  ];
  return (
    <Row>
      <Col md={9}>
        <h2>Đơn hàng đã giao</h2>
        {buttonLinks.map((link, index) => (
          <td key={index}>
            <LinkContainer to={link.to}>
              <Button className="btn-sm" variant="secondary">
                {link.text}
              </Button>
            </LinkContainer>
          </td>
        ))}
        <Loader loading={isLoading} error={!!error} />
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVEREDĐ</th>

              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders
              ?.filter((order: IOrder) => order.isDelivered)
              .map((order: IOrder) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td> {order.createdAt instanceof Date ? order.createdAt.toISOString().substring(0, 10) : ''}</td>
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
                </tr>
              ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default IsReceived;
