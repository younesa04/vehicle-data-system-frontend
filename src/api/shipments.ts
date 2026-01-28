import axios from 'axios';

const API_URL = 'http://localhost:8080/api/shipments';

export interface Shipment {
  shipmentId?: number;
  orderId: number;
  shipmentType?: string;
  orderType?: string;
  trackingNumber?: string;
  status: string;
  carrier?: string;
  shipDate?: string;
  deliveryDate?: string;
  containerNumber?: string;
  vesselName?: string;
  portOfLoading?: string;
  portOfDischarge?: string;
  departureDate?: string;
  arrivalDate?: string;
  estimatedArrival?: string;
  notes?: string;
  createdAt?: string;
  collectionDate?: string;
  collectionTime?: string;
  etaCollection?: string;
  dropoffDate?: string;
  dropoffTime?: string;
  cmrDocument?: string;
  exaDocument?: string;
  customsDocument?: string;
  shippingCost?: number;
  additionalExpenses?: number;
  totalCost?: number;
  loadingLocation?: string;
  unloadingLocation?: string;
  transportMethod?: string;
  vehicleCount?: number;
  referenceType?: string;
  referenceId?: number;
}



export const shipmentsApi = {
  getAll: () => axios.get<Shipment[]>(API_URL),
  getById: (id: number) => axios.get<Shipment>(`${API_URL}/${id}`),
  getByOrderId: (orderId: number) => axios.get<Shipment[]>(`${API_URL}/order/${orderId}`),
  create: (shipment: Shipment) => axios.post<Shipment>(API_URL, shipment),
  update: (id: number, shipment: Shipment) => axios.put<Shipment>(`${API_URL}/${id}`, shipment),
  delete: (id: number) => axios.delete(`${API_URL}/${id}`)
};
