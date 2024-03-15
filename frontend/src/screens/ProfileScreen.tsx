import { IUser } from '@/interfaces/User';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { BiMessageAltDetail } from 'react-icons/bi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { MdCallReceived, MdDeleteSweep } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { displayErrorMessage } from '../components/Error';
import Loader from '../components/Loader';
import Message from '../components/Message';
import SearchProfile from '../components/SearchProfile';
import { PROFILE } from '../constants';
import {
  useCancelOrderMutation,
  useConfirmOrderMutation,
  useGetMyOrdersQuery,
} from '../redux/query/ordersApiSlice';
import { useProfileMutation } from '../redux/query/usersApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import { IRegisterState } from './RegisterScreen';
const ProfileScreen = () => {
  const [state,setState]= useState<IRegisterState>({
    userName:'',
    email:'',
    password:'',
    confirmPassword:''
    })
  const { userInfo } =
    useSelector((state: { auth?: { userInfo: IUser } }) => state.auth) || {};
  const navigate = useNavigate();
  const { data: orders, isLoading, error, refetch } = useGetMyOrdersQuery();
  const [confirmlOrder] = useConfirmOrderMutation();
  const [cancelOrder] = useCancelOrderMutation();
  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const statusFromUrl = queryParams.get('status') || 'all';
  const CancelHandler = async (id: string, isDelivered: boolean) => {
    if (isDelivered) {
      toast.error('Không thể huỷ đơn hàng đã được giao');
      return;
    }

    const cancelMessage = 'Bạn có muốn huỷ đơn hàng!!!';
    if (window.confirm(cancelMessage)) {
      try {
        await cancelOrder(id);

     
        refetch();
        navigate(PROFILE);
           toast.success('Đơn hàng đã huỷ thành công');
      } catch (err) {
        displayErrorMessage(err);
      }
    }
  };

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
      
        refetch();
          navigate('/');
        toast.success('Đơn hàng đã được nhận thành công');
      } catch (err) {
        displayErrorMessage(err);
      }
    }
  };

  useEffect(() => {
    setState({...state,userName:userInfo?.userName ?? '',email:userInfo?.email ?? ''});
   
  }, [state, userInfo?.email, userInfo?.userName]);

  const dispatch = useDispatch();
  const submitHandler = async (profile: React.FormEvent<HTMLFormElement>) => {
    profile.preventDefault();
    if (state.password !== state.confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({
         userName: state.userName,
         email: state.email,
         password:state.password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Profile updated successfully');
      } catch (err) {
        displayErrorMessage(err);
      }
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
<SearchProfile/>
        <Form onSubmit={submitHandler}>
          <Form.Group className='my-2' controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter name'
              value={state.userName}
              onChange={(e) => setState({...state,userName:e.target.value})}
            ></Form.Control>
          </Form.Group>

          <Form.Group className='my-2' controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={state.email}
              onChange={(e) => setState({...state,email:e.target.value})}
            ></Form.Control>
          </Form.Group>

          <Form.Group className='my-2' controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={state.password}
              onChange={(e) => setState({...state,password:e.target.value})}
            ></Form.Control>
          </Form.Group>

          <Form.Group className='my-2' controlId='confirmPassword'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              value={state.confirmPassword}
              onChange={(e) => setState({...state,confirmPassword:e.target.value})}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary'>
            Update
          </Button>
          {loadingUpdateProfile && <Loader />}
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        <Form.Control
          as='select'
          value={statusFromUrl}
          onChange={(e) => navigate(`/profile?status=${e.target.value}`)}
        >
          <option value='all'>Tất cả đơn hàng</option>
          <option value='notReceived'>Đơn hàng chưa giao</option>
          <option value='received'>Đơn hàng đã giao</option>
          <option value='cancel'>Đơn hàng đã huỷ</option>
          <option value='confirm'>Đơn hàng đã nhận</option>
        </Form.Control>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>Đã xảy ra lỗi.Vui lòng thử lại sau</Message>
        ) : (
          <>
            <Table striped hover responsive className='table-sm'>
              <thead>
                <tr>
                  <th>ID</th>
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
                {orders
                  ?.filter((order) => {
                    if (statusFromUrl === 'notReceived') {
                      return !order.isDelivered && !order.isCancelled;
                    } else if (statusFromUrl === 'received') {
                      return order.isDelivered;
                    } else if (statusFromUrl === 'cancel') {
                      return order.isCancelled;
                    } else if (statusFromUrl === 'confirm') {
                      return order.isConfirmed;
                    }
                    return true;
                  })
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
                          <FaCheck style={{ color: 'green' }} />
                        ) : (
                          <FaTimes style={{ color: 'red' }} />
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
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
                        {order.isConfirmed ? (
                          <FaCheck style={{ color: 'green' }} />
                        ) : (
                          <FaTimes style={{ color: 'red' }} />
                        )}
                      </td>
                      <td>
                        {order.isCancelled ? (
                          <FaCheck style={{ color: 'green' }} />
                        ) : (
                          <FaTimes style={{ color: 'red' }} />
                        )}
                      </td>
                      <td>
                        <LinkContainer
                          to={`/order/${order._id}`}
                          style={{ marginTop: 10 }}
                        >
                          <Button className='btn-sm' variant='light'>
                            <BiMessageAltDetail />
                          </Button>
                        </LinkContainer>
                      </td>
                      <td>
                        <Button
                          style={{ marginTop: 10 }}
                          onClick={() =>
                            CancelHandler(order._id, order.isDelivered)
                          }
                          className='btn-sm'
                          variant='light'
                          disabled={order.isCancelled || order.isDelivered}
                        >
                          <MdDeleteSweep />
                        </Button>
                      </td>
                      <td>
                        <Button
                          style={{ marginTop: 10 }}
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
                          <MdCallReceived />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
