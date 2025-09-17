import { apiClient } from '../config/api';

// Activity types
export interface ProcurementMethod {
  method_name: string;
  procurement_notes: string | {
    Beneficiaries?: string;
    Account Number?: string;
    [key: string]: any;
  };
}

export interface Activity {
  id: number;
  title: string;
  duration: number;
  project_id: number;
  expected_start_time: string;
  expected_finish_time: string;
  status: 'in-progress' | 'completed' | 'pending' | 'cancelled';
  procurement_methods: ProcurementMethod[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateActivityRequest {
  title: string;
  duration: number;
  project_id: number;
  expected_start_time: string;
  expected_finish_time: string;
  status: 'in-progress' | 'completed' | 'pending' | 'cancelled';
  procurement_methods: ProcurementMethod[];
}

export interface CreateActivityResponse {
  message: string;
  activity: Activity;
}

export interface ActivityListResponse {
  activities: Activity[];
}

class ActivityService {
  /**
   * Create a new activity
   */
  async createActivity(data: CreateActivityRequest): Promise<CreateActivityResponse> {
    try {
      console.log('API: Creating activity:', data);
      const response = await apiClient.post<CreateActivityResponse>('/activities', data);
      console.log('API: Activity created successfully:', response.data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid activity data. Please check your input.');
        } else if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to create activity. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create activity. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all activities
   */
  async getAllActivities(): Promise<Activity[]> {
    try {
      console.log('API: Fetching all activities...');
      const response = await apiClient.get<Activity[] | ActivityListResponse>('/activities');
      console.log('API: Raw activities response:', response.data);
      
      if (Array.isArray(response.data)) {
        console.log(`API: Found ${response.data.length} activities (direct array)`);
        return response.data;
      } else if (response.data && 'activities' in response.data) {
        console.log(`API: Found ${response.data.activities?.length || 0} activities (wrapped)`);
        return response.data.activities || [];
      } else {
        console.log('API: Unexpected response format for activities');
        return [];
      }
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
          throw new Error(message || 'Failed to fetch activities. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch activities. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get activities by project ID
   */
  async getActivitiesByProject(projectId: number): Promise<Activity[]> {
    try {
      console.log(`API: Fetching activities for project ${projectId}...`);
      const response = await apiClient.get<Activity[] | ActivityListResponse>(`/activities?project_id=${projectId}`);
      console.log(`API: Raw activities response for project ${projectId}:`, response.data);
      
      if (Array.isArray(response.data)) {
        console.log(`API: Found ${response.data.length} activities for project ${projectId} (direct array)`);
        return response.data;
      } else if (response.data && 'activities' in response.data) {
        console.log(`API: Found ${response.data.activities?.length || 0} activities for project ${projectId} (wrapped)`);
        return response.data.activities || [];
      } else {
        console.log(`API: Unexpected response format for project ${projectId} activities`);
        return [];
      }
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
          throw new Error(message || 'Failed to fetch activities. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch activities. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get single activity by ID
   */
  async getActivityById(activityId: number): Promise<Activity> {
    try {
      console.log(`API: Fetching activity ${activityId}...`);
      const response = await apiClient.get<Activity>(`/activities/${activityId}`);
      console.log(`API: Activity ${activityId} fetched:`, response.data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 404) {
          throw new Error('Activity not found.');
        } else if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to fetch activity. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch activity. Please try again.';
      
      throw new Error(errorMessage);
    }
  }
}

export const activityService = new ActivityService();
export default activityService;
