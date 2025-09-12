import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const GenerationControlPanel = ({ 
  onGenerate, 
  isGenerating, 
  selectedSemester, 
  onSemesterChange,
  constraints,
  onConstraintChange 
}) => {
  const semesterOptions = [
    { value: '2024-odd', label: 'Odd Semester 2024-25' },
    { value: '2024-even', label: 'Even Semester 2024-25' },
    { value: '2025-odd', label: 'Odd Semester 2025-26' }
  ];

  const constraintOptions = [
    {
      id: 'faculty_availability',
      label: 'Faculty Availability',
      description: 'Respect faculty unavailable time slots',
      enabled: constraints?.faculty_availability
    },
    {
      id: 'room_capacity',
      label: 'Room Capacity Limits',
      description: 'Ensure room capacity matches class size',
      enabled: constraints?.room_capacity
    },
    {
      id: 'nep_compliance',
      label: 'NEP 2020 Compliance',
      description: 'Follow NEP 2020 credit hour guidelines',
      enabled: constraints?.nep_compliance
    },
    {
      id: 'lunch_break',
      label: 'Lunch Break Protection',
      description: 'Maintain 1-hour lunch break (12:00-13:00)',
      enabled: constraints?.lunch_break
    },
    {
      id: 'lab_scheduling',
      label: 'Lab Session Grouping',
      description: 'Schedule lab sessions in consecutive slots',
      enabled: constraints?.lab_scheduling
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Icon name="Settings" size={20} color="white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Generation Control Panel</h2>
          <p className="text-sm text-muted-foreground">Configure and generate automated timetables</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Semester Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Semester Configuration</h3>
          <Select
            label="Select Semester"
            description="Choose the academic semester for timetable generation"
            options={semesterOptions}
            value={selectedSemester}
            onChange={onSemesterChange}
            placeholder="Select semester..."
          />
        </div>

        {/* Constraint Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Scheduling Constraints</h3>
          <div className="space-y-3">
            {constraintOptions?.map((constraint) => (
              <Checkbox
                key={constraint?.id}
                label={constraint?.label}
                description={constraint?.description}
                checked={constraint?.enabled}
                onChange={(e) => onConstraintChange(constraint?.id, e?.target?.checked)}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Generation Controls */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Button
              variant="default"
              size="lg"
              onClick={onGenerate}
              loading={isGenerating}
              disabled={!selectedSemester || isGenerating}
              iconName="Zap"
              iconPosition="left"
            >
              {isGenerating ? 'Generating Schedule...' : 'Generate Timetable'}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              disabled={isGenerating}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Reset Configuration
            </Button>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={16} />
            <span>Estimated time: 2-5 minutes</span>
          </div>
        </div>

        {isGenerating && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin">
                <Icon name="Loader2" size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">AI-Powered Generation in Progress</p>
                <p className="text-xs text-muted-foreground">Processing constraints and optimizing schedule...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerationControlPanel;