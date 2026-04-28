import { apiClient } from "@/lib/api";
import type { AppointmentResponse } from "@/modules/appointment/types/appointment.types";

/**
 * API client methods for appointment management
 * Implements Requirements 1.1, 2.1, 3.1 from appointment-management-rating spec
 */

export const approveAppointment = (appointmentId: number): Promise<AppointmentResponse> => {
  return apiClient.put<AppointmentResponse>(`/appointments/${appointmentId}/approve`, {});
};

export const completeAppointment = (appointmentId: number): Promise<AppointmentResponse> => {
  return apiClient.put<AppointmentResponse>(`/appointments/${appointmentId}/complete`, {});
};

export const cancelAppointment = (appointmentId: number): Promise<AppointmentResponse> => {
  return apiClient.put<AppointmentResponse>(`/appointments/${appointmentId}/cancel`, {});
};

export const getAppointmentsByShop = (shopId: number): Promise<AppointmentResponse[]> => {
  return apiClient.get<AppointmentResponse[]>(`/appointments/shop/${shopId}`);
};
