export type StudentStatus = 'Active' | 'Alumni' | 'Suspended';

export interface StudentRecord {
  id: string;
  fullName: string;
  matricNo: string;
  email: string;
  phone?: string;
  address?: string;
  faculty: string;
  department: string;
  programme: string;
  level: string;
  status: StudentStatus;
  session: string;
  joinDate?: string;
}

export interface StudentsOverviewData {
  totals: {
    total: number;
    active: number;
    alumni: number;
    suspended: number;
  };
  sessions: string[];
  students: StudentRecord[];
}

