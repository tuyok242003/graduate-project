import { Button, Col, Row, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from '../../../components/Loader';
import { CANCEL, CONFIRM, RECEIVED } from '../../../constants/constants';
import { useGetOrdersQuery } from '../../../redux/query/apiSlice';
import { IsOrderStyled } from './styled';

const IsNotReceived = () => {
  const { isLoading, error } = useGetOrdersQuery();
  const buttonLinks = [
    { to: RECEIVED, text: 'Đơn hàng đã giao' },
    { to: CANCEL, text: 'Đơn hàng đã huỷ', className: 'cancel' },
    { to: CONFIRM, text: 'Đơn hàng đã nhận', className: 'confirm' },
  ];

  return (
    <IsOrderStyled>
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
          <Loader loading={isLoading} error={!!error} />
          <Table striped hover responsive className="table-sm">
            <thead>{/* Đặt tiêu đề ở đây */}</thead>
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
        </Col>
      </Row>
    </IsOrderStyled>
  );
};

export default IsNotReceived;
