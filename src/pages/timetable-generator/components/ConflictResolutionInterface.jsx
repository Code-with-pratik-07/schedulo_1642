import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const ConflictResolutionInterface = ({ conflicts, onResolveConflict, onAutoResolve }) => {
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [resolutionFilter, setResolutionFilter] = useState('all');

  const filterOptions = [
    { value: 'all', label: 'All Conflicts' },
    { value: 'faculty', label: 'Faculty Conflicts' },
    { value: 'room', label: 'Room Conflicts' },
    { value: 'capacity', label: 'Capacity Issues' },
    { value: 'credit', label: 'Credit Hour Violations' }
  ];

  const getConflictIcon = (type) => {
    switch (type) {
      case 'faculty': return 'Users';
      case 'room': return 'MapPin';
      case 'capacity': return 'AlertTriangle';
      case 'credit': return 'Clock';
      default: return 'AlertCircle';
    }
  };

  const getConflictColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const filteredConflicts = conflicts?.filter(conflict => 
    resolutionFilter === 'all' || conflict?.type === resolutionFilter
  );

  if (conflicts?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} className="text-success" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Conflicts Detected</h3>
          <p className="text-muted-foreground">The generated timetable meets all scheduling constraints.</p>
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
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} className="text-warning" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Conflict Resolution</h2>
              <p className="text-sm text-muted-foreground">
                {conflicts?.length} conflict{conflicts?.length !== 1 ? 's' : ''} detected
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Select
              options={filterOptions}
              value={resolutionFilter}
              onChange={setResolutionFilter}
              placeholder="Filter conflicts..."
              className="w-48"
            />
            <Button
              variant="outline"
              onClick={onAutoResolve}
              iconName="Wand2"
              iconPosition="left"
            >
              Auto-Resolve All
            </Button>
          </div>
        </div>
      </div>
      {/* Conflicts List */}
      <div className="divide-y divide-border">
        {filteredConflicts?.map((conflict) => (
          <div key={conflict?.id} className="p-6 hover:bg-muted/50 transition-colors duration-200">
            <div className="flex items-start space-x-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                conflict?.severity === 'high' ? 'bg-destructive/10' :
                conflict?.severity === 'medium' ? 'bg-warning/10' : 'bg-muted'
              }`}>
                <Icon 
                  name={getConflictIcon(conflict?.type)} 
                  size={20} 
                  className={getConflictColor(conflict?.severity)} 
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-foreground mb-1">
                      {conflict?.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {conflict?.description}
                    </p>

                    {/* Affected Entities */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">Affected Entities:</h4>
                      <div className="flex flex-wrap gap-2">
                        {conflict?.entities?.map((entity, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground"
                          >
                            {entity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Suggested Solutions */}
                    {conflict?.suggestions && conflict?.suggestions?.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-foreground mb-2">Suggested Solutions:</h4>
                        <ul className="space-y-1">
                          {conflict?.suggestions?.map((suggestion, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                              <Icon name="ArrowRight" size={14} className="mt-0.5 flex-shrink-0" />
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      conflict?.severity === 'high' ? 'bg-destructive/10 text-destructive' :
                      conflict?.severity === 'medium'? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                    }`}>
                      {conflict?.severity?.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Resolution Actions */}
                <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-border">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onResolveConflict(conflict?.id, 'auto')}
                    iconName="Zap"
                    iconPosition="left"
                  >
                    Auto-Fix
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedConflict(conflict?.id)}
                    iconName="Edit"
                    iconPosition="left"
                  >
                    Manual Override
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onResolveConflict(conflict?.id, 'ignore')}
                    iconName="X"
                    iconPosition="left"
                  >
                    Ignore
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConflictResolutionInterface;