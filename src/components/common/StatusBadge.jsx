import React from 'react';
import { Tag } from 'antd';
import {
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { getStatusColor, getPriorityColor } from '../../utils/helpers';
import { ISSUE_STATUSES } from '../../utils/constants';

export const StatusBadge = ({ status }) => {
  const normalized = status?.toUpperCase();
  
  let icon = <ClockCircleOutlined />;
  let label = ISSUE_STATUSES.PENDING.label;
  let color = getStatusColor('PENDING');

  if (normalized === 'IN_PROGRESS' || normalized === 'IN PROGRESS') {
    icon = <SyncOutlined spin />;
    label = ISSUE_STATUSES.IN_PROGRESS.label;
    color = getStatusColor('IN_PROGRESS');
  } else if (normalized === 'RESOLVED') {
    icon = <CheckCircleOutlined />;
    label = ISSUE_STATUSES.RESOLVED.label;
    color = getStatusColor('RESOLVED');
  } else if (normalized === 'REJECTED') {
    icon = <CloseCircleOutlined />;
    label = ISSUE_STATUSES.REJECTED.label;
    color = getStatusColor('REJECTED');
  }

  return (
    <Tag
      color={color}
      icon={icon}
      style={{
        borderRadius: 6,
        padding: '2px 10px',
        fontWeight: 600,
        fontSize: 12,
        boxShadow: `0 2px 6px ${color}33`
      }}
    >
      {label}
    </Tag>
  );
};

export const PriorityTag = ({ priority }) => {
  const color = getPriorityColor(priority);
  return (
    <Tag
      color={color}
      style={{
        borderRadius: 6,
        padding: '2px 8px',
        fontWeight: 700,
        fontSize: 11,
        textTransform: 'uppercase'
      }}
    >
      {priority || 'MEDIUM'}
    </Tag>
  );
};
