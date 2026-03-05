export interface FinanceOverviewData {
  studentFinance: {
    totalRevenue: number;
    pendingInvoices: number;
    totalInvoices: number;
    collectionRate: number;
    recentTransactions: any[];
  };
  adminFinance: {
    totalExpenses: number;
    payrollDisbursed: number;
    pendingPayroll: number;
    recentLedgerEntries: any[];
  };
}
