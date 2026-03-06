import type { AdmissionApplicant, AdmissionsOverviewData, AdmissionsSessionSummary, AdmissionStatus } from './types';

const mockApplicants: AdmissionApplicant[] = [
  {
    id: 'app-1',
    fullName: 'John Doe',
    applicationNo: '2024987654',
    email: 'john@example.com',
    phone: '+234 801 234 5678',
    address: '12 River Road, Lagos',
    nin: '12345678901',
    programme: 'ND Computer Science',
    faculty: 'Science',
    department: 'Computer Science',
    session: '2024/2025',
    entryType: 'UTME',
    utmeScore: 245,
    status: 'Eligible',
    appliedDate: '2024-05-15',
    admissionDate: '2024-09-10',
    guardianName: 'Peter Doe',
    guardianPhone: '+234 808 111 2233',
    guardianAddress: '12 River Road, Lagos',
    portalAccess: { isEnabled: false },
    documents: {
      oLevel: { fileName: 'O-Level Result.pdf' },
      birthCert: { fileName: 'Birth Certificate.pdf' },
      medicalReport: { fileName: 'Medical Report.pdf' },
      jambResult: { fileName: 'JAMB Result.pdf' },
      jambSlip: { fileName: 'JAMB Slip.pdf' },
      passport: { fileName: 'Passport Photo.jpg' },
    },
  },
  {
    id: 'app-2',
    fullName: 'Jane Smith',
    applicationNo: '2024123456',
    email: 'jane@example.com',
    phone: '+234 802 345 6789',
    address: '8 Market Street, Abuja',
    nin: '10987654321',
    programme: 'HND Business Administration',
    faculty: 'Management',
    department: 'Business Administration',
    session: '2024/2025',
    entryType: 'Direct Entry',
    utmeScore: 180,
    status: 'Pending',
    appliedDate: '2024-05-18',
    admissionDate: '2024-09-10',
    guardianName: 'Mary Smith',
    guardianPhone: '+234 809 222 3344',
    guardianAddress: '8 Market Street, Abuja',
    portalAccess: { isEnabled: false },
    documents: {
      oLevel: { fileName: 'O-Level Result.pdf' },
      birthCert: { fileName: 'Birth Certificate.pdf' },
      jambResult: { fileName: 'JAMB Result.pdf' },
      passport: { fileName: 'Passport Photo.jpg' },
    },
  },
  {
    id: 'app-3',
    fullName: 'Michael Brown',
    applicationNo: '2024567890',
    email: 'michael@example.com',
    phone: '+234 803 456 7890',
    address: '22 Hill View, Port Harcourt',
    nin: '23456789012',
    programme: 'ND Mass Communication',
    faculty: 'Arts',
    department: 'Mass Communication',
    session: '2024/2025',
    entryType: 'UTME',
    utmeScore: 280,
    status: 'Admitted',
    appliedDate: '2024-05-10',
    admissionDate: '2024-09-10',
    erpId: 'ERP/2024/001',
    portalAccess: { isEnabled: true, username: 'michael.brown', hasPassword: true },
    documents: {
      oLevel: { fileName: 'O-Level Result.pdf' },
      birthCert: { fileName: 'Birth Certificate.pdf' },
      medicalReport: { fileName: 'Medical Report.pdf' },
      jambResult: { fileName: 'JAMB Result.pdf' },
      jambSlip: { fileName: 'JAMB Slip.pdf' },
      passport: { fileName: 'Passport Photo.jpg' },
    },
  },
  {
    id: 'app-4',
    fullName: 'Sarah Wilson',
    applicationNo: '2024234567',
    email: 'sarah@example.com',
    phone: '+234 804 567 8901',
    address: '14 Lake Road, Enugu',
    nin: '34567890123',
    programme: 'ND Mass Communication',
    faculty: 'Arts',
    department: 'Mass Communication',
    session: '2024/2025',
    entryType: 'UTME',
    utmeScore: 150,
    status: 'Rejected',
    appliedDate: '2024-05-20',
    admissionDate: '2024-09-10',
    guardianName: 'James Wilson',
    guardianPhone: '+234 811 444 5566',
    guardianAddress: '14 Lake Road, Enugu',
    portalAccess: { isEnabled: false },
    documents: {
      passport: { fileName: 'Passport Photo.jpg' },
    },
  },
  {
    id: 'app-5',
    fullName: 'David Lee',
    applicationNo: 'DE2024001',
    email: 'david@example.com',
    phone: '+234 805 678 9012',
    address: '5 Unity Avenue, Ibadan',
    nin: '45678901234',
    programme: 'HND Software Engineering',
    faculty: 'Engineering',
    department: 'Software Engineering',
    session: '2024/2025',
    entryType: 'Transfer',
    utmeScore: 210,
    status: 'Eligible',
    appliedDate: '2024-05-22',
    admissionDate: '2024-09-10',
    guardianName: 'Helen Lee',
    guardianPhone: '+234 812 555 6677',
    guardianAddress: '5 Unity Avenue, Ibadan',
    portalAccess: { isEnabled: false },
  },
  {
    id: 'app-6',
    fullName: 'Aisha Bello',
    applicationNo: '2023560001',
    email: 'aisha@example.com',
    phone: '+234 806 111 2222',
    programme: 'ND Computer Science',
    faculty: 'Science',
    department: 'Computer Science',
    session: '2023/2024',
    entryType: 'UTME',
    utmeScore: 260,
    status: 'Admitted',
    appliedDate: '2023-06-01',
    admissionDate: '2023-10-02',
    erpId: 'ERP/2023/112',
    portalAccess: { isEnabled: true, username: 'aisha.bello', hasPassword: true },
  },
  {
    id: 'app-7',
    fullName: 'Chinedu Okafor',
    applicationNo: '2023560002',
    email: 'chinedu@example.com',
    phone: '+234 807 333 4444',
    programme: 'HND Business Administration',
    faculty: 'Management',
    department: 'Business Administration',
    session: '2023/2024',
    entryType: 'Direct Entry',
    utmeScore: 190,
    status: 'Pending',
    appliedDate: '2023-06-04',
    admissionDate: '2023-10-02',
    portalAccess: { isEnabled: false },
  },
];

const buildSessionSummaries = (applicants: AdmissionApplicant[]): AdmissionsSessionSummary[] => {
  const bySession = new Map<string, AdmissionApplicant[]>();
  for (const applicant of applicants) {
    const arr = bySession.get(applicant.session) ?? [];
    arr.push(applicant);
    bySession.set(applicant.session, arr);
  }

  const countStatus = (items: AdmissionApplicant[], status: AdmissionStatus) =>
    items.filter(a => a.status === status).length;

  return Array.from(bySession.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([session, items]) => {
      const pending = countStatus(items, 'Pending');
      const eligible = countStatus(items, 'Eligible');
      const admitted = countStatus(items, 'Admitted');
      const rejected = countStatus(items, 'Rejected');
      return {
        session,
        total: items.length,
        pending,
        eligible,
        admitted,
        rejected,
        accepted: admitted,
      };
    });
};

export const admissionsOverviewService = {
  async getAdmissionsOverviewData(): Promise<AdmissionsOverviewData> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          sessions: buildSessionSummaries(mockApplicants),
          applicants: mockApplicants,
        });
      }, 600);
    });
  },
  async getApplicantById(id: string): Promise<AdmissionApplicant | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockApplicants.find(a => a.id === id) ?? null);
      }, 250);
    });
  },
};

