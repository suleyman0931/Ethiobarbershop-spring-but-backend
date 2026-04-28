export type AppointmentStatus = 
  | "PENDING_PAYMENT" 
  | "PAYMENT_SUBMITTED" 
  | "CONFIRMED" 
  | "ASSIGNED_TO_BARBER" 
  | "COMPLETED" 
  | "CANCELED" 
  | "PAYMENT_REJECTED";

export interface AppointmentResponse {
  id: number;
  customerProfileId: number;
  customerName: string;
  barberProfileId: number;
  barberName: string;
  shopId: number | null;
  shopName: string | null;
  serviceId: number;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  appointmentTime: string; // ISO datetime from backend LocalDateTime
  status: AppointmentStatus;
}

export interface AppointmentRequest {
  barberProfileId: number;
  shopId?: number;
  serviceId: number;
  desiredTime: string; // ISO datetime
}
