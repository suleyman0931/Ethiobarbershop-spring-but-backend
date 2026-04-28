"use client";

import { useQuery } from "@tanstack/react-query";
import { shopService } from "@/modules/shop/services";
import { apiClient } from "@/lib/api";
import { getPendingPayments } from "@/api/payments";
import Link from "next/link";
import { Store, Users, Calendar, TrendingUp, MapPin, Scissors, CreditCard } from "lucide-react";

interface DashboardStats {
  totalBranches: number;
  totalBarbers: number;
  totalAppointments: number;
  activeBarbers: number;
}

export default function OwnerDashboardPage() {
  const { data: branches, isLoading: branchesLoading } = useQuery({
    queryKey: ["ownedShops"],
    queryFn: () => shopService.getShopsByOwner(),
  });

  const { data: barbers, isLoading: barbersLoading } = useQuery({
    queryKey: ["allBarbers"],
    queryFn: () => apiClient.get<any[]>("/barbers"),
  });

  const { data: pendingPayments } = useQuery({
    queryKey: ["payments", "pending"],
    queryFn: getPendingPayments,
  });

  const stats: DashboardStats = {
    totalBranches: branches?.length || 0,
    totalBarbers: barbers?.length || 0,
    totalAppointments: 0, // TODO: Implement appointments count
    activeBarbers: barbers?.length || 0,
  };

  if (branchesLoading || barbersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Owner Dashboard</h1>
          <p className="text-slate-600">Manage your barbershop branches and team</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-black text-slate-900">{stats.totalBranches}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Total Branches</h3>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-black text-slate-900">{stats.totalBarbers}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Total Barbers</h3>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-black text-slate-900">{stats.totalAppointments}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Appointments</h3>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-2xl font-black text-slate-900">{stats.activeBarbers}</span>
            </div>
            <h3 className="text-sm font-medium text-slate-600">Active Barbers</h3>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Branches Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Branches</h2>
              <Link
                href="/owners/branches/create"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                + Add Branch
              </Link>
            </div>

            {branches && branches.length > 0 ? (
              <div className="space-y-3">
                {branches.map((branch) => (
                  <Link
                    key={branch.id}
                    href={`/owners/branches/${branch.id}`}
                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {branch.name}
                        </h3>
                        <p className="text-sm text-slate-500">{branch.address}</p>
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-blue-600 transition-colors">→</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 mb-4">No branches yet</p>
                <Link
                  href="/owners/branches/create"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Create your first branch
                </Link>
              </div>
            )}

            <Link
              href="/owners/branches"
              className="block text-center text-blue-600 font-semibold hover:underline mt-4"
            >
              View All Branches
            </Link>
          </div>

          {/* Barbers Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Barbers</h2>
              <Link
                href="/owners/barbers/create"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
              >
                + Add Barber
              </Link>
            </div>

            {barbers && barbers.length > 0 ? (
              <div className="space-y-3">
                {barbers.slice(0, 3).map((barber) => (
                  <Link
                    key={barber.barberId}
                    href={`/owners/barbers/${barber.barberId}`}
                    className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-bold">
                        {barber.firstName[0]}{barber.lastName[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-green-600 transition-colors">
                          {barber.firstName} {barber.lastName}
                        </h3>
                        <p className="text-sm text-slate-500">{barber.experienceYears} years exp.</p>
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-green-600 transition-colors">→</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Scissors className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 mb-4">No barbers yet</p>
                <Link
                  href="/owners/barbers/create"
                  className="text-green-600 font-semibold hover:underline"
                >
                  Register your first barber
                </Link>
              </div>
            )}

            <Link
              href="/owners/barbers"
              className="block text-center text-green-600 font-semibold hover:underline mt-4"
            >
              View All Barbers
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/owners/branches"
              className="flex flex-col items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
            >
              <Store className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-semibold text-slate-900">Manage Branches</span>
            </Link>

            <Link
              href="/owners/barbers"
              className="flex flex-col items-center justify-center p-6 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
            >
              <Users className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-semibold text-slate-900">Manage Barbers</span>
            </Link>

            <Link
              href="/owners/profile/edit"
              className="flex flex-col items-center justify-center p-6 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group"
            >
              <Users className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-semibold text-slate-900">My Profile</span>
            </Link>

            <Link
              href="/owners/payments"
              className="flex flex-col items-center justify-center p-6 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors group relative"
            >
              <CreditCard className="w-8 h-8 text-orange-600 mb-2" />
              <span className="text-sm font-semibold text-slate-900">Verify Payments</span>
              {pendingPayments && pendingPayments.length > 0 && (
                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingPayments.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
