export interface VIN {
  id: number;
  vin: string;
  make: string;
  model: string;
  year: number;
  colour: string;
  supplierId: number;
  supplierName: string;
  purchasePrice: number;
  currency: string;
  stockStatus: 'in_stock' | 'reserved' | 'sold';
  cocStatus: 'not_received' | 'pending' | 'received' | 'expired';
  cocReceivedDate?: string;
  cocDocumentUrl?: string;
  exaStatus: 'not_required' | 'pending' | 'approved' | 'rejected';
  exaApprovedDate?: string;
  exaDocumentUrl?: string;
  deliveryStatus: 'not_shipped' | 'in_transit' | 'delivered';
  waybillNumber?: string;
  deliveryDate?: string;
  notes?: string;
  createdAt: string;
}

export const mockSuppliers = [
  { id: 1, name: 'Tokyo Auto Exports Ltd.' },
  { id: 2, name: 'Birmingham Vehicle Traders' },
  { id: 3, name: 'Frankfurt Motors GmbH' },
  { id: 4, name: 'Dublin Premium Cars' },
  { id: 5, name: 'Paris Luxury Vehicles' },
];

export const mockVins: VIN[] = [
  {
    id: 1,
    vin: 'WBADT43452G876543',
    make: 'BMW',
    model: '3 Series',
    year: 2023,
    colour: 'Alpine White',
    supplierId: 1,
    supplierName: 'Tokyo Auto Exports Ltd.',
    purchasePrice: 28500,
    currency: 'EUR',
    stockStatus: 'in_stock',
    cocStatus: 'received',
    cocReceivedDate: '2024-11-15',
    exaStatus: 'approved',
    exaApprovedDate: '2024-11-20',
    deliveryStatus: 'delivered',
    waybillNumber: 'WB-2024-001234',
    deliveryDate: '2024-12-01',
    createdAt: '2024-10-15T10:30:00Z',
  },
  {
    id: 2,
    vin: 'WAUZZZ8V8KA123456',
    make: 'Audi',
    model: 'A4',
    year: 2024,
    colour: 'Mythos Black',
    supplierId: 3,
    supplierName: 'Frankfurt Motors GmbH',
    purchasePrice: 32000,
    currency: 'EUR',
    stockStatus: 'reserved',
    cocStatus: 'pending',
    exaStatus: 'pending',
    deliveryStatus: 'in_transit',
    waybillNumber: 'WB-2024-001567',
    createdAt: '2024-11-20T14:20:00Z',
  },
  {
    id: 3,
    vin: 'SALGS2TF8MA234567',
    make: 'Land Rover',
    model: 'Range Rover Sport',
    year: 2023,
    colour: 'Santorini Black',
    supplierId: 2,
    supplierName: 'Birmingham Vehicle Traders',
    purchasePrice: 58000,
    currency: 'GBP',
    stockStatus: 'in_stock',
    cocStatus: 'received',
    cocReceivedDate: '2024-12-10',
    exaStatus: 'not_required',
    deliveryStatus: 'not_shipped',
    createdAt: '2024-12-05T09:15:00Z',
  },
  {
    id: 4,
    vin: 'WBA3N9C54EK123789',
    make: 'BMW',
    model: 'M340i',
    year: 2024,
    colour: 'Portimao Blue',
    supplierId: 3,
    supplierName: 'Frankfurt Motors GmbH',
    purchasePrice: 52000,
    currency: 'EUR',
    stockStatus: 'sold',
    cocStatus: 'received',
    cocReceivedDate: '2024-11-28',
    exaStatus: 'approved',
    exaApprovedDate: '2024-12-05',
    deliveryStatus: 'delivered',
    waybillNumber: 'WB-2024-001890',
    deliveryDate: '2024-12-20',
    createdAt: '2024-11-15T11:00:00Z',
  },
  {
    id: 5,
    vin: 'VF1RFD00667345678',
    make: 'Renault',
    model: 'Megane E-Tech',
    year: 2024,
    colour: 'Flame Red',
    supplierId: 5,
    supplierName: 'Paris Luxury Vehicles',
    purchasePrice: 38000,
    currency: 'EUR',
    stockStatus: 'in_stock',
    cocStatus: 'not_received',
    exaStatus: 'not_required',
    deliveryStatus: 'not_shipped',
    createdAt: '2024-12-18T16:45:00Z',
  },
];
