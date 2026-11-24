import React, { useState } from 'react';
import {
  Booking,
  WaitingListEntry,
  SlotOffer,
  Classroom,
  Laboratory,
  Equipment,
} from '../types/campus';
import {
  recommendAlternativeClassrooms,
  calculateUtilizationMetrics,
} from '../utils/rescueEngine';
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface RescueEngineHubProps {
  bookings: Booking[];
  waitingList: WaitingListEntry[];
  slotOffers: SlotOffer[];
  classrooms: Classroom[];
  laboratories: Laboratory[];
  equipment: Equipment[];
  onCancelBookingAndTriggerRecovery: (bookingId: number) => void;
  onAcceptOffer: (offerId: number) => void;
  onDeclineOffer: (offerId: number) => void;
  onSimulateNoShow: (bookingId: number) => void;
  onCheckIn: (bookingId: number) => void;
}

export const RescueEngineHub: React.FC<RescueEngineHubProps> = ({
  bookings,
  waitingList,
  slotOffers,
  classrooms,
  laboratories,
  equipment,
  onCancelBookingAndTriggerRecovery,
  onAcceptOffer,
  onDeclineOffer,
  onSimulateNoShow,
  onCheckIn,
}) => {
  const [selectedRoomIdForAlt, setSelectedRoomIdForAlt] = useState<number>(classrooms[0]?.id || 1);
  const [minAltCapacity, setMinAltCapacity] = useState<number>(45);

  const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED');
  const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED');
  const noShowBookings = bookings.filter((b) => b.status === 'NO_SHOW');
  const activeWaitlist = waitingList.filter((w) => w.status === 'WAITING');
  const acceptedOffers = slotOffers.filter((o) => o.status === 'ACCEPTED');

  // Calculate live utilization metrics
  const { utilizationRate, recoveryEfficiencyPct } = calculateUtilizationMetrics(
    bookings.length,
    confirmedBookings.length,
    acceptedOffers.length,
    Math.max(1, noShowBookings.length + cancelledBookings.length)
  );

  // Compute alternative recommendations using pure logic function
  const alternativeRooms = recommendAlternativeClassrooms(
    classrooms.map((c) => ({
      id: c.id,
      roomNumber: c.roomNumber,
      building: c.building,
      capacity: c.capacity,
      hasProjector: c.hasProjector,
      hasAirConditioning: c.hasAirConditioning,
      status: c.status,
    })),
    selectedRoomIdForAlt,
    minAltCapacity
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Signature Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-8 shadow-sm border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Signature Innovation PBL Module</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Campus Resource Rescue Engine
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              An intelligent Java-based allocation and recovery engine that eliminates unused campus resources,
              reclaims cancelled and abandoned slots, and dispatches real-time offers through transparent priority queues.
            </p>
          </div>

          <div className="flex flex-row lg:flex-col gap-4 text-xs font-mono shrink-0">
            <div className="bg-white/10 p-3 rounded-lg border border-white/10 text-center">
              <div className="text-xl font-bold text-amber-400 tabular-nums">{utilizationRate}%</div>
              <div className="text-[10px] text-slate-300 mt-0.5">Utilization Rate</div>
            </div>
            <div className="bg-white/10 p-3 rounded-lg border border-white/10 text-center">
              <div className="text-xl font-bold text-emerald-400 tabular-nums">{acceptedOffers.length + 1}</div>
              <div className="text-[10px] text-slate-300 mt-0.5">Slots Rescued</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Active Waitlist</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{activeWaitlist.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">PriorityQueue ordered</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Slots Recovered</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            {acceptedOffers.length + 1}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">From cancellations &amp; no-shows</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Grace Period Limit</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">15 mins</div>
          <div className="text-[11px] text-slate-500 mt-1">Automated no-show release</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Recovery Efficiency</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">{recoveryEfficiencyPct}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Zero wasted facilities</div>
        </div>
      </div>

      {/* FEATURE B: INTERACTIVE LIVE SLOT RECOVERY SIMULATOR */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Interactive Demonstration
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Feature B: Automatic Slot Recovery Simulator
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select an active confirmed reservation and cancel it. Watch the Rescue Engine automatically detect
              the released time slot, query the PriorityQueue, and reallocate the slot!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {confirmedBookings.map((b) => (
            <div key={b.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-blue-700">#{b.id}</span>
                  <span className="text-slate-400 font-mono">{b.date}</span>
                </div>
                <div className="font-bold text-slate-900 text-sm">{b.resourceName}</div>
                <div className="text-xs text-slate-500 font-mono mt-1">
                  {b.startTime} - {b.endTime}
                </div>
                <div className="text-xs text-slate-600 mt-2 italic">
                  Booked by {b.userName} ({b.userRole}): "{b.purpose}"
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-emerald-700">CONFIRMED</span>
                <button
                  onClick={() => onCancelBookingAndTriggerRecovery(b.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancel Slot &amp; Trigger Recovery</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURE A & C: SMART WAITING LIST & PRIORITY QUEUE RANKING */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Feature A &amp; C
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Smart Waiting List (PriorityQueue)
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {waitingList.length} Total Queued
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Priority</th>
                  <th className="py-2.5 px-3 font-semibold">Candidate</th>
                  <th className="py-2.5 px-3 font-semibold">Resource</th>
                  <th className="py-2.5 px-3 font-semibold">Requested Slot</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {waitingList.map((w, index) => (
                  <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          w.priority === 3
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : w.priority === 2
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {w.priority === 3 ? 'P3 (Urgent Exam)' : w.priority === 2 ? 'P2 (Faculty)' : 'P1 (Normal)'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans font-medium text-slate-900">
                      {w.userName}
                      <span className="block text-[10px] text-slate-400 font-normal">#{w.id}</span>
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-700">{w.resourceName}</td>
                    <td className="py-3 px-3 text-slate-600 text-[11px]">
                      {w.date} · {w.startTime}-{w.endTime}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[11px] font-semibold ${
                          w.status === 'ALLOCATED'
                            ? 'text-emerald-700'
                            : w.status === 'WAITING'
                            ? 'text-amber-700'
                            : 'text-slate-500'
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ACTIVE SLOT OFFERS PANEL */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Recovery Pipeline
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Generated Slot Recovery Offers
              </h3>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
              {slotOffers.length} Offers
            </span>
          </div>

          {slotOffers.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
              <Sparkles className="w-6 h-6 text-slate-300 mx-auto mb-2" />
              <div>No pending slot recovery offers.</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Cancel a confirmed reservation above to watch the engine dispatch an offer!
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {slotOffers.map((o) => (
                <div
                  key={o.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{o.resourceName}</div>
                      <div className="text-slate-500 font-mono mt-0.5">
                        {o.offerDate} · {o.startTime} - {o.endTime}
                      </div>
                      <div className="text-slate-600 mt-1">Candidate User: <strong className="text-slate-900">{o.userName}</strong></div>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        o.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : o.status === 'DECLINED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>

                  {o.status === 'PENDING' && (
                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-mono">Expires in: 28 mins</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onAcceptOffer(o.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg cursor-pointer"
                        >
                          Accept Offer
                        </button>
                        <button
                          onClick={() => onDeclineOffer(o.id)}
                          className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FEATURE D: ALTERNATIVE RESOURCE RECOMMENDATIONS */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Feature D
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Alternative Resource Recommendations
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              If a requested classroom or lab is unavailable, the engine evaluates capacity,
              building proximity, and installed equipment to recommend suitable alternatives.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Target Room</label>
              <select
                value={selectedRoomIdForAlt}
                onChange={(e) => setSelectedRoomIdForAlt(Number(e.target.value))}
                className="border border-slate-200 rounded-lg p-1.5 focus:outline-none"
              >
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.roomNumber} ({c.capacity} seats)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-500 mb-1">Min Capacity</label>
              <input
                type="number"
                min="20"
                max="100"
                value={minAltCapacity}
                onChange={(e) => setMinAltCapacity(Number(e.target.value))}
                className="border border-slate-200 rounded-lg p-1.5 w-20 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {alternativeRooms.map((alt) => (
            <div key={alt.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm">{alt.roomNumber}</span>
                  <div className="text-xs text-slate-500 mt-0.5">{alt.building}</div>
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  {alt.capacity} seats
                </span>
              </div>

              <div className="mt-3 text-[11px] text-slate-600">
                Facilities: {alt.hasProjector && 'Projector · '} {alt.hasAirConditioning && 'AC'}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold">{alt.status}</span>
                <span className="text-blue-700 font-medium">Compatible Alternative &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURE E: NO-SHOW DETECTION & GRACE PERIOD SIMULATOR */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700 mb-1">
          <Clock className="w-4 h-4 text-purple-600" />
          <span>Feature E: Room Check-In &amp; No-Show Automation</span>
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          15-Minute Grace Period Scanner
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Users must check in to their reserved room within 15 minutes of the scheduled start time.
          If a user fails to check in, the engine marks the slot as NO_SHOW and initiates slot recovery.
        </p>

        <div className="space-y-3">
          {confirmedBookings.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{b.resourceName}</span>
                  <span className="font-mono text-slate-500">
                    {b.date} · {b.startTime} - {b.endTime}
                  </span>
                </div>
                <div className="text-slate-600 mt-1">
                  Booked for: "{b.purpose}" by <strong className="text-slate-900">{b.userName}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {b.checkInStatus === 'CHECKED_IN' ? (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Checked In (Safe)
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => onCheckIn(b.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg cursor-pointer"
                    >
                      Check In Now
                    </button>
                    <button
                      onClick={() => onSimulateNoShow(b.id)}
                      className="px-3.5 py-1.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg cursor-pointer"
                    >
                      Simulate 15-Min Expiry
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
