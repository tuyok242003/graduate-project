import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../redux/query/usersApiSlice';
import { logout } from '../../redux/slices/authSlice';
import SearchBox from '../Search/SearchBox';
import { resetCart } from '../../redux/slices/cartSlice';
import { IUser } from '@/interfaces/User';
import { CART, CONTACT, LOGIN, POST, PRODUCTLIST, PROFILE } from '../../constants/constants';
import { HeaderHome } from './styled';
interface ICartItem {
  length:number
qty:number
reduce:number
}
interface INavItem {
  key: string;
  title: string;
  link: string;
  icon?: JSX.Element;
}

const Header = () => {
  const { cartItems } = useSelector((state: {cart?:{cartItems:ICartItem[]}}) => state.cart) || {};
  const { userInfo } = useSelector((state:{auth?:{userInfo:IUser}}) => state.auth) || {};
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
      navigate(LOGIN);
    } catch (err) {
      console.error(err);
    }
  };
const navItems: INavItem[] = [
  { key: 'home', title: 'TRANG CHỦ', link: '/' },
  { key: 'post', title: 'BÀI VIẾT', link: POST },
  { key: 'contact', title: 'LIÊN HỆ', link: CONTACT },
];
  return (
    <header>
     <HeaderHome>
       <Navbar bg='primary' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto'>
                {navItems.map((item) => (
                  <LinkContainer key={item.key} to={item.link}>
                    <Nav.Link className='header'>{item.title}</Nav.Link>
                  </LinkContainer>
                ))}
              <SearchBox />
              { userInfo && (
              <LinkContainer to={CART}>
                <Nav.Link>
                  <FaShoppingCart /> Cart
                  {cartItems && cartItems.length > 0 && (
                    <Badge className='badge' pill bg='success' >
                      {cartItems?.reduce((item: number, cart: ICartItem) => item + cart.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>)}
              {userInfo ? (
                <>
                  <NavDropdown title={userInfo.userName} id='username'>
                    <LinkContainer to={PROFILE}>
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <LinkContainer to={LOGIN}>
                  <Nav.Link>
                    <FaUser /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}

              {userInfo && userInfo.isAdmin && (
                <LinkContainer to={PRODUCTLIST}>
                  <Nav.Link> Admin</Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
     </HeaderHome>
    </header>
  );
};

export default Header;
