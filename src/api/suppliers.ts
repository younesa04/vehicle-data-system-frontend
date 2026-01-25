import apiClient from './client';

export const suppliersApi = {
  getAll: async () => {
    const response = await apiClient.get('/api/suppliers');
    return response.data;
  },
};
