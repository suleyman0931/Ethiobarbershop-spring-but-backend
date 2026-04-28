"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { shopService } from "@/modules/shop/services";
import type { ShopResponse } from "@/modules/shop/types/shop.types";
import { Button } from "@/modules/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/modules/shadcn/ui/card";

import { MapPin, Users, Calendar, ArrowLeft, Settings, Plus } from "lucide-react";

export default function ShopDetailPage() {
  const router = useRouter();
  const params = useParams();
  const shopId = params.shopId as string;

  const {
    data: shop,
    isLoading,
    isError,
  } = useQuery<ShopResponse>({
    queryKey: ["shop", shopId],
    queryFn: () => shopService.getShop(shopId),
    enabled: !!shopId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading shop details...</p>
      </div>
    );
  }

  if (isError || !shop) {
    return (
      <div className="max-w-md mx-auto mt-12 p-8 bg-red-50 rounded-xl text-center border border-red-100">
        <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
        <p className="text-red-600 mb-4">We couldn't load the shop details.</p>
        <Button onClick={() => router.back()} variant="outline">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <button 
        onClick={() => router.back()}
        className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-6 font-medium"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to list
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden mb-8">
        <div className="h-64 bg-blue-600 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">{shop.name}</h1>
              <div className="flex items-center text-white/90">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg">{shop.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 flex flex-wrap gap-4 border-b">
          <Button asChild className="rounded-xl px-6">
            <Link href={`/shops/${shopId}/edit`} className="flex items-center">
              <Settings className="h-4 w-4 mr-2" /> Edit Shop
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl px-6">
            <Link href={`/shops/${shopId}/seats`} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" /> Manage Seats
            </Link>
          </Button>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Users className="h-6 w-6 mr-3 text-blue-600" />
              Available Seats & Barbers
            </h2>

            {shop.seats && shop.seats.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {shop.seats.map((seat) => (
                  <div
                    key={seat.id}
                    className="p-5 border border-gray-100 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-bold text-lg text-gray-900">{seat.seatName}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${seat.barberId ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {seat.barberId ? 'Active' : 'Open'}
                      </span>
                    </div>
                    <p className="text-gray-600 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                      {seat.barberFullName || "No barber assigned yet"}
                    </p>
                    {seat.barberId && (
                      <Button size="sm" className="w-full mt-4 rounded-lg bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                        Book Appointment
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500">No seats have been added to this shop yet.</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="text-blue-900 font-bold text-lg mb-2 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Operating Hours
              </h3>
              <ul className="space-y-2 text-sm text-blue-800/80">
                <li className="flex justify-between"><span>Mon - Fri</span> <span className="font-bold text-blue-900">9:00 - 20:00</span></li>
                <li className="flex justify-between"><span>Sat</span> <span className="font-bold text-blue-900">10:00 - 18:00</span></li>
                <li className="flex justify-between"><span>Sun</span> <span className="font-bold text-blue-900 text-red-500">Closed</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
