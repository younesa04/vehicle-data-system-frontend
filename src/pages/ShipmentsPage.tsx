import { useState, useEffect } from 'react';
import { CreateShipmentModal } from '../components/modals/CreateShipmentModal';
import type { Shipment } from '../api/shipments';

export const ShipmentsPage = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'INBOUND' | 'OUTBOUND'>('ALL');

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/shipments');
    const data = await response.json();
    
    // Check if data is an array, if not set empty array
    if (Array.isArray(data)) {
      setShipments(data);
    } else {
      console.error('API returned non-array:', data);
      setShipments([]);
    }
  } catch (error) {
    console.error('Failed to load shipments:', error);
    setShipments([]);
  } finally {
    setLoading(false);
  }
};


  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this shipment?')) return;
    
    try {
      await fetch(`http://localhost:8080/api/shipments/${id}`, {
        method: 'DELETE'
      });
      loadShipments();
    } catch (error) {
      console.error('Failed to delete shipment:', error);
      alert('Failed to delete shipment');
    }
  };

  const filteredShipments = shipments.filter(s => 
    filterType === 'ALL' ? true : s.shipmentType === filterType
  );

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    
    switch (status) {
      case 'PREPARING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'IN_TRANSIT': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'COLLECTED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'ARRIVED': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
      case 'CUSTOMS_CLEARED': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400';
      case 'DELIVERED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getTypeColor = (type: string | undefined) => {
    return type === 'INBOUND' 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading shipments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Shipments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage inbound and outbound vehicle shipments
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Shipment
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-slate-700">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-4 py-2 font-medium transition-colors ${
            filterType === 'ALL'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          All ({shipments.length})
        </button>
        <button
          onClick={() => setFilterType('INBOUND')}
          className={`px-4 py-2 font-medium transition-colors ${
            filterType === 'INBOUND'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          📥 Inbound ({shipments.filter(s => s.shipmentType === 'INBOUND').length})
        </button>
        <button
          onClick={() => setFilterType('OUTBOUND')}
          className={`px-4 py-2 font-medium transition-colors ${
            filterType === 'OUTBOUND'
              ? 'border-b-2 border-green-600 text-green-600 dark:text-green-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          📤 Outbound ({shipments.filter(s => s.shipmentType === 'OUTBOUND').length})
        </button>
      </div>

      {/* Shipments Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Carrier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tracking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Vehicles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No shipments found. Create your first shipment to get started.
                  </td>
                </tr>
              ) : (
                filteredShipments.map((shipment) => (
                  <tr key={shipment.shipmentId!} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                      #{shipment.shipmentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(shipment.shipmentType)}`}>
                        {shipment.shipmentType === 'INBOUND' ? '📥' : '📤'} {shipment.shipmentType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {shipment.carrier || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 font-mono">
                      {shipment.trackingNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      <span className="inline-flex items-center gap-1">
                        🚗 {shipment.vehicleCount || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                      <div className="flex items-center gap-1 text-xs">
                        <span className="truncate max-w-[100px]" title={shipment.loadingLocation}>
                          {shipment.loadingLocation || 'N/A'}
                        </span>
                        <span>→</span>
                        <span className="truncate max-w-[100px]" title={shipment.unloadingLocation}>
                          {shipment.unloadingLocation || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                      €{shipment.totalCost?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setEditingShipment(shipment)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(shipment.shipmentId)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {(showCreateModal || editingShipment) && (
        <CreateShipmentModal
          onClose={() => {
            setShowCreateModal(false);
            setEditingShipment(null);
          }}
          onSuccess={() => {
            loadShipments();
            setShowCreateModal(false);
            setEditingShipment(null);
          }}
          editShipment={editingShipment}
        />
      )}
    </div>
  );
};
