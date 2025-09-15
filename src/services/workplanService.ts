import { apiClient } from '../config/api';

// Workplan types
export interface Workplan {
  id: number;
  title: string;
  component_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateWorkplanRequest {
  title: string;
  component_id: number;
}

export interface CreateWorkplanResponse {
  message: string;
  workplan: Workplan;
}

export interface WorkplanListResponse {
  workplans: Workplan[];
}

class WorkplanService {
  /**
   * Create a new workplan
   */
  async createWorkplan(data: CreateWorkplanRequest): Promise<CreateWorkplanResponse> {
    try {
      console.log('Attempting to create workplan:', data);
      const response = await apiClient.post<CreateWorkplanResponse>('/workplans', data);
      console.log('Workplan creation response:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('Workplan creation error:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid workplan data. Please check your input.');
        } else if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to create workplan. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create workplan. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all workplans
   */
  async getAllWorkplans(): Promise<Workplan[]> {
    try {
      console.log('Fetching workplans from API...');
      const response = await apiClient.get<Workplan[]>('/workplans');
      console.log('Workplans fetched successfully:', response.data);
      return response.data || [];
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to fetch workplans. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch workplans. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get workplan by ID
   */
  async getWorkplanById(id: number): Promise<Workplan> {
    try {
      const response = await apiClient.get<Workplan>(`/workplans/${id}`);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 404) {
          throw new Error('Workplan not found.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to fetch workplan. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch workplan. Please try again.';
      
      throw new Error(errorMessage);
    }
  }
}

export const workplanService = new WorkplanService();
export default workplanService;

