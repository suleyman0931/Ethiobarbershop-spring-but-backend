import React from "react";
import { Button } from "@/modules/shadcn/ui/button";
import { Alert, AlertDescription } from "@/modules/shadcn/ui/alert";
import { useApproveAppointment, useCompleteAppointment, useCancelAppointment } from "@/hooks/useAppointments";
import type { AppointmentResponse } from "@/modules/appointment/types/appointment.types";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface BarberAppointmentManagementProps {
  appointment: AppointmentResponse;
  onStatusChange?: () => void;
}

/**
 * BarberAppointmentManagement Component
 * 
 * Displays appointment details and provides status management actions for barbers.
 * Implements Requirements 1.1, 2.1, 3.1 from appointment-management-rating spec.
 * 
 * Features:
 * - Shows appointment details (customer, time, status)
 * - Displays action buttons based on current status:
 *   - PENDING: Approve and Cancel buttons
 *   - CONFIRMED: Complete and Cancel buttons
 *   - COMPLETED/CANCELED: No action buttons
 * - Shows loading state during mutations
 * - Displays error messages on failure
 * - Calls onStatusChange callback on successful mutation
 */
export const BarberAppointmentManagement: React.FC<BarberAppointmentManagementProps> = ({
  appointment,
  onStatusChange,
}) => {
  const approveMutation = useApproveAppointment();
  const completeMutation = useCompleteAppointment();
  const cancelMutation = useCancelAppointment();

  const handleApprove = () => {
    approveMutation.mutate(appointment.id, {
      onSuccess: () => {
        onStatusChange?.();
      },
    });
  };

  const handleComplete = () => {
    completeMutation.mutate(appointment.id, {
      onSuccess: () => {
        onStatusChange?.();
      },
    });
  };

  const handleCancel = () => {
    cancelMutation.mutate(appointment.id, {
      onSuccess: () => {
        onStatusChange?.();
      },
    });
  };

  // Determine which error to display (if any)
  const error = approveMutation.error || completeMutation.error || cancelMutation.error;

  // Format appointment time for display
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
      {/* Appointment Details */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Appointment Details</h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              appointment.status === "PENDING"
                ? "bg-yellow-100 text-yellow-800"
                : appointment.status === "CONFIRMED"
                ? "bg-blue-100 text-blue-800"
                : appointment.status === "COMPLETED"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {appointment.status}
          </span>
        </div>

        <div className="text-sm text-slate-600 space-y-1">
          <p>
            <span className="font-medium">Customer ID:</span> {appointment.customerProfileId}
          </p>
          <p>
            <span className="font-medium">Time:</span> {formatDateTime(appointment.appointmentTime)}
          </p>
          <p>
            <span className="font-medium">Shop ID:</span> {appointment.shopId}
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "An error occurred while updating the appointment."}
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      {appointment.status === "PENDING" && (
        <div className="flex gap-2">
          <Button
            onClick={handleApprove}
            disabled={approveMutation.isPending}
            className="flex-1"
            variant="default"
          >
            <CheckCircle className="w-4 h-4" />
            {approveMutation.isPending ? "Approving..." : "Approve"}
          </Button>
          <Button
            onClick={handleCancel}
            disabled={cancelMutation.isPending}
            variant="destructive"
            className="flex-1"
          >
            <XCircle className="w-4 h-4" />
            {cancelMutation.isPending ? "Canceling..." : "Cancel"}
          </Button>
        </div>
      )}

      {appointment.status === "CONFIRMED" && (
        <div className="flex gap-2">
          <Button
            onClick={handleComplete}
            disabled={completeMutation.isPending}
            className="flex-1"
            variant="default"
          >
            <CheckCircle className="w-4 h-4" />
            {completeMutation.isPending ? "Completing..." : "Complete"}
          </Button>
          <Button
            onClick={handleCancel}
            disabled={cancelMutation.isPending}
            variant="destructive"
            className="flex-1"
          >
            <XCircle className="w-4 h-4" />
            {cancelMutation.isPending ? "Canceling..." : "Cancel"}
          </Button>
        </div>
      )}

      {/* No action buttons for COMPLETED or CANCELED status */}
    </div>
  );
};
