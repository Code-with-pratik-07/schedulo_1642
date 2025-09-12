import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsPanel = ({ onExportSchedule, onMarkAttendance, onRequestSubstitute }) => {
  const [exportFormat, setExportFormat] = useState('pdf');

  const quickActions = [
    {
      id: 'attendance',
      title: 'Mark Attendance',
      description: 'Record student attendance for current class',
      icon: 'Users',
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      action: onMarkAttendance
    },
    {
      id: 'substitute',
      title: 'Request Substitute',
      description: 'Submit substitute teacher request',
      icon: 'UserX',
      color: 'bg-orange-50 border-orange-200 text-orange-700',
      action: onRequestSubstitute
    },
    {
      id: 'schedule',
      title: 'View Full Schedule',
      description: 'Access complete teaching timetable',
      icon: 'Calendar',
      color: 'bg-green-50 border-green-200 text-green-700',
      action: () => {}
    }
  ];

  const exportOptions = [
    { value: 'pdf', label: 'PDF Format', icon: 'FileText' },
    { value: 'ical', label: 'iCal Format', icon: 'Calendar' },
    { value: 'excel', label: 'Excel Format', icon: 'FileSpreadsheet' }
  ];

  const handleExport = (format) => {
    onExportSchedule(format);
    setExportFormat(format);
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
          <p className="text-sm text-muted-foreground">Frequently used functions</p>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {quickActions?.map((action) => (
            <Button
              key={action?.id}
              variant="ghost"
              onClick={action?.action}
              className={`p-4 h-auto justify-start border-2 ${action?.color} hover:opacity-80`}
            >
              <div className="flex items-center space-x-3 w-full">
                <Icon name={action?.icon} size={20} />
                <div className="text-left">
                  <div className="font-medium">{action?.title}</div>
                  <div className="text-xs opacity-80">{action?.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
      {/* Export Options */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">Export Schedule</h2>
          <p className="text-sm text-muted-foreground">Download your teaching schedule</p>
        </div>
        
        <div className="space-y-3">
          {exportOptions?.map((option) => (
            <Button
              key={option?.value}
              variant={exportFormat === option?.value ? "default" : "outline"}
              onClick={() => handleExport(option?.value)}
              iconName={option?.icon}
              iconPosition="left"
              className="w-full justify-start"
            >
              {option?.label}
            </Button>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <Button
            variant="default"
            onClick={() => handleExport(exportFormat)}
            iconName="Download"
            iconPosition="left"
            className="w-full"
          >
            Download {exportOptions?.find(opt => opt?.value === exportFormat)?.label}
          </Button>
        </div>
      </div>
      {/* Statistics */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">This Week</h2>
          <p className="text-sm text-muted-foreground">Teaching statistics</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="BookOpen" size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-foreground">Classes Taught</span>
            </div>
            <span className="text-lg font-semibold text-foreground">24</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Users" size={16} className="text-green-600" />
              <span className="text-sm font-medium text-foreground">Students Taught</span>
            </div>
            <span className="text-lg font-semibold text-foreground">180</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="TrendingUp" size={16} className="text-orange-600" />
              <span className="text-sm font-medium text-foreground">Avg. Attendance</span>
            </div>
            <span className="text-lg font-semibold text-foreground">87%</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Clock" size={16} className="text-purple-600" />
              <span className="text-sm font-medium text-foreground">Teaching Hours</span>
            </div>
            <span className="text-lg font-semibold text-foreground">32h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;