import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientInvoicesApi } from '../api/clientInvoices';
import type { ClientInvoice } from '../types';

export const useClientInvoices = (params?: { year?: number; status?: string; companyId?: number }) => {
  return useQuery({
    queryKey: ['clientInvoices', params],
    queryFn: () => clientInvoicesApi.getAll(params),
  });
};

export const useClientInvoice = (id: number) => {
  return useQuery({
    queryKey: ['clientInvoice', id],
    queryFn: () => clientInvoicesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateClientInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clientInvoicesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientInvoices'] });
    },
  });
};

export const useUpdateClientInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ClientInvoice> }) =>
      clientInvoicesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientInvoices'] });
    },
  });
};

export const useDeleteClientInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clientInvoicesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientInvoices'] });
    },
  });
};
