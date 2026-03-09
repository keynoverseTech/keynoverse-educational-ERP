import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface BookingWindow {
  id: string;
  type: 'Hostel' | 'Transport';
  startDate: string;
  endDate: string;
  status: 'Active' | 'Upcoming' | 'Closed';
  description: string;
  targetGroup: string;
}

// --- Types ---

export interface RouteStop {
  id: string;
  name: string;
  time: string;
}

export interface TransportRoute {
  id: string;
  routeName: string;
  description?: string;
  totalStops: number;
  estimatedTime?: string;
  stops: RouteStop[];
  fare: number;
  capacity: number;
  status: 'Active' | 'Inactive';
}

export interface Vehicle {
  id: string;
  busNumber: string;
  model: string;
  capacity: number;
  driver: string;
  routeId?: string;
  status: 'Active' | 'Maintenance' | 'Inactive';
}

export interface TransportRequest {
  id: string;
  studentName: string;
  studentId: string;
  level: string;
  routeId: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface TransportAllocation {
  id: string;
  studentName: string;
  studentId: string;
  busId: string;
  routeId: string;
  seatNumber: string;
  semester: string;
  status: 'Active' | 'Expired';
  createdAt: string;
}

export interface TransportSubscription {
  id: string;
  studentName: string;
  studentId: string;
  routeId: string;
  status: 'Active' | 'Expired' | 'Pending Payment';
  expiryDate: string;
  paymentStatus: 'Paid' | 'Unpaid';
}

interface TransportContextType {
  routes: TransportRoute[];
  vehicles: Vehicle[];
  subscriptions: TransportSubscription[];
  bookingWindows: BookingWindow[]; // Reuse type structure
  transportRequests: TransportRequest[];
  allocations: TransportAllocation[];

  // Derived
  busOccupiedSeats: (busId: string) => number;
  busAvailableSeats: (busId: string) => number;

  // Actions
  addRoute: (route: Omit<TransportRoute, 'id'>) => void;
  updateRoute: (id: string, updates: Partial<TransportRoute>) => void;
  deleteRoute: (id: string) => void;

  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;

  addSubscription: (sub: Omit<TransportSubscription, 'id'>) => void;
  updateSubscription: (id: string, updates: Partial<TransportSubscription>) => void;
 
  addStopToRoute: (routeId: string, stop: Omit<RouteStop, 'id'>) => void;
  updateStopOnRoute: (routeId: string, stopId: string, updates: Partial<RouteStop>) => void;
  deleteStopFromRoute: (routeId: string, stopId: string) => void;
 
  addTransportRequest: (req: Omit<TransportRequest, 'id' | 'status' | 'requestDate'>) => void;
  approveRequest: (requestId: string, busId: string, seatNumber: string, semester: string) => boolean;
  rejectRequest: (requestId: string) => void;
  expireAllocation: (allocationId: string) => void;
  
