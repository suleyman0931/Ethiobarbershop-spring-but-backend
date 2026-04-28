"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import Link from "next/link";
import { Scissors, Award, Edit, Plus, MapPin } from "lucide-react";

interface Barber {
  barberId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  skills: string;
  experienceYears: number;
  shopName?: string | null;
}

export default function BarbersPage() {
  const { data: barbers, isLoading } = useQuery<Barber[]>({
    queryKey: ["allBarbers"],
    queryFn: () => apiClient.get<Barber[]>("/barbers"),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading barbers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">Barbers</h1>
            <p className="text-slate-600">Manage your barbershop team</p>
          </div>
          <Link
            href="/owners/barbers/create"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Barber
          </Link>
        </div>

        {/* Barbers Grid */}
        {barbers && barbers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {barbers.map((barber) => (
              <div
                key={barber.barberId}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {barber.firstName[0]}{barber.lastName[0]}
                  </div>
                  <Link
                    href={`/owners/barbers/${barber.barberId}/edit`}
                    className="w-8 h-8 bg-slate-100 hover:bg-green-100 rounded-lg flex items-center justify-center transition-colors group"
                  >
                    <Edit className="w-4 h-4 text-slate-600 group-hover:text-green-600" />
                  </Link>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  {barber.firstName} {barber.lastName}
                </h3>
                
                <p className="text-sm text-slate-500 mb-3">{barber.email}</p>

                {barber.skills && (
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{barber.skills}</p>
                )}

                <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                  <Award className="w-4 h-4" />
                  <span>{barber.experienceYears} years experience</span>
                </div>

                {barber.shopName && (
                  <div className="flex items-center gap-2 text-sm text-blue-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{barber.shopName}</span>
                  </div>
                )}

                <Link
                  href={`/owners/barbers/${barber.barberId}`}
                  className="block text-center bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-2 rounded-lg transition-colors"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <Scissors className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No barbers yet</h3>
            <p className="text-slate-500 mb-6">Register your first barber to get started</p>
            <Link
              href="/owners/barbers/create"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Register Barber
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
