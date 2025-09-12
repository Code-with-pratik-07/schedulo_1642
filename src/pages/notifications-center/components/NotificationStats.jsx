import React from 'react';
import Icon from '../../../components/AppIcon';

const NotificationStats = ({ stats }) => {
  const statItems = [
    {
      label: 'Total Notifications',
      value: stats?.total,
      icon: 'Bell',
      color: 'text-primary'
    },
    {
      label: 'Unread',
      value: stats?.unread,
      icon: 'AlertCircle',
      color: 'text-warning'
    },
    {
      label: 'High Priority',
      value: stats?.highPriority,
      icon: 'AlertTriangle',
      color: 'text-error'
    },
    {
      label: 'This Week',
      value: stats?.thisWeek,
      icon: 'Calendar',
      color: 'text-success'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems?.map((item, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{item?.label}</p>
              <p className="text-2xl font-bold text-foreground">{item?.value}</p>
            </div>
            <div className={`p-2 rounded-full bg-muted ${item?.color}`}>
              <Icon name={item?.icon} size={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationStats;