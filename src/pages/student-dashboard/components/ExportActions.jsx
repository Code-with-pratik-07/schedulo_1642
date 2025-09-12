import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

const ExportActions = ({ onExportPDF, onExportICal }) => {
  const [isExporting, setIsExporting] = useState({ pdf: false, ical: false });

  const handleExportPDF = async () => {
    setIsExporting(prev => ({ ...prev, pdf: true }));
    try {
      await onExportPDF();
    } finally {
      setTimeout(() => {
        setIsExporting(prev => ({ ...prev, pdf: false }));
      }, 2000);
    }
  };

  const handleExportICal = async () => {
    setIsExporting(prev => ({ ...prev, ical: true }));
    try {
      await onExportICal();
    } finally {
      setTimeout(() => {
        setIsExporting(prev => ({ ...prev, ical: false }));
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        variant="outline"
        onClick={handleExportPDF}
        loading={isExporting?.pdf}
        iconName="Download"
        iconPosition="left"
        iconSize={16}
        className="flex-1 sm:flex-none"
      >
        Export PDF
      </Button>
      <Button
        variant="outline"
        onClick={handleExportICal}
        loading={isExporting?.ical}
        iconName="Calendar"
        iconPosition="left"
        iconSize={16}
        className="flex-1 sm:flex-none"
      >
        Export iCal
      </Button>
    </div>
  );
};

export default ExportActions;