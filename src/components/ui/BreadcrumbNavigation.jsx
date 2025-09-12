import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const BreadcrumbNavigation = ({ userRole = 'student' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeMap = {
    '/login': { label: 'Login', parent: null },
    '/student-dashboard': { label: 'Student Dashboard', parent: null },
    '/faculty-dashboard': { label: 'Faculty Dashboard', parent: null },
    '/admin-dashboard': { label: 'Admin Dashboard', parent: null },
    '/timetable-generator': { label: 'Generate Schedule', parent: '/admin-dashboard' },
    '/notifications-center': { 
      label: 'Notifications', 
      parent: userRole === 'admin' ? '/admin-dashboard' : userRole === 'faculty' ? '/faculty-dashboard' : '/student-dashboard'
    }
  };

  const currentRoute = routeMap?.[location?.pathname];
  
  if (!currentRoute || !currentRoute?.parent) {
    return null;
  }

  const buildBreadcrumbs = () => {
    const breadcrumbs = [];
    let current = currentRoute;
    
    while (current) {
      breadcrumbs?.unshift({
        label: current?.label,
        path: location?.pathname === getPathForRoute(current) ? null : getPathForRoute(current)
      });
      
      if (current?.parent) {
        current = routeMap?.[current?.parent];
      } else {
        break;
      }
    }
    
    return breadcrumbs;
  };

  const getPathForRoute = (route) => {
    return Object.keys(routeMap)?.find(path => routeMap?.[path] === route);
  };

  const breadcrumbs = buildBreadcrumbs();

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((crumb, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <Icon name="ChevronRight" size={16} className="mx-2 text-muted-foreground" />
            )}
            {crumb?.path ? (
              <Button
                variant="ghost"
                onClick={() => handleNavigation(crumb?.path)}
                className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {crumb?.label}
              </Button>
            ) : (
              <span className="text-foreground font-medium" aria-current="page">
                {crumb?.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbNavigation;