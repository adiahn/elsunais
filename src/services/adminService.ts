import { apiClient } from '../config/api';
import { DriverRequest } from './driverService';
import { StoreRequest } from './storeService';

// Admin Request types - unified interface for all request types
export interface AdminRequest {
  id: string | number;
  type: 'driver' | 'store' | 'maintenance' | 'workplan';
  title: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  amount?: number;
  requestedBy: string;
  requestedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectedBy?: string;
  rejectedDate?: string;
  notes?: string;
  // Additional fields based on request type
  driverId?: number;
  carId?: number;
  requestType?: string;
  litersRequested?: number;
  pricePerLiter?: number;
  itemId?: number;
  quantity?: number;
  department?: string;
  vendor?: string;
  category?: string;
  workplanId?: number;
  projectId?: number;
  componentId?: number;
}

// Admin approval response
export interface AdminApprovalResponse {
  message: string;
  request: AdminRequest;
  updated_at: string;
}

// Admin statistics
export interface AdminStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalAmount: number;
  requestsByType: {
    driver: number;
    store: number;
    maintenance: number;
    workplan: number;
  };
}

class AdminService {
  /**
   * Get all pending requests across all modules
   */
  async getAllPendingRequests(): Promise<AdminRequest[]> {
    try {
      const response = await apiClient.get<AdminRequest[]>('/admin/requests/pending');
      return response.data || [];
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to fetch pending requests. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch pending requests. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all requests (pending, approved, rejected) across all modules
   */
  async getAllRequests(): Promise<AdminRequest[]> {
    try {
      const response = await apiClient.get<AdminRequest[]>('/admin/requests');
      return response.data || [];
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to fetch requests. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch requests. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get admin statistics
   */
  async getAdminStats(): Promise<AdminStats> {
    try {
      const response = await apiClient.get<AdminStats>('/admin/stats');
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to fetch admin statistics. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch admin statistics. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Approve a request
   */
  async approveRequest(requestId: string | number, requestType: string, notes?: string): Promise<AdminApprovalResponse> {
    try {
      const response = await apiClient.put<AdminApprovalResponse>(`/admin/requests/${requestId}/approve`, {
        request_type: requestType,
        notes: notes
      });
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid request data. Please check your input.');
        } else if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else if (status === 404) {
          throw new Error('Request not found.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to approve request. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to approve request. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Reject a request
   */
  async rejectRequest(requestId: string | number, requestType: string, reason: string): Promise<AdminApprovalResponse> {
    try {
      const response = await apiClient.put<AdminApprovalResponse>(`/admin/requests/${requestId}/reject`, {
        request_type: requestType,
        reason: reason
      });
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid request data. Please check your input.');
        } else if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else if (status === 404) {
          throw new Error('Request not found.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to reject request. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to reject request. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get requests by type
   */
  async getRequestsByType(type: 'driver' | 'store' | 'maintenance' | 'workplan'): Promise<AdminRequest[]> {
    try {
      const response = await apiClient.get<AdminRequest[]>(`/admin/requests/${type}`);
      return response.data || [];
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || `Failed to fetch ${type} requests. Please try again.`);
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : `Failed to fetch ${type} requests. Please try again.`;
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get request details
   */
  async getRequestDetails(requestId: string | number, requestType: string): Promise<AdminRequest> {
    try {
      const response = await apiClient.get<AdminRequest>(`/admin/requests/${requestType}/${requestId}`);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else if (status === 404) {
          throw new Error('Request not found.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to fetch request details. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch request details. Please try again.';
      
      throw new Error(errorMessage);
    }
  }
}

export const adminService = new AdminService();
export default adminService;
