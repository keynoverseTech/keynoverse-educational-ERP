export type EnrolledCourse = {
  code: string;
  title: string;
  units: number;
  lecturer: string;
  schedule: string;
  venue: string;
  status: 'Registered' | 'Pending';
};

const KEY = 'student_enrolled_courses';

export const getEnrolledCourses = (): EnrolledCourse[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as EnrolledCourse[];
  } catch {
    return [];
  }
};

export const saveEnrolledCourses = (courses: EnrolledCourse[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(courses));
  } catch {
    // ignore
  }
};

