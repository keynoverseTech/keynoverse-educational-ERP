export interface HRStat {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon?: any;
  color?: string;
}

export interface StaffSummary {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  joinDate: string;
}

export interface LeaveRequestSummary {
  id: string;
  staffName: string;
  type: string;
  duration: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

export interface PayrollSummaryData {
  totalPayroll: number;
  pendingDisbursements: number;
  lastMonthTotal: number;
  nextPayDate: string;
}

export interface HROverviewData {
  stats: HRStat[];
  recentStaff: StaffSummary[];
  recentLeaveRequests: LeaveRequestSummary[];
  payroll: PayrollSummaryData;
  departmentDistribution: { name: string; count: number }[];
}
