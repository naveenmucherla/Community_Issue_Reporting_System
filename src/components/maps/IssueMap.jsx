import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Drawer, Tag, Button, Space, Typography, Card } from 'antd';
import { EnvironmentOutlined, ArrowRightOutlined, LikeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getStatusColor, formatDate } from '../../utils/helpers';
import { StatusBadge, PriorityTag } from '../common/StatusBadge';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../../utils/constants';

const { Text, Title } = Typography;

// Helper to construct custom colored marker pin icons for Leaflet
const createCustomIcon = (status) => {
  const color = getStatusColor(status);
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="30" height="42">
      <path fill="${color}" stroke="#ffffff" stroke-width="2" d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24c0-6.627-5.373-12-12-12z"/>
      <circle cx="12" cy="12" r="5" fill="#ffffff"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svgString,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -36]
  });
};

const IssueMap = ({ issues = [], center = DEFAULT_MAP_CENTER, zoom = DEFAULT_MAP_ZOOM, height = '500px' }) => {
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState(null);

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: 16, overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {issues.map(issue => {
          if (!issue.latitude || !issue.longitude) return null;
          const markerIcon = createCustomIcon(issue.status);

          return (
            <Marker
              key={issue.id}
              position={[issue.latitude, issue.longitude]}
              icon={markerIcon}
              eventHandlers={{
                click: () => setSelectedIssue(issue)
              }}
            >
              <Popup width={240}>
                <div style={{ textAlign: 'left' }}>
                  {issue.images && issue.images[0] && (
                    <img
                      src={issue.images[0]}
                      alt={issue.title}
                      style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }}
                    />
                  )}
                  <div style={{ marginBottom: 4 }}>
                    <StatusBadge status={issue.status} />
                  </div>
                  <strong style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>{issue.title}</strong>
                  <div style={{ fontSize: 11, color: '#8c8c8c', marginBottom: 8 }}>
                    <EnvironmentOutlined /> {issue.address}
                  </div>
                  <Button
                    type="primary"
                    size="small"
                    block
                    icon={<ArrowRightOutlined />}
                    onClick={() => navigate(`/issue/${issue.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Side Drawer for Mobile/Full issue inspection */}
      <Drawer
        title="Issue Overview"
        placement="right"
        onClose={() => setSelectedIssue(null)}
        open={Boolean(selectedIssue)}
        width={360}
      >
        {selectedIssue && (
          <div>
            {selectedIssue.images && selectedIssue.images[0] && (
              <img
                src={selectedIssue.images[0]}
                alt={selectedIssue.title}
                style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }}
              />
            )}
            <Space style={{ marginBottom: 12 }}>
              <StatusBadge status={selectedIssue.status} />
              <PriorityTag priority={selectedIssue.priority} />
            </Space>
            <Title level={4} style={{ marginTop: 0 }}>{selectedIssue.title}</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
              <EnvironmentOutlined /> {selectedIssue.address}
            </Text>

            <Card size="small" style={{ marginBottom: 16, background: '#f5f5f5' }}>
              <Text style={{ fontSize: 13 }}>{selectedIssue.description}</Text>
            </Card>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8c8c8c', marginBottom: 20 }}>
              <span>Category: <strong>{selectedIssue.category}</strong></span>
              <span><LikeOutlined /> {selectedIssue.votes?.length || 0} Upvotes</span>
            </div>

            <Button
              type="primary"
              block
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={() => {
                const id = selectedIssue.id;
                setSelectedIssue(null);
                navigate(`/issue/${id}`);
              }}
            >
              Open Full Report Page
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default IssueMap;
