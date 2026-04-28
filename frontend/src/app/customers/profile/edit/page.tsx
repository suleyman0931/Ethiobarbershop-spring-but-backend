"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  customerSchema,
  type CustomerPayload,
} from "@/modules/customer/types/customer.types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { customerService } from "@/modules/customer/services";
import { Button } from "@/modules/shadcn/ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/modules/shadcn/ui/input";

export default function EditCustomerProfilePage() {
  const router = useRouter();

  const {data: existingProfile,isLoading,isError,} = 
  useQuery({
    queryKey: ["customer-profile"],
    queryFn: () => customerService.getCustomerProfile(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomerPayload>({ resolver: zodResolver(customerSchema) });

  useEffect(() => {
    if (existingProfile && !isLoading) {
      reset({
        firstName: existingProfile.firstName,
        lastName: existingProfile.lastName,
        phoneNumber: existingProfile.phoneNumber ?? "",
        dateOfBirth: existingProfile.dateOfBirth ?? "",
        address: existingProfile.address || {
          specificArea: "",
          kebele: "",
          woreda: "",
          zone: "",
          region: "",
        },
      });
    }
  }, [existingProfile, isLoading, reset]);

  const onSubmit = async (data: CustomerPayload) => {
    try {
      await customerService.updateCustomerProfile(data);
      router.push("/");
    } catch (error) {
      console.error("Update Customer Profile error:", error);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-slate-500 font-medium">Loading profile...</p>
    </div>
  );
  if (isError) return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-red-50 rounded-xl text-center border border-red-100">
      <p className="text-red-600">Failed to load customer profile</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-3xl w-full z-10 animate-in-fade">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Edit Profile</h1>
          <p className="mt-2 text-slate-500">Update your personal details and address</p>
        </div>

        <div className="glass-card rounded-2xl p-8 sm:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-slate-800 border-b pb-3 mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">First Name</Label>
                  <Input {...register("firstName")} className="bg-white/50 border-slate-200 rounded-xl" placeholder="John" />
                  {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Last Name</Label>
                  <Input {...register("lastName")} className="bg-white/50 border-slate-200 rounded-xl" placeholder="Doe" />
                  {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Phone Number</Label>
                  <Input {...register("phoneNumber")} className="bg-white/50 border-slate-200 rounded-xl" placeholder="(555) 123-4567" />
                  {errors.phoneNumber && <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Date of Birth</Label>
                  <Input type="date" {...register("dateOfBirth")} className="bg-white/50 border-slate-200 rounded-xl" />
                  {errors.dateOfBirth && <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth.message}</p>}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-800 border-b pb-3 mb-6">Address Details (Ethiopian Context)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm font-medium text-slate-700">Specific Area / Street</Label>
                  <Input {...register("address.specificArea")} className="bg-white/50 border-slate-200 rounded-xl" placeholder="e.g., Bole Sub-City, near Atlas Hotel" />
                  {errors.address?.specificArea && <p className="text-sm text-red-500 mt-1">{errors.address.specificArea.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Kebele (Neighborhood)</Label>
                  <Input {...register("address.kebele")} className="bg-white/50 border-slate-200 rounded-xl" placeholder="e.g., Kebele 03" />
                  {errors.address?.kebele && <p className="text-sm text-red-500 mt-1">{errors.address.kebele.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Woreda (District)</Label>
                  <Input {...register("address.woreda")} className="bg-white/50 border-slate-200 rounded-xl" placeholder="e.g., Bole" />
                  {errors.address?.woreda && <p className="text-sm text-red-500 mt-1">{errors.address.woreda.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Zone</Label>
                  <Input {...register("address.zone")} className="bg-white/50 border-slate-200 rounded-xl" placeholder="e.g., Addis Ababa Zone" />
                  {errors.address?.zone && <p className="text-sm text-red-500 mt-1">{errors.address.zone.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Region</Label>
                  <Input {...register("address.region")} className="bg-white/50 border-slate-200 rounded-xl" placeholder="e.g., Addis Ababa, Oromia, Amhara" />
                  {errors.address?.region && <p className="text-sm text-red-500 mt-1">{errors.address.region.message}</p>}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg font-bold premium-gradient border-none rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
            >
              Save Changes
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}