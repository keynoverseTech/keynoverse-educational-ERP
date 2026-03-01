import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useFinance, type Invoice, type Payment } from './financeContext';
import type { StudentPortalFinanceApi, StudentPortalPaymentMethod } from '../api/studentPortalFinanceApi';

export type StudentProfile = {
  id: string;
  fullName: string;
  programme: string;
  level: string;
};

export type StudentInvoiceView = Invoice & {
  amountPaid: number;
  balance: number;
};

export type StudentPaymentIntent = {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: StudentPortalPaymentMethod;
  reference: string;
  status: 'Initiated' | 'Processing' | 'Successful' | 'Failed';
  createdAt: string;
  updatedAt: string;
};

export type StudentReceipt = {
  id: string;
  paymentId: string;
  invoiceId: string;
  studentId: string;
  amount: number;
  paymentMethod: StudentPortalPaymentMethod;
  reference: string;
  issuedAt: string;
};

type StudentPortalFinanceContextValue = {
  student: StudentProfile;
  invoicesLoading: boolean;
  paymentsLoading: boolean;
  actionLoading: boolean;
  error: string | null;
  myInvoices: StudentInvoiceView[];
  myPayments: Payment[];
  myReceipts: StudentReceipt[];
  paymentIntents: StudentPaymentIntent[];
  refresh: () => Promise<void>;
  getInvoiceById: (invoiceId: string) => StudentInvoiceView | undefined;
  getReceiptById: (receiptId: string) => StudentReceipt | undefined;
  initiatePayment: (input: { invoiceId: string; amount: number; paymentMethod: StudentPortalPaymentMethod }) => Promise<StudentPaymentIntent>;
  confirmPayment: (input: { intentId: string; payload: Record<string, string> }) => Promise<{ receiptId: string; paymentId: string }>;
};

const StudentPortalFinanceContext = createContext<StudentPortalFinanceContextValue | undefined>(undefined);

const defaultStudent: StudentProfile = {
  id: 'std_123',
  fullName: 'Samuel John',
  programme: 'HND Computer Science',
  level: '400',
};

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const createLocalRef = () => crypto.randomUUID().slice(0, 10).toUpperCase();

