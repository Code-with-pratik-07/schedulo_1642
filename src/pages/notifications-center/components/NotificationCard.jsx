import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationCard = ({ 
  notification, 
  isSelected, 
  onSelect, 
  onMarkAsRead, 
  onArchive, 
  onDelete 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'Info';
      default: return 'Bell';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      default: return 'text-primary';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'schedule': return 'Calendar';
      case 'administrative': return 'FileText';
      case 'system': return 'Settings';
      case 'personal': return 'User';
      default: return 'Bell';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const notificationDate = new Date(timestamp);
    const diffInHours = Math.floor((now - notificationDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
      !notification?.isRead ? 'border-l-4 border-l-primary' : ''
    } ${isSelected ? 'ring-2 ring-primary ring-opacity-50' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(notification?.id, e?.target?.checked)}
              className="rounded border-border text-primary focus:ring-primary"
            />
            <div className={`p-2 rounded-full bg-muted ${getPriorityColor(notification?.priority)}`}>
              <Icon name={getPriorityIcon(notification?.priority)} size={16} />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name={getCategoryIcon(notification?.category)} size={14} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {notification?.category}
              </span>
              {!notification?.isRead && (
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              )}
            </div>
            
            <h3 className={`text-sm font-medium ${!notification?.isRead ? 'text-foreground' : 'text-muted-foreground'} mb-1`}>
              {notification?.subject}
            </h3>
            
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>From: {notification?.sender}</span>
              <span>{formatTimestamp(notification?.timestamp)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          />
          
          <div className="relative group">
            <Button
              variant="ghost"
              size="xs"
              iconName="MoreVertical"
            />
            <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="p-1">
                {!notification?.isRead && (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onMarkAsRead(notification?.id)}
                    iconName="Check"
                    iconPosition="left"
                    className="w-full justify-start"
                  >
                    Mark as Read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => onArchive(notification?.id)}
                  iconName="Archive"
                  iconPosition="left"
                  className="w-full justify-start"
                >
                  Archive
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => onDelete(notification?.id)}
                  iconName="Trash2"
                  iconPosition="left"
                  className="w-full justify-start text-destructive hover:text-destructive"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Preview */}
      <div className="mb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {notification?.preview}
        </p>
      </div>
      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border pt-3 animate-slide-down">
          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {notification?.content}
            </p>
          </div>
          
          {notification?.attachments && notification?.attachments?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Attachments</h4>
              <div className="space-y-2">
                {notification?.attachments?.map((attachment, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <Icon name="Paperclip" size={14} className="text-muted-foreground" />
                    <span className="text-primary hover:underline cursor-pointer">
                      {attachment?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({attachment?.size})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {notification?.actions && notification?.actions?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {notification?.actions?.map((action, index) => (
                  <Button
                    key={index}
                    variant={action?.type === 'primary' ? 'default' : 'outline'}
                    size="xs"
                    onClick={() => action?.onClick()}
                  >
                    {action?.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCard;