import { apiClient } from '../config/api';

// Driver Request types
export interface DriverRequest {
  id?: number;
  request_type: 'fuel' | 'maintenance' | 'repair' | 'inspection' | 'other';
  liters?: number;
  price_per_liter?: number;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  requested_date?: string;
  location?: string;
  estimated_cost?: number;
  vehicle_id?: string;
}

export interface CreateDriverRequestRequest {
  request_type: 'fuel' | 'maintenance' | 'repair' | 'inspection' | 'other';
  liters?: number;
  price_per_liter?: number;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  location?: string;
  estimated_cost?: number;
  vehicle_id?: string;
}

export interface CreateDriverRequestResponse {
  message: string;
  request_id?: number;
}

export interface DriverRequestsResponse {
  requests: DriverRequest[];
}

class DriverService {
  /**
   * Submit a driver request
   */
  async submitRequest(driverId: number, data: CreateDriverRequestRequest): Promise<CreateDriverRequestResponse> {
    try {
      const response = await apiClient.post<CreateDriverRequestResponse>(`/drivers/${driverId}/requests`, data);
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
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to submit request. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to submit request. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get driver requests
   */
  async getDriverRequests(driverId: number): Promise<DriverRequest[]> {
    try {
      const response = await apiClient.get<DriverRequestsResponse>(`/drivers/${driverId}/requests`);
      return response.data.requests || [];
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 404) {
          throw new Error('Driver not found.');
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
   * Get a specific driver request
   */
  async getDriverRequest(driverId: number, requestId: number): Promise<DriverRequest> {
    try {
      const response = await apiClient.get<DriverRequest>(`/drivers/${driverId}/requests/${requestId}`);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 404) {
          throw new Error('Request not found.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to fetch request. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch request. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Update a driver request
   */
  async updateDriverRequest(driverId: number, requestId: number, data: Partial<CreateDriverRequestRequest>): Promise<DriverRequest> {
    try {
      const response = await apiClient.put<DriverRequest>(`/drivers/${driverId}/requests/${requestId}`, data);
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
        } else if (status === 404) {
          throw new Error('Request not found.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to update request. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update request. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete a driver request
   */
  async deleteDriverRequest(driverId: number, requestId: number): Promise<void> {
    try {
      await apiClient.delete(`/drivers/${driverId}/requests/${requestId}`);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 404) {
          throw new Error('Request not found.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to delete request. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to delete request. Please try again.';
      
      throw new Error(errorMessage);
    }
  }
}

export const driverService = new DriverService();
export default driverService;
