import { apiClient } from '../config/api';

// Project types
export interface Project {
  id: number;
  title: string;
  workplan_id: number;
  sub_component_id: number;
  component_id: number;
  created_by_id?: number;
  updated_by_id?: number;
  date_created?: string;
  date_updated?: string;
  project_info: Record<string, any>;
}

export interface CreateProjectRequest {
  title: string;
  workplan_id: number;
  sub_component_id: number;
  component_id: number;
  project_info: Record<string, any>;
}

export interface CreateProjectResponse {
  message: string;
  project: Project;
}

export interface ProjectListResponse {
  projects: Project[];
}

class ProjectService {
  /**
   * Create a new project
   */
  async createProject(data: CreateProjectRequest): Promise<CreateProjectResponse> {
    try {
      const response = await apiClient.post<CreateProjectResponse>('/projects', data);
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message || axiosError.response?.data?.error;
        
        if (status === 400) {
          throw new Error(message || 'Invalid project data. Please check your input.');
        } else if (status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 0 || !status) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(message || 'Failed to create project. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create project. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get projects by workplan ID
   */
  async getProjectsByWorkplan(workplanId: number): Promise<Project[]> {
    try {
      console.log(`API: Fetching projects for workplan ${workplanId}...`);
      const response = await apiClient.get<Project[] | ProjectListResponse>(`/projects?workplan_id=${workplanId}`);
      console.log(`API: Raw response for workplan ${workplanId}:`, response.data);
      
      // Handle both response formats
      if (Array.isArray(response.data)) {
        console.log(`API: Found ${response.data.length} projects (direct array)`);
        return response.data;
      } else if (response.data && 'projects' in response.data) {
        console.log(`API: Found ${response.data.projects?.length || 0} projects (wrapped)`);
        return response.data.projects || [];
      } else {
        console.log(`API: Unexpected response format for workplan ${workplanId}`);
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
          throw new Error(message || 'Failed to fetch projects. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch projects. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get projects by component ID
   */
  async getProjectsByComponent(componentId: number): Promise<Project[]> {
    try {
      const response = await apiClient.get<ProjectListResponse>(`/projects?component_id=${componentId}`);
      return response.data?.projects || [];
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
          throw new Error(message || 'Failed to fetch projects. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch projects. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get projects by sub-component ID
   */
  async getProjectsBySubComponent(subComponentId: number): Promise<Project[]> {
    try {
      const response = await apiClient.get<ProjectListResponse>(`/projects?sub_component_id=${subComponentId}`);
      return response.data?.projects || [];
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
          throw new Error(message || 'Failed to fetch projects. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch projects. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Get all projects
   */
  async getAllProjects(): Promise<Project[]> {
    try {
      const response = await apiClient.get<ProjectListResponse>('/projects');
      return response.data?.projects || [];
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
          throw new Error(message || 'Failed to fetch projects. Please try again.');
        }
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch projects. Please try again.';
      
      throw new Error(errorMessage);
    }
  }
}

export const projectService = new ProjectService();
export default projectService;
