import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IUser } from '../interfaces/OutShop';
import { LOGIN } from '../constants/constants';
const PrivateRoute = () => {
  const { userInfo } = useSelector((state: { auth?: { userInfo: IUser } }) => state.auth) || {};
  return userInfo ? <Outlet /> : <Navigate to={LOGIN} replace />;
};
export default PrivateRoute;
