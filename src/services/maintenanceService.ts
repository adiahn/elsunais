import { apiClient } from '../config/api';

// Maintenance Request types
export interface MaintenanceRequest {
  id: number;
  title: string;
  category: 'office_supplies' | 'equipment' | 'utilities' | 'cleaning' | 'security' | 'it_services' | 'other';
  details: {
    location: string;
    issue: string;
    requested_by: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  amount?: number;
  requested_date: string;
  approved_date?: string;
  completed_date?: string;
  approved_by?: string;
  notes?: string;
  vendor?: string;
  receipt?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMaintenanceRequest {
  title: string;
  category: 'office_supplies' | 'equipment' | 'utilities' | 'cleaning' | 'security' | 'it_services' | 'other';
  details: {
    location: string;
    issue: string;
    requested_by: string;
  };
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  amount?: number;
  notes?: string;
  vendor?: string;
}

export interface UpdateMaintenanceRequest {
  title?: string;
  category?: 'office_supplies' | 'equipment' | 'utilities' | 'cleaning' | 'security' | 'it_services' | 'other';
  details?: {
    location?: string;
    issue?: string;
    requested_by?: string;
  };
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  amount?: number;
  notes?: string;
  vendor?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
}

export interface MaintenanceStats {
  total_requests: number;
  pending_requests: number;
  approved_requests: number;
  completed_requests: number;
  total_amount: number;
  pending_amount: number;
}

class MaintenanceService {
  /**
   * Create a new maintenance request
   */
  async createMaintenanceRequest(data: CreateMaintenanceRequest): Promise<MaintenanceRequest> {
    try {
      console.log('Creating maintenance request:', data);
      const response = await apiClient.post<MaintenanceRequest>('/maintenance', data);
      console.log('Maintenance request created successfully:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to create maintenance requests.');
        } else if (status === 400) {
          throw new Error(message || 'Invalid request data. Please check your input.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to create maintenance request. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create maintenance request. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all maintenance requests
   */
  async getMaintenanceRequests(): Promise<MaintenanceRequest[]> {
    try {
      console.log('Fetching maintenance requests from API...');
      const response = await apiClient.get<MaintenanceRequest[]>('/maintenance');
      console.log('Maintenance requests fetched successfully:', response.data);
      return response.data || [];
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to view maintenance requests.');
        } else if (status === 404) {
          throw new Error('Maintenance requests not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to fetch maintenance requests. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch maintenance requests. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get maintenance request by ID
   */
  async getMaintenanceRequest(id: number): Promise<MaintenanceRequest> {
    try {
      console.log(`Fetching maintenance request ${id} from API...`);
      const response = await apiClient.get<MaintenanceRequest>(`/maintenance/${id}`);
      console.log('Maintenance request fetched successfully:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to view this maintenance request.');
        } else if (status === 404) {
          throw new Error('Maintenance request not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to fetch maintenance request. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch maintenance request. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Update maintenance request
   */
  async updateMaintenanceRequest(id: number, data: UpdateMaintenanceRequest): Promise<MaintenanceRequest> {
    try {
      console.log(`Updating maintenance request ${id}:`, data);
      const response = await apiClient.put<MaintenanceRequest>(`/maintenance/${id}`, data);
      console.log('Maintenance request updated successfully:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to update this maintenance request.');
        } else if (status === 404) {
          throw new Error('Maintenance request not found.');
        } else if (status === 400) {
          throw new Error(message || 'Invalid request data. Please check your input.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to update maintenance request. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update maintenance request. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete maintenance request
   */
  async deleteMaintenanceRequest(id: number): Promise<{ message: string }> {
    try {
      console.log(`Deleting maintenance request ${id}...`);
      const response = await apiClient.delete<{ message: string }>(`/maintenance/${id}`);
      console.log('Maintenance request deleted successfully:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to delete this maintenance request.');
        } else if (status === 404) {
          throw new Error('Maintenance request not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to delete maintenance request. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to delete maintenance request. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Approve maintenance request
   */
  async approveMaintenanceRequest(id: number, notes?: string): Promise<MaintenanceRequest> {
    try {
      console.log(`Approving maintenance request ${id}...`);
      const response = await apiClient.post<MaintenanceRequest>(`/maintenance/${id}/approve`, { notes });
      console.log('Maintenance request approved successfully:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to approve maintenance requests.');
        } else if (status === 404) {
          throw new Error('Maintenance request not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to approve maintenance request. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to approve maintenance request. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Reject maintenance request
   */
  async rejectMaintenanceRequest(id: number, reason: string): Promise<MaintenanceRequest> {
    try {
      console.log(`Rejecting maintenance request ${id}...`);
      const response = await apiClient.post<MaintenanceRequest>(`/maintenance/${id}/reject`, { reason });
      console.log('Maintenance request rejected successfully:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to reject maintenance requests.');
        } else if (status === 404) {
          throw new Error('Maintenance request not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to reject maintenance request. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to reject maintenance request. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Mark maintenance request as completed
   */
  async completeMaintenanceRequest(id: number, notes?: string, receipt?: string): Promise<MaintenanceRequest> {
    try {
      console.log(`Completing maintenance request ${id}...`);
      const response = await apiClient.post<MaintenanceRequest>(`/maintenance/${id}/complete`, { notes, receipt });
      console.log('Maintenance request completed successfully:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to complete maintenance requests.');
        } else if (status === 404) {
          throw new Error('Maintenance request not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to complete maintenance request. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to complete maintenance request. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get maintenance statistics
   */
  async getMaintenanceStats(): Promise<MaintenanceStats> {
    try {
      console.log('Fetching maintenance statistics...');
      const response = await apiClient.get<MaintenanceStats>('/maintenance/stats');
      console.log('Maintenance statistics fetched successfully:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to view maintenance statistics.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to fetch maintenance statistics. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch maintenance statistics. Please try again.';
      
      throw new Error(errorMessage);
    }
  }
}

export const maintenanceService = new MaintenanceService();
export default maintenanceService;
