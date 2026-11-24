import React from 'react';
import { User, UserRole } from '../types/campus';
import { Bell, ShieldCheck, GraduationCap, Briefcase, LogOut, Code2, Sparkles, Building2 } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  onOpenLogin: (roleHint?: UserRole) => void;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount: number;
  onToggleNotifications: () => void;
  onOpenGeminiBot: () => void;
  isFirebaseUser?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenLogin,
  onLogout,
  activeTab,
  setActiveTab,
  unreadCount,
  onToggleNotifications,
  onOpenGeminiBot,
  isFirebaseUser,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Clean single element, no clutter) */}
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
        >
          <img
            src="/assets/gm-university-logo.jpeg"
            alt="GM University, Innovating Minds"
            className="h-12 w-auto object-contain"
          />
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              SmartCampus
            </span>
          </div>
        </button>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('landing')}
            className={`cursor-pointer whitespace-nowrap transition-colors pb-1 ${
              activeTab === 'landing'
                ? 'text-blue-700 border-b-2 border-blue-700 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            Overview
          </button>

          {/* Dynamic role portal access */}
          {currentUser?.role === 'ADMIN' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1.5 pb-1 ${
                activeTab === 'admin'
                  ? 'text-blue-700 border-b-2 border-blue-700 font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Admin Portal
            </button>
          )}

          {currentUser?.role === 'FACULTY' && (
            <button
              onClick={() => setActiveTab('faculty')}
              className={`cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1.5 pb-1 ${
                activeTab === 'faculty'
                  ? 'text-blue-700 border-b-2 border-blue-700 font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4 text-emerald-600" />
              Faculty Portal
            </button>
          )}

          {currentUser?.role === 'STUDENT' && (
            <button
              onClick={() => setActiveTab('student')}
              className={`cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1.5 pb-1 ${
                activeTab === 'student'
                  ? 'text-blue-700 border-b-2 border-blue-700 font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              Student Portal
            </button>
          )}

          <button
            onClick={() => setActiveTab('facilities')}
            className={`cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1.5 pb-1 ${
              activeTab === 'facilities'
                ? 'text-blue-700 border-b-2 border-blue-700 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-slate-500" />
            Facilities & Booking
          </button>

          <button
            onClick={() => setActiveTab('rescue-engine')}
            className={`cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1.5 pb-1 ${
              activeTab === 'rescue-engine'
                ? 'text-blue-700 border-b-2 border-blue-700 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Rescue Engine
          </button>

          <button
            onClick={() => setActiveTab('oop-showcase')}
            className={`cursor-pointer whitespace-nowrap transition-colors flex items-center gap-1.5 pb-1 ${
              activeTab === 'oop-showcase'
                ? 'text-blue-700 border-b-2 border-blue-700 font-semibold'
                : 'hover:text-slate-900'
            }`}
          >
            <Code2 className="w-4 h-4 text-purple-600" />
            OOP & PBL Code
          </button>
        </nav>

        {/* Zone 3: Primary Action / User Profile / Gemini AI */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Gemini AI Chatbot Trigger */}
          <button
            onClick={onOpenGeminiBot}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer group"
            title="Chat with multi-turn Gemini AI Campus Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>Gemini AI</span>
            <span className="hidden lg:inline-block text-[9px] bg-white/20 px-1 py-0.5 rounded font-mono">
              Argon / Flash
            </span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <button
                onClick={onToggleNotifications}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* User Identity Info */}
              <div className="hidden sm:flex flex-col text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  {isFirebaseUser && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" title="Connected to Firebase Auth & Firestore" />
                  )}
                  <span className="text-xs font-semibold text-slate-900 leading-tight">
                    {currentUser.username}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">
                  {currentUser.role} {isFirebaseUser && '• Firebase Auth'}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenLogin('STUDENT')}
                className="hidden sm:inline-block px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                Student Login
              </button>
              <button
                onClick={() => onOpenLogin()}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-blue-800 transition-colors shadow-xs cursor-pointer whitespace-nowrap"
              >
                Sign In / Portal
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
