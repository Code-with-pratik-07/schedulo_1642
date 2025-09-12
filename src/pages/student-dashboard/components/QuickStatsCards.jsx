import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStatsCards = ({ stats }) => {
  const statItems = [
    {
      id: 'remaining',
      label: 'Classes Remaining Today',
      value: stats?.remainingClasses,
      icon: 'Clock',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      id: 'assignments',
      label: 'Upcoming Assignments',
      value: stats?.upcomingAssignments,
      icon: 'FileText',
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600'
    },
    {
      id: 'attendance',
      label: 'Attendance Rate',
      value: `${stats?.attendancePercentage}%`,
      icon: 'TrendingUp',
      color: 'text-green-600 bg-green-50 border-green-200',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {statItems?.map((item) => (
        <div
          key={item?.id}
          className={`bg-card border rounded-lg p-4 ${item?.color}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {item?.label}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {item?.value}
              </p>
            </div>
            <div className={`p-3 rounded-full ${item?.color}`}>
              <Icon name={item?.icon} size={24} className={item?.iconColor} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStatsCards;