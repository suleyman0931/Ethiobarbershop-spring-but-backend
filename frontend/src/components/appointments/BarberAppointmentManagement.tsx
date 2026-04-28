import React from "react";
import { Button } from "@/modules/shadcn/ui/button";
import { Alert, AlertDescription } from "@/modules/shadcn/ui/alert";
import { useApproveAppointment, useCompleteAppointment, useCancelAppointment } from "@/hooks/useAppointments";
import type { AppointmentResponse } from "@/modules/appointment/types/appointment.types";
import { CheckCircle, XCircle, AlertCircle, User, Clock, Scissors } from "lucide-react";

interface BarberAppointmentManagementProps {
  appointment: AppointmentResponse;
  onStatusChange?: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING_PAYMENT:    "bg-yellow-100 text-yellow-800",
  PAYMENT_SUBMITTED:  "bg-orange-100 text-orange-800",
  CONFIRMED:          "bg-blue-100 text-blue-800",
  ASSIGNED_TO_BARBER: "bg-purple-100 text-purple-800",
  COMPLETED:          "bg-green-100 text-green-800",
  CANCELED:           "bg-red-100 text-red-800",
  PAYMENT_REJECTED:   "bg-red-100 text-red-800",
};

export const BarberAppointmentManagement: React.FC<BarberAppointmentManagementProps> = ({
  appointment,
  onStatusChange,
}) => {
  const approveMutation  = useApproveAppointment();
  const completeMutation = useCompleteAppointment();
  const cancelMutation   = useCancelAppointment();

  const handleApprove  = () => approveMutation.mutate(appointment.id,  { onSuccess: onStatusChange });
  const handleComplete = () => completeMutation.mutate(appointment.id, { onSuccess: onStatusChange });
  const handleCancel   = () => cancelMutation.mutate(appointment.id,   { onSuccess: onStatusChange });

  const error = approveMutation.error || completeMutation.error || cancelMutation.error;

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString("en-ET", {
      weekday: "short", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const statusLabel = appointment.status.replace(/_/g, " ");
  const statusStyle = STATUS_STYLES[appointment.status] ?? "bg-slate-100 text-slate-700";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          {/* Customer info */}
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-900">
              {appointment.customerName ?? `Customer #${appointment.customerProfileId}`}
            </span>
          </div>
          {/* Time */}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{formatDateTime(appointment.appointmentTime)}</span>
          </div>
          {/* Service */}
          {appointment.serviceName && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Scissors className="w-4 h-4 text-slate-400" />
              <span>{appointment.serviceName} — {appointment.servicePrice} ETB</span>
            </div>
          )}
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${statusStyle}`}>
          {statusLabel}
        </span>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "An error occurred."}
          </AlertDescription>
        </Alert>
      )}

      {/* Actions — only for CONFIRMED (payment verified, ready to serve) */}
      {appointment.status === "CONFIRMED" && (
        <div className="flex gap-2">
          <Button onClick={handleComplete} disabled={completeMutation.isPending} className="flex-1">
            <CheckCircle className="w-4 h-4 mr-1" />
            {completeMutation.isPending ? "Completing..." : "Mark Complete"}
          </Button>
          <Button onClick={handleCancel} disabled={cancelMutation.isPending} variant="destructive" className="flex-1">
            <XCircle className="w-4 h-4 mr-1" />
            {cancelMutation.isPending ? "Canceling..." : "Cancel"}
          </Button>
        </div>
      )}
    </div>
  );
};
