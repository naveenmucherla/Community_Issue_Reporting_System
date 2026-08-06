import React, { useState } from 'react';
import { Card, Input, Button, Avatar, List, Tag, Space, Typography, Form } from 'antd';
import { SendOutlined, UserOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useIssues } from '../../contexts/IssueContext';
import { formatRelativeTime } from '../../utils/helpers';

const { Text, Title } = Typography;
const { TextArea } = Input;

const CommentSection = ({ issueId }) => {
  const { currentUser } = useAuth();
  const { comments, addComment } = useIssues();
  const [text, setText] = useState('');

  const issueComments = comments[issueId] || [];

  const handleSubmit = () => {
    if (!text.trim()) return;

    const userObj = currentUser || {
      uid: 'guest',
      name: 'Guest Citizen',
      role: 'citizen',
      avatar: ''
    };

    addComment(issueId, text, userObj);
    setText('');
  };

  return (
    <Card id="comments" title={`Community & Officer Discussions (${issueComments.length})`} style={{ borderRadius: 16 }}>
      {/* Comment List */}
      <List
        itemLayout="horizontal"
        dataSource={issueComments}
        locale={{ emptyText: 'No comments yet. Be the first citizen to leave a update!' }}
        renderItem={item => (
          <List.Item style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={item.user?.avatar}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: item.user?.role === 'officer' ? '#1677FF' : '#52C41A' }}
                />
              }
              title={
                <Space>
                  <strong style={{ fontSize: 14 }}>{item.user?.name || 'Citizen'}</strong>
                  {item.user?.role === 'officer' && (
                    <Tag color="blue" icon={<SafetyCertificateOutlined />} style={{ borderRadius: 6, fontSize: 10 }}>
                      VERIFIED OFFICER
                    </Tag>
                  )}
                  {item.user?.role === 'admin' && (
                    <Tag color="purple" style={{ borderRadius: 6, fontSize: 10 }}>
                      ADMINISTRATOR
                    </Tag>
                  )}
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    • {formatRelativeTime(item.createdAt)}
                  </Text>
                </Space>
              }
              description={
                <div style={{ color: '#1f1f1f', fontSize: 13, marginTop: 4, whiteSpace: 'pre-wrap' }}>
                  {item.message}
                </div>
              }
            />
          </List.Item>
        )}
      />

      {/* Write Comment Box */}
      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px dashed #d9d9d9' }}>
        <Title level={5} style={{ marginBottom: 12, fontSize: 14 }}>Post an Official Comment or Update</Title>
        <Space.Compact style={{ width: '100%' }}>
          <TextArea
            rows={2}
            placeholder="Add relevant public info, status query, or photo context..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </Space.Compact>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSubmit}
            disabled={!text.trim()}
          >
            Post Comment
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CommentSection;
