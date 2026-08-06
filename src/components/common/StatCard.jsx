import React from 'react';
import { Card, Statistic } from 'antd';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color = '#1677FF', suffix = '', prefix = '', trend = null }) => {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card
        bordered={false}
        className="glass-card"
        style={{
          borderRadius: 16,
          background: `linear-gradient(135deg, ${color}0D 0%, ${color}03 100%)`,
          borderLeft: `4px solid ${color}`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#8c8c8c', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {title}
            </div>
            <Statistic
              value={value}
              suffix={suffix}
              prefix={prefix}
              valueStyle={{ fontWeight: 800, fontSize: 28, color: '#1f1f1f' }}
            />
            {trend && (
              <div style={{ fontSize: 12, marginTop: 4, color: trend > 0 ? '#52C41A' : '#F5222D', fontWeight: 600 }}>
                {trend > 0 ? `▲ +${trend}% vs last month` : `▼ ${trend}% vs last month`}
              </div>
            )}
          </div>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: `${color}1A`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
              fontSize: 24
            }}
          >
            {icon}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;
