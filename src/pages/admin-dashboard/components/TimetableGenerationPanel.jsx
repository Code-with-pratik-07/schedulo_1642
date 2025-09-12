import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TimetableGenerationPanel = () => {
  const [generationStatus, setGenerationStatus] = useState('idle');
  const [conflicts, setConflicts] = useState([]);
  const [showConflicts, setShowConflicts] = useState(false);

  const mockConflicts = [
    {
      id: 1,
      type: 'room_conflict',
      severity: 'high',
      description: 'Room A101 is double-booked for CS101 and MATH201',
      time: 'Monday 10:00 AM - 11:00 AM',
      courses: ['CS101 - Data Structures', 'MATH201 - Linear Algebra'],
      room: 'A101',
      suggestions: [
        'Move CS101 to Room A102',
        'Reschedule MATH201 to 11:00 AM - 12:00 PM',
        'Use Room B201 for MATH201'
      ]
    },
    {
      id: 2,
      type: 'faculty_conflict',
      severity: 'medium',
      description: 'Dr. Smith assigned to teach two classes simultaneously',
      time: 'Tuesday 2:00 PM - 3:00 PM',
      courses: ['CS201 - Algorithms', 'CS301 - Database Systems'],
      faculty: 'Dr. Smith',
      suggestions: [
        'Assign Dr. Johnson to CS301',
        'Reschedule CS301 to 3:00 PM - 4:00 PM',
        'Split CS201 into two sections'
      ]
    },
    {
      id: 3,
      type: 'capacity_conflict',
      severity: 'low',
      description: 'Room B102 capacity (30) insufficient for enrolled students (45)',
      time: 'Wednesday 9:00 AM - 10:00 AM',
      courses: ['ENG101 - English Literature'],
      room: 'B102',
      suggestions: [
        'Move to Lecture Hall C301 (capacity: 100)',
        'Split into two sections',
        'Use Room A201 (capacity: 50)'
      ]
    }
  ];

  const substitutionRequests = [
    {
      id: 1,
      faculty: 'Dr. Johnson',
      course: 'CS101 - Introduction to Programming',
      date: '2024-09-15',
      time: '10:00 AM - 11:00 AM',
      reason: 'Medical appointment',
      substitute: 'Dr. Williams',
      status: 'pending',
      requestedAt: '2024-09-12 09:30 AM'
    },
    {
      id: 2,
      faculty: 'Prof. Davis',
      course: 'MATH201 - Calculus II',
      date: '2024-09-16',
      time: '2:00 PM - 3:00 PM',
      reason: 'Conference attendance',
      substitute: 'Dr. Brown',
      status: 'approved',
      requestedAt: '2024-09-11 02:15 PM'
    },
    {
      id: 3,
      faculty: 'Dr. Wilson',
      course: 'PHY101 - Physics Fundamentals',
      date: '2024-09-17',
      time: '11:00 AM - 12:00 PM',
      reason: 'Personal emergency',
      substitute: 'Prof. Taylor',
      status: 'rejected',
      requestedAt: '2024-09-10 04:45 PM'
    }
  ];

  const handleGenerateTimetable = () => {
    setGenerationStatus('processing');
    
    // Simulate timetable generation process
    setTimeout(() => {
      setConflicts(mockConflicts);
      setGenerationStatus('conflicts_found');
      setShowConflicts(true);
    }, 3000);
  };

  const handleResolveConflict = (conflictId, suggestionIndex) => {
    setConflicts(prev => prev?.filter(c => c?.id !== conflictId));
    
    if (conflicts?.length === 1) {
      setGenerationStatus('completed');
      setShowConflicts(false);
    }
  };

  const handleSubstitutionAction = (requestId, action) => {
    // Handle substitution approval/rejection
    console.log(`${action} substitution request ${requestId}`);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-success bg-success/10';
      case 'rejected': return 'text-destructive bg-destructive/10';
      case 'pending': return 'text-warning bg-warning/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* Generation Controls */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Timetable Generation</h3>
            <p className="text-sm text-muted-foreground">Generate optimized schedules with conflict resolution</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              iconName="Settings"
              iconPosition="left"
            >
              Configure
            </Button>
            <Button
              variant="default"
              onClick={handleGenerateTimetable}
              loading={generationStatus === 'processing'}
              disabled={generationStatus === 'processing'}
              iconName="Play"
              iconPosition="left"
            >
              {generationStatus === 'processing' ? 'Generating...' : 'Generate Timetable'}
            </Button>
          </div>
        </div>

        {/* Generation Status */}
        {generationStatus !== 'idle' && (
          <div className="mb-6">
            <div className={`p-4 rounded-lg border ${
              generationStatus === 'processing' ? 'bg-blue-50 border-blue-200' :
              generationStatus === 'conflicts_found'? 'bg-warning/10 border-warning/20' : 'bg-success/10 border-success/20'
            }`}>
              <div className="flex items-center space-x-3">
                {generationStatus === 'processing' && (
                  <>
                    <div className="animate-spin">
                      <Icon name="Loader2" size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">Generating Timetable...</p>
                      <p className="text-sm text-blue-600">Processing constraints and optimizing schedules</p>
                    </div>
                  </>
                )}
                {generationStatus === 'conflicts_found' && (
                  <>
                    <Icon name="AlertTriangle" size={20} className="text-warning" />
                    <div>
                      <p className="font-medium text-warning">Conflicts Detected</p>
                      <p className="text-sm text-warning/80">{conflicts?.length} scheduling conflicts need resolution</p>
                    </div>
                  </>
                )}
                {generationStatus === 'completed' && (
                  <>
                    <Icon name="CheckCircle" size={20} className="text-success" />
                    <div>
                      <p className="font-medium text-success">Timetable Generated Successfully</p>
                      <p className="text-sm text-success/80">All conflicts resolved, ready for deployment</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-card-foreground">1,250</p>
            <p className="text-sm text-muted-foreground">Students</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-card-foreground">85</p>
            <p className="text-sm text-muted-foreground">Faculty</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-card-foreground">320</p>
            <p className="text-sm text-muted-foreground">Courses</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-card-foreground">45</p>
            <p className="text-sm text-muted-foreground">Rooms</p>
          </div>
        </div>
      </div>
      {/* Conflict Resolution */}
      {showConflicts && conflicts?.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Resolve Conflicts</h3>
          <div className="space-y-4">
            {conflicts?.map((conflict) => (
              <div key={conflict?.id} className={`p-4 rounded-lg border ${getSeverityColor(conflict?.severity)}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertTriangle" size={16} />
                    <span className="text-xs font-medium uppercase tracking-wide">
                      {conflict?.severity} Priority
                    </span>
                  </div>
                  <span className="text-xs opacity-75">{conflict?.time}</span>
                </div>
                
                <h4 className="font-medium mb-2">{conflict?.description}</h4>
                
                <div className="text-sm space-y-1 mb-4">
                  {conflict?.courses && (
                    <p><span className="font-medium">Courses:</span> {conflict?.courses?.join(', ')}</p>
                  )}
                  {conflict?.room && (
                    <p><span className="font-medium">Room:</span> {conflict?.room}</p>
                  )}
                  {conflict?.faculty && (
                    <p><span className="font-medium">Faculty:</span> {conflict?.faculty}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Suggested Solutions:</p>
                  {conflict?.suggestions?.map((suggestion, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-background/50 rounded">
                      <span className="text-sm">{suggestion}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolveConflict(conflict?.id, index)}
                      >
                        Apply
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Substitution Requests */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">Substitution Requests</h3>
          <Button variant="outline" iconName="Filter" size="sm">
            Filter
          </Button>
        </div>

        <div className="space-y-4">
          {substitutionRequests?.map((request) => (
            <div key={request?.id} className="p-4 border border-border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-card-foreground">{request?.course}</h4>
                  <p className="text-sm text-muted-foreground">
                    Requested by {request?.faculty} • {request?.date} at {request?.time}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request?.status)}`}>
                  {request?.status?.charAt(0)?.toUpperCase() + request?.status?.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm"><span className="font-medium">Reason:</span> {request?.reason}</p>
                  <p className="text-sm"><span className="font-medium">Substitute:</span> {request?.substitute}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Requested: {request?.requestedAt}</p>
                </div>
              </div>

              {request?.status === 'pending' && (
                <div className="flex space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleSubstitutionAction(request?.id, 'approve')}
                    iconName="Check"
                    iconPosition="left"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleSubstitutionAction(request?.id, 'reject')}
                    iconName="X"
                    iconPosition="left"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimetableGenerationPanel;