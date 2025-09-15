import { apiClient } from '../config/api';

// Sub-Component types
export interface SubComponent {
  id: number;
  title: string;
  component_id: number;
}

export interface CreateSubComponentRequest {
  title: string;
  component_id: number;
}

export interface CreateSubComponentResponse {
  message: string;
  sub_component: SubComponent;
}

class SubComponentService {
  /**
   * Get sub-components by component ID
   */
  async getSubComponentsByComponent(componentId: number): Promise<SubComponent[]> {
    try {
      const response = await apiClient.get<SubComponent[]>(`/sub_component?component_id=${componentId}`);
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
          throw new Error(message || 'Failed to fetch sub-components. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch sub-components. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all sub-components
   */
  async getAllSubComponents(): Promise<SubComponent[]> {
    try {
      const response = await apiClient.get<SubComponent[]>('/sub_component');
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
          throw new Error(message || 'Failed to fetch sub-components. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch sub-components. Please try again.';
      
      throw new Error(errorMessage);
    }
  }
}

export const subComponentService = new SubComponentService();
export default subComponentService;
