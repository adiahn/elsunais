import { apiClient } from '../config/api';

// Car interfaces
export interface Car {
  id: number;
  plate_number: string;
  model: string;
  manufacturer: string;
  year: number;
  user_id: number; // the driver
  created_by: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCarRequest {
  plate_number: string;
  model: string;
  manufacturer: string;
  year: number;
  user_id: number; // the driver
  created_by: number;
}

export interface UpdateCarRequest {
  plate_number?: string;
  model?: string;
  manufacturer?: string;
  year?: number;
  user_id?: number;
  created_by?: number;
}

class CarService {
  /**
   * Get all cars
   */
  async getCars(): Promise<Car[]> {
    try {
      console.log('Fetching cars from API...');
      const response = await apiClient.get<Car[]>('/cars');
      console.log('Cars API response:', response.data);
      return response.data || [];
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to view cars.');
        } else if (status === 404) {
          throw new Error('Cars not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to fetch cars. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch cars. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Create a new car
   */
  async createCar(data: CreateCarRequest): Promise<Car> {
    try {
      console.log('=== CAR SERVICE CREATE ===');
      console.log('Data received by service:', data);
      
      const response = await apiClient.post<Car>('/cars', data);
      console.log('=== API RESPONSE ===');
      console.log('Response data:', response.data);
      
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid car data. Please check your input.');
        } else if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to create cars.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to create car. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create car. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Update an existing car
   */
  async updateCar(id: number, data: UpdateCarRequest): Promise<Car> {
    try {
      console.log('Updating car:', id, data);
      const response = await apiClient.put<Car>(`/cars/${id}`, data);
      console.log('Update car response:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid car data. Please check your input.');
        } else if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to update cars.');
        } else if (status === 404) {
          throw new Error('Car not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to update car. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update car. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete a car
   */
  async deleteCar(id: number): Promise<{ message: string }> {
    try {
      console.log('Deleting car:', id);
      const response = await apiClient.delete<{ message: string }>(`/cars/${id}`);
      console.log('Delete car response:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 403) {
          throw new Error('Access denied. You do not have permission to delete cars.');
        } else if (status === 404) {
          throw new Error('Car not found.');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to delete car. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to delete car. Please try again.';
      
      throw new Error(errorMessage);
    }
  }
}

export const carService = new CarService();
export default carService;