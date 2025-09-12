import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const NotificationFilters = ({ 
  filters, 
  onFiltersChange, 
  onSearch, 
  searchQuery,
  isMobile = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(!isMobile);

  const categories = [
    { value: 'all', label: 'All Categories', icon: 'Grid3X3' },
    { value: 'schedule', label: 'Schedule Changes', icon: 'Calendar' },
    { value: 'administrative', label: 'Administrative', icon: 'FileText' },
    { value: 'system', label: 'System Alerts', icon: 'Settings' },
    { value: 'personal', label: 'Personal Messages', icon: 'User' }
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const readStatus = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleDateRangeChange = (key, value) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters?.dateRange,
        [key]: value
      }
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: 'all',
      priority: 'all',
      readStatus: 'all',
      dateRange: {
        from: '',
        to: ''
      }
    });
    onSearch('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.category !== 'all') count++;
    if (filters?.priority !== 'all') count++;
    if (filters?.readStatus !== 'all') count++;
    if (filters?.dateRange?.from || filters?.dateRange?.to) count++;
    if (searchQuery) count++;
    return count;
  };

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Search */}
      <div>
        <Input
          type="search"
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => onSearch(e?.target?.value)}
          className="w-full"
        />
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Category
        </label>
        <div className="grid grid-cols-1 gap-2">
          {categories?.map((category) => (
            <Button
              key={category?.value}
              variant={filters?.category === category?.value ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleFilterChange('category', category?.value)}
              iconName={category?.icon}
              iconPosition="left"
              className="justify-start"
            >
              {category?.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Priority Filter */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Priority
        </label>
        <div className="space-y-1">
          {priorities?.map((priority) => (
            <Button
              key={priority?.value}
              variant={filters?.priority === priority?.value ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleFilterChange('priority', priority?.value)}
              className="w-full justify-start"
            >
              {priority?.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Read Status Filter */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Status
        </label>
        <div className="space-y-1">
          {readStatus?.map((status) => (
            <Button
              key={status?.value}
              variant={filters?.readStatus === status?.value ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleFilterChange('readStatus', status?.value)}
              className="w-full justify-start"
            >
              {status?.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Date Range Filter */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Date Range
        </label>
        <div className="space-y-2">
          <Input
            type="date"
            label="From"
            value={filters?.dateRange?.from}
            onChange={(e) => handleDateRangeChange('from', e?.target?.value)}
          />
          <Input
            type="date"
            label="To"
            value={filters?.dateRange?.to}
            onChange={(e) => handleDateRangeChange('to', e?.target?.value)}
          />
        </div>
      </div>

      {/* Clear Filters */}
      {getActiveFilterCount() > 0 && (
        <Button
          variant="outline"
          onClick={clearFilters}
          iconName="X"
          iconPosition="left"
          className="w-full"
        >
          Clear Filters ({getActiveFilterCount()})
        </Button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName="Filter"
          iconPosition="left"
          className="w-full mb-4"
        >
          Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
        </Button>

        {isExpanded && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="fixed inset-y-0 right-0 w-80 bg-card border-l border-border shadow-lg overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                    iconName="X"
                  />
                </div>
                <FilterContent />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Icon name="Filter" size={20} className="mr-2" />
          Filters
        </h3>
        {getActiveFilterCount() > 0 && (
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
            {getActiveFilterCount()}
          </span>
        )}
      </div>
      <FilterContent />
    </div>
  );
};

export default NotificationFilters;