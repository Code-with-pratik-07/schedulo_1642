import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationsFeed = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications?.filter(notification => {
    if (filter === 'unread') return !notification?.read;
    if (filter === 'read') return notification?.read;
    return true;
  });

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'class_update': return 'Calendar';
      case 'room_change': return 'MapPin';
      case 'announcement': return 'Megaphone';
      case 'assignment': return 'FileText';
      case 'exam': return 'GraduationCap';
      default: return 'Bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'class_update': return 'text-blue-600 bg-blue-50';
      case 'room_change': return 'text-orange-600 bg-orange-50';
      case 'announcement': return 'text-purple-600 bg-purple-50';
      case 'assignment': return 'text-green-600 bg-green-50';
      case 'exam': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0}
            iconName="CheckCheck"
            iconSize={16}
          >
            Mark All Read
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
            iconSize={16}
          />
        </div>
      </div>
      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 mb-4 bg-muted rounded-lg p-1">
        {[
          { id: 'all', label: 'All' },
          { id: 'unread', label: 'Unread' },
          { id: 'read', label: 'Read' }
        ]?.map((tab) => (
          <Button
            key={tab?.id}
            variant={filter === tab?.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter(tab?.id)}
            className={`${filter === tab?.id ? '' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {tab?.label}
          </Button>
        ))}
      </div>
      {/* Notifications List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredNotifications?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Bell" size={48} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications found'}
            </p>
          </div>
        ) : (
          filteredNotifications?.map((notification) => (
            <div
              key={notification?.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                notification?.read 
                  ? 'border-border bg-card' :'border-primary/20 bg-primary/5'
              }`}
              onClick={() => onMarkAsRead(notification?.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${getNotificationColor(notification?.type)}`}>
                  <Icon name={getNotificationIcon(notification?.type)} size={16} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4 className={`font-medium ${notification?.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {notification?.title}
                    </h4>
                    <div className="flex items-center space-x-2 ml-2">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimeAgo(notification?.timestamp)}
                      </span>
                      {!notification?.read && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </div>
                  
                  <p className={`text-sm mt-1 ${notification?.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {notification?.message}
                  </p>
                  
                  {notification?.actionRequired && (
                    <div className="mt-2">
                      <Button variant="outline" size="sm">
                        {notification?.actionText || 'View Details'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsFeed;