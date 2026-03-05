import type { FinanceOverviewData } from './types.ts';

export const financeOverviewService = {
  getFinanceOverviewData: (): Promise<FinanceOverviewData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          studentFinance: {
            totalRevenue: 45200000,
            pendingInvoices: 8500000,
            totalInvoices: 1240,
            collectionRate: 85,
            recentTransactions: [
              { id: 1, type: 'Payment', student: 'John Doe', amount: 150000, date: '2024-03-15', status: 'Success' },
              { id: 2, type: 'Invoice', student: 'Jane Smith', amount: 45000, date: '2024-03-14', status: 'Pending' },
              { id: 3, type: 'Payment', student: 'Michael Brown', amount: 200000, date: '2024-03-14', status: 'Success' },
            ],
          },
          adminFinance: {
            totalExpenses: 12100000,
            payrollDisbursed: 9800000,
            pendingPayroll: 1,
            recentLedgerEntries: [
              { id: 'trx_1', description: 'Staff Salary Disbursement for February 2024', amount: 9800000, type: 'Expense', date: '2024-03-01' },
              { id: 'trx_2', description: 'Office Supplies Purchase', amount: 250000, type: 'Expense', date: '2024-03-05' },
              { id: 'trx_3', description: 'Tuition Fee Collection', amount: 5000000, type: 'Income', date: '2024-03-04' },
            ],
          },
        });
      }, 800);
    });
  },
};
