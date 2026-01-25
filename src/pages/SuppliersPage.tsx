import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
  delete: async (id: number) => {
    await fetch(`http://localhost:8080/api/suppliers/${id}`, { method: 'DELETE' });
  }
};

export const SuppliersPage = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    country: ''
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
      setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '', country: '' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: suppliersApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] })
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">+ Add Supplier</button>
      </div>

      {isLoading && <div className="text-center py-8">Loading...</div>}

      {!isLoading && suppliers.length === 0 && (
        <div className="card p-8 text-center text-gray-500">
          No suppliers yet. Add your first supplier to get started.
        </div>
      )}

      {!isLoading && suppliers.length > 0 && (
        <div className="grid gap-4">
          {suppliers.map((supplier: any) => (
            <div key={supplier.id} className="card p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{supplier.name}</h3>
                  <p className="text-sm text-gray-600">{supplier.contactPerson}</p>
                  <p className="text-sm text-gray-500">{supplier.email} • {supplier.phone}</p>
                  <p className="text-sm text-gray-500">{supplier.address}, {supplier.country}</p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Delete this supplier?')) deleteMutation.mutate(supplier.id);
                  }}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Supplier</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate({ ...formData, companyId: 1 });
            }}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input type="text" required className="w-full px-3 py-2 border rounded-lg"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Person</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg"
                    value={formData.contactPerson} onChange={(e) => setFormData({...formData, contactPerson: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" className="w-full px-3 py-2 border rounded-lg"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" className="w-full px-3 py-2 border rounded-lg"
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg"
                    value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg"
                    value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">Add Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
