import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import GenerationControlPanel from './components/GenerationControlPanel';
import ConflictResolutionInterface from './components/ConflictResolutionInterface';
import TimetablePreviewPanel from './components/TimetablePreviewPanel';
import GenerationProgressIndicator from './components/GenerationProgressIndicator';
import ExportControls from './components/ExportControls';
import Icon from '../../components/AppIcon';

const TimetableGenerator = () => {
  const navigate = useNavigate();
  const [userRole] = useState('admin');
  const [userName] = useState('Dr. Sarah Johnson');
  
  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStage, setCurrentStage] = useState('initializing');
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('3-5 minutes');
  
  // Configuration State
  const [selectedSemester, setSelectedSemester] = useState('2024-odd');
  const [constraints, setConstraints] = useState({
    faculty_availability: true,
    room_capacity: true,
    nep_compliance: true,
    lunch_break: true,
    lab_scheduling: true
  });
  
  // Timetable State
  const [timetableGenerated, setTimetableGenerated] = useState(false);
  const [selectedView, setSelectedView] = useState('weekly');
  const [isExporting, setIsExporting] = useState(false);

  // Mock Data
  const generationStages = [
    {
      id: 'initializing',
      label: 'Initializing System',
      description: 'Loading configuration and constraints'
    },
    {
      id: 'processing',
      label: 'Processing Data',
      description: 'Analyzing faculty, courses, and room availability'
    },
    {
      id: 'optimizing',
      label: 'AI Optimization',
      description: 'Applying machine learning algorithms'
    },
    {
      id: 'validating',
      label: 'Validating Schedule',
      description: 'Checking constraints and conflicts'
    },
    {
      id: 'finalizing',
      label: 'Finalizing Timetable',
      description: 'Generating final schedule'
    }
  ];

  const mockConflicts = [
    {
      id: 1,
      type: 'faculty',
      severity: 'high',
      title: 'Faculty Double Booking',
      description: 'Dr. Smith is scheduled for two classes at the same time on Monday 10:00-11:00',
      entities: ['Dr. Smith', 'CS101 - Room A101', 'CS201 - Room B205'],
      suggestions: [
        'Move CS201 to Tuesday 10:00-11:00',
        'Assign substitute faculty for CS201',
        'Reschedule CS101 to different time slot'
      ]
    },
    {
      id: 2,
      type: 'room',
      severity: 'medium',
      title: 'Room Capacity Exceeded',
      description: 'Room A101 (capacity: 40) assigned to class with 45 students',
      entities: ['Room A101', 'CS101 - Section A', '45 students'],
      suggestions: [
        'Move to Room A201 (capacity: 60)',
        'Split class into two sections',
        'Use hybrid teaching model'
      ]
    },
    {
      id: 3,
      type: 'credit',
      severity: 'low',
      title: 'Credit Hour Imbalance',
      description: 'Tuesday has only 4 credit hours scheduled, below minimum requirement',
      entities: ['Tuesday Schedule', 'CS Department', '4 credit hours'],
      suggestions: [
        'Move one lecture from Wednesday to Tuesday',
        'Schedule additional tutorial session',
        'Add lab session on Tuesday'
      ]
    }
  ];

  const mockTimetableData = [
    {
      day: 'Monday',
      time: '09:00-10:00',
      course: 'CS101 - Data Structures',
      faculty: 'Dr. Smith',
      room: 'A101',
      type: 'lecture',
      hasConflict: false
    },
    {
      day: 'Monday',
      time: '10:00-11:00',
      course: 'CS201 - Algorithms',
      faculty: 'Dr. Johnson',
      room: 'B205',
      type: 'lecture',
      hasConflict: true
    },
    {
      day: 'Monday',
      time: '11:00-12:00',
      course: 'CS301 - Database Lab',
      faculty: 'Prof. Wilson',
      room: 'Lab-1',
      type: 'lab',
      hasConflict: false
    },
    {
      day: 'Monday',
      time: '12:00-13:00',
      type: 'break'
    },
    {
      day: 'Tuesday',
      time: '09:00-10:00',
      course: 'CS102 - Programming',
      faculty: 'Dr. Brown',
      room: 'A102',
      type: 'lecture',
      hasConflict: false
    },
    {
      day: 'Tuesday',
      time: '10:00-11:00',
      course: 'CS202 - Software Engineering',
      faculty: 'Dr. Davis',
      room: 'B206',
      type: 'tutorial',
      hasConflict: false
    }
  ];

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    
    if (!token || role !== 'admin') {
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Simulate generation process
  const simulateGeneration = async () => {
    const stages = ['initializing', 'processing', 'optimizing', 'validating', 'finalizing'];
    
    for (let i = 0; i < stages?.length; i++) {
      setCurrentStage(stages?.[i]);
      
      // Simulate progress within each stage
      const stageProgress = (i / stages?.length) * 100;
      for (let j = 0; j <= 20; j++) {
        const currentProgress = stageProgress + (j / 20) * (100 / stages?.length);
        setProgress(Math.min(currentProgress, 100));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    setTimetableGenerated(true);
    setIsGenerating(false);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    setTimetableGenerated(false);
    await simulateGeneration();
  };

  const handleConstraintChange = (constraintId, value) => {
    setConstraints(prev => ({
      ...prev,
      [constraintId]: value
    }));
  };

  const handleResolveConflict = (conflictId, resolution) => {
    console.log(`Resolving conflict ${conflictId} with ${resolution}`);
    // Implement conflict resolution logic
  };

  const handleAutoResolve = () => {
    console.log('Auto-resolving all conflicts');
    // Implement auto-resolve logic
  };

  const handleSlotUpdate = (slot, newDay, newTime) => {
    console.log(`Moving slot from ${slot?.day} ${slot?.time} to ${newDay} ${newTime}`);
    // Implement slot update logic
  };

  const handleExport = async (exportConfig) => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Exporting with config:', exportConfig);
    
    // Create mock download
    const blob = new Blob(['Mock timetable data'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timetable.${exportConfig?.format}`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} userName={userName} notificationCount={5} />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BreadcrumbNavigation userRole={userRole} />
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={24} color="white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Timetable Generator</h1>
                <p className="text-muted-foreground">
                  AI-powered automated scheduling with intelligent conflict resolution
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} />
                <span>Academic Year 2024-25</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={16} />
                <span>67 Faculty Members</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="BookOpen" size={16} />
                <span>156 Courses</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={16} />
                <span>45 Rooms</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Generation Control Panel */}
            <GenerationControlPanel
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              selectedSemester={selectedSemester}
              onSemesterChange={setSelectedSemester}
              constraints={constraints}
              onConstraintChange={handleConstraintChange}
            />

            {/* Conflict Resolution Interface */}
            {timetableGenerated && (
              <ConflictResolutionInterface
                conflicts={mockConflicts}
                onResolveConflict={handleResolveConflict}
                onAutoResolve={handleAutoResolve}
              />
            )}

            {/* Timetable Preview Panel */}
            <TimetablePreviewPanel
              timetableData={timetableGenerated ? mockTimetableData : []}
              onSlotUpdate={handleSlotUpdate}
              onExport={handleExport}
              selectedView={selectedView}
              onViewChange={setSelectedView}
            />

            {/* Export Controls */}
            <ExportControls
              onExport={handleExport}
              isExporting={isExporting}
              timetableGenerated={timetableGenerated}
            />
          </div>
        </div>
      </main>

      {/* Generation Progress Indicator */}
      <GenerationProgressIndicator
        isGenerating={isGenerating}
        currentStage={currentStage}
        progress={progress}
        estimatedTime={estimatedTime}
        stages={generationStages}
      />
    </div>
  );
};

export default TimetableGenerator;