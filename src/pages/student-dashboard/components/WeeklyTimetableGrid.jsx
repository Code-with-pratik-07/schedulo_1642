import React from 'react';
import Icon from '../../../components/AppIcon';

const WeeklyTimetableGrid = ({ weeklySchedule }) => {
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getClassForSlot = (day, time) => {
    return weeklySchedule?.[day]?.find(classItem => 
      classItem?.startTime <= time && classItem?.endTime > time
    );
  };

  const getClassDuration = (classItem) => {
    const start = parseInt(classItem?.startTime?.split(':')?.[0]);
    const end = parseInt(classItem?.endTime?.split(':')?.[0]);
    return end - start;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Weekly Timetable</h2>
        <div className="text-sm text-muted-foreground">
          Week of {new Date()?.toLocaleDateString('en-GB', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header */}
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="p-2 text-sm font-medium text-muted-foreground">Time</div>
            {days?.map((day) => (
              <div key={day} className="p-2 text-sm font-medium text-center text-foreground border-b border-border">
                {day}
              </div>
            ))}
          </div>

          {/* Time slots */}
          {timeSlots?.map((time) => (
            <div key={time} className="grid grid-cols-8 gap-2 mb-1">
              <div className="p-2 text-sm text-muted-foreground font-medium">
                {time}
              </div>
              {days?.map((day) => {
                const classItem = getClassForSlot(day, time);
                return (
                  <div
                    key={`${day}-${time}`}
                    className="min-h-[60px] border border-border rounded"
                  >
                    {classItem && (
                      <div
                        className="bg-primary/10 border-l-4 border-primary rounded p-2 h-full"
                        style={{
                          gridRow: `span ${getClassDuration(classItem)}`
                        }}
                      >
                        <div className="text-xs font-medium text-foreground mb-1">
                          {classItem?.subject}
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex items-center">
                            <Icon name="MapPin" size={10} className="mr-1" />
                            {classItem?.room}
                          </div>
                          <div className="flex items-center">
                            <Icon name="User" size={10} className="mr-1" />
                            {classItem?.faculty}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyTimetableGrid;