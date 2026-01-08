import { mockNotifications } from '../../data/mockData';

// ============================================================================
// NOTIFICATION SERVICE
// ============================================================================
// When integrating with backend, replace mock implementations with real API calls

/**
 * Get all notifications for current user
 * GET /api/notifications
 */
export const getNotifications = async () => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      status: 'success',
      data: mockNotifications
    };
  }
  
  // Real implementation:
  // return apiRequest('/api/notifications');
};

/**
 * Update notification preferences
 * PUT /api/notifications/preferences
 * @param {Object} preferences - Notification preferences
 */
export const updateNotificationPreferences = async (preferences) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      status: 'success',
      data: preferences
    };
  }
  
  // Real implementation:
  // return apiRequest('/api/notifications/preferences', {
  //   method: 'PUT',
  //   body: JSON.stringify(preferences)
  // });
};

/**
 * Mark notification as read
 * PATCH /api/notifications/:id/read
 * @param {string} notificationId - Notification ID
 */
export const markNotificationAsRead = async (notificationId) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 200));
    const notification = mockNotifications.find(n => n._id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
    return {
      status: 'success',
      data: notification
    };
  }
  
  // Real implementation:
  // return apiRequest(`/api/notifications/${notificationId}/read`, {
  //   method: 'PATCH'
  // });
};

/**
 * Delete notification
 * DELETE /api/notifications/:id
 * @param {string} notificationId - Notification ID
 */
export const deleteNotification = async (notificationId) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 200));
    const notificationIndex = mockNotifications.findIndex(n => n._id === notificationId);
    if (notificationIndex === -1) {
      throw new Error('Notification not found');
    }
    mockNotifications.splice(notificationIndex, 1);
    return {
      status: 'success',
      message: 'Notification deleted'
    };
  }
  
  // Real implementation:
  // return apiRequest(`/api/notifications/${notificationId}`, {
  //   method: 'DELETE'
  // });
};
