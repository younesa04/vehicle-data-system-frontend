import { useState } from 'react';
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '../hooks/useClients';
import { ClientModal } from '../components/modals/ClientModal';
import type { Client } from '../types';

const COUNTRIES = [
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
];

export const ClientsPage = () => {
  const [filters, setFilters] = useState({ search: '', country: '', cocStatus: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { data: clients = [], isLoading, error } = useClients({ search: filters.search, country: filters.country || undefined, cocStatus: filters.cocStatus || undefined });
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const deleteMutation = useDeleteClient();

  const filteredClients = clients.filter((client) => {
    const matchesSearch = !filters.search || client.companyName.toLowerCase().includes(filters.search.toLowerCase()) || client.contactName.toLowerCase().includes(filters.search.toLowerCase()) || client.email.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCountry = !filters.country || client.countryCode === filters.country;
    const matchesCoc = !filters.cocStatus || client.cocStatus === filters.cocStatus;
    return matchesSearch && matchesCountry && matchesCoc;
  });

  const handleSave = async (data: Partial<Client>) => {
    try {
      if (selectedClient) {
        await updateMutation.mutateAsync({ id: selectedClient.id, data });
      } else {
        await createMutation.mutateAsync(data as any);
      }
      setIsModalOpen(false);
      setSelectedClient(null);
    } catch (err) {
      alert('Failed to save client');
    }
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        alert('Failed to delete client');
      }
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    const styles = {
      not_required: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
      received: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      valid: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      expired: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    };
    return (<span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>{status.replace('_', ' ').toUpperCase()}</span>);
  };

  const getCountryFlag = (code: string) => {
    return COUNTRIES.find(c => c.code === code)?.flag || '🌍';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Clients</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your customer database</p>
        </div>
        <button onClick={() => { setSelectedClient(null); setIsModalOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Add Client
        </button>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input type="text" placeholder="Search by company, contact, or email..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <select value={filters.country} onChange={(e) => setFilters({ ...filters, country: e.target.value })} className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">All Countries</option>
            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
          </select>
          <select value={filters.cocStatus} onChange={(e) => setFilters({ ...filters, cocStatus: e.target.value })} className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">All COC Status</option>
            <option value="not_required">Not Required</option>
            <option value="pending">Pending</option>
            <option value="received">Received</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">Failed to load clients</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No clients found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">Add your first client to get started</p>
            <button onClick={() => { setSelectedClient(null); setIsModalOpen(true); }} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Client
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Country</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">COC Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Export License</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{client.companyName}</div>
                      {client.tradingName && <div className="text-xs text-slate-500 dark:text-slate-400">t/a {client.tradingName}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{client.contactName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{client.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{client.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center gap-1">
                        <span className="text-lg">{getCountryFlag(client.countryCode)}</span>
                        <span className="text-slate-600 dark:text-slate-400">{client.countryCode}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(client.cocStatus)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(client.exportLicenseStatus)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(client)} className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded transition-colors" title="Edit">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(client.id)} className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors" title="Delete">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
      <ClientModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedClient(null); }} onSave={handleSave} client={selectedClient} isLoading={createMutation.isPending || updateMutation.isPending} />
    </div>
  );
};
