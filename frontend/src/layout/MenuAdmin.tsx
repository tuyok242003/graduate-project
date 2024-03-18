import { CATEGORYLIST, CONTACTLIST, HOME, ORDERLIST, POSTLIST, PRODUCTLIST, USERLIST, VOUCHERLIST } from '../constants/constants';
import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { LayoutAdminStyled } from './styled';

const MenuAdmin = () => {
  return (
    //     <Dropdown.Menu show>
    //       <LinkContainer to='/admin/productlist'>
    //         <Dropdown.Item>Products</Dropdown.Item>
    //       </LinkContainer>
    //       <LinkContainer to='/admin/postList'>
    //         <Dropdown.Item>Posts</Dropdown.Item>
    //       </LinkContainer>
    //       <LinkContainer to='/admin/contactList'>
    //         <Dropdown.Item>Contact</Dropdown.Item>
    //       </LinkContainer>
    //       <LinkContainer to='/admin/orderlist'>
    //         <Dropdown.Item>Orders</Dropdown.Item>
    //       </LinkContainer>
    //       <LinkContainer to='/admin/categoryList'>
    //         <Dropdown.Item>Categories</Dropdown.Item>
    //       </LinkContainer>
    //       <LinkContainer to='/admin/userlist'>
    //         <Dropdown.Item>Users</Dropdown.Item>
    //       </LinkContainer>
    //     </Dropdown.Menu>
    //   )}

    <LayoutAdminStyled>
      <Navbar variant="dark" bg="primary" expand="lg">
        <Container fluid className="container">
          <Navbar.Brand href={HOME}>Trang chủ</Navbar.Brand>
          <Navbar.Brand href={PRODUCTLIST}>Sản phẩm</Navbar.Brand>
          <Navbar.Brand href={POSTLIST}>Bài viết</Navbar.Brand>
          <Navbar.Brand href={ORDERLIST}>Đơn hàng</Navbar.Brand>
          <Navbar.Brand href={CONTACTLIST}>Liên hệ</Navbar.Brand>
          <Navbar.Brand href={CATEGORYLIST}>Danh mục</Navbar.Brand>
          <Navbar.Brand href={VOUCHERLIST}>Voucher</Navbar.Brand>
          <Navbar.Brand href={USERLIST}>Người dùng</Navbar.Brand>
        </Container>
      </Navbar>
    </LayoutAdminStyled>
  );
};

export default MenuAdmin;
