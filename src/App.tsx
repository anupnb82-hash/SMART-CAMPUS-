/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { FacultyDashboard } from './components/FacultyDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { RescueEngineHub } from './components/RescueEngineHub';
import { FacilitiesPage } from './components/FacilitiesPage';
import { JavaOopShowcase } from './components/JavaOopShowcase';
import { LoginModal } from './components/LoginModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { GeminiCampusBot } from './components/GeminiCampusBot';
import { auth, db } from './firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, collection, onSnapshot } from 'firebase/firestore';

import {
  INITIAL_USERS,
  INITIAL_DEPARTMENTS,
  INITIAL_STUDENTS,
  INITIAL_FACULTY,
  INITIAL_COURSES,
  INITIAL_CLASSROOMS,
  INITIAL_LABORATORIES,
  INITIAL_EQUIPMENT,
  INITIAL_BOOKINGS,
  INITIAL_WAITING_LIST,
  INITIAL_SLOT_OFFERS,
  INITIAL_EVENTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY_LOGS,
} from './data/mockSeedData';

import {
  User,
  UserRole,
  StudentProfile,
  FacultyProfile,
  Department,
  Course,
  Classroom,
  Laboratory,
  Equipment,
  Booking,
  WaitingListEntry,
  SlotOffer,
  CampusEvent,
  Assignment,
  NotificationItem,
  ActivityLogItem,
} from './types/campus';

