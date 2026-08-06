import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Typography, Popconfirm, Modal, Form, Input, Select, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useIssues } from '../../contexts/IssueContext';
import { StatusBadge, PriorityTag } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/helpers';
import { ISSUE_CATEGORIES } from '../../utils/constants';

const { Title, Text } = Typography;

const MyComplaints = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { issues, editIssue, deleteIssue } = useIssues();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [form] = Form.useForm();

  const myIssues = issues.filter(i => 
    i.createdBy?.uid === currentUser?.id || 
    i.createdBy?.uid === currentUser?.uid || 
    (currentUser?.email && i.createdBy?.email?.toLowerCase() === currentUser?.email?.toLowerCase()) ||
    currentUser?.id === 'demo-citizen-1'
  );

  const handleOpenEdit = (record) => {
    setEditingIssue(record);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      category: record.category
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = (values) => {
    if (editingIssue) {
      editIssue(editingIssue.id, values);
      message.success('Complaint report updated!');
      setEditModalOpen(false);
    }
  };

  const columns = [
    {
      title: 'Issue',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space>
          {record.images && record.images[0] && (
            <img src={record.images[0]} alt={text} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
          )}
          <div>
            <a onClick={() => navigate(`/issue/${record.id}`)} style={{ fontWeight: 600, color: '#1677FF' }}>{text}</a>
            <div style={{ fontSize: 11, color: '#8c8c8c' }}>
              <EnvironmentOutlined /> {record.address}
            </div>
          </div>
        </Space>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: cat => <Tag color="cyan">{cat}</Tag>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => <StatusBadge status={status} />
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: priority => <PriorityTag priority={priority} />
    },
    {
      title: 'Reported Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => formatDate(date, 'MMM D, YYYY')
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} onClick={() => navigate(`/issue/${record.id}`)} />
          {record.status === 'PENDING' && (
            <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenEdit(record)} />
          )}
          <Popconfirm title="Delete complaint?" onConfirm={() => deleteIssue(record.id)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>My Submitted Complaints</Title>
          <Text type="secondary">Manage your reported public infrastructure issues</Text>
        </div>
        <Button type="primary" icon={<PlusCircleOutlined />} size="large" onClick={() => navigate('/report')}>
          Report New Issue
        </Button>
      </div>

      <Card style={{ borderRadius: 16 }}>
        <Table dataSource={myIssues} columns={columns} rowKey="id" pagination={{ pageSize: 8 }} />
      </Card>

      <Modal
        title="Edit Complaint Information"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveEdit}>
          <Form.Item name="title" label="Issue Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Category">
            <Select>
              {ISSUE_CATEGORIES.map(c => <Select.Option key={c.value} value={c.value}>{c.label}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MyComplaints;
