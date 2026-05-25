export interface CreateInvoiceRequest {
  projectId: string;
  description?: string;
  amount: number;
  taxAmount?: number;
  dueDate: Date;
  notes?: string;
}

export interface UpdateInvoiceRequest {
  description?: string;
  amount?: number;
  taxAmount?: number;
  dueDate?: Date;
  status?: 'DRAFT' | 'ISSUED' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  notes?: string;
}

export interface CreateReceiptRequest {
  invoiceId: string;
  amount: number;
  paymentMethod: 'MPESA' | 'BANK_TRANSFER' | 'CASH' | 'CHEQUE' | 'OTHER';
  transactionRef?: string;
  mpesaRequestId?: string;
  mpesaCheckoutId?: string;
  notes?: string;
}

export interface InvoiceResponse {
  id: string;
  projectId: string;
  userId: string;
  invoiceNumber: string;
  description?: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: string;
  issuedDate: Date;
  dueDate: Date;
  paidDate?: Date;
  currency: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
