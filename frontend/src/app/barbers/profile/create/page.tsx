"use client";

import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { barberService } from "@/modules/barber/services";
import { Input } from "@/modules/shadcn/ui/input";

interface BarberProfileForm {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  skills: string;
  experienceYears: number;
  summary?: string;
}

export default function CreateBarberProfilePage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");

  // Check if a profile already exists (even with empty fields)
  const { data: existingProfile, isLoading: checkingProfile } = useQuery({
    queryKey: ["barber-profile"],
    queryFn: () => barberService.getBarberProfile(),
    retry: false,
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<BarberProfileForm>();

  // Pre-fill form if profile exists but has empty fields
  useEffect(() => {
    if (existingProfile) {
      reset({
        firstName: existingProfile.firstName ?? "",
        lastName: existingProfile.lastName ?? "",
        phoneNumber: existingProfile.phoneNumber ?? "",
        skills: existingProfile.skills ?? "",
        experienceYears: existingProfile.experienceYears ?? 0,
        summary: existingProfile.summary ?? "",
      });
    }
  }, [existingProfile, reset]);

  const onSubmit = async (data: BarberProfileForm) => {
    setSubmitError("");
    try {
      if (existingProfile) {
        // Profile exists (even with nulls) — update it
        await barberService.updateBarberProfile(data);
      } else {
        // No profile at all — create it
        await barberService.createBarberProfile(data);
      }
      router.push("/barbers/dashboard");
    } catch (err: any) {
      setSubmitError(err.message || "Failed to save profile");
    }
  };

  if (checkingProfile) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      <p className="mt-4 text-slate-500">Loading...</p>
    </div>
  );

  const isUpdate = !!existingProfile;

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">
          {isUpdate ? "Complete Your Profile" : "Create Barber Profile"}
        </h1>
        <p className="mt-2 text-slate-500">
          {isUpdate
            ? "Fill in your details to complete your profile"
            : "Set up your professional profile to start getting booked"}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">First Name</label>
              <Input {...register("firstName", { required: "Required" })} placeholder="Ahmed" />
              {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Last Name</label>
              <Input {...register("lastName", { required: "Required" })} placeholder="Hassan" />
              {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Phone Number</label>
            <Input {...register("phoneNumber", { required: "Required" })} placeholder="+251 9XX XXX XXX" />
            {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Skills</label>
            <Input {...register("skills", { required: "Required" })} placeholder="Fade, Beard trim, Classic cut..." />
            {errors.skills && <p className="text-xs text-red-500">{errors.skills.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Years of Experience</label>
            <Input
              type="number"
              min={0}
              {...register("experienceYears", { required: "Required", valueAsNumber: true })}
              placeholder="3"
            />
            {errors.experienceYears && <p className="text-xs text-red-500">{errors.experienceYears.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Summary <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              {...register("summary")}
              rows={3}
              placeholder="Brief description about yourself..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none"
            />
          </div>

          {submitError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all"
          >
            {isSubmitting ? "Saving..." : isUpdate ? "Save Profile" : "Create Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
