export type LmsCourseStatus = 'Active' | 'Archived';

export type LmsAssignmentStatus = 'Open' | 'Closed';

export type LmsQuizStatus = 'Scheduled' | 'Completed';

export interface LmsSummary {
  totalCourses: number;
  activeCourses: number;
  pendingAssignments: number;
  upcomingQuizzes: number;
  discussions: number;
  submissions: number;
}

export interface LmsCourse {
  id: string;
  code: string;
  title: string;
  faculty: string;
  department: string;
  programme: string;
  instructor: string;
  learners: number;
  status: LmsCourseStatus;
  updatedAt: string;
}

export interface LmsAssignment {
  id: string;
  courseCode: string;
  title: string;
  dueDate: string;
  status: LmsAssignmentStatus;
  submissions: number;
}

export interface LmsQuiz {
  id: string;
  courseCode: string;
  title: string;
  scheduledDate: string;
  status: LmsQuizStatus;
  participants: number;
}

export interface LmsDiscussion {
  id: string;
  courseCode: string;
  topic: string;
  replies: number;
  lastActivity: string;
}

export interface LmsSubmission {
  id: string;
  courseCode: string;
  item: string;
  student: string;
  submittedAt: string;
  status: 'Submitted' | 'Graded';
}

export interface LmsOverviewData {
  summary: LmsSummary;
  courses: LmsCourse[];
  assignments: LmsAssignment[];
  quizzes: LmsQuiz[];
  discussions: LmsDiscussion[];
  submissions: LmsSubmission[];
}
