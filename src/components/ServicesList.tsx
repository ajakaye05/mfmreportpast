import React, { useState } from 'react';
import { Calendar, User, MessageCircle, Users, DollarSign, Trash2, Edit, Search, Filter, TrendingUp, Sparkles, Plus } from 'lucide-react';
import { Service } from '../types';
import { formatDate, formatCurrency } from '../utils/dateUtils';
import { Link } from 'react-router-dom';

interface ServicesListProps {
  services: Service[];
  onDeleteService: (id: string) => void;
  onEditService: (service: Service) => void;
}

export const ServicesList: React.FC<ServicesListProps> = ({ services, onDeleteService, onEditService }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter services by search term (preacher, theme, or date)
  const filteredServices = services.filter((service) => {
    const term = searchTerm.toLowerCase();
    return (
      service.preacher.toLowerCase().includes(term) ||
      service.theme.toLowerCase().includes(term) ||
      service.date.includes(term)
    );
  });

  // Calculate totals for quick overview dashboard
  const totalAttendance = services.reduce(
    (acc, curr) => acc + curr.menAttendance + curr.womenAttendance + curr.childrenAttendance,
    0
  );
  const totalTithes = services.reduce((acc, curr) => acc + (curr.tithes || 0), 0);
  const totalOfferings = services.reduce((acc, curr) => acc + (curr.offerings || 0), 0);
  const totalRevenue = totalTithes + totalOfferings;

  if (services.length === 0) {
    return (
      <div className="glass-card-light rounded-3xl p-10 text-center border border-slate-700/50 shadow-2xl">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-indigo-500/10 text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20 shadow-inner">
            <Calendar className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-100 mb-2">No Services Recorded Yet</h3>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Get started by recording your church service attendance, preacher information, tithes, and offerings.
          </p>
          <Link
            to="/add-service"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/30 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Add First Service
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top KPI Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Services */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Services</p>
              <h4 className="text-2xl font-black text-white mt-1">{services.length}</h4>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-indigo-300 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recorded in database</span>
          </div>
        </div>

        {/* Total Attendance */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Attendees</p>
              <h4 className="text-2xl font-black text-emerald-400 mt-1">{totalAttendance.toLocaleString()}</h4>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400 font-medium">
            Avg. ~{Math.round(totalAttendance / (services.length || 1))} per service
          </div>
        </div>

        {/* Total Tithes */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tithes</p>
              <h4 className="text-xl font-bold text-purple-300 mt-1">{formatCurrency(totalTithes)}</h4>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-purple-400 font-medium">
            Dîme total collection
          </div>
        </div>

        {/* Total Revenue */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-teal-500/40 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Collection</p>
              <h4 className="text-xl font-bold text-teal-300 mt-1">{formatCurrency(totalRevenue)}</h4>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-teal-400 font-medium">
            Tithes + Offerings
          </div>
        </div>
      </div>

      {/* Main List Container */}
      <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        
        {/* Filter & Search Toolbar */}
        <div className="p-6 border-b border-white/10 bg-slate-900/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Recent Church Services
              <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                {filteredServices.length}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Manage, search, and edit recorded service entries</p>
          </div>

          {/* Search Input Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search preacher, theme..."
              className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs transition-all duration-200"
            />
          </div>
        </div>

        {/* Services List Feed */}
        <div className="divide-y divide-white/5">
          {filteredServices.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No services found matching "{searchTerm}".
            </div>
          ) : (
            filteredServices.map((service) => {
              const totalAtt = service.menAttendance + service.womenAttendance + service.childrenAttendance;
              const totalCol = service.tithes + service.offerings;

              return (
                <div 
                  key={service.id} 
                  className="p-6 hover:bg-white/[0.03] transition-colors duration-200 group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    
                    {/* Left Details */}
                    <div className="space-y-3 flex-1">
                      
                      {/* Date Header Badge */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(service.date)}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-slate-300 text-xs font-medium">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-white">{service.preacher}</span>
                        </div>
                      </div>

                      {/* Service Theme */}
                      <div className="flex items-start gap-2 text-slate-200 text-sm font-semibold">
                        <MessageCircle className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <span className="leading-snug text-slate-100">{service.theme}</span>
                      </div>

                      {/* Attendance Pills Breakdown */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
                          <Users className="w-3.5 h-3.5" /> Attendance:
                        </span>
                        
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          Men: {service.menAttendance}
                        </span>
                        
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-500/20 text-pink-300 border border-pink-500/30">
                          Women: {service.womenAttendance}
                        </span>

                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Children: {service.childrenAttendance}
                        </span>

                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 ml-auto sm:ml-2">
                          Total: {totalAtt}
                        </span>
                      </div>
                    </div>

                    {/* Right Financials & Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5">
                      
                      {/* Financial Badges */}
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="bg-slate-800/80 p-3 rounded-xl border border-white/5 min-w-[120px]">
                          <span className="text-slate-400 block mb-0.5 font-medium">Tithes (Dîme)</span>
                          <span className="font-bold text-purple-300 text-sm">{formatCurrency(service.tithes)}</span>
                        </div>

                        <div className="bg-slate-800/80 p-3 rounded-xl border border-white/5 min-w-[120px]">
                          <span className="text-slate-400 block mb-0.5 font-medium">Offerings (Offrande)</span>
                          <span className="font-bold text-teal-300 text-sm">{formatCurrency(service.offerings)}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEditService(service)}
                          className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-indigo-600 transition-all duration-200 border border-white/10 hover:border-indigo-400/50 shadow"
                          title="Edit Service Record"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDeleteService(service.id)}
                          className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-red-400 hover:bg-red-500/20 transition-all duration-200 border border-white/10 hover:border-red-500/30 shadow"
                          title="Delete Service Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};