import {
  hasBookingConflict,
  findBestWaitingCandidate,
} from './utils/rescueEngine';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginRoleHint, setLoginRoleHint] = useState<UserRole | undefined>(undefined);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isGeminiBotOpen, setIsGeminiBotOpen] = useState(false);
  const [isFirebaseUser, setIsFirebaseUser] = useState(false);

  // Core Campus Entities with localStorage persistence
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('smartcampus_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('smartcampus_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[3]; // Default Alex Morgan (Student)
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('smartcampus_depts');
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [students, setStudents] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('smartcampus_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [facultyList, setFacultyList] = useState<FacultyProfile[]>(() => {
    const saved = localStorage.getItem('smartcampus_faculty');
    return saved ? JSON.parse(saved) : INITIAL_FACULTY;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('smartcampus_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [classrooms, setClassrooms] = useState<Classroom[]>(() => {
    const saved = localStorage.getItem('smartcampus_classrooms');
    return saved ? JSON.parse(saved) : INITIAL_CLASSROOMS;
  });

  const [laboratories, setLaboratories] = useState<Laboratory[]>(() => {
    const saved = localStorage.getItem('smartcampus_labs');
    return saved ? JSON.parse(saved) : INITIAL_LABORATORIES;
  });

  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem('smartcampus_equipment');
    return saved ? JSON.parse(saved) : INITIAL_EQUIPMENT;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('smartcampus_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [waitingList, setWaitingList] = useState<WaitingListEntry[]>(() => {
    const saved = localStorage.getItem('smartcampus_waiting_list');
    return saved ? JSON.parse(saved) : INITIAL_WAITING_LIST;
  });

  const [slotOffers, setSlotOffers] = useState<SlotOffer[]>(() => {
    const saved = localStorage.getItem('smartcampus_slot_offers');
    return saved ? JSON.parse(saved) : INITIAL_SLOT_OFFERS;
  });

  const [events, setEvents] = useState<CampusEvent[]>(() => {
    const saved = localStorage.getItem('smartcampus_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('smartcampus_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('smartcampus_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(() => {
    const saved = localStorage.getItem('smartcampus_activity');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('smartcampus_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('smartcampus_waiting_list', JSON.stringify(waitingList));
  }, [waitingList]);

  useEffect(() => {
    localStorage.setItem('smartcampus_slot_offers', JSON.stringify(slotOffers));
  }, [slotOffers]);

  useEffect(() => {
    localStorage.setItem('smartcampus_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('smartcampus_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('smartcampus_faculty', JSON.stringify(facultyList));
  }, [facultyList]);

  useEffect(() => {
    localStorage.setItem('smartcampus_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setIsFirebaseUser(true);
        let role: UserRole = 'STUDENT';
        if (fbUser.email && fbUser.email.toLowerCase().includes('admin')) {
          role = 'ADMIN';
        } else if (fbUser.email && fbUser.email.toLowerCase().includes('faculty')) {
          role = 'FACULTY';
        }

        const mappedUser: User = {
          id: Number(fbUser.uid.slice(-6)) || Date.now(),
          username: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          email: fbUser.email || '',
          role,
          status: 'ACTIVE',
        };
        setCurrentUser(mappedUser);
      } else {
        setIsFirebaseUser(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Firestore real-time bookings persistence listener
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'bookings'), (snap) => {
        if (!snap.empty) {
          const fsBookings = snap.docs.map(d => d.data() as Booking);
          setBookings(prev => {
            const map = new Map(prev.map(b => [b.id, b]));
            fsBookings.forEach(fb => {
              if (fb.id) map.set(fb.id, fb);
            });
            return Array.from(map.values());
          });
        }
      }, (err) => {
        console.warn('Firestore bookings snapshot notice:', err);
      });
      return () => unsub();
    } catch (e) {
      console.warn('Firestore listener setup notice:', e);
    }
  }, []);

  // Auth Handlers
  const handleOpenLogin = (roleHint?: UserRole) => {
    setLoginRoleHint(roleHint);
    setIsLoginModalOpen(true);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'ADMIN') setActiveTab('admin');
    else if (user.role === 'FACULTY') setActiveTab('faculty');
    else setActiveTab('student');
  };

  const handleLogout = async () => {
    if (auth.currentUser) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Firebase signOut notice:', e);
      }
    }
    setCurrentUser(null);
    setIsFirebaseUser(false);
    setActiveTab('landing');
  };

  // Helper to log activities
  const addActivityLog = (actionType: string, module: string, details: string) => {
    const newLog: ActivityLogItem = {
      id: Date.now(),
      userId: currentUser?.id || 1,
      userName: currentUser ? currentUser.username : 'System',
      actionType,
      module,
      details,
      createdAt: new Date().toISOString(),
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Helper to send notifications
  const sendNotification = (userId: number, title: string, message: string, type: 'BOOKING' | 'WAITLIST_OFFER' | 'ASSIGNMENT' | 'EVENT' | 'SYSTEM' = 'SYSTEM') => {
    const newNotif: NotificationItem = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // ==========================================
  // CAMPUS RESOURCE RESCUE ENGINE CORE CASCADE
  // ==========================================
  const triggerRescueEngineSlotRecovery = (cancelledBooking: Booking) => {
    const candidate = findBestWaitingCandidate(
      waitingList,
      cancelledBooking.resourceType,
      cancelledBooking.resourceId,
      cancelledBooking.date,
      cancelledBooking.startTime,
      cancelledBooking.endTime
    );

    if (candidate) {
      // 2. Create high-priority Slot Offer with 15-min expiration window
      const offerExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      const newOffer: SlotOffer = {
        id: Date.now(),
        waitId: candidate.id,
        bookingId: cancelledBooking.id,
        userId: candidate.userId,
        userName: candidate.userName,
        resourceType: candidate.resourceType,
        resourceId: candidate.resourceId,
        resourceName: cancelledBooking.resourceName,
        offerDate: cancelledBooking.date,
        startTime: candidate.startTime,
        endTime: candidate.endTime,
        expiresAt: offerExpires,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };

      setSlotOffers(prev => [newOffer, ...prev]);

      // 3. Mark candidate as OFFERED in waiting list
      setWaitingList(prev => prev.map(w => w.id === candidate.id ? { ...w, status: 'OFFERED' } : w));

      // 4. Send targeted priority notification
      sendNotification(
        candidate.userId,
        'Rescue Engine: Slot Recovered!',
        `A slot has opened for ${cancelledBooking.resourceName} on ${candidate.date} (${candidate.startTime} - ${candidate.endTime}). Priority allocated via Rescue Engine. You have 15 minutes to claim it!`,
        'WAITLIST_OFFER'
      );

      addActivityLog(
        'RESCUE_SLOT_RECOVERED',
        'RESCUE_ENGINE',
        `Rescue Engine allocated freed slot ${cancelledBooking.resourceName} to PriorityQueue candidate ${candidate.userName} (Priority: ${candidate.priority})`
      );
    } else {
      addActivityLog(
        'RESCUE_NO_CANDIDATE',
        'RESCUE_ENGINE',
        `Slot ${cancelledBooking.resourceName} opened, but no matching waitlist request found in PriorityQueue`
      );
    }
  };

  // Create Booking Handler with conflict checks
  const handleCreateBooking = (
    resourceType: 'CLASSROOM' | 'LABORATORY' | 'EQUIPMENT',
    resourceId: number,
    resourceName: string,
    date: string,
    startTime: string,
    endTime: string,
    purpose: string,
    userRoleHint?: UserRole
  ) => {
    if (!currentUser) {
      handleOpenLogin();
      return;
    }

    // Check collision against active bookings
    const activeConfirmed = bookings.filter(b => b.status === 'CONFIRMED');
    const conflict = hasBookingConflict(
      activeConfirmed,
      resourceType,
      resourceId,
      date,
      startTime,
      endTime
    );

    if (conflict) {
      alert(`Booking Conflict: ${resourceName} is already reserved during this time slot (${startTime} - ${endTime}). You can join the Rescue Engine waitlist to get automatically offered the slot if it is cancelled!`);
      return;
    }

    const currentStudent = students.find(s => s.userId === currentUser.id);
    const currentFac = facultyList.find(f => f.userId === currentUser.id);
    const userName = currentStudent ? currentStudent.fullName : currentFac ? currentFac.fullName : currentUser.username;

    const newBooking: Booking = {
      id: Date.now(),
      userId: currentUser.id,
      userName,
      userRole: currentUser.role,
      resourceType,
      resourceId,
      resourceName,
      date,
      startTime,
      endTime,
      purpose,
      status: 'CONFIRMED',
      checkInStatus: 'NOT_CHECKED_IN',
      createdAt: new Date().toISOString(),
    };

    setBookings(prev => [newBooking, ...prev]);

    // Persist to Firestore
    try {
      setDoc(doc(db, 'bookings', String(newBooking.id)), {
        ...newBooking,
        id: String(newBooking.id),
        userId: auth.currentUser ? auth.currentUser.uid : String(currentUser.id),
      });
    } catch (fsErr) {
      console.warn('Firestore booking persistence notice:', fsErr);
    }

    sendNotification(
      currentUser.id,
      'Booking Confirmed',
      `Your reservation for ${newBooking.resourceName} on ${newBooking.date} (${newBooking.startTime} - ${newBooking.endTime}) is confirmed.`,
      'BOOKING'
    );
    addActivityLog('CREATE_BOOKING', 'FACILITIES', `Reserved ${newBooking.resourceName}`);
  };

  // Cancel Booking Handler
  const handleCancelBooking = (bookingId: number) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b));
    addActivityLog('CANCEL_BOOKING', 'FACILITIES', `Cancelled reservation for ${booking.resourceName}`);

    // Update Firestore status
    try {
      setDoc(doc(db, 'bookings', String(bookingId)), { status: 'CANCELLED' }, { merge: true });
    } catch (fsErr) {
      console.warn('Firestore booking update notice:', fsErr);
    }

    // Trigger signature Rescue Engine cascade
    triggerRescueEngineSlotRecovery(booking);
  };

  // Join Waitlist Handler
  const handleJoinWaitlist = (
    resourceType: 'CLASSROOM' | 'LABORATORY' | 'EQUIPMENT',
    resourceId: number,
    resourceName: string,
    date: string,
    startTime: string,
    endTime: string,
    purpose: string,
    priority: number
  ) => {
    if (!currentUser) {
      handleOpenLogin();
      return;
    }

    const currentStudent = students.find(s => s.userId === currentUser.id);
    const currentFac = facultyList.find(f => f.userId === currentUser.id);
    const userName = currentStudent ? currentStudent.fullName : currentFac ? currentFac.fullName : currentUser.username;

    const newEntry: WaitingListEntry = {
      id: Date.now(),
      userId: currentUser.id,
      userName,
      userRole: currentUser.role,
      resourceType,
      resourceId,
      resourceName,
      date,
      startTime,
      endTime,
      purpose,
      priority,
      status: 'WAITING',
      autoAllocateOptIn: true,
      createdAt: new Date().toISOString(),
    };

    setWaitingList(prev => [...prev, newEntry]);
    sendNotification(
      currentUser.id,
      'Enrolled in Rescue Engine Waitlist',
      `Added to priority queue for ${resourceName} with priority tier ${priority}. You will be instantly offered the slot if a cancellation occurs.`,
      'WAITLIST_OFFER'
    );
    addActivityLog('JOIN_WAITLIST', 'RESCUE_ENGINE', `Enrolled in waitlist for ${resourceName} (Tier: ${priority})`);
  };

  // Slot Offer Decision
  const handleAcceptSlotOffer = (offerId: number) => {
    const offer = slotOffers.find(o => o.id === offerId);
    if (!offer) return;

    // Convert into confirmed booking
    const newBooking: Booking = {
      id: Date.now(),
      userId: offer.userId,
      userName: offer.userName,
      userRole: 'STUDENT',
      resourceType: offer.resourceType,
      resourceId: offer.resourceId,
      resourceName: offer.resourceName,
      date: offer.offerDate,
      startTime: offer.startTime,
      endTime: offer.endTime,
      purpose: 'Rescued via Smart Priority Queue',
      status: 'CONFIRMED',
      checkInStatus: 'NOT_CHECKED_IN',
      createdAt: new Date().toISOString(),
    };

    setBookings(prev => [newBooking, ...prev]);
    setSlotOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: 'ACCEPTED' } : o));
    setWaitingList(prev => prev.map(w => (w.userId === offer.userId && w.resourceId === offer.resourceId && w.date === offer.offerDate) ? { ...w, status: 'ALLOCATED' } : w));

    sendNotification(
      offer.userId,
      'Slot Successfully Claimed!',
      `You accepted the rescued slot for ${offer.resourceName}. Your booking is now confirmed.`,
      'BOOKING'
    );
    addActivityLog('ACCEPT_SLOT_OFFER', 'RESCUE_ENGINE', `Claimed slot for ${offer.resourceName}`);
  };

  const handleDeclineSlotOffer = (offerId: number) => {
    const offer = slotOffers.find(o => o.id === offerId);
    if (!offer) return;

    setSlotOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: 'DECLINED' } : o));
    setWaitingList(prev => prev.map(w => (w.userId === offer.userId && w.resourceId === offer.resourceId && w.date === offer.offerDate) ? { ...w, status: 'CANCELLED' } : w));

    addActivityLog('DECLINE_SLOT_OFFER', 'RESCUE_ENGINE', `Declined slot for ${offer.resourceName}`);

    // Re-trigger rescue engine for the next candidate in PriorityQueue
    const dummyBooking: Booking = {
      id: offer.bookingId || Date.now(),
      userId: offer.userId,
      userName: offer.userName,
      userRole: 'STUDENT',
      resourceType: offer.resourceType,
      resourceId: offer.resourceId,
      resourceName: offer.resourceName,
      date: offer.offerDate,
      startTime: offer.startTime,
      endTime: offer.endTime,
      purpose: 'Re-offering',
      status: 'CANCELLED',
      checkInStatus: 'NOT_CHECKED_IN',
      createdAt: new Date().toISOString(),
    };
    triggerRescueEngineSlotRecovery(dummyBooking);
  };

  // Check In Handler
  const handleCheckIn = (bookingId: number) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, checkInStatus: 'CHECKED_IN' } : b));
    addActivityLog('CHECK_IN', 'FACILITIES', 'Checked in to confirmed reservation');
  };

  // Simulate No-Show Detection & Grace Period Expiry
  const handleSimulateNoShow = (bookingId: number) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Mark as NO_SHOW and immediately trigger Rescue Engine recovery
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'NO_SHOW', checkInStatus: 'EXPIRED_NO_SHOW' } : b));
    sendNotification(
      booking.userId,
      'Reservation Cancelled (15-min No-Show)',
      `Your booking for ${booking.resourceName} was released because no check-in was registered within the 15-minute grace period.`,
      'BOOKING'
    );
    addActivityLog('NO_SHOW_DETECTED', 'RESCUE_ENGINE', `15-minute grace period expired for ${booking.resourceName}. Slot reclaimed by Rescue Engine.`);
    triggerRescueEngineSlotRecovery(booking);
  };

  // Assignment Handlers
  const handleCreateAssignment = (courseId: number, title: string, instructions: string, deadline: string, maxScore: number) => {
    const course = courses.find(c => c.id === courseId);
    const newAss: Assignment = {
      id: Date.now(),
      courseId,
      courseCode: course ? course.code : 'CS-301',
      courseName: course ? course.name : 'Computer Science Course',
      facultyId: currentUser?.id || 2,
      facultyName: currentUser ? currentUser.username : 'Dr. Robert Smith',
      title,
      instructions,
      deadline,
      maxScore,
      totalSubmissions: 0,
    };
    setAssignments(prev => [newAss, ...prev]);
    addActivityLog('CREATE_ASSIGNMENT', 'ACADEMICS', `Created assignment: ${newAss.title}`);
  };

  const handleGradeSubmission = (assignmentId: number, submissionId: number, score: number, feedback: string) => {
    setAssignments(prev => prev.map(a => {
      if (a.id === assignmentId && a.mySubmission && a.mySubmission.id === submissionId) {
        return {
          ...a,
          mySubmission: {
            ...a.mySubmission,
            score,
            feedback,
            status: 'EVALUATED',
          },
        };
      }
      return a;
    }));

    sendNotification(
      4, // Alex Morgan
      'Assignment Graded',
      `Your assignment submission has been evaluated: ${score}/100. Feedback: "${feedback}"`,
      'ASSIGNMENT'
    );
    addActivityLog('GRADE_ASSIGNMENT', 'ACADEMICS', `Evaluated submission #${submissionId} with score ${score}`);
  };

  const handleSubmitAssignment = (assignmentId: number, text: string, fileName?: string) => {
    if (!currentUser) return;
    const currentStudent = students.find(s => s.userId === currentUser.id) || students[0];

    setAssignments(prev => prev.map(a => {
      if (a.id === assignmentId) {
        return {
          ...a,
          totalSubmissions: a.totalSubmissions + 1,
          mySubmission: {
            id: Date.now(),
            assignmentId,
            studentId: currentStudent.id,
            studentName: currentStudent.fullName,
            rollNumber: currentStudent.rollNumber,
            submissionText: text,
            fileName: fileName || 'assignment_submission.pdf',
            submittedAt: new Date().toISOString(),
            status: 'PENDING',
          },
        };
      }
      return a;
    }));

    sendNotification(
      currentUser.id,
      'Assignment Submitted',
      'Your assignment has been recorded and submitted for faculty evaluation.',
      'ASSIGNMENT'
    );
  };

  // Event Handlers
  const handleRegisterEvent = (eventId: number) => {
    if (!currentUser) {
      handleOpenLogin();
      return;
    }
    setEvents(prev => prev.map(e => e.id === eventId ? {
      ...e,
      currentParticipants: e.currentParticipants + 1,
      isRegistered: true,
    } : e));

    sendNotification(currentUser.id, 'Registered for Campus Event', 'Your seat has been reserved.', 'EVENT');
  };

  const handleCancelEventRegistration = (eventId: number) => {
    if (!currentUser) return;
    setEvents(prev => prev.map(e => e.id === eventId ? {
      ...e,
      currentParticipants: Math.max(0, e.currentParticipants - 1),
      isRegistered: false,
    } : e));
  };

  // Admin CRUD Handlers
  const handleAddStudent = (s: Omit<StudentProfile, 'id' | 'createdAt'>) => {
    const newStudent: StudentProfile = {
      ...s,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    setStudents(prev => [newStudent, ...prev]);

    const newUser: User = {
      id: newStudent.userId,
      username: newStudent.rollNumber.toLowerCase(),
      email: newStudent.email,
      role: 'STUDENT',
      status: 'ACTIVE',
    };
    setUsers(prev => [newUser, ...prev]);
    addActivityLog('CREATE_STUDENT', 'ADMIN', `Enrolled student ${newStudent.fullName}`);
  };

  const handleUpdateStudent = (id: number, s: Partial<StudentProfile>) => {
    setStudents(prev => prev.map(item => item.id === id ? { ...item, ...s } : item));
    addActivityLog('UPDATE_STUDENT', 'ADMIN', `Updated student record #${id}`);
  };

  const handleDeleteStudent = (id: number) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    addActivityLog('DELETE_STUDENT', 'ADMIN', `Removed student record #${id}`);
  };

  const handleAddFaculty = (f: Omit<FacultyProfile, 'id' | 'createdAt'>) => {
    const newFac: FacultyProfile = {
      ...f,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    setFacultyList(prev => [newFac, ...prev]);
    addActivityLog('CREATE_FACULTY', 'ADMIN', `Added faculty ${newFac.fullName}`);
  };

  const handleUpdateFaculty = (id: number, f: Partial<FacultyProfile>) => {
    setFacultyList(prev => prev.map(item => item.id === id ? { ...item, ...f } : item));
    addActivityLog('UPDATE_FACULTY', 'ADMIN', `Updated faculty record #${id}`);
  };

  const handleDeleteFaculty = (id: number) => {
    setFacultyList(prev => prev.filter(f => f.id !== id));
    addActivityLog('DELETE_FACULTY', 'ADMIN', `Removed faculty record #${id}`);
  };

  const handleAddDepartment = (d: Omit<Department, 'id'>) => {
    const newDept: Department = { ...d, id: Date.now() };
    setDepartments(prev => [newDept, ...prev]);
    addActivityLog('CREATE_DEPARTMENT', 'ADMIN', `Created department ${newDept.name}`);
  };

  const handleDeleteDepartment = (id: number) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
    addActivityLog('DELETE_DEPARTMENT', 'ADMIN', `Removed department #${id}`);
  };

  const handleAddCourse = (c: Omit<Course, 'id' | 'enrolledCount'>) => {
    const newCourse: Course = {
      ...c,
      id: Date.now(),
      enrolledCount: 0,
    };
    setCourses(prev => [newCourse, ...prev]);
    addActivityLog('CREATE_COURSE', 'ADMIN', `Created course ${newCourse.code} - ${newCourse.name}`);
  };

  const handleDeleteCourse = (id: number) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    addActivityLog('DELETE_COURSE', 'ADMIN', `Removed course #${id}`);
  };

  const handleAddClassroom = (c: Omit<Classroom, 'id'>) => {
    const newC: Classroom = { ...c, id: Date.now() };
    setClassrooms(prev => [newC, ...prev]);
    addActivityLog('CREATE_FACILITY', 'ADMIN', `Added classroom ${newC.roomNumber}`);
  };

  const handleAddLaboratory = (l: Omit<Laboratory, 'id'>) => {
    const newL: Laboratory = { ...l, id: Date.now() };
    setLaboratories(prev => [newL, ...prev]);
    addActivityLog('CREATE_FACILITY', 'ADMIN', `Added laboratory ${newL.name}`);
  };

  const handleAddEquipment = (e: Omit<Equipment, 'id'>) => {
    const newE: Equipment = { ...e, id: Date.now() };
    setEquipment(prev => [newE, ...prev]);
    addActivityLog('CREATE_FACILITY', 'ADMIN', `Registered equipment ${newE.name}`);
  };

  const handleUpdateBookingStatus = (id: number, status: 'CONFIRMED' | 'REJECTED' | 'CANCELLED') => {
    const target = bookings.find(b => b.id === id);
    if (!target) return;

    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    addActivityLog('UPDATE_BOOKING', 'ADMIN', `Set booking #${id} status to ${status}`);

    if (status === 'CANCELLED') {
      triggerRescueEngineSlotRecovery(target);
    }
  };

  const handleExportStudentsCsv = () => {
    const headers = ['ID,RollNumber,FullName,Email,Department,Year,Semester,CGPA,Status\n'];
    const rows = students.map(s => 
      `${s.id},"${s.rollNumber}","${s.fullName}","${s.email}","${s.departmentName}",${s.academicYear},${s.semester},${s.cgpa},${s.status}`
    );
    const blob = new Blob([...headers, ...rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_roster_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleExportBookingsCsv = () => {
    const headers = ['ID,User,Role,ResourceType,Resource,Date,StartTime,EndTime,Purpose,Status\n'];
    const rows = bookings.map(b => 
      `${b.id},"${b.userName}","${b.userRole}","${b.resourceType}","${b.resourceName}",${b.date},${b.startTime},${b.endTime},"${b.purpose}",${b.status}`
    );
    const blob = new Blob([...headers, ...rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campus_bookings_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Notification read triggers
  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Active student and faculty profiles based on logged-in user
  const currentStudentProfile = students.find(s => s.userId === currentUser?.id) || students[0];
  const currentFacultyProfile = facultyList.find(f => f.userId === currentUser?.id) || facultyList[0];

  const currentTab = activeTab === 'rescue-engine' ? 'rescue' : activeTab === 'oop-showcase' ? 'oop' : activeTab;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-indigo-500 selection:text-white">
      {/* 3-Zone Top Bar Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={unreadCount}
        onToggleNotifications={() => setIsNotificationOpen(prev => !prev)}
        onOpenGeminiBot={() => setIsGeminiBotOpen(true)}
        isFirebaseUser={isFirebaseUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'landing' && (
          <LandingPage
            onOpenLogin={handleOpenLogin}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {currentTab === 'student' && (
          <StudentDashboard
            student={currentStudentProfile}
            enrolledCourses={courses}
            assignments={assignments}
            bookings={bookings}
            events={events}
            classrooms={classrooms}
            laboratories={laboratories}
            equipment={equipment}
            waitingList={waitingList}
            slotOffers={slotOffers}
            onSubmitAssignment={handleSubmitAssignment}
            onRequestBooking={(resType, resId, resName, date, sTime, eTime, purpose) => {
              handleCreateBooking(resType, resId, resName, date, sTime, eTime, purpose, 'STUDENT');
            }}
            onJoinWaitlist={handleJoinWaitlist}
            onCancelBooking={handleCancelBooking}
            onCheckIn={handleCheckIn}
            onRegisterEvent={handleRegisterEvent}
            onCancelEventRegistration={handleCancelEventRegistration}
            onAcceptSlotOffer={handleAcceptSlotOffer}
            onDeclineSlotOffer={handleDeclineSlotOffer}
          />
        )}

        {currentTab === 'faculty' && (
          <FacultyDashboard
            faculty={currentFacultyProfile}
            assignedCourses={courses}
            assignments={assignments}
            bookings={bookings}
            classrooms={classrooms}
            laboratories={laboratories}
            equipment={equipment}
            onCreateAssignment={handleCreateAssignment}
            onGradeSubmission={handleGradeSubmission}
            onRequestBooking={(resType, resId, resName, date, sTime, eTime, purpose) => {
              handleCreateBooking(resType, resId, resName, date, sTime, eTime, purpose, 'FACULTY');
            }}
            onCancelBooking={handleCancelBooking}
            onCheckIn={handleCheckIn}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            students={students}
            faculty={facultyList}
            departments={departments}
            courses={courses}
            classrooms={classrooms}
            laboratories={laboratories}
            equipment={equipment}
            bookings={bookings}
            activityLogs={activityLogs}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onAddFaculty={handleAddFaculty}
            onUpdateFaculty={handleUpdateFaculty}
            onDeleteFaculty={handleDeleteFaculty}
            onAddDepartment={handleAddDepartment}
            onDeleteDepartment={handleDeleteDepartment}
            onAddCourse={handleAddCourse}
            onDeleteCourse={handleDeleteCourse}
            onAddClassroom={handleAddClassroom}
            onAddLaboratory={handleAddLaboratory}
            onAddEquipment={handleAddEquipment}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onExportStudentsCsv={handleExportStudentsCsv}
            onExportBookingsCsv={handleExportBookingsCsv}
          />
        )}

        {currentTab === 'rescue' && (
          <RescueEngineHub
            bookings={bookings}
            waitingList={waitingList}
            slotOffers={slotOffers}
            classrooms={classrooms}
            laboratories={laboratories}
            equipment={equipment}
            onCancelBookingAndTriggerRecovery={handleCancelBooking}
            onAcceptOffer={handleAcceptSlotOffer}
            onDeclineOffer={handleDeclineSlotOffer}
            onSimulateNoShow={handleSimulateNoShow}
            onCheckIn={handleCheckIn}
          />
        )}

        {currentTab === 'facilities' && (
          <FacilitiesPage
            classrooms={classrooms}
            laboratories={laboratories}
            equipment={equipment}
            bookings={bookings}
            currentUser={currentUser}
            onBookFacility={(resType, resId) => {
              if (currentUser?.role === 'STUDENT') {
                setActiveTab('student');
              } else if (currentUser?.role === 'FACULTY') {
                setActiveTab('faculty');
              } else {
                setActiveTab('student');
              }
            }}
            onOpenRescueHub={() => setActiveTab('rescue-engine')}
          />
        )}

        {currentTab === 'oop' && (
          <JavaOopShowcase />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        users={users}
        initialRoleHint={loginRoleHint}
      />

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onSelectSlotOffer={() => setActiveTab('rescue')}
      />

      {/* Multi-Turn Gemini Campus AI Chatbot */}
      <GeminiCampusBot
        isOpen={isGeminiBotOpen}
        onClose={() => setIsGeminiBotOpen(false)}
        currentUser={currentUser}
      />

      {/* Global Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">Smart Campus Management System</span>
            <span>•</span>
            <span>OOP with Practice PBL Project</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Spring Boot 3.5.16 (Pure JDBC)</span>
            <span>•</span>
            <span>MySQL 8.0 Engine</span>
            <span>•</span>
            <button 
              onClick={() => setActiveTab('oop')}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
            >
              OOP Design Patterns & Defense
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
