import React from 'react';
import { Row, Col, Card, Button, Typography, Space, Tabs, Empty } from 'antd';
import {
  PlusCircleOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LikeOutlined,
  FileTextOutlined,
  RobotOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useIssues } from '../../contexts/IssueContext';
import StatCard from '../../components/common/StatCard';
import IssueCard from '../../components/issues/IssueCard';

const { Title, Text } = Typography;

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { issues, bookmarks } = useIssues();

  // Filter issues created by this citizen (or all demo issues if viewing demo citizen)
  const myIssues = issues.filter(i => i.createdBy?.uid === currentUser?.id || currentUser?.id === 'demo-citizen-1');
  const pendingCount = myIssues.filter(i => i.status === 'PENDING').length;
  const inProgressCount = myIssues.filter(i => i.status === 'IN_PROGRESS').length;
  const resolvedCount = myIssues.filter(i => i.status === 'RESOLVED').length;
  const totalVotesReceived = myIssues.reduce((acc, i) => acc + (i.votes?.length || 0), 0);

  const bookmarkedIssues = issues.filter(i => bookmarks.includes(i.id));

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      {/* Hero Welcome Banner */}
      <div className="hero-banner hover-lift" style={{ marginBottom: 32 }}>
        <Row align="middle" justify="space-between">
          <Col xs={24} md={16}>
            <Title level={2} style={{ color: '#fff', margin: 0, fontWeight: 800 }}>
              Welcome Back, {currentUser?.name || 'Citizen'}! 👋
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 15, display: 'block', marginTop: 8 }}>
              Track your reported infrastructure complaints, upvote local issues, and stay informed on department resolution progress.
            </Text>
            <Space style={{ marginTop: 20 }} wrap>
              <Button
                type="primary"
                size="large"
                icon={<PlusCircleOutlined />}
                onClick={() => navigate('/report')}
                style={{
                  background: '#ffffff',
                  color: '#1677FF',
                  borderColor: '#ffffff',
                  borderRadius: 10,
                  fontWeight: 700
                }}
              >
                Report New Infrastructure Issue
              </Button>
              <Button
                size="large"
                icon={<EnvironmentOutlined />}
                onClick={() => navigate('/map')}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  borderRadius: 10
                }}
              >
                View Live City Map
              </Button>
            </Space>
          </Col>
          <Col xs={0} md={6} style={{ textAlign: 'center' }}>
            <RobotOutlined style={{ fontSize: 110, color: 'rgba(255,255,255,0.2)' }} />
          </Col>
        </Row>
      </div>

      {/* Metrics Row */}
      <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard title="My Total Reports" value={myIssues.length} icon={<FileTextOutlined />} color="#1677FF" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard title="In Progress" value={inProgressCount} icon={<ClockCircleOutlined />} color="#FAAD14" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard title="Resolved Issues" value={resolvedCount} icon={<CheckCircleOutlined />} color="#52C41A" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard title="Community Votes" value={totalVotesReceived} icon={<LikeOutlined />} color="#722ed1" />
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Card style={{ borderRadius: 16 }}>
        <Tabs
          defaultActiveKey="my_complaints"
          items={[
            {
              key: 'my_complaints',
              label: `My Reported Issues (${myIssues.length})`,
              children: (
                <div style={{ marginTop: 16 }}>
                  {myIssues.length > 0 ? (
                    myIssues.map(issue => <IssueCard key={issue.id} issue={issue} />)
                  ) : (
                    <Empty
                      description="You haven't reported any infrastructure issues yet."
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                      <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => navigate('/report')}>
                        Report Your First Issue
                      </Button>
                    </Empty>
                  )}
                </div>
              )
            },
            {
              key: 'all_city',
              label: `Recent City Complaints (${issues.length})`,
              children: (
                <div style={{ marginTop: 16 }}>
                  {issues.map(issue => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              )
            },
            {
              key: 'bookmarks',
              label: `Bookmarked (${bookmarkedIssues.length})`,
              children: (
                <div style={{ marginTop: 16 }}>
                  {bookmarkedIssues.length > 0 ? (
                    bookmarkedIssues.map(issue => <IssueCard key={issue.id} issue={issue} />)
                  ) : (
                    <Empty description="No bookmarked complaints." image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </div>
              )
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default CitizenDashboard;
