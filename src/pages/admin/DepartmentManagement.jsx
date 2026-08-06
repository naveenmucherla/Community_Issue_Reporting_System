import React, { useState } from 'react';
import { Card, Table, Tag, Button, Typography, Modal, Form, Input, Space, message } from 'antd';
import { BankOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useIssues } from '../../contexts/IssueContext';

const { Title, Text } = Typography;

const DepartmentManagement = () => {
  const { departments } = useIssues();
  const [deptList, setDeptList] = useState(departments);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAddDept = (values) => {
    const newDept = {
      id: `dept-${Date.now()}`,
      name: values.name,
      head: values.head,
      officersCount: Number(values.officersCount) || 5,
      activeComplaints: 0,
      resolvedComplaints: 0,
      avgResolutionDays: 2.0,
      email: values.email
    };
    setDeptList(prev => [...prev, newDept]);
    message.success(`Added ${values.name}`);
    setModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Department Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <strong style={{ color: '#1677FF' }}>{text}</strong>
    },
    {
      title: 'Department Head',
      dataIndex: 'head',
      key: 'head'
    },
    {
      title: 'Officers Count',
      dataIndex: 'officersCount',
      key: 'officersCount',
      render: count => <Tag color="blue">{count} Officers</Tag>
    },
    {
      title: 'Active Complaints',
      dataIndex: 'activeComplaints',
      key: 'activeComplaints',
      render: active => <Tag color={active > 20 ? 'red' : 'warning'}>{active} Active</Tag>
    },
    {
      title: 'Avg Resolution Time',
      dataIndex: 'avgResolutionDays',
      key: 'avgResolutionDays',
      render: days => `${days} days`
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Municipal Departments Directory</Title>
          <Text type="secondary">Monitor departmental SLAs, officer allocations, and operational capacity</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setModalOpen(true)}>
          Add New Department
        </Button>
      </div>

      <Card style={{ borderRadius: 16 }}>
        <Table dataSource={deptList} columns={columns} rowKey="id" pagination={false} />
      </Card>

      <Modal
        title="Provision New Municipal Department"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleAddDept}>
          <Form.Item name="name" label="Department Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Parks & Urban Horticulture Authority" />
          </Form.Item>
          <Form.Item name="head" label="Department Head / Lead" rules={[{ required: true }]}>
            <Input placeholder="Director M. Smith" />
          </Form.Item>
          <Form.Item name="email" label="Contact Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="parks@city.gov" />
          </Form.Item>
          <Form.Item name="officersCount" label="Initial Field Officers Count">
            <Input type="number" defaultValue={5} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DepartmentManagement;
