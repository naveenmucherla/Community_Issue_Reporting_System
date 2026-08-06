import React, { useState } from 'react';
import { Card, Tag, Space, Typography, Button, Tooltip, Avatar, Popconfirm, message } from 'antd';
import {
  EnvironmentOutlined,
  MessageOutlined,
  ShareAltOutlined,
  StarOutlined,
  StarFilled,
  EditOutlined,
  DeleteOutlined,
  RobotOutlined,
  UserOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StatusBadge, PriorityTag } from '../common/StatusBadge';
import UpvoteButton from './UpvoteButton';
import QRCodeModal from '../common/QRCodeModal';
import { formatRelativeTime, truncateText } from '../../utils/helpers';
import { useAuth } from '../../contexts/AuthContext';
import { useIssues } from '../../contexts/IssueContext';

const { Text, Title } = Typography;

const IssueCard = ({ issue }) => {
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const { bookmarks, toggleBookmark, deleteIssue } = useIssues();

  const [qrOpen, setQrOpen] = useState(false);
  const isBookmarked = bookmarks.includes(issue.id);
  const isOwner = currentUser && issue.createdBy?.uid === currentUser.id;
  const canEditOrDelete = isOwner || userRole === 'admin';

  const coverImage = issue.images && issue.images[0]
    ? issue.images[0]
    : 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800';

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteIssue(issue.id);
    message.success('Complaint report deleted');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
    >
      <Card
        hoverable
        className="glass-card"
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          marginBottom: 20,
          border: '1px solid rgba(0, 0, 0, 0.06)'
        }}
        bodyStyle={{ padding: 20 }}
        onClick={() => navigate(`/issue/${issue.id}`)}
      >
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {/* Issue Image Thumbnail */}
          <div style={{ position: 'relative', width: 220, height: 160, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
            <img
              src={coverImage}
              alt={issue.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {issue.aiConfidence && (
              <Tag
                color="blue"
                icon={<RobotOutlined />}
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  borderRadius: 6,
                  backdropFilter: 'blur(4px)',
                  background: 'rgba(0, 21, 41, 0.75)',
                  color: '#fff',
                  border: 'none',
                  fontSize: 11
                }}
              >
                AI {issue.aiConfidence}%
              </Tag>
            )}
          </div>

          {/* Details Content */}
          <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Space wrap>
                  <StatusBadge status={issue.status} />
                  <PriorityTag priority={issue.priority} />
                  <Tag color="cyan" style={{ borderRadius: 6, fontSize: 11 }}>
                    {issue.category}
                  </Tag>
                </Space>

                <Space onClick={(e) => e.stopPropagation()}>
                  <Tooltip title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Issue'}>
                    <Button
                      type="text"
                      shape="circle"
                      icon={isBookmarked ? <StarFilled style={{ color: '#1677FF' }} /> : <StarOutlined />}
                      onClick={() => toggleBookmark(issue.id)}
                    />
                  </Tooltip>
                  <Tooltip title="Share QR / PDF">
                    <Button
                      type="text"
                      shape="circle"
                      icon={<ShareAltOutlined />}
                      onClick={() => setQrOpen(true)}
                    />
                  </Tooltip>

                  {canEditOrDelete && (
                    <Popconfirm
                      title="Delete this complaint?"
                      onConfirm={handleDelete}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="text" danger shape="circle" icon={<DeleteOutlined />} />
                    </Popconfirm>
                  )}
                </Space>
              </div>

              <Title level={4} style={{ margin: '0 0 6px 0', fontSize: 17, color: '#1f1f1f' }}>
                {issue.title}
              </Title>

              <Text type="secondary" style={{ display: 'block', fontSize: 13, marginBottom: 8 }}>
                <EnvironmentOutlined style={{ color: '#1677FF' }} /> {issue.address}
              </Text>

              <Text style={{ fontSize: 13, color: '#595959', display: 'block', marginBottom: 12 }}>
                {truncateText(issue.description, 140)}
              </Text>
            </div>

            {/* Footer Bar: Reporter, Upvote, Comments */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 12,
                borderTop: '1px solid #f0f0f0',
                flexWrap: 'wrap',
                gap: 10
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Space size={8}>
                <Avatar
                  src={issue.isAnonymous ? '' : issue.createdBy?.photoURL}
                  icon={<UserOutlined />}
                  size="small"
                  style={{ backgroundColor: issue.isAnonymous ? '#8c8c8c' : '#1677FF' }}
                />
                <Text style={{ fontSize: 12, color: '#8c8c8c' }}>
                  {issue.isAnonymous ? 'Anonymous Citizen' : issue.createdBy?.name || 'Citizen'} • {formatRelativeTime(issue.createdAt)}
                </Text>
              </Space>

              <Space size={12}>
                <UpvoteButton issue={issue} size="small" />
                <Button
                  type="text"
                  size="small"
                  icon={<MessageOutlined />}
                  onClick={() => navigate(`/issue/${issue.id}#comments`)}
                  style={{ fontSize: 13, color: '#8c8c8c' }}
                >
                  {issue.commentsCount || 0} Comments
                </Button>
                <Button
                  type="link"
                  size="small"
                  icon={<ArrowRightOutlined />}
                  onClick={() => navigate(`/issue/${issue.id}`)}
                >
                  Details
                </Button>
              </Space>
            </div>
          </div>
        </div>
      </Card>

      <QRCodeModal open={qrOpen} onClose={() => setQrOpen(false)} issue={issue} />
    </motion.div>
  );
};

export default IssueCard;
