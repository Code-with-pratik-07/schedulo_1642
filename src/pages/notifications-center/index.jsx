import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import NotificationCard from './components/NotificationCard';
import NotificationFilters from './components/NotificationFilters';
import BulkActions from './components/BulkActions';
import NotificationPreferences from './components/NotificationPreferences';
import NotificationStats from './components/NotificationStats';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const NotificationsCenter = () => {
  const [userRole] = useState(() => localStorage.getItem('userRole') || 'student');
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    priority: 'all',
    readStatus: 'all',
    dateRange: {
      from: '',
      to: ''
    }
  });

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      subject: "Schedule Change: Advanced Mathematics Class",
      sender: "Dr. Sarah Johnson",
      category: "schedule",
      priority: "high",
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      isRead: false,
      preview: "Your Advanced Mathematics class scheduled for tomorrow has been moved from Room 301 to Room 205 due to maintenance work.",
      content: `Dear Students,\n\nI hope this message finds you well. I am writing to inform you of an important schedule change for our Advanced Mathematics class.\n\nDue to unexpected maintenance work in Room 301, tomorrow's class (September 13, 2025) has been relocated to Room 205. The timing remains the same - 10:00 AM to 11:30 AM.\n\nPlease make note of this change and ensure you arrive at the correct location. If you have any questions or concerns, please don't hesitate to reach out.\n\nBest regards,\nDr. Sarah Johnson\nMathematics Department`,
      attachments: [
        { name: "updated_schedule.pdf", size: "245 KB" }
      ],
      actions: [
        { label: "View Schedule", type: "primary", onClick: () => console.log("View schedule") },
        { label: "Add to Calendar", type: "secondary", onClick: () => console.log("Add to calendar") }
      ]
    },
    {
      id: 2,
      subject: "New Assignment Posted: Data Structures",
      sender: "Prof. Michael Chen",
      category: "administrative",
      priority: "medium",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      isRead: false,
      preview: "A new assignment on Binary Trees has been posted. Due date: September 20, 2025.",
      content: `Hello Class,\n\nI have posted a new assignment on Binary Trees in our course portal. This assignment covers the concepts we discussed in last week's lectures.\n\nAssignment Details:\n- Topic: Binary Tree Implementation and Traversal\n- Due Date: September 20, 2025, 11:59 PM\n- Submission Format: ZIP file containing source code and documentation\n- Weightage: 15% of final grade\n\nPlease ensure you start working on this early as it requires substantial coding and testing.\n\nGood luck!\nProf. Michael Chen`,
      attachments: [
        { name: "assignment_guidelines.pdf", size: "1.2 MB" },
        { name: "sample_code.zip", size: "856 KB" }
      ],
      actions: [
        { label: "View Assignment", type: "primary", onClick: () => console.log("View assignment") }
      ]
    },
    {
      id: 3,
      subject: "System Maintenance Scheduled",
      sender: "IT Support Team",
      category: "system",
      priority: "low",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      isRead: true,
      preview: "Scheduled maintenance on September 15, 2025 from 2:00 AM to 4:00 AM IST.",
      content: `Dear Users,\n\nWe will be performing scheduled system maintenance to improve performance and security.\n\nMaintenance Window:\n- Date: September 15, 2025\n- Time: 2:00 AM to 4:00 AM IST\n- Expected Duration: 2 hours\n\nDuring this time, the following services will be unavailable:\n- Student Portal\n- Faculty Dashboard\n- Mobile Application\n- Email Notifications\n\nWe apologize for any inconvenience and appreciate your patience.\n\nIT Support Team`,
      attachments: [],
      actions: []
    },
    {
      id: 4,
      subject: "Exam Schedule Released",
      sender: "Academic Office",
      category: "administrative",
      priority: "high",
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      isRead: false,
      preview: "Mid-semester examination schedule has been published. Please check your exam dates and venues.",
      content: `Dear Students,\n\nThe mid-semester examination schedule for the current academic term has been finalized and published.\n\nImportant Information:\n- Examination Period: October 5-12, 2025\n- Admit cards will be available from October 1, 2025\n- Seating arrangements will be published 2 days before each exam\n- Students must carry valid ID cards and admit cards\n\nPlease review your examination schedule carefully and report any discrepancies within 48 hours.\n\nAcademic Office\nRegistrar's Department`,
      attachments: [
        { name: "exam_schedule_fall_2025.pdf", size: "2.1 MB" },
        { name: "exam_guidelines.pdf", size: "678 KB" }
      ],
      actions: [
        { label: "Download Schedule", type: "primary", onClick: () => console.log("Download schedule") },
        { label: "Report Issue", type: "secondary", onClick: () => console.log("Report issue") }
      ]
    },
    {
      id: 5,
      subject: "Personal Message from Advisor",
      sender: "Dr. Emily Rodriguez",
      category: "personal",
      priority: "medium",
      timestamp: new Date(Date.now() - 14400000), // 4 hours ago
      isRead: true,
      preview: "Please schedule a meeting to discuss your course selection for next semester.",
      content: `Hi there,\n\nI hope you're doing well in your current courses. As we approach the course registration period for the next semester, I'd like to schedule a meeting with you to discuss your academic progress and course selection.\n\nWe can discuss:\n- Your current academic performance\n- Course recommendations for next semester\n- Career guidance and internship opportunities\n- Any academic concerns you might have\n\nPlease let me know your availability for next week. I have slots available on Tuesday, Wednesday, and Friday between 2:00 PM and 5:00 PM.\n\nLooking forward to our meeting!\n\nBest regards,\nDr. Emily Rodriguez\nAcademic Advisor`,
      attachments: [],
      actions: [
        { label: "Schedule Meeting", type: "primary", onClick: () => console.log("Schedule meeting") },
        { label: "Reply", type: "secondary", onClick: () => console.log("Reply") }
      ]
    },
    {
      id: 6,
      subject: "Library Book Return Reminder",
      sender: "Library Services",
      category: "personal",
      priority: "low",
      timestamp: new Date(Date.now() - 18000000), // 5 hours ago
      isRead: true,
      preview: "You have 2 books due for return by September 15, 2025.",
      content: `Dear Student,\n\nThis is a friendly reminder that you have books due for return.\n\nBooks Due:\n1. "Advanced Algorithms" by Thomas H. Cormen - Due: September 15, 2025\n2. "Database System Concepts" by Abraham Silberschatz - Due: September 15, 2025\n\nTo avoid late fees, please return these books by the due date. You can also renew them online if you need them for a longer period.\n\nLibrary Hours:\n- Monday to Friday: 8:00 AM to 8:00 PM\n- Saturday: 9:00 AM to 5:00 PM\n- Sunday: Closed\n\nThank you for using our library services!\n\nLibrary Services Team`,
      attachments: [],
      actions: [
        { label: "Renew Books", type: "primary", onClick: () => console.log("Renew books") },
        { label: "View Account", type: "secondary", onClick: () => console.log("View account") }
      ]
    }
  ];

  // Initialize notifications
  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNotifications(mockNotifications);
      setFilteredNotifications(mockNotifications);
      setIsLoading(false);
    };

    loadNotifications();
  }, []);

  // Filter notifications
  useEffect(() => {
    let filtered = notifications;

    // Search filter
    if (searchQuery) {
      filtered = filtered?.filter(notification =>
        notification?.subject?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        notification?.sender?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        notification?.content?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Category filter
    if (filters?.category !== 'all') {
      filtered = filtered?.filter(notification => notification?.category === filters?.category);
    }

    // Priority filter
    if (filters?.priority !== 'all') {
      filtered = filtered?.filter(notification => notification?.priority === filters?.priority);
    }

    // Read status filter
    if (filters?.readStatus !== 'all') {
      filtered = filtered?.filter(notification => 
        filters?.readStatus === 'read' ? notification?.isRead : !notification?.isRead
      );
    }

    // Date range filter
    if (filters?.dateRange?.from || filters?.dateRange?.to) {
      filtered = filtered?.filter(notification => {
        const notificationDate = new Date(notification.timestamp)?.toISOString()?.split('T')?.[0];
        const fromDate = filters?.dateRange?.from;
        const toDate = filters?.dateRange?.to;

        if (fromDate && toDate) {
          return notificationDate >= fromDate && notificationDate <= toDate;
        } else if (fromDate) {
          return notificationDate >= fromDate;
        } else if (toDate) {
          return notificationDate <= toDate;
        }
        return true;
      });
    }

    setFilteredNotifications(filtered);
  }, [notifications, searchQuery, filters]);

  // Calculate stats
  const stats = {
    total: notifications?.length,
    unread: notifications?.filter(n => !n?.isRead)?.length,
    highPriority: notifications?.filter(n => n?.priority === 'high')?.length,
    thisWeek: notifications?.filter(n => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(n.timestamp) > weekAgo;
    })?.length
  };

  const handleNotificationSelect = (id, isSelected) => {
    if (isSelected) {
      setSelectedNotifications(prev => [...prev, id]);
    } else {
      setSelectedNotifications(prev => prev?.filter(notificationId => notificationId !== id));
    }
  };

  const handleSelectAll = () => {
    setSelectedNotifications(filteredNotifications?.map(n => n?.id));
  };

  const handleDeselectAll = () => {
    setSelectedNotifications([]);
  };

  const handleMarkAsRead = (notificationIds) => {
    const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];
    setNotifications(prev =>
      prev?.map(notification =>
        ids?.includes(notification?.id)
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setSelectedNotifications([]);
  };

  const handleArchive = (notificationIds) => {
    const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];
    setNotifications(prev =>
      prev?.filter(notification => !ids?.includes(notification?.id))
    );
    setSelectedNotifications([]);
  };

  const handleDelete = (notificationIds) => {
    const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];
    setNotifications(prev =>
      prev?.filter(notification => !ids?.includes(notification?.id))
    );
    setSelectedNotifications([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} userName="John Doe" notificationCount={stats?.unread} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation userRole={userRole} />
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Notifications Center</h1>
              <p className="text-muted-foreground">
                Stay updated with all institutional communications and schedule changes
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Button
                variant="outline"
                onClick={() => setShowPreferences(true)}
                iconName="Settings"
                iconPosition="left"
              >
                Preferences
              </Button>
              
              <Button
                variant="default"
                onClick={() => window.location?.reload()}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Stats */}
          <NotificationStats stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <NotificationFilters
                filters={filters}
                onFiltersChange={setFilters}
                onSearch={setSearchQuery}
                searchQuery={searchQuery}
                isMobile={false}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Mobile Filters */}
              <div className="lg:hidden mb-4">
                <NotificationFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  onSearch={setSearchQuery}
                  searchQuery={searchQuery}
                  isMobile={true}
                />
              </div>

              {/* Bulk Actions */}
              <BulkActions
                selectedNotifications={selectedNotifications}
                totalNotifications={filteredNotifications?.length}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                onMarkAsRead={handleMarkAsRead}
                onArchive={handleArchive}
                onDelete={handleDelete}
              />

              {/* Notifications List */}
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)]?.map((_, index) => (
                    <div key={index} className="bg-card border border-border rounded-lg p-4 animate-pulse">
                      <div className="flex items-start space-x-3">
                        <div className="w-4 h-4 bg-muted rounded"></div>
                        <div className="w-8 h-8 bg-muted rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                          <div className="h-3 bg-muted rounded w-full"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredNotifications?.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Icon name="Bell" size={24} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">No notifications found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || Object.values(filters)?.some(f => f !== 'all' && f !== '')
                      ? "Try adjusting your filters or search query" :"You're all caught up! No new notifications at the moment."
                    }
                  </p>
                  {(searchQuery || Object.values(filters)?.some(f => f !== 'all' && f !== '')) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        setFilters({
                          category: 'all',
                          priority: 'all',
                          readStatus: 'all',
                          dateRange: { from: '', to: '' }
                        });
                      }}
                      iconName="X"
                      iconPosition="left"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications?.map((notification) => (
                    <NotificationCard
                      key={notification?.id}
                      notification={notification}
                      isSelected={selectedNotifications?.includes(notification?.id)}
                      onSelect={handleNotificationSelect}
                      onMarkAsRead={handleMarkAsRead}
                      onArchive={handleArchive}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Notification Preferences Modal */}
      <NotificationPreferences
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
      />
    </div>
  );
};

export default NotificationsCenter;