import { useState, useEffect } from 'react';
import { X, Truck, Package, MapPin, Calendar, FileText, DollarSign, Edit2, Trash2 } from 'lucide-react';
import type { Shipment } from '../../api/shipments';

interface ShipmentItem {
  id?: number;
  referenceType: 'ORDER' | 'CLIENT_INVOICE';
  referenceId: number;
  vin: string;
  vehicleMake: string;
  vehicleModel: string;
  notes?: string;
}

interface ShipmentDetailModalProps {
  shipment: Shipment;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ShipmentDetailModal = ({ shipment, onClose, onEdit, onDelete }: ShipmentDetailModalProps) => {
  const [items, setItems] = useState<ShipmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, [shipment.shipmentId]);

  const loadItems = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/shipments/${shipment.shipmentId}/items`);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'PREPARING': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'IN_TRANSIT': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'COLLECTED': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'ARRIVED': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      'CUSTOMS_CLEARED': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
      'DELIVERED': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${shipment.shipmentType === 'INBOUND' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
              <Package className={`w-6 h-6 ${shipment.shipmentType === 'INBOUND' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Shipment #{shipment.shipmentId}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {shipment.shipmentType === 'INBOUND' ? 'Inbound Delivery' : 'Outbound Shipment'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
              title="Edit"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(shipment.status || '')}`}>
              {shipment.status}
            </span>
            {shipment.trackingNumber && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Tracking: <span className="font-mono font-medium">{shipment.trackingNumber}</span>
              </span>
            )}
          </div>

          {/* Transport Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                <Truck className="w-4 h-4" />
                <span className="text-sm font-medium">Transport Details</span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Carrier</span>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{shipment.carrier || '-'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Method</span>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{shipment.transportMethod || '-'}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">Cost Breakdown</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-medium text-slate-900 dark:text-white">€{shipment.shippingCost?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Additional</span>
                  <span className="font-medium text-slate-900 dark:text-white">€{shipment.additionalExpenses?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-slate-700">
                  <span className="font-medium text-gray-900 dark:text-white">Total</span>
                  <span className="font-bold text-slate-900 dark:text-white">€{shipment.totalCost?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Route */}
          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Route</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">From</span>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{shipment.loadingLocation || 'Not specified'}</p>
              </div>
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className="flex-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">To</span>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{shipment.unloadingLocation || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Dates */}
          {(shipment.collectionDate || shipment.dropoffDate) && (
            <div className="grid grid-cols-2 gap-4">
              {shipment.collectionDate && (
                <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Collection</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {shipment.collectionDate} {shipment.collectionTime && `at ${shipment.collectionTime}`}
                  </p>
                </div>
              )}
              {shipment.dropoffDate && (
                <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Drop-off</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {shipment.dropoffDate} {shipment.dropoffTime && `at ${shipment.dropoffTime}`}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Vehicles */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              Vehicles ({items.length})
            </h3>
            {loading ? (
              <p className="text-gray-500 dark:text-gray-400">Loading vehicles...</p>
            ) : items.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No vehicles in this shipment</p>
            ) : (
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 dark:text-white">
                              {item.vehicleMake} {item.vehicleModel}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                              VIN: {item.vin}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {item.referenceType === 'ORDER' ? `Purchase Order #${item.referenceId}` : `Invoice #${item.referenceId}`}
                            </p>
                          </div>
                        </div>
                        {item.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 pl-13">
                            Note: {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Documents */}
          {(shipment.cmrDocument || shipment.exaDocument || shipment.customsDocument) && (
            <div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                <FileText className="w-4 h-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Documents</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {shipment.cmrDocument && (
                  <a href={shipment.cmrDocument} target="_blank" rel="noopener noreferrer" 
                     className="p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">CMR Document</p>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">View</p>
                  </a>
                )}
                {shipment.exaDocument && (
                  <a href={shipment.exaDocument} target="_blank" rel="noopener noreferrer"
                     className="p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">EXA Document</p>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">View</p>
                  </a>
                )}
                {shipment.customsDocument && (
                  <a href={shipment.customsDocument} target="_blank" rel="noopener noreferrer"
                     className="p-3 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Customs Document</p>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">View</p>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {shipment.notes && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Notes</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                {shipment.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

