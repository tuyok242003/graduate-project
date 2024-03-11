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

const { Header, Sider, Content } = Layout;

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className='logo' />
        <Menu theme='dark' mode='inline' defaultSelectedKeys={['1']}>
          <Menu.Item key='Dashboard' icon={<AiOutlineUser />}>
            <Link to='/admin/dashboard'>Dashboard</Link>
          </Menu.Item>
          <Menu.Item key='Product' icon={<AiOutlineVideoCamera />}>
            <Link to='/admin/product'>Product</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className='site-layout'>
        <Header className='site-layout-background' style={{ padding: 0 }}>
          <Button
            type='text'
            icon={collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenu />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
        </Header>
        <Content
          className='site-layout-background'
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
