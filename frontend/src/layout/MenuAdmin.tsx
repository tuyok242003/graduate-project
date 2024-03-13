import { CATEGORYLIST, CONTACTADD, CONTACTLIST, ORDERLIST, POSTLIST, PRODUCTLIST, USERLIST, VOUCHERLIST } from '../constants';
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
        <Navbar.Brand href={PRODUCTLIST}>Sản phẩm</Navbar.Brand>
        <Navbar.Brand href={POSTLIST}>Bài viết</Navbar.Brand>
        <Navbar.Brand href={ORDERLIST}>Đơn hàng</Navbar.Brand>
        <Navbar.Brand href={CONTACTLIST}>Liên hệ</Navbar.Brand>
        <Navbar.Brand href={CATEGORYLIST}>Danh mục</Navbar.Brand>
        <Navbar.Brand href={VOUCHERLIST}>Voucher</Navbar.Brand>
        <Navbar.Brand href={USERLIST}>Người dùng</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default MenuAdmin;