  updateBookingWindow: (window: BookingWindow) => void;
}

// --- Initial Data ---

const initialRoutes: TransportRoute[] = [
  {
    id: '1',
    routeName: 'City Route',
    description: 'Covers main gate → city center → campus',
    totalStops: 3,
    estimatedTime: '45 mins',
    stops: [
      { id: 's1', name: 'Main Gate', time: '07:30 AM' },
      { id: 's2', name: 'City Center', time: '07:45 AM' },
      { id: 's3', name: 'Campus Gate', time: '08:00 AM' }
    ],
    fare: 5000,
    capacity: 40,
    status: 'Active'
  },
  {
    id: '2',
    routeName: 'North Campus Route',
    description: 'Shuttle from north market to science block',
    totalStops: 3,
    estimatedTime: '35 mins',
    stops: [
      { id: 's4', name: 'North Market', time: '06:45 AM' },
      { id: 's5', name: 'Student Estate', time: '07:15 AM' },
      { id: 's6', name: 'Science Block', time: '07:45 AM' }
    ],
    fare: 15000,
    capacity: 50,
    status: 'Active'
  }
];

const initialVehicles: Vehicle[] = [
  { id: '1', busNumber: 'BUS-001', model: 'Toyota Coaster', capacity: 40, driver: 'Mr. Samuel Ojo', routeId: '1', status: 'Active' },
  { id: '2', busNumber: 'BUS-002', model: 'Mercedes Sprinter', capacity: 18, driver: 'Mr. David King', routeId: '1', status: 'Maintenance' },
  { id: '3', busNumber: 'BUS-003', model: 'Marcopolo Bus', capacity: 50, driver: 'Mr. Frank Edo', routeId: '2', status: 'Active' },
];

const initialSubscriptions: TransportSubscription[] = [
  { id: '1', studentName: 'Alice Doe', studentId: 'STD/001', routeId: '1', status: 'Active', expiryDate: '2024-12-20', paymentStatus: 'Paid' },
  { id: '2', studentName: 'Bob Smith', studentId: 'STD/002', routeId: '2', status: 'Expired', expiryDate: '2024-05-20', paymentStatus: 'Paid' },
  { id: '3', studentName: 'Charlie Brown', studentId: 'STD/003', routeId: '1', status: 'Pending Payment', expiryDate: '-', paymentStatus: 'Unpaid' },
];

const initialWindows: BookingWindow[] = [
  {
    id: '1',
    type: 'Transport',
    startDate: '2024-09-05',
    endDate: '2024-09-25',
    status: 'Upcoming',
    description: 'Semester Transport Pass Booking',
    targetGroup: 'All Students'
  }
];

const initialRequests: TransportRequest[] = [
  { id: 'tr_1', studentName: 'Alex Johnson', studentId: 'STD/2024/001', level: '200', routeId: '1', requestDate: '2026-03-01', status: 'Pending' },
  { id: 'tr_2', studentName: 'Mary Obi', studentId: 'STD/2024/011', level: '100', routeId: '2', requestDate: '2026-03-02', status: 'Pending' },
  { id: 'tr_3', studentName: 'Chinedu Eze', studentId: 'STD/2023/055', level: '300', routeId: '1', requestDate: '2026-03-03', status: 'Rejected' },
];

const initialAllocations: TransportAllocation[] = [
  { id: 'ta_1', studentName: 'Grace Okafor', studentId: 'STD/2023/114', busId: '1', routeId: '1', seatNumber: 'S12', semester: '2025/2026 • Second', status: 'Active', createdAt: '2026-02-10T10:00:00.000Z' },
];

// --- Context ---

const TransportContext = createContext<TransportContextType | undefined>(undefined);

export const TransportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<TransportRoute[]>(initialRoutes);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [subscriptions, setSubscriptions] = useState<TransportSubscription[]>(initialSubscriptions);
  const [bookingWindows, setBookingWindows] = useState<BookingWindow[]>(initialWindows);
  const [transportRequests, setTransportRequests] = useState<TransportRequest[]>(initialRequests);
  const [allocations, setAllocations] = useState<TransportAllocation[]>(initialAllocations);

  // --- Actions ---

  const addRoute = (routeData: Omit<TransportRoute, 'id'>) => {
    setRoutes([...routes, { ...routeData, id: Date.now().toString() }]);
  };

