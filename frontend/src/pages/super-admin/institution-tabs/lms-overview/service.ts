import type { LmsOverviewData } from './types';

export const lmsOverviewService = {
  getLmsOverviewData: async (): Promise<LmsOverviewData> => {
    return {
      summary: {
        totalCourses: 38,
        activeCourses: 31,
        pendingAssignments: 14,
        upcomingQuizzes: 6,
        discussions: 128,
        submissions: 3420,
      },
      courses: [
        { id: 'c-001', code: 'CSC 401', title: 'Software Engineering', faculty: 'Faculty of Science', department: 'Computer Science', programme: 'HND Computer Science', instructor: 'Dr. A. Okon', learners: 312, status: 'Active', updatedAt: '2026-03-10' },
        { id: 'c-002', code: 'MTH 302', title: 'Numerical Methods', faculty: 'Faculty of Science', department: 'Mathematics', programme: 'B.Sc. Mathematics', instructor: 'Prof. I. Bello', learners: 280, status: 'Active', updatedAt: '2026-03-08' },
        { id: 'c-003', code: 'PHY 201', title: 'Electricity & Magnetism', faculty: 'Faculty of Science', department: 'Physics', programme: 'B.Sc. Physics', instructor: 'Dr. M. Danjuma', learners: 410, status: 'Active', updatedAt: '2026-03-07' },
        { id: 'c-004', code: 'GST 101', title: 'Use of English', faculty: 'Faculty of Arts', department: 'English', programme: 'B.A. English', instructor: 'Mrs. C. Eze', learners: 1250, status: 'Active', updatedAt: '2026-03-05' },
        { id: 'c-005', code: 'EEE 312', title: 'Circuit Analysis', faculty: 'Faculty of Engineering', department: 'Electrical Engineering', programme: 'B.Eng. Electrical', instructor: 'Engr. S. Adeyemi', learners: 190, status: 'Active', updatedAt: '2026-03-06' },
        { id: 'c-006', code: 'CSC 205', title: 'Data Structures', faculty: 'Faculty of Science', department: 'Computer Science', programme: 'HND Computer Science', instructor: 'Mr. K. Yusuf', learners: 520, status: 'Archived', updatedAt: '2026-02-15' },
      ],
      assignments: [
        { id: 'a-001', courseCode: 'CSC 401', title: 'UML & Requirements', dueDate: '2026-03-15', status: 'Open', submissions: 186 },
        { id: 'a-002', courseCode: 'MTH 302', title: 'Interpolation Problems', dueDate: '2026-03-18', status: 'Open', submissions: 142 },
        { id: 'a-003', courseCode: 'PHY 201', title: 'Field Calculations', dueDate: '2026-03-12', status: 'Closed', submissions: 390 },
        { id: 'a-004', courseCode: 'GST 101', title: 'Essay Writing', dueDate: '2026-03-20', status: 'Open', submissions: 760 },
        { id: 'a-005', courseCode: 'EEE 312', title: 'Network Theorems', dueDate: '2026-03-17', status: 'Open', submissions: 98 },
      ],
      quizzes: [
        { id: 'q-001', courseCode: 'CSC 401', title: 'Mid-Semester Quiz', scheduledDate: '2026-03-14', status: 'Scheduled', participants: 312 },
        { id: 'q-002', courseCode: 'MTH 302', title: 'Quiz 2', scheduledDate: '2026-03-16', status: 'Scheduled', participants: 280 },
        { id: 'q-003', courseCode: 'PHY 201', title: 'Quiz 1', scheduledDate: '2026-03-05', status: 'Completed', participants: 410 },
        { id: 'q-004', courseCode: 'EEE 312', title: 'Quiz 1', scheduledDate: '2026-03-13', status: 'Scheduled', participants: 190 },
      ],
      discussions: [
        { id: 'd-001', courseCode: 'CSC 401', topic: 'Project Scoping', replies: 48, lastActivity: '2 hours ago' },
        { id: 'd-002', courseCode: 'MTH 302', topic: 'Newton-Raphson edge cases', replies: 22, lastActivity: '6 hours ago' },
        { id: 'd-003', courseCode: 'PHY 201', topic: 'Magnetic flux explanation', replies: 33, lastActivity: '1 day ago' },
        { id: 'd-004', courseCode: 'EEE 312', topic: 'Kirchhoff vs Thevenin', replies: 19, lastActivity: '3 hours ago' },
      ],
      submissions: [
        { id: 's-001', courseCode: 'CSC 401', item: 'UML & Requirements', student: 'A. Ibrahim', submittedAt: '2026-03-11 09:14', status: 'Submitted' },
        { id: 's-002', courseCode: 'MTH 302', item: 'Interpolation Problems', student: 'S. Okafor', submittedAt: '2026-03-11 08:02', status: 'Submitted' },
        { id: 's-003', courseCode: 'PHY 201', item: 'Field Calculations', student: 'B. Musa', submittedAt: '2026-03-10 18:45', status: 'Graded' },
        { id: 's-004', courseCode: 'GST 101', item: 'Essay Writing', student: 'O. Chukwu', submittedAt: '2026-03-10 12:10', status: 'Submitted' },
        { id: 's-005', courseCode: 'EEE 312', item: 'Network Theorems', student: 'P. Sunday', submittedAt: '2026-03-11 10:31', status: 'Submitted' },
      ],
    };
  },
};
