import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/orders';
import type { VehicleOrder } from '../api/orders';

import OrderForm from '../components/modals/OrderForm';
import OrderDetailsModal from '../components/modals/OrderDetailsModal';
import RecordPaymentModal from '../components/modals/RecordPaymentModal';

export const OrdersPage = () => {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<VehicleOrder | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<VehicleOrder | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<VehicleOrder | null>(null);
  
  const [filters, setFilters] = useState({
    status: '',
    supplierId: '',
    fromDate: '',
    toDate: '',
  });

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders', filters],
    queryFn: async () => {
      const params = {
        status: filters.status || undefined,
        supplierId: filters.supplierId ? parseInt(filters.supplierId) : undefined,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
      };
      const response = await ordersApi.search(params);
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => ordersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this order?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCreateSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['orders'] });
  };

  const handlePaymentSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    queryClient.invalidateQueries({ queryKey: ['payments'] });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '€0';
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-IE');
  };

  const getStatusBadge = (status?: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-500',
      active: 'bg-blue-500',
      confirmed: 'bg-blue-500',
      'in progress': 'bg-yellow-500',
      in_transit: 'bg-yellow-500',
      completed: 'bg-green-500',
      cancelled: 'bg-red-500',
    };
    const color = colors[status?.toLowerCase() || 'draft'] || 'bg-gray-500';
    return (
      <span className={`${color} text-white text-xs px-2 py-1 rounded`}>
        {status || 'Draft'}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus?: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-orange-100 text-orange-700',
      partial: 'bg-blue-100 text-blue-700',
      paid: 'bg-green-100 text-green-700',
      overdue: 'bg-red-100 text-red-700',
    };
    const color = colors[paymentStatus?.toLowerCase() || 'pending'] || 'bg-gray-100 text-gray-700';
    return (
      <span className={`${color} text-xs px-2 py-1 rounded font-medium`}>
        {paymentStatus || 'Pending'}
      </span>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          + Create Order
        </button>
      </div>

      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="input-field"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All</option>
              <option value="draft">Draft</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_transit">In Transit</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">From Date</label>
            <input
              type="date"
              className="input-field"
              value={filters.fromDate}
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">To Date</label>
            <input
              type="date"
              className="input-field"
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', supplierId: '', fromDate: '', toDate: '' })}
              className="btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {isLoading && (
          <div className="p-8 text-center text-gray-500">Loading orders...</div>
        )}

        {error && (
          <div className="p-8 text-center text-red-500">
            Error loading orders. Make sure backend is running on localhost:8080
          </div>
        )}

        {!isLoading && !error && orders && orders.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No orders found. Create your first order to get started.
          </div>
        )}

        {!isLoading && !error && orders && orders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Order Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Vehicle</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Units</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Total Cost</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">#{order.id}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(order.orderDate)}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium">{order.vehicleMake || '-'}</div>
                      <div className="text-gray-500 text-xs">{order.vehicleModel || '-'}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{order.unitsOrdered || 0}</td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {formatCurrency(order.totalCostEur)}
                    </td>
                    <td className="px-4 py-3 text-sm">{getStatusBadge(order.status)}</td>
                    <td className="px-4 py-3 text-sm">
                      {getPaymentBadge(order.paymentStatus)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetailsModal(true);
                          }}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => setPaymentOrder(order)}
                          className="text-green-600 hover:underline text-sm font-medium"
                          title="Record Payment"
                        >
                          💳 Pay
                        </button>
                        <button
                          onClick={() => order.id && handleDelete(order.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <OrderForm
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedOrder(null);
          }}
          onEdit={() => {
            setEditingOrder(selectedOrder);
            setShowDetailsModal(false);
          }}
        />
      )}

      {/* Edit Modal */}
      {editingOrder && (
        <OrderForm
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSuccess={() => {
            setEditingOrder(null);
            handleCreateSuccess();
          }}
        />
      )}

      {/* Record Payment Modal */}
      {paymentOrder && (
        <RecordPaymentModal
          orderId={paymentOrder.id!}
          orderTotal={paymentOrder.totalCostEur || 0}
          paidAmount={0}
          onClose={() => setPaymentOrder(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};