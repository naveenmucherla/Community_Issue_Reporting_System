import React, { useState } from 'react';
import { Typography, Row, Col, Empty, Card } from 'antd';
import { useIssues } from '../contexts/IssueContext';
import IssueFilterBar from '../components/issues/IssueFilterBar';
import IssueCard from '../components/issues/IssueCard';

const { Title, Text } = Typography;

const SearchPage = () => {
  const { issues } = useIssues();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);

  const filteredIssues = issues.filter(issue => {
    const matchesSearch =
      !searchQuery ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || issue.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || issue.status === selectedStatus;
    const matchesDept = !selectedDepartment || issue.assignedDepartment === selectedDepartment;
    const matchesPriority = !selectedPriority || issue.priority === selectedPriority;

    return matchesSearch && matchesCategory && matchesStatus && matchesDept && matchesPriority;
  });

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedStatus('ALL');
    setSelectedDepartment(null);
    setSelectedPriority(null);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, fontWeight: 800 }}>
          Public Complaints & Infrastructure Directory
        </Title>
        <Text type="secondary">
          Search, filter, and track all municipal infrastructure reports across the city
        </Text>
      </div>

      <IssueFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        onReset={handleReset}
      />

      <div style={{ marginTop: 16 }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          Showing <strong>{filteredIssues.length}</strong> matching complaint reports
        </Text>

        {filteredIssues.length > 0 ? (
          filteredIssues.map(issue => <IssueCard key={issue.id} issue={issue} />)
        ) : (
          <Card style={{ borderRadius: 16, padding: 40, textAlign: 'center' }}>
            <Empty description="No complaints match your search filter parameters." />
          </Card>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
