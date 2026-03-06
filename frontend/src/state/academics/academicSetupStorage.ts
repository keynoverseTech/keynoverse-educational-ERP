export type AcademicSession = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Closed' | 'Upcoming';
};

export type AcademicFaculty = {
  id: string;
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
  deanName?: string;
};

export type AcademicDepartment = {
  id: string;
  name: string;
  code: string;
  facultyId?: string;
  headOfDepartment?: string;
};

export type AcademicLevel = {
  id: string;
  name: string;
  programmeId?: string;
  description?: string;
};

const keys = {
  sessions: 'sa_academic_sessions',
  faculties: 'sa_academic_faculties',
  departments: 'sa_academic_departments',
  levels: 'sa_academic_levels',
};

const read = <T,>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
};

const write = <T,>(key: string, data: T[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
  }
};

export const loadAcademicSessions = (): AcademicSession[] => read<AcademicSession>(keys.sessions);
export const saveAcademicSessions = (sessions: AcademicSession[]) => write(keys.sessions, sessions);

export const loadAcademicFaculties = (): AcademicFaculty[] => read<AcademicFaculty>(keys.faculties);
export const saveAcademicFaculties = (faculties: AcademicFaculty[]) => write(keys.faculties, faculties);

export const loadAcademicDepartments = (): AcademicDepartment[] => read<AcademicDepartment>(keys.departments);
export const saveAcademicDepartments = (departments: AcademicDepartment[]) => write(keys.departments, departments);

export const loadAcademicLevels = (): AcademicLevel[] => read<AcademicLevel>(keys.levels);
export const saveAcademicLevels = (levels: AcademicLevel[]) => write(keys.levels, levels);
