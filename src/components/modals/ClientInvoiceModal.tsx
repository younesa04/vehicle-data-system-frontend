import { useState, useEffect, FormEvent } from 'react';
import type { ClientInvoice } from '../../types';

interface ClientInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ClientInvoice>) => void;
  invoice?: ClientInvoice | null;
  isLoading?: boolean;
}

export const ClientInvoiceModal = ({ isOpen, onClose, onSave, invoice, isLoading }: ClientInvoiceModalProps) => {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    clientId: 0,
    companyId: 1,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    currency: 'EUR',
    amountNet: 0,
    amountVat: 0,
    amountGross: 0,
    status: 'draft' as ClientInvoice['status'],
    relatedOrderId: null as number | null,
    notes: '',
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        invoiceNumber: invoice.invoiceNumber,
        clientId: invoice.clientId,
        companyId: invoice.companyId,
        invoiceDate: invoice.invoiceDate.split('T')[0],
        dueDate: invoice.dueDate.split('T')[0],
        currency: invoice.currency,
        amountNet: invoice.amountNet,
        amountVat: invoice.amountVat,
        amountGross: invoice.amountGross,
        status: invoice.status,
        relatedOrderId: invoice.relatedOrderId,
        notes: invoice.notes || '',
      });
    }
  }, [invoice]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const year = new Date(formData.invoiceDate).getFullYear();
    onSave({ ...formData, year });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {invoice ? 'Edit Invoice' : 'Create New Invoice'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Invoice Number</label>
              <input type="text" value={formData.invoiceNumber} onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Client ID</label>
              <input type="number" value={formData.clientId} onChange={(e) => setFormData({ ...formData, clientId: parseInt(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Invoice Date</label>
              <input type="date" value={formData.invoiceDate} onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Due Date</label>
              <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Currency</label>
              <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Net Amount</label>
              <input type="number" step="0.01" value={formData.amountNet} onChange={(e) => setFormData({ ...formData, amountNet: parseFloat(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">VAT Amount</label>
              <input type="number" step="0.01" value={formData.amountVat} onChange={(e) => setFormData({ ...formData, amountVat: parseFloat(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Gross Amount</label>
            <input type="number" step="0.01" value={formData.amountGross} onChange={(e) => setFormData({ ...formData, amountGross: parseFloat(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as ClientInvoice['status'] })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Notes</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={isLoading} className="flex-1 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50">
              {isLoading ? 'Saving...' : 'Save Invoice'}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-2.5 bg-gray-200 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
