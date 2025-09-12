import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import TodayScheduleCard from './components/TodayScheduleCard';
import QuickStatsCards from './components/QuickStatsCards';
import TimetableViewToggle from './components/TimetableViewToggle';
import WeeklyTimetableGrid from './components/WeeklyTimetableGrid';
import SemesterOverview from './components/SemesterOverview';
import NotificationsFeed from './components/NotificationsFeed';
import ExportActions from './components/ExportActions';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('daily');
  const [notifications, setNotifications] = useState([]);

  // Mock data for today's schedule
  const todaySchedule = [
    {
      id: 1,
      subject: "Data Structures and Algorithms",
      startTime: "09:00",
      endTime: "10:30",
      room: "CS-101",
      faculty: "Dr. Sarah Johnson",
      type: "Lecture",
      attendance: "present"
    },
    {
      id: 2,
      subject: "Database Management Systems",
      startTime: "11:00",
      endTime: "12:30",
      room: "CS-102",
      faculty: "Prof. Michael Chen",
      type: "Lab",
      attendance: "pending"
    },
    {
      id: 3,
      subject: "Software Engineering",
      startTime: "14:00",
      endTime: "15:30",
      room: "CS-103",
      faculty: "Dr. Emily Rodriguez",
      type: "Lecture",
      attendance: "pending"
    },
    {
      id: 4,
      subject: "Computer Networks",
      startTime: "16:00",
      endTime: "17:30",
      room: "CS-104",
      faculty: "Prof. David Kumar",
      type: "Tutorial",
      attendance: "pending"
    }
  ];

  // Mock data for weekly schedule
  const weeklySchedule = {
    Monday: [
      {
        id: 1,
        subject: "Data Structures",
        startTime: "09:00",
        endTime: "10:30",
        room: "CS-101",
        faculty: "Dr. Sarah Johnson"
      },
      {
        id: 2,
        subject: "Database Systems",
        startTime: "11:00",
        endTime: "12:30",
        room: "CS-102",
        faculty: "Prof. Michael Chen"
      }
    ],
    Tuesday: [
      {
        id: 3,
        subject: "Software Engineering",
        startTime: "10:00",
        endTime: "11:30",
        room: "CS-103",
        faculty: "Dr. Emily Rodriguez"
      },
      {
        id: 4,
        subject: "Computer Networks",
        startTime: "14:00",
        endTime: "15:30",
        room: "CS-104",
        faculty: "Prof. David Kumar"
      }
    ],
    Wednesday: [
      {
        id: 5,
        subject: "Operating Systems",
        startTime: "09:00",
        endTime: "10:30",
        room: "CS-105",
        faculty: "Dr. Lisa Wang"
      }
    ],
    Thursday: [
      {
        id: 6,
        subject: "Machine Learning",
        startTime: "11:00",
        endTime: "12:30",
        room: "CS-106",
        faculty: "Prof. James Smith"
      }
    ],
    Friday: [
      {
        id: 7,
        subject: "Web Development",
        startTime: "13:00",
        endTime: "14:30",
        room: "CS-107",
        faculty: "Dr. Anna Brown"
      }
    ],
    Saturday: []
  };

  // Mock data for semester overview
  const semesterData = {
    name: "Fall Semester 2024",
    year: "2024-25",
    courses: [
      {
        id: 1,
        name: "Data Structures and Algorithms",
        code: "CS301",
        credits: 4,
        faculty: "Dr. Sarah Johnson",
        hoursPerWeek: 6
      },
      {
        id: 2,
        name: "Database Management Systems",
        code: "CS302",
        credits: 3,
        faculty: "Prof. Michael Chen",
        hoursPerWeek: 4
      },
      {
        id: 3,
        name: "Software Engineering",
        code: "CS303",
        credits: 3,
        faculty: "Dr. Emily Rodriguez",
        hoursPerWeek: 4
      },
      {
        id: 4,
        name: "Computer Networks",
        code: "CS304",
        credits: 3,
        faculty: "Prof. David Kumar",
        hoursPerWeek: 4
      }
    ],
    importantDates: [
      {
        event: "Mid-term Examinations",
        description: "All subjects",
        date: "2024-10-15"
      },
      {
        event: "Project Submission",
        description: "Software Engineering",
        date: "2024-11-01"
      },
      {
        event: "Final Examinations",
        description: "All subjects",
        date: "2024-12-10"
      }
    ],
    progress: {
      completedWeeks: 8,
      totalWeeks: 16,
      startDate: "2024-08-01",
      endDate: "2024-12-15"
    }
  };

  // Mock quick stats
  const quickStats = {
    remainingClasses: 3,
    upcomingAssignments: 2,
    attendancePercentage: 87
  };

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      type: "class_update",
      title: "Class Rescheduled",
      message: "Database Systems class moved from CS-102 to CS-201 tomorrow at 11:00 AM",
      timestamp: new Date(Date.now() - 300000),
      read: false,
      actionRequired: true,
      actionText: "View Details"
    },
    {
      id: 2,
      type: "assignment",
      title: "Assignment Due Reminder",
      message: "Software Engineering project submission due in 3 days",
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      actionRequired: true,
      actionText: "Submit Assignment"
    },
    {
      id: 3,
      type: "announcement",
      title: "Holiday Notice",
      message: "College will remain closed on 15th September due to public holiday",
      timestamp: new Date(Date.now() - 7200000),
      read: true,
      actionRequired: false
    },
    {
      id: 4,
      type: "exam",
      title: "Mid-term Schedule Released",
      message: "Mid-term examination schedule has been published. Check your timetable for details.",
      timestamp: new Date(Date.now() - 86400000),
      read: true,
      actionRequired: true,
      actionText: "View Schedule"
    },
    {
      id: 5,
      type: "room_change",
      title: "Room Change Alert",
      message: "Computer Networks lab shifted to CS-Lab-2 for this week",
      timestamp: new Date(Date.now() - 172800000),
      read: false,
      actionRequired: false
    }
  ];

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'student') {
      navigate('/login');
      return;
    }

    // Initialize notifications
    setNotifications(mockNotifications);

    // Simulate real-time notifications
    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        type: "class_update",
        title: "Live Update",
        message: "Your next class starts in 15 minutes",
        timestamp: new Date(),
        read: false,
        actionRequired: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
    }, 300000); // Every 5 minutes

    return () => clearInterval(interval);
  }, [navigate]);

  const handleClassClick = (classItem) => {
    console.log('Class clicked:', classItem);
    // Navigate to class details or show modal
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev =>
      prev?.map(notification =>
        notification?.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev?.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleExportPDF = async () => {
    // Simulate PDF export
    console.log('Exporting PDF...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create and download mock PDF
    const link = document.createElement('a');
    link.href = 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVGl0bGUgKFdlZWtseSBTY2hlZHVsZSk=';
    link.download = 'weekly-schedule.pdf';
    link?.click();
  };

  const handleExportICal = async () => {
    // Simulate iCal export
    console.log('Exporting iCal...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create and download mock iCal file
    const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Schedulo//Student Timetable//EN
BEGIN:VEVENT
DTSTART:20240912T090000Z
DTEND:20240912T103000Z
SUMMARY:Data Structures and Algorithms
LOCATION:CS-101
DESCRIPTION:Lecture with Dr. Sarah Johnson
END:VEVENT
END:VCALENDAR`;
    
    const blob = new Blob([icalContent], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'student-timetable.ics';
    link?.click();
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'daily':
        return (
          <TodayScheduleCard 
            schedule={todaySchedule} 
            onClassClick={handleClassClick}
          />
        );
      case 'weekly':
        return <WeeklyTimetableGrid weeklySchedule={weeklySchedule} />;
      case 'semester':
        return <SemesterOverview semesterData={semesterData} />;
      default:
        return (
          <TodayScheduleCard 
            schedule={todaySchedule} 
            onClassClick={handleClassClick}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="student" userName="Rahul Sharma" notificationCount={notifications?.filter(n => !n?.read)?.length} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation userRole="student" />
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, Rahul! Here's your academic overview for today.
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <ExportActions 
                onExportPDF={handleExportPDF}
                onExportICal={handleExportICal}
              />
            </div>
          </div>

          {/* Quick Stats */}
          <QuickStatsCards stats={quickStats} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Timetable Section */}
            <div className="xl:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Academic Schedule</h2>
                <TimetableViewToggle 
                  currentView={currentView}
                  onViewChange={setCurrentView}
                />
              </div>
              
              {renderCurrentView()}
            </div>

            {/* Notifications Panel */}
            <div className="xl:col-span-1">
              <NotificationsFeed
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;