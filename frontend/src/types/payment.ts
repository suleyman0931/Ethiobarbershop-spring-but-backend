export type PaymentMethod = "TELEBIRR" | "CBE_BIRR";
export type PaymentStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface Payment {
  id: number;
  appointmentId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
  screenshotUrl?: string;
  status: PaymentStatus;
  createdAt: string;
  verifiedAt?: string;
  verifiedByOwnerId?: number;
}

export interface PaymentSubmissionRequest {
  appointmentId: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  screenshotUrl?: string;
}

export interface PaymentResponse {
  id: number;
  appointmentId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
  screenshotUrl?: string;
  status: PaymentStatus;
  createdAt: string;
  verifiedAt?: string;
  verifiedByOwnerId?: number;
}
