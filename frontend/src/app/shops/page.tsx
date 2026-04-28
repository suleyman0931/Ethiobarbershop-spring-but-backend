// @/app/shops/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { shopService } from "@/modules/shop/services";
import type { ShopResponse } from "@/modules/shop/types/shop.types";
import { MapPin, Store, ChevronRight } from "lucide-react";

export default function ShopListPage() {
  const {
    data: shops,
    isLoading,
    isError,
  } = useQuery<ShopResponse[]>({
    queryKey: ["shops"],
    queryFn: () => shopService.listShops(),
  });

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600 font-medium">Loading shops...</p>
    </div>
  );

  if (isError || !shops)
    return (
      <div className="max-w-md mx-auto mt-12 p-8 bg-red-50 rounded-xl text-center border border-red-100">
        <h2 className="text-xl font-bold text-red-800 mb-2">Oops!</h2>
        <p className="text-red-600 mb-4">We couldn't load the shop list. Please try again later.</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute top-20 -left-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-40 -right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

      <div className="max-w-6xl mx-auto relative z-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Discover Shops</h1>
          <p className="text-gray-500 mt-2">Find the best barbers near you and book your next cut.</p>
        </div>
        <Link 
          href="/shops/create" 
          className="premium-gradient px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
        >
          Add Your Shop
        </Link>
      </div>

      {shops.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <Store className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No shops found</h3>
          <p className="text-gray-500">Be the first one to register a shop!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <Link key={shop.id} href={`/shops/${shop.id}`} className="group h-full">
              <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                    <h2 className="text-2xl font-bold text-white leading-tight">
                      {shop.name}
                    </h2>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm line-clamp-2">{shop.address}</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/80 px-3 py-1.5 rounded-full">
                      {shop.seats?.length || 0} Seats Available
                    </span>
                    <div className="flex items-center text-indigo-600 font-bold group-hover:translate-x-2 transition-transform">
                      View details <ChevronRight className="h-5 w-5 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
