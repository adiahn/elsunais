import { apiClient } from '../config/api';

// Workplan types
export interface Workplan {
  id: number;
  title?: string;
  component_id?: number;
  component?: string | {
    id: number;
    name: string;
    title?: string;
    description?: string;
    isActive?: boolean;
  };
  created_by?: string;
  date_created?: string;
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
      console.log('Raw API response:', response);
      console.log('Response data type:', typeof response.data);
      console.log('Response data is array:', Array.isArray(response.data));
      console.log('Workplans fetched successfully:', response.data);
      console.log('First workplan from API:', response.data?.[0]);
      
      // Handle different response structures
      let workplans = response.data;
      if (workplans && typeof workplans === 'object' && !Array.isArray(workplans)) {
        // If response is wrapped in an object, try to extract the array
        if (workplans.workplans && Array.isArray(workplans.workplans)) {
          workplans = workplans.workplans;
          console.log('Extracted workplans from wrapper object:', workplans);
        } else if (workplans.data && Array.isArray(workplans.data)) {
          workplans = workplans.data;
          console.log('Extracted workplans from data property:', workplans);
        }
      }
      
      // Normalize field names if needed (convert camelCase to snake_case)
      if (Array.isArray(workplans)) {
        workplans = workplans.map(workplan => ({
          ...workplan,
          component_id: workplan.component_id || (workplan as any).componentId,
          created_at: workplan.created_at || (workplan as any).createdAt,
          updated_at: workplan.updated_at || (workplan as any).updatedAt
        }));
        console.log('Normalized workplans field names:', workplans);
      }
      
      return workplans || [];
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

