import { createContext, useContext } from 'react';
import type { FinanceContextValue } from './financeTypes';

export type {
  FeeStructure,
  InvoiceItem,
  Invoice,
  Payment,
  SalaryStructure,
  StaffSalaryAssignment,
  PayrollStaffEntry,
  PayrollRun,
  LedgerTransaction,
  FinanceContextValue
} from './financeTypes';

export const FinanceContext = createContext<FinanceContextValue | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};
