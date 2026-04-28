"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { appointmentService } from "@/modules/appointment/services/appointment.service";
import type { AppointmentResponse } from "@/modules/appointment/types/appointment.types";
import { Calendar, Clock, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { BarberAppointmentManagement } from "@/components/appointments/BarberAppointmentManagement";

type FilterTab = "all" | "pending" | "confirmed" | "completed" | "canceled";

export default function BarberDashboardPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["barber-appointments"],
    queryFn: appointmentService.getMyAppointments,
  });

  const handleStatusChange = () => {
    queryClient.invalidateQueries({ queryKey: ["barber-appointments"] });
  };

  // Filter appointments by status
  const pending = appointments.filter((a: AppointmentResponse) => 
    a.status === "PENDING_PAYMENT" || a.status === "PAYMENT_SUBMITTED"
  );
  const confirmed = appointments.filter((a: AppointmentResponse) => a.status === "CONFIRMED");
  const completed = appointments.filter((a: AppointmentResponse) => a.status === "COMPLETED");
  const canceled  = appointments.filter((a: AppointmentResponse) => 
    a.status === "CANCELED" || a.status === "PAYMENT_REJECTED"
  );

  const filteredAppointments =
    activeTab === "pending" ? pending :
    activeTab === "confirmed" ? confirmed :
    activeTab === "completed" ? completed :
    activeTab === "canceled"  ? canceled  :
    appointments;

  const stats = [
    { label: "Pending", count: pending.length, color: "text-yellow-600",  bg: "bg-yellow-50",  icon: AlertCircle },
    { label: "Confirmed", count: confirmed.length, color: "text-blue-600",  bg: "bg-blue-50",  icon: Clock },
    { label: "Completed", count: completed.length, color: "text-green-600", bg: "bg-green-50", icon: CheckCircle },
    { label: "Canceled",  count: canceled.length,  color: "text-red-600",   bg: "bg-red-50",   icon: XCircle },
  ];

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all",       label: "All",       count: appointments.length },
    { key: "pending",   label: "Pending",   count: pending.length },
    { key: "confirmed", label: "Confirmed", count: confirmed.length },
    { key: "completed", label: "Completed", count: completed.length },
    { key: "canceled",  label: "Canceled",  count: canceled.length },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Schedule</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <s.icon className={`w-6 h-6 ${s.color} mx-auto mb-1`} />
            <p className={`text-3xl font-black ${s.color}`}>{s.count}</p>
            <p className="text-sm text-slate-600 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">
            {activeTab === "all" ? "No appointments yet." : `No ${activeTab} appointments.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map((appt: AppointmentResponse) => (
            <BarberAppointmentManagement
              key={appt.id}
              appointment={appt}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
