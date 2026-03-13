export type ResearchSubmissionStatus = 'Pending' | 'Approved' | 'Flagged' | 'Rejected';

export interface ResearchSummary {
  topics: number;
  activeProjects: number;
  pendingSubmissions: number;
  plagiarismChecks: number;
  scheduledDefenses: number;
  supervisors: number;
}

export interface ResearchTopic {
  id: string;
  code: string;
  topic: string;
  faculty: string;
  programme: string;
  department: string;
  supervisor: string;
  updatedAt: string;
}

export interface ResearchSubmission {
  id: string;
  student: string;
  title: string;
  supervisor: string;
  course: string;
  faculty: string;
  programme: string;
  department: string;
  status: ResearchSubmissionStatus;
  submittedAt: string;
}

export interface ResearchOverviewData {
  summary: ResearchSummary;
  topics: ResearchTopic[];
  submissions: ResearchSubmission[];
}
