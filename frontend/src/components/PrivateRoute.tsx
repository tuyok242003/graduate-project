import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IUser } from '@/interfaces/User';
import { LOGIN } from '../constants';

const PrivateRoute = () => {
  const { userInfo } =
    useSelector((state: { auth?: { userInfo: IUser } }) => state.auth) || {};
  return userInfo ? <Outlet /> : <Navigate to={LOGIN} replace />;
};
export default PrivateRoute;
