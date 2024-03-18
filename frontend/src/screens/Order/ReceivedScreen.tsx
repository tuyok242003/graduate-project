import { Button, Col, Row, Table } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader'
import Message from '../../components/Message';
import { displayErrorMessage } from '../../components/Error';
import {
  useConfirmOrderMutation,
  useGetMyOrdersQuery,
} from '../../redux/query/ordersApiSlice';
import { CANCEL, CONFIRM } from '../../constants/constants';
import { OrderScreenStyled } from './styled';
import { IButtonLink } from '@/interfaces/ButtonLink';

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
  const getStatusIcon = (status?:boolean, successColor = 'green', failureColor = 'red') => {
  return status ? <FaCheck style={{ color: successColor }} /> : <FaTimes style={{ color: failureColor }} />;
};
 const buttonLinks:IButtonLink[] = [
    { to: CANCEL, text: 'Đơn hàng đã huỷ', className: 'cancel' },
    { to: CONFIRM, text: 'Đơn hàng đã nhận', className: 'confirm' },
  ];
  return (
   <OrderScreenStyled>
     <Row>
      <Col md={9}>
        <h2>Đơn hàng đã giao</h2>
         {buttonLinks.map((link, index) => (
            <td key={index}>
              <LinkContainer to={link.to}>
                <Button className='btn-sm' variant='secondary'>
                  {link.text}
                </Button>
              </LinkContainer>
            </td>
          ))}
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
                        order.paidAt instanceof Date ? 
                          order.paidAt.toISOString().substring(0, 10)
                        : getStatusIcon(true)) : getStatusIcon(false)}
                    </td>
                     <td>{order.isDelivered ? (order.deliveredAt instanceof Date ? order.deliveredAt.toISOString().substring(0, 10) : getStatusIcon(true)) : getStatusIcon(false)}</td>
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
   </OrderScreenStyled>
  );
};

export default ReceivedScreen;
