import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface Employment {
  id: string;
  alumniId: string;
  employer: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  industry: string;
  location: string;
}

export type TranscriptStatus = 'Pending' | 'Processing' | 'Ready' | 'Delivered';
export type RequestType = 'Transcript' | 'Statement of Result' | 'Certificate Verification';

export interface TranscriptRequest {
  id: string;
  alumniId: string;
  type: RequestType;
  requestDate: string;
  status: TranscriptStatus;
  paymentStatus: 'Paid' | 'Unpaid';
  amount: number;
  deliveryAddress?: string;
  comments?: string;
}

export interface Alumni {
  id: string;
  studentId: string; // Original Matric Number
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  program: string;
  department: string;
  faculty: string;
  graduationYear: number;
  cgpa: number;
  classOfDegree: string;
  employmentStatus: 'Employed' | 'Unemployed' | 'Self-Employed' | 'Further Studies';
  profilePicture?: string;
}

interface AlumniContextType {
  alumni: Alumni[];
  setAlumni: React.Dispatch<React.SetStateAction<Alumni[]>>;
  employments: Employment[];
  setEmployments: React.Dispatch<React.SetStateAction<Employment[]>>;
  transcriptRequests: TranscriptRequest[];
  setTranscriptRequests: React.Dispatch<React.SetStateAction<TranscriptRequest[]>>;
  addTranscriptRequest: (request: Omit<TranscriptRequest, 'id' | 'requestDate' | 'status'>) => void;
  updateTranscriptStatus: (id: string, status: TranscriptStatus) => void;
}

const AlumniContext = createContext<AlumniContextType | undefined>(undefined);

export const useAlumni = () => {
  const context = useContext(AlumniContext);
  if (!context) {
    throw new Error('useAlumni must be used within an AlumniProvider');
  }
  return context;
};

// Mock Data
const MOCK_ALUMNI: Alumni[] = [
  {
    id: '1',
    studentId: 'ALU/2023/001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    gender: 'Male',
    dateOfBirth: '1998-05-15',
    program: 'Computer Science',
    department: 'Computer Science',
    faculty: 'Science',
    graduationYear: 2023,
    cgpa: 4.5,
    classOfDegree: 'First Class',
    employmentStatus: 'Employed',
    profilePicture: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff'
  },
  {
    id: '2',
    studentId: 'ALU/2022/045',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1987654321',
    gender: 'Female',
    dateOfBirth: '1999-08-20',
    program: 'Economics',
    department: 'Economics',
    faculty: 'Social Sciences',
    graduationYear: 2022,
    cgpa: 3.8,
    classOfDegree: 'Second Class Upper',
    employmentStatus: 'Further Studies',
    profilePicture: 'https://ui-avatars.com/api/?name=Jane+Smith&background=E91E63&color=fff'
  },
  {
    id: '3',
    studentId: 'ALU/2021/112',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.b@example.com',
    phone: '+1122334455',
    gender: 'Male',
    dateOfBirth: '1997-12-10',
    program: 'Mechanical Engineering',
    department: 'Mechanical Engineering',
    faculty: 'Engineering',
    graduationYear: 2021,
    cgpa: 3.2,
    classOfDegree: 'Second Class Lower',
    employmentStatus: 'Unemployed',
    profilePicture: 'https://ui-avatars.com/api/?name=Michael+Brown&background=FF9800&color=fff'
  }
];

const MOCK_EMPLOYMENTS: Employment[] = [
  {
    id: '1',
    alumniId: '1',
    employer: 'Tech Solutions Inc.',
    position: 'Software Engineer',
    startDate: '2023-08-01',
    isCurrent: true,
    industry: 'Technology',
    location: 'New York, USA'
  },
  {
    id: '2',
    alumniId: '2',
    employer: 'Harvard University',
    position: 'Masters Student',
    startDate: '2023-09-01',
    isCurrent: true,
    industry: 'Education',
    location: 'Cambridge, MA'
  }
];

const MOCK_TRANSCRIPTS: TranscriptRequest[] = [
  {
    id: 'TR-001',
    alumniId: '1',
    type: 'Transcript',
    requestDate: '2024-01-15',
    status: 'Delivered',
    paymentStatus: 'Paid',
    amount: 50.00,
    deliveryAddress: '123 Tech Lane, NY'
  },
  {
    id: 'TR-002',
    alumniId: '3',
    type: 'Statement of Result',
    requestDate: '2024-02-10',
    status: 'Processing',
    paymentStatus: 'Paid',
    amount: 25.00
  }
];

export const AlumniProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alumni, setAlumni] = useState<Alumni[]>(MOCK_ALUMNI);
  const [employments, setEmployments] = useState<Employment[]>(MOCK_EMPLOYMENTS);
  const [transcriptRequests, setTranscriptRequests] = useState<TranscriptRequest[]>(MOCK_TRANSCRIPTS);

  const addTranscriptRequest = (request: Omit<TranscriptRequest, 'id' | 'requestDate' | 'status'>) => {
    const newRequest: TranscriptRequest = {
      ...request,
      id: `TR-${Math.floor(1000 + Math.random() * 9000)}`,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setTranscriptRequests(prev => [newRequest, ...prev]);
  };

  const updateTranscriptStatus = (id: string, status: TranscriptStatus) => {
    setTranscriptRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status } : req
    ));
  };

  return (
    <AlumniContext.Provider value={{
      alumni,
      setAlumni,
      employments,
      setEmployments,
      transcriptRequests,
      setTranscriptRequests,
      addTranscriptRequest,
      updateTranscriptStatus
    }}>
      {children}
    </AlumniContext.Provider>
  );
};
