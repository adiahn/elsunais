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
  private subComponentsCache: SubComponent[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get all sub-components with caching
   */
  private async getAllSubComponentsCached(): Promise<SubComponent[]> {
    const now = Date.now();
    
    // Return cached data if it's still fresh
    if (this.subComponentsCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      console.log('API: Using cached sub-components');
      return this.subComponentsCache;
    }

    // Fetch fresh data
    console.log('API: Fetching fresh sub-components data...');
    const subComponents = await this.getAllSubComponents();
    this.subComponentsCache = subComponents;
    this.cacheTimestamp = now;
    return subComponents;
  }

  /**
   * Get sub-components by component ID (filters from all sub-components)
   */
  async getSubComponentsByComponent(componentId: number): Promise<SubComponent[]> {
    try {
      console.log(`API: Fetching all sub-components and filtering for component ${componentId}...`);
      const allSubComponents = await this.getAllSubComponentsCached();
      const filteredSubComponents = allSubComponents.filter(sub => sub.component_id === componentId);
      console.log(`API: Found ${filteredSubComponents.length} sub-components for component ${componentId}:`, filteredSubComponents);
      return filteredSubComponents;
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
   * Clear the sub-components cache
   */
  clearCache(): void {
    this.subComponentsCache = null;
    this.cacheTimestamp = 0;
    console.log('API: Sub-components cache cleared');
  }

  /**
   * Create a new sub-component and refresh cache
   */
  async createSubComponent(data: CreateSubComponentRequest): Promise<CreateSubComponentResponse> {
    try {
      console.log('API: Creating sub-component:', data);
      const response = await apiClient.post<CreateSubComponentResponse>('/sub_components', data);
      
      // Clear cache to force refresh on next fetch
      this.clearCache();
      
      console.log('API: Sub-component created successfully:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid sub-component data. Please check your input.');
        } else if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to create sub-component. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create sub-component. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all sub-components
   */
  async getAllSubComponents(): Promise<SubComponent[]> {
    try {
      const response = await apiClient.get<SubComponent[]>('/sub_components');
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
