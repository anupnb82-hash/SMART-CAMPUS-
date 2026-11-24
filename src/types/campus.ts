export type UserRole = 'ADMIN' | 'FACULTY' | 'STUDENT';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface StudentProfile {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  rollNumber: string;
  departmentId: number;
  departmentName: string;
  academicYear: number;
  semester: number;
  cgpa: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface FacultyProfile {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  employeeCode: string;
  departmentId: number;
  departmentName: string;
  designation: string;
  officeRoom: string;
  specialization: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface Department {
  id: number;
  code: string;
  name: string;
  building: string;
  headOfDepartment: string;
  contactEmail: string;
  contactPhone: string;
  studentCount?: number;
  facultyCount?: number;
  courseCount?: number;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  departmentId: number;
  departmentName: string;
  facultyId: number | null;
  facultyName: string;
  credits: number;
  semester: number;
  description: string;
  schedule: string;
  maxEnrollment: number;
  enrolledCount: number;
}

export interface Classroom {
  id: number;
  roomNumber: string;
  building: string;
  floor: number;
  capacity: number;
  hasProjector: boolean;
  hasSmartboard: boolean;
  hasAirConditioning: boolean;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
}

export interface Laboratory {
  id: number;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  departmentId: number;
  departmentName: string;
  safetyLevel: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
}

export interface Equipment {
  id: number;
  code: string;
  name: string;
  labId: number | null;
  labName?: string;
  departmentId: number;
  category: string;
  totalQuantity: number;
  availableQuantity: number;
  conditionStatus: 'EXCELLENT' | 'GOOD' | 'NEEDS_MAINTENANCE';
}

export interface Booking {
  id: number;
  userId: number;
  userName: string;
  userRole: UserRole;
  resourceType: 'CLASSROOM' | 'LABORATORY' | 'EQUIPMENT';
  resourceId: number;
  resourceName: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REJECTED' | 'COMPLETED' | 'NO_SHOW';
  checkInStatus: 'NOT_CHECKED_IN' | 'CHECKED_IN' | 'EXPIRED_NO_SHOW';
  createdAt: string;
}

export interface WaitingListEntry {
  id: number;
  userId: number;
  userName: string;
  userRole: UserRole;
  resourceType: 'CLASSROOM' | 'LABORATORY' | 'EQUIPMENT';
  resourceId: number;
  resourceName: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  priority: number; // 3: Urgent / Exam, 2: Faculty Research, 1: Normal
  status: 'WAITING' | 'OFFERED' | 'ALLOCATED' | 'EXPIRED' | 'CANCELLED';
  autoAllocateOptIn: boolean;
  createdAt: string;
}

export interface SlotOffer {
  id: number;
  waitId: number;
  bookingId?: number;
  userId: number;
  userName: string;
  resourceType: 'CLASSROOM' | 'LABORATORY' | 'EQUIPMENT';
  resourceId: number;
  resourceName: string;
  offerDate: string;
  startTime: string;
  endTime: string;
  expiresAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
  createdAt: string;
}

export interface CampusEvent {
  id: number;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  organizerUserId: number;
  organizerName: string;
  category: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  isRegistered?: boolean;
}

export interface Assignment {
  id: number;
  courseId: number;
  courseCode: string;
  courseName: string;
  facultyId: number;
  facultyName: string;
  title: string;
  instructions: string;
  deadline: string;
  maxScore: number;
  fileAttachmentUrl?: string;
  totalSubmissions: number;
  mySubmission?: AssignmentSubmission;
}

export interface AssignmentSubmission {
  id: number;
  assignmentId: number;
  studentId: number;
  studentName: string;
  rollNumber: string;
  submissionText: string;
  fileName?: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
  status: 'PENDING' | 'EVALUATED';
}

export interface NotificationItem {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'BOOKING' | 'WAITLIST_OFFER' | 'ASSIGNMENT' | 'EVENT' | 'SYSTEM';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface ActivityLogItem {
  id: number;
  userId: number;
  userName: string;
  actionType: string;
  module: string;
  details: string;
  createdAt: string;
}
