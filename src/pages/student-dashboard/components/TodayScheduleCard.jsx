import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TodayScheduleCard = ({ schedule, onClassClick }) => {
  const getCurrentTime = () => {
    const now = new Date();
    return now?.getHours() * 60 + now?.getMinutes();
  };

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr?.split(':')?.map(Number);
    return hours * 60 + minutes;
  };

  const getClassStatus = (startTime, endTime) => {
    const currentTime = getCurrentTime();
    const start = parseTime(startTime);
    const end = parseTime(endTime);

    if (currentTime < start) return 'upcoming';
    if (currentTime >= start && currentTime <= end) return 'ongoing';
    return 'completed';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-50';
      case 'ongoing': return 'text-green-600 bg-green-50';
      case 'completed': return 'text-gray-500 bg-gray-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming': return 'Clock';
      case 'ongoing': return 'Play';
      case 'completed': return 'Check';
      default: return 'Clock';
    }
  };

  const getAttendanceColor = (status) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-100';
      case 'absent': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Today's Schedule</h2>
        <div className="text-sm text-muted-foreground">
          {new Date()?.toLocaleDateString('en-GB', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
      <div className="space-y-3">
        {schedule?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Calendar" size={48} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No classes scheduled for today</p>
          </div>
        ) : (
          schedule?.map((classItem) => {
            const status = getClassStatus(classItem?.startTime, classItem?.endTime);
            return (
              <div
                key={classItem?.id}
                className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow duration-200 cursor-pointer"
                onClick={() => onClassClick(classItem)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-foreground">{classItem?.subject}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        <Icon name={getStatusIcon(status)} size={12} className="mr-1" />
                        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Icon name="Clock" size={14} className="mr-1" />
                        {classItem?.startTime} - {classItem?.endTime}
                      </div>
                      <div className="flex items-center">
                        <Icon name="MapPin" size={14} className="mr-1" />
                        {classItem?.room}
                      </div>
                      <div className="flex items-center">
                        <Icon name="User" size={14} className="mr-1" />
                        {classItem?.faculty}
                      </div>
                      <div className="flex items-center">
                        <Icon name="Users" size={14} className="mr-1" />
                        {classItem?.type}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex flex-col items-end space-y-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAttendanceColor(classItem?.attendance)}`}>
                      {classItem?.attendance === 'present' && <Icon name="Check" size={12} className="mr-1" />}
                      {classItem?.attendance === 'absent' && <Icon name="X" size={12} className="mr-1" />}
                      {classItem?.attendance === 'pending' && <Icon name="Clock" size={12} className="mr-1" />}
                      {classItem?.attendance?.charAt(0)?.toUpperCase() + classItem?.attendance?.slice(1)}
                    </span>
                    <Button variant="ghost" size="sm" iconName="ChevronRight" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TodayScheduleCard;