import React from 'react';
import { Plus, FileText, LayoutDashboard, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut, User } from 'firebase/auth';
import { auth } from '../firebase';

import ChurchLogo from '/mountain-of-fire-and-miracles-ministry-seeklogo.png';

interface HeaderProps {
  onAddNewServiceClick: () => void;
  user?: User | null;
}

export const Header: React.FC<HeaderProps> = ({ onAddNewServiceClick, user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/90 border-b border-slate-800/80 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-1.5 sm:gap-3 group flex-shrink min-w-0">
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center p-1 overflow-hidden">
                <img 
                  src={ChurchLogo} 
                  alt="MFM Logo" 
                  className="w-full h-full object-contain filter drop-shadow" 
                />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h1 className="text-xs sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent leading-tight truncate">
                  <span className="sm:hidden">MFM Region 3</span>
                  <span className="hidden sm:inline">Mfm Central Africa Mega region 3</span>
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  LIVE DB
                </span>
              </div>
              <p className="hidden md:block text-xs font-medium text-slate-400">
                Omnisport Yaoundé, Cameroon
              </p>
            </div>
          </Link>
          
          {/* Main Navigation Links */}
          <nav className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            <Link
              to="/"
              className={`h-9 sm:h-10 px-2.5 sm:px-4 flex items-center justify-center gap-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive('/')
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
              }`}
              title="Dashboard"
            >
              <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <Link
              to="/reports"
              className={`h-9 sm:h-10 px-2.5 sm:px-4 flex items-center justify-center gap-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive('/reports')
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 border border-indigo-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
              }`}
              title="Monthly Reports"
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Reports</span>
            </Link>

            <button
              onClick={onAddNewServiceClick}
              className={`h-9 sm:h-10 px-2.5 sm:px-4 flex items-center justify-center gap-1.5 rounded-xl text-xs sm:text-sm font-bold sm:font-semibold transition-all duration-200 shadow-md ${
                isActive('/add-service')
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/30 border border-emerald-400/40 ring-1 ring-emerald-400/30'
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/30'
              }`}
              title="Add New Service"
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              <span className="inline font-bold whitespace-nowrap">New Service</span>
            </button>

            {/* Logout Button */}
            {user && (
              <button
                onClick={handleLogout}
                className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
                title="Log Out"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};