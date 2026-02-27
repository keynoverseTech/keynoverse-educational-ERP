import React, { useState } from 'react';
import { FinanceContext } from './financeContext';
import type { 
  FeeStructure, 
  Invoice, 
  Payment, 
  SalaryStructure, 
  StaffSalaryAssignment, 
  PayrollRun, 
  LedgerTransaction 
} from './financeTypes';

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
    studentId: 'std_123',
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
    recordedBy: 'staff_3',
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
