import React from 'react';
import { Modal, Button, Typography, Space, message, Card } from 'antd';
import { QrcodeOutlined, CopyOutlined, DownloadOutlined, ShareAltOutlined } from '@ant-design/icons';
import { exportIssueToPDF } from '../../services/pdfService';

const { Text, Title } = Typography;

const QRCodeModal = ({ open, onClose, issue }) => {
  if (!issue) return null;

  const issueUrl = `${window.location.origin}/issue/${issue.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(issueUrl);
    message.success('Issue tracking link copied to clipboard!');
  };

  const handleDownloadPDF = async () => {
    message.loading({ content: 'Generating official PDF report...', key: 'pdf_gen' });
    await exportIssueToPDF(`issue-detail-card-${issue.id}`, issue);
    message.success({ content: 'PDF report downloaded successfully!', key: 'pdf_gen' });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <Space>
          <QrcodeOutlined style={{ color: '#1677FF' }} />
          <span>Share Complaint #{issue.id}</span>
        </Space>
      }
      centered
    >
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <Title level={5} style={{ marginBottom: 4 }}>{issue.title}</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 20, fontSize: 13 }}>
          Scan with any mobile camera to view real-time status and timeline on CivicFix
        </Text>

        <div style={{ background: '#f5f5f5', padding: 20, borderRadius: 16, display: 'inline-block', marginBottom: 20 }}>
          {/* SVG QR Code representation */}
          <svg width="180" height="180" viewBox="0 0 100 100" style={{ display: 'block' }}>
            <rect width="100" height="100" fill="#ffffff" rx="8" />
            <path d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M20,20 h10 v10 h-10 z" fill="#1677FF" />
            <path d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M70,20 h10 v10 h-10 z" fill="#1677FF" />
            <path d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M20,70 h10 v10 h-10 z" fill="#1677FF" />
            <rect x="50" y="50" width="12" height="12" fill="#1677FF" />
            <rect x="70" y="50" width="15" height="8" fill="#1677FF" />
            <rect x="50" y="70" width="18" height="10" fill="#1677FF" />
            <rect x="75" y="72" width="15" height="18" fill="#1677FF" />
          </svg>
        </div>

        <Card size="small" style={{ marginBottom: 20, background: '#f9f9f9', textAlign: 'left' }}>
          <Text size="small" style={{ fontSize: 12, wordBreak: 'break-all', color: '#1677FF' }}>
            {issueUrl}
          </Text>
        </Card>

        <Space wrap style={{ justifyContent: 'center' }}>
          <Button icon={<CopyOutlined />} onClick={copyToClipboard}>
            Copy Link
          </Button>
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownloadPDF}>
            Export PDF Report
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default QRCodeModal;
