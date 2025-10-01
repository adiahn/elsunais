import { apiClient } from '../config/api';

// Store Item types
export interface StoreItem {
  id?: number;
  name: string;
  description: string;
  item_type: 'consumable' | 'non-consumable';
  quantity: number;
  created_by_id?: number;
  date_created?: string;
  date_updated?: string;
  store_id?: number;
}

export interface CreateStoreItemRequest {
  name: string;
  description: string;
  item_type: 'consumable' | 'non-consumable';
  quantity: number;
}

export interface UpdateStoreItemRequest {
  name?: string;
  description?: string;
  item_type?: 'consumable' | 'non-consumable';
  quantity?: number;
}

export interface CreateStoreItemResponse {
  id: number;
  item_type: 'consumable' | 'non-consumable';
  message: string;
  name: string;
  quantity: number;
  store_id: number;
}

export interface StoreItemsResponse {
  items: StoreItem[];
}

// Store Request types
export interface StoreRequest {
  id?: number;
  item_id: number;
  quantity: number;
  status?: 'pending' | 'approved' | 'rejected' | 'issued' | 'returned';
  requested_by?: string;
  requested_date?: string;
  approved_by?: string;
  approved_date?: string;
  issued_by?: string;
  issued_date?: string;
  returned_date?: string;
  notes?: string;
}

export interface CreateStoreRequestRequest {
  item_id: number;
  quantity: number;
}

export interface CreateStoreRequestResponse {
  message: string;
  request_id?: number;
}

export interface StoreRequestsResponse {
  requests: StoreRequest[];
}

class StoreService {
  // Store Items Management
  /**
   * Create a new store item
   */
  async createItem(data: CreateStoreItemRequest): Promise<CreateStoreItemResponse> {
    try {
      console.log('Creating store item:', data);
      const response = await apiClient.post<CreateStoreItemResponse>('/store/1/items', data);
      console.log('Create item response:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid item data. Please check your input.');
        } else if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to create item. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create item. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all store items
   */
  async getItems(): Promise<StoreItem[]> {
    try {
      console.log('Fetching store items...');
      const response = await apiClient.get<StoreItem[]>('/items');
      console.log('Store items response:', response.data);
      return response.data || [];
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 422) {
          throw new Error(message || 'Invalid request format. Please check the API documentation.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to fetch items. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch items. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Update a store item
   */
  async updateItem(itemId: number, data: UpdateStoreItemRequest): Promise<StoreItem> {
    try {
      console.log('Updating store item:', itemId, data);
      const response = await apiClient.put<StoreItem>(`/store/items/${itemId}`, data);
      console.log('Update item response:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid item data. Please check your input.');
        } else if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 404) {
          throw new Error('Item not found.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to update item. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update item. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete a store item
   */
  async deleteItem(itemId: number): Promise<void> {
    try {
      await apiClient.delete(`/store/items/${itemId}`);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 404) {
          throw new Error('Item not found.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to delete item. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to delete item. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  // Store Requests Management
  /**
   * Create a new store request
   */
  async createRequest(data: CreateStoreRequestRequest): Promise<CreateStoreRequestResponse> {
    try {
      const response = await apiClient.post<CreateStoreRequestResponse>('/store/requests', data);
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
          throw new Error(message || 'Failed to create request. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create request. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Issue an approved request
   */
  async issueRequest(requestId: number): Promise<{ message: string }> {
    try {
      console.log('Issuing request:', requestId);
      const response = await apiClient.put<{ message: string }>(`/store/requests/${requestId}/issue`);
      console.log('Issue request response:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid issue data. Please check your input.');
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
          throw new Error(message || 'Failed to issue request. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to issue request. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Return a non-consumable item
   */
  async returnItem(requestId: number, notes?: string): Promise<{ message: string }> {
    try {
      console.log('Returning item:', requestId, notes);
      const response = await apiClient.put<{ message: string }>(`/store/requests/${requestId}/return`, {
        notes: notes || ''
      });
      console.log('Return item response:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid return data. Please check your input.');
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
          throw new Error(message || 'Failed to return item. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to return item. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all store requests
   */
  async getRequests(): Promise<StoreRequest[]> {
    try {
      console.log('Fetching store requests...');
      const response = await apiClient.get<StoreRequest[]>('/store_requests');
      console.log('Store requests response:', response.data);
      return response.data || [];
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 405) {
          throw new Error('Method not allowed. This endpoint may not support GET requests.');
        } else if (status === 422) {
          throw new Error(message || 'Invalid request format. Please check the API documentation.');
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
   * Approve a store request
   */
  async approveRequest(requestId: number): Promise<StoreRequest> {
    try {
      const response = await apiClient.put<StoreRequest>(`/store/requests/${requestId}/approve`);
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
   * Reject a store request
   */
  async rejectRequest(requestId: number): Promise<StoreRequest> {
    try {
      const response = await apiClient.put<StoreRequest>(`/store/requests/${requestId}/reject`);
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
   * Issue a store request (hand over item)
   */
  async issueRequest(requestId: number): Promise<StoreRequest> {
    try {
      const response = await apiClient.put<StoreRequest>(`/store/requests/${requestId}/issue`);
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
          throw new Error(message || 'Failed to issue request. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to issue request. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Return a store request
   */
  async returnRequest(requestId: number): Promise<StoreRequest> {
    try {
      const response = await apiClient.put<StoreRequest>(`/store/requests/${requestId}/return`);
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
          throw new Error(message || 'Failed to return request. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to return request. Please try again.';
      
      throw new Error(errorMessage);
    }
  }
}

export const storeService = new StoreService();
export default storeService;
