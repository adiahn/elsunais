import { apiClient } from '../config/api';

// Deduction interfaces
export interface Deduction {
  id: number;
  activity_id: number;
  amount: number;
  created_by: number;
  date_created: string;
  description: string;
  is_percentage: boolean;
}

export interface CreateDeductionRequest {
  activity_id: number;
  amount: number;
  description: string;
  is_percentage: boolean;
}

export interface UpdateDeductionRequest {
  activity_id?: number;
  amount?: number;
  description?: string;
  is_percentage?: boolean;
}

class DeductionService {
  /**
   * Get all deductions
   */
  async getDeductions(): Promise<Deduction[]> {
    try {
      console.log('Fetching deductions from API...');
      const response = await apiClient.get<Deduction[]>('/deductions');
      console.log('Deductions API response:', response.data);
      return response.data || [];
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to view deductions.');
        } else if (status === 404) {
          throw new Error('Deductions not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to fetch deductions. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch deductions. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Create a new deduction
   */
  async createDeduction(data: CreateDeductionRequest): Promise<Deduction> {
    try {
      console.log('=== DEDUCTION SERVICE CREATE ===');
      console.log('Data received by service:', data);
      console.log('is_percentage value:', data.is_percentage);
      console.log('is_percentage type:', typeof data.is_percentage);
      
      const response = await apiClient.post<Deduction>('/deductions', data);
      console.log('=== API RESPONSE ===');
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      console.log('Response is_percentage:', response.data.is_percentage);
      console.log('Response is_percentage type:', typeof response.data.is_percentage);
      
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid deduction data. Please check your input.');
        } else if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to create deductions.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to create deduction. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create deduction. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Update an existing deduction
   */
  async updateDeduction(id: number, data: UpdateDeductionRequest): Promise<Deduction> {
    try {
      console.log('Updating deduction:', id, data);
      const response = await apiClient.put<Deduction>(`/deductions/${id}`, data);
      console.log('Update deduction response:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid deduction data. Please check your input.');
        } else if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to update deductions.');
        } else if (status === 404) {
          throw new Error('Deduction not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to update deduction. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update deduction. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete a deduction
   */
  async deleteDeduction(id: number): Promise<{ message: string }> {
    try {
      console.log('Deleting deduction:', id);
      const response = await apiClient.delete<{ message: string }>(`/deductions/${id}`);
      console.log('Delete deduction response:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to delete deductions.');
        } else if (status === 404) {
          throw new Error('Deduction not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to delete deduction. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to delete deduction. Please try again.';
      
      throw new Error(errorMessage);
    }
  }
}

export const deductionService = new DeductionService();
export default deductionService;
