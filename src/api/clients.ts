import apiClient from './client';
import type { Client } from '../types';

export const clientsApi = {
  getAll: async (params?: { search?: string; country?: string; cocStatus?: string }) => {
    const response = await apiClient.get<Client[]>('/api/clients', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<Client>(`/api/clients/${id}`);
    return response.data;
  },

  create: async (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) => {
    const response = await apiClient.post<Client>('/api/clients', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Client>) => {
    const response = await apiClient.put<Client>(`/api/clients/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/api/clients/${id}`);
  },
};
