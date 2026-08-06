import { USER_ROLES } from '../utils/constants';

export const INITIAL_DEPARTMENTS = [
  {
    id: 'dept-pwd',
    name: 'Public Works Department (PWD)',
    head: 'Chief Engineer R. Sharma',
    officersCount: 14,
    activeComplaints: 28,
    resolvedComplaints: 142,
    avgResolutionDays: 3.2,
    email: 'contact@pwd.gov'
  },
  {
    id: 'dept-sanitation',
    name: 'Sanitation & Solid Waste',
    head: 'Director M. Gupta',
    officersCount: 22,
    activeComplaints: 19,
    resolvedComplaints: 310,
    avgResolutionDays: 1.5,
    email: 'support@sanitation.gov'
  },
  {
    id: 'dept-water',
    name: 'Water Supply Board',
    head: 'Superintendent A. Patel',
    officersCount: 11,
    activeComplaints: 15,
    resolvedComplaints: 98,
    avgResolutionDays: 2.1,
    email: 'helpline@waterboard.gov'
  },
  {
    id: 'dept-electrical',
    name: 'Electrical & Street Lighting',
    head: 'Executive Officer K. Singh',
    officersCount: 9,
    activeComplaints: 12,
    resolvedComplaints: 185,
    avgResolutionDays: 1.8,
    email: 'lights@cityelectric.gov'
  },
  {
    id: 'dept-traffic',
    name: 'Traffic Management',
    head: 'Inspector V. Rao',
    officersCount: 8,
    activeComplaints: 7,
    resolvedComplaints: 76,
    avgResolutionDays: 1.0,
    email: 'traffic@citypolice.gov'
  }
];

