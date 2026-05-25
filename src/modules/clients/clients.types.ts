export interface CreateClientRequest {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  county?: string;
  kraPin?: string;
  idNumber?: string;
  notes?: string;
}

export interface UpdateClientRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  county?: string;
  kraPin?: string;
  idNumber?: string;
  active?: boolean;
  notes?: string;
}

export interface ClientResponse {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  county?: string;
  kraPin?: string;
  idNumber?: string;
  idCopyUrl?: string;
  kraPin2Url?: string;
  titleDeedsUrl?: string;
  active: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
