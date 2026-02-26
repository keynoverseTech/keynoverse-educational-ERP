import React, { createContext, useContext, useState } from 'react';

// --- Data Models ---

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
  recordedBy: string; // staffId
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

// --- Context State ---

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

interface FinanceContextValue {
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

const FinanceContext = createContext<FinanceContextValue | undefined>(undefined);

// --- Initial Data ---

const initialFeeStructures: FeeStructure[] = [
  {
    id: 'fee_1',
    name: 'Tuition Fee - Science',
    amount: 150000,
    programId: 'prog_cs',
    levelId: null,
    session: '2024/2025',
    isRecurring: true,
    createdAt: '2024-01-15'
  },
  {
    id: 'fee_2',
    name: 'Acceptance Fee',
    amount: 50000,
    programId: null,
    levelId: 'level_100',
    session: '2024/2025',
    isRecurring: false,
    createdAt: '2024-01-15'
  }
];

const initialInvoices: Invoice[] = [
  {
    id: 'inv_001',
    studentId: 'std_123', // Assuming mock student ID
    session: '2024/2025',
    items: [
      { feeStructureId: 'fee_1', amount: 150000, description: 'Tuition Fee - Science' },
      { feeStructureId: 'fee_2', amount: 50000, description: 'Acceptance Fee' }
    ],
    totalAmount: 200000,
    status: 'Partially Paid',
    createdAt: '2024-09-01'
  }
];

const initialPayments: Payment[] = [
  {
    id: 'pay_001',
    invoiceId: 'inv_001',
    amountPaid: 100000,
    paymentMethod: 'Transfer',
    transactionReference: 'TRX-882910',
    recordedBy: 'staff_3', // Finance Officer
    createdAt: '2024-09-05',
    status: 'Posted'
  }
];

const initialLedgerTransactions: LedgerTransaction[] = [
  {
    id: 'trx_1',
    accountName: 'Zenith Bank - Main Account',
    reference: 'UTIL-2024-001',
    date: '2024-09-10',
    amount: 45000,
    paymentMethod: 'Bank Transfer',
    description: 'Monthly electricity bill for Admin block',
    type: 'Expense',
    createdAt: '2024-09-10T10:00:00.000Z'
  },
  {
    id: 'trx_2',
    accountName: 'GTBank - Revenue Account',
    reference: 'TUI-REV-882',
    date: '2024-09-12',
    amount: 1250000,
    paymentMethod: 'Payment Gateways',
    description: 'Bulk tuition payment batch #882',
    type: 'Income',
    createdAt: '2024-09-12T14:30:00.000Z'
  }
];

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(initialFeeStructures);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [salaryStructures, setSalaryStructures] = useState<SalaryStructure[]>([]);
  const [staffSalaryAssignments, setStaffSalaryAssignments] = useState<StaffSalaryAssignment[]>([]);
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [ledgerTransactions, setLedgerTransactions] = useState<LedgerTransaction[]>(initialLedgerTransactions);

  return (
    <FinanceContext.Provider
      value={{
        feeStructures,
        setFeeStructures,
        invoices,
        setInvoices,
        payments,
        setPayments,
        salaryStructures,
        setSalaryStructures,
        staffSalaryAssignments,
        setStaffSalaryAssignments,
        payrollRuns,
        setPayrollRuns,
        ledgerTransactions,
        setLedgerTransactions
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};
