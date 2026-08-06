import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, Upload, Checkbox, Radio, Space, Typography, Row, Col, message, Spin, Tooltip } from 'antd';
import {
  InboxOutlined,
  EnvironmentOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  BulbOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../../contexts/AuthContext';
import { useIssues } from '../../contexts/IssueContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { classifyIssueWithGemini } from '../../services/geminiService';
import { ISSUE_CATEGORIES, MUNICIPAL_DEPARTMENTS, ISSUE_PRIORITIES } from '../../utils/constants';
import { fileToBase64 } from '../../utils/helpers';
import AIAnalysisCard from '../../components/ai/AIAnalysisCard';
import LocationPickerModal from '../../components/maps/LocationPickerModal';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ReportIssue = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { currentUser } = useAuth();
  const { createIssue } = useIssues();
  const { addNotification } = useNotifications();

  const [images, setImages] = useState([]);
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    address: 'Central Downtown Main Street'
  });
  const [loading, setLoading] = useState(false);

  // Trigger Gemini Vision AI analysis on uploaded photo
  const handleAIAnalyze = async () => {
    if (images.length === 0) {
      message.warning('Please upload at least one photo of the infrastructure problem first.');
      return;
    }

    setAnalyzingAI(true);
    message.loading({ content: 'Google Gemini Vision API scanning image...', key: 'ai_scan' });

    try {
      const descriptionText = form.getFieldValue('description') || form.getFieldValue('title') || '';
      const result = await classifyIssueWithGemini(images[0], descriptionText);
      setAiResult(result);
      setAnalyzingAI(false);
      message.success({ content: 'AI Visual Classification Complete!', key: 'ai_scan' });
    } catch (err) {
      setAnalyzingAI(false);
      message.error({ content: 'AI Scan error', key: 'ai_scan' });
    }
  };

  // Apply AI classification into form fields
  const applyAICategory = () => {
    if (!aiResult) return;
    form.setFieldsValue({
      category: aiResult.category,
      priority: aiResult.suggestedPriority,
      assignedDepartment: aiResult.suggestedDepartment
    });
    message.success(`Applied Category (${aiResult.category}) & Priority (${aiResult.suggestedPriority})`);
  };

  // Upload change handler
  const handleUploadChange = async ({ fileList }) => {
    const base64List = [];
    for (let f of fileList) {
      if (f.originFileObj) {
        try {
          const b64 = await fileToBase64(f.originFileObj);
          base64List.push(b64);
        } catch (e) {}
      } else if (f.url) {
        base64List.push(f.url);
      }
    }
    setImages(base64List);
  };

  const onFinish = async (values) => {
    if (images.length === 0) {
      // Use fallback default image if user did not attach photo
      images.push('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800');
    }

    setLoading(true);

    const newIssueData = {
      title: values.title,
      description: values.description,
      category: values.category,
      priority: values.priority || 'MEDIUM',
      assignedDepartment: values.assignedDepartment || 'Public Works Department (PWD)',
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      address: selectedLocation.address,
      images,
      createdBy: {
        uid: currentUser?.id || currentUser?.uid || 'guest',
        name: currentUser?.name || 'Citizen',
        email: currentUser?.email || 'citizen@civicfix.org',
        photoURL: currentUser?.avatar || ''
      },
      isAnonymous: values.isAnonymous || false,
      aiConfidence: aiResult?.confidence || 94,
      aiSuggestedPriority: aiResult?.suggestedPriority || values.priority || 'MEDIUM',
      aiSummary: aiResult?.summary || 'User reported municipal issue analyzed by CivicFix triage system.'
    };

    const created = createIssue(newIssueData);

    addNotification({
      userId: currentUser?.id || 'guest',
      title: 'Issue Complaint Registered',
      message: `Your report "${values.title}" has been filed under tracking #${created.id}`,
      type: 'issue_created',
      issueId: created.id
    });

    confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
    setLoading(false);
    message.success('Complaint submitted successfully!');
    navigate(`/issue/${created.id}`);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
      <Card className="glass-card" style={{ borderRadius: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#1677FF' }}>
            Report Infrastructure Issue
          </Title>
          <Text type="secondary">
            Upload a photo for instant AI Vision classification or manually specify details
          </Text>
        </div>

        {/* AI Vision Card Display */}
        {aiResult && (
          <AIAnalysisCard
            analysis={aiResult}
            onConfirm={applyAICategory}
            onEdit={() => message.info('You can select any category below manually.')}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          size="large"
          initialValues={{
            category: 'Pothole',
            priority: 'HIGH',
            assignedDepartment: 'Public Works Department (PWD)',
            isAnonymous: false
          }}
        >
          {/* Photo Upload Box with AI Scan button */}
          <Card
            type="inner"
            title={
              <Space>
                <RobotOutlined style={{ color: '#1677FF' }} />
                <span>Step 1: Upload Photo & AI Analysis</span>
              </Space>
            }
            style={{ marginBottom: 24, borderRadius: 14 }}
          >
            <Upload.Dragger
              multiple={false}
              beforeUpload={() => false}
              onChange={handleUploadChange}
              accept="image/*"
              showUploadList={true}
              style={{ padding: 20, background: '#fafafa', borderRadius: 12 }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: '#1677FF', fontSize: 44 }} />
              </p>
              <p className="ant-upload-text" style={{ fontSize: 16, fontWeight: 600 }}>
                Click or drag issue photo to this area
              </p>
              <p className="ant-upload-hint">
                Supports JPG, PNG, WEBP. Photo will be scanned by Google Gemini AI for automatic category detection.
              </p>
            </Upload.Dragger>

            {images.length > 0 && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Button
                  type="primary"
                  icon={<RobotOutlined />}
                  loading={analyzingAI}
                  onClick={handleAIAnalyze}
                  style={{
                    background: 'linear-gradient(135deg, #722ed1 0%, #1677FF 100%)',
                    border: 'none',
                    borderRadius: 10,
                    height: 44,
                    fontWeight: 700
                  }}
                >
                  Run Gemini AI Vision Scanner
                </Button>
              </div>
            )}
          </Card>

          {/* Issue Details */}
          <Row gutter={16}>
            <Col xs={24} md={16}>
              <Form.Item
                name="title"
                label="Issue Title"
                rules={[{ required: true, message: 'Please enter a clear title' }]}
              >
                <Input placeholder="e.g. Hazardous Deep Pothole on Main Avenue" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="category"
                label="Issue Category"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select Category">
                  {ISSUE_CATEGORIES.map(cat => (
                    <Option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Detailed Description"
            rules={[{ required: true, message: 'Describe the problem severity and context' }]}
          >
            <TextArea
              rows={4}
              placeholder="Provide exact landmarks, danger to vehicles or pedestrians, and duration of problem..."
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="assignedDepartment" label="Responsible Municipal Department">
                <Select placeholder="Select Department">
                  {MUNICIPAL_DEPARTMENTS.map(dept => (
                    <Option key={dept} value={dept}>{dept}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item name="priority" label="Priority Level">
                <Radio.Group buttonStyle="solid" style={{ width: '100%' }}>
                  <Radio.Button value="LOW" style={{ width: '25%', textAlign: 'center' }}>Low</Radio.Button>
                  <Radio.Button value="MEDIUM" style={{ width: '25%', textAlign: 'center' }}>Med</Radio.Button>
                  <Radio.Button value="HIGH" style={{ width: '25%', textAlign: 'center' }}>High</Radio.Button>
                  <Radio.Button value="CRITICAL" style={{ width: '25%', textAlign: 'center' }}>Critical</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          {/* Location Selector */}
          <Card
            type="inner"
            title={
              <Space>
                <EnvironmentOutlined style={{ color: '#1677FF' }} />
                <span>Step 2: Problem Location Pin</span>
              </Space>
            }
            style={{ marginBottom: 24, borderRadius: 14 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <Text strong style={{ display: 'block' }}>{selectedLocation.address}</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Coordinates: Lat {selectedLocation.latitude.toFixed(4)}, Lon {selectedLocation.longitude.toFixed(4)}
                </Text>
              </div>
              <Button
                type="dashed"
                icon={<EnvironmentOutlined />}
                onClick={() => setLocationPickerOpen(true)}
              >
                Change Map Pin
              </Button>
            </div>
          </Card>

          <Form.Item name="isAnonymous" valuePropName="checked">
            <Checkbox>
              <strong>Submit Anonymously</strong> (Your name and email will be hidden from public view)
            </Checkbox>
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{
                height: 52,
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1677FF 0%, #003A8C 100%)'
              }}
            >
              Submit Official Complaint Report
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <LocationPickerModal
        open={locationPickerOpen}
        onClose={() => setLocationPickerOpen(false)}
        onSelectLocation={setSelectedLocation}
        initialPosition={[selectedLocation.latitude, selectedLocation.longitude]}
      />
    </div>
  );
};

export default ReportIssue;
