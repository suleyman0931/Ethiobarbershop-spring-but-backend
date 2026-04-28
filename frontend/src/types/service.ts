export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  active: boolean;
}

export interface ServiceResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  active: boolean;
}
