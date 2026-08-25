// src/components/PrintableReport.tsx
import React from 'react';
import { MonthlyReport } from '../types';

interface PrintableReportProps {
  report: MonthlyReport;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ report }) => {
  if (!report) return null;

  const totalTithes = report.services.reduce((sum, s) => sum + (s.tithes || 0), 0);
  const totalOfferings = report.services.reduce((sum, s) => sum + (s.offerings || 0), 0);
  const grandTotal = totalTithes + totalOfferings;

  return (
    <div id="printable-report" className="w-full bg-white text-black p-4 font-sans text-xs">
      
      {/* MFM Official Letterhead Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-[#003366]">
        <div className="w-16 h-16 flex-shrink-0">
          <img
            src="/mountain-of-fire-and-miracles-ministry-seeklogo.png"
            alt="MFM Logo"
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="text-center flex-1 px-2">
          <h1 className="text-base font-bold text-[#003366] tracking-wide uppercase">
            MOUNTAIN OF FIRE AND MIRACLES MINISTRIES (MFM)
          </h1>
          <p className="text-xs font-bold text-gray-800 uppercase mt-0.5">
            CHAGOUA N'DJAMENA, CHAD
          </p>
          <p className="text-xs font-semibold text-gray-700">
            Tel: +23565871836
          </p>
          <h2 className="text-sm font-bold text-gray-900 mt-2">
            Monthly Activity Report - {report.month} {report.year}
          </h2>
        </div>

        <div className="w-16 h-16 flex-shrink-0" />
      </div>

      {/* Official Activity Report Data Table */}
      {report.services.length > 0 ? (
        <table className="w-full border-collapse border border-gray-400 text-xs">
          <thead>
            <tr className="bg-[#003366] text-white font-bold text-center">
              <th className="border border-gray-400 px-2 py-2">Jour</th>
              <th className="border border-gray-400 px-2 py-2">Date</th>
              <th className="border border-gray-400 px-2 py-2">Preacher</th>
              <th className="border border-gray-400 px-2 py-2 text-left">Message Theme</th>
              <th className="border border-gray-400 px-2 py-2 text-center">M</th>
              <th className="border border-gray-400 px-2 py-2 text-center">W</th>
              <th className="border border-gray-400 px-2 py-2 text-center">C</th>
              <th className="border border-gray-400 px-2 py-2 text-center">Total</th>
              <th className="border border-gray-400 px-2 py-2 text-right">Tithe</th>
              <th className="border border-gray-400 px-2 py-2 text-right">Offering</th>
              <th className="border border-gray-400 px-2 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {report.services.map((service, idx) => {
              const attTotal = service.menAttendance + service.womenAttendance + service.childrenAttendance;
              const incTotal = service.tithes + service.offerings;

              return (
                <tr key={service.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-400 px-2 py-1.5 text-center">
                    {new Date(service.date).toLocaleDateString('en-US', { weekday: 'long' })}
                  </td>
                  <td className="border border-gray-400 px-2 py-1.5 text-center whitespace-nowrap">
                    {new Date(service.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="border border-gray-400 px-2 py-1.5 text-center font-medium">{service.preacher}</td>
                  <td className="border border-gray-400 px-2 py-1.5 text-left">{service.theme}</td>
                  <td className="border border-gray-400 px-2 py-1.5 text-center">{service.menAttendance}</td>
                  <td className="border border-gray-400 px-2 py-1.5 text-center">{service.womenAttendance}</td>
                  <td className="border border-gray-400 px-2 py-1.5 text-center">{service.childrenAttendance}</td>
                  <td className="border border-gray-400 px-2 py-1.5 text-center font-bold">{attTotal}</td>
                  <td className="border border-gray-400 px-2 py-1.5 text-right">{service.tithes > 0 ? service.tithes.toLocaleString() : '-'}</td>
                  <td className="border border-gray-400 px-2 py-1.5 text-right">{service.offerings > 0 ? service.offerings.toLocaleString() : '-'}</td>
                  <td className="border border-gray-400 px-2 py-1.5 text-right font-bold">{incTotal > 0 ? `${incTotal.toLocaleString()} CFA` : '-'}</td>
                </tr>
              );
            })}
            
            {/* Totals Row */}
            <tr className="bg-white font-bold text-gray-900">
              <td colSpan={8} className="border border-gray-400 px-2 py-2 text-right uppercase">
                TOTAL:
              </td>
              <td className="border border-gray-400 px-2 py-2 text-right">
                {totalTithes.toLocaleString()} CFA
              </td>
              <td className="border border-gray-400 px-2 py-2 text-right">
                {totalOfferings.toLocaleString()} CFA
              </td>
              <td className="border border-gray-400 px-2 py-2 text-right">
                {grandTotal.toLocaleString()} CFA
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500 py-4">No services recorded for this month.</p>
      )}

    </div>
  );
};

export default PrintableReport;
