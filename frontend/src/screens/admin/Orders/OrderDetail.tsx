import { IOrderItem } from '@/interfaces/Order';
import { IUser } from '@/interfaces/User';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Loader from '../../../components/Loader';
import Message from '../../../components/Message';
import { ORDERLIST } from '../../../constants';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
} from '../../../redux/query/ordersApiSlice';
const OrderDetail = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId  || '');
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } =
    useSelector((state: { auth?: { userInfo: IUser } }) => state.auth) || {};
  const [isOrderPaid, setIsOrderPaid] = useState(false);
  useEffect(() => {
    if (order && order.isPaid !== undefined) {
      setIsOrderPaid(order.isPaid);
    }
  }, [order]);
  const deliverHandler = async () => {
    await deliverOrder(orderId || '');
    refetch();
  };
  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
  ) : (
    <>
      <Link to={ORDERLIST} className='btn btn-light mb-4'>
        Go Back
      </Link>
      <h1>Order {order?._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              
              <p>
                <strong>Address:</strong>
                {order?.shippingAddress.address}, {order?.shippingAddress.city}{' '}
                {order?.shippingAddress.postalCode},{' '}
                {order?.shippingAddress.country}
              </p>
<p>{order?.voucher}</p>
              {order?.isDelivered ? (
                <Message variant='success'>
                Đã vận chuyển
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order?.paymentMethod}
              </p>
              {isOrderPaid ? (
                <Message variant='success'>Đã thanh toán</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order?.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order?.orderItems.map((item: IOrderItem, index: number) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.images}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order?.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order?.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order?.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {loadingDeliver && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order?.isPaid &&
                !order?.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderDetail;
