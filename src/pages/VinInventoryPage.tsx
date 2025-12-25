import { useState } from 'react';
import { mockVins, mockSuppliers, type VIN } from '../data/mockVins';
import { VinModal } from '../components/modals/VinModal';
import { VinDetailDrawer } from '../components/drawers/VinDetailDrawer';

export const VinInventoryPage = () => {
  const [vins, setVins] = useState<VIN[]>(mockVins);
  const [filters, setFilters] = useState({ search: '', supplier: '', stockStatus: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVin, setSelectedVin] = useState<VIN | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredVins = vins.filter((vin) => {
    const matchesSearch = !filters.search || 
      vin.vin.toLowerCase().includes(filters.search.toLowerCase()) ||
      vin.make.toLowerCase().includes(filters.search.toLowerCase()) ||
      vin.model.toLowerCase().includes(filters.search.toLowerCase());
    const matchesSupplier = !filters.supplier || vin.supplierId.toString() === filters.supplier;
    const matchesStatus = !filters.stockStatus || vin.stockStatus === filters.stockStatus;
    return matchesSearch && matchesSupplier && matchesStatus;
  });

  const handleAddVin = (data: Partial<VIN>) => {
    const newVin: VIN = {
      id: Math.max(...vins.map(v => v.id)) + 1,
      vin: data.vin || '',
      make: data.make || '',
      model: data.model || '',
      year: data.year || new Date().getFullYear(),
      colour: data.colour || '',
      supplierId: data.supplierId || 1,
      supplierName: mockSuppliers.find(s => s.id === data.supplierId)?.name || '',
      purchasePrice: data.purchasePrice || 0,
      currency: data.currency || 'EUR',
      stockStatus: data.stockStatus || 'in_stock',
      cocStatus: 'not_received',
      exaStatus: 'not_required',
      deliveryStatus: 'not_shipped',
      createdAt: new Date().toISOString(),
    };
    setVins([...vins, newVin]);
    setIsModalOpen(false);
    console.log('Added VIN:', newVin);
  };

  const handleViewDetails = (vin: VIN) => {
    setSelectedVin(vin);
    setIsDrawerOpen(true);
  };
  const getStockBadge = (status: string) => {
    const styles = {
      in_stock: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      reserved: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
      sold: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
    };
    const labels = { in_stock: 'In Stock', reserved: 'Reserved', sold: 'Sold' };
    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status as keyof typeof styles]}`}>{labels[status as keyof typeof labels]}</span>;
  };

  const getCocBadge = (status: string) => {
    const styles = {
      not_received: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
      received: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      expired: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
    };
    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status as keyof typeof styles]}`}>{status.replace('_', ' ').toUpperCase()}</span>;
  };

  const getExaBadge = (status: string) => {
    const styles = {
      not_required: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
      approved: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    };
    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status as keyof typeof styles]}`}>{status.replace('_', ' ').toUpperCase()}</span>;
  };

  const getDeliveryBadge = (status: string) => {
    const styles = {
      not_shipped: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
      in_transit: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
      delivered: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    };
    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status as keyof typeof styles]}`}>{status.replace('_', ' ').toUpperCase()}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">VIN Inventory</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your vehicle inventory and documentation</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/20">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Add VIN
        </button>
      </div>
      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px]">
            <input type="text" placeholder="Search VIN, make, or model..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <select value={filters.supplier} onChange={(e) => setFilters({ ...filters, supplier: e.target.value })} className="px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">All Suppliers</option>
            {mockSuppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={filters.stockStatus} onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value })} className="px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">All Stock Status</option>
            <option value="in_stock">In Stock</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">VIN</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">COC</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">EXA</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Delivery</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
              {filteredVins.map((vin) => (
                <tr key={vin.id} className="hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono font-semibold text-slate-900 dark:text-white">{vin.vin}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{vin.year} {vin.make} {vin.model}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{vin.colour}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{vin.supplierName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStockBadge(vin.stockStatus)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getCocBadge(vin.cocStatus)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getExaBadge(vin.exaStatus)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getDeliveryBadge(vin.deliveryStatus)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleViewDetails(vin)} className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <VinModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddVin} />
      <VinDetailDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} vin={selectedVin} />
    </div>
  );
};
