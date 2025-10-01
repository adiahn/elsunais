import { apiClient } from '../config/api';

// Vendor interfaces
export interface Vendor {
  id: number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  category: 'supplier' | 'contractor' | 'service_provider';
  status: 'active' | 'inactive' | 'suspended';
  rating?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateVendorRequest {
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  category: 'supplier' | 'contractor' | 'service_provider';
  notes?: string;
}

export interface UpdateVendorRequest {
  name?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  category?: 'supplier' | 'contractor' | 'service_provider';
  status?: 'active' | 'inactive' | 'suspended';
  rating?: number;
  notes?: string;
}

// Purchase Order interfaces
export interface PurchaseOrder {
  id: number;
  po_number: string;
  vendor_id: number;
  vendor_name: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'partially_received' | 'received' | 'cancelled';
  total_amount: number;
  currency: string;
  requested_by: string;
  approved_by?: string;
  created_at: string;
  approved_at?: string;
  sent_at?: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  notes?: string;
  items: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: number;
  po_id: number;
  item_name: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  unit: string;
  category: string;
  specifications?: string;
}

export interface CreatePurchaseOrderRequest {
  vendor_id: number;
  items: {
    item_name: string;
    description: string;
    quantity: number;
    unit_price: number;
    unit: string;
    category: string;
    specifications?: string;
  }[];
  expected_delivery_date?: string;
  notes?: string;
}

export interface UpdatePurchaseOrderRequest {
  vendor_id?: number;
  status?: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'partially_received' | 'received' | 'cancelled';
  expected_delivery_date?: string;
  notes?: string;
  items?: {
    item_name: string;
    description: string;
    quantity: number;
    unit_price: number;
    unit: string;
    category: string;
    specifications?: string;
  }[];
}

// Procurement Request interfaces
export interface ProcurementRequest {
  id: number;
  request_number: string;
  department: string;
  requested_by: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  total_estimated_cost: number;
  currency: string;
  justification: string;
  created_at: string;
  approved_at?: string;
  approved_by?: string;
  rejected_at?: string;
  rejected_by?: string;
  rejection_reason?: string;
  completed_at?: string;
  items: ProcurementRequestItem[];
}

export interface ProcurementRequestItem {
  id: number;
  request_id: number;
  item_name: string;
  description: string;
  quantity: number;
  estimated_unit_price: number;
  estimated_total_price: number;
  unit: string;
  category: string;
  specifications?: string;
  justification?: string;
}

export interface CreateProcurementRequestRequest {
  department: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  justification: string;
  items: {
    item_name: string;
    description: string;
    quantity: number;
    estimated_unit_price: number;
    unit: string;
    category: string;
    specifications?: string;
    justification?: string;
  }[];
}

export interface UpdateProcurementRequestRequest {
  department?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  justification?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  rejection_reason?: string;
  items?: {
    item_name: string;
    description: string;
    quantity: number;
    estimated_unit_price: number;
    unit: string;
    category: string;
    specifications?: string;
    justification?: string;
  }[];
}

// Tender/Bid interfaces
export interface Tender {
  id: number;
  tender_number: string;
  title: string;
  description: string;
  category: 'goods' | 'services' | 'works';
  estimated_value: number;
  currency: string;
  status: 'draft' | 'published' | 'open' | 'closed' | 'evaluated' | 'awarded' | 'cancelled';
  published_date?: string;
  closing_date?: string;
  opening_date?: string;
  evaluation_date?: string;
  award_date?: string;
  created_by: string;
  created_at: string;
  requirements: TenderRequirement[];
  bids: TenderBid[];
}

export interface TenderRequirement {
  id: number;
  tender_id: number;
  requirement: string;
  mandatory: boolean;
  weight?: number;
}

export interface TenderBid {
  id: number;
  tender_id: number;
  vendor_id: number;
  vendor_name: string;
  bid_amount: number;
  currency: string;
  status: 'submitted' | 'under_review' | 'accepted' | 'rejected';
  submitted_at: string;
  technical_score?: number;
  financial_score?: number;
  total_score?: number;
  notes?: string;
}

export interface CreateTenderRequest {
  title: string;
  description: string;
  category: 'goods' | 'services' | 'works';
  estimated_value: number;
  currency: string;
  closing_date: string;
  opening_date: string;
  requirements: {
    requirement: string;
    mandatory: boolean;
    weight?: number;
  }[];
}

// Contract interfaces
export interface Contract {
  id: number;
  contract_number: string;
  vendor_id: number;
  vendor_name: string;
  title: string;
  description: string;
  contract_type: 'supply' | 'service' | 'construction' | 'consultancy';
  status: 'draft' | 'active' | 'completed' | 'terminated' | 'expired';
  start_date: string;
  end_date: string;
  total_value: number;
  currency: string;
  payment_terms: string;
  delivery_terms: string;
  created_by: string;
  created_at: string;
  signed_at?: string;
  completed_at?: string;
  notes?: string;
}

export interface CreateContractRequest {
  vendor_id: number;
  title: string;
  description: string;
  contract_type: 'supply' | 'service' | 'construction' | 'consultancy';
  start_date: string;
  end_date: string;
  total_value: number;
  currency: string;
  payment_terms: string;
  delivery_terms: string;
  notes?: string;
}

// Procurement Statistics
export interface ProcurementStats {
  totalVendors: number;
  activeVendors: number;
  totalPurchaseOrders: number;
  pendingPurchaseOrders: number;
  totalProcurementRequests: number;
  pendingProcurementRequests: number;
  totalTenders: number;
  activeTenders: number;
  totalContracts: number;
  activeContracts: number;
  totalSpent: number;
  monthlySpending: {
    month: string;
    amount: number;
  }[];
  topVendors: {
    vendor_name: string;
    total_amount: number;
    order_count: number;
  }[];
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}

class ProcurementService {
  // Vendor Management
  async getVendors(): Promise<Vendor[]> {
    try {
      const response = await apiClient.get<Vendor[]>('/procurement/vendors');
      return response.data || [];
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to view vendors.');
        } else if (status === 404) {
          throw new Error('Vendors not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to fetch vendors. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch vendors. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  async createVendor(data: CreateVendorRequest): Promise<Vendor> {
    try {
      const response = await apiClient.post<Vendor>('/procurement/vendors', data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid vendor data. Please check your input.');
        } else if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to create vendors.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to create vendor. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create vendor. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  async updateVendor(id: number, data: UpdateVendorRequest): Promise<Vendor> {
    try {
      const response = await apiClient.put<Vendor>(`/procurement/vendors/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid vendor data. Please check your input.');
        } else if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to update vendors.');
        } else if (status === 404) {
          throw new Error('Vendor not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to update vendor. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update vendor. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  async deleteVendor(id: number): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(`/procurement/vendors/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to delete vendors.');
        } else if (status === 404) {
          throw new Error('Vendor not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to delete vendor. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to delete vendor. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  // Purchase Order Management
  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    try {
      const response = await apiClient.get<PurchaseOrder[]>('/procurement/purchase-orders');
      return response.data || [];
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to view purchase orders.');
        } else if (status === 404) {
          throw new Error('Purchase orders not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to fetch purchase orders. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch purchase orders. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  async createPurchaseOrder(data: CreatePurchaseOrderRequest): Promise<PurchaseOrder> {
    try {
      const response = await apiClient.post<PurchaseOrder>('/procurement/purchase-orders', data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid purchase order data. Please check your input.');
        } else if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to create purchase orders.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to create purchase order. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create purchase order. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  async updatePurchaseOrder(id: number, data: UpdatePurchaseOrderRequest): Promise<PurchaseOrder> {
    try {
      const response = await apiClient.put<PurchaseOrder>(`/procurement/purchase-orders/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid purchase order data. Please check your input.');
        } else if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to update purchase orders.');
        } else if (status === 404) {
          throw new Error('Purchase order not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to update purchase order. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update purchase order. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  async approvePurchaseOrder(id: number): Promise<PurchaseOrder> {
    try {
      const response = await apiClient.put<PurchaseOrder>(`/procurement/purchase-orders/${id}/approve`);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to approve purchase orders.');
        } else if (status === 404) {
          throw new Error('Purchase order not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to approve purchase order. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to approve purchase order. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  // Procurement Request Management
  async getProcurementRequests(): Promise<ProcurementRequest[]> {
    try {
      const response = await apiClient.get<ProcurementRequest[]>('/procurement/requests');
      return response.data || [];
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to view procurement requests.');
        } else if (status === 404) {
          throw new Error('Procurement requests not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to fetch procurement requests. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch procurement requests. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  async createProcurementRequest(data: CreateProcurementRequestRequest): Promise<ProcurementRequest> {
    try {
      const response = await apiClient.post<ProcurementRequest>('/procurement/requests', data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid procurement request data. Please check your input.');
        } else if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to create procurement requests.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to create procurement request. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create procurement request. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  async updateProcurementRequest(id: number, data: UpdateProcurementRequestRequest): Promise<ProcurementRequest> {
    try {
      const response = await apiClient.put<ProcurementRequest>(`/procurement/requests/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid procurement request data. Please check your input.');
        } else if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to update procurement requests.');
        } else if (status === 404) {
          throw new Error('Procurement request not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to update procurement request. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update procurement request. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  async approveProcurementRequest(id: number): Promise<ProcurementRequest> {
    try {
      const response = await apiClient.put<ProcurementRequest>(`/procurement/requests/${id}/approve`);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to approve procurement requests.');
        } else if (status === 404) {
          throw new Error('Procurement request not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to approve procurement request. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to approve procurement request. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  async rejectProcurementRequest(id: number, reason: string): Promise<ProcurementRequest> {
    try {
      const response = await apiClient.put<ProcurementRequest>(`/procurement/requests/${id}/reject`, {
        rejection_reason: reason
      });
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid rejection reason. Please provide a valid reason.');
        } else if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to reject procurement requests.');
        } else if (status === 404) {
          throw new Error('Procurement request not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to reject procurement request. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to reject procurement request. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  // Tender Management
  async getTenders(): Promise<Tender[]> {
    try {
      const response = await apiClient.get<Tender[]>('/procurement/tenders');
      return response.data || [];
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to view tenders.');
        } else if (status === 404) {
          throw new Error('Tenders not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to fetch tenders. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch tenders. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  async createTender(data: CreateTenderRequest): Promise<Tender> {
    try {
      const response = await apiClient.post<Tender>('/procurement/tenders', data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid tender data. Please check your input.');
        } else if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to create tenders.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to create tender. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create tender. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  // Contract Management
  async getContracts(): Promise<Contract[]> {
    try {
      const response = await apiClient.get<Contract[]>('/procurement/contracts');
      return response.data || [];
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to view contracts.');
        } else if (status === 404) {
          throw new Error('Contracts not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to fetch contracts. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch contracts. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  async createContract(data: CreateContractRequest): Promise<Contract> {
    try {
      const response = await apiClient.post<Contract>('/procurement/contracts', data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid contract data. Please check your input.');
        } else if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to create contracts.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to create contract. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create contract. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  // Statistics
  async getProcurementStats(): Promise<ProcurementStats> {
    try {
      const response = await apiClient.get<ProcurementStats>('/procurement/stats');
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to view procurement statistics.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to fetch procurement statistics. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch procurement statistics. Please try again.';
      
      throw new Error(errorMessage);
    }
  }
}

export const procurementService = new ProcurementService();
export default procurementService;
