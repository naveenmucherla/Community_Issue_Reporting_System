import React, { useState } from 'react';
import { Card, Form, Input, Button, Radio, Select, Space, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, BankOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MUNICIPAL_DEPARTMENTS, USER_ROLES } from '../../utils/constants';

const { Title, Text } = Typography;
const { Option } = Select;

const Register = () => {
  const navigate = useNavigate();
  const { registerWithEmail } = useAuth();
  const [role, setRole] = useState(USER_ROLES.CITIZEN);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const res = await registerWithEmail({
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
      department: values.department
    });
    setLoading(false);
    if (res.success) {
      message.success('Account created successfully!');
      navigate('/');
    } else {
      message.error(res.error || 'Registration failed');
    }
  };

  return (
    <div
      style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0f5ff 0%, #e6f4ff 50%, #f5f5f5 100%)',
        padding: 24
      }}
    >
      <Card className="glass-card hover-lift" style={{ width: '100%', maxWidth: 500, borderRadius: 20, padding: 12 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: '#1677FF',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              marginBottom: 8
            }}
          >
            <SafetyCertificateOutlined />
          </div>
          <Title level={3} style={{ margin: 0 }}>Create CivicFix Account</Title>
          <Text type="secondary">Join citizens and municipal officers improving civic life</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} size="large" initialValues={{ role: USER_ROLES.CITIZEN }}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Enter your full name' }]}>
            <Input prefix={<UserOutlined style={{ color: '#1677FF' }} />} placeholder="Jane Citizen" />
          </Form.Item>

          <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email', message: 'Valid email required' }]}>
            <Input prefix={<MailOutlined style={{ color: '#1677FF' }} />} placeholder="citizen@example.com" />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters' }]}>
            <Input.Password prefix={<LockOutlined style={{ color: '#1677FF' }} />} placeholder="Create password" />
          </Form.Item>

          <Form.Item name="role" label="I am registering as a:">
            <Radio.Group onChange={e => setRole(e.target.value)} buttonStyle="solid" style={{ width: '100%' }}>
              <Radio.Button value={USER_ROLES.CITIZEN} style={{ width: '50%', textAlign: 'center' }}>
                Citizen
              </Radio.Button>
              <Radio.Button value={USER_ROLES.OFFICER} style={{ width: '50%', textAlign: 'center' }}>
                Department Officer
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          {role === USER_ROLES.OFFICER && (
            <Form.Item
              name="department"
              label="Assigned Government Department"
              rules={[{ required: true, message: 'Select your department' }]}
            >
              <Select placeholder="Select Municipal Department" prefix={<BankOutlined />}>
                {MUNICIPAL_DEPARTMENTS.map(dept => (
                  <Option key={dept} value={dept}>{dept}</Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 46 }}>
              Complete Registration
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', fontSize: 13 }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 600, color: '#1677FF' }}>Sign In</Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
