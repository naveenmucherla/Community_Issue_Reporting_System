import React from 'react';
import { Timeline, Card, Tag, Typography, Space, Image } from 'antd';
import {
  FileTextOutlined,
  BankOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  RobotOutlined
} from '@ant-design/icons';
import { formatDate } from '../../utils/helpers';

const { Text, Title } = Typography;

const IssueTimeline = ({ issue }) => {
  if (!issue) return null;

  const isPending = issue.status === 'PENDING';
  const isInProgress = issue.status === 'IN_PROGRESS';
  const isResolved = issue.status === 'RESOLVED';
  const isRejected = issue.status === 'REJECTED';

  const timelineItems = [
    {
      dot: <FileTextOutlined style={{ fontSize: 16, color: '#1677FF' }} />,
      color: 'blue',
      children: (
        <div>
          <Text strong style={{ fontSize: 14 }}>Complaint Submitted</Text>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>{formatDate(issue.createdAt)}</div>
          <Text style={{ fontSize: 13, display: 'block', marginTop: 4 }}>
            Reported by {issue.isAnonymous ? 'Anonymous Citizen' : issue.createdBy?.name || 'Citizen'} via CivicFix Web App.
          </Text>
        </div>
      )
    },
    {
      dot: <RobotOutlined style={{ fontSize: 16, color: '#722ed1' }} />,
      color: 'purple',
      children: (
        <div>
          <Text strong style={{ fontSize: 14 }}>AI Vision Classification & Department Routing</Text>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>Automated instant triage</div>
          <Text style={{ fontSize: 13, display: 'block', marginTop: 4 }}>
            Assigned to <strong>{issue.assignedDepartment || 'Municipal Office'}</strong> with {issue.aiConfidence || 92}% confidence.
          </Text>
        </div>
      )
    },
    {
      dot: <SyncOutlined spin={isInProgress} style={{ fontSize: 16, color: isInProgress || isResolved ? '#1677FF' : '#d9d9d9' }} />,
      color: isInProgress || isResolved ? 'blue' : 'gray',
      children: (
        <div>
          <Text strong style={{ fontSize: 14 }}>Department Action & Field Repair</Text>
          {isInProgress && (
            <Tag color="processing" style={{ marginLeft: 8, borderRadius: 6 }}>
              ACTIVE WORK
            </Tag>
          )}
          {issue.assignedOfficer && (
            <div style={{ fontSize: 13, marginTop: 4 }}>
              Assigned Field Officer: <strong>{issue.assignedOfficer.name}</strong>
            </div>
          )}
          {issue.estimatedCompletionDate && (
            <div style={{ fontSize: 12, color: '#1677FF', marginTop: 2 }}>
              Target SLA Completion Date: <strong>{issue.estimatedCompletionDate}</strong>
            </div>
          )}
        </div>
      )
    }
  ];

  if (isResolved) {
    timelineItems.push({
      dot: <CheckCircleOutlined style={{ fontSize: 18, color: '#52C41A' }} />,
      color: 'green',
      children: (
        <Card size="small" style={{ background: '#f6ffed', borderColor: '#b7eb8f', borderRadius: 12 }}>
          <Text strong style={{ fontSize: 14, color: '#52C41A' }}>Complaint Officially Resolved</Text>
          <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 8 }}>{formatDate(issue.updatedAt)}</div>
          {issue.resolutionNotes && (
            <Text style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>
              <strong>Officer Work Log:</strong> {issue.resolutionNotes}
            </Text>
          )}
          {issue.resolutionImages && issue.resolutionImages.length > 0 && (
            <div>
              <Text style={{ fontSize: 12, display: 'block', marginBottom: 6, fontWeight: 600 }}>
                Resolution Proof Photos:
              </Text>
              <Space>
                {issue.resolutionImages.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img}
                    width={80}
                    height={80}
                    style={{ borderRadius: 8, objectFit: 'cover' }}
                  />
                ))}
              </Space>
            </div>
          )}
        </Card>
      )
    });
  } else if (isRejected) {
    timelineItems.push({
      dot: <CloseCircleOutlined style={{ fontSize: 18, color: '#F5222D' }} />,
      color: 'red',
      children: (
        <Card size="small" style={{ background: '#fff2f0', borderColor: '#ffccc7', borderRadius: 12 }}>
          <Text strong style={{ fontSize: 14, color: '#F5222D' }}>Complaint Closed / Rejected</Text>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>{formatDate(issue.updatedAt)}</div>
          <Text style={{ fontSize: 13, display: 'block', marginTop: 4 }}>
            {issue.resolutionNotes || 'Jurisdictional duplicate or invalid municipal report.'}
          </Text>
        </Card>
      )
    });
  }

  return (
    <Card title="Resolution Progress & Audit Timeline" style={{ borderRadius: 16 }}>
      <Timeline items={timelineItems} style={{ marginTop: 12 }} />
    </Card>
  );
};

export default IssueTimeline;
