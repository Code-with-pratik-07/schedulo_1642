import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';

import DataManagementPanel from './components/DataManagementPanel';
import TimetableGenerationPanel from './components/TimetableGenerationPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import QuickActionCards from './components/QuickActionCards';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'LayoutDashboard',
      description: 'System status and quick actions'
    },
    {
      id: 'data',
      label: 'Data Management',
      icon: 'Database',
      description: 'Upload and manage institutional data'
    },
    {
      id: 'timetable',
      label: 'Timetable Generation',
      icon: 'Calendar',
      description: 'Generate and manage schedules'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: 'BarChart3',
      description: 'Performance metrics and insights'
    }
  ];

  const institutionStats = {
    totalStudents: 1250,
    totalFaculty: 85,
    totalCourses: 320,
    totalRooms: 45,
    activeSchedules: 12,
    pendingConflicts: 3
  };

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <QuickActionCards />;
      case 'data':
        return <DataManagementPanel />;
      case 'timetable':
        return <TimetableGenerationPanel />;
      case 'analytics':
        return <AnalyticsPanel />;
      default:
        return <QuickActionCards />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="admin" userName="Dr. Admin Kumar" notificationCount={5} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation userRole="admin" />
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Comprehensive institutional management and automated scheduling
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <span>{formatDate(currentTime)}</span>
                  <span>•</span>
                  <span className="font-mono">{formatTime(currentTime)}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-card border border-border rounded-lg p-3">
                    <p className="text-lg font-bold text-card-foreground">{institutionStats?.totalStudents?.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-muted-foreground">Students</p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-3">
                    <p className="text-lg font-bold text-card-foreground">{institutionStats?.totalFaculty}</p>
                    <p className="text-xs text-muted-foreground">Faculty</p>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-3">
                    <p className="text-lg font-bold text-card-foreground">{institutionStats?.totalCourses}</p>
                    <p className="text-xs text-muted-foreground">Courses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Tab Description */}
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                {tabs?.find(tab => tab?.id === activeTab)?.description}
              </p>
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {renderTabContent()}
          </div>

          {/* System Status Bar */}
          <div className="mt-12 bg-card border border-border rounded-lg p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-muted-foreground">System Status: Operational</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Database" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Database: Connected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Active Users: 127</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Last Backup: Today 3:00 AM</span>
                <span>•</span>
                <span>Version 2.1.0</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;