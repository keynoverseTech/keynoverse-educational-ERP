import type { ResearchOverviewData } from './research-types';

export const researchOverviewService = {
  getResearchOverviewData: async (): Promise<ResearchOverviewData> => {
    return {
      summary: {
        topics: 124,
        activeProjects: 86,
        pendingSubmissions: 17,
        plagiarismChecks: 42,
        scheduledDefenses: 9,
        supervisors: 28,
      },
      topics: [
        { id: 'rt-001', code: 'RSP-001', topic: 'AI-assisted student performance prediction', faculty: 'Faculty of Science', programme: 'HND Computer Science', department: 'Computer Science', supervisor: 'Dr. A. Okon', updatedAt: '2026-03-10' },
        { id: 'rt-002', code: 'RSP-002', topic: 'Renewable micro-grid optimization', faculty: 'Faculty of Engineering', programme: 'B.Eng. Electrical', department: 'Electrical Engineering', supervisor: 'Engr. S. Adeyemi', updatedAt: '2026-03-08' },
        { id: 'rt-003', code: 'RSP-003', topic: 'Plagiarism detection using embedding similarity', faculty: 'Faculty of Science', programme: 'B.Sc. Mathematics', department: 'Mathematics', supervisor: 'Prof. I. Bello', updatedAt: '2026-03-06' },
        { id: 'rt-004', code: 'RSP-004', topic: 'Academic writing support for ESL learners', faculty: 'Faculty of Arts', programme: 'B.A. English', department: 'English', supervisor: 'Mrs. C. Eze', updatedAt: '2026-03-05' },
      ],
      submissions: [
        { id: 'rs-001', student: 'A. Ibrahim', title: 'System design and evaluation report', supervisor: 'Dr. A. Okon', course: 'CSC 401', faculty: 'Faculty of Science', programme: 'HND Computer Science', department: 'Computer Science', status: 'Pending', submittedAt: '2026-03-11 09:14' },
        { id: 'rs-002', student: 'S. Okafor', title: 'Numerical analysis project write-up', supervisor: 'Prof. I. Bello', course: 'MTH 302', faculty: 'Faculty of Science', programme: 'B.Sc. Mathematics', department: 'Mathematics', status: 'Approved', submittedAt: '2026-03-10 14:32' },
        { id: 'rs-003', student: 'B. Musa', title: 'Field simulation and results', supervisor: 'Dr. M. Danjuma', course: 'PHY 201', faculty: 'Faculty of Science', programme: 'B.Sc. Physics', department: 'Physics', status: 'Flagged', submittedAt: '2026-03-10 18:45' },
        { id: 'rs-004', student: 'O. Chukwu', title: 'Essay and citations review', supervisor: 'Mrs. C. Eze', course: 'GST 101', faculty: 'Faculty of Arts', programme: 'B.A. English', department: 'English', status: 'Rejected', submittedAt: '2026-03-09 11:08' },
      ],
    };
  },
};
