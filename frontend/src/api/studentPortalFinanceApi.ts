export type StudentPortalPaymentMethod = 'Cash' | 'Transfer' | 'POS' | 'Online';

export type StudentPortalPaymentIntentStatus = 'Initiated' | 'Processing' | 'Successful' | 'Failed';

export type StudentPortalPaymentConfirmStatus = 'Successful' | 'Failed';

export type StudentPortalApiInvoiceItem = {
  feeStructureId: string;
  description: string;
  amount: number;
};

export type StudentPortalApiInvoice = {
  id: string;
  studentId: string;
  session: string;
  items: StudentPortalApiInvoiceItem[];
  totalAmount: number;
  status: 'Unpaid' | 'Partially Paid' | 'Paid';
  createdAt: string;
};

export type StudentPortalApiPayment = {
  id: string;
  invoiceId: string;
  amountPaid: number;
  paymentMethod: StudentPortalPaymentMethod;
  transactionReference: string;
  createdAt: string;
  status: 'Posted' | 'Reversed';
};

export type StudentPortalApiPaymentIntent = {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: StudentPortalPaymentMethod;
  status: StudentPortalPaymentIntentStatus;
  reference: string;
  createdAt: string;
  updatedAt: string;
};

export type StudentPortalApiReceipt = {
  id: string;
  invoiceId: string;
  paymentId: string;
  studentId: string;
  amount: number;
  paymentMethod: StudentPortalPaymentMethod;
  reference: string;
  issuedAt: string;
};

export type CreatePaymentIntentInput = {
  invoiceId: string;
  amount: number;
  paymentMethod: StudentPortalPaymentMethod;
};

export type ConfirmPaymentInput = {
  intentId: string;
  paymentMethod: StudentPortalPaymentMethod;
  reference: string;
  payload: Record<string, string>;
};

export interface StudentPortalFinanceApi {
  getMyInvoices: (studentId: string) => Promise<StudentPortalApiInvoice[]>;
  getMyPayments: (studentId: string) => Promise<StudentPortalApiPayment[]>;
  createPaymentIntent: (input: CreatePaymentIntentInput) => Promise<StudentPortalApiPaymentIntent>;
  confirmPayment: (input: ConfirmPaymentInput) => Promise<{
    status: StudentPortalPaymentConfirmStatus;
    payment?: StudentPortalApiPayment;
    receipt?: StudentPortalApiReceipt;
    message?: string;
  }>;
}

