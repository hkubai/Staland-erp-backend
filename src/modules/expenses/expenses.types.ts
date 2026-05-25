export interface CreateExpenseRequest {
  projectId: string;
  category: 'LABOR' | 'MATERIALS' | 'EQUIPMENT' | 'TRANSPORT' | 'UTILITIES' | 'OTHER';
  description: string;
  amount: number;
  vendor?: string;
  date: Date;
  receiptUrl?: string;
  notes?: string;
}

export interface UpdateExpenseRequest {
  category?: string;
  description?: string;
  amount?: number;
  vendor?: string;
  date?: Date;
  receiptUrl?: string;
  status?: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  notes?: string;
}

export interface ExpenseResponse {
  id: string;
  projectId: string;
  userId: string;
  category: string;
  description: string;
  amount: number;
  vendor?: string;
  date: Date;
  receiptUrl?: string;
  status: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
