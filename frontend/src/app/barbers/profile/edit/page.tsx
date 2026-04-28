"use client";

import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { barberService } from "@/modules/barber/services";
import { Input } from "@/modules/shadcn/ui/input";

interface EditBarberForm {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  skills: string;
  experienceYears: number;
  summary?: string;
}

export default function EditBarberProfilePage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");

  const { data: existingProfile, isLoading, isError } = useQuery({
    queryKey: ["barber-profile"],
    queryFn: () => barberService.getBarberProfile(),
    retry: false, // don't retry on 404 — redirect immediately
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<EditBarberForm>();

  useEffect(() => {
    if (existingProfile) {
      reset({
        firstName: existingProfile.firstName,
        lastName: existingProfile.lastName,
        phoneNumber: existingProfile.phoneNumber,
        skills: existingProfile.skills,
        experienceYears: existingProfile.experienceYears,
        summary: existingProfile.summary ?? "",
      });
    }
  }, [existingProfile, reset]);

  // No profile yet → go to create
  useEffect(() => {
    if (isError) {
      router.replace("/barbers/profile/create");
    }
  }, [isError, router]);

  const onSubmit = async (data: EditBarberForm) => {
    setSubmitError("");
    try {
      await barberService.updateBarberProfile(data);
      router.push("/barbers/dashboard");
    } catch (err: any) {
      setSubmitError(err.message || "Failed to update profile");
    }
  };

  if (isLoading || isError) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600" />
      <p className="mt-4 text-slate-500">Loading profile...</p>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Edit Profile</h1>
        <p className="mt-2 text-slate-500">Update your barber profile details</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">First Name</label>
              <Input {...register("firstName", { required: "Required" })} placeholder="John" />
              {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Last Name</label>
              <Input {...register("lastName", { required: "Required" })} placeholder="Doe" />
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
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
