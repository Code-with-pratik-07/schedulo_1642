import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../services/notificationService';

export function useRealtimeNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    loadNotifications();
    loadUnreadCount();

    // Set up real-time subscription
    const unsubscribe = notificationService?.subscribeToNotifications(
      user?.id,
      (payload) => {
        handleRealtimeEvent(payload);
      }
    );

    return () => {
      unsubscribe?.();
    };
  }, [user?.id]);

  const loadNotifications = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const data = await notificationService?.getUserNotifications(user?.id);
      setNotifications(data || []);
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    if (!user?.id) return;
    
    try {
      const count = await notificationService?.getUnreadCount(user?.id);
      setUnreadCount(count);
    } catch (err) {
      console.error('Error loading unread count:', err);
    }
  };

  const handleRealtimeEvent = (payload) => {
    switch (payload?.eventType) {
      case 'INSERT':
        setNotifications(prev => [payload?.new, ...prev]);
        if (!payload?.new?.is_read) {
          setUnreadCount(prev => prev + 1);
        }
        break;
      case 'UPDATE':
        setNotifications(prev => 
          prev?.map(item => 
            item?.id === payload?.new?.id ? payload?.new : item
          )
        );
        // Update unread count if read status changed
        if (payload?.old?.is_read !== payload?.new?.is_read) {
          setUnreadCount(prev => 
            payload?.new?.is_read ? prev - 1 : prev + 1
          );
        }
        break;
      case 'DELETE':
        setNotifications(prev => 
          prev?.filter(item => item?.id !== payload?.old?.id)
        );
        if (!payload?.old?.is_read) {
          setUnreadCount(prev => prev - 1);
        }
        break;
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const { error } = await notificationService?.markAsRead(notificationId);
      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return false;
    
    try {
      const { error } = await notificationService?.markAllAsRead(user?.id);
      if (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const { error } = await notificationService?.deleteNotification(notificationId);
      if (error) {
        console.error('Error deleting notification:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: loadNotifications
  };
}