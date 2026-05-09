"use client";

import { useQuery, useMutation, useQueryClient } from "@tantml:react-query";
import { useState } from "react";
import Link from "next/link";
import { appointmentService } from "@/modules/appointment/services/appointment.service";
import type { AppointmentResponse } from "@/modules/appointment/types/appointment.types";
import { CustomerRatingForm } from "@/components/ratings/CustomerRatingForm";
import { Calendar, Clock, Plus, Star, ChevronDown, ChevronUp, CheckCircle, Hash } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  PENDING_PAYMENT:   "bg-yellow-100 text-yellow-800",
  PAYMENT_SUBMITTED: "bg-orange-100 text-orange-800",
  CONFIRMED:         "bg-blue-100 text-blue-800",
  ASSIGNED_TO_BARBER:"bg-purple-100 text-purple-800",
  COMPLETED:         "bg-green-100 text-green-800",
  CANCELED:          "bg-red-100 text-red-800",
  PAYMENT_REJECTED:  "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT:   "Pending Payment",
  PAYMENT_SUBMITTED: "Payment Under Review",
  CONFIRMED:         "Payment Approved",
  ASSIGNED_TO_BARBER:"Assigned to Barber",
  COMPLETED:         "Completed",
  CANCELED:          "Canceled",
  PAYMENT_REJECTED:  "Payment Rejected",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ET", {
    weekday: "short", year: "numeric", month: "short", day: "numeric",
  });
}

function formatTime(iso: string) {
  const date = new Date(iso);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  
  // Convert to 12-hour format
  hours = hours % 12 || 12;
  
  return `${hours}:${String(minutes).padStart(2, "0")} ${period}`;
}

export default function MyAppointmentsPage() {
  const queryClient = useQueryClient();
  const [openRatingForms, setOpenRatingForms] = useState<Set<number>>(new Set());
  const [justRated, setJustRated] = useState<Set<number>>(new Set());

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["my-appointments"],
    queryFn: appointmentService.getMyAppointments,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => appointmentService.cancel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-appointments"] }),
  });

  const hasRating = (appointmentId: number) => justRated.has(appointmentId);

  const toggleRatingForm = (appointmentId: number) => {
    setOpenRatingForms(prev => {
      const next = new Set(prev);
      next.has(appointmentId) ? next.delete(appointmentId) : next.add(appointmentId);
      return next;
    });
  };

  const handleRatingSuccess = (appointmentId: number) => {
    setJustRated(prev => new Set(prev).add(appointmentId));
    setOpenRatingForms(prev => {
      const next = new Set(prev);
      next.delete(appointmentId);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
        <Link href="/appointments/book"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all">
          <Plus className="w-4 h-4" />
          New Booking
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 mb-4">No appointments yet.</p>
          <Link href="/appointments/book"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition-all inline-block">
            Book your first appointment
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appt: AppointmentResponse) => (
            <div key={appt.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              {/* Header with Booking ID and Status */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-mono text-slate-600">
                    Booking #{appt.id.toString().padStart(6, '0')}
                  </span>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[appt.status] ?? "bg-slate-100 text-slate-700"}`}>
                  {STATUS_LABELS[appt.status] ?? appt.status.replace(/_/g, " ")}
                </span>
              </div>

              {/* Payment Approved Badge */}
              {(appt.status === "CONFIRMED" || appt.status === "ASSIGNED_TO_BARBER" || appt.status === "COMPLETED") && (
                <div className="mb-3 flex items-center gap-2 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Payment Approved — Your booking is confirmed!</span>
                </div>
              )}

              {/* Appointment Details */}
              <div>
                <div className="flex items-center gap-2 text-slate-700 mb-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">{formatDate(appt.appointmentTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{formatTime(appt.appointmentTime)}</span>
                </div>
                {appt.serviceName && (
                  <p className="text-xs text-slate-500 mt-1">
                    {appt.serviceName} ({appt.servicePrice} ETB) • {appt.barberName ?? `Barber #${appt.barberProfileId}`}
                  </p>
                )}
              </div>

              {/* Cancel Button */}
              {(appt.status === "PENDING_PAYMENT" || appt.status === "CONFIRMED") && (
                <button
                  onClick={() => cancelMutation.mutate(appt.id)}
                  disabled={cancelMutation.isPending}
                  className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                >
                  Cancel appointment
                </button>
              )}

              {/* Payment Rejected Message */}
              {appt.status === "PAYMENT_REJECTED" && (
                <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  Your payment was rejected. Please contact support or book again.
                </div>
              )}

              {/* Completed — already rated */}
              {appt.status === "COMPLETED" && hasRating(appt.id) && (
                <div className="mt-3 flex items-center gap-2 text-sm text-green-600 font-medium">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  You rated this appointment
                </div>
              )}

              {/* Completed — not yet rated: show optional toggle */}
              {appt.status === "COMPLETED" && !hasRating(appt.id) && (
                <div className="mt-3">
                  <button
                    onClick={() => toggleRatingForm(appt.id)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    <Star className="w-4 h-4" />
                    {openRatingForms.has(appt.id) ? "Hide rating form" : "Rate this appointment (optional)"}
                    {openRatingForms.has(appt.id)
                      ? <ChevronUp className="w-4 h-4" />
                      : <ChevronDown className="w-4 h-4" />
                    }
                  </button>

                  {openRatingForms.has(appt.id) && (
                    <div className="mt-3">
                      <CustomerRatingForm
                        appointmentId={appt.id}
                        barberId={appt.barberProfileId}
                        onSuccess={() => handleRatingSuccess(appt.id)}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
