import React from 'react';
import Icon from '../../../components/AppIcon';

const GenerationProgressIndicator = ({ 
  isGenerating, 
  currentStage, 
  progress, 
  estimatedTime,
  stages 
}) => {
  if (!isGenerating) return null;

  const getStageIcon = (stage) => {
    switch (stage) {
      case 'initializing': return 'Settings';
      case 'processing': return 'Cpu';
      case 'optimizing': return 'Zap';
      case 'validating': return 'CheckCircle';
      case 'finalizing': return 'Save';
      default: return 'Loader2';
    }
  };

  const getStageStatus = (stage, currentStage) => {
    const stageIndex = stages?.findIndex(s => s?.id === stage);
    const currentIndex = stages?.findIndex(s => s?.id === currentStage);
    
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin">
              <Icon name="Loader2" size={32} className="text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Generating Timetable</h3>
          <p className="text-sm text-muted-foreground">
            AI-powered scheduling in progress...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stages */}
        <div className="space-y-3 mb-6">
          {stages?.map((stage) => {
            const status = getStageStatus(stage?.id, currentStage);
            return (
              <div key={stage?.id} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  status === 'completed' ? 'bg-success text-success-foreground' :
                  status === 'active' ? 'bg-primary text-primary-foreground' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {status === 'completed' ? (
                    <Icon name="Check" size={16} />
                  ) : status === 'active' ? (
                    <div className="animate-spin">
                      <Icon name={getStageIcon(stage?.id)} size={16} />
                    </div>
                  ) : (
                    <Icon name={getStageIcon(stage?.id)} size={16} />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    status === 'active' ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {stage?.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{stage?.description}</p>
                </div>
                {status === 'active' && (
                  <div className="animate-pulse">
                    <Icon name="Activity" size={16} className="text-primary" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Estimated Time */}
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>Estimated time remaining: {estimatedTime}</span>
        </div>

        {/* Processing Details */}
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Faculty processed:</span>
              <span className="font-medium">45/67</span>
            </div>
            <div className="flex justify-between">
              <span>Courses scheduled:</span>
              <span className="font-medium">128/156</span>
            </div>
            <div className="flex justify-between">
              <span>Conflicts resolved:</span>
              <span className="font-medium">12/15</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerationProgressIndicator;