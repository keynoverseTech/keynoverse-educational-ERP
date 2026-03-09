import React, { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

export type StudentLevel = '100' | '200' | '300' | '400' | '500';
export type BusStatus = 'Active' | 'Maintenance';
export type TransportApplicationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Expired';
export type TransportAllocationStatus = 'Active' | 'Expired';

export interface StudentProfile {
  id: string;
  fullName: string;
  studentId: string;
  level: StudentLevel;
}

export interface TransportRouteStop {
  id: string;
  stopName: string;
  pickupTime: string;
  distanceKm?: number;
}

export interface TransportRoute {
  id: string;
  routeName: string;
  estimatedTime: string;
  allowedLevels: StudentLevel[];
}

export interface TransportBus {
  id: string;
  busNumber: string;
  capacity: number;
  routeId: string;
  status: BusStatus;
}

export interface TransportApplication {
  id: string;
  studentId: string;
  routeId: string;
  stopId: string;
  semester: string;
  status: TransportApplicationStatus;
  createdAt: string;
}

export interface StudentTransportAllocation {
  id: string;
  studentId: string;
  routeId: string;
  busId: string;
  stopId: string;
  pickupTime: string;
  semester: string;
  status: TransportAllocationStatus;
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
  routes: TransportRoute[];
  stopsByRoute: Record<string, TransportRouteStop[]>;
  buses: TransportBus[];
  applications: TransportApplication[];
  allocations: StudentTransportAllocation[];
};

type StudentTransportContextType = PersistedState & {
  ready: boolean;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  pushToast: (toast: Omit<ToastMessage, 'id'>) => void;
  currentStudent: StudentProfile | null;
  eligibleRoutes: TransportRoute[];
  getStopsForRoute: (routeId: string) => TransportRouteStop[];
  getRouteAvailableSeats: (routeId: string) => number;
  getRouteTotalSeats: (routeId: string) => number;
  getMyActiveAllocation: () => StudentTransportAllocation | null;
  getMyLatestApplication: () => TransportApplication | null;
  createApplication: (input: { routeId: string; stopId: string; semester: string }) => TransportApplication | null;
  cancelLatestPendingApplication: () => void;
};

const STORAGE_KEY = 'student_transport_v1';

const createId = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const nowIso = () => new Date().toISOString();

const initialState = (): PersistedState => {
  const students: StudentProfile[] = [
    { id: 'stu_t_1', fullName: 'Samuel John', studentId: 'STD/2024/021', level: '200' },
    { id: 'stu_t_2', fullName: 'Zainab Musa', studentId: 'STD/2024/114', level: '400' },
  ];

  const routes: TransportRoute[] = [
    { id: 'rt_s_1', routeName: 'City Route', estimatedTime: '45 mins', allowedLevels: ['100', '200', '300', '400', '500'] },
    { id: 'rt_s_2', routeName: 'North Campus Route', estimatedTime: '35 mins', allowedLevels: ['100', '200', '300'] },
    { id: 'rt_s_3', routeName: 'East Residential Route', estimatedTime: '30 mins', allowedLevels: ['200', '300', '400'] },
  ];

  const stopsByRoute: Record<string, TransportRouteStop[]> = {
    rt_s_1: [
      { id: 'st_s_1', stopName: 'Main Gate', pickupTime: '07:10 AM', distanceKm: 0.5 },
      { id: 'st_s_2', stopName: 'City Center', pickupTime: '07:30 AM', distanceKm: 4.0 },
      { id: 'st_s_3', stopName: 'Campus Gate', pickupTime: '08:00 AM', distanceKm: 7.2 },
    ],
    rt_s_2: [
      { id: 'st_s_4', stopName: 'North Market', pickupTime: '06:45 AM', distanceKm: 2.5 },
      { id: 'st_s_5', stopName: 'Student Estate', pickupTime: '07:15 AM', distanceKm: 5.3 },
      { id: 'st_s_6', stopName: 'Science Block', pickupTime: '07:45 AM', distanceKm: 8.1 },
    ],
    rt_s_3: [
      { id: 'st_s_7', stopName: 'East Residential 1', pickupTime: '07:05 AM', distanceKm: 3.2 },
      { id: 'st_s_8', stopName: 'East Residential 2', pickupTime: '07:20 AM', distanceKm: 4.6 },
      { id: 'st_s_9', stopName: 'Library Junction', pickupTime: '07:45 AM', distanceKm: 6.2 },
    ],
  };

  const buses: TransportBus[] = [
    { id: 'bus_s_1', busNumber: 'Bus 1', capacity: 40, routeId: 'rt_s_1', status: 'Active' },
    { id: 'bus_s_2', busNumber: 'Bus 2', capacity: 18, routeId: 'rt_s_1', status: 'Maintenance' },
    { id: 'bus_s_3', busNumber: 'Bus 3', capacity: 50, routeId: 'rt_s_2', status: 'Active' },
    { id: 'bus_s_4', busNumber: 'Bus 4', capacity: 30, routeId: 'rt_s_3', status: 'Active' },
  ];

  const allocations: StudentTransportAllocation[] = [
    {
      id: 'ta_s_1',
      studentId: 'stu_t_1',
      routeId: 'rt_s_1',
      busId: 'bus_s_1',
      stopId: 'st_s_2',
      pickupTime: '07:30 AM',
      semester: '2025/2026 • Second',
      status: 'Active',
      createdAt: '2026-02-12T10:00:00.000Z',
    },
  ];

  const applications: TransportApplication[] = [
    {
      id: 'app_s_1',
      studentId: 'stu_t_1',
      routeId: 'rt_s_2',
      stopId: 'st_s_5',
      semester: '2025/2026 • First',
      status: 'Rejected',
      createdAt: '2025-10-02T10:00:00.000Z',
    },
    {
      id: 'app_s_2',
      studentId: 'stu_t_1',
      routeId: 'rt_s_1',
      stopId: 'st_s_2',
      semester: '2025/2026 • Second',
      status: 'Approved',
      createdAt: '2026-02-10T10:00:00.000Z',
    },
  ];

  return {
    currentStudentId: 'stu_t_1',
    students,
    routes,
    stopsByRoute,
    buses,
    applications,
    allocations,
  };
};

const loadState = (): PersistedState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as PersistedState;
    if (!parsed?.students || !parsed?.routes || !parsed?.stopsByRoute || !parsed?.buses || !parsed?.applications || !parsed?.allocations) return initialState();
    return parsed;
  } catch {
    return initialState();
  }
};

const StudentTransportContext = createContext<StudentTransportContextType | undefined>(undefined);

export const StudentTransportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [persisted, setPersisted] = useState<PersistedState>(() => loadState());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastTimers = useRef<Record<string, number>>({});

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

  const dismissToast = (id: string) => {
    if (toastTimers.current[id]) window.clearTimeout(toastTimers.current[id]);
    delete toastTimers.current[id];
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const currentStudent = useMemo(() => {
    return persisted.students.find(s => s.id === persisted.currentStudentId) ?? null;
  }, [persisted.currentStudentId, persisted.students]);

  const getStopsForRoute = (routeId: string) => {
    return (persisted.stopsByRoute[routeId] ?? []).slice();
  };

  const getRouteTotalSeats = (routeId: string) => {
    return persisted.buses.filter(b => b.routeId === routeId && b.status === 'Active').reduce((sum, b) => sum + b.capacity, 0);
  };

  const getRouteAvailableSeats = (routeId: string) => {
    const totalSeats = getRouteTotalSeats(routeId);
    const occupied = persisted.allocations.filter(a => a.routeId === routeId && a.status === 'Active').length;
    return Math.max(0, totalSeats - occupied);
  };

  const eligibleRoutes = useMemo(() => {
    if (!currentStudent) return [];
    return persisted.routes
      .filter(r => r.allowedLevels.includes(currentStudent.level))
      .filter(r => getRouteAvailableSeats(r.id) > 0);
  }, [currentStudent, persisted.routes, persisted.allocations, persisted.buses]);

  const getMyActiveAllocation = () => {
    if (!currentStudent) return null;
    return persisted.allocations.find(a => a.studentId === currentStudent.id && a.status === 'Active') ?? null;
  };

  const getMyLatestApplication = () => {
    if (!currentStudent) return null;
    return persisted.applications.find(a => a.studentId === currentStudent.id) ?? null;
  };

  const createApplication = (input: { routeId: string; stopId: string; semester: string }) => {
    if (!currentStudent) return null;
    const route = persisted.routes.find(r => r.id === input.routeId);
    if (!route || !route.allowedLevels.includes(currentStudent.level)) {
      pushToast({ type: 'error', title: 'Not eligible', message: 'You are not eligible for this route.' });
      return null;
    }
    if (getRouteAvailableSeats(route.id) <= 0) {
      pushToast({ type: 'error', title: 'No seats available', message: 'This route is currently full.' });
      return null;
    }
    const stop = getStopsForRoute(route.id).find(s => s.id === input.stopId);
    if (!stop) {
      pushToast({ type: 'error', title: 'Invalid stop', message: 'Please select a valid stop.' });
      return null;
    }

    const application: TransportApplication = {
      id: createId(),
      studentId: currentStudent.id,
      routeId: route.id,
      stopId: stop.id,
      semester: input.semester,
      status: 'Pending',
      createdAt: nowIso(),
    };

    setPersisted(prev => ({ ...prev, applications: [application, ...prev.applications] }));
    pushToast({ type: 'success', title: 'Application submitted', message: 'Your request is pending approval.' });
    return application;
  };

  const cancelLatestPendingApplication = () => {
    if (!currentStudent) return;
    setPersisted(prev => {
      const latest = prev.applications.find(a => a.studentId === currentStudent.id && a.status === 'Pending');
      if (!latest) return prev;
      return { ...prev, applications: prev.applications.filter(a => a.id !== latest.id) };
    });
    pushToast({ type: 'info', title: 'Application cancelled' });
  };

  const value = useMemo<StudentTransportContextType>(() => {
    return {
      ...persisted,
      ready,
      toasts,
      pushToast,
      dismissToast,
      currentStudent,
      eligibleRoutes,
      getStopsForRoute,
      getRouteAvailableSeats,
      getRouteTotalSeats,
      getMyActiveAllocation,
      getMyLatestApplication,
      createApplication,
      cancelLatestPendingApplication,
    };
  }, [eligibleRoutes, persisted, ready, toasts, currentStudent]);

  return <StudentTransportContext.Provider value={value}>{children}</StudentTransportContext.Provider>;
};

export const useStudentTransport = () => {
  const context = useContext(StudentTransportContext);
  if (!context) throw new Error('useStudentTransport must be used within a StudentTransportProvider');
  return context;
};

