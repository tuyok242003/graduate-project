import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IUser } from '@/interfaces/User';

const PrivateRoute = () => {
  const { userInfo } = useSelector((state:{auth?:{userInfo:IUser}}) => state.auth) || {}
  return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
};
export default PrivateRoute;
