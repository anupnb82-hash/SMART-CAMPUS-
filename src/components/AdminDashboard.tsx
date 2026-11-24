import React, { useState } from 'react';
import {
  StudentProfile,
  FacultyProfile,
  Department,
  Course,
  Classroom,
  Laboratory,
  Equipment,
  Booking,
  ActivityLogItem,
} from '../types/campus';
import {
  Users,
  Briefcase,
  Building2,
  BookOpen,
  Layers,
  Calendar,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Edit,
  Eye,
  Activity,
  AlertCircle,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardProps {
  students: StudentProfile[];
  faculty: FacultyProfile[];
  departments: Department[];
  courses: Course[];
  classrooms: Classroom[];
  laboratories: Laboratory[];
  equipment: Equipment[];
  bookings: Booking[];
  activityLogs: ActivityLogItem[];
  onAddStudent: (s: Omit<StudentProfile, 'id' | 'createdAt'>) => void;
  onUpdateStudent: (id: number, s: Partial<StudentProfile>) => void;
  onDeleteStudent: (id: number) => void;
  onAddFaculty: (f: Omit<FacultyProfile, 'id' | 'createdAt'>) => void;
  onUpdateFaculty: (id: number, f: Partial<FacultyProfile>) => void;
  onDeleteFaculty: (id: number) => void;
  onAddDepartment: (d: Omit<Department, 'id'>) => void;
  onDeleteDepartment: (id: number) => void;
  onAddCourse: (c: Omit<Course, 'id' | 'enrolledCount'>) => void;
  onDeleteCourse: (id: number) => void;
  onAddClassroom: (c: Omit<Classroom, 'id'>) => void;
  onAddLaboratory: (l: Omit<Laboratory, 'id'>) => void;
  onAddEquipment: (e: Omit<Equipment, 'id'>) => void;
  onUpdateBookingStatus: (id: number, status: 'CONFIRMED' | 'REJECTED' | 'CANCELLED') => void;
  onExportStudentsCsv: () => void;
  onExportBookingsCsv: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  faculty,
  departments,
  courses,
  classrooms,
  laboratories,
  equipment,
  bookings,
  activityLogs,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onAddFaculty,
  onUpdateFaculty,
  onDeleteFaculty,
  onAddDepartment,
  onDeleteDepartment,
  onAddCourse,
  onDeleteCourse,
  onAddClassroom,
  onAddLaboratory,
  onAddEquipment,
  onUpdateBookingStatus,
  onExportStudentsCsv,
  onExportBookingsCsv,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'students' | 'faculty' | 'departments' | 'courses' | 'facilities' | 'bookings' | 'audit'
  >('overview');

  // Search and filter states
  const [studentSearch, setStudentSearch] = useState('');
  const [studentDeptFilter, setStudentDeptFilter] = useState<number | 'ALL'>('ALL');
  const [facultySearch, setFacultySearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('ALL');

  // Modals state
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);

  // Form temporary state
  const [newStudent, setNewStudent] = useState({
    fullName: '',
    email: '',
    phone: '',
    rollNumber: '',
    departmentId: 1,
    academicYear: 3,
    semester: 5,
    cgpa: 3.8,
  });

  const [newFaculty, setNewFaculty] = useState({
    fullName: '',
    email: '',
    phone: '',
    employeeCode: '',
    departmentId: 1,
    designation: 'Assistant Professor',
    officeRoom: 'Alan Turing Hall 201',
    specialization: 'Cloud Computing & Distributed Systems',
  });

  const [newDept, setNewDept] = useState({
    code: '',
    name: '',
    building: '',
    headOfDepartment: '',
    contactEmail: '',
    contactPhone: '',
  });

  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    departmentId: 1,
    facultyId: 1,
    credits: 3,
    semester: 5,
    description: '',
    schedule: 'Mon/Wed 10:00 - 11:30 AM',
    maxEnrollment: 60,
  });

  // Calculate live database statistics
  const pendingBookings = bookings.filter((b) => b.status === 'PENDING').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED').length;
  const activeStudents = students.filter((s) => s.status === 'ACTIVE').length;

  // Filtered lists
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesDept = studentDeptFilter === 'ALL' || s.departmentId === studentDeptFilter;
    return matchesSearch && matchesDept;
  });

  const filteredFaculty = faculty.filter((f) => {
    return (
      f.fullName.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.employeeCode.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.specialization.toLowerCase().includes(facultySearch.toLowerCase())
    );
  });

  const filteredBookings = bookings.filter((b) => {
    if (bookingStatusFilter === 'ALL') return true;
    return b.status === bookingStatusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-700">
            Administrative Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Administration Console
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time management of academic departments, personnel rosters, and campus facilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportStudentsCsv}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Roster</span>
          </button>
          <button
            onClick={onExportBookingsCsv}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Bookings</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-1 overflow-x-auto pb-4 mb-6 border-b border-slate-200 no-scrollbar">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeSubTab === 'overview'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Overview &amp; Metrics
        </button>
        <button
          onClick={() => setActiveSubTab('students')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeSubTab === 'students'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Students ({students.length})
        </button>
        <button
          onClick={() => setActiveSubTab('faculty')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeSubTab === 'faculty'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Faculty ({faculty.length})
        </button>
        <button
          onClick={() => setActiveSubTab('departments')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeSubTab === 'departments'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Departments ({departments.length})
        </button>
        <button
          onClick={() => setActiveSubTab('courses')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeSubTab === 'courses'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Courses ({courses.length})
        </button>
        <button
          onClick={() => setActiveSubTab('facilities')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeSubTab === 'facilities'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Facilities ({classrooms.length + laboratories.length})
        </button>
        <button
          onClick={() => setActiveSubTab('bookings')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeSubTab === 'bookings'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveSubTab('audit')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeSubTab === 'audit'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Audit Stream
        </button>
      </div>

      {/* SUB-TAB 1: OVERVIEW & STATS */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Stat Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Total Students</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {activeStudents}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Across 4 departments</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Faculty Roster</span>
                <Briefcase className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {faculty.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">100% active standing</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Classrooms &amp; Labs</span>
                <Building2 className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {classrooms.length + laboratories.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">{equipment.length} equipment sets</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-medium">Active Bookings</span>
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {confirmedBookings}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">{pendingBookings} pending approvals</div>
            </div>
          </div>

          {/* Quick Actions & Recent Activities split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">Recent Booking Requests</h3>
                <button
                  onClick={() => setActiveSubTab('bookings')}
                  className="text-xs text-blue-700 hover:text-blue-900 font-medium cursor-pointer"
                >
                  View All Bookings &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">User</th>
                      <th className="py-2.5 px-3 font-semibold">Resource</th>
                      <th className="py-2.5 px-3 font-semibold">Date &amp; Time</th>
                      <th className="py-2.5 px-3 font-semibold">Status</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-medium text-slate-900">
                          {b.userName}
                          <span className="block text-[10px] text-slate-500 font-normal">{b.userRole}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{b.resourceName}</td>
                        <td className="py-2.5 px-3 text-slate-600 font-mono">
                          {b.date} · {b.startTime}-{b.endTime}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-block text-[11px] font-semibold ${
                              b.status === 'CONFIRMED'
                                ? 'text-emerald-700'
                                : b.status === 'PENDING'
                                ? 'text-amber-700'
                                : 'text-slate-500'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {b.status === 'PENDING' && (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onUpdateBookingStatus(b.id, 'CONFIRMED')}
                                className="p-1 rounded text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                                title="Approve"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onUpdateBookingStatus(b.id, 'REJECTED')}
                                className="p-1 rounded text-red-600 hover:bg-red-50 cursor-pointer"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          {b.status === 'CONFIRMED' && (
                            <button
                              onClick={() => onUpdateBookingStatus(b.id, 'CANCELLED')}
                              className="text-[11px] text-red-600 hover:text-red-800 font-medium cursor-pointer"
                            >
                              Cancel Slot
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Management Shortcuts */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4">Quick Management</h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => {
                      setActiveSubTab('students');
                      setShowAddStudentModal(true);
                    }}
                    className="w-full py-2.5 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4 text-blue-600" />
                      Add New Student
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveSubTab('faculty');
                      setShowAddFacultyModal(true);
                    }}
                    className="w-full py-2.5 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4 text-emerald-600" />
                      Add Faculty Member
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveSubTab('courses');
                      setShowAddCourseModal(true);
                    }}
                    className="w-full py-2.5 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4 text-purple-600" />
                      Create New Course
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveSubTab('facilities');
                      setShowAddRoomModal(true);
                    }}
                    className="w-full py-2.5 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4 text-amber-600" />
                      Register Classroom/Lab
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 text-xs text-slate-500">
                <div className="font-semibold text-slate-700 mb-1">Database Verification</div>
                <div>All entities synchronize with MySQL `smart_campus` schema via Spring JdbcTemplate.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: STUDENT MANAGEMENT */}
      {activeSubTab === 'students' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search students by name, roll, or email..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
                />
              </div>

              <select
                value={studentDeptFilter}
                onChange={(e) => setStudentDeptFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
                className="text-xs border border-slate-200 rounded-lg py-1.5 px-3 focus:outline-none focus:border-blue-600"
              >
                <option value="ALL">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Student</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Roll Number</th>
                  <th className="py-2.5 px-3 font-semibold">Full Name</th>
                  <th className="py-2.5 px-3 font-semibold">Department</th>
                  <th className="py-2.5 px-3 font-semibold">Year/Sem</th>
                  <th className="py-2.5 px-3 font-semibold">CGPA</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-blue-700">{s.rollNumber}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{s.fullName}</div>
                      <div className="text-[11px] text-slate-500">{s.email}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{s.departmentName}</td>
                    <td className="py-3 px-3 text-slate-600 font-mono">
                      Y{s.academicYear} · S{s.semester}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-900">{s.cgpa.toFixed(2)}</td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-semibold text-emerald-700">{s.status}</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onDeleteStudent(s.id)}
                        className="p-1 rounded text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Deactivate Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: FACULTY MANAGEMENT */}
      {activeSubTab === 'faculty' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search faculty by name or code..."
                value={facultySearch}
                onChange={(e) => setFacultySearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              onClick={() => setShowAddFacultyModal(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Faculty</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Emp Code</th>
                  <th className="py-2.5 px-3 font-semibold">Name &amp; Designation</th>
                  <th className="py-2.5 px-3 font-semibold">Department</th>
                  <th className="py-2.5 px-3 font-semibold">Specialization</th>
                  <th className="py-2.5 px-3 font-semibold">Office</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFaculty.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-emerald-700">{f.employeeCode}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{f.fullName}</div>
                      <div className="text-[11px] text-slate-500">{f.designation}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{f.departmentName}</td>
                    <td className="py-3 px-3 text-slate-600">{f.specialization}</td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{f.officeRoom}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onDeleteFaculty(f.id)}
                        className="p-1 rounded text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Deactivate Faculty"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: DEPARTMENT MANAGEMENT */}
      {activeSubTab === 'departments' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900">Academic Departments</h3>
              <p className="text-xs text-slate-500">
                Relational departments with safe deletion dependency verification.
              </p>
            </div>
            <button
              onClick={() => setShowAddDeptModal(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Create Department</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((d) => (
              <div key={d.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-700">{d.code}</span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">{d.name}</h4>
                    <div className="text-xs text-slate-500 mt-1">Building: {d.building}</div>
                  </div>
                  <button
                    onClick={() => {
                      if (d.studentCount && d.studentCount > 0) {
                        alert(`Cannot delete department ${d.name} because active enrolled students (${d.studentCount}) depend on it.`);
                      } else {
                        onDeleteDepartment(d.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                    title="Delete Department"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-50 p-2 rounded">
                    <div className="font-bold font-mono text-slate-900">{d.studentCount || 0}</div>
                    <div className="text-[10px] text-slate-500">Students</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded">
                    <div className="font-bold font-mono text-slate-900">{d.facultyCount || 0}</div>
                    <div className="text-[10px] text-slate-500">Faculty</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded">
                    <div className="font-bold font-mono text-slate-900">{d.courseCount || 0}</div>
                    <div className="text-[10px] text-slate-500">Courses</div>
                  </div>
                </div>

                <div className="mt-3 text-[11px] text-slate-500">
                  Head: <span className="text-slate-700 font-medium">{d.headOfDepartment}</span> · {d.contactEmail}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: COURSE MANAGEMENT */}
      {activeSubTab === 'courses' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Curriculum &amp; Course Offerings</h3>
              <p className="text-xs text-slate-500">Maintain faculty instructors, credit hours, and schedules.</p>
            </div>
            <button
              onClick={() => setShowAddCourseModal(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add Course</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Code</th>
                  <th className="py-2.5 px-3 font-semibold">Course Title</th>
                  <th className="py-2.5 px-3 font-semibold">Department</th>
                  <th className="py-2.5 px-3 font-semibold">Instructor</th>
                  <th className="py-2.5 px-3 font-semibold">Credits</th>
                  <th className="py-2.5 px-3 font-semibold">Schedule</th>
                  <th className="py-2.5 px-3 font-semibold">Enrollment</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-purple-700">{c.code}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{c.name}</td>
                    <td className="py-3 px-3 text-slate-600">{c.departmentName}</td>
                    <td className="py-3 px-3 text-slate-700">{c.facultyName}</td>
                    <td className="py-3 px-3 font-mono font-medium">{c.credits} cr</td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{c.schedule}</td>
                    <td className="py-3 px-3 font-mono">
                      {c.enrolledCount}/{c.maxEnrollment}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onDeleteCourse(c.id)}
                        className="p-1 rounded text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: FACILITIES & EQUIPMENT */}
      {activeSubTab === 'facilities' && (
        <div className="space-y-8">
          {/* Classrooms */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">Lecture Classrooms</h3>
              <button
                onClick={() => setShowAddRoomModal(true)}
                className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
              >
                + Add Classroom
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {classrooms.map((r) => (
                <div key={r.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900">{r.roomNumber}</span>
                    <span className="text-[10px] font-semibold text-emerald-700">{r.status}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{r.building}</div>
                  <div className="text-xs font-mono mt-3">Capacity: {r.capacity} seats</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {r.hasProjector && 'Projector · '}
                    {r.hasSmartboard && 'Smartboard · '}
                    {r.hasAirConditioning && 'AC'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Laboratories */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">Specialized Research Laboratories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {laboratories.map((lab) => (
                <div key={lab.id} className="p-4 rounded-lg border border-slate-200 bg-white">
                  <div className="font-bold text-slate-900 text-sm">{lab.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{lab.building} · Floor {lab.floor}</div>
                  <div className="mt-3 flex items-center justify-between text-xs font-mono">
                    <span>Capacity: {lab.capacity}</span>
                    <span className="text-slate-600">{lab.safetyLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High-End Equipment */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">High-Value Computing &amp; Lab Equipment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {equipment.map((eq) => (
                <div key={eq.id} className="p-4 rounded-lg border border-slate-200 bg-white">
                  <div className="text-xs font-mono font-bold text-blue-700">{eq.code}</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">{eq.name}</div>
                  <div className="text-xs text-slate-500 mt-1">{eq.category}</div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                    <span>Available: {eq.availableQuantity}/{eq.totalQuantity}</span>
                    <span className="text-emerald-700 font-semibold">{eq.conditionStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: BOOKINGS MANAGEMENT */}
      {activeSubTab === 'bookings' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Campus Reservations</h3>
              <p className="text-xs text-slate-500">Monitor resource bookings, approve requests, and trigger slot recovery.</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg py-1.5 px-3 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PENDING">PENDING</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">ID</th>
                  <th className="py-2.5 px-3 font-semibold">User</th>
                  <th className="py-2.5 px-3 font-semibold">Resource</th>
                  <th className="py-2.5 px-3 font-semibold">Schedule</th>
                  <th className="py-2.5 px-3 font-semibold">Purpose</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-400">#{b.id}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{b.userName}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{b.userRole}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{b.resourceName}</div>
                      <div className="text-[10px] text-slate-500">{b.resourceType}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      <div>{b.date}</div>
                      <div className="text-[11px] text-slate-400">{b.startTime} - {b.endTime}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">{b.purpose}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[11px] font-semibold ${
                          b.status === 'CONFIRMED'
                            ? 'text-emerald-700'
                            : b.status === 'PENDING'
                            ? 'text-amber-700'
                            : 'text-slate-500'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {b.status === 'CONFIRMED' && (
                        <button
                          onClick={() => onUpdateBookingStatus(b.id, 'CANCELLED')}
                          className="text-[11px] text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                        >
                          Cancel Slot
                        </button>
                      )}
                      {b.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, 'CONFIRMED')}
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-[11px] font-medium cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onUpdateBookingStatus(b.id, 'REJECTED')}
                            className="px-2 py-1 bg-red-50 text-red-700 rounded text-[11px] font-medium cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 8: AUDIT STREAM */}
      {activeSubTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-base font-bold text-slate-900 mb-4">System Activity Audit Log</h3>
          <div className="space-y-3">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-start justify-between text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-blue-700">[{log.module}]</span>{' '}
                  <span className="font-semibold text-slate-900">{log.actionType}</span> by{' '}
                  <span className="text-slate-700 font-medium">{log.userName}</span>
                  <div className="text-slate-600 mt-1">{log.details}</div>
                </div>
                <div className="text-[11px] font-mono text-slate-400 shrink-0 ml-4">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD STUDENT MODAL */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Register New Student</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const dept = departments.find((d) => d.id === Number(newStudent.departmentId));
                onAddStudent({
                  userId: Math.floor(Math.random() * 9000) + 1000,
                  fullName: newStudent.fullName,
                  email: newStudent.email,
                  phone: newStudent.phone,
                  rollNumber: newStudent.rollNumber,
                  departmentId: Number(newStudent.departmentId),
                  departmentName: dept ? dept.name : 'Computer Science & Engineering',
                  academicYear: Number(newStudent.academicYear),
                  semester: Number(newStudent.semester),
                  cgpa: Number(newStudent.cgpa),
                  status: 'ACTIVE',
                });
                setShowAddStudentModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  value={newStudent.fullName}
                  onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                  placeholder="e.g. Jordan Lee"
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Roll Number</label>
                  <input
                    required
                    type="text"
                    value={newStudent.rollNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                    placeholder="CS-2024-099"
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={newStudent.cgpa}
                    onChange={(e) => setNewStudent({ ...newStudent, cgpa: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">University Email</label>
                <input
                  required
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  placeholder="student.jordan@smartcampus.edu"
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Department</label>
                <select
                  value={newStudent.departmentId}
                  onChange={(e) => setNewStudent({ ...newStudent, departmentId: Number(e.target.value) })}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-600"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg cursor-pointer"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD FACULTY MODAL */}
      {showAddFacultyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Register Faculty Member</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const dept = departments.find((d) => d.id === Number(newFaculty.departmentId));
                onAddFaculty({
                  userId: Math.floor(Math.random() * 9000) + 1000,
                  fullName: newFaculty.fullName,
                  email: newFaculty.email,
                  phone: newFaculty.phone,
                  employeeCode: newFaculty.employeeCode,
                  departmentId: Number(newFaculty.departmentId),
                  departmentName: dept ? dept.name : 'Computer Science & Engineering',
                  designation: newFaculty.designation,
                  officeRoom: newFaculty.officeRoom,
                  specialization: newFaculty.specialization,
                  status: 'ACTIVE',
                });
                setShowAddFacultyModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  value={newFaculty.fullName}
                  onChange={(e) => setNewFaculty({ ...newFaculty, fullName: e.target.value })}
                  placeholder="e.g. Dr. Alan Turing"
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Employee Code</label>
                  <input
                    required
                    type="text"
                    value={newFaculty.employeeCode}
                    onChange={(e) => setNewFaculty({ ...newFaculty, employeeCode: e.target.value })}
                    placeholder="FAC-CS-120"
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Designation</label>
                  <input
                    required
                    type="text"
                    value={newFaculty.designation}
                    onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Faculty Email</label>
                <input
                  required
                  type="email"
                  value={newFaculty.email}
                  onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                  placeholder="faculty.name@smartcampus.edu"
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={newFaculty.specialization}
                  onChange={(e) => setNewFaculty({ ...newFaculty, specialization: e.target.value })}
                  placeholder="e.g. Quantum Computing & Algorithms"
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddFacultyModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg cursor-pointer"
                >
                  Save Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
