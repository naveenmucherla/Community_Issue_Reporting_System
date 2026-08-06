import React, { useState } from 'react';
import { Card, Form, Input, Button, Checkbox, Divider, Space, Typography, Alert, Tag, Avatar, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, SafetyCertificateOutlined, SwapOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { DEMO_PERSONAS } from '../../utils/constants';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { loginWithEmail, loginWithGoogle, switchDemoPersona } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const res = await loginWithEmail(values.email, values.password);
    setLoading(false);
    if (res.success) {
      message.success('Successfully logged in!');
      navigate('/');
    } else {
      message.error(res.error || 'Login failed. Please check credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await loginWithGoogle();
    setLoading(false);
    message.success('Signed in with Google');
    navigate('/');
  };

  const handleQuickPersona = (personaId) => {
    switchDemoPersona(personaId);
    message.success('Switched persona cleanly!');
    navigate('/');
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
      <Card
        className="glass-card hover-lift"
        style={{ width: '100%', maxWidth: 460, borderRadius: 20, padding: '12px 12px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #1677FF 0%, #003A8C 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 28,
              marginBottom: 12,
              boxShadow: '0 6px 16px rgba(22, 119, 255, 0.3)'
            }}
          >
            <SafetyCertificateOutlined />
          </div>
          <Title level={3} style={{ margin: 0, fontWeight: 800 }}>Welcome to CivicFix</Title>
          <Text type="secondary">AI-Powered Community Issue Reporting Platform</Text>
        </div>

        <Form layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please enter your email address' }]}
          >
            <Input prefix={<UserOutlined style={{ color: '#1677FF' }} />} placeholder="Email Address" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#1677FF' }} />} placeholder="Password" />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Link to="/forgot-password" style={{ color: '#1677FF', fontSize: 13 }}>
              Forgot Password?
            </Link>
          </div>

          <Form.Item style={{ marginBottom: 12 }}>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 46 }}>
              Sign In
            </Button>
          </Form.Item>

          <Button block icon={<GoogleOutlined />} onClick={handleGoogleLogin} style={{ height: 44 }}>
            Sign In with Google
          </Button>
        </Form>

        <Divider style={{ margin: '20px 0', fontSize: 12, color: '#8c8c8c' }}>
          OR DEMO INSTANT ROLE ACCESS
        </Divider>

        {/* Quick Demo Persona Switcher */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DEMO_PERSONAS.map(p => (
            <div
              key={p.id}
              onClick={() => handleQuickPersona(p.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: 10,
                border: '1px solid #e8e8e8',
                cursor: 'pointer',
                background: '#ffffff',
                transition: 'all 0.2s'
              }}
            >
              <Space>
                <Avatar src={p.avatar} size="small" />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
              </Space>
              <Tag color={p.role === 'admin' ? 'purple' : p.role === 'officer' ? 'blue' : 'green'}>
                {p.role.toUpperCase()}
              </Tag>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13 }}>
          Don't have an account? <Link to="/register" style={{ fontWeight: 600, color: '#1677FF' }}>Sign Up Free</Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
