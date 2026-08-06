import React from 'react';
import { Popover, List, Button, Typography, Tag, Space } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { useNotifications } from '../../contexts/NotificationContext';
import { formatRelativeTime } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

const NotificationPopover = ({ children, open, onOpenChange }) => {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  const content = (
    <div style={{ width: 340, maxHeight: 420, display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px 12px',
          borderBottom: '1px solid #f0f0f0'
        }}
      >
        <Space>
          <BellOutlined style={{ color: '#1677FF' }} />
          <Title level={5} style={{ margin: 0, fontSize: 14 }}>Notifications</Title>
        </Space>
        <Button type="link" size="small" onClick={markAllAsRead}>
          Mark all read
        </Button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          locale={{ emptyText: 'No notifications at present' }}
          renderItem={item => (
            <List.Item
              onClick={() => {
                markAsRead(item.id);
                if (item.issueId) {
                  onOpenChange(false);
                  navigate(`/issue/${item.issueId}`);
                }
              }}
              style={{
                padding: 12,
                cursor: 'pointer',
                background: item.read ? '#ffffff' : '#e6f4ff',
                borderBottom: '1px solid #f0f0f0',
                transition: 'background 0.2s'
              }}
            >
              <List.Item.Meta
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{ fontSize: 13 }}>{item.title}</Text>
                    {!item.read && <Tag color="blue" style={{ borderRadius: 4, fontSize: 9 }}>NEW</Tag>}
                  </div>
                }
                description={
                  <div>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', lineHeight: 1.4 }}>
                      {item.message}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 10, display: 'block', marginTop: 4 }}>
                      {formatRelativeTime(item.createdAt)}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      open={open}
      onOpenChange={onOpenChange}
      placement="bottomRight"
      overlayInnerStyle={{ padding: 0, borderRadius: 14 }}
    >
      {children}
    </Popover>
  );
};

export default NotificationPopover;
