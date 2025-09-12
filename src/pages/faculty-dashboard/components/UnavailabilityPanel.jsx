import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const UnavailabilityPanel = ({ unavailabilityRequests, onSubmitRequest }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    description: ''
  });

  const reasonOptions = [
    { value: 'medical', label: 'Medical Leave' },
    { value: 'personal', label: 'Personal Emergency' },
    { value: 'conference', label: 'Conference/Workshop' },
    { value: 'training', label: 'Training Program' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSubmitRequest(formData);
    setFormData({
      startDate: '',
      endDate: '',
      reason: '',
      description: ''
    });
    setIsFormOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-success/10 text-success border-success/20';
      case 'rejected':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return 'CheckCircle';
      case 'rejected':
        return 'XCircle';
      case 'pending':
        return 'Clock';
      default:
        return 'AlertCircle';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Unavailability Requests</h2>
          <p className="text-sm text-muted-foreground">Submit and track your leave requests</p>
        </div>
        <Button
          variant="default"
          onClick={() => setIsFormOpen(!isFormOpen)}
          iconName={isFormOpen ? "X" : "Plus"}
          iconPosition="left"
        >
          {isFormOpen ? 'Cancel' : 'New Request'}
        </Button>
      </div>
      {/* Request Form */}
      {isFormOpen && (
        <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={formData?.startDate}
                onChange={(e) => handleInputChange('startDate', e?.target?.value)}
                required
              />
              <Input
                label="End Date"
                type="date"
                value={formData?.endDate}
                onChange={(e) => handleInputChange('endDate', e?.target?.value)}
                required
              />
            </div>
            
            <Select
              label="Reason"
              options={reasonOptions}
              value={formData?.reason}
              onChange={(value) => handleInputChange('reason', value)}
              placeholder="Select reason for unavailability"
              required
            />
            
            <Input
              label="Description"
              type="text"
              placeholder="Provide additional details (optional)"
              value={formData?.description}
              onChange={(e) => handleInputChange('description', e?.target?.value)}
              description="Optional: Provide more context for your request"
            />
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                iconName="Send"
                iconPosition="left"
              >
                Submit Request
              </Button>
            </div>
          </form>
        </div>
      )}
      {/* Requests List */}
      <div className="space-y-3">
        {unavailabilityRequests?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Calendar" size={48} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No unavailability requests submitted yet</p>
            <p className="text-sm text-muted-foreground">Click "New Request" to submit your first request</p>
          </div>
        ) : (
          unavailabilityRequests?.map((request) => (
            <div key={request?.id} className="p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-foreground">
                      {reasonOptions?.find(r => r?.value === request?.reason)?.label || request?.reason}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request?.status)}`}>
                      <Icon name={getStatusIcon(request?.status)} size={12} className="inline mr-1" />
                      {request?.status?.charAt(0)?.toUpperCase() + request?.status?.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center space-x-1">
                      <Icon name="Calendar" size={14} />
                      <span>{new Date(request.startDate)?.toLocaleDateString('en-GB')} - {new Date(request.endDate)?.toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>Submitted {new Date(request.submittedAt)?.toLocaleDateString('en-GB')}</span>
                    </div>
                  </div>
                  
                  {request?.description && (
                    <p className="text-sm text-muted-foreground">{request?.description}</p>
                  )}
                  
                  {request?.adminNotes && (
                    <div className="mt-2 p-2 bg-muted rounded text-sm">
                      <span className="font-medium">Admin Notes: </span>
                      {request?.adminNotes}
                    </div>
                  )}
                </div>
                
                {request?.status === 'pending' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="MoreHorizontal"
                    className="text-muted-foreground"
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UnavailabilityPanel;