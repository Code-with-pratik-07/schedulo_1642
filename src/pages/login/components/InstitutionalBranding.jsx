import React from 'react';
import Icon from '../../../components/AppIcon';

const InstitutionalBranding = () => {
  return (
    <div className="text-center space-y-6">
      {/* Logo and Brand */}
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
          <Icon name="Calendar" size={32} color="white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Schedulo</h1>
          <p className="text-muted-foreground mt-1">Educational Timetable Management System</p>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Welcome Back</h2>
        <p className="text-muted-foreground">
          Sign in to access your personalized dashboard and manage your academic schedule
        </p>
      </div>

      {/* Trust Signals */}
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <div className="flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg">
          <Icon name="Shield" size={16} className="text-success" />
          <span className="text-xs font-medium text-muted-foreground">Secure Login</span>
        </div>
        <div className="flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg">
          <Icon name="Award" size={16} className="text-primary" />
          <span className="text-xs font-medium text-muted-foreground">NEP 2020 Compliant</span>
        </div>
        <div className="flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg">
          <Icon name="Users" size={16} className="text-accent" />
          <span className="text-xs font-medium text-muted-foreground">Multi-Role Access</span>
        </div>
      </div>
    </div>
  );
};

export default InstitutionalBranding;