import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Mail, Phone, MapPin, FileText, Plus, Trash2, Edit2 } from 'lucide-react';

const clientsApi = {
  getAll: async () => {
    const response = await fetch('http://localhost:8080/api/clients');
    return response.json();
  },
  create: async (data: any) => {
    const response = await fetch('http://localhost:8080/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  update: async ({ id, data }: any) => {
    const response = await fetch(`http://localhost:8080/api/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  delete: async (id: number) => {
    await fetch(`http://localhost:8080/api/clients/${id}`, { method: 'DELETE' });
  }
};

const COUNTRIES = [
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'QA', name: 'Qatar' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'OM', name: 'Oman' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'IE', name: 'Ireland' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
];

export const ClientsPage = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    countryCode: '',
    notes: ''
  });

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsApi.getAll
  });

  const createMutation = useMutation({
    mutationFn: clientsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setShowModal(false);
      setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '', country: '', countryCode: '', notes: '' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: clientsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setShowModal(false);
      setEditingId(null);
      setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '', country: '', countryCode: '', notes: '' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: clientsApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] })
  });

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = COUNTRIES.find(c => c.name === e.target.value);
    setFormData({
      ...formData,
      country: selected?.name || '',
      countryCode: selected?.code || ''
    });
  };

  const openEditModal = (client: any) => {
    setEditingId(client.id);
    setFormData({
      name: client.name || '',
      contactPerson: client.contactPerson || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      country: client.country || '',
      countryCode: client.countryCode || '',
      notes: client.notes || ''
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: { ...formData, companyId: 1 } });
    } else {
      createMutation.mutate({ ...formData, companyId: 1 });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your vehicle buyers</p>
        </div>
        <button onClick={() => {
          setEditingId(null);
          setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '', country: '', countryCode: '', notes: '' });
          setShowModal(true);
        }} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
          <Plus size={20} /> Add Client
        </button>
      </div>

      {isLoading && <div className="text-center py-12"><div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div></div>}

      {!isLoading && clients.length === 0 && (
        <div className="card p-12 text-center">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No clients yet</h3>
          <p className="text-gray-500 mb-4">Add your first client to start selling vehicles</p>
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Add First Client
          </button>
        </div>
      )}

      {!isLoading && clients.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client: any) => (
            <div key={client.id} className="card p-5 hover:shadow-lg transition-shadow border-l-4 border-green-500">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Users size={24} className="text-green-600" />
                  <h3 className="text-lg font-bold text-gray-900">{client.name}</h3>
                </div>
                {client.countryCode && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                    {client.countryCode}
                  </span>
                )}
              </div>

              <div className="space-y-2 text-sm">
                {client.contactPerson && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users size={16} className="text-gray-400" />
                    <span>{client.contactPerson}</span>
                  </div>
                )}
                {client.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} className="text-gray-400" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} className="text-gray-400" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                    <span>{client.address}, {client.country}</span>
                  </div>
                )}
                {client.notes && (
                  <div className="flex items-start gap-2 text-gray-600 pt-2 border-t">
                    <FileText size={16} className="text-gray-400 mt-0.5" />
                    <span className="italic text-xs">{client.notes}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openEditModal(client)}
                  className="flex-1 flex items-center justify-center gap-2 text-green-600 hover:text-green-800 text-sm font-medium transition py-2 border border-green-200 rounded hover:bg-green-50"
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete ${client.name}?`)) deleteMutation.mutate(client.id);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:text-red-800 text-sm font-medium transition py-2 border border-red-200 rounded hover:bg-red-50"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="text-green-600" /> 
              {editingId ? 'Edit Client' : 'Add New Client'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Client Name *</label>
                  <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Dubai Motors LLC"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Contact Person</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Ahmed Al-Mansour"
                    value={formData.contactPerson} onChange={(e) => setFormData({...formData, contactPerson: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
                  <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="contact@client.com"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Phone</label>
                  <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+971 4 123 4567"
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Address</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Business Bay, Dubai"
                    value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Country *</label>
                  <select required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.country} onChange={handleCountryChange}>
                    <option value="">Select Country</option>
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.name}>{c.name} ({c.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Notes</label>
                  <textarea rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Additional client information..."
                    value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                }} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold">
                  {editingId ? 'Update Client' : 'Add Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
