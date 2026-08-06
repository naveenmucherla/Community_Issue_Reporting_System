import React from 'react';
import { Row, Col, Card, Button, Typography, Space, Table, Tag, Progress, message } from 'antd';
import {
  BarChartOutlined,
  DownloadOutlined,
  UsergroupAddOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useIssues } from '../../contexts/IssueContext';
import StatCard from '../../components/common/StatCard';
import { getStatusColor } from '../../utils/helpers';

const { Title, Text } = Typography;

const MONTHLY_DATA = [
  { month: 'Jan', total: 45, resolved: 38 },
  { month: 'Feb', total: 52, resolved: 48 },
  { month: 'Mar', total: 68, resolved: 60 },
  { month: 'Apr', total: 85, resolved: 79 },
  { month: 'May', total: 94, resolved: 88 },
  { month: 'Jun', total: 112, resolved: 102 },
  { month: 'Jul', total: 130, resolved: 118 },
  { month: 'Aug', total: 145, resolved: 135 }
];

const CATEGORY_COLORS = ['#1677FF', '#FAAD14', '#52C41A', '#722ED1', '#F5222D', '#13C2C2'];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { issues, departments } = useIssues();

  const total = issues.length;
  const pending = issues.filter(i => i.status === 'PENDING').length;
  const inProgress = issues.filter(i => i.status === 'IN_PROGRESS').length;
  const resolved = issues.filter(i => i.status === 'RESOLVED').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 100;

  // Category distribution data for Pie Chart
  const categoryMap = {};
  issues.forEach(i => {
    categoryMap[i.category] = (categoryMap[i.category] || 0) + 1;
  });
  const pieData = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: categoryMap[cat]
  }));

  // Department workload data for Bar Chart
  const deptBarData = departments.map(d => ({
    name: d.name.split(' ')[0],
    active: d.activeComplaints || 5,
    resolved: d.resolvedComplaints || 20
  }));

  const handleExportCSV = () => {
    const csvRows = [
      ['ID', 'Title', 'Category', 'Status', 'Priority', 'Department', 'Address', 'Votes', 'Created At']
    ];

    issues.forEach(i => {
      csvRows.push([
        i.id,
        `"${i.title}"`,
        i.category,
        i.status,
        i.priority,
        `"${i.assignedDepartment}"`,
        `"${i.address}"`,
        i.votes?.length || 0,
        i.createdAt
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CivicFix-Master-Report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('Master CSV report downloaded!');
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 800 }}>
            Executive Municipal Analytics
          </Title>
          <Text type="secondary">City-wide infrastructure performance, SLAs, and department operations</Text>
        </div>
        <Space wrap>
          <Button icon={<UsergroupAddOutlined />} onClick={() => navigate('/admin/users')}>
            Manage Users
          </Button>
          <Button icon={<BankOutlined />} onClick={() => navigate('/admin/departments')}>
            Manage Departments
          </Button>
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExportCSV}>
            Export Master Report (CSV)
          </Button>
        </Space>
      </div>

      {/* Metrics Row */}
      <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard title="Total Reported Issues" value={total} icon={<BarChartOutlined />} color="#1677FF" trend={14} />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard title="Pending Review" value={pending} icon={<ClockCircleOutlined />} color="#FAAD14" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard title="Active In Repair" value={inProgress} icon={<ExclamationCircleOutlined />} color="#722ed1" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard title="Resolution SLA Rate" value={resolutionRate} suffix="%" icon={<CheckCircleOutlined />} color="#52C41A" trend={6} />
        </Col>
      </Row>

      {/* Charts Grid */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        {/* Monthly Trend Area Chart */}
        <Col xs={24} lg={14}>
          <Card title="Monthly Complaint Submissions vs Resolutions" style={{ borderRadius: 16, height: 380 }}>
            <ResponsiveContainer width="100%" height={290}>
              <AreaChart data={MONTHLY_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1677FF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1677FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#52C41A" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#52C41A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke="#1677FF" fillOpacity={1} fill="url(#colorTotal)" name="Total Complaints" />
                <Area type="monotone" dataKey="resolved" stroke="#52C41A" fillOpacity={1} fill="url(#colorResolved)" name="Resolved Issues" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Category Pie Chart */}
        <Col xs={24} lg={10}>
          <Card title="Category Distribution Breakdown" style={{ borderRadius: 16, height: 380 }}>
            <ResponsiveContainer width="100%" height={290}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Department Workload Bar Chart */}
        <Col xs={24}>
          <Card title="Department Workload & Resolution Comparison" style={{ borderRadius: 16, height: 360 }}>
            <ResponsiveContainer width="100%" height={270}>
              <BarChart data={deptBarData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="active" fill="#FAAD14" name="Active Queue" />
                <Bar dataKey="resolved" fill="#52C41A" name="Resolved Complains" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
