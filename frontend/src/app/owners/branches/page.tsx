"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shopService } from "@/modules/shop/services";
import Link from "next/link";
import { Store, MapPin, Edit, Trash2, Plus } from "lucide-react";
import { useState } from "react";

export default function BranchesPage() {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: branches, isLoading } = useQuery({
    queryKey: ["ownedShops"],
    queryFn: () => shopService.getShopsByOwner(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => shopService.deleteShop(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ownedShops"] });
      setDeletingId(null);
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this branch?")) {
      deleteMutation.mutate(id.toString());
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading branches...</p>
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
            <h1 className="text-4xl font-black text-slate-900 mb-2">Branches</h1>
            <p className="text-slate-600">Manage all your barbershop branches</p>
          </div>
          <Link
            href="/owners/branches/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Branch
          </Link>
        </div>

        {/* Branches Grid */}
        {branches && branches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Store className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/owners/branches/${branch.id}/edit`}
                      className="w-8 h-8 bg-slate-100 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors group"
                    >
                      <Edit className="w-4 h-4 text-slate-600 group-hover:text-blue-600" />
                    </Link>
                    <button
                      onClick={() => handleDelete(branch.id)}
                      disabled={deletingId === branch.id}
                      className="w-8 h-8 bg-slate-100 hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors group disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 text-slate-600 group-hover:text-red-600" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{branch.name}</h3>
                
                <div className="flex items-start gap-2 text-sm text-slate-600 mb-4">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>{branch.address}</p>
                </div>

                <Link
                  href={`/owners/branches/${branch.id}`}
                  className="block text-center bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-2 rounded-lg transition-colors"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <Store className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No branches yet</h3>
            <p className="text-slate-500 mb-6">Create your first branch to get started</p>
            <Link
              href="/owners/branches/create"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Branch
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
