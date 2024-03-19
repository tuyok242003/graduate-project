import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { LOGIN } from '../constants/constants';
import { selectUserInfo } from '../redux/slices/authSlice';
const PrivateRoute = () => {
  const userInfo = useSelector(selectUserInfo);
  return userInfo ? <Outlet /> : <Navigate to={LOGIN} replace />;
};
export default PrivateRoute;
