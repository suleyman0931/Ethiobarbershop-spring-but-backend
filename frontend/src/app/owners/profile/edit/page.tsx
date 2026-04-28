"use client";
// app/owners/profile/edit/page.tx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ownerSchema,
  type OwnerPayload,
} from "@/modules/owner/types/owner.types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ownerService } from "@/modules/owner/services";
import { Button } from "@/modules/shadcn/ui/button";

export default function EditOwnerProfilePage() {
  const router = useRouter();
  const {
    data: existingProfile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["owner-profile"],
    queryFn: () => ownerService.getOwnerProfile(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OwnerPayload>({ resolver: zodResolver(ownerSchema) });

  useEffect(() => {
    if (existingProfile && !isLoading) {
      reset({
        firstName: existingProfile.firstName,
        lastName: existingProfile.lastName,
        phoneNumber: existingProfile.phoneNumber,
      });
    }
  }, [existingProfile, isLoading, reset]);

  const onSubmit = async (data: OwnerPayload) => {
    try {
      await ownerService.updateOwnerProfile(data);
      router.push("/owners/my-shops");
    } catch (error) {
      console.error("Update Owner Profile error:", error);
    }
  };

  if (isLoading) return <div>Loading existing profile...</div>;
  if (isError) return <div>Failed to load profile. Please try again.</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 relative overflow-hidden">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-lg w-full z-10 animate-in-fade">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Edit Profile</h1>
          <p className="mt-2 text-slate-500">Update your owner profile details</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">First Name</label>
                <input
                  {...register("firstName")}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                  placeholder="Jane"
                />
                {errors.firstName && (
                  <span className="text-red-500 text-sm">{errors.firstName.message}</span>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Last Name</label>
                <input
                  {...register("lastName")}
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                  placeholder="Smith"
                />
                {errors.lastName && (
                  <span className="text-red-500 text-sm">{errors.lastName.message}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Phone Number</label>
              <input
                {...register("phoneNumber")}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                placeholder="(555) 987-6543"
              />
              {errors.phoneNumber && (
                <span className="text-red-500 text-sm">{errors.phoneNumber.message}</span>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-3 px-4 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
