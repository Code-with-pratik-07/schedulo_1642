import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationAlert = ({ notifications, onMarkAsRead, onDismiss }) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    // Show only unread notifications
    const unreadNotifications = notifications?.filter(n => !n?.isRead);
    setVisibleNotifications(unreadNotifications?.slice(0, 3)); // Show max 3 at a time
  }, [notifications]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'schedule_change':
        return 'Calendar';
      case 'room_change':
        return 'MapPin';
      case 'substitute_request':
        return 'UserX';
      case 'admin_update':
        return 'Bell';
      case 'attendance_reminder':
        return 'Users';
      default:
        return 'Info';
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') {
      return 'bg-destructive/10 border-destructive/20 text-destructive';
    }
    
    switch (type) {
      case 'schedule_change':
        return 'bg-warning/10 border-warning/20 text-warning';
      case 'room_change':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'substitute_request':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'admin_update':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'attendance_reminder':
        return 'bg-green-50 border-green-200 text-green-700';
      default:
        return 'bg-muted border-border text-foreground';
    }
  };

  const handleMarkAsRead = (notificationId) => {
    onMarkAsRead(notificationId);
    setVisibleNotifications(prev => prev?.filter(n => n?.id !== notificationId));
  };

  const handleDismiss = (notificationId) => {
    onDismiss(notificationId);
    setVisibleNotifications(prev => prev?.filter(n => n?.id !== notificationId));
  };

  if (visibleNotifications?.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6">
      {visibleNotifications?.map((notification) => (
        <div
          key={notification?.id}
          className={`p-4 rounded-lg border-2 animate-slide-down ${getNotificationColor(notification?.type, notification?.priority)}`}
        >
          <div className="flex items-start space-x-3">
            <Icon 
              name={getNotificationIcon(notification?.type)} 
              size={20} 
              className="mt-0.5 flex-shrink-0" 
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{notification?.title}</h4>
                  <p className="text-sm opacity-90 mb-2">{notification?.message}</p>
                  <div className="flex items-center space-x-4 text-xs opacity-75">
                    <span>{new Date(notification.timestamp)?.toLocaleString('en-GB')}</span>
                    {notification?.priority === 'high' && (
                      <span className="flex items-center space-x-1">
                        <Icon name="AlertTriangle" size={12} />
                        <span>High Priority</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1 ml-3">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleMarkAsRead(notification?.id)}
                    iconName="Check"
                    className="opacity-70 hover:opacity-100"
                  />
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleDismiss(notification?.id)}
                    iconName="X"
                    className="opacity-70 hover:opacity-100"
                  />
                </div>
              </div>
              
              {notification?.actionRequired && (
                <div className="mt-3 pt-3 border-t border-current/20">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => notification?.onAction && notification?.onAction()}
                    iconName="ArrowRight"
                    iconPosition="right"
                    className="text-xs bg-white/20 hover:bg-white/30"
                  >
                    {notification?.actionText || 'Take Action'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      {notifications?.filter(n => !n?.isRead)?.length > 3 && (
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/notifications-center'}
            iconName="Bell"
            iconPosition="left"
            className="text-muted-foreground"
          >
            View {notifications?.filter(n => !n?.isRead)?.length - 3} more notifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationAlert;