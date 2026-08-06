import React from 'react';
import { Card, Progress, Tag, Space, Typography, Alert, Button } from 'antd';
import { RobotOutlined, CheckCircleOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { PriorityTag } from '../common/StatusBadge';

const { Text, Title } = Typography;

const AIAnalysisCard = ({ analysis, onConfirm, onEdit }) => {
  if (!analysis) return null;

  const { category, confidence, suggestedPriority, suggestedDepartment, summary, isMock } = analysis;

  return (
    <Card
      style={{
        background: 'linear-gradient(135deg, #e6f4ff 0%, #f0f5ff 100%)',
        border: '1px solid #91caff',
        borderRadius: 16,
        boxShadow: '0 4px 16px rgba(22, 119, 255, 0.1)',
        marginBottom: 20
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Space>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#1677FF',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20
            }}
          >
            <RobotOutlined />
          </div>
          <div>
            <Title level={5} style={{ margin: 0, color: '#003a8c' }}>
              Google Gemini Vision AI Analysis
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Automated image classification & department routing
            </Text>
          </div>
        </Space>
        {isMock && (
          <Tag color="cyan" icon={<InfoCircleOutlined />} style={{ borderRadius: 6 }}>
            Vision AI Active
          </Tag>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 16 }}>
        <div style={{ background: '#ffffff', padding: 12, borderRadius: 10 }}>
          <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>DETECTED CATEGORY</Text>
          <Text strong style={{ fontSize: 16, color: '#1677FF' }}>{category}</Text>
        </div>

        <div style={{ background: '#ffffff', padding: 12, borderRadius: 10 }}>
          <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>CONFIDENCE SCORE</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Progress percent={confidence} size="small" status="active" strokeColor="#52C41A" />
            <Text strong style={{ fontSize: 14 }}>{confidence}%</Text>
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: 12, borderRadius: 10 }}>
          <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>SUGGESTED PRIORITY</Text>
          <div style={{ marginTop: 4 }}>
            <PriorityTag priority={suggestedPriority} />
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: 12, borderRadius: 10 }}>
          <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>ROUTED DEPARTMENT</Text>
          <Text strong style={{ fontSize: 13, color: '#1f1f1f' }}>{suggestedDepartment}</Text>
        </div>
      </div>

      <Alert
        message="AI Visual Assessment"
        description={summary}
        type="info"
        showIcon
        style={{ borderRadius: 10, marginBottom: 16, background: '#ffffff', border: '1px solid #bae0ff' }}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <Button icon={<EditOutlined />} onClick={onEdit}>
          Modify AI Suggestion
        </Button>
        <Button type="primary" icon={<CheckCircleOutlined />} onClick={onConfirm}>
          Apply AI Classification
        </Button>
      </div>
    </Card>
  );
};

export default AIAnalysisCard;
