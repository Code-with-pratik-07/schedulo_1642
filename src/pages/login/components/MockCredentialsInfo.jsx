import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const MockCredentialsInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const credentials = [
    {
      role: 'Administrator',
      email: 'admin@schedulo.edu',
      password: 'Admin@123',
      description: 'Full system access with timetable generation and user management'
    },
    {
      role: 'Faculty Member',
      email: 'faculty@schedulo.edu',
      password: 'Faculty@123',
      description: 'Teaching schedule management and student interaction'
    },
    {
      role: 'Student',
      email: 'student@schedulo.edu',
      password: 'Student@123',
      description: 'Personal timetable viewing and notifications'
    }
  ];

  return (
    <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
        iconPosition="right"
        className="w-full justify-between p-0 h-auto font-medium text-muted-foreground hover:text-foreground"
      >
        Demo Credentials
      </Button>
      {isExpanded && (
        <div className="mt-4 space-y-4 animate-slide-down">
          <p className="text-sm text-muted-foreground">
            Use these credentials to explore different user roles:
          </p>
          
          {credentials?.map((cred, index) => (
            <div key={index} className="p-3 bg-card rounded-lg border border-border">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-foreground">{cred?.role}</h4>
                <Icon name="User" size={16} className="text-muted-foreground" />
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={14} className="text-muted-foreground" />
                  <code className="text-primary font-mono">{cred?.email}</code>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Key" size={14} className="text-muted-foreground" />
                  <code className="text-primary font-mono">{cred?.password}</code>
                </div>
                <p className="text-muted-foreground mt-2">{cred?.description}</p>
              </div>
            </div>
          ))}
          
          <div className="flex items-start space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <Icon name="Info" size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-700">
              This is a demo application. In production, users would have their own institutional credentials.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockCredentialsInfo;