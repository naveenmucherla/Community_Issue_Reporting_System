import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/**
 * Format timestamp into human friendly string (e.g., '2 hours ago', 'Aug 6, 2026')
 */
export const formatDate = (date, format = 'MMM D, YYYY h:mm A') => {
  if (!date) return 'N/A';
  const d = date.toDate ? date.toDate() : new Date(date);
  return dayjs(d).format(format);
};

export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  const d = date.toDate ? date.toDate() : new Date(date);
  return dayjs(d).fromNow();
};

/**
 * Get color hex code for issue status
 */
export const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return '#FAAD14'; // Warning Yellow/Amber
    case 'IN_PROGRESS':
    case 'IN PROGRESS':
      return '#1677FF'; // Primary Blue
    case 'RESOLVED':
      return '#52C41A'; // Success Green
    case 'REJECTED':
      return '#F5222D'; // Danger Red
    default:
      return '#8c8c8c';
  }
};

/**
 * Get color hex for priority tag
 */
export const getPriorityColor = (priority) => {
  switch (priority?.toUpperCase()) {
    case 'CRITICAL':
      return '#F5222D';
    case 'HIGH':
      return '#FAAD14';
    case 'MEDIUM':
      return '#1677FF';
    case 'LOW':
    default:
      return '#8c8c8c';
  }
};

/**
 * Convert file object to Base64 string for preview & local storage simulation
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Truncate long string with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Calculate distance between two coordinates in km (Haversine formula)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1); // Distance in km
};

/**
 * Calculate expected SLA resolution days based on priority
 */
export const getSLADays = (priority) => {
  switch (priority?.toUpperCase()) {
    case 'CRITICAL':
      return 1;
    case 'HIGH':
      return 3;
    case 'MEDIUM':
      return 7;
    case 'LOW':
    default:
      return 14;
  }
};
