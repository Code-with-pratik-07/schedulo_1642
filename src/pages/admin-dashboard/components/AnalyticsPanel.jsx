import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnalyticsPanel = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('utilization');

  const roomUtilizationData = [
    { room: 'A101', utilization: 85, capacity: 60, hoursUsed: 34, totalHours: 40 },
    { room: 'A102', utilization: 72, capacity: 45, hoursUsed: 29, totalHours: 40 },
    { room: 'B201', utilization: 91, capacity: 100, hoursUsed: 36, totalHours: 40 },
    { room: 'B202', utilization: 68, capacity: 80, hoursUsed: 27, totalHours: 40 },
    { room: 'C301', utilization: 95, capacity: 120, hoursUsed: 38, totalHours: 40 },
    { room: 'C302', utilization: 78, capacity: 90, hoursUsed: 31, totalHours: 40 },
    { room: 'Lab1', utilization: 88, capacity: 30, hoursUsed: 35, totalHours: 40 },
    { room: 'Lab2', utilization: 82, capacity: 30, hoursUsed: 33, totalHours: 40 }
  ];

  const facultyWorkloadData = [
    { faculty: 'Dr. Smith', hours: 18, courses: 3, students: 180 },
    { faculty: 'Prof. Johnson', hours: 16, courses: 2, students: 120 },
    { faculty: 'Dr. Williams', hours: 20, courses: 4, students: 200 },
    { faculty: 'Prof. Davis', hours: 14, courses: 2, students: 90 },
    { faculty: 'Dr. Brown', hours: 22, courses: 3, students: 165 },
    { faculty: 'Prof. Wilson', hours: 15, courses: 2, students: 110 },
    { faculty: 'Dr. Taylor', hours: 19, courses: 3, students: 195 },
    { faculty: 'Prof. Anderson', hours: 17, courses: 3, students: 150 }
  ];

  const departmentDistribution = [
    { name: 'Computer Science', value: 35, color: '#3b82f6' },
    { name: 'Mathematics', value: 25, color: '#10b981' },
    { name: 'Physics', value: 20, color: '#f59e0b' },
    { name: 'Chemistry', value: 15, color: '#ef4444' },
    { name: 'Biology', value: 5, color: '#8b5cf6' }
  ];

  const weeklyTrends = [
    { day: 'Mon', utilization: 88, conflicts: 2, satisfaction: 92 },
    { day: 'Tue', utilization: 92, conflicts: 1, satisfaction: 94 },
    { day: 'Wed', utilization: 85, conflicts: 3, satisfaction: 89 },
    { day: 'Thu', utilization: 90, conflicts: 1, satisfaction: 95 },
    { day: 'Fri', utilization: 87, conflicts: 2, satisfaction: 91 },
    { day: 'Sat', utilization: 45, conflicts: 0, satisfaction: 88 }
  ];

  const timeframeOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'semester', label: 'This Semester' },
    { value: 'year', label: 'This Year' }
  ];

  const metricOptions = [
    { value: 'utilization', label: 'Room Utilization', icon: 'Building' },
    { value: 'workload', label: 'Faculty Workload', icon: 'Users' },
    { value: 'distribution', label: 'Department Distribution', icon: 'PieChart' },
    { value: 'trends', label: 'Weekly Trends', icon: 'TrendingUp' }
  ];

  const exportData = (format) => {
    console.log(`Exporting analytics data in ${format} format`);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex flex-wrap gap-2">
          {metricOptions?.map((option) => (
            <Button
              key={option?.value}
              variant={selectedMetric === option?.value ? "default" : "outline"}
              onClick={() => setSelectedMetric(option?.value)}
              iconName={option?.icon}
              iconPosition="left"
              size="sm"
            >
              {option?.label}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e?.target?.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
          >
            {timeframeOptions?.map((option) => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
          
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            size="sm"
            onClick={() => exportData('pdf')}
          >
            Export
          </Button>
        </div>
      </div>
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Utilization</p>
              <p className="text-2xl font-bold text-card-foreground">84.2%</p>
              <p className="text-xs text-success flex items-center mt-1">
                <Icon name="TrendingUp" size={12} className="mr-1" />
                +5.2% from last week
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Building" size={24} className="text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Faculty</p>
              <p className="text-2xl font-bold text-card-foreground">85</p>
              <p className="text-xs text-success flex items-center mt-1">
                <Icon name="TrendingUp" size={12} className="mr-1" />
                +3 new this month
              </p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={24} className="text-success" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Conflicts</p>
              <p className="text-2xl font-bold text-card-foreground">9</p>
              <p className="text-xs text-destructive flex items-center mt-1">
                <Icon name="TrendingDown" size={12} className="mr-1" />
                -12 from last week
              </p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={24} className="text-warning" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Satisfaction Score</p>
              <p className="text-2xl font-bold text-card-foreground">92.1%</p>
              <p className="text-xs text-success flex items-center mt-1">
                <Icon name="TrendingUp" size={12} className="mr-1" />
                +2.1% improvement
              </p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Star" size={24} className="text-accent" />
            </div>
          </div>
        </div>
      </div>
      {/* Main Chart Area */}
      <div className="bg-card border border-border rounded-lg p-6">
        {selectedMetric === 'utilization' && (
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Room Utilization Analysis</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roomUtilizationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="room" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="utilization" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedMetric === 'workload' && (
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Faculty Workload Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={facultyWorkloadData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="faculty" stroke="#64748b" fontSize={12} angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="hours" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedMetric === 'distribution' && (
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Department Course Distribution</h3>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {departmentDistribution?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedMetric === 'trends' && (
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Weekly Performance Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="utilization" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="satisfaction" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Rooms */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Top Performing Rooms</h3>
          <div className="space-y-3">
            {roomUtilizationData?.sort((a, b) => b?.utilization - a?.utilization)?.slice(0, 5)?.map((room, index) => (
                <div key={room?.room} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{room?.room}</p>
                      <p className="text-sm text-muted-foreground">Capacity: {room?.capacity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-card-foreground">{room?.utilization}%</p>
                    <p className="text-sm text-muted-foreground">{room?.hoursUsed}/{room?.totalHours}h</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Faculty Workload Summary */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Faculty Workload Summary</h3>
          <div className="space-y-3">
            {facultyWorkloadData?.sort((a, b) => b?.hours - a?.hours)?.slice(0, 5)?.map((faculty, index) => (
                <div key={faculty?.faculty} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                      <Icon name="User" size={16} className="text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{faculty?.faculty}</p>
                      <p className="text-sm text-muted-foreground">{faculty?.courses} courses</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-card-foreground">{faculty?.hours}h</p>
                    <p className="text-sm text-muted-foreground">{faculty?.students} students</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;