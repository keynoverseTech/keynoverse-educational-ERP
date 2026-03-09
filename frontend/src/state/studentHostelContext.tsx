import React, { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

export type StudentGender = 'Male' | 'Female';
export type RoomType = 'Standard' | 'Premium';
export type BookingStatus = 'Pending' | 'Approved' | 'Rejected' | 'Expired';
export type AllocationStatus = 'Active' | 'Expired';

export interface StudentHostelRule {
  id: string;
  eligibleLevels: string[];
  allocationDurationSemesters: number;
  isActive: boolean;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  studentId: string;
  gender: StudentGender;
  level: string;
}

export interface StudentHostel {
  id: string;
  hostelName: string;
  gender: StudentGender;
  description: string;
}

export interface StudentHostelRoom {
  id: string;
  hostelId: string;
  roomNumber: string;
  bedCapacity: number;
  occupiedBeds: number;
  roomType: RoomType;
}

export interface HostelBooking {
  id: string;
  studentId: string;
  hostelId: string;
  roomId: string;
  bedSpace: string;
  semesterStart: string;
  semesterEnd: string;
  status: BookingStatus;
  createdAt: string;
}

export interface HostelAllocation {
  id: string;
  studentId: string;
  hostelId: string;
  roomId: string;
  bedSpace: string;
  semesterStart: string;
  semesterEnd: string;
  status: AllocationStatus;
  createdAt: string;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

type PersistedState = {
  currentStudentId: string;
  students: StudentProfile[];
  rules: StudentHostelRule[];
  hostels: StudentHostel[];
  rooms: StudentHostelRoom[];
  bookings: HostelBooking[];
  allocations: HostelAllocation[];
};

type StudentHostelContextType = PersistedState & {
  ready: boolean;
  toasts: ToastMessage[];
  currentStudent: StudentProfile | null;
  activeRule: StudentHostelRule | null;
  isEligible: boolean;
  eligibleHostels: StudentHostel[];
  getAvailableBedsForHostel: (hostelId: string) => number;
  getRoomsForHostel: (hostelId: string) => StudentHostelRoom[];
  getRoom: (roomId: string) => StudentHostelRoom | null;
  createBooking: (input: { hostelId: string; roomId: string; semesterStart: string; semesterEnd: string }) => HostelBooking | null;
  cancelLatestPendingBooking: () => void;
  pushToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (toastId: string) => void;
};

const STORAGE_KEY = 'student_hostel_booking_v1';

const createId = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const nowIso = () => new Date().toISOString();

const initialState = (): PersistedState => {
  const students: StudentProfile[] = [
    { id: 'stu_1', fullName: 'Samuel John', studentId: 'STD/2024/021', gender: 'Male', level: '200' },
    { id: 'stu_2', fullName: 'Zainab Musa', studentId: 'STD/2024/114', gender: 'Female', level: '400' },
  ];

  const rules: StudentHostelRule[] = [
    { id: 'rule_1', eligibleLevels: ['100', '200', '300'], allocationDurationSemesters: 2, isActive: true, createdAt: '2025-01-10T08:00:00.000Z' },
    { id: 'rule_2', eligibleLevels: ['100', '200', '300', '400', '500'], allocationDurationSemesters: 2, isActive: false, createdAt: '2025-03-05T08:00:00.000Z' },
  ];

  const hostels: StudentHostel[] = [
    { id: 'hst_s_1', hostelName: 'Unity Hostel', gender: 'Male', description: 'Main campus male hostel with standard rooms.' },
    { id: 'hst_s_2', hostelName: 'Harmony Hostel', gender: 'Female', description: 'Female hostel close to the library and lecture halls.' },
    { id: 'hst_s_3', hostelName: 'Scholar Premium Annex', gender: 'Male', description: 'Premium rooms with limited capacity and priority allocation.' },
  ];

  const rooms: StudentHostelRoom[] = [
    { id: 'rm_s_1', hostelId: 'hst_s_1', roomNumber: '101', bedCapacity: 6, occupiedBeds: 4, roomType: 'Standard' },
    { id: 'rm_s_2', hostelId: 'hst_s_1', roomNumber: '102', bedCapacity: 6, occupiedBeds: 6, roomType: 'Standard' },
    { id: 'rm_s_3', hostelId: 'hst_s_1', roomNumber: '201', bedCapacity: 4, occupiedBeds: 1, roomType: 'Standard' },
    { id: 'rm_s_4', hostelId: 'hst_s_2', roomNumber: 'A11', bedCapacity: 4, occupiedBeds: 2, roomType: 'Standard' },
    { id: 'rm_s_5', hostelId: 'hst_s_2', roomNumber: 'A12', bedCapacity: 4, occupiedBeds: 0, roomType: 'Standard' },
    { id: 'rm_s_6', hostelId: 'hst_s_2', roomNumber: 'B21', bedCapacity: 2, occupiedBeds: 1, roomType: 'Premium' },
    { id: 'rm_s_7', hostelId: 'hst_s_3', roomNumber: 'P01', bedCapacity: 2, occupiedBeds: 2, roomType: 'Premium' },
    { id: 'rm_s_8', hostelId: 'hst_s_3', roomNumber: 'P02', bedCapacity: 2, occupiedBeds: 0, roomType: 'Premium' },
    { id: 'rm_s_9', hostelId: 'hst_s_3', roomNumber: 'P03', bedCapacity: 1, occupiedBeds: 0, roomType: 'Premium' },
  ];

  const allocations: HostelAllocation[] = [
    {
      id: 'alc_s_1',
      studentId: 'stu_1',
      hostelId: 'hst_s_1',
      roomId: 'rm_s_1',
      bedSpace: 'B5',
      semesterStart: '2025/2026 • First',
      semesterEnd: '2025/2026 • Second',
      status: 'Active',
      createdAt: '2025-10-12T10:00:00.000Z',
    },
  ];

  const bookings: HostelBooking[] = [
    {
      id: 'bk_s_1',
      studentId: 'stu_1',
      hostelId: 'hst_s_1',
      roomId: 'rm_s_3',
      bedSpace: 'B2',
      semesterStart: '2024/2025 • Second',
      semesterEnd: '2025/2026 • First',
      status: 'Approved',
      createdAt: '2025-04-05T10:00:00.000Z',
    },
    {
      id: 'bk_s_2',
      studentId: 'stu_1',
      hostelId: 'hst_s_3',
      roomId: 'rm_s_8',
      bedSpace: 'B1',
      semesterStart: '2025/2026 • Second',
      semesterEnd: '2026/2027 • First',
      status: 'Rejected',
      createdAt: '2026-02-02T10:00:00.000Z',
    },
  ];

  return {
    currentStudentId: 'stu_1',
    students,
    rules,
    hostels,
    rooms,
    bookings,
    allocations,
  };
};

const loadState = (): PersistedState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as PersistedState;
    if (!parsed?.students || !parsed?.rules || !parsed?.hostels || !parsed?.rooms || !parsed?.bookings || !parsed?.allocations) return initialState();
    return parsed;
  } catch {
    return initialState();
  }
};

const StudentHostelContext = createContext<StudentHostelContextType | undefined>(undefined);

export const StudentHostelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastTimers = useRef<Record<string, number>>({});
  const [persisted, setPersisted] = useState<PersistedState>(() => loadState());

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 350);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
    }
  }, [persisted]);

  const pushToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = createId();
    setToasts(prev => [{ ...toast, id }, ...prev].slice(0, 4));
    if (toastTimers.current[id]) window.clearTimeout(toastTimers.current[id]);
    toastTimers.current[id] = window.setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      delete toastTimers.current[id];
    }, 3000);
  };

  const dismissToast = (toastId: string) => {
    if (toastTimers.current[toastId]) window.clearTimeout(toastTimers.current[toastId]);
    delete toastTimers.current[toastId];
    setToasts(prev => prev.filter(t => t.id !== toastId));
  };

  const currentStudent = useMemo(() => {
    return persisted.students.find(s => s.id === persisted.currentStudentId) ?? null;
  }, [persisted.currentStudentId, persisted.students]);

  const activeRule = useMemo(() => {
    return persisted.rules.find(r => r.isActive) ?? null;
  }, [persisted.rules]);

  const isEligible = useMemo(() => {
    if (!currentStudent || !activeRule) return false;
    return activeRule.eligibleLevels.includes(currentStudent.level);
  }, [activeRule, currentStudent]);

  const eligibleHostels = useMemo(() => {
    if (!currentStudent) return [];
    return persisted.hostels.filter(h => h.gender === currentStudent.gender);
  }, [currentStudent, persisted.hostels]);

  const getRoomsForHostel = (hostelId: string) => {
    return persisted.rooms.filter(r => r.hostelId === hostelId).slice().sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));
  };

  const getRoom = (roomId: string) => {
    return persisted.rooms.find(r => r.id === roomId) ?? null;
  };

  const getAvailableBedsForHostel = (hostelId: string) => {
    return persisted.rooms
      .filter(r => r.hostelId === hostelId)
      .reduce((sum, r) => sum + Math.max(0, r.bedCapacity - r.occupiedBeds), 0);
  };

  const createBooking = (input: { hostelId: string; roomId: string; semesterStart: string; semesterEnd: string }): HostelBooking | null => {
    if (!currentStudent) return null;
    if (!activeRule || !activeRule.eligibleLevels.includes(currentStudent.level)) {
      pushToast({ type: 'error', title: 'Not eligible', message: 'Your level is not eligible for hostel booking.' });
      return null;
    }

    const hostel = persisted.hostels.find(h => h.id === input.hostelId);
    if (!hostel || hostel.gender !== currentStudent.gender) {
      pushToast({ type: 'error', title: 'Invalid hostel', message: 'Please select an eligible hostel.' });
      return null;
    }

    const roomIndex = persisted.rooms.findIndex(r => r.id === input.roomId);
    const room = roomIndex >= 0 ? persisted.rooms[roomIndex] : null;
    if (!room || room.hostelId !== hostel.id) {
      pushToast({ type: 'error', title: 'Invalid room', message: 'Please select a valid room.' });
      return null;
    }

    if (room.occupiedBeds >= room.bedCapacity) {
      pushToast({ type: 'error', title: 'Room full', message: 'This room is currently full.' });
      return null;
    }

    const bedSpace = `B${room.occupiedBeds + 1}`;
    const booking: HostelBooking = {
      id: createId(),
      studentId: currentStudent.id,
      hostelId: hostel.id,
      roomId: room.id,
      bedSpace,
      semesterStart: input.semesterStart,
      semesterEnd: input.semesterEnd,
      status: 'Pending',
      createdAt: nowIso(),
    };

    setPersisted(prev => {
      const nextRooms = [...prev.rooms];
      const currentRoom = nextRooms[roomIndex];
      nextRooms[roomIndex] = { ...currentRoom, occupiedBeds: currentRoom.occupiedBeds + 1 };
      return { ...prev, rooms: nextRooms, bookings: [booking, ...prev.bookings] };
    });

    pushToast({ type: 'success', title: 'Booking submitted', message: 'Your request is pending approval.' });
    return booking;
  };

  const cancelLatestPendingBooking = () => {
    if (!currentStudent) return;
    setPersisted(prev => {
      const pending = prev.bookings.find(b => b.studentId === currentStudent.id && b.status === 'Pending');
      if (!pending) return prev;
      const roomIndex = prev.rooms.findIndex(r => r.id === pending.roomId);
      const nextRooms = [...prev.rooms];
      if (roomIndex >= 0) {
        const r = nextRooms[roomIndex];
        nextRooms[roomIndex] = { ...r, occupiedBeds: Math.max(0, r.occupiedBeds - 1) };
      }
      return { ...prev, rooms: nextRooms, bookings: prev.bookings.filter(b => b.id !== pending.id) };
    });
    pushToast({ type: 'info', title: 'Booking cancelled' });
  };

  const value = useMemo<StudentHostelContextType>(() => {
    return {
      ...persisted,
      ready,
      toasts,
      currentStudent,
      activeRule,
      isEligible,
      eligibleHostels,
      getAvailableBedsForHostel,
      getRoomsForHostel,
      getRoom,
      createBooking,
      cancelLatestPendingBooking,
      pushToast,
      dismissToast,
    };
  }, [activeRule, currentStudent, eligibleHostels, persisted, ready, toasts]);

  return <StudentHostelContext.Provider value={value}>{children}</StudentHostelContext.Provider>;
};

export const useStudentHostel = () => {
  const context = useContext(StudentHostelContext);
  if (!context) throw new Error('useStudentHostel must be used within a StudentHostelProvider');
  return context;
};

