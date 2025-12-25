import { useState } from 'react';
import { mockSuppliers } from '../../data/mockVins';

interface VinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const VinModal = ({ isOpen, onClose, onSave }: VinModalProps) => {
  const [formData, setFormData] = useState({
    vin: '',
    supplierId: 1,
    make: '',
    model: '',
    year: new Date().getFullYear(),
    colour: '',
    purchasePrice: 0,
    currency: 'EUR',
    stockStatus: 'in_stock' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      vin: '',
      supplierId: 1,
      make: '',
      model: '',
      year: new Date().getFullYear(),
      colour: '',
      purchasePrice: 0,
      currency: 'EUR',
      stockStatus: 'in_stock',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-slate-800">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Add New VIN</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-lg transition-colors">
            <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">VIN Number *</label>
              <input type="text" value={formData.vin} onChange={(e) => setFormData({ ...formData, vin: e.target.value.toUpperCase() })} placeholder="e.g. WBADT43452G876543" className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none" required maxLength={17} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Supplier *</label>
              <select value={formData.supplierId} onChange={(e) => setFormData({ ...formData, supplierId: parseInt(e.target.value) })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required>
                {mockSuppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Make *</label>
                <input type="text" value={formData.make} onChange={(e) => setFormData({ ...formData, make: e.target.value })} placeholder="e.g. BMW" className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Model *</label>
                <input type="text" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} placeholder="e.g. 3 Series" className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Year *</label>
                <input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} min="2000" max={new Date().getFullYear() + 1} className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Colour *</label>
                <input type="text" value={formData.colour} onChange={(e) => setFormData({ ...formData, colour: e.target.value })} placeholder="e.g. Alpine White" className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Purchase Price *</label>
                <input type="number" step="0.01" value={formData.purchasePrice} onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) })} placeholder="0.00" className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Currency *</label>
                <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="USD">USD ($)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Stock Status *</label>
              <select value={formData.stockStatus} onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value as any })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required>
                <option value="in_stock">In Stock</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-800 flex gap-3">
            <button type="submit" className="flex-1 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              Add VIN
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
