import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import { resetCart } from '../slices/cartSlice';
import { User } from '@/interfaces/User';
interface CartItem {
  length:number
qty:number
reduce:number
}
const Header = () => {
  const { cartItems } = useSelector((state: {cart?:{cartItems:CartItem[]}}) => state.cart) || {};
  const { userInfo } = useSelector((state:{auth?:{userInfo:User}}) => state.auth) || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      localStorage.removeItem('cart');
      // Đặt lại giỏ hàng trong Redux state
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      <Navbar bg='primary' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              <LinkContainer to='/' style={{ paddingRight: 60 }}>
                <Navbar.Brand>TRANG CHỦ</Navbar.Brand>
              </LinkContainer>
              <LinkContainer to='/posts' style={{ paddingRight: 60 }}>
                <Navbar.Brand>BÀI VIẾT</Navbar.Brand>
              </LinkContainer>
              <LinkContainer to='/contact' style={{ paddingRight: 60 }}>
                <Navbar.Brand>LIÊN HỆ</Navbar.Brand>
              </LinkContainer>
              <SearchBox />
              { userInfo && (
              <LinkContainer to='/cart'>
                <Nav.Link>
                  <FaShoppingCart /> Cart
                  {cartItems && cartItems.length > 0 && (
                    <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                      {cartItems?.reduce((a: number, c: CartItem) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>)}
              {userInfo ? (
                <>
                  <NavDropdown title={userInfo.name} id='username'>
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/voucherList'>
                      <NavDropdown.Item>Voucher</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <FaUser /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}

              {userInfo && userInfo.isAdmin && (
                <LinkContainer to='/admin/productlist'>
                  <Nav.Link> Admin</Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
