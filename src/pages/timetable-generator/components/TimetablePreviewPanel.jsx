import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const TimetablePreviewPanel = ({ 
  timetableData, 
  onSlotUpdate, 
  onExport, 
  selectedView,
  onViewChange 
}) => {
  const [draggedSlot, setDraggedSlot] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const viewOptions = [
    { value: 'weekly', label: 'Weekly View' },
    { value: 'faculty', label: 'Faculty View' },
    { value: 'room', label: 'Room View' },
    { value: 'course', label: 'Course View' }
  ];

  const timeSlots = [
    '09:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '12:00-13:00',
    '13:00-14:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00'
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleDragStart = (e, slot) => {
    setDraggedSlot(slot);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetDay, targetTime) => {
    e?.preventDefault();
    if (draggedSlot) {
      onSlotUpdate(draggedSlot, targetDay, targetTime);
      setDraggedSlot(null);
    }
  };

  const getSlotData = (day, time) => {
    return timetableData?.find(slot => 
      slot?.day === day && slot?.time === time
    );
  };

  const getSlotColor = (slot) => {
    if (!slot) return 'bg-muted/30';
    
    switch (slot?.type) {
      case 'lecture': return 'bg-primary/10 border-primary/20';
      case 'lab': return 'bg-accent/10 border-accent/20';
      case 'tutorial': return 'bg-success/10 border-success/20';
      case 'break': return 'bg-muted border-muted';
      default: return 'bg-muted/30';
    }
  };

  const renderSlotContent = (slot) => {
    if (!slot) return null;

    if (slot?.type === 'break') {
      return (
        <div className="text-center text-xs text-muted-foreground">
          <Icon name="Coffee" size={16} className="mx-auto mb-1" />
          <span>Lunch Break</span>
        </div>
      );
    }

    return (
      <div className="text-xs space-y-1">
        <div className="font-medium text-foreground truncate">{slot?.course}</div>
        <div className="text-muted-foreground truncate">{slot?.faculty}</div>
        <div className="text-muted-foreground truncate">{slot?.room}</div>
        {slot?.hasConflict && (
          <div className="flex items-center space-x-1 text-destructive">
            <Icon name="AlertTriangle" size={12} />
            <span className="text-xs">Conflict</span>
          </div>
        )}
      </div>
    );
  };

  if (!timetableData || timetableData?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Calendar" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Timetable Generated</h3>
          <p className="text-muted-foreground">Generate a timetable to see the preview here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Timetable Preview</h2>
              <p className="text-sm text-muted-foreground">Drag and drop to modify schedule</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Select
              options={viewOptions}
              value={selectedView}
              onChange={onViewChange}
              className="w-40"
            />
            <Button
              variant="outline"
              onClick={() => onExport('pdf')}
              iconName="Download"
              iconPosition="left"
            >
              Export PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => onExport('ical')}
              iconName="Calendar"
              iconPosition="left"
            >
              Export iCal
            </Button>
          </div>
        </div>
      </div>
      {/* Timetable Grid */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header Row */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              <div className="p-3 text-sm font-medium text-muted-foreground">Time</div>
              {weekDays?.map((day) => (
                <div key={day} className="p-3 text-sm font-medium text-center text-foreground bg-muted rounded-lg">
                  {day}
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div className="space-y-2">
              {timeSlots?.map((time) => (
                <div key={time} className="grid grid-cols-7 gap-2">
                  <div className="p-3 text-sm font-medium text-muted-foreground bg-muted/50 rounded-lg flex items-center">
                    {time}
                  </div>
                  {weekDays?.map((day) => {
                    const slot = getSlotData(day, time);
                    return (
                      <div
                        key={`${day}-${time}`}
                        className={`min-h-[80px] p-2 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200 hover:shadow-sm ${getSlotColor(slot)}`}
                        draggable={!!slot && slot?.type !== 'break'}
                        onDragStart={(e) => slot && handleDragStart(e, slot)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, day, time)}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {renderSlotContent(slot)}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="text-sm font-medium text-foreground mb-3">Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary/10 border-2 border-primary/20 rounded"></div>
              <span className="text-sm text-muted-foreground">Lecture</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-accent/10 border-2 border-accent/20 rounded"></div>
              <span className="text-sm text-muted-foreground">Lab</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-success/10 border-2 border-success/20 rounded"></div>
              <span className="text-sm text-muted-foreground">Tutorial</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-muted border-2 border-muted rounded"></div>
              <span className="text-sm text-muted-foreground">Break</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetablePreviewPanel;