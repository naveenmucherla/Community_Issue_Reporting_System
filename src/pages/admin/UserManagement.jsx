import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Select, Typography, Avatar, Modal, message, Popconfirm } from 'antd';
import { UserOutlined, EditOutlined, StopOutlined, CheckCircleOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { DEMO_PERSONAS, MUNICIPAL_DEPARTMENTS, USER_ROLES } from '../../utils/constants';

const { Title, Text } = Typography;
const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState(DEMO_PERSONAS);
  const [editingUser, setEditingUser] = useState(null);
  const [roleSelect, setRoleSelect] = useState('citizen');
  const [deptSelect, setDeptSelect] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleEdit = (u) => {
    setEditingUser(u);
    setRoleSelect(u.role);
    setDeptSelect(u.department || '');
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(prev =>
        prev.map(u =>
          u.id === editingUser.id ? { ...u, role: roleSelect, department: deptSelect } : u
        )
      );
      message.success(`Updated role for ${editingUser.name}`);
      setModalOpen(false);
    }
  };

  const handleToggleBan = (userId) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, banned: !u.banned } : u))
    );
    message.warning('User account status updated');
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <strong style={{ fontSize: 13 }}>{name}</strong>
            <div style={{ fontSize: 11, color: '#8c8c8c' }}>{record.email}</div>
          </div>
        </Space>
      )
    },
    {
      title: 'System Role',
      dataIndex: 'role',
      key: 'role',
      render: role => (
        <Tag color={role === 'admin' ? 'purple' : role === 'officer' ? 'blue' : 'green'}>
          {role.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: d => d || <Text type="secondary">N/A (Citizen)</Text>
    },
    {
      title: 'Account Status',
      dataIndex: 'banned',
      key: 'banned',
      render: banned => (
        <Tag color={banned ? 'error' : 'success'}>
          {banned ? 'BANNED' : 'ACTIVE'}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title={record.banned ? 'Unban user?' : 'Ban user?'} onConfirm={() => handleToggleBan(record.id)}>
            <Button type="text" danger icon={<StopOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>User & Officer Management</Title>
        <Text type="secondary">Assign roles, municipal departments, and moderate platform accounts</Text>
      </div>

      <Card style={{ borderRadius: 16 }}>
        <Table dataSource={users} columns={columns} rowKey="id" pagination={false} />
      </Card>

      <Modal
        title={`Edit Role & Permissions for ${editingUser?.name}`}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 12 }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 6 }}>Select System Role:</Text>
            <Select value={roleSelect} onChange={setRoleSelect} style={{ width: '100%' }}>
              <Option value={USER_ROLES.CITIZEN}>Citizen</Option>
              <Option value={USER_ROLES.OFFICER}>Department Officer</Option>
              <Option value={USER_ROLES.ADMIN}>Administrator</Option>
            </Select>
          </div>

          {roleSelect === USER_ROLES.OFFICER && (
            <div>
              <Text strong style={{ display: 'block', marginBottom: 6 }}>Assign Department:</Text>
              <Select value={deptSelect} onChange={setDeptSelect} style={{ width: '100%' }}>
                {MUNICIPAL_DEPARTMENTS.map(d => (
                  <Option key={d} value={d}>{d}</Option>
                ))}
              </Select>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
