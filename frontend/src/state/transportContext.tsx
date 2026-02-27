import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { BookingWindow } from './hostelContext'; // Reuse or redefine type? Let's redefine for independence or reuse if common. Let's redefine slightly or just use similar structure.

// --- Types ---

export interface RouteStop {
  id: string;
  name: string;
  time: string;
}

export interface TransportRoute {
  id: string;
  name: string;
  code: string;
  stops: RouteStop[];
  fare: number;
  capacity: number;
  assignedBus?: string; // Bus ID or Plate
  status: 'Active' | 'Inactive';
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  capacity: number;
  driver: string;
  status: 'Active' | 'Maintenance' | 'Inactive';
}

export interface TransportSubscription {
  id: string;
  studentName: string;
  studentId: string;
  routeId: string;
  routeName: string;
  status: 'Active' | 'Expired' | 'Pending Payment';
  expiryDate: string;
  paymentStatus: 'Paid' | 'Unpaid';
}

interface TransportContextType {
  routes: TransportRoute[];
  vehicles: Vehicle[];
  subscriptions: TransportSubscription[];
  bookingWindows: BookingWindow[]; // Reuse type structure

  // Actions
  addRoute: (route: Omit<TransportRoute, 'id'>) => void;
  updateRoute: (id: string, updates: Partial<TransportRoute>) => void;
  deleteRoute: (id: string) => void;

  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;

  addSubscription: (sub: Omit<TransportSubscription, 'id'>) => void;
  updateSubscription: (id: string, updates: Partial<TransportSubscription>) => void;
  
  updateBookingWindow: (window: BookingWindow) => void;
}

// --- Initial Data ---

const initialRoutes: TransportRoute[] = [
  {
    id: '1',
    name: 'North Campus Shuttle',
    code: 'RT-001',
    stops: [
      { id: 's1', name: 'Main Gate', time: '07:30 AM' },
      { id: 's2', name: 'Science Block', time: '07:45 AM' },
      { id: 's3', name: 'Hostel A', time: '08:00 AM' }
    ],
    fare: 5000,
    capacity: 40,
    assignedBus: 'KJA-123-XY',
    status: 'Active'
  },
  {
    id: '2',
    name: 'City Center Express',
    code: 'RT-002',
    stops: [
      { id: 's4', name: 'City Mall', time: '06:45 AM' },
      { id: 's5', name: 'Central Station', time: '07:15 AM' },
      { id: 's6', name: 'Campus Gate', time: '08:00 AM' }
    ],
    fare: 15000,
    capacity: 50,
    assignedBus: 'LND-789-CD',
    status: 'Active'
  }
];

const initialVehicles: Vehicle[] = [
  { id: '1', plate: 'KJA-123-XY', model: 'Toyota Coaster', capacity: 30, driver: 'Mr. Samuel Ojo', status: 'Active' },
  { id: '2', plate: 'APP-456-AB', model: 'Mercedes Sprinter', capacity: 18, driver: 'Mr. David King', status: 'Maintenance' },
  { id: '3', plate: 'LND-789-CD', model: 'Marcopolo Bus', capacity: 50, driver: 'Mr. Frank Edo', status: 'Active' },
];

const initialSubscriptions: TransportSubscription[] = [
  { id: '1', studentName: 'Alice Doe', studentId: 'STD/001', routeId: '1', routeName: 'North Campus Shuttle', status: 'Active', expiryDate: '2024-12-20', paymentStatus: 'Paid' },
  { id: '2', studentName: 'Bob Smith', studentId: 'STD/002', routeId: '2', routeName: 'City Center Express', status: 'Expired', expiryDate: '2024-05-20', paymentStatus: 'Paid' },
  { id: '3', studentName: 'Charlie Brown', studentId: 'STD/003', routeId: '1', routeName: 'North Campus Shuttle', status: 'Pending Payment', expiryDate: '-', paymentStatus: 'Unpaid' },
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

// --- Context ---

const TransportContext = createContext<TransportContextType | undefined>(undefined);

export const TransportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<TransportRoute[]>(initialRoutes);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [subscriptions, setSubscriptions] = useState<TransportSubscription[]>(initialSubscriptions);
  const [bookingWindows, setBookingWindows] = useState<BookingWindow[]>(initialWindows);

  // --- Actions ---

  const addRoute = (routeData: Omit<TransportRoute, 'id'>) => {
    setRoutes([...routes, { ...routeData, id: Date.now().toString() }]);
  };

  const updateRoute = (id: string, updates: Partial<TransportRoute>) => {
    setRoutes(routes.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRoute = (id: string) => {
    setRoutes(routes.filter(r => r.id !== id));
  };

  const addVehicle = (vehicleData: Omit<Vehicle, 'id'>) => {
    setVehicles([...vehicles, { ...vehicleData, id: Date.now().toString() }]);
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const deleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  const addSubscription = (subData: Omit<TransportSubscription, 'id'>) => {
    setSubscriptions([...subscriptions, { ...subData, id: Date.now().toString() }]);
  };

  const updateSubscription = (id: string, updates: Partial<TransportSubscription>) => {
    setSubscriptions(subscriptions.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const updateBookingWindow = (window: BookingWindow) => {
    setBookingWindows(prev => prev.map(w => w.id === window.id ? window : w));
  };

  return (
    <TransportContext.Provider value={{
      routes,
      vehicles,
      subscriptions,
      bookingWindows,
      addRoute,
      updateRoute,
      deleteRoute,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      addSubscription,
      updateSubscription,
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