export const StudentPortalFinanceProvider: React.FC<{ children: React.ReactNode; api?: StudentPortalFinanceApi; student?: StudentProfile }> = ({ children, api, student }) => {
  const finance = useFinance();
  const activeStudent = student ?? defaultStudent;

  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [paymentIntents, setPaymentIntents] = useState<StudentPaymentIntent[]>([]);
  const [myReceipts, setMyReceipts] = useState<StudentReceipt[]>([]);

  const postedPaymentsByInvoice = useMemo(() => {
    const byInvoice = new Map<string, number>();
    for (const payment of finance.payments) {
      if (payment.status !== 'Posted') continue;
      byInvoice.set(payment.invoiceId, (byInvoice.get(payment.invoiceId) ?? 0) + payment.amountPaid);
    }
    return byInvoice;
  }, [finance.payments]);

  const myInvoices = useMemo<StudentInvoiceView[]>(() => {
    return finance.invoices
      .filter((inv) => inv.studentId === activeStudent.id)
      .map((inv) => {
        const amountPaid = postedPaymentsByInvoice.get(inv.id) ?? 0;
        const balance = Math.max(0, inv.totalAmount - amountPaid);
        const status: Invoice['status'] = balance === 0 ? 'Paid' : amountPaid > 0 ? 'Partially Paid' : 'Unpaid';
        return { ...inv, amountPaid, balance, status };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [activeStudent.id, finance.invoices, postedPaymentsByInvoice]);

  const myPayments = useMemo<Payment[]>(() => {
    const myInvoiceIds = new Set(myInvoices.map((inv) => inv.id));
    return finance.payments
      .filter((p) => myInvoiceIds.has(p.invoiceId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [finance.payments, myInvoices]);

  const refresh = useCallback(async () => {
    setError(null);
    setInvoicesLoading(true);
    setPaymentsLoading(true);
    try {
      if (api) {
        const [apiInvoices, apiPayments] = await Promise.all([
          api.getMyInvoices(activeStudent.id),
          api.getMyPayments(activeStudent.id),
        ]);
        finance.setInvoices(() => apiInvoices as unknown as Invoice[]);
        finance.setPayments(() => apiPayments as unknown as Payment[]);
      } else {
        await sleep(450);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load student finance data');
    } finally {
      setInvoicesLoading(false);
      setPaymentsLoading(false);
    }
  }, [activeStudent.id, api, finance]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const getInvoiceById = (invoiceId: string) => myInvoices.find((inv) => inv.id === invoiceId);

  const getReceiptById = (receiptId: string) => myReceipts.find((r) => r.id === receiptId);

  const initiatePayment: StudentPortalFinanceContextValue['initiatePayment'] = async ({ invoiceId, amount, paymentMethod }) => {
    setError(null);
    setActionLoading(true);
    try {
      const invoice = getInvoiceById(invoiceId);
      if (!invoice) throw new Error('Invoice not found');
      if (!Number.isFinite(amount) || amount <= 0) throw new Error('Enter a valid payment amount');
      if (amount > invoice.balance) throw new Error('Amount cannot be higher than your balance');

      if (api) {
        const intent = await api.createPaymentIntent({ invoiceId, amount, paymentMethod });
        const mapped: StudentPaymentIntent = {
          id: intent.id,
          invoiceId: intent.invoiceId,
          amount: intent.amount,
          paymentMethod: intent.paymentMethod,
          status: intent.status,
          reference: intent.reference,
          createdAt: intent.createdAt,
          updatedAt: intent.updatedAt,
        };
        setPaymentIntents((prev) => [mapped, ...prev]);
        return mapped;
      }

      await sleep(350);
      const now = new Date().toISOString();
      const intent: StudentPaymentIntent = {
        id: `spi_${crypto.randomUUID().slice(0, 8)}`,
        invoiceId,
        amount,
        paymentMethod,
        status: 'Initiated',
        reference: `STU-${createLocalRef()}`,
        createdAt: now,
        updatedAt: now,
      };
      setPaymentIntents((prev) => [intent, ...prev]);
      return intent;
    } finally {
      setActionLoading(false);
    }
  };

  const confirmPayment: StudentPortalFinanceContextValue['confirmPayment'] = async ({ intentId, payload }) => {
    setError(null);
    setActionLoading(true);
    try {
      const intent = paymentIntents.find((i) => i.id === intentId);
      if (!intent) throw new Error('Payment session not found');

      const updateIntent = (next: Partial<StudentPaymentIntent>) => {
        setPaymentIntents((prev) =>
          prev.map((p) => (p.id === intentId ? { ...p, ...next, updatedAt: new Date().toISOString() } : p)),
        );
      };

      updateIntent({ status: 'Processing' });

      if (api) {
        const result = await api.confirmPayment({
          intentId: intent.id,
          paymentMethod: intent.paymentMethod,
          reference: intent.reference,
          payload,
        });
        if (result.status !== 'Successful' || !result.payment || !result.receipt) {
          updateIntent({ status: 'Failed' });
          throw new Error(result.message || 'Payment failed');
        }

        finance.setPayments((prev) => [result.payment as unknown as Payment, ...prev]);
        finance.setInvoices((prev) =>
          prev.map((inv) => (inv.id === intent.invoiceId ? ({ ...inv } as Invoice) : inv)),
        );

        setMyReceipts((prev) => [
          {
            id: result.receipt!.id,
            paymentId: result.receipt!.paymentId,
            invoiceId: result.receipt!.invoiceId,
            studentId: result.receipt!.studentId,
            amount: result.receipt!.amount,
            paymentMethod: result.receipt!.paymentMethod,
            reference: result.receipt!.reference,
            issuedAt: result.receipt!.issuedAt,
          },
          ...prev,
        ]);

        updateIntent({ status: 'Successful' });
        return { receiptId: result.receipt!.id, paymentId: result.payment.id };
      }

      await sleep(900);
      const shouldFail = payload.fail === 'true';
      if (shouldFail) {
        updateIntent({ status: 'Failed' });
        throw new Error('Payment failed. Please try again.');
      }

      const paymentId = `pay_${crypto.randomUUID().slice(0, 8)}`;
      const createdAt = new Date().toISOString();
      const newPayment: Payment = {
        id: paymentId,
        invoiceId: intent.invoiceId,
        amountPaid: intent.amount,
        paymentMethod: intent.paymentMethod,
        transactionReference: intent.reference,
        recordedBy: activeStudent.id,
        createdAt,
        status: 'Posted',
      };

      finance.setPayments((prev) => [newPayment, ...prev]);

      finance.setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id !== intent.invoiceId) return inv;
          const paid = (postedPaymentsByInvoice.get(inv.id) ?? 0) + intent.amount;
          const nextStatus: Invoice['status'] = paid >= inv.totalAmount ? 'Paid' : 'Partially Paid';
          return { ...inv, status: nextStatus };
        }),
      );

      const receiptId = `rcpt_${crypto.randomUUID().slice(0, 8)}`;
      setMyReceipts((prev) => [
        {
          id: receiptId,
          paymentId,
          invoiceId: intent.invoiceId,
          studentId: activeStudent.id,
          amount: intent.amount,
          paymentMethod: intent.paymentMethod,
          reference: intent.reference,
          issuedAt: createdAt,
        },
        ...prev,
      ]);

      updateIntent({ status: 'Successful' });
      return { receiptId, paymentId };
    } finally {
      setActionLoading(false);
    }
  };

  const value: StudentPortalFinanceContextValue = {
    student: activeStudent,
    invoicesLoading,
    paymentsLoading,
    actionLoading,
    error,
    myInvoices,
    myPayments,
    myReceipts,
    paymentIntents,
    refresh,
    getInvoiceById,
    getReceiptById,
    initiatePayment,
    confirmPayment,
  };

  return <StudentPortalFinanceContext.Provider value={value}>{children}</StudentPortalFinanceContext.Provider>;
};

export const useStudentPortalFinance = () => {
  const ctx = useContext(StudentPortalFinanceContext);
  if (!ctx) throw new Error('useStudentPortalFinance must be used within StudentPortalFinanceProvider');
  return ctx;
};
