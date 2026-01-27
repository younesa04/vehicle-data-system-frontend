import type { VehicleOrder } from '../../api/orders';
import PaymentHistory from '../PaymentHistory';

interface OrderDetailsModalProps {
  order: VehicleOrder;
  onClose: () => void;
  onEdit: () => void;
}

export default function OrderDetailsModal({ order, onClose, onEdit }: OrderDetailsModalProps) {
  const formatCurrency = (amount?: number) => {
    if (!amount) return '€0.00';
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-IE');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Order #{order.id} Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Order Date</h3>
              <p className="text-lg">{formatDate(order.orderDate)}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Status</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                {order.status || 'Draft'}
              </span>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-bold mb-4">Vehicle Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Make</p>
                <p className="font-medium">{order.vehicleMake || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Model</p>
                <p className="font-medium">{order.vehicleModel || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Units</p>
                <p className="font-medium">{order.unitsOrdered || 0}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-bold mb-4">Financial Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Cost</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(order.totalCostEur)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-sm font-medium">
                  {order.paymentStatus || 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {order.id && <PaymentHistory orderId={order.id} />}

          {order.notes && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold mb-2">Notes</h3>
              <p className="text-gray-700">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex gap-3 justify-end">
          <button
            onClick={onEdit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Edit Order
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}