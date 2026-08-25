import React from 'react';
import { Calendar, Users, DollarSign, TrendingUp, Award, PieChart } from 'lucide-react';
import { Service, MonthlyReport as MonthlyReportType } from '../types';

const formatCurrency = (amount: number, currency: string = 'CFA') => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return `0 ${currency}`;
  }
  return `${amount.toLocaleString()} ${currency}`;
};

interface MonthlyReportProps {
  report: MonthlyReportType;
  onEditService: (service: Service) => void;
}

export const MonthlyReport: React.FC<MonthlyReportProps> = ({ report, onEditService }) => {
  const reportElementId = 'monthly-report-content';

  const churchName = "Eglise Evangélique les Ministères De La Montagne De Feu Et Des Miracles";
  const churchAddress = "Siège Régional N'djamena Zema Rue Après Hôpital Américain";
  const reportTitle = `Rapport Mensuel des Activités De ${report.month} ${report.year} (M.F.M Chagoua Tchad)`;

  const tithesPercent = report.totalIncome > 0 
    ? ((report.totalTithes / report.totalIncome) * 100).toFixed(1) 
    : '0';

  const offeringsPercent = report.totalIncome > 0 
    ? ((report.totalOfferings / report.totalIncome) * 100).toFixed(1) 
    : '0';

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl border border-white/10 overflow-hidden shadow-2xl max-w-full" id={reportElementId}>
      
      {/* Church Header Banner */}
      <div className="p-5 sm:p-8 border-b border-white/10 bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="text-center relative z-10 max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex p-2 bg-white/10 rounded-2xl border border-white/20 shadow-xl backdrop-blur-md mb-1">
            <img 
              src="/mountain-of-fire-and-miracles-ministry-seeklogo.png" 
              alt="MFM Logo" 
              className="w-10 h-10 sm:w-14 sm:h-14 object-contain filter drop-shadow-md" 
            />
          </div>
          
          <h1 className="text-base sm:text-2xl font-black text-white tracking-tight uppercase leading-snug">
            {churchName}
          </h1>
          
          <p className="text-[11px] sm:text-sm text-slate-300 font-medium">
            {churchAddress}
          </p>

          <div className="pt-1">
            <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold bg-gradient-to-r from-indigo-500/30 to-violet-500/30 text-indigo-200 border border-indigo-400/30 shadow-lg leading-tight">
              {reportTitle}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
        
        {/* KPI Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="bg-slate-900/60 p-3.5 sm:p-5 rounded-2xl border border-white/10 relative">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 sm:p-2 rounded-xl bg-blue-500/15 text-blue-400">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase">Services</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-white">{report.totalServices}</p>
          </div>

          <div className="bg-slate-900/60 p-3.5 sm:p-5 rounded-2xl border border-white/10 relative">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase">Attendance</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-emerald-400">{report.totalAttendance.toLocaleString()}</p>
          </div>

          <div className="bg-slate-900/60 p-3.5 sm:p-5 rounded-2xl border border-white/10 relative">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 sm:p-2 rounded-xl bg-purple-500/15 text-purple-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase">Avg. Att.</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-purple-300">{report.averageAttendance}</p>
          </div>

          <div className="bg-slate-900/60 p-3.5 sm:p-5 rounded-2xl border border-white/10 relative">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 sm:p-2 rounded-xl bg-teal-500/15 text-teal-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase">Total Income</span>
            </div>
            <p className="text-sm sm:text-xl font-bold text-teal-300 truncate">{formatCurrency(report.totalIncome)}</p>
          </div>

        </div>

        {/* Financial Distribution Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-purple-950/40 to-slate-900 p-4 sm:p-6 rounded-2xl border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <PieChart className="w-4 h-4" /> Tithes (Dîme)
              </span>
              <span className="text-[10px] sm:text-xs bg-purple-500/20 text-purple-300 font-semibold px-2 py-0.5 rounded-full border border-purple-500/30">
                {tithesPercent}%
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-white">{formatCurrency(report.totalTithes)}</p>
          </div>

          <div className="bg-gradient-to-br from-teal-950/40 to-slate-900 p-4 sm:p-6 rounded-2xl border border-teal-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                <PieChart className="w-4 h-4" /> Offerings (Offrande)
              </span>
              <span className="text-[10px] sm:text-xs bg-teal-500/20 text-teal-300 font-semibold px-2 py-0.5 rounded-full border border-teal-500/30">
                {offeringsPercent}%
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-white">{formatCurrency(report.totalOfferings)}</p>
          </div>
        </div>

        {/* Services Detail Table */}
        <div className="space-y-3">
          <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" />
            Detailed Service Records
          </h3>

          {report.services.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs sm:text-sm bg-slate-900/50 rounded-2xl border border-white/5">
              No service records registered for {report.month} {report.year}.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/10 -mx-1 sm:mx-0">
              <table className="w-full text-xs text-left min-w-[700px]">
                <thead>
                  <tr className="bg-slate-950 text-slate-300 font-semibold border-b border-white/10 uppercase tracking-wider">
                    <th className="px-3 py-3">Day</th>
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3">Preacher</th>
                    <th className="px-4 py-3">Sermon Theme</th>
                    <th className="px-2 py-3 text-center text-blue-400">M</th>
                    <th className="px-2 py-3 text-center text-pink-400">W</th>
                    <th className="px-2 py-3 text-center text-amber-400">C</th>
                    <th className="px-3 py-3 text-center text-emerald-400">Att. Total</th>
                    <th className="px-3 py-3 text-right text-purple-300">Tithes</th>
                    <th className="px-3 py-3 text-right text-teal-300">Offerings</th>
                    <th className="px-4 py-3 text-right text-white">Total Income</th>
                    <th className="px-3 py-3 text-center no-print">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-slate-900/40">
                  {report.services.map((service) => {
                    const attTotal = service.menAttendance + service.womenAttendance + service.childrenAttendance;
                    const incTotal = service.tithes + service.offerings;

                    return (
                      <tr key={service.id} className="hover:bg-white/[0.04] transition-colors">
                        <td className="px-3 py-3 text-slate-300 font-medium">
                          {new Date(service.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </td>
                        <td className="px-3 py-3 text-slate-300 whitespace-nowrap">
                          {service.date}
                        </td>
                        <td className="px-3 py-3 font-semibold text-white">
                          {service.preacher}
                        </td>
                        <td className="px-4 py-3 text-slate-200 font-medium">
                          {service.theme}
                        </td>
                        <td className="px-2 py-3 text-center text-slate-300 font-mono">{service.menAttendance}</td>
                        <td className="px-2 py-3 text-center text-slate-300 font-mono">{service.womenAttendance}</td>
                        <td className="px-2 py-3 text-center text-slate-300 font-mono">{service.childrenAttendance}</td>
                        <td className="px-3 py-3 text-center font-bold text-emerald-300 font-mono">{attTotal}</td>
                        <td className="px-3 py-3 text-right text-purple-300 font-mono">{service.tithes.toLocaleString()}</td>
                        <td className="px-3 py-3 text-right text-teal-300 font-mono">{service.offerings.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-extrabold text-white font-mono">{incTotal.toLocaleString()} CFA</td>
                        <td className="px-3 py-3 text-center no-print">
                          <button
                            onClick={() => onEditService(service)}
                            className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] transition-colors"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-950 font-bold text-white border-t-2 border-white/20">
                    <td className="px-4 py-4 uppercase" colSpan={4}>MONTHLY TOTALS</td>
                    <td className="px-2 py-4 text-center text-blue-300 font-mono">{report.totalMenAttendance}</td>
                    <td className="px-2 py-4 text-center text-pink-300 font-mono">{report.totalWomenAttendance}</td>
                    <td className="px-2 py-4 text-center text-amber-300 font-mono">{report.totalChildrenAttendance}</td>
                    <td className="px-3 py-4 text-center text-emerald-400 font-mono text-sm">{report.totalAttendance}</td>
                    <td className="px-3 py-4 text-right text-purple-300 font-mono">{report.totalTithes.toLocaleString()} CFA</td>
                    <td className="px-3 py-4 text-right text-teal-300 font-mono">{report.totalOfferings.toLocaleString()} CFA</td>
                    <td className="px-4 py-4 text-right text-white font-mono text-sm">{report.totalIncome.toLocaleString()} CFA</td>
                    <td className="no-print"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};