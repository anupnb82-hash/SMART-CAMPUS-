import React from 'react';
import { UserRole } from '../types/campus';
import { 
  Building2, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  BookOpen, 
  ArrowRight,
  CheckCircle2,
  Cpu,
  Clock,
  Layers,
  Database,
  Users
} from 'lucide-react';

interface LandingPageProps {
  onOpenLogin: (roleHint?: UserRole) => void;
  onNavigateTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenLogin, onNavigateTab }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-sky-400 uppercase mb-4">
              <span>Next-Generation University Operations</span>
              <span aria-hidden="true">·</span>
              <span>Java 25 &amp; MySQL Core</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-6 [text-wrap:balance]">
              Unified Digital Campus Platform for Students, Faculty &amp; Administration
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Centralizing academic schedules, research laboratories, high-end computing facilities,
              and intelligent slot recovery through our automated Campus Resource Rescue Engine.
            </p>

            {/* Working Action Portals */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenLogin('STUDENT')}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-xs flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Student Portal</span>
              </button>

              <button
                onClick={() => onOpenLogin('FACULTY')}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-xs flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Briefcase className="w-4 h-4 text-white" />
                <span>Faculty Portal</span>
              </button>

              <button
                onClick={() => onOpenLogin('ADMIN')}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <ShieldCheck className="w-4 h-4 text-slate-300" />
                <span>Admin Login</span>
              </button>

              <button
                onClick={() => onNavigateTab('rescue-engine')}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Rescue Engine</span>
              </button>
            </div>
          </div>

          {/* Real-time KPI Ribbon */}
          <div className="mt-14 pt-8 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-6 text-slate-200">
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">4</div>
              <div className="text-xs text-slate-400 mt-0.5">Academic Departments</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">12+</div>
              <div className="text-xs text-slate-400 mt-0.5">Classrooms &amp; Labs</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">92.4%</div>
              <div className="text-xs text-slate-400 mt-0.5">Resource Utilization Rate</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">ACID Database Integrity</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT THE PLATFORM */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-2">
                Centralized Operations
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-4 [text-wrap:balance]">
                Built from the Ground Up for Real-World Academic Life
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                Universities struggle with fragmented legacy spreadsheets, double-booked lecture halls,
                and underutilized research equipment. Smart Campus unifies all physical and academic
                assets into an intelligent system that ensures zero booking conflicts and maximum facility access.
              </p>

              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Role-based access control protecting student and grade privacy.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Strict JDBC transactions ensuring no double reservations ever occur.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>PriorityQueue waiting lists that automatically recycle cancelled reservation slots.</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Architecture Highlights
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <Cpu className="w-5 h-5 text-blue-600 mb-2" />
                  <div className="text-sm font-bold text-slate-900">Java 25 Backend</div>
                  <div className="text-xs text-slate-500 mt-1">Spring Boot 3, Virtual Threads, and strong OOP models.</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <Database className="w-5 h-5 text-emerald-600 mb-2" />
                  <div className="text-sm font-bold text-slate-900">MySQL 8 Database</div>
                  <div className="text-xs text-slate-500 mt-1">19 normalized tables with relational referential integrity.</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <Clock className="w-5 h-5 text-amber-600 mb-2" />
                  <div className="text-sm font-bold text-slate-900">No-Show Scanner</div>
                  <div className="text-xs text-slate-500 mt-1">15-minute grace period automatically frees abandoned rooms.</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <Layers className="w-5 h-5 text-purple-600 mb-2" />
                  <div className="text-sm font-bold text-slate-900">Pure JDBC Engine</div>
                  <div className="text-xs text-slate-500 mt-1">Zero ORM overhead with parameterized query safety.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PLATFORM FEATURES & SERVICES */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-2">
              Capabilities
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight [text-wrap:balance]">
              Comprehensive Campus Ecosystem
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Integrated modules serving students, faculty mentors, and institutional directors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Student Services */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Student Services</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Course enrollment tracking, assignment deadline reminders, file upload submissions,
                  and direct access to study hall and laboratory reservations.
                </p>
                <div className="space-y-1.5 text-xs text-slate-500">
                  <div>· Real-time academic standing &amp; CGPA calculator</div>
                  <div>· 1-click campus hackathon &amp; seminar registration</div>
                  <div>· Smart waitlist offer alerts with acceptance timer</div>
                </div>
              </div>
              <button
                onClick={() => onOpenLogin('STUDENT')}
                className="mt-6 text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
              >
                <span>Enter Student Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Faculty Services */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Faculty Services</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Curriculum management, roster inspection, assignment publishing, and rubric-based
                  grading with individualized student feedback.
                </p>
                <div className="space-y-1.5 text-xs text-slate-500">
                  <div>· Priority reservation for practical lab exams</div>
                  <div>· Submission evaluation with score dispatch</div>
                  <div>· Direct departmental schedule overview</div>
                </div>
              </div>
              <button
                onClick={() => onOpenLogin('FACULTY')}
                className="mt-6 text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
              >
                <span>Enter Faculty Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Campus Administration */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-4">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Campus Administration</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Complete CRUD management of departments, personnel, classrooms, laboratories,
                  and research equipment with safe deletion dependency guards.
                </p>
                <div className="space-y-1.5 text-xs text-slate-500">
                  <div>· Live aggregate KPI dashboard from MySQL</div>
                  <div>· Booking approvals &amp; audit trail logs</div>
                  <div>· CSV roster and reservation report export</div>
                </div>
              </div>
              <button
                onClick={() => onOpenLogin('ADMIN')}
                className="mt-6 text-xs font-semibold text-slate-800 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <span>Enter Admin Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SIGNATURE INNOVATION SPOTLIGHT: RESCUE ENGINE */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-8 lg:p-12 relative overflow-hidden">
            <div className="max-w-3xl relative z-10">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
                <Sparkles className="w-4 h-4" />
                <span>Signature Innovation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 [text-wrap:balance]">
                Campus Resource Rescue Engine
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Whenever a classroom, computing lab, or workstation reservation is cancelled or abandoned,
                the Rescue Engine activates in milliseconds. It searches a Java PriorityQueue of waiting
                candidates, ranks by urgency and timestamp fairness, and immediately reallocates the slot.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-xs text-slate-200">
                <div className="bg-white/10 p-3.5 rounded-lg border border-white/10">
                  <div className="font-bold text-white mb-1">Smart PriorityQueue</div>
                  <div>Transparent priority score calculation with FIFO tie-breaking.</div>
                </div>
                <div className="bg-white/10 p-3.5 rounded-lg border border-white/10">
                  <div className="font-bold text-white mb-1">No-Show Scanner</div>
                  <div>15-minute check-in grace period automatically frees abandoned rooms.</div>
                </div>
                <div className="bg-white/10 p-3.5 rounded-lg border border-white/10">
                  <div className="font-bold text-white mb-1">Alternative Finder</div>
                  <div>Stream-powered instant recommendations for compatible spaces.</div>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('rescue-engine')}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Launch Interactive Rescue Engine Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-sm font-bold text-white mb-3">Smart Campus System</div>
              <p className="leading-relaxed text-slate-400">
                Undergraduate Object-Oriented Programming with Practice (OOP) Project-Based Learning (PBL).
                Demonstrating Java 25, Spring Boot 3, and MySQL JDBC.
              </p>
            </div>

            <div>
              <div className="text-sm font-bold text-white mb-3">Portals</div>
              <div className="space-y-2">
                <div><button onClick={() => onOpenLogin('STUDENT')} className="hover:text-white cursor-pointer">Student Access</button></div>
                <div><button onClick={() => onOpenLogin('FACULTY')} className="hover:text-white cursor-pointer">Faculty Dashboard</button></div>
                <div><button onClick={() => onOpenLogin('ADMIN')} className="hover:text-white cursor-pointer">Administrator Console</button></div>
              </div>
            </div>

            <div>
              <div className="text-sm font-bold text-white mb-3">Campus Features</div>
              <div className="space-y-2">
                <div><button onClick={() => onNavigateTab('facilities')} className="hover:text-white cursor-pointer">Classrooms &amp; Laboratories</button></div>
                <div><button onClick={() => onNavigateTab('rescue-engine')} className="hover:text-white cursor-pointer">Resource Rescue Engine</button></div>
                <div><button onClick={() => onNavigateTab('oop-showcase')} className="hover:text-white cursor-pointer">Java OOP Code &amp; Architecture</button></div>
              </div>
            </div>

            <div>
              <div className="text-sm font-bold text-white mb-3">Default Credentials</div>
              <div className="space-y-1 font-mono text-[11px] text-slate-300">
                <div>Admin: admin@smartcampus.edu</div>
                <div>Faculty: faculty.smith@smartcampus.edu</div>
                <div>Student: student.alex@smartcampus.edu</div>
                <div className="text-slate-400 mt-2">Passwords: Admin@123 / Faculty@123 / Student@123</div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              &copy; 2026 Smart Campus Integrated Management System. Configurable university edition.
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <span>Java 25</span>
              <span>·</span>
              <span>Spring Boot 3</span>
              <span>·</span>
              <span>MySQL 8 JDBC</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
