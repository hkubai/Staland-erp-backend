export interface CreateProjectRequest {
  clientId: string;
  name: string;
  description?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  parcelSize?: number;
  parcelRef?: string;
  budget?: number;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  parcelSize?: number;
  parcelRef?: string;
  status?: 'PENDING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  startDate?: Date;
  expectedEnd?: Date;
  budget?: number;
}

export interface ProjectResponse {
  id: string;
  clientId: string;
  userId: string;
  name: string;
  description?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  parcelSize?: number;
  parcelRef?: string;
  status: string;
  startDate?: Date;
  expectedEnd?: Date;
  actualEnd?: Date;
  budget?: number;
  spent: number;
  createdAt: Date;
  updatedAt: Date;
}
