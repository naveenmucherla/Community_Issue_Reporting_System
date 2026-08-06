import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Space, Button, Tag, Image, Breadcrumb, Divider, Tooltip, Avatar, Spin, message } from 'antd';
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  RobotOutlined,
  UserOutlined,
  BankOutlined,
  CalendarOutlined,
  QrcodeOutlined
} from '@ant-design/icons';
import { useIssues } from '../contexts/IssueContext';
import { StatusBadge, PriorityTag } from '../components/common/StatusBadge';
import UpvoteButton from '../components/issues/UpvoteButton';
import IssueTimeline from '../components/issues/IssueTimeline';
import CommentSection from '../components/issues/CommentSection';
import QRCodeModal from '../components/common/QRCodeModal';
import IssueMap from '../components/maps/IssueMap';
import { formatDate } from '../utils/helpers';
import { exportIssueToPDF } from '../services/pdfService';

const { Title, Text, Paragraph } = Typography;

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { issues } = useIssues();

  const [qrOpen, setQrOpen] = useState(false);

  const issue = issues.find(i => i.id === id);

  if (!issue) {
    return (
      <div style={{ padding: 60, textAlign: 'center' }}>
        <Title level={3}>Issue Report Not Found</Title>
        <Text type="secondary">The requested complaint ID does not exist or has been deleted.</Text>
        <div style={{ marginTop: 20 }}>
          <Button type="primary" onClick={() => navigate('/search')}>Browse All Issues</Button>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    message.loading({ content: 'Generating official PDF report...', key: 'pdf' });
    await exportIssueToPDF(`issue-detail-card-${issue.id}`, issue);
    message.success({ content: 'PDF report generated!', key: 'pdf' });
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
      {/* Breadcrumb & Navigation */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Breadcrumb
          items={[
            { title: <a onClick={() => navigate('/')}>Home</a> },
            { title: <a onClick={() => navigate('/search')}>Issues</a> },
            { title: `Issue #${issue.id}` }
          ]}
        />
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      {/* Main Issue Card Container */}
      <Card id={`issue-detail-card-${issue.id}`} className="glass-card" style={{ borderRadius: 20, marginBottom: 24 }}>
        {/* Header Title Bar */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap style={{ marginBottom: 8 }}>
            <StatusBadge status={issue.status} />
            <PriorityTag priority={issue.priority} />
            <Tag color="cyan" style={{ borderRadius: 6, fontSize: 12 }}>{issue.category}</Tag>
            {issue.aiConfidence && (
              <Tag color="purple" icon={<RobotOutlined />} style={{ borderRadius: 6, fontSize: 12 }}>
                Gemini Vision AI: {issue.aiConfidence}% Match
              </Tag>
            )}
          </Space>
          <Title level={2} style={{ margin: '8px 0 4px 0', fontWeight: 800 }}>{issue.title}</Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            <EnvironmentOutlined style={{ color: '#1677FF' }} /> {issue.address}
          </Text>
        </div>

        {/* Media & Details Grid */}
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          {/* Images Gallery */}
          <Col xs={24} md={12}>
            <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid #f0f0f0' }}>
              {issue.images && issue.images.length > 0 ? (
                <Image.PreviewGroup>
                  <Image
                    src={issue.images[0]}
                    style={{ width: '100%', height: 320, objectFit: 'cover' }}
                  />
                  {issue.images.slice(1).map((img, idx) => (
                    <Image key={idx} src={img} style={{ display: 'none' }} />
                  ))}
                </Image.PreviewGroup>
              ) : (
                <div style={{ height: 260, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text type="secondary">No photo uploaded</Text>
                </div>
              )}
            </div>
          </Col>

          {/* Issue Summary Metadata */}
          <Col xs={24} md={12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <Card size="small" style={{ background: '#fafafa', borderRadius: 12, marginBottom: 16 }}>
                <Paragraph style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>
                  {issue.description}
                </Paragraph>
              </Card>

              {issue.aiSummary && (
                <Card size="small" style={{ background: '#e6f4ff', borderColor: '#91caff', borderRadius: 12, marginBottom: 16 }}>
                  <Text strong style={{ color: '#003a8c', display: 'block', marginBottom: 4, fontSize: 12 }}>
                    <RobotOutlined /> AI System Visual Triage
                  </Text>
                  <Text style={{ fontSize: 13, color: '#1f1f1f' }}>{issue.aiSummary}</Text>
                </Card>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: '#595959' }}>
                <div><BankOutlined /> Department: <strong>{issue.assignedDepartment || 'Public Works'}</strong></div>
                <div><CalendarOutlined /> Reported Date: <strong>{formatDate(issue.createdAt)}</strong></div>
                <div>
                  <UserOutlined /> Reported By: <strong>{issue.isAnonymous ? 'Anonymous Citizen' : issue.createdBy?.name}</strong>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #f0f0f0', flexWrap: 'wrap', gap: 10 }}>
              <UpvoteButton issue={issue} size="large" />

              <Space wrap>
                <Button icon={<QrcodeOutlined />} onClick={() => setQrOpen(true)}>
                  Share QR
                </Button>
                <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownloadPDF}>
                  PDF Report
                </Button>
              </Space>
            </div>
          </Col>
        </Row>

        {/* Location Map Preview */}
        {issue.latitude && issue.longitude && (
          <div style={{ marginBottom: 32 }}>
            <Title level={5} style={{ marginBottom: 12 }}>Problem Location Pin</Title>
            <IssueMap issues={[issue]} center={[issue.latitude, issue.longitude]} zoom={15} height="280px" />
          </div>
        )}

        {/* Resolution Timeline */}
        <div style={{ marginBottom: 32 }}>
          <IssueTimeline issue={issue} />
        </div>

        {/* Comments Section */}
        <CommentSection issueId={issue.id} />
      </Card>

      <QRCodeModal open={qrOpen} onClose={() => setQrOpen(false)} issue={issue} />
    </div>
  );
};

export default IssueDetails;
