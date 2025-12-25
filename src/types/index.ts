export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface Client {
  id: number;
  companyName: string;
  tradingName?: string;
  contactName: string;
  email: string;
  phone: string;
  
  street: string;
  street2?: string;
  city: string;
  postalCode: string;
  region?: string;
  countryCode: string;
  
  vatNumber?: string;
  registrationNumber?: string;
  
  cocStatus?: 'not_required' | 'pending' | 'received' | 'expired';
  cocExpiryDate?: string;
  cocDocumentUrl?: string;
  
  exportLicenseStatus?: 'not_required' | 'pending' | 'valid' | 'expired';
  exportLicenseNumber?: string;
  exportLicenseExpiry?: string;
  
  paymentTerms?: string;
  creditLimit?: number;
  
  notes?: string;
  
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface Supplier {
  id: number;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  
  street: string;
  street2?: string;
  city: string;
  postalCode: string;
  region?: string;
  countryCode: string;
  
  vatNumber?: string;
  registrationNumber?: string;
  
  serviceType: string;
  accountNumber?: string;
  
  paymentTerms?: string;
  bankDetails?: string;
  
  exportLicenseStatus?: 'not_required' | 'valid' | 'expired';
  exportLicenseNumber?: string;
  exportLicenseExpiry?: string;
  
  notes?: string;
  
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface Shipper {
  id: number;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  
  street: string;
  city: string;
  postalCode: string;
  countryCode: string;
  
  mode: 'RoRo' | 'container' | 'air' | 'land';
  regions: string;
  
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiry?: string;
  
  iataCode?: string;
  scacCode?: string;
  
  notes?: string;
  
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}
