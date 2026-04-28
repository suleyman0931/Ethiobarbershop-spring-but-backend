"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { barberService } from "@/modules/barber/services";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Scissors, Mail, Phone, Award, Edit, Trash2, MapPin } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { RatingDisplay } from "@/components/ratings/RatingDisplay";

export default function BarberDetailPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const barberId = params.id as string;

  const { data: barber, isLoading } = useQuery({
    queryKey: ["barber", barberId],
    queryFn: () => barberService.getBarber(barberId),
  });

  const deleteMutation = useMutation({
    mutationFn: () => barberService.deleteBarber(barberId),
    onSuccess: () => {
      toast.success("Barber deleted successfully!");
      router.push("/owners/barbers");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete barber");
    },
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this barber? This action cannot be undone.")) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading barber details...</p>
        </div>
      </div>
    );
  }

  if (!barber) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Barber not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/owners/barbers"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Barbers
          </Link>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {barber.firstName[0]}{barber.lastName[0]}
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900">
                  {barber.firstName} {barber.lastName}
                </h1>
                <div className="flex items-center gap-2 text-slate-600 mt-1">
                  <Award className="w-4 h-4" />
                  <p>{barber.experienceYears} years of experience</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/owners/barbers/${barberId}/edit`}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Email</p>
                <p className="text-slate-900">{barber.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Phone</p>
                <p className="text-slate-900">{barber.phoneNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Branch</p>
                <p className="text-slate-900">
                  {barber.shopName ?? <span className="text-slate-400 italic">Not assigned to a branch</span>}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Experience */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Skills & Experience</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-2">Skills</p>
              <p className="text-slate-900 leading-relaxed">{barber.skills}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-2">Years of Experience</p>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-green-600" />
                <p className="text-slate-900 font-semibold">{barber.experienceYears} years</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ratings Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Customer Ratings</h2>
          <RatingDisplay barberId={Number(barberId)} />
        </div>

        {/* Appointment History Section (Placeholder) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Appointment History</h2>
          <p className="text-slate-500 italic">No appointment history available</p>
        </div>
      </div>
    </div>
  );
}
