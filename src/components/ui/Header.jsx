import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ userRole = 'student', userName = 'John Doe', notificationCount = 3 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: userRole === 'admin' ? '/admin-dashboard' : userRole === 'faculty' ? '/faculty-dashboard' : '/student-dashboard',
      icon: 'LayoutDashboard',
      roles: ['admin', 'faculty', 'student']
    },
    {
      label: 'Notifications',
      path: '/notifications-center',
      icon: 'Bell',
      roles: ['admin', 'faculty', 'student']
    },
    {
      label: 'Generate Schedule',
      path: '/timetable-generator',
      icon: 'Calendar',
      roles: ['admin']
    }
  ];

  const visibleItems = navigationItems?.filter(item => item?.roles?.includes(userRole));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef?.current && !profileRef?.current?.contains(event?.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
    setIsProfileOpen(false);
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'faculty': return 'Faculty';
      case 'student': return 'Student';
      default: return 'User';
    }
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-foreground">Schedulo</h1>
              <p className="text-xs text-muted-foreground">Educational Timetable System</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {visibleItems?.map((item) => (
            <Button
              key={item?.path}
              variant={isActivePath(item?.path) ? "default" : "ghost"}
              onClick={() => handleNavigation(item?.path)}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={18}
              className="relative"
            >
              {item?.label}
              {item?.path === '/notifications-center' && notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Button>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Mobile Notification Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/notifications-center')}
              iconName="Bell"
              className="relative"
            >
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Button>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <Button
              variant="ghost"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 px-3"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">{getRoleDisplayName(userRole)}</p>
              </div>
              <Icon name="ChevronDown" size={16} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg animate-slide-down">
                <div className="p-3 border-b border-border">
                  <p className="font-medium text-popover-foreground">{userName}</p>
                  <p className="text-sm text-muted-foreground">{getRoleDisplayName(userRole)}</p>
                </div>
                <div className="p-1">
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    iconName="LogOut"
                    iconPosition="left"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              iconName={isMobileMenuOpen ? "X" : "Menu"}
            />
          </div>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border animate-slide-down">
          <nav className="p-4 space-y-2">
            {visibleItems?.map((item) => (
              <Button
                key={item?.path}
                variant={isActivePath(item?.path) ? "default" : "ghost"}
                onClick={() => handleNavigation(item?.path)}
                iconName={item?.icon}
                iconPosition="left"
                className="w-full justify-start relative"
              >
                {item?.label}
                {item?.path === '/notifications-center' && notificationCount > 0 && (
                  <span className="ml-auto bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </Button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;