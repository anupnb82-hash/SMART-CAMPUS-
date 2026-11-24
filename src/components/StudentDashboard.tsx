import React, { useState } from 'react';
import {
  StudentProfile,
  Course,
  Assignment,
  Booking,
  CampusEvent,
  Classroom,
  Laboratory,
  Equipment,
  WaitingListEntry,
  SlotOffer,
} from '../types/campus';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  Building2,
  CheckCircle2,
  AlertCircle,
  Upload,
  Sparkles,
  ChevronRight,
  FileText,
  X,
} from 'lucide-react';

interface StudentDashboardProps {
  student: StudentProfile;
  enrolledCourses: Course[];
  assignments: Assignment[];
  bookings: Booking[];
  events: CampusEvent[];
  classrooms: Classroom[];
  laboratories: Laboratory[];
  equipment: Equipment[];
  waitingList: WaitingListEntry[];
  slotOffers: SlotOffer[];
  onSubmitAssignment: (assignmentId: number, text: string, fileName?: string) => void;
  onRequestBooking: (
    resourceType: 'CLASSROOM' | 'LABORATORY' | 'EQUIPMENT',
    resourceId: number,
    resourceName: string,
    date: string,
    startTime: string,
    endTime: string,
    purpose: string
  ) => void;
  onJoinWaitlist: (
    resourceType: 'CLASSROOM' | 'LABORATORY' | 'EQUIPMENT',
    resourceId: number,
    resourceName: string,
    date: string,
    startTime: string,
    endTime: string,
    purpose: string,
    priority: number
  ) => void;
  onCancelBooking: (bookingId: number) => void;
  onCheckIn: (bookingId: number) => void;
  onRegisterEvent: (eventId: number) => void;
  onCancelEventRegistration: (eventId: number) => void;
  onAcceptSlotOffer: (offerId: number) => void;
  onDeclineSlotOffer: (offerId: number) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  enrolledCourses,
  assignments,
  bookings,
  events,
  classrooms,
  laboratories,
  equipment,
  waitingList,
  slotOffers,
  onSubmitAssignment,
  onRequestBooking,
  onJoinWaitlist,
  onCancelBooking,
  onCheckIn,
  onRegisterEvent,
  onCancelEventRegistration,
  onAcceptSlotOffer,
  onDeclineSlotOffer,
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'assignments' | 'booking' | 'events' | 'offers'>('courses');

  // Booking Form state
  const [bookingType, setBookingType] = useState<'CLASSROOM' | 'LABORATORY' | 'EQUIPMENT'>('CLASSROOM');
  const [selectedResourceId, setSelectedResourceId] = useState<number>(classrooms[0]?.id || 1);
  const [bookingDate, setBookingDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bookingStartTime, setBookingStartTime] = useState<string>('14:00');
  const [bookingEndTime, setBookingEndTime] = useState<string>('16:00');
  const [bookingPurpose, setBookingPurpose] = useState<string>('');

  // Submission modal state
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState<string>('');
  const [submissionFileName, setSubmissionFileName] = useState<string>('');

  // Current selected resource name helper
  const getSelectedResourceName = () => {
    if (bookingType === 'CLASSROOM') {
      const room = classrooms.find((c) => c.id === selectedResourceId);
      return room ? `${room.roomNumber} (${room.building})` : 'Classroom';
    } else if (bookingType === 'LABORATORY') {
      const lab = laboratories.find((l) => l.id === selectedResourceId);
      return lab ? lab.name : 'Laboratory';
    } else {
      const eq = equipment.find((e) => e.id === selectedResourceId);
      return eq ? eq.name : 'Equipment';
    }
  };

  const myBookings = bookings.filter((b) => b.userId === student.userId);
  const myWaitlist = waitingList.filter((w) => w.userId === student.userId);
  const myOffers = slotOffers.filter((o) => o.userId === student.userId && o.status === 'PENDING');

  // Academic standing calculation (OOP Polymorphism mirror)
  const getAcademicStanding = (cgpa: number) => {
    if (cgpa >= 3.8) return "Summa Cum Laude / Dean's List";
    if (cgpa >= 3.5) return 'Magna Cum Laude';
    if (cgpa >= 3.0) return 'Good Standing';
    return 'Academic Warning';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Student Profile Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xl border border-blue-100">
              {student.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{student.fullName}</h1>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  {student.rollNumber}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {student.departmentName} · Year {student.academicYear}, Semester {student.semester}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6 text-xs">
            <div>
              <div className="text-slate-400">Cumulative GPA</div>
              <div className="text-xl font-bold font-mono text-slate-900">{student.cgpa.toFixed(2)} / 4.00</div>
              <div className="text-[11px] text-emerald-700 font-semibold">{getAcademicStanding(student.cgpa)}</div>
            </div>

            <div>
              <div className="text-slate-400">Enrolled Courses</div>
              <div className="text-xl font-bold font-mono text-slate-900">{enrolledCourses.length}</div>
              <div className="text-[11px] text-slate-500">
                {enrolledCourses.reduce((sum, c) => sum + c.credits, 0)} Total Credits
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SLOT OFFERS BANNER (if any) */}
      {myOffers.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Rescue Engine: Slot Offer Available!
              </div>
              <div className="text-sm font-semibold">
                {myOffers[0].resourceName} on {myOffers[0].offerDate} ({myOffers[0].startTime} - {myOffers[0].endTime})
              </div>
              <div className="text-xs text-amber-800">
                A previously booked slot has been recovered. Confirm acceptance to secure this reservation.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAcceptSlotOffer(myOffers[0].id)}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs cursor-pointer whitespace-nowrap"
            >
              Accept Slot
            </button>
            <button
              onClick={() => onDeclineSlotOffer(myOffers[0].id)}
              className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer whitespace-nowrap"
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {/* Tab Controls */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-3 mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'courses' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          My Courses ({enrolledCourses.length})
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'assignments' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Assignments ({assignments.length})
        </button>
        <button
          onClick={() => setActiveTab('booking')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'booking' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Reserve Facility / Lab
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'events' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Campus Events ({events.length})
        </button>
      </div>

      {/* TAB 1: ENROLLED COURSES */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrolledCourses.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-700">{c.code}</span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{c.name}</h3>
                  <div className="text-xs text-slate-500 mt-1">{c.facultyName}</div>
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                  {c.credits} Credits
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">{c.description}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>{c.schedule}</span>
                <span>Enrolled: {c.enrolledCount} students</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          {assignments.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-purple-700">{a.courseCode}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500 font-medium">{a.courseName}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{a.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{a.instructions}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-400">Due Date</div>
                  <div className="text-xs font-mono font-bold text-slate-900 mt-0.5">
                    {new Date(a.deadline).toLocaleDateString()}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Max Score: {a.maxScore} pts</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {a.mySubmission ? (
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-emerald-700">Submitted</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600">
                      Score: <strong className="font-mono">{a.mySubmission.score ?? 'Grading Pending'}</strong> / {a.maxScore}
                    </span>
                    {a.mySubmission.feedback && (
                      <span className="text-slate-500 italic block sm:inline">
                        — "{a.mySubmission.feedback}"
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-amber-700 font-medium">Pending Submission</div>
                )}

                <button
                  onClick={() => {
                    setSelectedAssignment(a);
                    setSubmissionText(a.mySubmission?.submissionText || '');
                    setSubmissionFileName(a.mySubmission?.fileName || '');
                  }}
                  className="px-3.5 py-1.5 text-xs font-medium bg-slate-900 hover:bg-blue-800 text-white rounded-lg transition-colors cursor-pointer self-end sm:self-auto"
                >
                  {a.mySubmission ? 'View / Update Submission' : 'Submit Assignment'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: RESOURCE BOOKING & MY RESERVATIONS */}
      {activeTab === 'booking' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reservation Request Form */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">Book Campus Resource</h3>
            <p className="text-xs text-slate-500 mb-4">
              Select classrooms, specialized computing laboratories, or research gear.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onRequestBooking(
                  bookingType,
                  selectedResourceId,
                  getSelectedResourceName(),
                  bookingDate,
                  bookingStartTime,
                  bookingEndTime,
                  bookingPurpose
                );
                setBookingPurpose('');
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-medium text-slate-700 mb-1">Resource Category</label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingType('CLASSROOM');
                      setSelectedResourceId(classrooms[0]?.id || 1);
                    }}
                    className={`py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
                      bookingType === 'CLASSROOM' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Classroom
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBookingType('LABORATORY');
                      setSelectedResourceId(laboratories[0]?.id || 1);
                    }}
                    className={`py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
                      bookingType === 'LABORATORY' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Laboratory
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBookingType('EQUIPMENT');
                      setSelectedResourceId(equipment[0]?.id || 1);
                    }}
                    className={`py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
                      bookingType === 'EQUIPMENT' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Equipment
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Select Asset</label>
                <select
                  value={selectedResourceId}
                  onChange={(e) => setSelectedResourceId(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-600"
                >
                  {bookingType === 'CLASSROOM' &&
                    classrooms.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.roomNumber} - {c.building} ({c.capacity} seats)
                      </option>
                    ))}

                  {bookingType === 'LABORATORY' &&
                    laboratories.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} - {l.building}
                      </option>
                    ))}

                  {bookingType === 'EQUIPMENT' &&
                    equipment.map((eq) => (
                      <option key={eq.id} value={eq.id}>
                        {eq.name} [{eq.code}]
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Time Slot</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="time"
                      value={bookingStartTime}
                      onChange={(e) => setBookingStartTime(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-1.5 focus:outline-none font-mono text-[11px]"
                    />
                    <span>-</span>
                    <input
                      type="time"
                      value={bookingEndTime}
                      onChange={(e) => setBookingEndTime(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-1.5 focus:outline-none font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Purpose of Booking</label>
                <textarea
                  required
                  rows={2}
                  value={bookingPurpose}
                  onChange={(e) => setBookingPurpose(e.target.value)}
                  placeholder="e.g. Study sprint for OOP exam or GPU model training..."
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-600 text-xs"
                />
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Submit Reservation Request
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onJoinWaitlist(
                      bookingType,
                      selectedResourceId,
                      getSelectedResourceName(),
                      bookingDate,
                      bookingStartTime,
                      bookingEndTime,
                      bookingPurpose || 'Study group waitlist',
                      1 // Normal student priority
                    );
                    setBookingPurpose('');
                  }}
                  className="w-full py-2 text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Join Smart Waiting List</span>
                </button>
              </div>
            </form>
          </div>

          {/* My Reservations & Active Bookings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
              <h3 className="text-base font-bold text-slate-900 mb-4">My Confirmed Reservations</h3>
              {myBookings.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No active resource bookings. Use the form to book lecture rooms or computing labs.
                </div>
              ) : (
                <div className="space-y-3">
                  {myBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-lg border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{b.resourceName}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                            {b.resourceType}
                          </span>
                        </div>
                        <div className="text-slate-500 mt-1 font-mono">
                          {b.date} · {b.startTime} - {b.endTime}
                        </div>
                        <div className="text-slate-600 mt-1 italic">"{b.purpose}"</div>
                      </div>

                      <div className="flex items-center gap-2">
                        {b.status === 'CONFIRMED' && (
                          <>
                            {b.checkInStatus === 'CHECKED_IN' ? (
                              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Checked In
                              </span>
                            ) : (
                              <button
                                onClick={() => onCheckIn(b.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg cursor-pointer"
                              >
                                Check In
                              </button>
                            )}

                            <button
                              onClick={() => onCancelBooking(b.id)}
                              className="px-3 py-1.5 border border-slate-200 text-red-600 hover:bg-red-50 font-medium rounded-lg cursor-pointer"
                            >
                              Cancel Slot
                            </button>
                          </>
                        )}
                        {b.status === 'CANCELLED' && (
                          <span className="text-xs text-slate-400 font-medium">Cancelled (Slot Released)</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Waitlist Entries */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
              <h3 className="text-base font-bold text-slate-900 mb-2">My Smart Waitlist Status</h3>
              <p className="text-xs text-slate-500 mb-4">
                The Campus Resource Rescue Engine automatically allocates cancelled slots to candidates in this list.
              </p>

              {myWaitlist.length === 0 ? (
                <div className="text-xs text-slate-400 italic">You have no active waiting list requests.</div>
              ) : (
                <div className="space-y-2">
                  {myWaitlist.map((w) => (
                    <div
                      key={w.id}
                      className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-900">{w.resourceName}</span>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {w.date} · {w.startTime} - {w.endTime} · Priority: {w.priority}
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-amber-700">{w.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CAMPUS EVENTS */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((e) => (
            <div key={e.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-blue-700 font-semibold">{e.category}</span>
                  <span className="text-slate-400 font-mono">{e.date}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{e.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{e.description}</p>
                <div className="text-xs text-slate-500 space-y-1">
                  <div>Venue: <strong className="text-slate-800">{e.venue}</strong></div>
                  <div>Time: <span className="font-mono">{e.startTime} - {e.endTime}</span></div>
                  <div>
                    Capacity: <span className="font-mono">{e.currentParticipants}/{e.maxParticipants}</span> registered
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                {e.isRegistered ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Registered
                    </span>
                    <button
                      onClick={() => onCancelEventRegistration(e.id)}
                      className="text-xs text-slate-500 hover:text-red-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onRegisterEvent(e.id)}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
                  >
                    Register for Event
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBMISSION MODAL */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-purple-700">{selectedAssignment.courseCode}</span>
                <h3 className="text-base font-bold text-slate-900">{selectedAssignment.title}</h3>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmitAssignment(selectedAssignment.id, submissionText, submissionFileName || 'submission.zip');
                setSelectedAssignment(null);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-medium text-slate-700 mb-1">Submission Notes &amp; Implementation Details</label>
                <textarea
                  required
                  rows={4}
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Detail your architecture, OOP concepts implemented, test cases run..."
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-600"
                  style={{ backgroundColor: '#5472b6' }}
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Attached Archive File (ZIP / PDF / Java)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={submissionFileName}
                    onChange={(e) => setSubmissionFileName(e.target.value)}
                    placeholder="Alex_Morgan_CS301_Project.zip"
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none font-mono"
                    style={{ backgroundColor: '#7186d4' }}
                  />
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Allowed formats: .zip, .pdf, .java (Max 25MB).</div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload &amp; Submit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