  const updateRoute = (id: string, updates: Partial<TransportRoute>) => {
    setRoutes(routes.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRoute = (id: string) => {
    setRoutes(routes.filter(r => r.id !== id));
    setVehicles(vs => vs.map(v => (v.routeId === id ? { ...v, routeId: undefined } : v)));
    setTransportRequests(rs => rs.filter(r => r.routeId !== id));
    setAllocations(as => as.filter(a => a.routeId !== id));
  };

  const addVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    setVehicles([...vehicles, { ...vehicleData, id: Date.now().toString() }]);
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const deleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
    setAllocations(as => as.filter(a => a.busId !== id));
  };

  const addSubscription = (subData: Omit<TransportSubscription, 'id'>) => {
    setSubscriptions([...subscriptions, { ...subData, id: Date.now().toString() }]);
  };

  const updateSubscription = (id: string, updates: Partial<TransportSubscription>) => {
    setSubscriptions(subscriptions.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addStopToRoute = (routeId: string, stop: Omit<RouteStop, 'id'>) => {
    setRoutes(prev =>
      prev.map(r =>
        r.id === routeId ? { ...r, stops: [...r.stops, { ...stop, id: Date.now().toString() }], totalStops: r.stops.length + 1 } : r
      )
    );
  };

  const updateStopOnRoute = (routeId: string, stopId: string, updates: Partial<RouteStop>) => {
    setRoutes(prev =>
      prev.map(r =>
        r.id === routeId ? { ...r, stops: r.stops.map(s => (s.id === stopId ? { ...s, ...updates } : s)) } : r
      )
    );
  };

  const deleteStopFromRoute = (routeId: string, stopId: string) => {
    setRoutes(prev =>
      prev.map(r =>
        r.id === routeId ? { ...r, stops: r.stops.filter(s => s.id !== stopId), totalStops: Math.max(0, r.totalStops - 1) } : r
      )
    );
  };

  const addTransportRequest = (req: Omit<TransportRequest, 'id' | 'status' | 'requestDate'>) => {
    setTransportRequests(prev => [{ ...req, id: Date.now().toString(), status: 'Pending', requestDate: new Date().toISOString().slice(0, 10) }, ...prev]);
  };

  const approveRequest = (requestId: string, busId: string, seatNumber: string, semester: string) => {
    const req = transportRequests.find(r => r.id === requestId && r.status === 'Pending');
    const bus = vehicles.find(v => v.id === busId);
    if (!req || !bus) return false;
    const occupied = allocations.filter(a => a.busId === busId && a.status === 'Active').length;
    if (occupied >= bus.capacity) return false;
    const allocation: TransportAllocation = {
      id: Date.now().toString(),
      studentName: req.studentName,
      studentId: req.studentId,
      busId,
      routeId: req.routeId,
      seatNumber,
      semester,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };
    setAllocations(prev => [allocation, ...prev]);
    setTransportRequests(prev => prev.map(r => (r.id === requestId ? { ...r, status: 'Approved' } : r)));
    return true;
  };

  const rejectRequest = (requestId: string) => {
    setTransportRequests(prev => prev.map(r => (r.id === requestId ? { ...r, status: 'Rejected' } : r)));
  };

  const expireAllocation = (allocationId: string) => {
    setAllocations(prev => prev.map(a => (a.id === allocationId ? { ...a, status: 'Expired' } : a)));
  };

  const updateBookingWindow = (window: BookingWindow) => {
    setBookingWindows(prev => prev.map(w => w.id === window.id ? window : w));
  };

  const busOccupiedSeats = (busId: string) => allocations.filter(a => a.busId === busId && a.status === 'Active').length;
  const busAvailableSeats = (busId: string) => {
    const bus = vehicles.find(v => v.id === busId);
    if (!bus) return 0;
    return Math.max(0, bus.capacity - busOccupiedSeats(busId));
  };

  return (
    <TransportContext.Provider value={{
      routes,
      vehicles,
      subscriptions,
      bookingWindows,
      transportRequests,
      allocations,
      busOccupiedSeats,
      busAvailableSeats,
      addRoute,
      updateRoute,
      deleteRoute,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      addSubscription,
      updateSubscription,
      addStopToRoute,
      updateStopOnRoute,
      deleteStopFromRoute,
      addTransportRequest,
      approveRequest,
      rejectRequest,
      expireAllocation,
      updateBookingWindow
    }}>
      {children}
    </TransportContext.Provider>
  );
};

export const useTransport = () => {
  const context = useContext(TransportContext);
  if (context === undefined) {
    throw new Error('useTransport must be used within a TransportProvider');
  }
  return context;
};
