import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { submitPayment, getPendingPayments, verifyPayment, rejectPayment } from "@/api/payments";
import type { PaymentSubmissionRequest } from "@/types/payment";

export const useSubmitPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: PaymentSubmissionRequest) => submitPayment(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const usePendingPayments = () => {
  return useQuery({
    queryKey: ["payments", "pending"],
    queryFn: getPendingPayments,
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (paymentId: number) => verifyPayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const useRejectPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (paymentId: number) => rejectPayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};
