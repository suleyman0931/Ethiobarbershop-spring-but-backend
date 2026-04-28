"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { shopService } from "@/modules/shop/services";
import { shopSchema, ShopPayload } from "@/modules/shop/types/shop.types";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Store } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

export default function EditBranchPage() {
  const router = useRouter();
  const params = useParams();
  const branchId = params.id as string;

  const { data: branch, isLoading } = useQuery({
    queryKey: ["shop", branchId],
    queryFn: () => shopService.getShop(branchId),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ShopPayload>({
    resolver: zodResolver(shopSchema),
  });

  useEffect(() => {
    if (branch) {
      reset({
        name: branch.name,
        address: branch.address,
      });
    }
  }, [branch, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: ShopPayload) => shopService.updateShop(branchId, data),
    onSuccess: () => {
      toast.success("Branch updated successfully!");
      router.push(`/owners/branches/${branchId}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update branch");
    },
  });

  const onSubmit = (data: ShopPayload) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading branch...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/owners/branches/${branchId}`}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Branch Details
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Edit Branch</h1>
              <p className="text-slate-600">Update branch information</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                Branch Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Downtown Barbershop"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Address Field */}
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-2">
                Address
              </label>
              <input
                id="address"
                type="text"
                {...register("address")}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123 Main St, City, State 12345"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href={`/owners/branches/${branchId}`}
              className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
