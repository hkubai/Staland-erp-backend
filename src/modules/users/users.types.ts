export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'ADMIN' | 'STAFF';
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  active?: boolean;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'ADMIN' | 'STAFF';
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
