import { prisma } from '@/config/database';
import { NotFoundError } from '@/utils/errors';
import {
  CreateInvoiceRequest,
  UpdateInvoiceRequest,
  CreateReceiptRequest,
  InvoiceResponse,
} from './invoices.types';

class InvoicesService {
  /**
   * Generate unique invoice number
   */
  private async generateInvoiceNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    const count = await prisma.invoice.count({
      where: {
        issuedDate: {
          gte: new Date(year, date.getMonth(), 1),
          lt: new Date(year, date.getMonth() + 1, 1),
        },
      },
    });

    return `INV-${year}${month}-${String(count + 1).padStart(4, '0')}`;
  }

  /**
   * Get all invoices
   */
  async getAllInvoices(
    skip: number,
    take: number,
    projectId?: string,
    status?: string
  ): Promise<[InvoiceResponse[], number]> {
    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip,
        take,
        select: this.getInvoiceSelect(),
        orderBy: { issuedDate: 'desc' },
      }),
      prisma.invoice.count({ where }),
    ]);

    return [invoices as InvoiceResponse[], total];
  }

  /**
   * Get invoice by ID
   */
  async getInvoiceById(invoiceId: string): Promise<InvoiceResponse> {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: this.getInvoiceSelect(),
    });

    if (!invoice) {
      throw new NotFoundError('Invoice not found');
    }

    return invoice as InvoiceResponse;
  }

  /**
   * Create invoice
   */
  async createInvoice(
    userId: string,
    data: CreateInvoiceRequest
  ): Promise<InvoiceResponse> {
    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const invoiceNumber = await this.generateInvoiceNumber();
    const taxAmount = data.taxAmount || 0;
    const totalAmount = data.amount + taxAmount;

    const invoice = await prisma.invoice.create({
      data: {
        projectId: data.projectId,
        userId,
        invoiceNumber,
        description: data.description,
        amount: data.amount,
        taxAmount,
        totalAmount,
        dueDate: data.dueDate,
        notes: data.notes,
      },
      select: this.getInvoiceSelect(),
    });

    return invoice as InvoiceResponse;
  }

  /**
   * Update invoice
   */
  async updateInvoice(
    invoiceId: string,
    data: UpdateInvoiceRequest
  ): Promise<InvoiceResponse> {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new NotFoundError('Invoice not found');
    }

    // Calculate total if amount or tax is being updated
    const updateData: any = { ...data };
    if (data.amount !== undefined || data.taxAmount !== undefined) {
      const amount = data.amount ?? invoice.amount;
      const taxAmount = data.taxAmount ?? invoice.taxAmount;
      updateData.totalAmount = amount + taxAmount;
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: updateData,
      select: this.getInvoiceSelect(),
    });

    return updatedInvoice as InvoiceResponse;
  }

  /**
   * Record payment
   */
  async recordPayment(
    invoiceId: string,
    data: CreateReceiptRequest
  ): Promise<any> {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new NotFoundError('Invoice not found');
    }

    const receiptNumber = `REC-${Date.now()}`;

    const receipt = await prisma.receipt.create({
      data: {
        invoiceId,
        receiptNumber,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        transactionRef: data.transactionRef,
        mpesaRequestId: data.mpesaRequestId,
        mpesaCheckoutId: data.mpesaCheckoutId,
        notes: data.notes,
      },
    });

    // Update invoice status if fully paid
    const totalPaid = await prisma.receipt.aggregate({
      where: { invoiceId },
      _sum: { amount: true },
    });

    if (totalPaid._sum.amount && totalPaid._sum.amount >= invoice.totalAmount) {
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          status: 'PAID',
          paidDate: new Date(),
        },
      });
    }

    return receipt;
  }

  /**
   * Get invoice select fields
   */
  private getInvoiceSelect() {
    return {
      id: true,
      projectId: true,
      userId: true,
      invoiceNumber: true,
      description: true,
      amount: true,
      taxAmount: true,
      totalAmount: true,
      status: true,
      issuedDate: true,
      dueDate: true,
      paidDate: true,
      currency: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}

export const invoicesService = new InvoicesService();
