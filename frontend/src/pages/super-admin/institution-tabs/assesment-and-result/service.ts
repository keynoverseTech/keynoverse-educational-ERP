import type { AssesmentAndResultData } from './types.ts';

export const assesmentAndResultService = {
  getAssesmentAndResultData: (): Promise<AssesmentAndResultData> => {
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        resolve({
          stats: [
            { label: 'Total Exams', value: 56, trend: '+5%', trendUp: true },
            { label: 'Ongoing Exams', value: 4, trend: '7%' },
            { label: 'Results Published', value: 32, trend: '57%' },
            { label: 'Upcoming Exams', value: 12 },
          ],
          upcomingExams: [
            { id: '1', name: 'Mid-term Exam', course: 'Mathematics', faculty: 'Science', department: 'Mathematics', date: '2024-03-15', time: '10:00 AM', status: 'Upcoming' },
            { id: '2', name: 'Practical Exam', course: 'Physics', faculty: 'Science', department: 'Physics', date: '2024-03-18', time: '02:00 PM', status: 'Upcoming' },
            { id: '3', name: 'Final Exam', course: 'Chemistry', faculty: 'Science', department: 'Chemistry', date: '2024-03-20', time: '10:00 AM', status: 'Upcoming' },
            { id: '4', name: 'Viva Voce', course: 'Biology', faculty: 'Science', department: 'Biology', date: '2024-03-22', time: '11:00 AM', status: 'Upcoming' },
            { id: '5', name: 'Project Submission', course: 'Computer Science', faculty: 'Engineering', department: 'Computer Science', date: '2024-03-25', time: '04:00 PM', status: 'Upcoming' },
          ],
          recentResults: [
            { id: 'r1', examName: 'Quiz 1', course: 'History', faculty: 'Arts', department: 'History', publicationDate: '2024-03-01', status: 'Published' },
            { id: 'r2', examName: 'Assignment 2', course: 'Geography', faculty: 'Arts', department: 'Geography', publicationDate: '2024-02-28', status: 'Published' },
            { id: 'r3', examName: 'Mid-term Exam', course: 'English', faculty: 'Arts', department: 'English', publicationDate: '2024-02-25', status: 'Pending' },
          ],
          subjectDistribution: [
            { name: 'Science', count: 15 },
            { name: 'Arts', count: 10 },
            { name: 'Commerce', count: 12 },
            { name: 'Engineering', count: 20 },
            { name: 'Medicine', count: 8 },
            { name: 'Law', count: 5 },
          ],
        });
      }, 800);
    });
  },
};
