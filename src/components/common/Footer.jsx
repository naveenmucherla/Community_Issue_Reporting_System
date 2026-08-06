import React from 'react';
import { Layout, Row, Col, Space, Typography } from 'antd';
import { SafetyCertificateOutlined, GithubOutlined, GlobalOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const Footer = () => {
  return (
    <AntFooter style={{ background: '#001529', color: 'rgba(255, 255, 255, 0.65)', padding: '40px 24px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} md={8}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <SafetyCertificateOutlined style={{ fontSize: 24, color: '#1677FF' }} />
              <span style={{ fontSize: 20, fontWeight: 800, color: '#ffffff' }}>CivicFix</span>
            </div>
            <Text style={{ color: 'rgba(255, 255, 255, 0.65)', display: 'block', fontSize: 13, lineHeight: 1.6 }}>
              AI-Powered Community Infrastructure Issue Reporting Platform. Empowering citizens, accelerating municipal department resolutions, and maintaining full transparency.
            </Text>
          </Col>
          <Col xs={12} sm={6} md={5}>
            <div style={{ color: '#fff', fontWeight: 700, marginBottom: 12 }}>Platform</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <a href="/map" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Live City Map</a>
              <a href="/report" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Report an Issue</a>
              <a href="/search" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Public Directory</a>
            </div>
          </Col>
          <Col xs={12} sm={6} md={5}>
            <div style={{ color: '#fff', fontWeight: 700, marginBottom: 12 }}>Government Roles</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <a href="/citizen" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Citizen Dashboard</a>
              <a href="/officer" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Department Officer Portal</a>
              <a href="/admin" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>Municipal Administrator</a>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={{ color: '#fff', fontWeight: 700, marginBottom: 12 }}>AI Engine & Tech</div>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, display: 'block', marginBottom: 12 }}>
              Powered by Google Gemini Vision API for automatic issue categorization, priority classification, and municipal routing.
            </Text>
          </Col>
        </Row>

        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            marginTop: 32,
            paddingTop: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            fontSize: 12
          }}
        >
          <div>© {new Date().getFullYear()} CivicFix Municipal Platform. All rights reserved.</div>
          <Space size={16}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Accessibility</span>
          </Space>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;
