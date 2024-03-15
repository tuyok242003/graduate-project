// LayoutAdmin.js
import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  AiOutlineMenu,
  AiOutlineMenuUnfold,
  AiOutlineUser,
  AiOutlineVideoCamera,
} from 'react-icons/ai';
import { Link, Outlet } from 'react-router-dom';
import { ADMINPRODUCT, DASHBOARD } from '../constants/constants';

const { Header, Sider, Content } = Layout;

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className='layout-admin' >
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className='logo' />
        <Menu theme='dark' mode='inline' defaultSelectedKeys={['1']}>
          <Menu.Item key='1' icon={<AiOutlineUser />}>
            <Link to={DASHBOARD}>Dashboard</Link>
          </Menu.Item>
          <Menu.Item key='2' icon={<AiOutlineVideoCamera />}>
            <Link to={ADMINPRODUCT}>Product</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className='site-layout'>
        <Header className='site-layout-background'>
          <Button
            type='text'
            icon={collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenu />}
            onClick={() => setCollapsed(!collapsed)}     
          />
        </Header>
        <Content
          className='site-layout-background'
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
