import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, Mail, Phone, MapPin, FileText, Plus, Trash2, Edit2 } from 'lucide-react';

const suppliersApi = {
  getAll: async () => {
    const response = await fetch('http://localhost:8080/api/suppliers');
    return response.json();
  },
  create: async (data: any) => {
    const response = await fetch('http://localhost:8080/api/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  update: async ({ id, data }: any) => {
    const response = await fetch(`http://localhost:8080/api/suppliers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  delete: async (id: number) => {
    await fetch(`http://localhost:8080/api/suppliers/${id}`, { method: 'DELETE' });
  }
};

const COUNTRIES = [
  { code: 'IE', name: 'Ireland' },
  { code: 'DE', name: 'Germany' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'AT', name: 'Austria' },
];

export const SuppliersPage = () => {
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

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: suppliersApi.getAll
  });

  const createMutation = useMutation({
    mutationFn: suppliersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setShowModal(false);
      setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '', country: '', countryCode: '', notes: '' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: suppliersApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setShowModal(false);
      setEditingId(null);
      setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '', country: '', countryCode: '', notes: '' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: suppliersApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] })
  });

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = COUNTRIES.find(c => c.name === e.target.value);
    setFormData({
      ...formData,
      country: selected?.name || '',
      countryCode: selected?.code || ''
    });
  };

  const openEditModal = (supplier: any) => {
    setEditingId(supplier.id);
    setFormData({
      name: supplier.name || '',
      contactPerson: supplier.contactPerson || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      country: supplier.country || '',
      countryCode: supplier.countryCode || '',
      notes: supplier.notes || ''
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
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your vehicle suppliers</p>
        </div>
        <button onClick={() => {
          setEditingId(null);
          setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '', country: '', countryCode: '', notes: '' });
          setShowModal(true);
        }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          <Plus size={20} /> Add Supplier
        </button>
      </div>

      {isLoading && <div className="text-center py-12"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div></div>}

      {!isLoading && suppliers.length === 0 && (
        <div className="card p-12 text-center">
          <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No suppliers yet</h3>
          <p className="text-gray-500 mb-4">Add your first supplier to start managing vehicle orders</p>
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add First Supplier
          </button>
        </div>
      )}

      {!isLoading && suppliers.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((supplier: any) => (
            <div key={supplier.id} className="card p-5 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Building2 size={24} className="text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">{supplier.name}</h3>
                </div>
                {supplier.countryCode && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                    {supplier.countryCode}
                  </span>
                )}
              </div>

              <div className="space-y-2 text-sm">
                {supplier.contactPerson && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 size={16} className="text-gray-400" />
                    <span>{supplier.contactPerson}</span>
                  </div>
                )}
                {supplier.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} className="text-gray-400" />
                    <span className="truncate">{supplier.email}</span>
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} className="text-gray-400" />
                    <span>{supplier.phone}</span>
                  </div>
                )}
                {supplier.address && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                    <span>{supplier.address}, {supplier.country}</span>
                  </div>
                )}
                {supplier.notes && (
                  <div className="flex items-start gap-2 text-gray-600 pt-2 border-t">
                    <FileText size={16} className="text-gray-400 mt-0.5" />
                    <span className="italic text-xs">{supplier.notes}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openEditModal(supplier)}
                  className="flex-1 flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition py-2 border border-blue-200 rounded hover:bg-blue-50"
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete ${supplier.name}?`)) deleteMutation.mutate(supplier.id);
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
              <Building2 className="text-blue-600" /> 
              {editingId ? 'Edit Supplier' : 'Add New Supplier'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Supplier Name *</label>
                  <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., BMW Germany"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Contact Person</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., John Smith"
                    value={formData.contactPerson} onChange={(e) => setFormData({...formData, contactPerson: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
                  <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="contact@supplier.com"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Phone</label>
                  <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+353 1 234 5678"
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Address</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123 Main Street"
                    value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Country *</label>
                  <select required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.country} onChange={handleCountryChange}>
                    <option value="">Select Country</option>
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.name}>{c.name} ({c.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Notes</label>
                  <textarea rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Additional supplier information..."
                    value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                }} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                  {editingId ? 'Update Supplier' : 'Add Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

