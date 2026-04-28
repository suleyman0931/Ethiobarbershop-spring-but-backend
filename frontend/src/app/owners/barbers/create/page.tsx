"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ArrowLeft, Scissors } from "lucide-react";
import { PasswordInput } from "@/components/ui/PasswordInput";
import Link from "next/link";

interface RegisterBarberForm {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  skills: string;
  experienceYears: number;
  shopId: number;
}

const inputClass = "w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm";

export default function CreateBarberPage() {
  const router = useRouter();

  const { data: shops = [] } = useQuery({
    queryKey: ["shops"],
    queryFn: () => apiClient.get<any[]>("/shops"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterBarberForm>({ defaultValues: { experienceYears: 0 } });

  const onSubmit = async (data: RegisterBarberForm) => {
    try {
      await apiClient.post("/owners/register-barber", {
        ...data,
        shopId: Number(data.shopId),
      });
      router.push("/owners/barbers");
    } catch (err: any) {
      setError("root", { message: err.message || "Failed to register barber" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/owners/barbers" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Barbers
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <Scissors className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Register Barber</h1>
              <p className="text-slate-600">Add a new barber to your team</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">

          {errors.root && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {errors.root.message}
            </div>
          )}

          {/* Branch — required */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Branch <span className="text-red-500">*</span>
            </label>
            <select
              {...register("shopId", { required: "Please select a branch", valueAsNumber: true })}
              className={inputClass}
            >
              <option value="">Select a branch...</option>
              {shops.map((shop: any) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name} — {shop.address}
                </option>
              ))}
            </select>
            {errors.shopId && <p className="mt-1 text-sm text-red-600">{errors.shopId.message}</p>}
          </div>

          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
              <input {...register("firstName", { required: "Required" })} className={inputClass} placeholder="Ahmed" />
              {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
              <input {...register("lastName", { required: "Required" })} className={inputClass} placeholder="Hassan" />
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
            <input {...register("username", { required: "Required" })} className={inputClass} placeholder="johndoe" />
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input type="email" {...register("email", { required: "Required" })} className={inputClass} placeholder="john@example.com" />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <PasswordInput {...register("password", { required: "Required", minLength: { value: 6, message: "Min 6 characters" } })} className={inputClass} placeholder="••••••••" />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
            <input {...register("phoneNumber", { required: "Required" })} className={inputClass} placeholder="+251 9XX XXX XXX" />
            {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>}
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Skills</label>
            <textarea {...register("skills")} rows={3} className={inputClass} placeholder="Haircuts, beard trimming, styling..." />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Years of Experience</label>
            <input type="number" min={0} {...register("experienceYears", { valueAsNumber: true })} className={inputClass} placeholder="5" />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <button type="submit" disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-3 rounded-lg transition-colors">
              {isSubmitting ? "Registering..." : "Register Barber"}
            </button>
            <Link href="/owners/barbers"
              className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
