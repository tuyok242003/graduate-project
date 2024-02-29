import React from 'react';
import { Container, Navbar } from 'react-bootstrap';

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

    <Navbar variant='dark' bg='primary' expand='lg'>
      <Container fluid style={{ paddingRight: 150 }}>
        <Navbar.Brand href='/'>Trang chủ</Navbar.Brand>
        <Navbar.Brand href='/admin/productlist'>Sản phẩm</Navbar.Brand>
        <Navbar.Brand href='/admin/postList'>Bài viết</Navbar.Brand>
        <Navbar.Brand href='/admin/orderlist'>Đơn hàng</Navbar.Brand>
        <Navbar.Brand href='/admin/contactList'>Liên hệ</Navbar.Brand>
        <Navbar.Brand href='/admin/categoryList'>Danh mục</Navbar.Brand>
        <Navbar.Brand href='/admin/voucherList'>Voucher</Navbar.Brand>
        <Navbar.Brand href='/admin/userlist'>Người dùng</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default MenuAdmin;
