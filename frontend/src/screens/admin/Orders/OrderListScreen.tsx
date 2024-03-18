import { useState } from 'react';
import { Button, Form, Pagination, Table } from 'react-bootstrap';
import { BiMessageAltDetail } from 'react-icons/bi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { MdDeleteSweep } from 'react-icons/md';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { displayErrorMessage } from '../../../components/Error';
import Loader from '../../../components/Footer';
import Message from '../../../components/Message';
import { ISCANCELLED, ISCONFIRM, ISRECEIVED } from '../../../constants/constants';
import { useDeleteOrderMutation, useGetOrdersQuery } from '../../../redux/query/apiSlice';
import { OrderStyled } from './styled';

const OrderListScreen = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [deleteOrder, { isLoading: loadingDelete }] = useDeleteOrderMutation();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const queryParams = new URLSearchParams(location.search);
  const statusFromUrl = queryParams.get('status') || 'all';
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
  const getStatusIcon = (status?: boolean, successColor = 'green', failureColor = 'red') => {
    return status ? <FaCheck style={{ color: successColor }} /> : <FaTimes style={{ color: failureColor }} />;
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders && Array.isArray(orders) ? orders.slice(indexOfFirstOrder, indexOfLastOrder) : [];
  const navigate = useNavigate();
  console.log(currentOrders);
  return (
    <OrderStyled>
      <>
        <h1>Orders</h1>
        <Form.Control
          as="select"
          value={statusFromUrl}
          onChange={(e) => navigate(`?status=${e.target.value}`)}
          style={{ marginBottom: 20 }}
        >
          <option value="all">Tất cả đơn hàng</option>
          <option value={ISRECEIVED}>Đơn hàng chưa giao</option>
          <option value={ISRECEIVED}>Đơn hàng đã giao</option>
          <option value={ISCANCELLED}>Đơn hàng đã huỷ</option>
          <option value={ISCONFIRM}>Đơn hàng đã nhận</option>
        </Form.Control>
        {loadingDelete && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
        ) : (
          <>
            <Table striped bordered hover responsive className="table-sm">
              <thead>
                <tr>
                  <th>Nguời dùng</th>
                  <th>Ngày</th>
                  <th>Tổng tiền</th>
                  <th>Trả tiền</th>
                  <th>Giao hàng</th>
                  <th>Nhận hàng</th>
                  <th>Huỷ hàng</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentOrders
                  ?.filter((order) => {
                    if (statusFromUrl === ISRECEIVED) {
                      return !order.isDelivered && !order.isCancelled;
                    } else if (statusFromUrl === '/admin/isReceived') {
                      return order.isDelivered;
                    } else if (statusFromUrl === ISCANCELLED) {
                      return order.isCancelled;
                    } else if (statusFromUrl === ISCONFIRM) {
                      return order.isConfirmed;
                    }
                    return true;
                  })
                  .map((order) => (
                    <tr key={order._id}>
                      <td>
                        {typeof order.user === 'object' && order.user !== null
                          ? 'name' in order.user
                            ? order.user.name || 'Unknown User'
                            : 'Unknown User'
                          : 'Unknown User'}
                      </td>
                      <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}</td>

                      <td>${order.totalPrice}</td>
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
                      <td>{getStatusIcon(order.isConfirmed)}</td>
                      <td>{getStatusIcon(order.isCancelled)}</td>

                      <td>
                        <LinkContainer to={`/admin/order/${order._id}`}>
                          <Button variant="light" className="btn-sm">
                            <BiMessageAltDetail />
                          </Button>
                        </LinkContainer>
                      </td>
                      <td>
                        <Button onClick={() => deleteHandler(order._id)} className="btn-sm" variant="danger">
                          <MdDeleteSweep />{' '}
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            <Pagination>
              {Array.from({
                length: Math.ceil((orders?.length || 0) / ordersPerPage) || 1,
              }).map((page, index) => (
                <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </>
        )}
      </>
    </OrderStyled>
  );
};

export default OrderListScreen;
