import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const WeeklyScheduleGrid = ({ scheduleData, onMarkAttendance, onRequestSubstitute }) => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00', 
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00'
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek?.getDay();
    const diff = startOfWeek?.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek?.setDate(diff);

    for (let i = 0; i < 6; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate?.setDate(startOfWeek?.getDate() + i);
      week?.push(currentDate);
    }
    return week;
  };

  const weekDates = getWeekDates(selectedWeek);

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedWeek);
    newDate?.setDate(selectedWeek?.getDate() + (direction * 7));
    setSelectedWeek(newDate);
  };

  const getClassForSlot = (dayIndex, timeSlot) => {
    return scheduleData?.find(
      item => item?.dayIndex === dayIndex && item?.timeSlot === timeSlot
    );
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': 'bg-blue-100 border-blue-300 text-blue-800',
      'Physics': 'bg-green-100 border-green-300 text-green-800',
      'Chemistry': 'bg-purple-100 border-purple-300 text-purple-800',
      'Computer Science': 'bg-orange-100 border-orange-300 text-orange-800',
      'English': 'bg-pink-100 border-pink-300 text-pink-800',
      'Biology': 'bg-emerald-100 border-emerald-300 text-emerald-800'
    };
    return colors?.[subject] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Weekly Schedule</h2>
          <p className="text-sm text-muted-foreground">
            Week of {weekDates?.[0]?.toLocaleDateString('en-GB')} - {weekDates?.[5]?.toLocaleDateString('en-GB')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => navigateWeek(-1)}
            iconName="ChevronLeft"
            className="px-3"
          />
          <Button
            variant="outline"
            onClick={() => setSelectedWeek(new Date())}
            className="px-4"
          >
            Today
          </Button>
          <Button
            variant="outline"
            onClick={() => navigateWeek(1)}
            iconName="ChevronRight"
            className="px-3"
          />
        </div>
      </div>
      {/* Desktop Grid View */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-7 gap-1 mb-2">
            <div className="p-3 text-sm font-medium text-muted-foreground">Time</div>
            {weekDays?.map((day, index) => (
              <div key={day} className="p-3 text-center">
                <div className="text-sm font-medium text-foreground">{day}</div>
                <div className="text-xs text-muted-foreground">
                  {weekDates?.[index]?.getDate()}/{weekDates?.[index]?.getMonth() + 1}
                </div>
              </div>
            ))}
          </div>

          {timeSlots?.map((timeSlot, slotIndex) => (
            <div key={timeSlot} className="grid grid-cols-7 gap-1 mb-1">
              <div className="p-3 text-sm font-medium text-muted-foreground bg-muted rounded">
                {timeSlot}
              </div>
              {weekDays?.map((day, dayIndex) => {
                const classData = getClassForSlot(dayIndex, timeSlot);
                return (
                  <div key={`${day}-${slotIndex}`} className="min-h-[80px]">
                    {classData ? (
                      <div className={`p-2 rounded border-2 h-full ${getSubjectColor(classData?.subject)}`}>
                        <div className="text-xs font-medium mb-1">{classData?.subject}</div>
                        <div className="text-xs mb-1">Room: {classData?.room}</div>
                        <div className="text-xs mb-2">{classData?.studentCount} students</div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => onMarkAttendance(classData?.id)}
                            iconName="Users"
                            className="text-xs px-1 py-0.5 h-auto"
                          />
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => onRequestSubstitute(classData?.id)}
                            iconName="UserX"
                            className="text-xs px-1 py-0.5 h-auto"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="h-full bg-muted/30 rounded border border-dashed border-border"></div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Mobile Daily View */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            onClick={() => navigateWeek(-1)}
            iconName="ChevronLeft"
            size="sm"
          />
          <div className="text-center">
            <div className="font-medium text-foreground">
              {weekDates?.[0]?.toLocaleDateString('en-GB', { weekday: 'long' })}
            </div>
            <div className="text-sm text-muted-foreground">
              {weekDates?.[0]?.toLocaleDateString('en-GB')}
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => navigateWeek(1)}
            iconName="ChevronRight"
            size="sm"
          />
        </div>

        <div className="space-y-2">
          {timeSlots?.map((timeSlot) => {
            const classData = getClassForSlot(0, timeSlot);
            return (
              <div key={timeSlot} className="flex items-center space-x-3">
                <div className="w-20 text-xs text-muted-foreground">
                  {timeSlot?.split(' - ')?.[0]}
                </div>
                {classData ? (
                  <div className={`flex-1 p-3 rounded border ${getSubjectColor(classData?.subject)}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{classData?.subject}</div>
                        <div className="text-xs">Room: {classData?.room} • {classData?.studentCount} students</div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => onMarkAttendance(classData?.id)}
                          iconName="Users"
                        />
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => onRequestSubstitute(classData?.id)}
                          iconName="UserX"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 h-12 bg-muted/30 rounded border border-dashed border-border"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeeklyScheduleGrid;