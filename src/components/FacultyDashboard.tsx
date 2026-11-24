import React, { useState } from 'react';
import {
  FacultyProfile,
  Course,
  Assignment,
  Booking,
  Classroom,
  Laboratory,
  Equipment,
  AssignmentSubmission,
} from '../types/campus';
import {
  Briefcase,
  BookOpen,
  Calendar,
  Building2,
  Plus,
  CheckCircle2,
  Clock,
  FileCheck,
  ChevronRight,
  Sparkles,
  Users,
} from 'lucide-react';

interface FacultyDashboardProps {
  faculty: FacultyProfile;
  assignedCourses: Course[];
  assignments: Assignment[];
  bookings: Booking[];
  classrooms: Classroom[];
  laboratories: Laboratory[];
  equipment: Equipment[];
  onCreateAssignment: (courseId: number, title: string, instructions: string, deadline: string, maxScore: number) => void;
  onGradeSubmission: (assignmentId: number, submissionId: number, score: number, feedback: string) => void;
  onRequestBooking: (
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
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  faculty,
  assignedCourses,
  assignments,
  bookings,
  classrooms,
  laboratories,
  equipment,
  onCreateAssignment,
  onGradeSubmission,
  onRequestBooking,
  onCancelBooking,
  onCheckIn,
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'assignments' | 'grading' | 'booking'>('courses');

  // Assignment Creation Form
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);
  const [newAssignmentCourseId, setNewAssignmentCourseId] = useState<number>(assignedCourses[0]?.id || 1);
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentInstructions, setNewAssignmentInstructions] = useState('');
  const [newAssignmentDeadline, setNewAssignmentDeadline] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0] + 'T23:59'
  );
  const [newAssignmentMaxScore, setNewAssignmentMaxScore] = useState(100);

  // Grading Modal
  const [selectedSubmission, setSelectedSubmission] = useState<{
    assignment: Assignment;
    submission: AssignmentSubmission;
  } | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(95);
  const [gradeFeedback, setGradeFeedback] = useState<string>('Strong analytical approach and sound test coverage.');

  // Booking state
  const [bookingType, setBookingType] = useState<'CLASSROOM' | 'LABORATORY' | 'EQUIPMENT'>('CLASSROOM');
  const [selectedResourceId, setSelectedResourceId] = useState<number>(classrooms[0]?.id || 1);
  const [bookingDate, setBookingDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bookingStartTime, setBookingStartTime] = useState<string>('09:00');
  const [bookingEndTime, setBookingEndTime] = useState<string>('11:00');
  const [bookingPurpose, setBookingPurpose] = useState<string>('Practical Examination & Roster Evaluation');

  const myBookings = bookings.filter((b) => b.userId === faculty.userId);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Faculty Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl border border-emerald-100">
              {faculty.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{faculty.fullName}</h1>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                  {faculty.employeeCode}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {faculty.designation} · {faculty.departmentName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6 text-xs">
            <div>
              <div className="text-slate-400">Office Location</div>
              <div className="text-sm font-semibold text-slate-900 mt-0.5">{faculty.officeRoom}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{faculty.specialization}</div>
            </div>

            <div>
              <div className="text-slate-400">Assigned Courses</div>
              <div className="text-xl font-bold font-mono text-slate-900">{assignedCourses.length}</div>
              <div className="text-[11px] text-slate-500">Active Semester 5</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-3 mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'courses' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Assigned Courses ({assignedCourses.length})
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'assignments' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Assignments &amp; Submissions ({assignments.length})
        </button>
        <button
          onClick={() => setActiveTab('booking')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'booking' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Facility &amp; Lab Reservation
        </button>
      </div>

      {/* TAB 1: ASSIGNED COURSES */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedCourses.map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-700">{c.code}</span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{c.name}</h3>
                    <div className="text-xs text-slate-500 mt-1">{c.departmentName}</div>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                    {c.credits} Credits
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">{c.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Schedule: {c.schedule}</span>
                  <span className="font-semibold text-slate-800">
                    Enrolled: {c.enrolledCount} / {c.maxEnrollment}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ASSIGNMENT CREATION & EVALUATION */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900">Coursework &amp; Submissions</h3>
              <p className="text-xs text-slate-500">Publish assignments, inspect deliverables, and evaluate grades.</p>
            </div>
            <button
              onClick={() => setShowCreateAssignmentModal(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Create Assignment</span>
            </button>
          </div>

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
                    <p className="text-xs text-slate-600 mt-2">{a.instructions}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs text-slate-400">Due Date</div>
                    <div className="text-xs font-mono font-bold text-slate-900 mt-0.5">
                      {new Date(a.deadline).toLocaleDateString()}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-mono">{a.totalSubmissions} Submissions</div>
                  </div>
                </div>

                {/* Submissions Drawer / Demo submission */}
                {a.mySubmission && (
                  <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50 rounded-lg p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900">
                          {a.mySubmission.studentName} ({a.mySubmission.rollNumber})
                        </span>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          File: {a.mySubmission.fileName} · Submitted at {new Date(a.mySubmission.submittedAt).toLocaleTimeString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-emerald-700 font-bold">
                          Score: {a.mySubmission.score ?? 'Pending'} / {a.maxScore}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedSubmission({
                              assignment: a,
                              submission: a.mySubmission!,
                            });
                            setGradeScore(a.mySubmission?.score || 95);
                            setGradeFeedback(a.mySubmission?.feedback || 'Outstanding work.');
                          }}
                          className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 rounded text-slate-700 font-medium cursor-pointer"
                        >
                          Grade / Feedback
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FACILITY RESERVATIONS */}
      {activeTab === 'booking' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Priority Faculty Booking</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Reserve Classroom / Lab</h3>
            <p className="text-xs text-slate-500 mb-4">
              Faculty reservations carry academic Priority Level 2 for lectures, lab exams, and seminars.
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
                  bookingPurpose,
                  2 // Faculty priority
                );
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
                <label className="block font-medium text-slate-700 mb-1">Select Facility</label>
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
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none font-mono"
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
                <label className="block font-medium text-slate-700 mb-1">Academic Purpose</label>
                <textarea
                  required
                  rows={2}
                  value={bookingPurpose}
                  onChange={(e) => setBookingPurpose(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Confirm Faculty Reservation
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900 mb-4">My Facility Reservations</h3>
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
          </div>
        </div>
      )}

      {/* CREATE ASSIGNMENT MODAL */}
      {showCreateAssignmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Publish New Assignment</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onCreateAssignment(
                  Number(newAssignmentCourseId),
                  newAssignmentTitle,
                  newAssignmentInstructions,
                  newAssignmentDeadline,
                  Number(newAssignmentMaxScore)
                );
                setShowCreateAssignmentModal(false);
                setNewAssignmentTitle('');
                setNewAssignmentInstructions('');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-medium text-slate-700 mb-1">Target Course</label>
                <select
                  value={newAssignmentCourseId}
                  onChange={(e) => setNewAssignmentCourseId(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-600"
                >
                  {assignedCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Assignment Title</label>
                <input
                  required
                  type="text"
                  value={newAssignmentTitle}
                  onChange={(e) => setNewAssignmentTitle(e.target.value)}
                  placeholder="e.g. Concurrency &amp; Virtual Threads Benchmarking"
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Instructions &amp; Requirements</label>
                <textarea
                  required
                  rows={3}
                  value={newAssignmentInstructions}
                  onChange={(e) => setNewAssignmentInstructions(e.target.value)}
                  placeholder="Detail grading rubric, submission archive format, and deadlines..."
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Deadline</label>
                  <input
                    type="datetime-local"
                    required
                    value={newAssignmentDeadline}
                    onChange={(e) => setNewAssignmentDeadline(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Max Score</label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={newAssignmentMaxScore}
                    onChange={(e) => setNewAssignmentMaxScore(Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateAssignmentModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg cursor-pointer"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GRADING MODAL */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Grade Submission</h3>
            <p className="text-xs text-slate-500 mb-4">
              Student: {selectedSubmission.submission.studentName} ({selectedSubmission.submission.rollNumber})
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onGradeSubmission(
                  selectedSubmission.assignment.id,
                  selectedSubmission.submission.id,
                  gradeScore,
                  gradeFeedback
                );
                setSelectedSubmission(null);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Awarded Score (out of {selectedSubmission.assignment.maxScore})
                </label>
                <input
                  type="number"
                  min="0"
                  max={selectedSubmission.assignment.maxScore}
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none font-mono text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Personalized Feedback to Student</label>
                <textarea
                  rows={3}
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg cursor-pointer"
                >
                  Submit Grade &amp; Notify Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
