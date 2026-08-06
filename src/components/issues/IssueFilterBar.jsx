import React from 'react';
import { Card, Input, Select, Radio, Space, Row, Col, Button } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { ISSUE_CATEGORIES, MUNICIPAL_DEPARTMENTS, ISSUE_PRIORITIES } from '../../utils/constants';

const { Option } = Select;

const IssueFilterBar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  selectedDepartment,
  setSelectedDepartment,
  selectedPriority,
  setSelectedPriority,
  onReset
}) => {
  return (
    <Card style={{ borderRadius: 16, marginBottom: 24, boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
      <Row gutter={[16, 16]} align="middle">
        {/* Search Text */}
        <Col xs={24} sm={12} md={8}>
          <Input
            placeholder="Search complaints by title, address, or ID..."
            prefix={<SearchOutlined style={{ color: '#1677FF' }} />}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            allowClear
            size="large"
          />
        </Col>

        {/* Status Filter Tabs */}
        <Col xs={24} sm={12} md={10}>
          <Radio.Group
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            buttonStyle="solid"
            size="large"
            style={{ width: '100%' }}
          >
            <Radio.Button value="ALL">All</Radio.Button>
            <Radio.Button value="PENDING">Pending</Radio.Button>
            <Radio.Button value="IN_PROGRESS">In Progress</Radio.Button>
            <Radio.Button value="RESOLVED">Resolved</Radio.Button>
          </Radio.Group>
        </Col>

        {/* Clear Filters Button */}
        <Col xs={24} sm={24} md={6} style={{ textAlign: 'right' }}>
          <Button icon={<ClearOutlined />} onClick={onReset}>
            Reset Filters
          </Button>
        </Col>

        {/* Category Select */}
        <Col xs={24} sm={8} md={8}>
          <Select
            placeholder="Filter by Category"
            value={selectedCategory || undefined}
            onChange={setSelectedCategory}
            allowClear
            style={{ width: '100%' }}
          >
            {ISSUE_CATEGORIES.map(cat => (
              <Option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Department Select */}
        <Col xs={24} sm={8} md={8}>
          <Select
            placeholder="Filter by Department"
            value={selectedDepartment || undefined}
            onChange={setSelectedDepartment}
            allowClear
            style={{ width: '100%' }}
          >
            {MUNICIPAL_DEPARTMENTS.map(dept => (
              <Option key={dept} value={dept}>
                {dept}
              </Option>
            ))}
          </Select>
        </Col>

        {/* Priority Select */}
        <Col xs={24} sm={8} md={8}>
          <Select
            placeholder="Filter by Priority"
            value={selectedPriority || undefined}
            onChange={setSelectedPriority}
            allowClear
            style={{ width: '100%' }}
          >
            {Object.keys(ISSUE_PRIORITIES).map(p => (
              <Option key={p} value={p}>
                {p} Priority
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
    </Card>
  );
};

export default IssueFilterBar;
