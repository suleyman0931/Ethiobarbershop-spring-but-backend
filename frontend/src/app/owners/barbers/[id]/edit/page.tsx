"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { barberService } from "@/modules/barber/services";
import { barberSchema, BarberPayload } from "@/modules/barber/types/barber.types";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Scissors } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { z } from "zod";

// Schema without password for editing
const editBarberSchema = barberSchema.omit({ password: true });
type EditBarberPayload = z.infer<typeof editBarberSchema>;

export default function EditBarberPage() {
  const router = useRouter();
  const params = useParams();
  const barberId = params.id as string;

  const { data: barber, isLoading } = useQuery({
    queryKey: ["barber", barberId],
    queryFn: () => barberService.getBarber(barberId),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditBarberPayload>({
    resolver: zodResolver(editBarberSchema),
  });

  useEffect(() => {
    if (barber) {
      reset({
        username: barber.email.split("@")[0], // Derive username from email if not available
        email: barber.email,
        firstName: barber.firstName,
        lastName: barber.lastName,
        phoneNumber: barber.phoneNumber,
        skills: barber.skills,
        experienceYears: barber.experienceYears,
      });
    }
  }, [barber, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: EditBarberPayload) => barberService.updateBarber(barberId, data),
    onSuccess: () => {
      toast.success("Barber updated successfully!");
      router.push(`/owners/barbers/${barberId}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update barber");
    },
  });

  const onSubmit = (data: EditBarberPayload) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading barber...</p>
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
            href={`/owners/barbers/${barberId}`}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Barber Details
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <Scissors className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Edit Barber</h1>
              <p className="text-slate-600">Update barber information</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                {...register("username")}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="johndoe"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* First Name Field */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-2">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                {...register("firstName")}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            {/* Last Name Field */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-2">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                {...register("lastName")}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>

            {/* Phone Number Field */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="tel"
                {...register("phoneNumber")}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
              )}
            </div>

            {/* Skills Field */}
            <div>
              <label htmlFor="skills" className="block text-sm font-semibold text-slate-700 mb-2">
                Skills
              </label>
              <textarea
                id="skills"
                {...register("skills")}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Haircuts, beard trimming, styling..."
              />
              {errors.skills && (
                <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>
              )}
            </div>

            {/* Experience Years Field */}
            <div>
              <label htmlFor="experienceYears" className="block text-sm font-semibold text-slate-700 mb-2">
                Years of Experience
              </label>
              <input
                id="experienceYears"
                type="number"
                {...register("experienceYears", { valueAsNumber: true })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="5"
                min="0"
              />
              {errors.experienceYears && (
                <p className="mt-1 text-sm text-red-600">{errors.experienceYears.message}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href={`/owners/barbers/${barberId}`}
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
