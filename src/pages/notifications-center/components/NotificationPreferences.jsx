import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const NotificationPreferences = ({ isOpen, onClose }) => {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    categories: {
      schedule: true,
      administrative: true,
      system: false,
      personal: true
    },
    deliveryTiming: {
      immediate: true,
      daily: false,
      weekly: false
    },
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCategoryChange = (category, value) => {
    setPreferences(prev => ({
      ...prev,
      categories: {
        ...prev?.categories,
        [category]: value
      }
    }));
  };

  const handleDeliveryTimingChange = (timing, value) => {
    setPreferences(prev => ({
      ...prev,
      deliveryTiming: {
        immediate: false,
        daily: false,
        weekly: false,
        [timing]: value
      }
    }));
  };

  const handleQuietHoursChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      quietHours: {
        ...prev?.quietHours,
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Icon name="Settings" size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Notification Preferences</h2>
                <p className="text-sm text-muted-foreground">
                  Customize how and when you receive notifications
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              iconName="X"
            />
          </div>

          <div className="space-y-6">
            {/* Delivery Methods */}
            <div>
              <h3 className="text-lg font-medium mb-4">Delivery Methods</h3>
              <div className="space-y-3">
                <Checkbox
                  label="Email Notifications"
                  description="Receive notifications via email"
                  checked={preferences?.emailNotifications}
                  onChange={(e) => handlePreferenceChange('emailNotifications', e?.target?.checked)}
                />
                <Checkbox
                  label="Push Notifications"
                  description="Receive browser push notifications"
                  checked={preferences?.pushNotifications}
                  onChange={(e) => handlePreferenceChange('pushNotifications', e?.target?.checked)}
                />
                <Checkbox
                  label="SMS Notifications"
                  description="Receive notifications via SMS (charges may apply)"
                  checked={preferences?.smsNotifications}
                  onChange={(e) => handlePreferenceChange('smsNotifications', e?.target?.checked)}
                />
              </div>
            </div>

            {/* Category Subscriptions */}
            <div>
              <h3 className="text-lg font-medium mb-4">Category Subscriptions</h3>
              <div className="space-y-3">
                <Checkbox
                  label="Schedule Changes"
                  description="Class schedules, room changes, and timetable updates"
                  checked={preferences?.categories?.schedule}
                  onChange={(e) => handleCategoryChange('schedule', e?.target?.checked)}
                />
                <Checkbox
                  label="Administrative Announcements"
                  description="Official announcements and policy updates"
                  checked={preferences?.categories?.administrative}
                  onChange={(e) => handleCategoryChange('administrative', e?.target?.checked)}
                />
                <Checkbox
                  label="System Alerts"
                  description="System maintenance and technical updates"
                  checked={preferences?.categories?.system}
                  onChange={(e) => handleCategoryChange('system', e?.target?.checked)}
                />
                <Checkbox
                  label="Personal Messages"
                  description="Direct messages and personal communications"
                  checked={preferences?.categories?.personal}
                  onChange={(e) => handleCategoryChange('personal', e?.target?.checked)}
                />
              </div>
            </div>

            {/* Delivery Timing */}
            <div>
              <h3 className="text-lg font-medium mb-4">Delivery Timing</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="immediate"
                    name="deliveryTiming"
                    checked={preferences?.deliveryTiming?.immediate}
                    onChange={(e) => handleDeliveryTimingChange('immediate', e?.target?.checked)}
                    className="text-primary focus:ring-primary"
                  />
                  <label htmlFor="immediate" className="text-sm font-medium">
                    Immediate
                  </label>
                  <span className="text-xs text-muted-foreground">
                    Receive notifications as they arrive
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="daily"
                    name="deliveryTiming"
                    checked={preferences?.deliveryTiming?.daily}
                    onChange={(e) => handleDeliveryTimingChange('daily', e?.target?.checked)}
                    className="text-primary focus:ring-primary"
                  />
                  <label htmlFor="daily" className="text-sm font-medium">
                    Daily Digest
                  </label>
                  <span className="text-xs text-muted-foreground">
                    Receive a daily summary at 9:00 AM
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="weekly"
                    name="deliveryTiming"
                    checked={preferences?.deliveryTiming?.weekly}
                    onChange={(e) => handleDeliveryTimingChange('weekly', e?.target?.checked)}
                    className="text-primary focus:ring-primary"
                  />
                  <label htmlFor="weekly" className="text-sm font-medium">
                    Weekly Summary
                  </label>
                  <span className="text-xs text-muted-foreground">
                    Receive a weekly summary every Monday
                  </span>
                </div>
              </div>
            </div>

            {/* Quiet Hours */}
            <div>
              <h3 className="text-lg font-medium mb-4">Quiet Hours</h3>
              <div className="space-y-4">
                <Checkbox
                  label="Enable Quiet Hours"
                  description="Pause non-urgent notifications during specified hours"
                  checked={preferences?.quietHours?.enabled}
                  onChange={(e) => handleQuietHoursChange('enabled', e?.target?.checked)}
                />
                
                {preferences?.quietHours?.enabled && (
                  <div className="grid grid-cols-2 gap-4 pl-6">
                    <Input
                      type="time"
                      label="Start Time"
                      value={preferences?.quietHours?.start}
                      onChange={(e) => handleQuietHoursChange('start', e?.target?.value)}
                    />
                    <Input
                      type="time"
                      label="End Time"
                      value={preferences?.quietHours?.end}
                      onChange={(e) => handleQuietHoursChange('end', e?.target?.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              loading={isSaving}
              iconName="Save"
              iconPosition="left"
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;