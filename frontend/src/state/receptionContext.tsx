import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface Visitor {
  id: string;
  name: string;
  phone: string;
  purpose: string;
  personToSee: string;
  checkInTime: string;
  checkOutTime?: string;
  date: string;
}

export interface Appointment {
  id: string;
  visitorName: string;
  date: string;
  time: string;
  purpose: string;
  personToSee: string;
  status: 'Scheduled' | 'Arrived' | 'Completed' | 'Cancelled';
}

export interface Enquiry {
  id: string;
  name: string;
  contact: string;
  medium: 'Phone' | 'Walk-in' | 'Email';
  subject: string;
  details: string;
  date: string;
  status: 'Open' | 'Closed' | 'Follow-up';
}

export interface Mail {
  id: string;
  type: 'Incoming' | 'Outgoing';
  sender: string;
  recipient: string;
  referenceNumber?: string;
  date: string;
  status: 'Received' | 'Dispatched' | 'Delivered';
  description: string;
}

interface ReceptionContextValue {
  visitors: Visitor[];
  setVisitors: React.Dispatch<React.SetStateAction<Visitor[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  enquiries: Enquiry[];
  setEnquiries: React.Dispatch<React.SetStateAction<Enquiry[]>>;
  mails: Mail[];
  setMails: React.Dispatch<React.SetStateAction<Mail[]>>;
}

const ReceptionContext = createContext<ReceptionContextValue | undefined>(undefined);

const initialVisitors: Visitor[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '555-1234',
    purpose: 'Vendor Meeting',
    personToSee: 'Mr. Smith',
    checkInTime: '09:00',
    date: '2024-03-15'
  }
];

const initialAppointments: Appointment[] = [
  {
    id: '1',
    visitorName: 'Jane Alice',
    date: '2024-03-20',
    time: '14:00',
    purpose: 'Admission Enquiry',
    personToSee: 'Admissions Officer',
    status: 'Scheduled'
  }
];

const initialEnquiries: Enquiry[] = [
  {
    id: '1',
    name: 'Robert Brown',
    contact: 'robert@example.com',
    medium: 'Email',
    subject: 'Tuition Fees',
    details: 'Asking about payment installments',
    date: '2024-03-14',
    status: 'Open'
  }
];

const initialMails: Mail[] = [
  {
    id: '1',
    type: 'Incoming',
    sender: 'Ministry of Education',
    recipient: 'Principal',
    referenceNumber: 'MOE/2024/001',
    date: '2024-03-10',
    status: 'Received',
    description: 'Policy Update Circular'
  }
];

export const ReceptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visitors, setVisitors] = useState<Visitor[]>(initialVisitors);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [mails, setMails] = useState<Mail[]>(initialMails);

  return (
    <ReceptionContext.Provider
      value={{
        visitors,
        setVisitors,
        appointments,
        setAppointments,
        enquiries,
        setEnquiries,
        mails,
        setMails
      }}
    >
      {children}
    </ReceptionContext.Provider>
  );
};

export const useReception = () => {
  const context = useContext(ReceptionContext);
  if (!context) {
    throw new Error('useReception must be used within ReceptionProvider');
  }
  return context;
};
