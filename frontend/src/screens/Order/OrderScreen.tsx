import { IOrderItem } from '@/interfaces/Order';
import { IUser } from '@/interfaces/User';
import { CreateOrderActions, CreateOrderData, OnApproveActions, OnApproveData } from '@paypal/paypal-js';
import { PayPalButtons, SCRIPT_LOADING_STATE, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Image,
  ListGroup,
  Row,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { displayErrorMessage } from '../../components/Error';
import Loader from '../../components/Footer'
import Message from '../../components/Message';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from '../../redux/query/ordersApiSlice';
import { OrderScreenStyled } from './styled';
const OrderScreen: React.FC = () => {
  const { id: orderId } = useParams<{ id: string }>();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId || '');
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state: { auth?: { userInfo: IUser } }) => state.auth) || {};
  const [paypalState, paypalDispatch] = usePayPalScriptReducer();
  const { isPending } = paypalState;
  const [isOrderPaid, setIsOrderPaid] = useState(false);
const orderItem = localStorage.getItem("selectedItems");
const dataOrder = order?.orderItems.filter(item => {
 return orderItem?.includes(item._id); 
})
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
  const onApprove = async (data: OnApproveData, actions:OnApproveActions) => {
    const details = await actions.order?.capture();

    try {
      await payOrder({ orderId, details });
      const updatedOrder = await refetch();
      if (updatedOrder.data) {
        setIsOrderPaid(updatedOrder.data.isPaid);
      }
      
    
      toast.success('Đơn hàng đã thanh toán');
    } catch (err) {
      displayErrorMessage(err);
    }
  };

  const onError = (err: Record<string, unknown>) => {
    if(typeof err.message === "string")
    toast.error(err.message);
  };

  const createOrder = (data: CreateOrderData, actions: CreateOrderActions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order?.totalPrice },
          },
        ],
      })
      .then((orderID: string) => {
        return orderID;
      });
  };
  const deliverHandler = async () => {
    await deliverOrder(orderId || '');
    refetch();
  };
  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
  ) : (
  <OrderScreenStyled>
      <>
      <h1>Order {order?._id}</h1>
     
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order?.paymentMethod}
              </p>
              {order?.isPaid ? (
                <Message variant='success'>Đã thanh toán</Message>
              ) : (
                <Message variant='danger'>Chưa thanh toán</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              <Row>
    <Col md={2}><strong>Ảnh</strong></Col>
    <Col md={3}><strong>Sản phẩm</strong></Col>

    <Col md={1} className='qty'><strong>Số lượng</strong></Col>
    <Col md={2}><strong>Giá</strong></Col>
  
  </Row>
              {order?.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {dataOrder?.map((item: IOrderItem, index: number) => (
                    <ListGroup.Item key={index}>
                      <Row>
                      <Col className='img'  md={2}>
                          <Image
                            src={item.images}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col md={3}>
                          <Link
                             to={`/product/${item.color}`}
                          className='name-order'
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
      ${dataOrder?.reduce((acc:number, item:IOrderItem) => acc + (item.qty * (item.variant ? item.variant.price : item.price)), 0).toFixed(2)}
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
          
          ></PayPalButtons>
        </div>
      </div>
    )}
  </ListGroup.Item>
)}
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
  </OrderScreenStyled>
  );
};

export default OrderScreen;
