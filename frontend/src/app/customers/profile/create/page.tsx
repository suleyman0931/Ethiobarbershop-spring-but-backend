"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { customerService } from "@/modules/customer/services";
import type { CustomerPayload } from "@/modules/customer/types/customer.types";

export default function CreateCustomerProfilePage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<CustomerPayload>();

  const onSubmit = async (data: CustomerPayload) => {
    setSubmitError("");
    try {
      await customerService.createCustomerProfile(data);
      router.push("/");
    } catch (err: any) {
      setSubmitError(err.message || "Failed to create profile");
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Complete Your Profile</h1>
        <p className="mt-2 text-slate-500">Just a few details to get you started</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">First Name</label>
              <input
                {...register("firstName", { required: "Required" })}
                placeholder="Abebe"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Last Name</label>
              <input
                {...register("lastName", { required: "Required" })}
                placeholder="Kebede"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Phone Number</label>
            <input
              {...register("phoneNumber", { required: "Required" })}
              placeholder="+251 9XX XXX XXX"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber.message}</p>}
          </div>

          {submitError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all"
          >
            {isSubmitting ? "Creating..." : "Create Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
