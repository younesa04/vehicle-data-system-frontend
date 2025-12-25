import apiClient from './client';
import type { ClientInvoice } from '../types';

export const clientInvoicesApi = {
  getAll: async (params?: { year?: number; status?: string; companyId?: number }) => {
    const response = await apiClient.get<ClientInvoice[]>('/api/client-invoices', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<ClientInvoice>(`/api/client-invoices/${id}`);
    return response.data;
  },

  create: async (data: Omit<ClientInvoice, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) => {
    const response = await apiClient.post<ClientInvoice>('/api/client-invoices', data);
    return response.data;
  },

  update: async (id: number, data: Partial<ClientInvoice>) => {
    const response = await apiClient.put<ClientInvoice>(`/api/client-invoices/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/api/client-invoices/${id}`);
  },
};
