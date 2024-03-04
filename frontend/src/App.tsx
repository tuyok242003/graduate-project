import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import {
  Outlet,
  Route,
  useLocation,
  Routes
} from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageUpload from './ImageUpload';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';
import Footer from './components/Footer';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import MenuAdmin from './layout/MenuAdmin';
import CancelScreen from './screens/CancelScreen';
import CartScreen from './screens/CartScreen';
import ConfirmScreen from './screens/ConfirmScreen';
import ContactScreen from './screens/ContactScreen';
import ForgotPassword from './screens/ForgotPassword';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import NotReceivedScreen from './screens/NotReceived';
import OrderScreen from './screens/OrderScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import PostDetail from './screens/PostDetail';
import PostScreen from './screens/PostScreen';
import ProductScreen from './screens/ProductScreen';
import ProfileScreen from './screens/ProfileScreen';
import ReceivedScreen from './screens/ReceivedScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import CategoryAdd from './screens/admin/Categories/CategoryAdd';
import CategoryEditScreen from './screens/admin/Categories/CategoryEdit';
import CategoryListScreen from './screens/admin/Categories/CategoryList';
import ContactAddScreen from './screens/admin/Contacts/ContactAddScreen';
import ContactListScreen from './screens/admin/Contacts/ContactListScreen';
import CustomizeVarriant from './screens/admin/Products/CustomizeVarriant';
import IsCancelled from './screens/admin/IsOrder/IsCancelled';
import IsConfirm from './screens/admin/IsOrder/IsConfirm';
import IsReceived from './screens/admin/IsOrder/IsReceived';
import OrderDetail from './screens/admin/Orders/OrderDetail';
import OrderListScreen from './screens/admin/Orders/OrderListScreen';
import PostAddScreen from './screens/admin/Posts/PostAddScreen';
import PostEditScreen from './screens/admin/Posts/PostEditScreen';
import PostListScreen from './screens/admin/Posts/PostListScreen';
import ProductAddScreen from './screens/admin/Products/ProductAddScreen';
import ProductDetail from './screens/admin/Products/ProductDetail';
import ProductEditScreen from './screens/admin/Products/ProductEditScreen';
import ProductListScreen from './screens/admin/Products/ProductListScreen';
import UserEditScreen from './screens/admin/Users/UserEditScreen';
import UserListScreen from './screens/admin/Users/UserListScreen';
import IsNotReceived from './screens/admin/IsOrder/isNotReceived';
import { logout } from './slices/authSlice';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import VoucherListScreen from './screens/admin/Vouchers/VoucherListScreen';
import VoucherAddScreen from './screens/admin/Vouchers/VoucherAdd';
import VoucherEditScreen from './screens/admin/Vouchers/VoucherEdit';
import VoucherScreen from './screens/VoucherScreen';
import VoucherList from './components/Voucher';
import NotFoundScreen from './screens/NotFoundScreen';
const router = (
  <Routes>
    <Route index path='/' element={<HomeScreen />} />
    <Route path='/search/:keyword' element={<HomeScreen />} />
    <Route path='/page/:pageNumber' element={<HomeScreen />} />
    <Route path='/search/:keyword/page/:pageNumber' element={<HomeScreen />} />
    <Route path='/product/:id' element={<ProductScreen />} />
    <Route path='/cart' element={<CartScreen />} />
   
    <Route path='/login' element={<LoginScreen />} />
    <Route path='/register' element={<RegisterScreen />} />
    <Route path='/forgotPassword' element={<ForgotPassword />} />
    {/* Registered users */}
    <Route path='' element={<PrivateRoute />}>
    <Route path='/voucherList' element={<VoucherList />} />
      <Route path='/shipping' element={<ShippingScreen />} />
      <Route path='/voucher' element={<VoucherScreen />} />
      <Route path='/payment' element={<PaymentScreen />} />
      <Route path='/placeorder' element={<PlaceOrderScreen />} />
      <Route path='/order/:id' element={<OrderScreen />} />
      <Route path='/profile' element={<ProfileScreen />} />
      <Route path='/searchProfile/:keyword' element={<ProfileScreen />} />
      <Route path='/contact' element={<ContactScreen />} />
      <Route path='/posts' element={<PostScreen />} />
      <Route path='/post/:postId' element={<PostDetail />} />
      <Route path='/upload' element={<ImageUpload />} />
      <Route path='/cancel' element={<CancelScreen />} />
      <Route path='/confirm' element={<ConfirmScreen />} />
      <Route path='/received' element={<ReceivedScreen />} />
      <Route path='/notReceived' element={<NotReceivedScreen />} />
    </Route>
    {/* Admin users */}
    <Route path=''>
      <Route path='/admin/orderlist' element={<OrderListScreen />} />
      <Route path='/admin/isCancelled' element={<IsCancelled />} />
      <Route path='/admin/voucher/:id' element={<VoucherEditScreen />} />
      <Route path='/admin/productlist' element={<ProductListScreen />} />
      <Route
        path='/admin/productlist/:pageNumber'
        element={<ProductListScreen />}
      />
      <Route path='/admin/varriant/:id/add' element={<CustomizeVarriant />} />
      <Route path='/admin/userlist' element={<UserListScreen />} />
      <Route path='/admin/product/add' element={<ProductAddScreen />} />
      <Route path='/admin/post/add' element={<PostAddScreen />} />
      <Route path='/admin/postList' element={<PostListScreen />} />
      <Route path='/admin/post/:id/edit' element={<PostEditScreen />} />
      <Route path='/admin/isConfirm' element={<IsConfirm />} />
      <Route path='/admin/isReceived' element={<IsReceived />} />
      <Route path='/admin/isNotReceived' element={<IsNotReceived />} />
      <Route path='/admin/contactList' element={<ContactListScreen />} />
      <Route path='/admin/contact/add' element={<ContactAddScreen />} />
      <Route path='/admin/contact/add' element={<ContactAddScreen />} />
      <Route path='/admin/product/:id' element={<ProductDetail />} />
      <Route path='/admin/order/:id' element={<OrderDetail />} />
      <Route path='/admin/categoryList' element={<CategoryListScreen />} />
      <Route path='/admin/category/add' element={<CategoryAdd />} />
      <Route path='/admin/category/:id/edit' element={<CategoryEditScreen />} />
      <Route path='/admin/voucherList' element={<VoucherListScreen />} />
      <Route path='/admin/voucher/add' element={<VoucherAddScreen />} />
      <Route path='/admin/product/:id/edit' element={<ProductEditScreen />} />
      <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
    </Route>
    <Route path='*' element={<NotFoundScreen />} />
  </Routes>
);
const paypalOptions = {
  'client-id':
    'AU8KNgaaUycpakPgyu__MDmoATKRmt--dr5sjfrLCR5nKdNdasPqN91_aB4lSygUNtY1qnjfz8T_go_r',
  currency: 'USD',
};
const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const expirationTime = localStorage.getItem('expirationTime');
    if (expirationTime) {
      const currentTime = new Date().getTime();
      if (currentTime > parseInt(expirationTime, 10)) {
        dispatch(logout());
      }
    }
  }, [dispatch]);

  const isAdminRoute = location.pathname.startsWith('/admin');
  const showHeader = !isAdminRoute;
  const showAdmin = isAdminRoute;

  return (
    <PayPalScriptProvider options={paypalOptions}>
    <>
      <ToastContainer />
      {showHeader && <Header />}
      {showAdmin && <MenuAdmin />}
      <main className='py-3'>
        <Container>
          {router}
          <Outlet />
        </Container>
      </main>
      <Footer />
    </>
    </PayPalScriptProvider>
  );
};

export default App;
