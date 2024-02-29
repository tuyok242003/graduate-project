import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { User } from '@/interfaces/User';
const AdminRoute = () => {
  const { userInfo } = useSelector((state:{auth?:{userInfo:User}}) => state.auth) || {};
  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to='/login' replace />
  );
};
export default AdminRoute;
