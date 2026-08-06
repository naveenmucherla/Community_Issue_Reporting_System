import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Layout, Tag, Badge } from 'antd';
import {
  DashboardOutlined,
  FileAddOutlined,
  EnvironmentOutlined,
  UnorderedListOutlined,
  CheckCircleOutlined,
  UsergroupAddOutlined,
  BankOutlined,
  BarChartOutlined,
  StarOutlined,
  SettingOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES } from '../../utils/constants';

const { Sider } = Layout;

const Sidebar = ({ collapsed, onCollapse }) => {
  const location = useLocation();
  const { userRole, currentUser } = useAuth();

  // Navigation Items per Role
  const citizenItems = [
    {
      key: '/citizen',
      icon: <DashboardOutlined />,
      label: <Link to="/citizen">Citizen Overview</Link>
    },
    {
      key: '/report',
      icon: <FileAddOutlined />,
      label: <Link to="/report">Report New Issue</Link>
    },
    {
      key: '/citizen/complaints',
      icon: <UnorderedListOutlined />,
      label: <Link to="/citizen/complaints">My Complaints</Link>
    },
    {
      key: '/map',
      icon: <EnvironmentOutlined />,
      label: <Link to="/map">City Issue Map</Link>
    },
    {
      key: '/search',
      icon: <SearchOutlined />,
      label: <Link to="/search">Global Search</Link>
    }
  ];

  const officerItems = [
    {
      key: '/officer',
      icon: <DashboardOutlined />,
      label: <Link to="/officer">Officer Queue</Link>
    },
    {
      key: '/officer/resolutions',
      icon: <CheckCircleOutlined />,
      label: <Link to="/officer/resolutions">Resolved Work</Link>
    },
    {
      key: '/map',
      icon: <EnvironmentOutlined />,
      label: <Link to="/map">Dispatch Map</Link>
    },
    {
      key: '/search',
      icon: <SearchOutlined />,
      label: <Link to="/search">Search All Issues</Link>
    }
  ];

  const adminItems = [
    {
      key: '/admin',
      icon: <BarChartOutlined />,
      label: <Link to="/admin">Executive Analytics</Link>
    },
    {
      key: '/admin/users',
      icon: <UsergroupAddOutlined />,
      label: <Link to="/admin/users">Manage Citizens & Officers</Link>
    },
    {
      key: '/admin/departments',
      icon: <BankOutlined />,
      label: <Link to="/admin/departments">Municipal Departments</Link>
    },
    {
      key: '/map',
      icon: <EnvironmentOutlined />,
      label: <Link to="/map">Live City Map</Link>
    },
    {
      key: '/search',
      icon: <SearchOutlined />,
      label: <Link to="/search">Audit Database</Link>
    }
  ];

  const getMenuItems = () => {
    switch (userRole) {
      case USER_ROLES.ADMIN:
        return adminItems;
      case USER_ROLES.OFFICER:
        return officerItems;
      case USER_ROLES.CITIZEN:
      default:
        return citizenItems;
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      theme="light"
      width={240}
      style={{
        boxShadow: '2px 0 8px rgba(0,0,0,0.03)',
        zIndex: 10
      }}
    >
      <div style={{ padding: '16px 12px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>
        <Tag
          color={userRole === 'admin' ? 'purple' : userRole === 'officer' ? 'blue' : 'green'}
          style={{ width: '100%', textAlign: 'center', padding: '4px 0', fontSize: 11, fontWeight: 700 }}
        >
          {collapsed ? userRole.charAt(0).toUpperCase() : `${userRole.toUpperCase()} DASHBOARD`}
        </Tag>
        {!collapsed && currentUser?.department && (
          <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 4, fontWeight: 500 }}>
            {currentUser.department}
          </div>
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={getMenuItems()}
        style={{ borderRight: 0, marginTop: 8 }}
      />
    </Sider>
  );
};

export default Sidebar;
