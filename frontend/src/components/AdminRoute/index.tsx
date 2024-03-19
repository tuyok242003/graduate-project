import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LOGIN } from '@/constants/constants';
import { selectUserInfo } from '../../redux/slices/authSlice';
const AdminRoute = () => {
  const userInfo = useSelector(selectUserInfo);
  return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to={LOGIN} replace />;
};
export default AdminRoute;
