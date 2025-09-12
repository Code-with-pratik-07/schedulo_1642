import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActions = ({ 
  selectedNotifications, 
  totalNotifications,
  onSelectAll, 
  onDeselectAll, 
  onMarkAsRead, 
  onArchive, 
  onDelete 
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const selectedCount = selectedNotifications?.length;
  const isAllSelected = selectedCount === totalNotifications && totalNotifications > 0;
  const isPartiallySelected = selectedCount > 0 && selectedCount < totalNotifications;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  const handleBulkDelete = () => {
    if (selectedCount > 0) {
      setShowConfirmDelete(true);
    }
  };

  const confirmDelete = () => {
    onDelete(selectedNotifications);
    setShowConfirmDelete(false);
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isPartiallySelected;
                  }}
                  onChange={handleSelectAll}
                  className="rounded border-border text-primary focus:ring-primary"
                />
              </div>
              <span className="text-sm font-medium">
                {selectedCount} of {totalNotifications} selected
              </span>
            </div>

            {selectedCount > 0 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMarkAsRead(selectedNotifications)}
                  iconName="Check"
                  iconPosition="left"
                >
                  Mark as Read
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onArchive(selectedNotifications)}
                  iconName="Archive"
                  iconPosition="left"
                >
                  Archive
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  iconName="Trash2"
                  iconPosition="left"
                  className="text-destructive hover:text-destructive"
                >
                  Delete
                </Button>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onDeselectAll}
            iconName="X"
          >
            Clear Selection
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-destructive/10 rounded-full">
                <Icon name="AlertTriangle" size={20} className="text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Delete Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete {selectedCount} notification{selectedCount > 1 ? 's' : ''}?
                </p>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-3 mb-4">
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. The selected notifications will be permanently removed from your account.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                iconName="Trash2"
                iconPosition="left"
              >
                Delete {selectedCount} Notification{selectedCount > 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActions;