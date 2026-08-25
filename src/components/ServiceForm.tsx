import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, set, push, update, remove } from "firebase/database";
import { db } from '../firebase';
import { Plus, Calendar, User, MessageCircle, Users, DollarSign, Trash2, ArrowLeft, Save, Sparkles, AlertCircle } from 'lucide-react';
import { Service } from '../types';

interface ServiceFormProps {
  onCancel: () => void;
  editingService?: Service;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ onCancel, editingService }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    preacher: '',
    theme: '',
    menAttendance: '',
    womenAttendance: '',
    childrenAttendance: '',
    tithes: '',
    offerings: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (editingService) {
      setFormData({
        date: editingService.date,
        preacher: editingService.preacher,
        theme: editingService.theme,
        menAttendance: editingService.menAttendance.toString(),
        womenAttendance: editingService.womenAttendance.toString(),
        childrenAttendance: editingService.childrenAttendance.toString(),
        tithes: editingService.tithes.toString(),
        offerings: editingService.offerings.toString()
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        preacher: '',
        theme: '',
        menAttendance: '',
        womenAttendance: '',
        childrenAttendance: '',
        tithes: '',
        offerings: ''
      });
    }
  }, [editingService]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Real-time calculations
  const totalAtt = (parseInt(formData.menAttendance) || 0) + 
                   (parseInt(formData.womenAttendance) || 0) + 
                   (parseInt(formData.childrenAttendance) || 0);

  const totalFin = (parseFloat(formData.tithes) || 0) + 
                   (parseFloat(formData.offerings) || 0);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.preacher.trim()) newErrors.preacher = 'Preacher name is required';
    if (!formData.theme.trim()) newErrors.theme = 'Service theme is required';
    if (formData.menAttendance === '' || parseInt(formData.menAttendance) < 0) {
      newErrors.menAttendance = 'Men count required';
    }
    if (formData.womenAttendance === '' || parseInt(formData.womenAttendance) < 0) {
      newErrors.womenAttendance = 'Women count required';
    }
    if (formData.childrenAttendance === '' || parseInt(formData.childrenAttendance) < 0) {
      newErrors.childrenAttendance = 'Children count required';
    }
    if (formData.tithes === '' || parseFloat(formData.tithes) < 0) {
      newErrors.tithes = 'Tithes amount required';
    }
    if (formData.offerings === '' || parseFloat(formData.offerings) < 0) {
      newErrors.offerings = 'Offerings amount required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitError('');
    setSubmitting(true);

    const menAttendance = parseInt(formData.menAttendance) || 0;
    const womenAttendance = parseInt(formData.womenAttendance) || 0;
    const childrenAttendance = parseInt(formData.childrenAttendance) || 0;
    const tithes = parseFloat(formData.tithes) || 0;
    const offerings = parseFloat(formData.offerings) || 0;

    const dateObj = new Date(formData.date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;

    const serviceData = {
      date: formData.date,
      year,
      month,
      preacher: formData.preacher.trim(),
      theme: formData.theme.trim(),
      menAttendance,
      womenAttendance,
      childrenAttendance,
      tithes,
      offerings,
      totalAttendance: menAttendance + womenAttendance + childrenAttendance,
      totalCollection: tithes + offerings,
      createdAt: editingService?.createdAt || new Date().toISOString()
    };

    try {
      if (editingService?.id) {
        const serviceRef = ref(db, `services/${editingService.year}/${editingService.month}/${editingService.id}`);
        await update(serviceRef, serviceData);
      } else {
        const servicesRef = ref(db, `services/${year}/${month}`);
        const newServiceRef = push(servicesRef);
        await set(newServiceRef, serviceData);
      }
      navigate('/reports');
    } catch (error: any) {
      console.error("Failed to save service data", error);
      if (error?.message?.includes('PERMISSION_DENIED') || error?.code === 'PERMISSION_DENIED') {
        setSubmitError("Firebase Database Permission Denied: Please update your Realtime Database Rules in Firebase Console to allow read & write access.");
      } else {
        setSubmitError(error?.message || "Failed to save record. Please check your network & Firebase Database setup.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };


  const handleDelete = async () => {
    if (!editingService?.id) return;

    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const serviceRef = ref(db, `services/${editingService.year}/${editingService.month}/${editingService.id}`);
        await remove(serviceRef);
        navigate('/reports');
      } catch (error) {
        console.error("Failed to delete service data", error);
      }
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl space-y-8">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              {editingService ? 'Edit Service Record' : 'Record New Service'}
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Enter service attendance, sermon details, and financial reports</p>
          </div>
        </div>

        {/* Live Calculation Counters Badge */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="bg-indigo-500/15 border border-indigo-500/30 px-3.5 py-1.5 rounded-xl text-right">
            <span className="text-[10px] text-indigo-300 font-semibold block uppercase">Live Attendees</span>
            <span className="text-sm font-bold text-white">{totalAtt}</span>
          </div>

          <div className="bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl text-right">
            <span className="text-[10px] text-emerald-300 font-semibold block uppercase">Total Collection</span>
            <span className="text-sm font-bold text-emerald-300">{totalFin.toLocaleString()} CFA</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Error Alert Banner */}
        {submitError && (
          <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm flex items-start gap-3 animate-pulse-subtle">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white mb-0.5">Database Error</p>
              <p>{submitError}</p>
            </div>
          </div>
        )}

        {/* Section 1: General Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            Service Overview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Service Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl glass-input text-sm ${
                  errors.date ? 'border-red-500' : ''
                }`}
              />
              {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Preacher / Speaker
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.preacher}
                  onChange={(e) => handleChange('preacher', e.target.value)}
                  placeholder="e.g. Pastor Paul Enenche"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm ${
                    errors.preacher ? 'border-red-500' : ''
                  }`}
                />
              </div>
              {errors.preacher && <p className="text-red-400 text-xs mt-1">{errors.preacher}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Sermon Theme / Topic
            </label>
            <div className="relative">
              <MessageCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={formData.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                placeholder="e.g. Unlocking Kingdom Breakthroughs"
                className={`w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm ${
                  errors.theme ? 'border-red-500' : ''
                }`}
              />
            </div>
            {errors.theme && <p className="text-red-400 text-xs mt-1">{errors.theme}</p>}
          </div>
        </div>

        {/* Section 2: Attendance Breakdown */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              Attendance Breakdown
            </h3>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Total: {totalAtt} attendees
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Men (M)</label>
              <input
                type="number"
                value={formData.menAttendance}
                onChange={(e) => handleChange('menAttendance', e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
              />
              {errors.menAttendance && <p className="text-red-400 text-xs mt-1">{errors.menAttendance}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Women (W)</label>
              <input
                type="number"
                value={formData.womenAttendance}
                onChange={(e) => handleChange('womenAttendance', e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
              />
              {errors.womenAttendance && <p className="text-red-400 text-xs mt-1">{errors.womenAttendance}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Children (C)</label>
              <input
                type="number"
                value={formData.childrenAttendance}
                onChange={(e) => handleChange('childrenAttendance', e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
              />
              {errors.childrenAttendance && <p className="text-red-400 text-xs mt-1">{errors.childrenAttendance}</p>}
            </div>
          </div>
        </div>

        {/* Section 3: Financial Collections */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-400" />
              Financial Collections (CFA)
            </h3>
            <span className="text-xs text-purple-400 font-semibold bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
              Collection: {totalFin.toLocaleString()} CFA
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Dîme (Tithes) - CFA
              </label>
              <input
                type="number"
                value={formData.tithes}
                onChange={(e) => handleChange('tithes', e.target.value)}
                placeholder="0"
                min="0"
                step="1"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
              />
              {errors.tithes && <p className="text-red-400 text-xs mt-1">{errors.tithes}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Offrande (Offerings) - CFA
              </label>
              <input
                type="number"
                value={formData.offerings}
                onChange={(e) => handleChange('offerings', e.target.value)}
                placeholder="0"
                min="0"
                step="1"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
              />
              {errors.offerings && <p className="text-red-400 text-xs mt-1">{errors.offerings}</p>}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-white/10">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{editingService ? 'Update Service Record' : 'Save Service Record'}</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>

          {editingService && (
            <button
              type="button"
              onClick={handleDelete}
              className="w-full sm:w-auto py-3.5 px-6 rounded-xl font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-colors flex items-center justify-center gap-2 ml-auto"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};



