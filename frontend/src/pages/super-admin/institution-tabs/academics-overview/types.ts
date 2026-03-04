export interface CourseSummary {
  totalCourses: number;
  newCourses: number; // in the last 30 days
  coursesWithNoStudents: number;
}

export interface TimetableEvent {
  id: string;
  courseCode: string;
  courseName: string;
  lecturer: string;
  time: string;
  day: string;
  location: string;
  level: string;
}

export interface AttendanceReport {
  overallAttendance: number; // percentage
  bestPerformingCourse: { name: string; rate: number };
  worstPerformingCourse: { name: string; rate: number };
  dailyTrend: { day: string; present: number; absent: number }[];
}

export type AcademicModuleType = 'Core' | 'Configuration' | 'Materials';

export interface ModuleStat {
  label: string;
  value: string | number;
  trend?: string; // e.g., "+5%"
}

export interface AcademicModule {
  id: string;
  name: string;
  description: string;
  path: string; // Path to the file/folder in the codebase
  status: 'Active' | 'Inactive' | 'Maintenance';
  lastUpdated: string;
  type: AcademicModuleType;
  features: string[]; // List of key functionalities
  stats: ModuleStat[]; // Key metrics for this module
}

export interface Course {
  id: string;
  code: string;
  title: string;
  unit: number;
  level: string;
  semester: string;
  department: string;
  lecturer: string;
  studentsEnrolled: number;
}

export interface AcademicsOverviewData {
  courseSummary: CourseSummary;
  upcomingClasses: TimetableEvent[];
  attendanceReport: AttendanceReport;
  modules: AcademicModule[];
  courses: Course[];
  timetable: TimetableEvent[]; // Full timetable
}
