import React, { useState } from 'react';
import { Modal, Button, Input, Space, Typography, message } from 'antd';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { EnvironmentOutlined, CompassOutlined, CheckOutlined } from '@ant-design/icons';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../../utils/constants';

const { Text } = Typography;

const pinIcon = L.divIcon({
  className: 'picker-marker-pin',
  html: `<div style="background:#1677FF;width:24px;height:24px;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 10px rgba(0,0,0,0.3);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Helper component to handle click events on the Leaflet map
const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    }
  });

  return position ? <Marker position={position} icon={pinIcon} /> : null;
};

const LocationPickerModal = ({ open, onClose, onSelectLocation, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition || DEFAULT_MAP_CENTER);
  const [addressInput, setAddressInput] = useState('Central Downtown Municipal Ward 4');

  const handleConfirm = () => {
    onSelectLocation({
      latitude: position[0],
      longitude: position[1],
      address: addressInput || `Lat: ${position[0].toFixed(4)}, Lon: ${position[1].toFixed(4)}`
    });
    onClose();
  };

  const handleUseGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = [pos.coords.latitude, pos.coords.longitude];
          setPosition(newPos);
          setAddressInput(`Current GPS Location (${newPos[0].toFixed(4)}, ${newPos[1].toFixed(4)})`);
          message.success('GPS position retrieved!');
        },
        () => {
          message.warning('Geolocation access denied. Click on the map to choose a pin location.');
        }
      );
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <Space>
          <EnvironmentOutlined style={{ color: '#1677FF' }} />
          <span>Pin Infrastructure Issue Location</span>
        </Space>
      }
      width={700}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="gps" icon={<CompassOutlined />} onClick={handleUseGPS}>
          Use GPS
        </Button>,
        <Button key="submit" type="primary" icon={<CheckOutlined />} onClick={handleConfirm}>
          Confirm Location
        </Button>
      ]}
      centered
    >
      <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontSize: 12 }}>
        Click anywhere on the map to place the issue pin marker or edit the street address below.
      </Text>

      <div style={{ height: 360, width: '100%', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
        <MapContainer center={position} zoom={DEFAULT_MAP_ZOOM} style={{ width: '100%', height: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>

      <div>
        <Text strong style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>
          Verified Address / Landmark:
        </Text>
        <Input
          prefix={<EnvironmentOutlined style={{ color: '#1677FF' }} />}
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          placeholder="e.g., Main Street Intersection, Block C, Ward 12"
        />
      </div>
    </Modal>
  );
};

export default LocationPickerModal;
