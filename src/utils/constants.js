// CivicFix System Constants & Definitions

export const USER_ROLES = {
  CITIZEN: 'citizen',
  OFFICER: 'officer',
  ADMIN: 'admin'
};

export const ISSUE_CATEGORIES = [
  { value: 'Pothole', label: 'Pothole & Road Fault', icon: '🕳️', department: 'Public Works Department (PWD)' },
  { value: 'Garbage', label: 'Garbage & Solid Waste', icon: '🗑️', department: 'Sanitation & Solid Waste' },
  { value: 'Water Leakage', label: 'Water Supply & Leakage', icon: '💧', department: 'Water Supply Board' },
  { value: 'Streetlight', label: 'Broken Streetlight', icon: '💡', department: 'Electrical & Street Lighting' },
  { value: 'Road Damage', label: 'Major Road Damage / Cave-in', icon: '🛣️', department: 'Highway Authority' },
  { value: 'Sewage', label: 'Sewage & Drainage Overflow', icon: '🌊', department: 'Drainage & Sewage Board' },
  { value: 'Illegal Dumping', label: 'Illegal Dumping & Debris', icon: '🚨', department: 'Environmental Enforcement' },
  { value: 'Fallen Tree', label: 'Fallen Tree / Hazard', icon: '🌳', department: 'Parks & Horticulture' },
  { value: 'Traffic Signal', label: 'Traffic Signal Failure', icon: '🚦', department: 'Traffic Management' },
  { value: 'Unknown', label: 'Other Infrastructure Issue', icon: '⚙️', department: 'General Municipal Administration' }
];

export const ISSUE_STATUSES = {
  PENDING: { label: 'Pending Review', color: '#FAAD14', badgeStatus: 'warning', icon: 'ClockCircleOutlined' },
  IN_PROGRESS: { label: 'In Progress', color: '#1677FF', badgeStatus: 'processing', icon: 'SyncOutlined' },
  RESOLVED: { label: 'Resolved', color: '#52C41A', badgeStatus: 'success', icon: 'CheckCircleOutlined' },
  REJECTED: { label: 'Rejected', color: '#F5222D', badgeStatus: 'error', icon: 'CloseCircleOutlined' }
};

export const ISSUE_PRIORITIES = {
  LOW: { label: 'Low', color: '#8c8c8c', level: 1 },
  MEDIUM: { label: 'Medium', color: '#1677FF', level: 2 },
  HIGH: { label: 'High', color: '#FAAD14', level: 3 },
  CRITICAL: { label: 'Critical', color: '#F5222D', level: 4 }
};

export const MUNICIPAL_DEPARTMENTS = [
  'Public Works Department (PWD)',
  'Sanitation & Solid Waste',
  'Water Supply Board',
  'Electrical & Street Lighting',
  'Highway Authority',
  'Drainage & Sewage Board',
  'Environmental Enforcement',
  'Parks & Horticulture',
  'Traffic Management',
  'General Municipal Administration'
];

export const DEMO_PERSONAS = [
  {
    id: 'demo-citizen-1',
    name: 'Jane Citizen',
    email: 'jane.citizen@civicfix.org',
    role: USER_ROLES.CITIZEN,
    department: null,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    location: 'Central Downtown'
  },
  {
    id: 'demo-officer-1',
    name: 'Officer Dave Miller',
    email: 'dave.officer@pwd.gov',
    role: USER_ROLES.OFFICER,
    department: 'Public Works Department (PWD)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    location: 'PWD Operations Hub'
  },
  {
    id: 'demo-officer-2',
    name: 'Officer Sarah Chen',
    email: 'sarah.officer@sanitation.gov',
    role: USER_ROLES.OFFICER,
    department: 'Sanitation & Solid Waste',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    location: 'Sanitation Division East'
  },
  {
    id: 'demo-admin-1',
    name: 'Chief Admin Robert Vance',
    email: 'admin.vance@civicfix.gov',
    role: USER_ROLES.ADMIN,
    department: 'City Administration',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    location: 'City Hall Headquarters'
  }
];

export const DEFAULT_MAP_CENTER = [28.6139, 77.2090];
export const DEFAULT_MAP_ZOOM = 12;
