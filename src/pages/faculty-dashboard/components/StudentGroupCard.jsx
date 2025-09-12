import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const StudentGroupCard = ({ groupData, onViewDetails, onMarkAttendance }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return 'text-success';
    if (percentage >= 75) return 'text-warning';
    return 'text-destructive';
  };

  const getAttendanceIcon = (percentage) => {
    if (percentage >= 85) return 'TrendingUp';
    if (percentage >= 75) return 'Minus';
    return 'TrendingDown';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{groupData?.subject}</h3>
          <p className="text-sm text-muted-foreground">
            {groupData?.className} • Room {groupData?.room} • {groupData?.students?.length} students
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMarkAttendance(groupData?.id)}
            iconName="Users"
            iconPosition="left"
          >
            Mark Attendance
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          />
        </div>
      </div>
      {/* Class Schedule */}
      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">{groupData?.schedule?.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">{groupData?.schedule?.days?.join(', ')}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name={getAttendanceIcon(groupData?.averageAttendance)} size={16} className={getAttendanceColor(groupData?.averageAttendance)} />
            <span className={`text-sm font-medium ${getAttendanceColor(groupData?.averageAttendance)}`}>
              {groupData?.averageAttendance}% Avg. Attendance
            </span>
          </div>
        </div>
      </div>
      {/* Student List Preview */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-foreground">Recent Students</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(groupData?.id)}
            className="text-xs"
          >
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {groupData?.students?.slice(0, 4)?.map((student) => (
            <div key={student?.id} className="flex items-center space-x-3 p-2 bg-muted/30 rounded">
              <Image
                src={student?.avatar}
                alt={student?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{student?.name}</p>
                <p className="text-xs text-muted-foreground">{student?.rollNumber}</p>
              </div>
              <div className="text-right">
                <div className={`text-xs font-medium ${getAttendanceColor(student?.attendance)}`}>
                  {student?.attendance}%
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {groupData?.students?.length > 4 && (
          <div className="mt-2 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-muted-foreground"
            >
              {isExpanded ? 'Show Less' : `+${groupData?.students?.length - 4} more students`}
            </Button>
          </div>
        )}
      </div>
      {/* Expanded Student List */}
      {isExpanded && (
        <div className="border-t border-border pt-4">
          <div className="space-y-2">
            {groupData?.students?.slice(4)?.map((student) => (
              <div key={student?.id} className="flex items-center space-x-3 p-2 bg-muted/30 rounded">
                <Image
                  src={student?.avatar}
                  alt={student?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{student?.name}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{student?.rollNumber}</span>
                    <span>•</span>
                    <span>{student?.email}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-medium ${getAttendanceColor(student?.attendance)}`}>
                    {student?.attendance}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {student?.presentDays}/{student?.totalDays}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Quick Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="BookOpen" size={16} />
          <span>Next class: {groupData?.nextClass}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(groupData?.id)}
            iconName="Eye"
            className="text-xs"
          >
            Details
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Download"
            className="text-xs"
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentGroupCard;