import { apiClient } from "@/lib/api";
import type { ServiceResponse } from "@/types/service";

/**
 * API client methods for service management
 */

export const getAllActiveServices = (): Promise<ServiceResponse[]> => {
  return apiClient.get<ServiceResponse[]>("/services/active");
};

export const getAllServices = (): Promise<ServiceResponse[]> => {
  return apiClient.get<ServiceResponse[]>("/services");
};

export const createService = (data: Omit<ServiceResponse, "id">): Promise<ServiceResponse> => {
  return apiClient.post<ServiceResponse>("/services", data);
};

export const updateService = (id: number, data: Partial<ServiceResponse>): Promise<ServiceResponse> => {
  return apiClient.put<ServiceResponse>(`/services/${id}`, data);
};

export const deleteService = (id: number): Promise<void> => {
  return apiClient.delete<void>(`/services/${id}`);
};
