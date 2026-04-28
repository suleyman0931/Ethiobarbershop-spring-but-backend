import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveAppointment, completeAppointment, cancelAppointment } from "@/api/appointments";
import type { AppointmentResponse } from "@/modules/appointment/types/appointment.types";

/**
 * React Query mutation hooks for appointment management
 * Implements Requirements 1.1, 2.1, 3.1 from appointment-management-rating spec
 */

/**
 * Hook for approving a pending appointment
 * Transitions appointment status from PENDING to CONFIRMED
 * Validates: Requirements 1.1
 */
export const useApproveAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation<AppointmentResponse, Error, number>({
    mutationFn: (appointmentId: number) => approveAppointment(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

/**
 * Hook for completing a confirmed appointment
 * Transitions appointment status from CONFIRMED to COMPLETED
 * Validates: Requirements 2.1
 */
export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation<AppointmentResponse, Error, number>({
    mutationFn: (appointmentId: number) => completeAppointment(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

/**
 * Hook for canceling an appointment
 * Transitions appointment status from PENDING or CONFIRMED to CANCELED
 * Validates: Requirements 3.1
 */
export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation<AppointmentResponse, Error, number>({
    mutationFn: (appointmentId: number) => cancelAppointment(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};
