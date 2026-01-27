import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { suppliersApi } from '../../api/suppliers';
import { clientsApi } from '../../api/clients';
import type { VehicleOrder } from '../../api/orders';

interface OrderFormProps {
  order?: VehicleOrder;
  onClose: () => void;
  onSuccess: () => void;
}

export default function OrderForm({ order, onClose, onSuccess }: OrderFormProps) {
  const [formData, setFormData] = useState({
    vehicleMake: order?.vehicleMake || '',
    vehicleModel: order?.vehicleModel || '',
    colour: order?.colour || '',
    vin: order?.vin || '',
    unitsOrdered: order?.unitsOrdered || 1,
    unitPriceEur: order?.unitPriceEur?.toString() || '',
    unitDepositEur: order?.unitDepositEur?.toString() || '',
    orderDate: order?.orderDate || new Date().toISOString().split('T')[0],
    eta: order?.eta || '',
    supplierId: order?.supplierId?.toString() || '',
    clientId: order?.clientId?.toString() || '',
    contractId: order?.contractId || '',
    status: order?.status || 'draft',
    paymentStatus: order?.paymentStatus || 'Pending',
    depositStatus: order?.depositStatus || 'Pending',
    contractStatus: order?.contractStatus || 'Pending',
    notes: order?.notes || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [calculatedTotals, setCalculatedTotals] = useState({
    totalCost: 0,
    totalDeposit: 0,
    balance: 0
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => suppliersApi.getAll(),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.getAll(),
  });

  useEffect(() => {
    const unitPrice = parseFloat(formData.unitPriceEur) || 0;
    const unitDeposit = parseFloat(formData.unitDepositEur) || 0;
    const units = formData.unitsOrdered || 0;

    const totalCost = unitPrice * units;
    const totalDeposit = unitDeposit * units;
    const balance = totalCost - totalDeposit;

    setCalculatedTotals({ totalCost, totalDeposit, balance });
  }, [formData.unitPriceEur, formData.unitDepositEur, formData.unitsOrdered]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderPayload = {
        ...formData,
        unitPriceEur: parseFloat(formData.unitPriceEur),
        unitDepositEur: parseFloat(formData.unitDepositEur),
        supplierId: formData.supplierId ? parseInt(formData.supplierId) : undefined,
        clientId: formData.clientId ? parseInt(formData.clientId) : undefined,
        totalCostEur: calculatedTotals.totalCost,
        depositTotalEur: calculatedTotals.totalDeposit,
        companyId: order?.companyId || 1,
        eta: formData.eta || undefined,
        vin: formData.vin || undefined,
        contractId: formData.contractId || undefined,
      };

      const url = order?.id 
        ? `http://localhost:8080/api/orders/${order.id}` 
        : 'http://localhost:8080/api/orders';
      
      const method = order?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) throw new Error(`Failed to ${order?.id ? 'update' : 'create'} order`);

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {order?.id ? `Edit Order #${order.id}` : 'Create New Order'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">🚗 Vehicle Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Make *</label>
                <input type="text" required placeholder="e.g., Mercedes"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.vehicleMake}
                  onChange={(e) => setFormData({...formData, vehicleMake: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Model *</label>
                <input type="text" required placeholder="e.g., GLE 300d"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Colour</label>
                <input type="text" placeholder="e.g., Black"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.colour}
                  onChange={(e) => setFormData({...formData, colour: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">VIN</label>
                <input type="text" placeholder="Vehicle Identification Number"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.vin}
                  onChange={(e) => setFormData({...formData, vin: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">🤝 Parties & Contract</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Supplier (From)</label>
                <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.supplierId}
                  onChange={(e) => setFormData({...formData, supplierId: e.target.value})}>
                  <option value="">Select Supplier</option>
                  {suppliers.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Client (To)</label>
                <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.clientId}
                  onChange={(e) => setFormData({...formData, clientId: e.target.value})}>
                  <option value="">Select Client</option>
                  {clients.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contract ID</label>
                <input type="text" placeholder="CON-2026-001"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.contractId}
                  onChange={(e) => setFormData({...formData, contractId: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">📋 Order Status</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Units *</label>
                <input type="number" required min="1"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.unitsOrdered}
                  onChange={(e) => setFormData({...formData, unitsOrdered: parseInt(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Order Status</label>
                <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="draft">Draft</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_transit">In Transit</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contract Status</label>
                <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.contractStatus}
                  onChange={(e) => setFormData({...formData, contractStatus: e.target.value})}>
                  <option>Pending</option>
                  <option>Signed</option>
                  <option>Active</option>
                  <option>Expired</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Payment Status</label>
                <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({...formData, paymentStatus: e.target.value})}>
                  <option>Pending</option>
                  <option>Partial</option>
                  <option>Paid</option>
                  <option>Overdue</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">💰 Pricing</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Unit Price (EUR) *</label>
                <input type="number" required step="0.01" placeholder="0.00"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.unitPriceEur}
                  onChange={(e) => setFormData({...formData, unitPriceEur: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Unit Deposit (EUR) *</label>
                <input type="number" required step="0.01" placeholder="0.00"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.unitDepositEur}
                  onChange={(e) => setFormData({...formData, unitDepositEur: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Deposit Status</label>
                <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.depositStatus}
                  onChange={(e) => setFormData({...formData, depositStatus: e.target.value})}>
                  <option>Pending</option>
                  <option>Partial</option>
                  <option>Paid</option>
                </select>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1 font-medium">Total Cost</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(calculatedTotals.totalCost)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1 font-medium">Total Deposit</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(calculatedTotals.totalDeposit)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1 font-medium">Balance Due</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(calculatedTotals.balance)}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">📅 Dates</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Order Date *</label>
                <input type="date" required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.orderDate}
                  onChange={(e) => setFormData({...formData, orderDate: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">ETA (Estimated Arrival)</label>
                <input type="date"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.eta}
                  onChange={(e) => setFormData({...formData, eta: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea rows={3} placeholder="Additional order notes, special requirements, etc..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})} />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <button type="button" onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition"
              disabled={loading}>
              Cancel
            </button>
            <button type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition disabled:opacity-50"
              disabled={loading}>
              {loading ? (order?.id ? 'Updating...' : 'Creating...') : (order?.id ? 'Update Order' : 'Create Order')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
