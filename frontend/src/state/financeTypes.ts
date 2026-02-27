import type React from 'react';

export interface FeeStructure {
  id: string;
  name: string;
  amount: number;
  programId: string | null;
  levelId: string | null;
  session: string;
  isRecurring: boolean;
  createdAt: string;
}

export interface InvoiceItem {
  feeStructureId: string;
  amount: number;
  description: string;
}

export interface Invoice {
  id: string;
  studentId: string;
  session: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: 'Unpaid' | 'Partially Paid' | 'Paid';
  createdAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amountPaid: number;
  paymentMethod: 'Cash' | 'Transfer' | 'POS' | 'Online';
  transactionReference: string;
  recordedBy: string;
  createdAt: string;
  status: 'Posted' | 'Reversed';
}

export interface SalaryStructure {
  id: string;
  gradeLevel: string;
  baseSalary: number;
  allowances: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
}

export interface StaffSalaryAssignment {
  staffId: string;
  salaryStructureId: string;
  customBaseSalary?: number;
  customAllowances?: { name: string; amount: number }[];
  customDeductions?: { name: string; amount: number }[];
}

export interface PayrollStaffEntry {
  staffId: string;
  name: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
}

export interface PayrollRun {
  id: string;
  month: string;
  year: number;
  totalAmount: number;
  totalStaff: number;
  generatedBy: string;
  status: 'Pending' | 'Approved' | 'Disbursed';
  forwardedAt?: string;
  disbursedAt?: string;
  disbursedBy?: string;
  staffEntries: PayrollStaffEntry[];
}

export interface LedgerTransaction {
  id: string;
  accountName: string;
  reference: string;
  date: string;
  amount: number;
  paymentMethod: 'Bank Transfer' | 'Cash' | 'Cheque' | 'Card' | 'Payment Gateways';
  description: string;
  attachment?: string;
  type: 'Income' | 'Expense';
  createdAt: string;
}

export interface FinanceContextValue {
  feeStructures: FeeStructure[];
  setFeeStructures: React.Dispatch<React.SetStateAction<FeeStructure[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  salaryStructures: SalaryStructure[];
  setSalaryStructures: React.Dispatch<React.SetStateAction<SalaryStructure[]>>;
  staffSalaryAssignments: StaffSalaryAssignment[];
  setStaffSalaryAssignments: React.Dispatch<React.SetStateAction<StaffSalaryAssignment[]>>;
  payrollRuns: PayrollRun[];
  setPayrollRuns: React.Dispatch<React.SetStateAction<PayrollRun[]>>;
  ledgerTransactions: LedgerTransaction[];
  setLedgerTransactions: React.Dispatch<React.SetStateAction<LedgerTransaction[]>>;
}
