import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Outlet, Route, useLocation, Routes } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageUpload from './components/ImageUpload';
import './assets/styles/bootstrap.custom.css';

import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import MenuAdmin from './layout/MenuAdmin';
import CancelScreen from './screens/Order/CancelScreen';
import CartScreen from './screens/Cart/CartScreen';
import ConfirmScreen from './screens/Order/ConfirmScreen';
import ContactScreen from './screens/Contact/ContactScreen';
import ForgotPassword from './screens/User/ForgotPassword';
import HomeScreen from './screens/Home/HomeScreen';
import LoginScreen from './screens/User/LoginScreen';
import NotReceivedScreen from './screens/Order/NotReceived';
import OrderScreen from './screens/Order/OrderScreen';
import PaymentScreen from './screens/Payment/PaymentScreen';
import PlaceOrderScreen from './screens/Order/PlaceOrderScreen';
import PostDetail from './screens/Post/PostDetail';
import PostScreen from './screens/Post/PostScreen';
import ProductScreen from './screens/Product/ProductScreen';
import ProfileScreen from './screens/User/ProfileScreen';
import ReceivedScreen from './screens/Order/ReceivedScreen';
import RegisterScreen from './screens/User/RegisterScreen';
import ShippingScreen from './screens/Shipping/ShippingScreen';
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
import { logout } from './redux/slices/authSlice';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import VoucherListScreen from './screens/admin/Vouchers/VoucherListScreen';
import VoucherAddScreen from './screens/admin/Vouchers/VoucherAdd';
import VoucherEditScreen from './screens/admin/Vouchers/VoucherEdit';
import VoucherScreen from './screens/Voucher/VoucherScreen';

import NotFoundScreen from './screens/NotFound/NotFoundScreen';
import {
  CANCEL,
  CART,
  CATEGORYADD,
  CATEGORYEDIT,
  CATEGORYLIST,
  CONFIRM,
  CONTACT,
  CONTACTADD,
  CONTACTLIST,
  FORGOTPASSWORD,
  HOME,
  HOMESCREEN,
  ISCANCELLED,
  ISCONFIRM,
  ISNOTRECEIVED,
  ISRECEIVED,
  LOGIN,
  NOTFOUND,
  NOTRECEIVED,
  ORDERDETAIL,
  ORDERLIST,
  ORDERSCREEN,
  PAYMENT,
  PLACEORDER,
  POST,
  POSTADD,
  POSTDETAIL,
  POSTEDIT,
  POSTLIST,
  PRODUCTADD,
  PRODUCTADMINDETAIL,
  PRODUCTEDITSCREEN,
  PRODUCTLIST,
  PRODUCTLISTSCREEN,
  PRODUCTSCREEN,
  PROFILE,
  PROFILESCREEN,
  RECEIVED,
  REGISTER,
  SEARCH,
  SEARCHHOME,
  SHIPPING,
  UPLOAD,
  USEREDIT,
  USERLIST,
  VARRIANTADD,
  VOUCHER,
  VOUCHERADD,
  VOUCHEREDIT,
  VOUCHERLIST,
} from './constants/constants';

const router = (
  <Routes>
    <Route index path={HOME} element={<HomeScreen />} />
    <Route path={SEARCH} element={<HomeScreen />} />
    <Route path={HOMESCREEN} element={<HomeScreen />} />
    <Route path={SEARCHHOME} element={<HomeScreen />} />
    <Route path={PRODUCTSCREEN} element={<ProductScreen />} />
    <Route path={CART} element={<CartScreen />} />

    <Route path={LOGIN} element={<LoginScreen />} />
    <Route path={REGISTER} element={<RegisterScreen />} />
    <Route path={FORGOTPASSWORD} element={<ForgotPassword />} />
    {/* Registered users */}
    <Route path="" element={<PrivateRoute />}>
      <Route path={SHIPPING} element={<ShippingScreen />} />
      <Route path={VOUCHER} element={<VoucherScreen />} />
      <Route path={PAYMENT} element={<PaymentScreen />} />
      <Route path={PLACEORDER} element={<PlaceOrderScreen />} />
      <Route path={ORDERSCREEN} element={<OrderScreen />} />
      <Route path={PROFILE} element={<ProfileScreen />} />
      <Route path={PROFILESCREEN} element={<ProfileScreen />} />
      <Route path={CONTACT} element={<ContactScreen />} />
      <Route path={POST} element={<PostScreen />} />
      <Route path={POSTDETAIL} element={<PostDetail />} />
      <Route path={UPLOAD} element={<ImageUpload />} />
      <Route path={CANCEL} element={<CancelScreen />} />
      <Route path={CONFIRM} element={<ConfirmScreen />} />
      <Route path={RECEIVED} element={<ReceivedScreen />} />
      <Route path={NOTRECEIVED} element={<NotReceivedScreen />} />
    </Route>
    {/* Admin users */}
    <Route path="">
      <Route path={ORDERLIST} element={<OrderListScreen />} />
      <Route path={ISCANCELLED} element={<IsCancelled />} />
      <Route path={VOUCHEREDIT} element={<VoucherEditScreen />} />
      <Route path={PRODUCTLIST} element={<ProductListScreen />} />
      <Route path={PRODUCTLISTSCREEN} element={<ProductListScreen />} />
      <Route path={VARRIANTADD} element={<CustomizeVarriant />} />
      <Route path={USERLIST} element={<UserListScreen />} />
      <Route path={PRODUCTADD} element={<ProductAddScreen />} />
      <Route path={POSTADD} element={<PostAddScreen />} />
      <Route path={POSTLIST} element={<PostListScreen />} />
      <Route path={POSTEDIT} element={<PostEditScreen />} />
      <Route path={ISCONFIRM} element={<IsConfirm />} />
      <Route path={ISRECEIVED} element={<IsReceived />} />
      <Route path={ISNOTRECEIVED} element={<IsNotReceived />} />
      <Route path={CONTACTLIST} element={<ContactListScreen />} />
      <Route path={CONTACTADD} element={<ContactAddScreen />} />
      <Route path={PRODUCTADMINDETAIL} element={<ProductDetail />} />
      <Route path={ORDERDETAIL} element={<OrderDetail />} />
      <Route path={CATEGORYLIST} element={<CategoryListScreen />} />
      <Route path={CATEGORYADD} element={<CategoryAdd />} />
      <Route path={CATEGORYEDIT} element={<CategoryEditScreen />} />
      <Route path={VOUCHERLIST} element={<VoucherListScreen />} />
      <Route path={VOUCHERADD} element={<VoucherAddScreen />} />
      <Route path={PRODUCTEDITSCREEN} element={<ProductEditScreen />} />
      <Route path={USEREDIT} element={<UserEditScreen />} />
    </Route>
    <Route path={NOTFOUND} element={<NotFoundScreen />} />
  </Routes>
);
const paypalOptions = {
  'client-id': 'AU8KNgaaUycpakPgyu__MDmoATKRmt--dr5sjfrLCR5nKdNdasPqN91_aB4lSygUNtY1qnjfz8T_go_r',
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
        <main className="py-3">
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
