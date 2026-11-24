import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  FlaskConical, 
  Laptop, 
  Search, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { Classroom, Laboratory, Equipment, Booking, User } from '../types/campus';

interface FacilitiesPageProps {
  classrooms: Classroom[];
  laboratories: Laboratory[];
  equipment: Equipment[];
  bookings: Booking[];
  currentUser: User | null;
  onBookFacility: (resourceType: 'CLASSROOM' | 'LABORATORY' | 'EQUIPMENT', resourceId: number) => void;
  onOpenRescueHub: () => void;
}

export const FacilitiesPage: React.FC<FacilitiesPageProps> = ({
  classrooms,
  laboratories,
  equipment,
  bookings,
  currentUser,
  onBookFacility,
  onOpenRescueHub,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'CLASSROOM' | 'LAB' | 'EQUIPMENT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'OCCUPIED'>('ALL');

  // Grouped facilities with calculated current occupancy
  const allFacilities = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const isOccupiedNow = (resType: string, resId: number) => {
      return bookings.some(b => {
        if (b.status !== 'CONFIRMED') return false;
        if (b.resourceType !== resType || b.resourceId !== resId) return false;
        if (b.date !== todayStr) return false;
        const [sh, sm] = b.startTime.split(':').map(Number);
        const [eh, em] = b.endTime.split(':').map(Number);
        const sMin = sh * 60 + sm;
        const eMin = eh * 60 + em;
        return currentMinutes >= sMin && currentMinutes < eMin;
      });
    };

    const cList = classrooms.map(c => ({
      ...c,
      category: 'CLASSROOM' as const,
      isOccupied: isOccupiedNow('CLASSROOM', c.id),
      displayName: c.roomNumber,
      capacityText: `${c.capacity} Students`,
      subText: `${c.building} • Floor ${c.floor}`,
    }));

    const lList = laboratories.map(l => ({
      ...l,
      category: 'LABORATORY' as const,
      isOccupied: isOccupiedNow('LABORATORY', l.id),
      displayName: l.name,
      capacityText: `${l.capacity} Workstations`,
      subText: `${l.building} • Dept: ${l.departmentName} • Safety: ${l.safetyLevel}`,
    }));

    const eList = equipment.map(e => ({
      ...e,
      category: 'EQUIPMENT' as const,
      isOccupied: isOccupiedNow('EQUIPMENT', e.id),
      displayName: e.name,
      capacityText: `Code: ${e.code}`,
      subText: `${e.category} • Condition: ${e.conditionStatus} • Available: ${e.availableQuantity}/${e.totalQuantity}`,
    }));

    return [...cList, ...lList, ...eList];
  }, [classrooms, laboratories, equipment, bookings]);

  const filteredFacilities = useMemo(() => {
    return allFacilities.filter(f => {
      if (activeTab === 'CLASSROOM' && f.category !== 'CLASSROOM') return false;
      if (activeTab === 'LAB' && f.category !== 'LABORATORY') return false;
      if (activeTab === 'EQUIPMENT' && f.category !== 'EQUIPMENT') return false;

      if (statusFilter === 'AVAILABLE' && f.isOccupied) return false;
      if (statusFilter === 'OCCUPIED' && !f.isOccupied) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = f.displayName.toLowerCase().includes(q);
        const matchSub = f.subText.toLowerCase().includes(q);
        if (!matchName && !matchSub) return false;
      }

      return true;
    });
  }, [allFacilities, activeTab, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
            <Building2 className="w-3.5 h-3.5" />
            <span>Campus Infrastructure Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Smart Facilities & Research Labs
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            Real-time IoT occupancy tracking, automated collision avoidance, and Rescue Engine waitlist protection across lecture halls, specialized laboratories, and scientific instruments.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenRescueHub}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Open Rescue Engine Simulator
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Polymorphic <code className="font-mono text-indigo-300">Bookable</code> Interface</span>
            </div>
          </div>
        </div>

        <div className="absolute right-6 -bottom-8 opacity-10 pointer-events-none hidden lg:block">
          <Layers className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Resources ({allFacilities.length})
          </button>
          <button
            onClick={() => setActiveTab('CLASSROOM')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'CLASSROOM'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Classrooms ({classrooms.length})
          </button>
          <button
            onClick={() => setActiveTab('LAB')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'LAB'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            Laboratories ({laboratories.length})
          </button>
          <button
            onClick={() => setActiveTab('EQUIPMENT')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'EQUIPMENT'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            Equipment ({equipment.length})
          </button>
        </div>

        {/* Search & Status filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by room, equipment, building..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Status</option>
            <option value="AVAILABLE">Available Now</option>
            <option value="OCCUPIED">In Session</option>
          </select>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFacilities.map((fac) => {
          const isClassroom = fac.category === 'CLASSROOM';
          const isLab = fac.category === 'LABORATORY';
          const isEquip = fac.category === 'EQUIPMENT';

          return (
            <div
              key={`${fac.category}-${fac.id}`}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isClassroom 
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                        : isLab 
                        ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
                    }`}>
                      {isClassroom ? <Building2 className="w-4 h-4" /> : isLab ? <FlaskConical className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {fac.displayName}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400">
                        {fac.capacityText}
                      </span>
                    </div>
                  </div>

                  {/* Status pill */}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                    fac.isOccupied
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50'
                      : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${fac.isOccupied ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    {fac.isOccupied ? 'Occupied' : 'Available'}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {fac.subText}
                </p>

                {/* Features & metadata */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                  {isClassroom && (
                    <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                      <span>Equipped with:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {fac.hasProjector ? 'Projector, ' : ''}{fac.hasSmartboard ? 'Smartboard, ' : ''}{fac.hasAirConditioning ? 'Air Conditioning' : 'Standard Ventilation'}
                      </span>
                    </div>
                  )}

                  {isLab && (
                    <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                      <span>Lab Specifications:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        Safety: {fac.safetyLevel} • {fac.departmentName}
                      </span>
                    </div>
                  )}

                  {isEquip && (
                    <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                      <span>Inventory Condition:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {fac.conditionStatus}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  {fac.category}
                </span>

                <button
                  onClick={() => onBookFacility(fac.category, fac.id)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Reserve Slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
