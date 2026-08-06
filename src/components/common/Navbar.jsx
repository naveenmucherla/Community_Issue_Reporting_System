import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Space,
  Tag,
  Tooltip,
  Badge,
  Input,
  Drawer
} from 'antd';
import {
  SafetyCertificateOutlined,
  BulbOutlined,
  MoonOutlined,
  SunOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  EnvironmentOutlined,
  DashboardOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  CustomerServiceOutlined,
  SwapOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { DEMO_PERSONAS, USER_ROLES } from '../../utils/constants';
import NotificationPopover from '../notifications/NotificationPopover';
import AIChatDrawer from '../ai/AIChatDrawer';

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userRole, switchDemoPersona, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();

  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // Quick Persona switcher menu
  const personaMenuItems = DEMO_PERSONAS.map(persona => ({
    key: persona.id,
    label: (
      <div 
        onClick={() => switchDemoPersona(persona.id)} 
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}
      >
        <Avatar src={persona.avatar} size="small" icon={<UserOutlined />} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{persona.name}</div>
          <div style={{ fontSize: 11, color: '#8c8c8c' }}>
            <Tag color={persona.role === 'admin' ? 'purple' : persona.role === 'officer' ? 'blue' : 'green'} style={{ fontSize: 10, margin: 0 }}>
              {persona.role.toUpperCase()}
            </Tag>
          </div>
        </div>
      </div>
    )
  }));

  const userMenuItems = [
    {
      key: 'profile',
      label: (
        <div style={{ padding: '4px 0' }}>
          <div style={{ fontWeight: 600 }}>{currentUser?.name}</div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>{currentUser?.email}</div>
        </div>
      )
    },
    { type: 'divider' },
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'My Dashboard',
      onClick: () => {
        if (userRole === USER_ROLES.ADMIN) navigate('/admin');
        else if (userRole === USER_ROLES.OFFICER) navigate('/officer');
        else navigate('/citizen');
      }
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      label: 'Sign Out',
      onClick: logout
    }
  ];

  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        height: 74,
        lineHeight: 'normal',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 24px',
        background: isDarkMode ? 'rgba(20, 20, 20, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
      }}
    >
      {/* Brand Logo & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Button
          type="text"
          icon={<MenuOutlined />}
          className="mobile-menu-btn"
          style={{ display: 'none' }}
          onClick={() => setMobileMenuOpen(true)}
        />
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #1677FF 0%, #003A8C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 4px 10px rgba(22, 119, 255, 0.3)'
            }}
          >
            <SafetyCertificateOutlined style={{ fontSize: 22 }} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#fff' : '#1677FF', lineHeight: 1.1, letterSpacing: '-0.5px' }}>
              CivicFix
            </div>
            <div style={{ fontSize: 9, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Gov Issue Platform
            </div>
          </div>
        </Link>
      </div>

      {/* Main Navigation Links */}
      <Space size={20} className="desktop-nav-links" style={{ margin: '0 24px' }}>
        <Link to="/map" style={{ textDecoration: 'none' }}>
          <Button 
            type={location.pathname === '/map' ? 'primary' : 'text'} 
            icon={<EnvironmentOutlined />}
            style={{ borderRadius: 8 }}
          >
            Interactive Map
          </Button>
        </Link>
        <Link to="/search" style={{ textDecoration: 'none' }}>
          <Button 
            type={location.pathname === '/search' ? 'primary' : 'text'} 
            icon={<SearchOutlined />}
            style={{ borderRadius: 8 }}
          >
            Browse Issues
          </Button>
        </Link>
        <Link to="/report" style={{ textDecoration: 'none' }}>
          <Button 
            type="primary" 
            icon={<PlusCircleOutlined />}
            style={{ 
              background: 'linear-gradient(135deg, #1677FF 0%, #52C41A 100%)',
              border: 'none',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(82, 196, 26, 0.25)'
            }}
          >
            Report Issue
          </Button>
        </Link>
      </Space>

      {/* Right Controls: Persona Switcher, AI Assistant, Notifications, Theme, User Menu */}
      <Space size={12}>
        {/* Quick Role Switcher Dropdown */}
        <Dropdown menu={{ items: personaMenuItems }} placement="bottomRight" trigger={['click']}>
          <Tooltip title="Switch Persona (Citizen, Officer, Admin)">
            <Button
              type="dashed"
              size="small"
              icon={<SwapOutlined />}
              style={{ borderRadius: 6, fontSize: 12 }}
            >
              Role: <strong style={{ textTransform: 'capitalize', color: '#1677FF' }}>{userRole}</strong>
            </Button>
          </Tooltip>
        </Dropdown>

        {/* AI Municipal Assistant Button */}
        <Tooltip title="AI Municipal Assistant">
          <Button
            type="default"
            shape="circle"
            icon={<CustomerServiceOutlined style={{ color: '#1677FF' }} />}
            onClick={() => setAiChatOpen(true)}
            style={{ boxShadow: '0 2px 6px rgba(22, 119, 255, 0.15)' }}
          />
        </Tooltip>

        {/* Notifications Popover */}
        <NotificationPopover open={notifOpen} onOpenChange={setNotifOpen}>
          <Badge count={unreadCount} overflowCount={99}>
            <Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: 18 }} />} />
          </Badge>
        </NotificationPopover>

        {/* Dark/Light Mode Toggle */}
        <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <Button
            type="text"
            shape="circle"
            icon={isDarkMode ? <SunOutlined style={{ color: '#faad14' }} /> : <MoonOutlined />}
            onClick={toggleTheme}
          />
        </Tooltip>

        {/* User Account Avatar Menu */}
        {currentUser ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer', marginLeft: 6 }}>
              <Avatar
                src={currentUser.avatar}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1677FF', border: '2px solid #1677FF' }}
              />
              <span className="desktop-username" style={{ fontWeight: 600, fontSize: 14 }}>
                {currentUser.name.split(' ')[0]}
              </span>
            </Space>
          </Dropdown>
        ) : (
          <Space>
            <Link to="/login">
              <Button type="text">Log In</Button>
            </Link>
            <Link to="/register">
              <Button type="primary">Sign Up</Button>
            </Link>
          </Space>
        )}
      </Space>

      {/* AI Assistant Drawer */}
      <AIChatDrawer open={aiChatOpen} onClose={() => setAiChatOpen(false)} />
    </Header>
  );
};

export default Navbar;
