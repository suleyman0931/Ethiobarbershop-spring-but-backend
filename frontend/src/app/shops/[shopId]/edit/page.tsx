"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/modules/shadcn/ui/button";

import {
  shopSchema,
  type ShopPayload,
  ShopResponse,
} from "@/modules/shop/types/shop.types";
import { shopService } from "@/modules/shop/services";

export default function EditShopPage() {
  const router = useRouter();
  const params = useParams();
  const shopId = params.shopId as string;

  // Form for editing shop details
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ShopPayload>({
    resolver: zodResolver(shopSchema),
  });

  // Fetch shop details on mount
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const existingShop: ShopResponse = await shopService.getShop(shopId);
        reset({
          name: existingShop.name,
          address: existingShop.address,
        });
      } catch (error) {
        console.error("Failed to load shop:", error);
        router.push("/shops");
      }
    };

    if (shopId) fetchShop();
  }, [shopId, reset, router]);

  // Handler for updating shop details
  const onSubmitShop = async (payload: ShopPayload) => {
    try {
      const updatedShop = await shopService.updateShop(shopId, payload);
      router.push(`/shops/${updatedShop.id}`);
    } catch (error) {
      console.error("Update shop error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Edit Shop</h1>
            <p className="text-slate-500 mt-1">Update your shop details</p>
          </div>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href={`/shops/${shopId}`}>← Back to Shop</Link>
          </Button>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmitShop)} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Shop Name</label>
              <input
                {...register("name")}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="Enter shop name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Address</label>
              <input
                {...register("address")}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="Enter address"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full premium-gradient py-3 px-4 rounded-xl font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
