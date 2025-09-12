import React from 'react';
import Button from '../../../components/ui/Button';

const TimetableViewToggle = ({ currentView, onViewChange }) => {
  const views = [
    { id: 'daily', label: 'Daily', icon: 'Calendar' },
    { id: 'weekly', label: 'Weekly', icon: 'CalendarDays' },
    { id: 'semester', label: 'Semester', icon: 'CalendarRange' }
  ];

  return (
    <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
      {views?.map((view) => (
        <Button
          key={view?.id}
          variant={currentView === view?.id ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange(view?.id)}
          iconName={view?.icon}
          iconPosition="left"
          iconSize={16}
          className={`${currentView === view?.id ? '' : 'text-muted-foreground hover:text-foreground'}`}
        >
          {view?.label}
        </Button>
      ))}
    </div>
  );
};

export default TimetableViewToggle;