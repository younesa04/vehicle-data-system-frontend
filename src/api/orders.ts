// src/api/orders.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface VehicleOrder {
  id?: number;
  companyId: number;
  supplierId?: number;
  clientId?: number;
  orderDate: string;
  vehicleMake?: string;
  vehicleModel?: string;
  colour?: string;
  vin?: string;
  unitsOrdered?: number;
  unitDepositEur?: number;
  depositTotalEur?: number;
  depositStatus?: string;
  unitPriceEur?: number;
  totalCostEur?: number;
  contractId?: string;
  eta?: string;
  contractStatus?: string;
  status?: string;
  paymentStatus?: string;
  notes?: string;
}

export const ordersApi = {
  getAll: () => api.get<VehicleOrder[]>('/orders'),
  
  search: (params: {
    companyId?: number;
    supplierId?: number;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }) => api.get<VehicleOrder[]>('/orders/search', { params }),
  
  getById: (id: number) => api.get<VehicleOrder>(`/orders/${id}`),
  
  create: (order: VehicleOrder) => api.post<VehicleOrder>('/orders', order),
  
  update: (id: number, order: VehicleOrder) => 
    api.put<VehicleOrder>(`/orders/${id}`, order),
  
  delete: (id: number) => api.delete(`/orders/${id}`),
};
