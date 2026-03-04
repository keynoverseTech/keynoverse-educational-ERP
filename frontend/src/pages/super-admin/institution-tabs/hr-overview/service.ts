import type { HROverviewData } from './types';

export const hrOverviewService = {
  getHROverviewData: (): Promise<HROverviewData> => {
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        resolve({
          stats: [
            { label: 'Total Staff', value: 245, trend: '+3%', trendUp: true },
            { label: 'Present Today', value: 230, trend: '94%' },
            { label: 'On Leave', value: 8, trend: '3.2%' },
            { label: 'Departments', value: 12 },
          ],
          recentStaff: [
            { id: '1', name: 'Dr. Alan Grant', role: 'Professor', department: 'Paleontology', status: 'Active', joinDate: '2023-01-15' },
            { id: '2', name: 'Ellie Sattler', role: 'Researcher', department: 'Paleobotany', status: 'Active', joinDate: '2023-02-01' },
            { id: '3', name: 'Ian Malcolm', role: 'Lecturer', department: 'Mathematics', status: 'On Leave', joinDate: '2023-03-10' },
            { id: '4', name: 'John Hammond', role: 'Dean', department: 'Administration', status: 'Active', joinDate: '2022-11-05' },
            { id: '5', name: 'Dennis Nedry', role: 'IT Systems', department: 'Computer Science', status: 'Inactive', joinDate: '2023-05-20' },
          ],
          recentLeaveRequests: [
            { id: 'l1', staffName: 'Sarah Harding', type: 'Sick Leave', duration: '2 days', status: 'Pending', date: '2024-03-01' },
            { id: 'l2', staffName: 'Ian Malcolm', type: 'Sabbatical', duration: '3 months', status: 'Approved', date: '2024-02-28' },
            { id: 'l3', staffName: 'Robert Muldoon', type: 'Casual Leave', duration: '1 day', status: 'Rejected', date: '2024-02-25' },
          ],
          payroll: {
            totalPayroll: 1250000,
            pendingDisbursements: 45000,
            lastMonthTotal: 1245000,
            nextPayDate: '2024-03-30',
          },
          departmentDistribution: [
            { name: 'Science', count: 45 },
            { name: 'Arts', count: 30 },
            { name: 'Engineering', count: 60 },
            { name: 'Medicine', count: 50 },
            { name: 'Admin', count: 20 },
            { name: 'Support', count: 40 },
          ],
        });
      }, 800);
    });
  },
};