export const INITIAL_ISSUES = [
  {
    id: 'issue-101',
    title: 'Hazardous Deep Pothole on Main Avenue',
    description: 'A deep pothole has formed near the central intersection. Two two-wheelers suffered tire bursts yesterday. High risk of accidents during evening rush hour.',
    category: 'Pothole',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL',
    latitude: 28.6139,
    longitude: 77.2090,
    address: 'Connaught Place Main Circle, Sector 1, Central District',
    images: [
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800',
      'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800'
    ],
    createdBy: {
      uid: 'demo-citizen-1',
      name: 'Jane Citizen',
      email: 'jane.citizen@civicfix.org',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    isAnonymous: false,
    assignedDepartment: 'Public Works Department (PWD)',
    assignedOfficer: {
      uid: 'demo-officer-1',
      name: 'Officer Dave Miller'
    },
    votes: ['demo-citizen-1', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6', 'user-7', 'user-8', 'user-9', 'user-10', 'user-11', 'user-12'],
    commentsCount: 3,
    estimatedCompletionDate: '2026-08-10',
    resolutionNotes: 'PWD repair truck deployed with hot asphalt mixture. Work underway.',
    resolutionImages: [],
    aiConfidence: 96,
    aiSuggestedPriority: 'CRITICAL',
    aiSummary: 'AI identified severe road asphalt depression creating immediate vehicle impact hazard.',
    createdAt: new Date('2026-08-04T10:30:00Z').toISOString(),
    updatedAt: new Date('2026-08-05T14:20:00Z').toISOString()
  },
  {
    id: 'issue-102',
    title: 'Overflowing Trash Dumpster Blocking Sidewalk',
    description: 'Municipal trash bin overflowing for 3 days. Foul odor spreading into neighboring food market. Stray animals scattering litter onto the main road.',
    category: 'Garbage',
    status: 'PENDING',
    priority: 'HIGH',
    latitude: 28.6250,
    longitude: 77.2180,
    address: 'Market Street, Block B, Near Metro Gate 3',
    images: [
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800'
    ],
    createdBy: {
      uid: 'user-guest-99',
      name: 'Anonymous Citizen',
      email: 'anonymous@civicfix.org',
      photoURL: ''
    },
    isAnonymous: true,
    assignedDepartment: 'Sanitation & Solid Waste',
    assignedOfficer: null,
    votes: ['demo-citizen-1', 'user-15', 'user-16', 'user-17', 'user-18', 'user-19', 'user-20'],
    commentsCount: 1,
    estimatedCompletionDate: null,
    resolutionNotes: '',
    resolutionImages: [],
    aiConfidence: 94,
    aiSuggestedPriority: 'HIGH',
    aiSummary: 'AI detected municipal bin overload with solid waste spilling onto pedestrian walkway.',
    createdAt: new Date('2026-08-05T08:15:00Z').toISOString(),
    updatedAt: new Date('2026-08-05T08:15:00Z').toISOString()
  },
  {
    id: 'issue-103',
    title: 'Major Water Pipe Burst Gushing onto Highway',
    description: 'Clean drinking water pipe cracked under high pressure. Thousands of liters of water wasted every hour. Road surface beginning to erode.',
    category: 'Water Leakage',
    status: 'RESOLVED',
    priority: 'CRITICAL',
    latitude: 28.6050,
    longitude: 77.1950,
    address: 'Ring Road Flyover Junction, Pillar 42',
    images: [
      'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800'
    ],
    createdBy: {
      uid: 'user-33',
      name: 'Rahul Sharma',
      email: 'rahul.s@example.com',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    },
    isAnonymous: false,
    assignedDepartment: 'Water Supply Board',
    assignedOfficer: {
      uid: 'officer-water-1',
      name: 'Officer Superintendant Patel'
    },
    votes: ['demo-citizen-1', 'user-2', 'user-3', 'user-4', 'user-25', 'user-26', 'user-27', 'user-28', 'user-29', 'user-30', 'user-31', 'user-32', 'user-33', 'user-34', 'user-35'],
    commentsCount: 4,
    estimatedCompletionDate: '2026-08-05',
    resolutionNotes: 'Emergency valve shut off accomplished at 11:00 AM. Pipe section replaced and sealed.',
    resolutionImages: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'
    ],
    aiConfidence: 98,
    aiSuggestedPriority: 'CRITICAL',
    aiSummary: 'AI identified pressurized clean water pipe rupture with high volumetric loss.',
    createdAt: new Date('2026-08-03T06:00:00Z').toISOString(),
    updatedAt: new Date('2026-08-05T16:45:00Z').toISOString()
  },
  {
    id: 'issue-104',
    title: 'Unlit Dark Stretch - 4 Streetlights Non-Functional',
    description: 'Four consecutive streetlights are out along the residential park corridor. Safety concern for women and senior citizens walking at night.',
    category: 'Streetlight',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    latitude: 28.6320,
    longitude: 77.2250,
    address: 'Green Park Avenue, Lane 7',
    images: [
      'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800'
    ],
    createdBy: {
      uid: 'demo-citizen-1',
      name: 'Jane Citizen',
      email: 'jane.citizen@civicfix.org',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    isAnonymous: false,
    assignedDepartment: 'Electrical & Street Lighting',
    assignedOfficer: {
      uid: 'officer-elec-1',
      name: 'Officer K. Singh'
    },
    votes: ['demo-citizen-1', 'user-40', 'user-41', 'user-42', 'user-43'],
    commentsCount: 2,
    estimatedCompletionDate: '2026-08-08',
    resolutionNotes: 'Replacement LED luminaires dispatched. Electrician team scheduled for evening install.',
    resolutionImages: [],
    aiConfidence: 91,
    aiSuggestedPriority: 'MEDIUM',
    aiSummary: 'AI classified dark municipal light pole fixture requiring bulb / driver replacement.',
    createdAt: new Date('2026-08-04T19:20:00Z').toISOString(),
    updatedAt: new Date('2026-08-05T10:00:00Z').toISOString()
  },
  {
    id: 'issue-105',
    title: 'Fallen Tree Branch Blocking Lane 3 Traffic',
    description: 'Heavy storm last night snapped a large oak branch. Branch is resting across both driving lanes near the school entrance.',
    category: 'Fallen Tree',
    status: 'RESOLVED',
    priority: 'HIGH',
    latitude: 28.6180,
    longitude: 77.1980,
    address: 'St. Marks School Road, Zone 4',
    images: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800'
    ],
    createdBy: {
      uid: 'user-55',
      name: 'Amit Verma',
      email: 'amit.verma@example.com',
      photoURL: ''
    },
    isAnonymous: false,
    assignedDepartment: 'Parks & Horticulture',
    assignedOfficer: {
      uid: 'officer-tree-1',
      name: 'Horticulture Team Lead'
    },
    votes: ['demo-citizen-1', 'user-50', 'user-51', 'user-52', 'user-53', 'user-54'],
    commentsCount: 2,
    estimatedCompletionDate: '2026-08-05',
    resolutionNotes: 'Chainsaw crew cleared timber. Wood hauled to municipal compost center.',
    resolutionImages: [],
    aiConfidence: 97,
    aiSuggestedPriority: 'HIGH',
    aiSummary: 'AI detected large storm timber obstruction blocking vehicular road access.',
    createdAt: new Date('2026-08-04T07:30:00Z').toISOString(),
    updatedAt: new Date('2026-08-05T12:00:00Z').toISOString()
  }
];

export const INITIAL_COMMENTS = {
  'issue-101': [
    {
      id: 'comment-1',
      issueId: 'issue-101',
      user: {
        uid: 'demo-citizen-1',
        name: 'Jane Citizen',
        role: USER_ROLES.CITIZEN,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
      },
      message: 'I almost hit this pothole last night! Thank you for assigning PWD officers quickly.',
      createdAt: new Date('2026-08-04T11:00:00Z').toISOString()
    },
    {
      id: 'comment-2',
      issueId: 'issue-101',
      user: {
        uid: 'demo-officer-1',
        name: 'Officer Dave Miller',
        role: USER_ROLES.OFFICER,
        department: 'Public Works Department (PWD)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      },
      message: 'Update: Heavy machinery and cold mix patch arrive at 2:00 PM today. Lane 1 will be temporarily closed.',
      createdAt: new Date('2026-08-05T09:30:00Z').toISOString()
    },
    {
      id: 'comment-3',
      issueId: 'issue-101',
      user: {
        uid: 'user-8',
        name: 'Carlos Ruiz',
        role: USER_ROLES.CITIZEN,
        avatar: ''
      },
      message: 'Great response speed. Upvoted for priority attention!',
      createdAt: new Date('2026-08-05T12:10:00Z').toISOString()
    }
  ],
  'issue-102': [
    {
      id: 'comment-4',
      issueId: 'issue-102',
      user: {
        uid: 'demo-officer-2',
        name: 'Officer Sarah Chen',
        role: USER_ROLES.OFFICER,
        department: 'Sanitation & Solid Waste',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
      },
      message: 'Sanitation truck #14 assigned for morning pickup route.',
      createdAt: new Date('2026-08-05T10:00:00Z').toISOString()
    }
  ]
};

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    userId: 'demo-citizen-1',
    title: 'Status Update on Your Issue',
    message: 'Your report "Hazardous Deep Pothole on Main Avenue" status was changed to In Progress.',
    type: 'status_update',
    issueId: 'issue-101',
    read: false,
    createdAt: new Date('2026-08-05T14:20:00Z').toISOString()
  },
  {
    id: 'notif-2',
    userId: 'demo-citizen-1',
    title: 'New Upvote',
    message: '5 more citizens upvoted your reported issue in Sector 1.',
    type: 'upvote',
    issueId: 'issue-101',
    read: true,
    createdAt: new Date('2026-08-05T11:00:00Z').toISOString()
  },
  {
    id: 'notif-3',
    userId: 'demo-citizen-1',
    title: 'Officer Comment',
    message: 'Officer Dave Miller commented on your pothole report.',
    type: 'comment',
    issueId: 'issue-101',
    read: false,
    createdAt: new Date('2026-08-05T09:30:00Z').toISOString()
  }
];
