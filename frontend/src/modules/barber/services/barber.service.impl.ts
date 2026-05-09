import { apiClient } from "../../../lib/api";
import { BarberService } from "./barber.service";
import { BarberPayload, BarberResponse } from "../types/barber.types";

export class BarberServiceImpl implements BarberService {
  async listBarbers(): Promise<BarberResponse[]> {
    return apiClient.get<BarberResponse[]>("/barbers");
  }

  async getBarber(id: string): Promise<BarberResponse> {
    return apiClient.get<BarberResponse>(`/barbers/${id}`);
  }

  async createBarber(payload: BarberPayload): Promise<BarberResponse> {
    return apiClient.post<BarberResponse>("/owners/register-barber", payload);
  }

  async updateBarber(id: string, payload: Partial<BarberPayload>): Promise<BarberResponse> {
    return apiClient.put<BarberResponse>(`/barbers/${id}`, payload);
  }

  async deleteBarber(id: string): Promise<void> {
    return apiClient.delete<void>(`/barbers/${id}`);
  }

  // Barber managing their own profile
  async getBarberProfile(): Promise<BarberResponse> {
    return apiClient.get<BarberResponse>("/barbers/me");
  }

  async createBarberProfile(payload: Partial<BarberPayload>): Promise<BarberResponse> {
    return apiClient.post<BarberResponse>("/barbers/me", payload);
  }

  async updateBarberProfile(payload: Partial<BarberPayload>): Promise<BarberResponse> {
    return apiClient.put<BarberResponse>("/barbers/me", payload);
  }

  async deleteBarberProfile(): Promise<void> {
    return apiClient.delete<void>("/barbers/me");
  }
}
