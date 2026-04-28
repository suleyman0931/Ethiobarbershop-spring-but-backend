import { apiClient } from "@/lib/api";
import type { PaymentResponse, PaymentSubmissionRequest } from "@/types/payment";

/**
 * API client methods for payment management
 */

export const submitPayment = async (request: PaymentSubmissionRequest): Promise<PaymentResponse> => {
  try {
    return await apiClient.post<PaymentResponse>("/payments/submit", request);
  } catch (error: any) {
    console.error('Payment submission failed:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

export const getPendingPayments = (): Promise<PaymentResponse[]> => {
  return apiClient.get<PaymentResponse[]>("/payments/pending");
};

export const verifyPayment = (paymentId: number): Promise<PaymentResponse> => {
  return apiClient.put<PaymentResponse>(`/payments/${paymentId}/verify`, {});
};

export const rejectPayment = (paymentId: number): Promise<PaymentResponse> => {
  return apiClient.put<PaymentResponse>(`/payments/${paymentId}/reject`, {});
};
