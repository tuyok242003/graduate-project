import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Button,
  Modal,
} from 'react-bootstrap';
import { PayPalButtons, usePayPalScriptReducer, SCRIPT_LOADING_STATE } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message, { MessageProps } from '../components/Message';
import Loader from '../components/Loader';
import React from 'react';
import { IUser } from '@/interfaces/User';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from '../slices/ordersApiSlice';
import { IOrder, IOrderItem } from '@/interfaces/Order';
const OrderScreen: React.FC = () => {
  const { id: orderId } = useParams<{ id: string }>();
  const [showPaymentSuccessBill, setShowPaymentSuccessBill] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state: { auth?: { userInfo: IUser } }) => state.auth) || {};
  const [paypalState, paypalDispatch] = usePayPalScriptReducer();
  const { isPending } = paypalState;
  const [isOrderPaid, setIsOrderPaid] = useState(false);

const orderItem = localStorage.getItem("selectedItems");


const dataOrder = order?.orderItems.filter((item:IOrder) => {
 return orderItem?.includes(item._id); 
});
console.log(dataOrder);

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();
  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && isPending) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': "AU8KNgaaUycpakPgyu__MDmoATKRmt--dr5sjfrLCR5nKdNdasPqN91_aB4lSygUNtY1qnjfz8T_go_r",
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: SCRIPT_LOADING_STATE.PENDING });
      };
      if (order && order.isPaid !== undefined) {
        setIsOrderPaid(order.isPaid);
      }

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, isPending, order, paypal, paypalDispatch]);
  const onApprove = async (data: Object, actions:any) => {
    const details: IOrder = await actions.order.capture();

    try {
      await payOrder({ orderId, details });
      const updatedOrder = await refetch();
      setIsOrderPaid(updatedOrder.data.isPaid);
      setShowPaymentSuccessBill(true);
      toast.success('Đơn hàng đã thanh toán');
    } catch (err) {
      const error = err as { data?: { message?: string }; error?: string };
      toast.error(error?.data?.message || error.error);
    }
  };

  const onError = (err: Record<string, unknown>) => {
    toast.error(err.message as string);
  };

  const createOrder = (data: Object, actions: any) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID: string) => {
        return orderID;
      });
  };



  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{(error as MessageProps).children}</Message>
  ) : (
    <>
      <h1>Order {order?._id}</h1>
     
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order?.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order?.user.email}`}>{order?.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order?.shippingAddress.address}, {order?.shippingAddress.city}{' '}
                {order?.shippingAddress.postalCode},{' '}
                {order?.shippingAddress.country}
              </p>

              {order?.isDelivered ? (
                <Message variant='success'>
                 Đã giao hàng {order?.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Chưa giao hàng</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order?.paymentMethod}
              </p>
              {order?.isPaid ? (
                <Message variant='success'>Đã thanh toán {order?.paidAt}</Message>
              ) : (
                <Message variant='danger'>Chưa thanh toán</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              <Row>
    <Col md={2}><strong>Ảnh</strong></Col>
    <Col md={3}><strong>Sản phẩm</strong></Col>

    <Col md={1} style={{width:100}}><strong>Số lượng</strong></Col>
    <Col md={2}><strong>Giá</strong></Col>
  
  </Row>
              {order?.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {dataOrder.map((item: IOrderItem, index: number) => (
                    <ListGroup.Item key={index}>
                      <Row>
                      <Col style={{marginRight:20}} md={2}>
                          <Image
                            src={item.images}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col md={3}>
                          <Link
                            style={{ textDecoration: 'none' }} to={`/product/${item.color}`}
                          
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={1}>
              <p >{item.qty}</p>
            </Col>
                        <Col md={4}>
                        ${(item.qty * (item.variant ? item.variant.price : item.price)).toFixed(2)} 
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
                  <Col>
      ${dataOrder.reduce((acc:number, item:IOrderItem) => acc + (item.qty * (item.variant ? item.variant.price : item.price)), 0).toFixed(2)}
    </Col>
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
              {!order?.isPaid && order?.paymentMethod === 'PayPal' && (
  <ListGroup.Item>
    {loadingPay && <Loader />}
    {isPending ? (
      <Loader />
    ) : (
      <div>
        <div>
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            onClick={handleShow}
          ></PayPalButtons>
        </div>
      </div>
    )}
  </ListGroup.Item>
)}

              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Cảm ơn bạn đã mua hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>
                    <strong>Order ID:</strong> {order?._id}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> ${order?.totalPrice}
                  </p>
                  <h3>Shipping Information:</h3>
                  <p>
                    <strong>Name:</strong> {order?.user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {order?.user.email}
                  </p>
                  <p>
                    <strong>Shipping Address:</strong>{' '}
                    {order?.shippingAddress.address},{' '}
                    {order?.shippingAddress.city}{' '}
                    {order?.shippingAddress.postalCode},{' '}
                    {order?.shippingAddress.country}
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant='secondary' onClick={handleClose}>
                    Đóng
                  </Button>
                </Modal.Footer>
              </Modal>

              {loadingDeliver && <Loader />}
              {userInfo?.isAdmin && order?.isPaid && !order?.isDelivered && (
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

export default OrderScreen;
