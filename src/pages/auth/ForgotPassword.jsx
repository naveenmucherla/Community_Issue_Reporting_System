import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    await resetPassword(values.email);
    setLoading(false);
    setSubmitted(true);
    message.success('Password reset link sent!');
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
      <Card className="glass-card hover-lift" style={{ width: '100%', maxWidth: 440, borderRadius: 20, padding: 12 }}>
        <div style={{ marginBottom: 20 }}>
          <Link to="/login" style={{ fontSize: 13, color: '#1677FF' }}>
            <ArrowLeftOutlined /> Back to Sign In
          </Link>
        </div>

        <Title level={3} style={{ margin: '0 0 6px 0' }}>Reset Your Password</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
          Enter your registered email address to receive password reset instructions.
        </Text>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Text type="success" strong style={{ fontSize: 16, display: 'block', marginBottom: 12 }}>
              Reset Link Sent!
            </Text>
            <Text type="secondary">
              Please check your inbox. Click the link inside the email to set a new password.
            </Text>
          </div>
        ) : (
          <Form layout="vertical" onFinish={onFinish} size="large">
            <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email', message: 'Valid email required' }]}>
              <Input prefix={<MailOutlined style={{ color: '#1677FF' }} />} placeholder="your.email@example.com" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ height: 44 }}>
              Send Reset Link
            </Button>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
