import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DataManagementPanel = () => {
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragStates, setDragStates] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});

  const uploadSections = [
    {
      id: 'students',
      title: 'Students Data',
      description: 'Upload student information with enrollment details',
      icon: 'Users',
      acceptedFormats: '.csv, .xlsx',
      sampleData: [
        { field: 'Student ID', example: 'STU001', required: true },
        { field: 'Name', example: 'John Doe', required: true },
        { field: 'Email', example: 'john@university.edu', required: true },
        { field: 'Course', example: 'Computer Science', required: true },
        { field: 'Semester', example: '5', required: true }
      ]
    },
    {
      id: 'faculty',
      title: 'Faculty Data',
      description: 'Upload faculty information and teaching preferences',
      icon: 'GraduationCap',
      acceptedFormats: '.csv, .xlsx',
      sampleData: [
        { field: 'Faculty ID', example: 'FAC001', required: true },
        { field: 'Name', example: 'Dr. Smith', required: true },
        { field: 'Email', example: 'smith@university.edu', required: true },
        { field: 'Department', example: 'Computer Science', required: true },
        { field: 'Specialization', example: 'Data Structures', required: false }
      ]
    },
    {
      id: 'courses',
      title: 'Courses Data',
      description: 'Upload course catalog and credit information',
      icon: 'BookOpen',
      acceptedFormats: '.csv, .xlsx',
      sampleData: [
        { field: 'Course Code', example: 'CS101', required: true },
        { field: 'Course Name', example: 'Introduction to Programming', required: true },
        { field: 'Credits', example: '4', required: true },
        { field: 'Department', example: 'Computer Science', required: true },
        { field: 'Prerequisites', example: 'None', required: false }
      ]
    },
    {
      id: 'rooms',
      title: 'Rooms Data',
      description: 'Upload classroom and facility information',
      icon: 'Building',
      acceptedFormats: '.csv, .xlsx',
      sampleData: [
        { field: 'Room Number', example: 'A101', required: true },
        { field: 'Building', example: 'Academic Block A', required: true },
        { field: 'Capacity', example: '60', required: true },
        { field: 'Type', example: 'Lecture Hall', required: true },
        { field: 'Equipment', example: 'Projector, AC', required: false }
      ]
    }
  ];

  const handleDragOver = (e, sectionId) => {
    e?.preventDefault();
    setDragStates(prev => ({ ...prev, [sectionId]: true }));
  };

  const handleDragLeave = (e, sectionId) => {
    e?.preventDefault();
    setDragStates(prev => ({ ...prev, [sectionId]: false }));
  };

  const handleDrop = (e, sectionId) => {
    e?.preventDefault();
    setDragStates(prev => ({ ...prev, [sectionId]: false }));
    
    const files = Array.from(e?.dataTransfer?.files);
    handleFileUpload(files, sectionId);
  };

  const handleFileSelect = (e, sectionId) => {
    const files = Array.from(e?.target?.files);
    handleFileUpload(files, sectionId);
  };

  const handleFileUpload = (files, sectionId) => {
    if (files?.length === 0) return;

    const file = files?.[0];
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    
    if (!validTypes?.includes(file?.type)) {
      setUploadErrors(prev => ({
        ...prev,
        [sectionId]: 'Invalid file type. Please upload CSV or Excel files only.'
      }));
      return;
    }

    // Simulate upload progress
    setUploadProgress(prev => ({ ...prev, [sectionId]: 0 }));
    setUploadErrors(prev => ({ ...prev, [sectionId]: null }));

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev?.[sectionId] || 0;
        if (currentProgress >= 100) {
          clearInterval(interval);
          return prev;
        }
        return { ...prev, [sectionId]: currentProgress + 10 };
      });
    }, 200);
  };

  const downloadTemplate = (sectionId) => {
    const section = uploadSections?.find(s => s?.id === sectionId);
    const csvContent = section?.sampleData?.map(item => item?.field)?.join(',') + '\n' +
                      section?.sampleData?.map(item => item?.example)?.join(',');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${section?.title?.toLowerCase()?.replace(' ', '_')}_template.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {uploadSections?.map((section) => (
          <div key={section?.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={section?.icon} size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">{section?.title}</h3>
                <p className="text-sm text-muted-foreground">{section?.description}</p>
              </div>
            </div>

            {/* Upload Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
                dragStates?.[section?.id]
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
              onDragOver={(e) => handleDragOver(e, section?.id)}
              onDragLeave={(e) => handleDragLeave(e, section?.id)}
              onDrop={(e) => handleDrop(e, section?.id)}
            >
              <Icon name="Upload" size={32} className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium text-card-foreground mb-1">
                Drop files here or click to browse
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Supported formats: {section?.acceptedFormats}
              </p>
              
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => handleFileSelect(e, section?.id)}
                className="hidden"
                id={`file-${section?.id}`}
              />
              
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById(`file-${section?.id}`)?.click()}
                  iconName="FileText"
                  iconPosition="left"
                  size="sm"
                >
                  Choose File
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => downloadTemplate(section?.id)}
                  iconName="Download"
                  iconPosition="left"
                  size="sm"
                >
                  Download Template
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            {uploadProgress?.[section?.id] !== undefined && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Uploading...</span>
                  <span className="text-muted-foreground">{uploadProgress?.[section?.id]}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress?.[section?.id]}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {uploadErrors?.[section?.id] && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertCircle" size={16} className="text-destructive" />
                  <p className="text-sm text-destructive">{uploadErrors?.[section?.id]}</p>
                </div>
              </div>
            )}

            {/* Sample Data Preview */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-card-foreground mb-2">Required Fields:</h4>
              <div className="space-y-1">
                {section?.sampleData?.slice(0, 3)?.map((field, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      {field?.field} {field?.required && <span className="text-destructive">*</span>}
                    </span>
                    <span className="text-card-foreground font-mono">{field?.example}</span>
                  </div>
                ))}
                {section?.sampleData?.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{section?.sampleData?.length - 3} more fields...
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Recent Uploads */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Recent Uploads</h3>
        <div className="space-y-3">
          {[
            { file: 'students_batch_2024.csv', type: 'Students', status: 'completed', time: '2 hours ago', records: 1250 },
            { file: 'faculty_spring_2024.xlsx', type: 'Faculty', status: 'completed', time: '1 day ago', records: 85 },
            { file: 'courses_catalog.csv', type: 'Courses', status: 'processing', time: '5 minutes ago', records: 320 },
            { file: 'room_inventory.xlsx', type: 'Rooms', status: 'failed', time: '3 days ago', records: 0 }
          ]?.map((upload, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  upload?.status === 'completed' ? 'bg-success' :
                  upload?.status === 'processing' ? 'bg-warning' : 'bg-destructive'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">{upload?.file}</p>
                  <p className="text-xs text-muted-foreground">
                    {upload?.type} • {upload?.time} • {upload?.records} records
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {upload?.status === 'completed' && (
                  <Icon name="CheckCircle" size={16} className="text-success" />
                )}
                {upload?.status === 'processing' && (
                  <Icon name="Clock" size={16} className="text-warning" />
                )}
                {upload?.status === 'failed' && (
                  <Icon name="XCircle" size={16} className="text-destructive" />
                )}
                <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataManagementPanel;