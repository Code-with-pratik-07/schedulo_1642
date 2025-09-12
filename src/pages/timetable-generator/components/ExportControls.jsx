import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ExportControls = ({ onExport, isExporting, timetableGenerated }) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportScope, setExportScope] = useState('institution');
  const [exportOptions, setExportOptions] = useState({
    includeRoomDetails: true,
    includeFacultyInfo: true,
    includeStudentGroups: true,
    includeBreaks: false,
    colorCoded: true
  });

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'ical', label: 'iCalendar (.ics)' },
    { value: 'csv', label: 'CSV File' }
  ];

  const scopeOptions = [
    { value: 'institution', label: 'Institution-wide' },
    { value: 'department', label: 'Department-wise' },
    { value: 'faculty', label: 'Faculty-wise' },
    { value: 'room', label: 'Room-wise' },
    { value: 'student', label: 'Student Group-wise' }
  ];

  const handleExport = () => {
    onExport({
      format: exportFormat,
      scope: exportScope,
      options: exportOptions
    });
  };

  const handleOptionChange = (option, value) => {
    setExportOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'pdf': return 'FileText';
      case 'excel': return 'Sheet';
      case 'ical': return 'Calendar';
      case 'csv': return 'Database';
      default: return 'Download';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="Download" size={20} className="text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Export Controls</h2>
          <p className="text-sm text-muted-foreground">Download timetables in various formats</p>
        </div>
      </div>
      {!timetableGenerated ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Calendar" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No Timetable Available</h3>
          <p className="text-muted-foreground">Generate a timetable first to enable export options.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Format and Scope Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Select
                label="Export Format"
                description="Choose the file format for export"
                options={formatOptions}
                value={exportFormat}
                onChange={setExportFormat}
              />
            </div>
            <div>
              <Select
                label="Export Scope"
                description="Select the scope of data to export"
                options={scopeOptions}
                value={exportScope}
                onChange={setExportScope}
              />
            </div>
          </div>

          {/* Export Options */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Export Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Checkbox
                label="Include Room Details"
                description="Add room numbers and capacity information"
                checked={exportOptions?.includeRoomDetails}
                onChange={(e) => handleOptionChange('includeRoomDetails', e?.target?.checked)}
              />
              <Checkbox
                label="Include Faculty Information"
                description="Add faculty names and contact details"
                checked={exportOptions?.includeFacultyInfo}
                onChange={(e) => handleOptionChange('includeFacultyInfo', e?.target?.checked)}
              />
              <Checkbox
                label="Include Student Groups"
                description="Add student group and batch information"
                checked={exportOptions?.includeStudentGroups}
                onChange={(e) => handleOptionChange('includeStudentGroups', e?.target?.checked)}
              />
              <Checkbox
                label="Include Break Times"
                description="Show lunch and other break periods"
                checked={exportOptions?.includeBreaks}
                onChange={(e) => handleOptionChange('includeBreaks', e?.target?.checked)}
              />
              {exportFormat === 'pdf' && (
                <Checkbox
                  label="Color-Coded Schedule"
                  description="Use colors to differentiate course types"
                  checked={exportOptions?.colorCoded}
                  onChange={(e) => handleOptionChange('colorCoded', e?.target?.checked)}
                />
              )}
            </div>
          </div>

          {/* Export Actions */}
          <div className="pt-6 border-t border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <Button
                  variant="default"
                  size="lg"
                  onClick={handleExport}
                  loading={isExporting}
                  disabled={isExporting}
                  iconName={getFormatIcon(exportFormat)}
                  iconPosition="left"
                >
                  {isExporting ? 'Exporting...' : `Export as ${exportFormat?.toUpperCase()}`}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onExport({ format: 'preview', scope: exportScope, options: exportOptions })}
                  disabled={isExporting}
                  iconName="Eye"
                  iconPosition="left"
                >
                  Preview
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Icon name="Info" size={16} />
                  <span>Exports include current semester data</span>
                </div>
              </div>
            </div>

            {/* Quick Export Buttons */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm font-medium text-foreground mb-3">Quick Export Options:</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onExport({ format: 'pdf', scope: 'institution', options: exportOptions })}
                  iconName="FileText"
                  iconPosition="left"
                >
                  Institution PDF
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onExport({ format: 'excel', scope: 'faculty', options: exportOptions })}
                  iconName="Sheet"
                  iconPosition="left"
                >
                  Faculty Excel
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onExport({ format: 'ical', scope: 'student', options: exportOptions })}
                  iconName="Calendar"
                  iconPosition="left"
                >
                  Student iCal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportControls;