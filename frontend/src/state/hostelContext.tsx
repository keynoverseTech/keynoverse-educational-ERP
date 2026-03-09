import React, { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

export type HostelGender = 'Male' | 'Female';
export type RoomType = 'Standard' | 'Premium';
export type BookingRequestStatus = 'Pending' | 'Approved' | 'Rejected';
export type AllocationStatus = 'Active' | 'Expired' | 'Completed';
export type AllocationRuleType = 'Eligible Levels = 100–300' | 'Eligible Levels = 100–500';
export type ReallocationPolicy = 'Change room every 2 semesters' | 'Keep same room until graduation';

export interface HostelBuilding {
  id: string;
  hostelName: string;
  gender: HostelGender;
  description: string;
  totalFloors: number;
  createdAt: string;
}

export interface HostelRoom {
  id: string;
  hostelId: string;
  roomNumber: string;
  bedCapacity: number;
  occupiedBeds: number;
  roomType: RoomType;
}

export interface HostelAllocationRule {
  id: string;
  ruleType: AllocationRuleType;
  eligibleLevels: string[];
  allocationDurationSemesters: number;
  reallocationPolicy: ReallocationPolicy;
  isActive: boolean;
  createdAt: string;
}

export interface HostelBookingRequest {
  id: string;
  studentName: string;
  studentId: string;
  level: string;
  gender: HostelGender;
  requestedHostelId: string;
  requestedRoomId: string | null;
  requestDate: string;
  status: BookingRequestStatus;
}

export interface HostelAllocation {
  id: string;
  studentName: string;
  studentId: string;
  hostelId: string;
  roomId: string;
  bedSpace: string;
  startSemester: string;
  endSemester: string;
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
  hostels: HostelBuilding[];
  rooms: HostelRoom[];
  rules: HostelAllocationRule[];
  bookingRequests: HostelBookingRequest[];
  allocations: HostelAllocation[];
};

type HostelContextType = PersistedState & {
  ready: boolean;
  toasts: ToastMessage[];
  createHostel: (input: Omit<HostelBuilding, 'id' | 'createdAt'>) => void;
  updateHostel: (id: string, updates: Partial<Omit<HostelBuilding, 'id' | 'createdAt'>>) => void;
  deleteHostel: (id: string) => void;
  createRoom: (input: Omit<HostelRoom, 'id' | 'occupiedBeds'>) => void;
  updateRoom: (id: string, updates: Partial<Omit<HostelRoom, 'id'>>) => void;
  deleteRoom: (id: string) => void;
  createRule: (input: Omit<HostelAllocationRule, 'id' | 'createdAt' | 'isActive'> & { isActive?: boolean }) => void;
  updateRule: (id: string, updates: Partial<Omit<HostelAllocationRule, 'id' | 'createdAt'>>) => void;
  activateRule: (id: string) => void;
  approveBookingRequest: (requestId: string, overrides?: { hostelId?: string; roomId?: string | null }) => boolean;
  rejectBookingRequest: (requestId: string) => void;
  completeAllocation: (allocationId: string) => void;
  expireAllocation: (allocationId: string) => void;
  seedBookingRequest: () => void;
  pushToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (toastId: string) => void;
};

const STORAGE_KEY = 'sa_hostel_management_v1';

const createId = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const todayIso = () => new Date().toISOString();

const initialState = (): PersistedState => {
  const hostels: HostelBuilding[] = [
    {
      id: 'hst_1',
      hostelName: 'Unity Hostel (Male)',
      gender: 'Male',
      description: 'Main campus male hostel with standard rooms.',
      totalFloors: 4,
      createdAt: '2025-01-12T09:20:00.000Z',
    },
    {
      id: 'hst_2',
      hostelName: 'Harmony Hostel (Female)',
      gender: 'Female',
      description: 'Female hostel close to the library and lecture halls.',
      totalFloors: 5,
      createdAt: '2025-02-03T14:10:00.000Z',
    },
    {
      id: 'hst_3',
      hostelName: 'Scholar Premium Annex (Male)',
      gender: 'Male',
      description: 'Premium rooms with limited capacity and priority allocation.',
      totalFloors: 3,
      createdAt: '2025-03-20T11:05:00.000Z',
    },
  ];

  const rooms: HostelRoom[] = [
    { id: 'rm_1', hostelId: 'hst_1', roomNumber: '101', bedCapacity: 6, occupiedBeds: 4, roomType: 'Standard' },
    { id: 'rm_2', hostelId: 'hst_1', roomNumber: '102', bedCapacity: 6, occupiedBeds: 6, roomType: 'Standard' },
    { id: 'rm_3', hostelId: 'hst_1', roomNumber: '201', bedCapacity: 4, occupiedBeds: 1, roomType: 'Standard' },
    { id: 'rm_4', hostelId: 'hst_2', roomNumber: 'A11', bedCapacity: 4, occupiedBeds: 2, roomType: 'Standard' },
    { id: 'rm_5', hostelId: 'hst_2', roomNumber: 'A12', bedCapacity: 4, occupiedBeds: 0, roomType: 'Standard' },
    { id: 'rm_6', hostelId: 'hst_2', roomNumber: 'B21', bedCapacity: 2, occupiedBeds: 1, roomType: 'Premium' },
    { id: 'rm_7', hostelId: 'hst_3', roomNumber: 'P01', bedCapacity: 2, occupiedBeds: 2, roomType: 'Premium' },
    { id: 'rm_8', hostelId: 'hst_3', roomNumber: 'P02', bedCapacity: 2, occupiedBeds: 0, roomType: 'Premium' },
    { id: 'rm_9', hostelId: 'hst_3', roomNumber: 'P03', bedCapacity: 1, occupiedBeds: 0, roomType: 'Premium' },
  ];

  const rules: HostelAllocationRule[] = [
    {
      id: 'rule_1',
      ruleType: 'Eligible Levels = 100–300',
      eligibleLevels: ['100', '200', '300'],
      allocationDurationSemesters: 2,
      reallocationPolicy: 'Change room every 2 semesters',
      isActive: true,
      createdAt: '2025-01-10T08:00:00.000Z',
    },
    {
      id: 'rule_2',
      ruleType: 'Eligible Levels = 100–500',
      eligibleLevels: ['100', '200', '300', '400', '500'],
      allocationDurationSemesters: 2,
      reallocationPolicy: 'Keep same room until graduation',
      isActive: false,
      createdAt: '2025-03-05T08:00:00.000Z',
    },
  ];

  const bookingRequests: HostelBookingRequest[] = [
    {
      id: 'req_1',
      studentName: 'Alex Johnson',
      studentId: 'STD/2024/001',
      level: '100',
      gender: 'Male',
      requestedHostelId: 'hst_1',
      requestedRoomId: 'rm_3',
      requestDate: '2026-03-01',
      status: 'Pending',
    },
    {
      id: 'req_2',
      studentName: 'Sarah Williams',
      studentId: 'STD/2024/045',
      level: '200',
      gender: 'Female',
      requestedHostelId: 'hst_2',
      requestedRoomId: 'rm_5',
      requestDate: '2026-03-02',
      status: 'Pending',
    },
    {
      id: 'req_3',
      studentName: 'Michael Brown',
      studentId: 'STD/2024/089',
      level: '300',
      gender: 'Male',
      requestedHostelId: 'hst_3',
      requestedRoomId: 'rm_8',
      requestDate: '2026-03-03',
      status: 'Pending',
    },
    {
      id: 'req_4',
      studentName: 'Grace Okafor',
      studentId: 'STD/2023/114',
      level: '400',
      gender: 'Female',
      requestedHostelId: 'hst_2',
      requestedRoomId: 'rm_6',
      requestDate: '2026-03-03',
      status: 'Rejected',
    },
  ];

  const allocations: HostelAllocation[] = [
    {
      id: 'alc_1',
      studentName: 'David Musa',
      studentId: 'STD/2023/055',
      hostelId: 'hst_1',
      roomId: 'rm_1',
      bedSpace: 'B5',
      startSemester: '2025/2026 • First',
      endSemester: '2025/2026 • Second',
      status: 'Active',
      createdAt: '2025-10-12T10:00:00.000Z',
    },
    {
      id: 'alc_2',
      studentName: 'Amaka Nwosu',
      studentId: 'STD/2022/021',
      hostelId: 'hst_2',
      roomId: 'rm_4',
      bedSpace: 'B3',
      startSemester: '2024/2025 • Second',
      endSemester: '2025/2026 • First',
      status: 'Completed',
      createdAt: '2025-04-05T10:00:00.000Z',
    },
  ];

  return { hostels, rooms, rules, bookingRequests, allocations };
};

const loadState = (): PersistedState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as PersistedState;
    if (!parsed?.hostels || !parsed?.rooms || !parsed?.rules || !parsed?.bookingRequests || !parsed?.allocations) {
      return initialState();
    }
    return parsed;
  } catch {
    return initialState();
  }
};

const HostelContext = createContext<HostelContextType | undefined>(undefined);

export const HostelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [{ hostels, rooms, rules, bookingRequests, allocations }, setPersisted] = useState<PersistedState>(() => loadState());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastTimers = useRef<Record<string, number>>({});

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 450);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ hostels, rooms, rules, bookingRequests, allocations }));
    } catch {
    }
  }, [hostels, rooms, rules, bookingRequests, allocations]);

  const pushToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = createId();
    setToasts(prev => [{ ...toast, id }, ...prev].slice(0, 4));
    if (toastTimers.current[id]) window.clearTimeout(toastTimers.current[id]);
    toastTimers.current[id] = window.setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      delete toastTimers.current[id];
    }, 3200);
  };

  const dismissToast = (toastId: string) => {
    if (toastTimers.current[toastId]) window.clearTimeout(toastTimers.current[toastId]);
    delete toastTimers.current[toastId];
    setToasts(prev => prev.filter(t => t.id !== toastId));
  };

  const createHostel = (input: Omit<HostelBuilding, 'id' | 'createdAt'>) => {
    const hostel: HostelBuilding = { ...input, id: createId(), createdAt: todayIso() };
    setPersisted(prev => ({ ...prev, hostels: [hostel, ...prev.hostels] }));
    pushToast({ type: 'success', title: 'Hostel created', message: hostel.hostelName });
  };

  const updateHostel = (id: string, updates: Partial<Omit<HostelBuilding, 'id' | 'createdAt'>>) => {
    setPersisted(prev => ({
      ...prev,
      hostels: prev.hostels.map(h => (h.id === id ? { ...h, ...updates } : h)),
    }));
    pushToast({ type: 'success', title: 'Hostel updated' });
  };

  const deleteHostel = (id: string) => {
    setPersisted(prev => {
      const nextRooms = prev.rooms.filter(r => r.hostelId !== id);
      const nextRequests = prev.bookingRequests.filter(r => r.requestedHostelId !== id);
      const nextAllocations = prev.allocations.filter(a => a.hostelId !== id);
      return {
        ...prev,
        hostels: prev.hostels.filter(h => h.id !== id),
        rooms: nextRooms,
        bookingRequests: nextRequests,
        allocations: nextAllocations,
      };
    });
    pushToast({ type: 'warning', title: 'Hostel deleted' });
  };

  const createRoom = (input: Omit<HostelRoom, 'id' | 'occupiedBeds'>) => {
    const room: HostelRoom = { ...input, id: createId(), occupiedBeds: 0 };
    setPersisted(prev => ({ ...prev, rooms: [room, ...prev.rooms] }));
    pushToast({ type: 'success', title: 'Room created', message: `${room.roomNumber}` });
  };

  const updateRoom = (id: string, updates: Partial<Omit<HostelRoom, 'id'>>) => {
    setPersisted(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => (r.id === id ? { ...r, ...updates } : r)),
    }));
    pushToast({ type: 'success', title: 'Room updated' });
  };

  const deleteRoom = (id: string) => {
    setPersisted(prev => ({
      ...prev,
      rooms: prev.rooms.filter(r => r.id !== id),
      bookingRequests: prev.bookingRequests.map(req => (req.requestedRoomId === id ? { ...req, requestedRoomId: null } : req)),
      allocations: prev.allocations.filter(a => a.roomId !== id),
    }));
    pushToast({ type: 'warning', title: 'Room deleted' });
  };

  const createRule = (input: Omit<HostelAllocationRule, 'id' | 'createdAt' | 'isActive'> & { isActive?: boolean }) => {
    const isActive = Boolean(input.isActive);
    const rule: HostelAllocationRule = { ...input, id: createId(), createdAt: todayIso(), isActive };
    setPersisted(prev => ({
      ...prev,
      rules: isActive ? [{ ...rule, isActive: true }, ...prev.rules.map(r => ({ ...r, isActive: false }))] : [rule, ...prev.rules],
    }));
    pushToast({ type: 'success', title: 'Rule saved' });
  };

  const updateRule = (id: string, updates: Partial<Omit<HostelAllocationRule, 'id' | 'createdAt'>>) => {
    setPersisted(prev => ({
      ...prev,
      rules: prev.rules.map(r => (r.id === id ? { ...r, ...updates } : r)),
    }));
    pushToast({ type: 'success', title: 'Rule updated' });
  };

  const activateRule = (id: string) => {
    setPersisted(prev => ({
      ...prev,
      rules: prev.rules.map(r => ({ ...r, isActive: r.id === id })),
    }));
    pushToast({ type: 'success', title: 'Allocation rule activated' });
  };

  const approveBookingRequest = (requestId: string, overrides?: { hostelId?: string; roomId?: string | null }): boolean => {
    let ok = true;
    setPersisted(prev => {
      const req = prev.bookingRequests.find(r => r.id === requestId);
      if (!req || req.status !== 'Pending') {
        ok = false;
        return prev;
      }

      const targetHostelId = overrides?.hostelId ?? req.requestedHostelId;
      const targetRoomId = (overrides?.roomId ?? req.requestedRoomId) ?? null;
      if (!targetRoomId) {
        ok = false;
        return prev;
      }

      const hostel = prev.hostels.find(h => h.id === targetHostelId);
      const roomIndex = prev.rooms.findIndex(r => r.id === targetRoomId);
      const room = roomIndex >= 0 ? prev.rooms[roomIndex] : undefined;
      if (!hostel || !room || room.hostelId !== hostel.id) {
        ok = false;
        return prev;
      }

      if (hostel.gender !== req.gender) {
        ok = false;
        return prev;
      }

      if (room.occupiedBeds >= room.bedCapacity) {
        ok = false;
        return prev;
      }

      const nextRooms = [...prev.rooms];
      const nextRoom = { ...room, occupiedBeds: room.occupiedBeds + 1 };
      nextRooms[roomIndex] = nextRoom;

      const bedSpace = `B${nextRoom.occupiedBeds}`;
      const allocation: HostelAllocation = {
        id: createId(),
        studentName: req.studentName,
        studentId: req.studentId,
        hostelId: hostel.id,
        roomId: room.id,
        bedSpace,
        startSemester: '2025/2026 • Second',
        endSemester: '2026/2027 • First',
        status: 'Active',
        createdAt: todayIso(),
      };

      const nextRequests: HostelBookingRequest[] = prev.bookingRequests.map(r =>
        r.id === requestId ? { ...r, status: 'Approved' as const } : r
      );
      return { ...prev, rooms: nextRooms, bookingRequests: nextRequests, allocations: [allocation, ...prev.allocations] };
    });

    if (ok) pushToast({ type: 'success', title: 'Request approved', message: 'Allocation created successfully.' });
    else pushToast({ type: 'error', title: 'Approval failed', message: 'Room is full, mismatch, or selection is invalid.' });
    return ok;
  };

  const rejectBookingRequest = (requestId: string) => {
    setPersisted(prev => ({
      ...prev,
      bookingRequests: prev.bookingRequests.map(r => (r.id === requestId ? { ...r, status: 'Rejected' as const } : r)),
    }));
    pushToast({ type: 'warning', title: 'Request rejected' });
  };

  const completeAllocation = (allocationId: string) => {
    setPersisted(prev => ({
      ...prev,
      allocations: prev.allocations.map(a => (a.id === allocationId ? { ...a, status: 'Completed' } : a)),
    }));
    pushToast({ type: 'success', title: 'Allocation completed' });
  };

  const expireAllocation = (allocationId: string) => {
    setPersisted(prev => ({
      ...prev,
      allocations: prev.allocations.map(a => (a.id === allocationId ? { ...a, status: 'Expired' } : a)),
    }));
    pushToast({ type: 'warning', title: 'Allocation expired' });
  };

  const seedBookingRequest = () => {
    const pool = [
      { name: 'Ibrahim Yusuf', gender: 'Male' as const, level: '200' },
      { name: 'Maryam Bello', gender: 'Female' as const, level: '100' },
      { name: 'Chinedu Eze', gender: 'Male' as const, level: '300' },
      { name: 'Aisha Danjuma', gender: 'Female' as const, level: '500' },
    ];
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setPersisted(prev => {
      const eligibleHostels = prev.hostels.filter(h => h.gender === pick.gender);
      if (eligibleHostels.length === 0) return prev;
      const hostel = eligibleHostels[Math.floor(Math.random() * eligibleHostels.length)];
      const hostelRooms = prev.rooms.filter(r => r.hostelId === hostel.id);
      const room = hostelRooms[Math.floor(Math.random() * hostelRooms.length)] ?? null;
      const req: HostelBookingRequest = {
        id: createId(),
        studentName: pick.name,
        studentId: `STD/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
        level: pick.level,
        gender: pick.gender,
        requestedHostelId: hostel.id,
        requestedRoomId: room?.id ?? null,
        requestDate: new Date().toISOString().slice(0, 10),
        status: 'Pending',
      };
      return { ...prev, bookingRequests: [req, ...prev.bookingRequests] };
    });
    pushToast({ type: 'info', title: 'New booking request', message: 'Mock request added for testing.' });
  };

  const value = useMemo<HostelContextType>(() => {
    return {
      ready,
      hostels,
      rooms,
      rules,
      bookingRequests,
      allocations,
      toasts,
      createHostel,
      updateHostel,
      deleteHostel,
      createRoom,
      updateRoom,
      deleteRoom,
      createRule,
      updateRule,
      activateRule,
      approveBookingRequest,
      rejectBookingRequest,
      completeAllocation,
      expireAllocation,
      seedBookingRequest,
      pushToast,
      dismissToast,
    };
  }, [allocations, bookingRequests, hostels, ready, rooms, rules, toasts]);

  return <HostelContext.Provider value={value}>{children}</HostelContext.Provider>;
};

export const useHostel = () => {
  const context = useContext(HostelContext);
  if (!context) throw new Error('useHostel must be used within a HostelProvider');
  return context;
};
