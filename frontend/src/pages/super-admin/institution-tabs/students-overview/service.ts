import type { StudentsOverviewData, StudentRecord } from './types';

const mockStudents: StudentRecord[] = [
  {
    id: 'stu-1',
    fullName: 'Adaeze Okonkwo',
    matricNo: 'NBTE/CSC/24/001',
    email: 'adaeze.okonkwo@example.com',
    phone: '+234 801 111 2222',
    address: 'Ikeja, Lagos',
    faculty: 'Science',
    department: 'Computer Science',
    programme: 'ND Computer Science',
    level: '200L',
    status: 'Active',
    session: '2024/2025',
    joinDate: '2024-10-02',
  },
  {
    id: 'stu-2',
    fullName: 'Bashir Musa',
    matricNo: 'NBTE/BUS/24/033',
    email: 'bashir.musa@example.com',
    phone: '+234 802 222 3333',
    address: 'Abuja, FCT',
    faculty: 'Management',
    department: 'Business Administration',
    programme: 'HND Business Administration',
    level: 'HND 1',
    status: 'Active',
    session: '2024/2025',
    joinDate: '2024-10-04',
  },
  {
    id: 'stu-3',
    fullName: 'Chinonso Nwankwo',
    matricNo: 'NBTE/CSC/23/120',
    email: 'chinonso.nwankwo@example.com',
    faculty: 'Science',
    department: 'Computer Science',
    programme: 'ND Computer Science',
    level: 'Alumni',
    status: 'Alumni',
    session: '2023/2024',
    joinDate: '2022-10-03',
  },
  {
    id: 'stu-4',
    fullName: 'Zainab Usman',
    matricNo: 'NBTE/ENG/24/078',
    email: 'zainab.usman@example.com',
    phone: '+234 803 333 4444',
    faculty: 'Engineering',
    department: 'Software Engineering',
    programme: 'HND Software Engineering',
    level: 'HND 1',
    status: 'Suspended',
    session: '2024/2025',
    joinDate: '2024-10-10',
  },
  {
    id: 'stu-5',
    fullName: 'Emeka Eze',
    matricNo: 'NBTE/MASS/24/012',
    email: 'emeka.eze@example.com',
    phone: '+234 804 555 6666',
    faculty: 'Arts',
    department: 'Mass Communication',
    programme: 'ND Mass Communication',
    level: '100L',
    status: 'Active',
    session: '2024/2025',
    joinDate: '2024-10-01',
  },
];

const buildTotals = (students: StudentRecord[]) => {
  const total = students.length;
  const active = students.filter(s => s.status === 'Active').length;
  const alumni = students.filter(s => s.status === 'Alumni').length;
  const suspended = students.filter(s => s.status === 'Suspended').length;
  return { total, active, alumni, suspended };
};

const sessionsFromData = (students: StudentRecord[]) => {
  return Array.from(new Set(students.map(s => s.session))).sort().reverse();
};

export const studentsOverviewService = {
  async getStudentsOverviewData(): Promise<StudentsOverviewData> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          totals: buildTotals(mockStudents),
          sessions: sessionsFromData(mockStudents),
          students: mockStudents,
        });
      }, 600);
    });
  },
  async getStudentById(id: string): Promise<StudentRecord | null> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockStudents.find(s => s.id === id) ?? null);
      }, 250);
    });
  },
};
