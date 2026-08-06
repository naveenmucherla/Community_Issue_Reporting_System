import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from 'antd';

import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { IssueProvider } from './contexts/IssueContext';
import { NotificationProvider } from './contexts/NotificationContext';

import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ReportIssue from './pages/citizen/ReportIssue';
import MyComplaints from './pages/citizen/MyComplaints';

import OfficerDashboard from './pages/officer/OfficerDashboard';

import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import DepartmentManagement from './pages/admin/DepartmentManagement';

import MapExplorer from './pages/MapExplorer';
import IssueDetails from './pages/IssueDetails';
import SearchPage from './pages/SearchPage';
import NotFound from './pages/NotFound';

import { USER_ROLES } from './utils/constants';

const { Content } = Layout;
const queryClient = new QueryClient();

// Main App Layout Wrapper
const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser } = useAuth();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Layout>
        {currentUser && (
          <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
        )}
        <Content style={{ minHeight: '80vh', background: 'inherit' }}>
          <Routes>
            {/* Public / Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* General Views */}
            <Route path="/" element={<CitizenDashboard />} />
            <Route path="/map" element={<MapExplorer />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/issue/:id" element={<IssueDetails />} />

            {/* Citizen Routes */}
            <Route
              path="/citizen"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.CITIZEN, USER_ROLES.ADMIN, USER_ROLES.OFFICER]}>
                  <CitizenDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/citizen/complaints"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.CITIZEN, USER_ROLES.ADMIN, USER_ROLES.OFFICER]}>
                  <MyComplaints />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.CITIZEN, USER_ROLES.ADMIN, USER_ROLES.OFFICER]}>
                  <ReportIssue />
                </ProtectedRoute>
              }
            />

            {/* Department Officer Routes */}
            <Route
              path="/officer"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.OFFICER, USER_ROLES.ADMIN]}>
                  <OfficerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer/resolutions"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.OFFICER, USER_ROLES.ADMIN]}>
                  <OfficerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/departments"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <DepartmentManagement />
                </ProtectedRoute>
              }
            />

            {/* Fallback 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Content>
      </Layout>
      <Footer />
    </Layout>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <IssueProvider>
            <NotificationProvider>
              <Router>
                <AppLayout />
              </Router>
            </NotificationProvider>
          </IssueProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
