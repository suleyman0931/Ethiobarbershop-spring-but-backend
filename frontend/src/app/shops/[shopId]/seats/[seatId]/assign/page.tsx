// @/app/shops/[shopId]/seats/[seatId]/assign/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { seatService } from "@/modules/seat/services";

type AssignBarberPayload = {
  associationId: number;
};

export default function AssignSeatPage() {
  const params = useParams();
  const router = useRouter();

  const shopId = params.shopId as string;
  const seatId = params.seatId as string;

  const { register, handleSubmit } = useForm<AssignBarberPayload>();

  const onSubmit = async (data: AssignBarberPayload) => {
    try {
      await seatService.assignBarber(shopId, seatId, data.associationId.toString());
      router.push(`/shops/${shopId}`);
    } catch (error) {
      console.error("Assign seat error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 relative overflow-hidden">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-md w-full z-10 animate-in-fade">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Assign Barber</h1>
          <p className="mt-2 text-slate-500">Assign a barber to seat {seatId}</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Barber Association ID</label>
              <input
                type="number"
                {...register("associationId", { valueAsNumber: true })}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                placeholder="Enter association ID"
              />
            </div>

            <button
              type="submit"
              className="w-full premium-gradient py-3 px-4 rounded-xl font-bold text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              Assign Barber
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="w-full py-3 px-4 rounded-xl font-medium text-slate-600 border border-slate-200 hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
