import React from 'react';
import Icon from '../../../components/AppIcon';

const SemesterOverview = ({ semesterData }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Semester Overview</h2>
        <div className="text-sm text-muted-foreground">
          {semesterData?.name} • {semesterData?.year}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Courses */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Enrolled Courses</h3>
          <div className="space-y-3">
            {semesterData?.courses?.map((course) => (
              <div key={course?.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-foreground">{course?.name}</h4>
                    <p className="text-sm text-muted-foreground">{course?.code}</p>
                  </div>
                  <span className="text-sm font-medium text-primary">{course?.credits} Credits</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Icon name="User" size={14} className="mr-2" />
                    {course?.faculty}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Icon name="Clock" size={14} className="mr-2" />
                    {course?.hoursPerWeek}h/week
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Calendar */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Important Dates</h3>
          <div className="space-y-3">
            {semesterData?.importantDates?.map((date, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center">
                  <Icon name="Calendar" size={16} className="mr-3 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{date?.event}</p>
                    <p className="text-sm text-muted-foreground">{date?.description}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-foreground">
                  {new Date(date.date)?.toLocaleDateString('en-GB')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Semester Progress */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-foreground">Semester Progress</h3>
          <span className="text-sm text-muted-foreground">
            {semesterData?.progress?.completedWeeks} of {semesterData?.progress?.totalWeeks} weeks
          </span>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(semesterData?.progress?.completedWeeks / semesterData?.progress?.totalWeeks) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>Started: {new Date(semesterData.progress.startDate)?.toLocaleDateString('en-GB')}</span>
          <span>Ends: {new Date(semesterData.progress.endDate)?.toLocaleDateString('en-GB')}</span>
        </div>
      </div>
    </div>
  );
};

export default SemesterOverview;