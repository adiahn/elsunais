// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  role: string;
  token: string;
}

export interface User {
  email: string;
  role: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}
