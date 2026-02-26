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
}

export interface PayrollRun {
  id: string;
  month: string;
  year: number;
  generatedBy: string;
  status: 'Draft' | 'Approved' | 'Paid';
}

// --- Context State ---

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

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(initialFeeStructures);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [salaryStructures, setSalaryStructures] = useState<SalaryStructure[]>([]);
  const [staffSalaryAssignments, setStaffSalaryAssignments] = useState<StaffSalaryAssignment[]>([]);
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);

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
        setPayrollRuns
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
