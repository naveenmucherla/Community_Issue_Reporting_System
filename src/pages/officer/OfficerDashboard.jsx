import React, { useState } from 'react';
import { Row, Col, Card, Table, Tag, Button, Modal, Form, Input, Select, DatePicker, Upload, Space, Typography, message, Progress } from 'antd';
import {
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  UploadOutlined,
  UserOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAuth } from '../../contexts/AuthContext';
import { useIssues } from '../../contexts/IssueContext';
import { useNotifications } from '../../contexts/NotificationContext';
import StatCard from '../../components/common/StatCard';
import { StatusBadge, PriorityTag } from '../../components/common/StatusBadge';
import { formatDate, fileToBase64 } from '../../utils/helpers';
import IssueCard from '../../components/issues/IssueCard';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const OfficerDashboard = () => {
  const { currentUser } = useAuth();
  const { issues, updateIssueStatus } = useIssues();
  const { addNotification } = useNotifications();

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [resolutionImages, setResolutionImages] = useState([]);
  const [form] = Form.useForm();

  // Officer department filtering
  const officerDept = currentUser?.department || 'Public Works Department (PWD)';
  const deptIssues = issues.filter(i => i.assignedDepartment === officerDept || !i.assignedDepartment);

  const pending = deptIssues.filter(i => i.status === 'PENDING');
  const inProgress = deptIssues.filter(i => i.status === 'IN_PROGRESS');
  const resolved = deptIssues.filter(i => i.status === 'RESOLVED');

  const handleOpenStatusModal = (issue) => {
    setSelectedIssue(issue);
    form.setFieldsValue({
      status: issue.status,
      resolutionNotes: issue.resolutionNotes || '',
      estimatedCompletionDate: issue.estimatedCompletionDate ? dayjs(issue.estimatedCompletionDate) : null
    });
    setResolutionImages(issue.resolutionImages || []);
    setModalOpen(true);
  };

  const handleUploadResolution = async ({ fileList }) => {
    const list = [];
    for (let f of fileList) {
      if (f.originFileObj) {
        const b64 = await fileToBase64(f.originFileObj);
        list.push(b64);
      } else if (f.url) {
        list.push(f.url);
      }
    }
    setResolutionImages(list);
  };

  const handleSaveStatus = (values) => {
    if (selectedIssue) {
      const estDateStr = values.estimatedCompletionDate ? values.estimatedCompletionDate.format('YYYY-MM-DD') : null;
      updateIssueStatus(
        selectedIssue.id,
        values.status,
        values.resolutionNotes,
        resolutionImages,
        estDateStr
      );

      // Notify citizen creator
      if (selectedIssue.createdBy?.uid) {
        addNotification({
          userId: selectedIssue.createdBy.uid,
          title: `Status Update: ${values.status.replace('_', ' ')}`,
          message: `Department Officer ${currentUser?.name || ''} updated your report #${selectedIssue.id}`,
          type: 'status_update',
          issueId: selectedIssue.id
        });
      }

      message.success(`Status updated to ${values.status}`);
      setModalOpen(false);
    }
  };

  const columns = [
    {
      title: 'Issue Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <strong style={{ fontSize: 14 }}>{text}</strong>
          <div style={{ fontSize: 11, color: '#8c8c8c' }}>{record.address}</div>
        </div>
      )
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: p => <PriorityTag priority={p} />
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: s => <StatusBadge status={s} />
    },
    {
      title: 'Upvotes',
      dataIndex: 'votes',
      key: 'votes',
      render: v => <Tag color="blue">{v?.length || 0} Votes</Tag>
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<SyncOutlined />}
          onClick={() => handleOpenStatusModal(record)}
        >
          Update Dispatch
        </Button>
      )
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      {/* Officer Header */}
      <div style={{ marginBottom: 28, background: 'linear-gradient(135deg, #001529 0%, #003a8c 100%)', padding: 24, borderRadius: 16, color: '#fff' }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Space size={12}>
              <div style={{ background: '#1677FF', padding: 10, borderRadius: 12, display: 'flex' }}>
                <SafetyCertificateOutlined style={{ fontSize: 24 }} />
              </div>
              <div>
                <Title level={3} style={{ color: '#fff', margin: 0 }}>
                  Department Officer Operations Hub
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.75)' }}>
                  Assigned Department: <strong>{officerDept}</strong>
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Tag color="green" style={{ fontSize: 12, padding: '4px 12px', borderRadius: 8 }}>
              ONLINE DISPATCH ACTIVE
            </Tag>
          </Col>
        </Row>
      </div>

      {/* Metrics Row */}
      <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={8}>
          <StatCard title="Pending Queue" value={pending.length} icon={<ClockCircleOutlined />} color="#FAAD14" />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard title="Active Field Repair" value={inProgress.length} icon={<SyncOutlined />} color="#1677FF" />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard title="Completed Jobs" value={resolved.length} icon={<CheckCircleOutlined />} color="#52C41A" />
        </Col>
      </Row>

      {/* Assigned Complaints Table */}
      <Card title={`Department Dispatch Queue (${deptIssues.length} total)`} style={{ borderRadius: 16 }}>
        <Table dataSource={deptIssues} columns={columns} rowKey="id" pagination={{ pageSize: 6 }} />
      </Card>

      {/* Update Status Modal */}
      <Modal
        title={`Update Dispatch Status #${selectedIssue?.id}`}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveStatus}>
          <Form.Item name="status" label="Resolution Status" rules={[{ required: true }]}>
            <Select size="large">
              <Option value="PENDING">Pending Review</Option>
              <Option value="IN_PROGRESS">In Progress (Work Order Issued)</Option>
              <Option value="RESOLVED">Resolved (Completed & Verified)</Option>
              <Option value="REJECTED">Rejected / Invalid Report</Option>
            </Select>
          </Form.Item>

          <Form.Item name="estimatedCompletionDate" label="Target SLA Completion Date">
            <DatePicker style={{ width: '100%' }} size="large" />
          </Form.Item>

          <Form.Item name="resolutionNotes" label="Officer Work Log / Resolution Notes">
            <TextArea rows={3} placeholder="Detail repair machinery deployed, materials used, or closure reasoning..." />
          </Form.Item>

          <Form.Item label="Upload Resolution Proof Photos">
            <Upload.Dragger beforeUpload={() => false} onChange={handleUploadResolution} accept="image/*">
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ color: '#52C41A' }} />
              </p>
              <p className="ant-upload-text">Attach completed field repair photos</p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OfficerDashboard;
