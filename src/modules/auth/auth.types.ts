export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: 'ADMIN' | 'STAFF';
}

export interface AuthResponse {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'STAFF';
  token: string;
  refreshToken?: string;
}
