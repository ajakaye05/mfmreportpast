import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { ChevronLeft, ChevronRight, Calendar, FileText, LogOut, Printer, Download } from 'lucide-react';
import { Service } from '../types';
import { generateMonthlyReport } from '../utils/reportGenerator';
import { getMonthName } from '../utils/dateUtils';
import { MonthlyReport } from './MonthlyReport';
import PrintableReport from './PrintableReport';
import { exportToPDF } from '../utils/exportUtils';

interface ReportsViewProps {
  services: Service[];
  onEditService: (service: Service) => void;
}

const getCurrentMonth = () => {
  const date = new Date();
  return { month: date.getMonth(), year: date.getFullYear() };
};

export const ReportsView: React.FC<ReportsViewProps> = ({ services, onEditService }) => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const report = generateMonthlyReport(services, selectedMonth.month, selectedMonth.year);

  const handlePrevMonth = () => {
    setSelectedMonth(prev => ({
      month: prev.month === 0 ? 11 : prev.month - 1,
      year: prev.month === 0 ? prev.year - 1 : prev.year,
    }));
  };

  const handleNextMonth = () => {
    setSelectedMonth(prev => ({
      month: prev.month === 11 ? 0 : prev.month + 1,
      year: prev.month === 11 ? prev.year + 1 : prev.year,
    }));
  };

  const handleExportPDF = () => {
    const reportFilename = `${getMonthName(selectedMonth.month)}_${selectedMonth.year}_Report.pdf`;
    exportToPDF(report, reportFilename);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      
      {/* Navigation & Control Toolbar */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 shadow-2xl print:hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
          
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/30 flex-shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span>Rapports Mensuels</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Inspect monthly attendance, financial breakdown, tithes, and offerings.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
            {/* Month Switcher Pill */}
            <div className="flex items-center justify-between bg-slate-950/70 p-1.5 rounded-2xl border border-white/10 w-full sm:w-auto">
              <button
                onClick={handlePrevMonth}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <div className="px-3 sm:px-4 py-0.5 text-center">
                <span className="text-[10px] font-semibold text-indigo-300 block uppercase tracking-wider">Viewing</span>
                <span className="text-xs sm:text-sm font-bold text-white whitespace-nowrap">
                  {getMonthName(selectedMonth.month)} {selectedMonth.year}
                </span>
              </div>
              
              <button
                onClick={handleNextMonth}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Export Buttons */}
            <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold text-xs border border-white/10 shadow transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-slate-300" />
                <span>Imprimer</span>
              </button>
              
              <button
                onClick={handleExportPDF}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl font-semibold text-xs shadow-lg shadow-red-600/20 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Screen View (Web Dashboard) */}
      <div className="print:hidden">
        <MonthlyReport report={report} onEditService={onEditService} />
      </div>

      {/* Official Print View (Only renders when printing) */}
      <div className="hidden print:block">
        <PrintableReport report={report} />
      </div>

    </div>
  );
};