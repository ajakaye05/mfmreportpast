import React, { useState } from 'react';
import { Printer, FileText, Download, Loader2 } from 'lucide-react';
import { MonthlyReport } from '../types';
import { printReport, exportToPDF, exportToDocx } from '../utils/exportUtils';

interface ExportButtonsProps {
  report: MonthlyReport;
  reportElementId: string;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ report, reportElementId }) => {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handlePrint = () => {
    printReport();
  };

  const handlePDFExport = async () => {
    setIsExporting('pdf');
    try {
      await exportToPDF(reportElementId, `${report.month}_${report.year}_Report.pdf`);
    } finally {
      setIsExporting(null);
    }
  };

  const handleDocxExport = async () => {
    setIsExporting('docx');
    try {
      await exportToDocx(report);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="flex justify-center sm:justify-end gap-3">
      <button
        onClick={handlePrint}
        className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center sm:px-4 sm:py-2 gap-2 text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!!isExporting}
      >
        <Printer className="w-4 h-4" />
        <span className="hidden sm:inline">Print Report</span>
      </button>

      <button
        onClick={handlePDFExport}
        disabled={isExporting === 'pdf'}
        className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center sm:px-4 sm:py-2 gap-2 text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting === 'pdf' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">Export PDF</span>
      </button>

      <button
        onClick={handleDocxExport}
        disabled={isExporting === 'docx'}
        className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center sm:px-4 sm:py-2 gap-2 text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting === 'docx' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">Export DOCX</span>
      </button>
    </div>
  );
};