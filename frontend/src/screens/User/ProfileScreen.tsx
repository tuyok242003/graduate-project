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
import { displayErrorMessage } from '../../components/Error';
import Loader from '../../components/Footer'
import Message from '../../components/Message';
import SearchProfile from '../../components/Search/SearchProfile';
import { CANCEL, CONFIRM, NOTRECEIVED, PROFILE, RECEIVED } from '../../constants/constants';
import {
  useCancelOrderMutation,
  useConfirmOrderMutation,
  useGetMyOrdersQuery,
} from '../../redux/query/ordersApiSlice';
import { useProfileMutation } from '../../redux/query/usersApiSlice';
import { setCredentials } from '../../redux/slices/authSlice';
import { IRegisterState } from './RegisterScreen';
import { UserScreenStyled } from './styled';
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
const getStatusIcon = (status?:boolean, successColor = 'green', failureColor = 'red') => {
  return status ? <FaCheck style={{ color: successColor }} /> : <FaTimes style={{ color: failureColor }} />;
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
 const formFields = [
    { controlId: 'name', label: 'Name', value: state.userName, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, userName: e.target.value }) },
    { controlId: 'email', label: 'Email Address', value: state.email, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, email: e.target.value }) },
    { controlId: 'password', label: 'Password', value: state.password, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, password: e.target.value }) },
    { controlId: 'confirmPassword', label: 'Confirm Password', value: state.confirmPassword, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, confirmPassword: e.target.value }) }
  ];
  return (
   <UserScreenStyled>
     <Row>
      <Col md={3}>
          <h2>User Profile</h2>
          <SearchProfile />
          <Form onSubmit={submitHandler}>
            {formFields.map(field => (
              <Form.Group key={field.controlId} className='my-2' controlId={field.controlId}>
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                  type={field.controlId === 'password' || field.controlId === 'confirmPassword' ? 'password' : 'text'}
                  placeholder={`Enter ${field.label}`}
                  value={field.value}
                  onChange={field.onChange}
                />
              </Form.Group>
            ))}

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
          <option value={NOTRECEIVED}>Đơn hàng chưa giao</option>
          <option value={RECEIVED}>Đơn hàng đã giao</option>
          <option value={CANCEL}>Đơn hàng đã huỷ</option>
          <option value={CONFIRM}>Đơn hàng đã nhận</option>
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
                    if (statusFromUrl === NOTRECEIVED) {
                      return !order.isDelivered && !order.isCancelled;
                    } else if (statusFromUrl === RECEIVED) {
                      return order.isDelivered;
                    } else if (statusFromUrl === CANCEL) {
                      return order.isCancelled;
                    } else if (statusFromUrl === CONFIRM) {
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
                        order.paidAt instanceof Date ? 
                          order.paidAt.toISOString().substring(0, 10)
                        : getStatusIcon(true)) : getStatusIcon(false)}
                    </td>
                     <td>{order.isDelivered ? (order.deliveredAt instanceof Date ? order.deliveredAt.toISOString().substring(0, 10) : getStatusIcon(true)) : getStatusIcon(false)}</td>
<td>{getStatusIcon(order.isConfirmed)}</td>
<td>{getStatusIcon(order.isCancelled)}</td>
                      <td>
                        <LinkContainer
                        className='container'
                          to={`/order/${order._id}`}
                        
                        >
                          <Button className='btn-sm' variant='light'>
                            <BiMessageAltDetail />
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
                          disabled={order.isCancelled || order.isDelivered}
                        >
                          <MdDeleteSweep />
                        </Button>
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
   </UserScreenStyled>
  );
};

export default ProfileScreen;
