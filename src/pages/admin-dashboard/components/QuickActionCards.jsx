import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionCards = () => {
  const navigate = useNavigate();

  const systemStatus = {
    overall: 'healthy',
    database: 'connected',
    notifications: 'active',
    backups: 'completed',
    lastUpdate: '2024-09-12 14:30:00'
  };

  const pendingApprovals = [
    { type: 'substitution', count: 5, urgent: 2 },
    { type: 'room_booking', count: 3, urgent: 1 },
    { type: 'schedule_change', count: 8, urgent: 0 },
    { type: 'faculty_request', count: 2, urgent: 1 }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'upload',
      description: 'Student data uploaded successfully',
      user: 'Admin',
      timestamp: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'generation',
      description: 'Timetable generated for CS Department',
      user: 'System',
      timestamp: '4 hours ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'approval',
      description: 'Substitution request approved',
      user: 'Dr. Smith',
      timestamp: '6 hours ago',
      status: 'approved'
    },
    {
      id: 4,
      type: 'conflict',
      description: 'Room conflict resolved in Block A',
      user: 'System',
      timestamp: '1 day ago',
      status: 'resolved'
    },
    {
      id: 5,
      type: 'notification',
      description: 'Weekly schedule notifications sent',
      user: 'System',
      timestamp: '1 day ago',
      status: 'sent'
    }
  ];

  const quickActions = [
    {
      title: 'Generate New Timetable',
      description: 'Create optimized schedules with conflict resolution',
      icon: 'Calendar',
      color: 'bg-primary',
      action: () => navigate('/timetable-generator')
    },
    {
      title: 'Upload Data',
      description: 'Import student, faculty, or course information',
      icon: 'Upload',
      color: 'bg-success',
      action: () => console.log('Upload data')
    },
    {
      title: 'View Reports',
      description: 'Access analytics and performance metrics',
      icon: 'BarChart3',
      color: 'bg-accent',
      action: () => console.log('View reports')
    },
    {
      title: 'Manage Users',
      description: 'Add or modify faculty and student accounts',
      icon: 'Users',
      color: 'bg-secondary',
      action: () => console.log('Manage users')
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': case'connected': case'active': case'completed':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error': case'failed':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'upload': return 'Upload';
      case 'generation': return 'Calendar';
      case 'approval': return 'CheckCircle';
      case 'conflict': return 'AlertTriangle';
      case 'notification': return 'Bell';
      default: return 'Activity';
    }
  };

  const getTotalPendingApprovals = () => {
    return pendingApprovals?.reduce((total, item) => total + item?.count, 0);
  };

  const getTotalUrgentApprovals = () => {
    return pendingApprovals?.reduce((total, item) => total + item?.urgent, 0);
  };

  return (
    <div className="space-y-6">
      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions?.map((action, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={action?.action}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 ${action?.color} rounded-lg flex items-center justify-center`}>
                <Icon name={action?.icon} size={24} color="white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-card-foreground">{action?.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{action?.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">System Status</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-success">All Systems Operational</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Database" size={16} className="text-muted-foreground" />
                <span className="text-sm text-card-foreground">Database</span>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(systemStatus?.database)}`}>
                {systemStatus?.database}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Bell" size={16} className="text-muted-foreground" />
                <span className="text-sm text-card-foreground">Notifications</span>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(systemStatus?.notifications)}`}>
                {systemStatus?.notifications}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="HardDrive" size={16} className="text-muted-foreground" />
                <span className="text-sm text-card-foreground">Backups</span>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(systemStatus?.backups)}`}>
                {systemStatus?.backups}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Last updated: {systemStatus?.lastUpdate}
            </p>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">Pending Approvals</h3>
            <div className="flex items-center space-x-2">
              <span className="bg-warning/10 text-warning px-2 py-1 rounded-full text-xs font-medium">
                {getTotalPendingApprovals()} Total
              </span>
              {getTotalUrgentApprovals() > 0 && (
                <span className="bg-destructive/10 text-destructive px-2 py-1 rounded-full text-xs font-medium">
                  {getTotalUrgentApprovals()} Urgent
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {pendingApprovals?.map((approval, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-card-foreground capitalize">
                    {approval?.type?.replace('_', ' ')}
                  </p>
                  {approval?.urgent > 0 && (
                    <p className="text-xs text-destructive">{approval?.urgent} urgent</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                    {approval?.count}
                  </span>
                  <Button variant="ghost" size="sm" iconName="ChevronRight" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Button variant="outline" fullWidth>
              View All Approvals
            </Button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">Recent Activities</h3>
            <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
          </div>

          <div className="space-y-3">
            {recentActivities?.map((activity) => (
              <div key={activity?.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-muted/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={getActivityIcon(activity?.type)} size={14} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-card-foreground">{activity?.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-muted-foreground">{activity?.user}</p>
                    <span className="text-xs text-muted-foreground">•</span>
                    <p className="text-xs text-muted-foreground">{activity?.timestamp}</p>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
                  activity?.status === 'completed' || activity?.status === 'approved' || activity?.status === 'resolved' || activity?.status === 'sent'
                    ? 'bg-success' :'bg-warning'
                }`}></div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Button variant="outline" fullWidth>
              View Activity Log
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionCards;