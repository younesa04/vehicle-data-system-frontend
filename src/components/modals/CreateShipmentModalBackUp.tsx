
import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Package, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { shipmentsApi } from '../../api/shipments';
import type { Shipment } from '../../api/shipments';
import { ordersApi } from '../../api/orders';
import type { VehicleOrder } from '../../api/orders';

interface CreateShipmentModalProps {
  onClose: () => void;
  onSuccess: () => void;
  orderId?: number;
  initialType?: 'INBOUND' | 'OUTBOUND';
  editShipment?: Shipment | null;
}

interface ClientInvoice {
  id: number;
  invoiceNumber: string;
  clientId: number;
}

interface ShipmentItem {
  id?: number;
  referenceType: 'ORDER' | 'CLIENT_INVOICE';
  referenceId: number;
  vin: string;
  vehicleMake: string;
  vehicleModel: string;
  notes?: string;
}

export const CreateShipmentModal = ({ 
  onClose, 
  onSuccess, 
  orderId, 
  initialType = 'INBOUND',
  editShipment
}: CreateShipmentModalProps) => {
  const [orders, setOrders] = useState<VehicleOrder[]>([]);
  const [clientInvoices, setClientInvoices] = useState<ClientInvoice[]>([]);
  const [shipmentType, setShipmentType] = useState<'INBOUND' | 'OUTBOUND'>(
    editShipment?.shipmentType as 'INBOUND' | 'OUTBOUND' || initialType
  );
  const [shipmentItems, setShipmentItems] = useState<ShipmentItem[]>([]);
  const [formData, setFormData] = useState<Partial<Shipment>>(
    editShipment || {
      shipmentType: initialType,
      status: 'PREPARING',
      carrier: '',
      trackingNumber: '',
      collectionDate: '',
      collectionTime: '',
      etaCollection: '',
      dropoffDate: '',
      dropoffTime: '',
      containerNumber: '',
      vesselName: '',
      loadingLocation: '',
      unloadingLocation: '',
      transportMethod: '',
      vehicleCount: 0,
      departureDate: '',
      estimatedArrival: '',
      cmrDocument: '',
      exaDocument: '',
      customsDocument: '',
      shippingCost: 0,
      additionalExpenses: 0,
      notes: ''
    }
  );
  const [loading, setLoading] = useState(false);

  const [currentItem, setCurrentItem] = useState<Partial<ShipmentItem>>({
    referenceType: shipmentType === 'INBOUND' ? 'ORDER' : 'CLIENT_INVOICE',
    referenceId: undefined,
    vin: '',
    vehicleMake: '',
    vehicleModel: '',
    notes: ''
  });

  useEffect(() => {
    if (editShipment?.shipmentId) {
      fetch(`http://localhost:8080/api/shipments/${editShipment.shipmentId}/items`)
        .then(res => res.json())
        .then(items => setShipmentItems(items))
        .catch(err => console.error('Failed to load shipment items:', err));
    }
  }, [editShipment]);

  useEffect(() => {
    if (shipmentType === 'INBOUND') {
      loadOrders();
    } else {
      loadClientInvoices();
    }
  }, [shipmentType]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, shipmentType }));
    setCurrentItem(prev => ({ 
      ...prev, 
      referenceType: shipmentType === 'INBOUND' ? 'ORDER' : 'CLIENT_INVOICE' 
    }));
  }, [shipmentType]);

  useEffect(() => {
    const shipping = formData.shippingCost || 0;
    const additional = formData.additionalExpenses || 0;
    setFormData(prev => ({ ...prev, totalCost: shipping + additional }));
  }, [formData.shippingCost, formData.additionalExpenses]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, vehicleCount: shipmentItems.length }));
  }, [shipmentItems]);

  const loadOrders = async () => {
    try {
      const response = await ordersApi.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const loadClientInvoices = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/client-invoices');
      if (response.ok) {
        const data = await response.json();
        setClientInvoices(data);
      } else {
        setClientInvoices([
          { id: 1, invoiceNumber: 'INV-2026-001', clientId: 1 },
          { id: 2, invoiceNumber: 'INV-2026-002', clientId: 2 },
          { id: 3, invoiceNumber: 'INV-2026-003', clientId: 1 }
        ]);
      }
    } catch (error) {
      console.error('Failed to load client invoices:', error);
      setClientInvoices([
        { id: 1, invoiceNumber: 'INV-2026-001', clientId: 1 },
        { id: 2, invoiceNumber: 'INV-2026-002', clientId: 2 },
        { id: 3, invoiceNumber: 'INV-2026-003', clientId: 1 }
      ]);
    }
  };

  const handleAddVehicle = () => {
    if (!currentItem.referenceId || !currentItem.vin) {
      alert('Please select order/invoice and enter VIN');
      return;
    }

    setShipmentItems([...shipmentItems, currentItem as ShipmentItem]);
    setCurrentItem({
      referenceType: shipmentType === 'INBOUND' ? 'ORDER' : 'CLIENT_INVOICE',
      referenceId: undefined,
      vin: '',
      vehicleMake: '',
      vehicleModel: '',
      notes: ''
    });
  };

  const handleRemoveVehicle = (index: number) => {
    setShipmentItems(shipmentItems.filter((_, i) => i !== index));
  };

  const handleReferenceChange = (refId: number) => {
    if (shipmentType === 'INBOUND') {
      const order = orders.find(o => o.id === refId);
      if (order) {
        setCurrentItem({
          ...currentItem,
          referenceId: refId,
          vehicleMake: order.vehicleMake,
          vehicleModel: order.vehicleModel
        });
      }
    } else {
      setCurrentItem({
        ...currentItem,
        referenceId: refId
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (shipmentItems.length === 0) {
      alert('Please add at least one vehicle to the shipment');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        items: shipmentItems
      };
      
      const url = editShipment?.shipmentId 
        ? `http://localhost:8080/api/shipments/${editShipment.shipmentId}`
        : 'http://localhost:8080/api/shipments';
      
      const method = editShipment?.shipmentId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save: ${response.status} - ${errorText}`);
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save shipment:', error);
      alert(`Failed to save shipment: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {editShipment ? 'Edit Shipment' : 'Create Shipment'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Shipment Type Toggle */}
          <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Shipment Direction
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setShipmentType('INBOUND')}
                disabled={!!editShipment}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                  shipmentType === 'INBOUND'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                } ${editShipment ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ArrowDownToLine className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-bold">Inbound</div>
                  <div className="text-xs mt-0.5">Supplier → Warehouse</div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setShipmentType('OUTBOUND')}
                disabled={!!editShipment}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                  shipmentType === 'OUTBOUND'
                    ? 'border-green-600 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    : 'border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                } ${editShipment ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ArrowUpFromLine className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-bold">Outbound</div>
                  <div className="text-xs mt-0.5">Warehouse → Client</div>
                </div>
              </button>
            </div>
          </div>

          {/* Vehicles Section */}
          <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Vehicles in Shipment ({shipmentItems.length})
              </h3>
            </div>

            {/* Add Vehicle Form */}
            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-3">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {shipmentType === 'INBOUND' ? 'Purchase Order' : 'Client Invoice'}
                  </label>
                  {shipmentType === 'INBOUND' ? (
                    <select
                      value={currentItem.referenceId || ''}
                      onChange={(e) => handleReferenceChange(parseInt(e.target.value))}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="">Select order</option>
                      {orders.map(order => (
                        <option key={order.id} value={order.id}>
                          Order #{order.id}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={currentItem.referenceId || ''}
                      onChange={(e) => handleReferenceChange(parseInt(e.target.value))}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="">Select invoice</option>
                      {clientInvoices.map(invoice => (
                        <option key={invoice.id} value={invoice.id}>
                          {invoice.invoiceNumber}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="col-span-3">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    VIN *
                  </label>
                  <input
                    type="text"
                    value={currentItem.vin || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, vin: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    placeholder="17-character VIN"
                    maxLength={17}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Make
                  </label>
                  <input
                    type="text"
                    value={currentItem.vehicleMake || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, vehicleMake: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    value={currentItem.vehicleModel || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, vehicleModel: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="col-span-2 flex items-end">
                  <button
                    type="button"
                    onClick={handleAddVehicle}
                    className="w-full px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Vehicle List */}
            {shipmentItems.length > 0 ? (
              <div className="space-y-2">
                {shipmentItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded border border-gray-200 dark:border-slate-700">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {item.vehicleMake} {item.vehicleModel}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        VIN: {item.vin}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.referenceType === 'ORDER' ? `Order #${item.referenceId}` : `Invoice #${item.referenceId}`}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveVehicle(index)}
                      className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      title="Remove vehicle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                No vehicles added yet. Use the form above to add vehicles.
              </div>
            )}
          </div>

          {/* Rest of the form continues... */}
          {/* Basic Shipment Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Carrier/Shipper *
              </label>
              <input
                type="text"
                value={formData.carrier || ''}
                onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                required
                placeholder={shipmentType === 'INBOUND' ? 'e.g., DHL, Schenker' : 'e.g., Maersk, MSC'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tracking Number
              </label>
              <input
                type="text"
                value={formData.trackingNumber || ''}
                onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Transport Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Transport Method
            </label>
            <select
              value={formData.transportMethod || ''}
              onChange={(e) => setFormData({ ...formData, transportMethod: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="">Select method</option>
              <option value="TRUCK">Truck</option>
              <option value="SEA_FREIGHT">Sea Freight</option>
              <option value="AIR_FREIGHT">Air Freight</option>
              <option value="RAIL">Rail</option>
            </select>
          </div>

          {/* Collection & Drop-off */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Collection Date & Time
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={formData.collectionDate || ''}
                  onChange={(e) => setFormData({ ...formData, collectionDate: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <input
                  type="time"
                  value={formData.collectionTime || ''}
                  onChange={(e) => setFormData({ ...formData, collectionTime: e.target.value })}
                  className="w-28 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Drop-off Date & Time
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={formData.dropoffDate || ''}
                  onChange={(e) => setFormData({ ...formData, dropoffDate: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <input
                  type="time"
                  value={formData.dropoffTime || ''}
                  onChange={(e) => setFormData({ ...formData, dropoffTime: e.target.value })}
                  className="w-28 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Locations */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {shipmentType === 'INBOUND' ? 'Loading Location (Supplier)' : 'Loading Location (Warehouse)'}
              </label>
              <input
                type="text"
                value={formData.loadingLocation || ''}
                onChange={(e) => setFormData({ ...formData, loadingLocation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {shipmentType === 'INBOUND' ? 'Unloading Location (Warehouse)' : 'Unloading Location (Client)'}
              </label>
              <input
                type="text"
                value={formData.unloadingLocation || ''}
                onChange={(e) => setFormData({ ...formData, unloadingLocation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Documents */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CMR Document
              </label>
              <input
                type="text"
                placeholder="Document link"
                value={formData.cmrDocument || ''}
                onChange={(e) => setFormData({ ...formData, cmrDocument: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                EXA Document
              </label>
              <input
                type="text"
                placeholder="Document link"
                value={formData.exaDocument || ''}
                onChange={(e) => setFormData({ ...formData, exaDocument: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Customs Document
              </label>
              <input
                type="text"
                placeholder="Document link"
                value={formData.customsDocument || ''}
                onChange={(e) => setFormData({ ...formData, customsDocument: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Costs */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Shipping Cost (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.shippingCost || 0}
                onChange={(e) => setFormData({ ...formData, shippingCost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Expenses (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.additionalExpenses || 0}
                onChange={(e) => setFormData({ ...formData, additionalExpenses: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Cost (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.totalCost || 0}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-100 dark:bg-slate-700 text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status *
            </label>
            <select
              value={formData.status || ''}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              required
            >
              <option value="PREPARING">Preparing</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="COLLECTED">Collected</option>
              <option value="ARRIVED">Arrived</option>
              <option value="CUSTOMS_CLEARED">Customs Cleared</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || shipmentItems.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>Processing...</>
              ) : (
                <>
                  {editShipment ? 'Update' : 'Create'} Shipment ({shipmentItems.length} vehicles)
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
