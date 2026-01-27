import React, { useState } from 'react';
import { paymentsApi, type Payment } from '../../api/payments';

interface RecordPaymentModalProps {
  orderId: number;
  orderTotal: number;
  paidAmount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RecordPaymentModal({ 
  orderId, 
  orderTotal, 
  paidAmount, 
  onClose, 
  onSuccess 
}: RecordPaymentModalProps) {
  const balance = orderTotal - paidAmount;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };
  
  const [formData, setFormData] = useState({
    paymentDate: new Date().toISOString().split('T')[0],
    amount: balance.toFixed(2),
    paymentMethod: 'Bank Transfer',
    status: 'completed',
    paymentType: 'deposit',
    paymentStatus: 'paid',
    proofLink: '',
    currencyId: 1
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Submitting payment:', { orderId, ...formData });
      const result = await paymentsApi.create({
        orderId,
        ...formData,
        amount: parseFloat(formData.amount)
      });
      console.log('Payment created:', result);
      alert('Payment recorded successfully!');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Payment error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to record payment';
      setError(errorMsg);
      alert('Error: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">💰 Record Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-600 mb-1">Order Total</p>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(orderTotal)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Paid</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(paidAmount)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Balance</p>
              <p className="text-lg font-bold text-orange-600">{formatCurrency(balance)}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Payment Date *</label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.paymentDate}
                onChange={(e) => setFormData({...formData, paymentDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Amount (EUR) *</label>
              <input
                type="number"
                required
                step="0.01"
                min="0.01"
                max={balance}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Payment Method *</label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}>
                <option>Bank Transfer</option>
                <option>Wire Transfer</option>
                <option>Credit Card</option>
                <option>Cash</option>
                <option>Cheque</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Payment Type *</label>
              <select
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.paymentType}
                onChange={(e) => setFormData({...formData, paymentType: e.target.value})}>
                <option value="deposit">Deposit</option>
                <option value="balance">Balance</option>
                <option value="full">Full Payment</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Transaction Reference / Proof Link</label>
            <input
              type="text"
              placeholder="Transaction ID or link to proof"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.proofLink}
              onChange={(e) => setFormData({...formData, proofLink: e.target.value})}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              disabled={loading}>
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              disabled={loading}>
              {loading ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

