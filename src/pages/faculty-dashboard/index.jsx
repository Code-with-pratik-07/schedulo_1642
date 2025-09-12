import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import WeeklyScheduleGrid from './components/WeeklyScheduleGrid';
import UnavailabilityPanel from './components/UnavailabilityPanel';
import StudentGroupCard from './components/StudentGroupCard';
import QuickActionsPanel from './components/QuickActionsPanel';
import NotificationAlert from './components/NotificationAlert';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [currentUser] = useState({
    name: 'Dr. Sarah Johnson',
    role: 'faculty',
    employeeId: 'FAC001',
    department: 'Computer Science',
    email: 'sarah.johnson@university.edu'
  });

  // Mock schedule data
  const [scheduleData] = useState([
    {
      id: 1,
      dayIndex: 0, // Monday
      timeSlot: '09:00 - 10:00',
      subject: 'Computer Science',
      room: 'CS-101',
      studentCount: 45,
      className: 'CSE-3A'
    },
    {
      id: 2,
      dayIndex: 0,
      timeSlot: '11:00 - 12:00',
      subject: 'Mathematics',
      room: 'M-201',
      studentCount: 38,
      className: 'CSE-3B'
    },
    {
      id: 3,
      dayIndex: 1, // Tuesday
      timeSlot: '10:00 - 11:00',
      subject: 'Physics',
      room: 'P-105',
      studentCount: 42,
      className: 'CSE-2A'
    },
    {
      id: 4,
      dayIndex: 2, // Wednesday
      timeSlot: '14:00 - 15:00',
      subject: 'Computer Science',
      room: 'CS-102',
      studentCount: 40,
      className: 'CSE-3C'
    },
    {
      id: 5,
      dayIndex: 3, // Thursday
      timeSlot: '09:00 - 10:00',
      subject: 'Chemistry',
      room: 'C-301',
      studentCount: 35,
      className: 'CSE-2B'
    },
    {
      id: 6,
      dayIndex: 4, // Friday
      timeSlot: '15:00 - 16:00',
      subject: 'English',
      room: 'E-201',
      studentCount: 50,
      className: 'CSE-1A'
    }
  ]);

  // Mock unavailability requests
  const [unavailabilityRequests, setUnavailabilityRequests] = useState([
    {
      id: 1,
      startDate: '2025-01-15',
      endDate: '2025-01-16',
      reason: 'medical',
      description: 'Medical appointment and recovery',
      status: 'approved',
      submittedAt: '2025-01-10T10:30:00Z',
      adminNotes: 'Approved. Substitute arranged for both days.'
    },
    {
      id: 2,
      startDate: '2025-01-20',
      endDate: '2025-01-20',
      reason: 'conference',
      description: 'Attending AI in Education Conference',
      status: 'pending',
      submittedAt: '2025-01-12T14:20:00Z',
      adminNotes: null
    },
    {
      id: 3,
      startDate: '2025-01-08',
      endDate: '2025-01-09',
      reason: 'personal',
      description: 'Family emergency',
      status: 'rejected',
      submittedAt: '2025-01-05T09:15:00Z',
      adminNotes: 'Unable to arrange substitute on short notice. Please provide more advance notice for future requests.'
    }
  ]);

  // Mock student groups
  const [studentGroups] = useState([
    {
      id: 1,
      subject: 'Computer Science',
      className: 'CSE-3A',
      room: 'CS-101',
      averageAttendance: 87,
      schedule: {
        time: '09:00 - 10:00',
        days: ['Monday', 'Wednesday', 'Friday']
      },
      nextClass: 'Tomorrow 09:00 AM',
      students: [
        {
          id: 1,
          name: 'Rahul Sharma',
          rollNumber: 'CSE001',
          email: 'rahul.sharma@student.edu',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          attendance: 92,
          presentDays: 23,
          totalDays: 25
        },
        {
          id: 2,
          name: 'Priya Patel',
          rollNumber: 'CSE002',
          email: 'priya.patel@student.edu',
          avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
          attendance: 88,
          presentDays: 22,
          totalDays: 25
        },
        {
          id: 3,
          name: 'Amit Kumar',
          rollNumber: 'CSE003',
          email: 'amit.kumar@student.edu',
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
          attendance: 84,
          presentDays: 21,
          totalDays: 25
        },
        {
          id: 4,
          name: 'Sneha Reddy',
          rollNumber: 'CSE004',
          email: 'sneha.reddy@student.edu',
          avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
          attendance: 90,
          presentDays: 23,
          totalDays: 25
        },
        {
          id: 5,
          name: 'Vikram Singh',
          rollNumber: 'CSE005',
          email: 'vikram.singh@student.edu',
          avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
          attendance: 76,
          presentDays: 19,
          totalDays: 25
        }
      ]
    },
    {
      id: 2,
      subject: 'Mathematics',
      className: 'CSE-3B',
      room: 'M-201',
      averageAttendance: 82,
      schedule: {
        time: '11:00 - 12:00',
        days: ['Monday', 'Thursday']
      },
      nextClass: 'Thursday 11:00 AM',
      students: [
        {
          id: 6,
          name: 'Anita Gupta',
          rollNumber: 'CSE006',
          email: 'anita.gupta@student.edu',
          avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
          attendance: 85,
          presentDays: 17,
          totalDays: 20
        },
        {
          id: 7,
          name: 'Ravi Mehta',
          rollNumber: 'CSE007',
          email: 'ravi.mehta@student.edu',
          avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
          attendance: 79,
          presentDays: 16,
          totalDays: 20
        },
        {
          id: 8,
          name: 'Kavya Nair',
          rollNumber: 'CSE008',
          email: 'kavya.nair@student.edu',
          avatar: 'https://randomuser.me/api/portraits/women/8.jpg',
          attendance: 83,
          presentDays: 17,
          totalDays: 20
        }
      ]
    }
  ]);

  // Mock notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'schedule_change',
      priority: 'high',
      title: 'Schedule Change Alert',
      message: 'Your Monday 2:00 PM class has been moved to Room CS-103 due to maintenance.',
      timestamp: new Date(Date.now() - 300000)?.toISOString(),
      isRead: false,
      actionRequired: true,
      actionText: 'View Details'
    },
    {
      id: 2,
      type: 'substitute_request',
      priority: 'medium',
      title: 'Substitute Request Update',
      message: 'Your substitute request for January 20th has been approved. Dr. Michael Brown will cover your classes.',
      timestamp: new Date(Date.now() - 1800000)?.toISOString(),
      isRead: false,
      actionRequired: false
    },
    {
      id: 3,
      type: 'attendance_reminder',
      priority: 'low',
      title: 'Attendance Reminder',
      message: 'Please mark attendance for CSE-3A Computer Science class from yesterday.',
      timestamp: new Date(Date.now() - 3600000)?.toISOString(),
      isRead: false,
      actionRequired: true,
      actionText: 'Mark Attendance'
    }
  ]);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'faculty') {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleMarkAttendance = (classId) => {
    console.log('Marking attendance for class:', classId);
    // In a real app, this would navigate to attendance marking page
    alert('Attendance marking feature would open here');
  };

  const handleRequestSubstitute = (classId) => {
    console.log('Requesting substitute for class:', classId);
    // In a real app, this would open substitute request form
    alert('Substitute request form would open here');
  };

  const handleSubmitUnavailabilityRequest = (requestData) => {
    const newRequest = {
      id: unavailabilityRequests?.length + 1,
      ...requestData,
      status: 'pending',
      submittedAt: new Date()?.toISOString(),
      adminNotes: null
    };
    
    setUnavailabilityRequests(prev => [newRequest, ...prev]);
    alert('Unavailability request submitted successfully!');
  };

  const handleExportSchedule = (format) => {
    console.log('Exporting schedule in format:', format);
    alert(`Schedule export in ${format?.toUpperCase()} format would start here`);
  };

  const handleViewStudentDetails = (groupId) => {
    console.log('Viewing details for group:', groupId);
    alert('Student group details would open here');
  };

  const handleMarkNotificationAsRead = (notificationId) => {
    setNotifications(prev =>
      prev?.map(n => n?.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const handleDismissNotification = (notificationId) => {
    setNotifications(prev => prev?.filter(n => n?.id !== notificationId));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole={currentUser?.role}
        userName={currentUser?.name}
        notificationCount={notifications?.filter(n => !n?.isRead)?.length}
      />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation userRole={currentUser?.role} />
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Faculty Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Welcome back, {currentUser?.name} • {currentUser?.department} Department
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/notifications-center')}
                  iconName="Bell"
                  iconPosition="left"
                  className="relative"
                >
                  Notifications
                  {notifications?.filter(n => !n?.isRead)?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {notifications?.filter(n => !n?.isRead)?.length}
                    </span>
                  )}
                </Button>
                <Button
                  variant="default"
                  onClick={() => handleExportSchedule('pdf')}
                  iconName="Download"
                  iconPosition="left"
                >
                  Export Schedule
                </Button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <NotificationAlert
            notifications={notifications}
            onMarkAsRead={handleMarkNotificationAsRead}
            onDismiss={handleDismissNotification}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Left Column - Schedule and Student Groups */}
            <div className="xl:col-span-3 space-y-8">
              {/* Weekly Schedule */}
              <WeeklyScheduleGrid
                scheduleData={scheduleData}
                onMarkAttendance={handleMarkAttendance}
                onRequestSubstitute={handleRequestSubstitute}
              />

              {/* Student Groups */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Student Groups</h2>
                    <p className="text-sm text-muted-foreground">Manage your classes and student attendance</p>
                  </div>
                  <Button
                    variant="outline"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => alert('Add new student group functionality')}
                  >
                    Add Group
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {studentGroups?.map((group) => (
                    <StudentGroupCard
                      key={group?.id}
                      groupData={group}
                      onViewDetails={handleViewStudentDetails}
                      onMarkAttendance={handleMarkAttendance}
                    />
                  ))}
                </div>
              </div>

              {/* Unavailability Panel */}
              <UnavailabilityPanel
                unavailabilityRequests={unavailabilityRequests}
                onSubmitRequest={handleSubmitUnavailabilityRequest}
              />
            </div>

            {/* Right Column - Quick Actions */}
            <div className="xl:col-span-1">
              <QuickActionsPanel
                onExportSchedule={handleExportSchedule}
                onMarkAttendance={() => handleMarkAttendance('current')}
                onRequestSubstitute={() => handleRequestSubstitute('current')}
              />
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Icon name="User" size={16} />
                  <span>Employee ID: {currentUser?.employeeId}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={16} />
                  <span>{currentUser?.email}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} />
                <span>Academic Year 2024-25</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FacultyDashboard;