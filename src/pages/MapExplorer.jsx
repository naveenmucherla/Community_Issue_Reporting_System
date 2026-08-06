import React, { useState } from 'react';
import { Card, Radio, Select, Space, Tag, Typography, Row, Col, Badge } from 'antd';
import { EnvironmentOutlined, FilterOutlined } from '@ant-design/icons';
import { useIssues } from '../contexts/IssueContext';
import IssueMap from '../components/maps/IssueMap';
import { ISSUE_CATEGORIES } from '../utils/constants';

const { Title, Text } = Typography;
const { Option } = Select;

const MapExplorer = () => {
  const { issues } = useIssues();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredIssues = issues.filter(issue => {
    const statusMatch = statusFilter === 'ALL' || issue.status === statusFilter;
    const catMatch = categoryFilter === 'ALL' || issue.category === categoryFilter;
    return statusMatch && catMatch;
  });

  const pendingCount = filteredIssues.filter(i => i.status === 'PENDING').length;
  const inProgressCount = filteredIssues.filter(i => i.status === 'IN_PROGRESS').length;
  const resolvedCount = filteredIssues.filter(i => i.status === 'RESOLVED').length;

  return (
    <div style={{ padding: '16px 24px', height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header Filter Bar */}
      <Card size="small" style={{ borderRadius: 16, marginBottom: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <Row align="middle" justify="space-between" gutter={[16, 12]}>
          <Col xs={24} md={8}>
            <Space>
              <EnvironmentOutlined style={{ fontSize: 22, color: '#1677FF' }} />
              <div>
                <Title level={4} style={{ margin: 0 }}>Interactive City Dispatch Map</Title>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Displaying {filteredIssues.length} active geocoded municipal issues
                </Text>
              </div>
            </Space>
          </Col>

          <Col xs={24} md={16} style={{ textAlign: 'right' }}>
            <Space wrap>
              {/* Category Filter */}
              <Select
                placeholder="Category Filter"
                value={categoryFilter}
                onChange={setCategoryFilter}
                style={{ width: 200 }}
              >
                <Option value="ALL">All Categories</Option>
                {ISSUE_CATEGORIES.map(c => (
                  <Option key={c.value} value={c.value}>{c.icon} {c.label}</Option>
                ))}
              </Select>

              {/* Status Radio Buttons */}
              <Radio.Group
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="ALL">All ({filteredIssues.length})</Radio.Button>
                <Radio.Button value="PENDING">
                  <Badge status="warning" text={`Pending (${pendingCount})`} />
                </Radio.Button>
                <Radio.Button value="IN_PROGRESS">
                  <Badge status="processing" text={`In Progress (${inProgressCount})`} />
                </Radio.Button>
                <Radio.Button value="RESOLVED">
                  <Badge status="success" text={`Resolved (${resolvedCount})`} />
                </Radio.Button>
              </Radio.Group>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Map Container */}
      <div style={{ flex: 1, position: 'relative' }}>
        <IssueMap issues={filteredIssues} height="100%" zoom={13} />
      </div>
    </div>
  );
};

export default MapExplorer;
