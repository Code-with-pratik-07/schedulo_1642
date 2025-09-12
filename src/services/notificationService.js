import { supabase } from '../lib/supabase';

class NotificationService {
  async getUserNotifications(userId, limit = 50) {
    try {
      const { data, error } = await supabase?.from('notifications')?.select('*')?.eq('user_id', userId)?.order('created_at', { ascending: false })?.limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error('Failed to load notifications');
    }
  }

  async getUnreadCount(userId) {
    try {
      const { count, error } = await supabase?.from('notifications')?.select('*', { count: 'exact', head: true })?.eq('user_id', userId)?.eq('is_read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  async markAsRead(notificationId) {
    try {
      const { data, error } = await supabase?.from('notifications')?.update({ is_read: true })?.eq('id', notificationId)?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { 
        data: null, 
        error: { message: 'Failed to mark notification as read' } 
      };
    }
  }

  async markAllAsRead(userId) {
    try {
      const { data, error } = await supabase?.from('notifications')?.update({ is_read: true })?.eq('user_id', userId)?.eq('is_read', false)?.select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { 
        data: null, 
        error: { message: 'Failed to mark notifications as read' } 
      };
    }
  }

  async createNotification(notification) {
    try {
      const { data, error } = await supabase?.from('notifications')?.insert([{
          user_id: notification?.user_id,
          title: notification?.title,
          message: notification?.message,
          type: notification?.type || 'info'
        }])?.select()?.single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating notification:', error);
      return { 
        data: null, 
        error: { message: 'Failed to create notification' } 
      };
    }
  }

  async deleteNotification(notificationId) {
    try {
      const { error } = await supabase?.from('notifications')?.delete()?.eq('id', notificationId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { error: { message: 'Failed to delete notification' } };
    }
  }

  subscribeToNotifications(userId, callback) {
    try {
      const channel = supabase?.channel(`notifications_${userId}`)?.on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            callback?.(payload);
          }
        )?.subscribe();

      return () => {
        supabase?.removeChannel(channel);
      };
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      return () => {};
    }
  }
}

export const notificationService = new NotificationService();