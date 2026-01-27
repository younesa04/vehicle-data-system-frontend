import axios from 'axios';

const API_URL = 'http://localhost:8080/api/payments';

export interface Payment {
  id?: number;
  orderId: number;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  status: string;
  paymentType: string;
  paymentStatus: string;
  proofLink?: string;
  currencyId?: number;
  orderType?: string;
  createdAt?: string;
}

export const paymentsApi = {
  getAll: async () => {
    const response = await axios.get<Payment[]>(API_URL);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axios.get<Payment>(`${API_URL}/${id}`);
    return response.data;
  },

  getByOrderId: async (orderId: number) => {
    const response = await axios.get<Payment[]>(`${API_URL}/order/${orderId}`);
    return response.data;
  },

  create: async (payment: Payment) => {
    const response = await axios.post<Payment>(API_URL, payment);
    return response.data;
  },

  update: async (id: number, payment: Payment) => {
    const response = await axios.put<Payment>(`${API_URL}/${id}`, payment);
    return response.data;
  },

  delete: async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
  }
};
