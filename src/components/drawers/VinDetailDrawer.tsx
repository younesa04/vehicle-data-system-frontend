import { type VIN } from '../../data/mockVins';

interface VinDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vin: VIN | null;
}

export const VinDetailDrawer = ({ isOpen, onClose, vin }: VinDetailDrawerProps) => {
  if (!isOpen || !vin) return null;

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: Record<string, string> = { EUR: '€', GBP: '£', USD: '$', JPY: '¥' };
    return `${symbols[currency] || ''}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-slate-950 shadow-2xl z-50 overflow-y-auto border-l border-gray-200 dark:border-slate-800">
        <div className="sticky top-0 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">VIN Details</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-mono mt-1">{vin.vin}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-lg transition-colors">
            <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 border border-blue-100 dark:border-blue-900/30">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Vehicle Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Make & Model</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{vin.year} {vin.make} {vin.model}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Colour</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{vin.colour}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Supplier</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{vin.supplierName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Purchase Price</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(vin.purchasePrice, vin.currency)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Certificate of Conformity (COC)</h3>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                vin.cocStatus === 'received' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                vin.cocStatus === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                vin.cocStatus === 'expired' ? 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400' :
                'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {vin.cocStatus.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800">
                <span className="text-sm text-slate-600 dark:text-slate-400">Received Date</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{formatDate(vin.cocReceivedDate)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800">
                <span className="text-sm text-slate-600 dark:text-slate-400">Document</span>
                {vin.cocDocumentUrl ? (
                  <a href={vin.cocDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    View Document
                  </a>
                ) : (
                  <span className="text-sm text-slate-400">Not uploaded</span>
                )}
              </div>
              <button className="w-full mt-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/40 transition-colors">
                Upload COC Document
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Export Approval (EXA)</h3>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                vin.exaStatus === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                vin.exaStatus === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                vin.exaStatus === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
              }`}>
                {vin.exaStatus.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800">
                <span className="text-sm text-slate-600 dark:text-slate-400">Approved Date</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{formatDate(vin.exaApprovedDate)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800">
                <span className="text-sm text-slate-600 dark:text-slate-400">Document</span>
                {vin.exaDocumentUrl ? (
                  <a href={vin.exaDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    View Document
                  </a>
                ) : (
                  <span className="text-sm text-slate-400">Not uploaded</span>
                )}
              </div>
              <button className="w-full mt-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/40 transition-colors">
                Upload EXA Document
              </button>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delivery & Shipping</h3>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                vin.deliveryStatus === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                vin.deliveryStatus === 'in_transit' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
              }`}>
                {vin.deliveryStatus.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800">
                <span className="text-sm text-slate-600 dark:text-slate-400">Waybill Number</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white font-mono">{vin.waybillNumber || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800">
                <span className="text-sm text-slate-600 dark:text-slate-400">Delivery Date</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{formatDate(vin.deliveryDate)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800">
                <span className="text-sm text-slate-600 dark:text-slate-400">Stock Status</span>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                  vin.stockStatus === 'in_stock' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                  vin.stockStatus === 'reserved' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                  'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                }`}>
                  {vin.stockStatus === 'in_stock' ? 'In Stock' : vin.stockStatus === 'reserved' ? 'Reserved' : 'Sold'}
                </span>
              </div>
            </div>
          </div>

          {vin.notes && (
            <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-6 border border-amber-200 dark:border-amber-900/30">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Notes
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">{vin.notes}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
