"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { apiClient } from "@/lib/api";
import { shopService } from "@/modules/shop/services";
import type { AppointmentResponse } from "@/modules/appointment/types/appointment.types";
import { Calendar, Clock, User, Filter, X } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-800",
  PAYMENT_SUBMITTED: "bg-orange-100 text-orange-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  ASSIGNED_TO_BARBER: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELED: "bg-red-100 text-red-800",
  PAYMENT_REJECTED: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Pending Payment",
  PAYMENT_SUBMITTED: "Payment Submitted",
  CONFIRMED: "Confirmed",
  ASSIGNED_TO_BARBER: "Assigned to Barber",
  COMPLETED: "Completed",
  CANCELED: "Canceled",
  PAYMENT_REJECTED: "Payment Rejected",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-ET", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(iso: string) {
  const date = new Date(iso);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${String(minutes).padStart(2, "0")} ${period}`;
}

export default function OwnerAppointmentsPage() {
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Fetch branches
  const { data: branches = [] } = useQuery({
    queryKey: ["ownedShops"],
    queryFn: () => shopService.getShopsByOwner(),
  });

  // Fetch all barbers
  const { data: allBarbers = [] } = useQuery({
    queryKey: ["allBarbers"],
    queryFn: () => apiClient.get<any[]>("/barbers"),
  });

  // Fetch appointments for selected branch
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["branchAppointments", selectedBranch],
    queryFn: () =>
      selectedBranch
        ? apiClient.get<AppointmentResponse[]>(`/appointments/shop/${selectedBranch}`)
        : Promise.resolve([]),
    enabled: !!selectedBranch,
  });

  // Filter appointments
  const filteredAppointments = appointments.filter((appt) => {
    if (selectedBarber && appt.barberProfileId !== selectedBarber) return false;
    if (selectedStatus && appt.status !== selectedStatus) return false;
    return true;
  });

  const clearFilters = () => {
    setSelectedBranch(null);
    setSelectedBarber(null);
    setSelectedStatus(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">All Appointments</h1>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-slate-600" />
          <h2 className="font-semibold text-slate-900">Filters</h2>
          {(selectedBranch || selectedBarber || selectedStatus) && (
            <button
              onClick={clearFilters}
              className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Branch Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Branch</label>
            <select
              value={selectedBranch || ""}
              onChange={(e) => setSelectedBranch(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Barber Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Barber</label>
            <select
              value={selectedBarber || ""}
              onChange={(e) => setSelectedBarber(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={!selectedBranch}
            >
              <option value="">All Barbers</option>
              {allBarbers.map((barber) => (
                <option key={barber.barberId} value={barber.barberId}>
                  {barber.firstName} {barber.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <select
              value={selectedStatus || ""}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Statuses</option>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      {!selectedBranch ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg mb-2">Select a branch to view appointments</p>
          <p className="text-slate-500 text-sm">Use the filter above to choose a branch</p>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse h-32" />
          ))}
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">No appointments found</p>
          <p className="text-slate-500 text-sm mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600">
              Showing {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? "s" : ""}
            </p>
          </div>

          {filteredAppointments.map((appt) => (
            <div key={appt.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {appt.customerName || `Customer #${appt.customerProfileId}`}
                    </h3>
                    <p className="text-sm text-slate-500">
                      with {appt.barberName || `Barber #${appt.barberProfileId}`}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    STATUS_STYLES[appt.status] ?? "bg-slate-100 text-slate-700"
                  }`}
                >
                  {STATUS_LABELS[appt.status] ?? appt.status.replace(/_/g, " ")}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(appt.appointmentTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(appt.appointmentTime)}</span>
                </div>
                {appt.serviceName && (
                  <div className="text-slate-600">
                    <span className="font-medium">{appt.serviceName}</span>
                  </div>
                )}
                {appt.servicePrice && (
                  <div className="text-slate-600">
                    <span className="font-medium">{appt.servicePrice} ETB</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
