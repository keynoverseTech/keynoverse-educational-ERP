export interface AssesmentAndResultStat {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon?: any;
  color?: string;
}

export interface ExamSummary {
  id: string;
  name: string;
  course: string;
  faculty: string;
  department: string;
  date: string;
  time: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

export interface ResultSummary {
  id: string;
  examName: string;
  course: string;
  faculty: string;
  department: string;
  publicationDate: string;
  status: 'Published' | 'Pending' | 'Withheld';
}

export interface AssesmentAndResultData {
  stats: AssesmentAndResultStat[];
  upcomingExams: ExamSummary[];
  recentResults: ResultSummary[];
  subjectDistribution: { name: string; count: number }[];
}
