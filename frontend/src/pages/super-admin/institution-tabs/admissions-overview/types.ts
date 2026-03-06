export type AdmissionStatus = 'Pending' | 'Eligible' | 'Admitted' | 'Rejected';

export type AdmissionEntryType = 'UTME' | 'Direct Entry' | 'Transfer' | 'Postgraduate';

export interface AdmissionApplicant {
  id: string;
  fullName: string;
  applicationNo: string;
  email: string;
  phone?: string;
  address?: string;
  nin?: string;
  programme: string;
  faculty?: string;
  department?: string;
  session: string;
  entryType: AdmissionEntryType;
  utmeScore?: number;
  status: AdmissionStatus;
  appliedDate?: string;
  admissionDate?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianAddress?: string;
  erpId?: string;
  portalAccess?: {
    isEnabled: boolean;
    username?: string;
    hasPassword?: boolean;
  };
  documents?: {
    oLevel?: { fileName?: string };
    birthCert?: { fileName?: string };
    medicalReport?: { fileName?: string };
    jambResult?: { fileName?: string };
    jambSlip?: { fileName?: string };
    passport?: { fileName?: string };
  };
}

export interface AdmissionsSessionSummary {
  session: string;
  total: number;
  pending: number;
  eligible: number;
  admitted: number;
  rejected: number;
  accepted: number;
}

export interface AdmissionsOverviewData {
  sessions: AdmissionsSessionSummary[];
  applicants: AdmissionApplicant[];
}

