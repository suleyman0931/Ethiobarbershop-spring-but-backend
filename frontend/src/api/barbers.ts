import { apiClient } from "@/lib/api";
import type { BarberResponse } from "@/modules/barber/types/barber.types";

export const getAllBarbers = (): Promise<BarberResponse[]> => {
  return apiClient.get<BarberResponse[]>("/barbers");
};

export const getBarbersByShop = (shopId: number): Promise<BarberResponse[]> => {
  return apiClient.get<BarberResponse[]>(`/barbers/shop/${shopId}`);
};

export const getBarberById = (id: number): Promise<BarberResponse> => {
  return apiClient.get<BarberResponse>(`/barbers/${id}`);
};
