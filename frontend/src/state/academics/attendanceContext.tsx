import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentMatric: string;
  status: 'Present' | 'Absent';
  timestamp: string;
}

export interface AttendanceSession {
  id: string;
  courseCode: string;
  courseTitle: string;
  lecturerName: string;
  department: string;
  program: string;
  date: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  isSubmitted: boolean;
  qrCode?: string;
  link?: string;
  records: AttendanceRecord[];
}

interface AttendanceContextValue {
  sessions: AttendanceSession[];
  setSessions: React.Dispatch<React.SetStateAction<AttendanceSession[]>>;
  createSession: (session: Omit<AttendanceSession, 'id' | 'records' | 'isActive' | 'isSubmitted'>) => void;
  markAttendance: (sessionId: string, studentId: string, status: 'Present' | 'Absent') => void;
  closeSession: (sessionId: string) => void;
  submitAttendance: (sessionId: string) => void;
}

const AttendanceContext = createContext<AttendanceContextValue | undefined>(undefined);

// Mock Data
const MOCK_SESSIONS: AttendanceSession[] = [
  {
    id: '1',
    courseCode: 'CSC 301',
    courseTitle: 'Operating Systems',
    lecturerName: 'Dr. Alan Turing',
    department: 'Computer Science',
    program: 'B.Sc. Computer Science',
    date: '2024-03-20',
    startTime: '10:00',
    endTime: '12:00',
    isActive: true,
    isSubmitted: false,
    qrCode: 'qr-code-data-1',
    link: 'https://school.edu/attendance/1',
    records: [
      { id: 'r1', studentId: 's1', studentName: 'John Doe', studentMatric: 'CSC/20/001', status: 'Present', timestamp: '10:05' },
      { id: 'r2', studentId: 's2', studentName: 'Jane Smith', studentMatric: 'CSC/20/002', status: 'Absent', timestamp: '' },
    ]
  }
];

export const AttendanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<AttendanceSession[]>(MOCK_SESSIONS);

  const createSession = (sessionData: Omit<AttendanceSession, 'id' | 'records' | 'isActive' | 'isSubmitted'>) => {
    const newSession: AttendanceSession = {
      ...sessionData,
      id: Date.now().toString(),
      isActive: true,
      isSubmitted: false,
      // Mocking some enrolled students for the new session
      records: [
        { id: `r-${Date.now()}-1`, studentId: 's3', studentName: 'Michael Johnson', studentMatric: 'CSC/20/003', status: 'Absent', timestamp: '' },
        { id: `r-${Date.now()}-2`, studentId: 's4', studentName: 'Emily Davis', studentMatric: 'CSC/20/004', status: 'Absent', timestamp: '' },
        { id: `r-${Date.now()}-3`, studentId: 's5', studentName: 'David Wilson', studentMatric: 'CSC/20/005', status: 'Absent', timestamp: '' },
      ], 
      qrCode: `qr-${Date.now()}`,
      link: `https://school.edu/attendance/${Date.now()}`
    };
    setSessions([newSession, ...sessions]);
  };

  const markAttendance = (sessionId: string, studentId: string, status: 'Present' | 'Absent') => {
    setSessions(prev => prev.map(s => {
      if (s.id !== sessionId || s.isSubmitted) return s;
      
      const recordIndex = s.records.findIndex(r => r.studentId === studentId);
      if (recordIndex >= 0) {
        const updatedRecords = [...s.records];
        updatedRecords[recordIndex] = { 
          ...updatedRecords[recordIndex], 
          status, 
          timestamp: status === 'Present' ? new Date().toLocaleTimeString() : '' 
        };
        return { ...s, records: updatedRecords };
      }
      return s;
    }));
  };

  const closeSession = (sessionId: string) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, isActive: false } : s
    ));
  };

  const submitAttendance = (sessionId: string) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, isSubmitted: true, isActive: false } : s
    ));
  };

  return (
    <AttendanceContext.Provider value={{
      sessions,
      setSessions,
      createSession,
      markAttendance,
      closeSession,
      submitAttendance
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within AttendanceProvider');
  }
  return context;
};
