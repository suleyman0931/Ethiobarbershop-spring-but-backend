"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shopService } from "@/modules/shop/services";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Store, MapPin, Edit, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function BranchDetailPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const branchId = params.id as string;

  const { data: branch, isLoading } = useQuery({
    queryKey: ["shop", branchId],
    queryFn: () => shopService.getShop(branchId),
  });

  const deleteMutation = useMutation({
    mutationFn: () => shopService.deleteShop(branchId),
    onSuccess: () => {
      toast.success("Branch deleted successfully!");
      router.push("/owners/branches");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete branch");
    },
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this branch? This action cannot be undone.")) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading branch details...</p>
        </div>
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Branch not found</p>
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
            href="/owners/branches"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Branches
          </Link>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center">
                <Store className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900">{branch.name}</h1>
                <div className="flex items-center gap-2 text-slate-600 mt-1">
                  <MapPin className="w-4 h-4" />
                  <p>{branch.address}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/owners/branches/${branchId}/edit`}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
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

        {/* Branch Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Branch Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Branch Name</p>
              <p className="text-lg text-slate-900">{branch.name}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Address</p>
              <p className="text-lg text-slate-900">{branch.address}</p>
            </div>
          </div>
        </div>

        {/* Seats Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-slate-600" />
            <h2 className="text-xl font-bold text-slate-900">Seats</h2>
          </div>
          {branch.seats && branch.seats.length > 0 ? (
            <div className="space-y-3">
              {branch.seats.map((seat) => (
                <div
                  key={seat.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{seat.seatName}</p>
                    {seat.barberFullName && (
                      <p className="text-sm text-slate-600">Assigned to: {seat.barberFullName}</p>
                    )}
                  </div>
                  {!seat.barberFullName && (
                    <span className="text-sm text-slate-500 italic">Unassigned</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No seats available</p>
          )}
        </div>
      </div>
    </div>
  );
}
