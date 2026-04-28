import { apiClient } from "@/lib/api";
import type { AppointmentResponse, AppointmentRequest } from "../types/appointment.types";

export const appointmentService = {
  book: (data: AppointmentRequest) =>
    apiClient.post<AppointmentResponse>("/appointments/book", data),

  getMyAppointments: () =>
    apiClient.get<AppointmentResponse[]>("/appointments/my"),

  confirm: (id: number) =>
    apiClient.post<AppointmentResponse>(`/appointments/${id}/confirm`, {}),

  cancel: (id: number) =>
    apiClient.post<AppointmentResponse>(`/appointments/${id}/cancel`, {}),

  complete: (id: number) =>
    apiClient.post<AppointmentResponse>(`/appointments/${id}/complete`, {}),
};
