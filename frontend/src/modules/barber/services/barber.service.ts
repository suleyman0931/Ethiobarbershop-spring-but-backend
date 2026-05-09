import type { BarberPayload, BarberResponse } from "../types/barber.types";

export interface BarberService {
  listBarbers(): Promise<BarberResponse[]>;
  getBarber(id: string): Promise<BarberResponse>;
  createBarber(payload: BarberPayload): Promise<BarberResponse>;
  updateBarber(id: string, payload: Partial<BarberPayload>): Promise<BarberResponse>;
  deleteBarber(id: string): Promise<void>;
  
  // Barber managing their own profile
  getBarberProfile(): Promise<BarberResponse>;
  createBarberProfile(payload: Partial<BarberPayload>): Promise<BarberResponse>;
  updateBarberProfile(payload: Partial<BarberPayload>): Promise<BarberResponse>;
}
